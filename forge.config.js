(function(module) {
    const path = require('path');
    var fs = require('fs-extra');
    const filesToDelete = [
        '.compilerc',
        '.gitignore',
        'forge.config.js',
        'build'
    ];

    module.exports = {
        'make_targets': {
            'win32': [
                'zip'
            ],
            'darwin': [
                'dmg'
            ]
        },
        'electronPackagerConfig': {
            "icon": "src/image/app",
            "asar": true,
            "win32metadata": {
                "CompanyName": "kimorkim",
                "FileDescription": "Markdown Editor",
                "OriginalFilename": "onPress.exe",
                "ProductName": "onPress",
                "InternalName": "onPress"
            },
            afterCopy: [
                (buildPath, electronVersion, platform, arch, callback) => {
                    filesToDelete.forEach((filePath) => {
                    	fs.remove(path.join(buildPath, filePath))
                    });
                    callback();
                }
            ]
        },
        "electronWinstallerConfig": {
            "name": "onPress",
            "exe": "onPress.exe",
            "authors": "kimorkim",
            "iconUrl": "https://raw.githubusercontent.com/kimorkim/onPress/master/src/image/app.ico",
            "setupIcon": "./src/image/app.ico",
            "loadingGif": "./src/image/onPress.gif"
        },
        'electronInstallerDMG': {
            'name': 'onPress',
            'title': 'onPress',
            'contents': [{
                'x': 240,
                'y': 380,
                'type': 'link',
                'path': '/Applications'
            }, {
                'x': 240,
                'y': 120,
                'type': 'file',
                'path': path.resolve(__dirname, 'out', 'onPress-darwin-x64', 'onPress.app'),
            }],
            'icon': './src/image/app.icns',
            'icon-size': 80
        }
    };
}(module));
