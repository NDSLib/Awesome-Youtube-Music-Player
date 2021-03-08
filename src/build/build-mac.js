const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'com.ndsl.aymp',
        'mac':
            {
                'target': 'zip',
            }
    }
});