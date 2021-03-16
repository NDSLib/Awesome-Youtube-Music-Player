"use strict";
// ライブラリ読み込み
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Util_1 = require("./Util");
var Browse_1 = require("standard-youtube-music-api/src/dist/Browse");
var axios_1 = __importDefault(require("axios"));
var uuid_1 = require("uuid");
// const express = require('express');
var app = express_1.default();
var bodyParser = require('body-parser');
var youtube = require('standard-youtube-music-api');
var getSearch = require("standard-youtube-music-api/src/dist/Search").getSearch;
var getSearchData = require("standard-youtube-music-api/src/dist/Search").getSearchData;
var api = new youtube.YoutubeMusicAPI();
var httpAdapter = require('axios/lib/adapters/http');
//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = 8858; // port番号を指定
app.use(function (req, res, next) {
    res.append('Access-Control-Allow-Origin', '*');
    // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.get('/api/status/', function (req, res) {
    res.json({ 'status': 'OK' });
});
var sourceMap = new Map();
app.post('/api/get/', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, id;
        return __generator(this, function (_a) {
            url = req.body['url'];
            if (url === undefined) {
                res.json({ 'error': 'URL Undefined' });
                return [2 /*return*/];
            }
            id = uuid_1.v4();
            sourceMap.set(id, url);
            console.log("URL:" + url);
            console.log("ID:" + id);
            res.json({ 'uuid': id });
            return [2 /*return*/];
        });
    });
});
app.get('/api/stream/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            id = req.params.id;
            console.log("Stream id:" + id);
            // @ts-ignore
            if (sourceMap.has(id)) {
                //@ts-ignore
                axios_1.default.get(sourceMap.get(id), { responseType: 'stream', adapter: httpAdapter })
                    .then(function (response) {
                    console.log("Stream Type:" + typeof response.data);
                    var stream = response.data;
                    // res.pipe(stream)
                    // @ts-ignore
                    stream.on('data', function (chunk) {
                        res.write(chunk);
                        console.log('OnChunk');
                    });
                    stream.on('end', function () {
                        console.log('OnEnd');
                        res.end();
                    });
                    // console.log(`Header:${JSON.stringify(data['headers']['content-type'])}`)
                    // res.append('Content-Type',data['headers']['content-type'])
                    // res.send(data['data'])
                });
                // console.log(`Data:${data['data']}`)
                // res.chunkedEncoding = true
                // res.shouldKeepAlive = true
                // res.redirect(sourceMap.get(id))
            }
            else {
                res.json({ 'error': 'not registered!' });
            }
            return [2 /*return*/];
        });
    });
});
// app.get('/api/get/', async function (req, res) {
//     let url = req.body['url']
//     @ts-ignore
// let data = await axios.get(url)
// res.send(data)
// });
app.get('/api/browse/', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var data, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Browse_1.getBrowse(api, Browse_1.BROWSE_DIST.home)];
                case 1:
                    data = _a.sent();
                    json = { 'Contents': [] };
                    data.contents.forEach(function (it) {
                        var c = { 'Title': '', 'Contents': [] };
                        c['Title'] = it.getTitle();
                        it.getContents().forEach(function (i) {
                            var j = { 'Title': '', 'SubTitle': '', 'VideoID': '', 'PlayListID': '', 'Thumbnails': [] };
                            j['Title'] = i.getTitle();
                            j['SubTitle'] = i.getSubTitle();
                            j['VideoID'] = i.getVideoID();
                            j['PlayListID'] = i.getPlayListID();
                            i.getThumbnails().forEach(function (s) {
                                // @ts-ignore
                                j['Thumbnails'].push(s);
                            });
                            // @ts-ignore
                            c['Contents'].push(j);
                        });
                        // @ts-ignore
                        json['Contents'].push(c);
                    });
                    res.json(json);
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/api/playlist/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = res).json;
                    return [4 /*yield*/, api.getPlayList(req.params.id)];
                case 1:
                    _b.apply(_a, [(_c.sent())['data']]);
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/api/format/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var format, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.getFormats(req.params.id)];
                case 1:
                    format = (_a.sent());
                    url = format.getFormatURL();
                    res.json({ 'url': Util_1.safeString(url) });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/api/adaptiveFormat/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _b = (_a = res).json;
                    _d = {};
                    _c = 'urls';
                    return [4 /*yield*/, api.getAdaptiveFormats(req.params.id)];
                case 1:
                    _b.apply(_a, [(_d[_c] = (_e.sent()).getAdaptiveFormatURLs(), _d)]);
                    return [2 /*return*/];
            }
        });
    });
});
/*
検索用エンドポイント
 */
app.get('/api/search/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var d, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSearch(api, req.params.id)];
                case 1:
                    d = _a.sent();
                    json = {
                        'Entries': []
                    };
                    d.forEach(function (it) {
                        var j = { 'Title': it.getTitle(), 'Videos': [], 'PlayLists': [], 'Others': [] };
                        it.getItems().forEach(function (it) {
                            if (it.isVideo()) {
                                var i = {
                                    "id": Util_1.safeString(it.getVideoID()),
                                    "title": it.getTitle(),
                                    "subTitle": it.getSubTitle(),
                                    "thumbnail": it.getThumbnailUrl()
                                };
                                // @ts-ignore
                                j['Videos'].push(i);
                            }
                            else if (it.isPlayList()) {
                                var i = {
                                    "id": Util_1.safeString(it.getPlayListID()),
                                    "title": it.getTitle(),
                                    "subTitle": it.getSubTitle(),
                                    "thumbnail": it.getThumbnailUrl()
                                };
                                // @ts-ignore
                                j['PlayLists'].push(i);
                            }
                            else {
                                // @ts-ignore
                                j['Others'].push(it.json);
                            }
                        });
                        // @ts-ignore
                        json['Entries'].push(j);
                    });
                    res.json(json);
                    return [2 /*return*/];
            }
        });
    });
});
//サーバ起動
app.listen(port);
console.log('listen on port ' + port);
