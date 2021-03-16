// ライブラリ読み込み

import {SearchEntry} from "standard-youtube-music-api/src/dist/Search";
import express from 'express'
import {safeString} from "./Util";
import {BROWSE_DIST, getBrowse} from "standard-youtube-music-api/src/dist/Browse";
import axios from "axios";
import {v4 as uuidv4} from 'uuid'
import {FormatsJSON} from "standard-youtube-music-api/src/dist/JSONCollection";

// const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const youtube = require('standard-youtube-music-api')
const {getSearch} = require("standard-youtube-music-api/src/dist/Search");
const {getSearchData} = require("standard-youtube-music-api/src/dist/Search");
const api = new youtube.YoutubeMusicAPI()
const httpAdapter = require('axios/lib/adapters/http');

//body-parserの設定
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 8858; // port番号を指定

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/status/',function (req,res){
    res.json({'status':'OK'})
})

let sourceMap = new Map<string, string>()

app.post('/api/get/', async function (req, res) {
    let url = req.body['url']
    if(url===undefined){
        res.json({'error':'URL Undefined'})
        return
    }
    let id = uuidv4();
    sourceMap.set(id, url)
    console.log(`URL:${url}`)
    console.log(`ID:${id}`)
    res.json({'uuid': id})
});

app.get('/api/stream/:id', async function (req, res) {
    let id = req.params.id
    console.log(`Stream id:${id}`)
    // @ts-ignore
    if (sourceMap.has(id)) {
        //@ts-ignore
        axios.get(sourceMap.get(id), {responseType: 'stream', adapter: httpAdapter})
            .then((response) => {
                console.log(`Stream Type:${typeof response.data}`)
                const stream = response.data
                // res.pipe(stream)
                // @ts-ignore
                stream.on('data',(chunk)=>{
                    res.write(chunk)
                    console.log('OnChunk')
                })

                stream.on('end',()=>{
                    console.log('OnEnd')
                    res.end()
                })

                // console.log(`Header:${JSON.stringify(data['headers']['content-type'])}`)
                // res.append('Content-Type',data['headers']['content-type'])
                // res.send(data['data'])
            })
        // console.log(`Data:${data['data']}`)
        // res.chunkedEncoding = true
        // res.shouldKeepAlive = true

        // res.redirect(sourceMap.get(id))
    } else {
        res.json({'error': 'not registered!'})
    }
});

// app.get('/api/get/', async function (req, res) {
//     let url = req.body['url']
//     @ts-ignore
// let data = await axios.get(url)
// res.send(data)
// });

app.get('/api/browse/', async function (req, res) {
    let data = await getBrowse(api, BROWSE_DIST.home)
    let json = {'Contents': []}
    data.contents.forEach((it) => {
        let c = {'Title': '', 'Contents': []}
        c['Title'] = it.getTitle()
        it.getContents().forEach((i) => {
            let j = {'Title': '', 'SubTitle': '', 'VideoID': '', 'PlayListID': '', 'Thumbnails': []}
            j['Title'] = i.getTitle()
            j['SubTitle'] = i.getSubTitle()
            j['VideoID'] = i.getVideoID()
            j['PlayListID'] = i.getPlayListID()
            i.getThumbnails().forEach((s) => {
                // @ts-ignore
                j['Thumbnails'].push(s)
            })
            // @ts-ignore
            c['Contents'].push(j)
        })
        // @ts-ignore
        json['Contents'].push(c)
    })
    res.json(json);
});

app.get('/api/playlist/:id', async function (req, res) {
    res.json((await api.getPlayList(req.params.id))['data']);
});

app.get('/api/format/:id', async function (req, res) {
    let format:FormatsJSON = (await api.getFormats(req.params.id))
    let url = format.getFormatURL()
    res.json({'url': safeString(url)});
});

app.get('/api/adaptiveFormat/:id', async function (req, res) {
    res.json({'urls': (await api.getAdaptiveFormats(req.params.id)).getAdaptiveFormatURLs()});
});

/*
検索用エンドポイント
 */
app.get('/api/search/:id', async function (req, res) {
    let d: Array<SearchEntry> = await getSearch(api, req.params.id)
    let json = {
        'Entries': []
    }

    d.forEach((it) => {
        let j = {'Title': it.getTitle(), 'Videos': [], 'PlayLists': [], 'Others': []}
        it.getItems().forEach((it) => {
            if (it.isVideo()) {
                let i = {
                    "id": safeString(it.getVideoID()),
                    "title": it.getTitle(),
                    "subTitle": it.getSubTitle(),
                    "thumbnail": it.getThumbnailUrl()
                }
                // @ts-ignore
                j['Videos'].push(i)
            } else if (it.isPlayList()) {
                let i = {
                    "id": safeString(it.getPlayListID()),
                    "title": it.getTitle(),
                    "subTitle": it.getSubTitle(),
                    "thumbnail": it.getThumbnailUrl()
                }
                // @ts-ignore
                j['PlayLists'].push(i)
            } else {
                // @ts-ignore
                j['Others'].push(it.json)
            }
        })
        // @ts-ignore
        json['Entries'].push(j)
    })
    res.json(json);
});

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);