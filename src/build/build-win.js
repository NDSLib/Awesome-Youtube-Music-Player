const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'com.ndsl.aymp',
        'win': {
            'target': {
                'target': 'zip',
                'arch': [
                    'x64',
                    'ia32',
                ]
            }
        },
        'build': {
            'files': ['src/js/*', 'src/html/*']
        }
    }
});