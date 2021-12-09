'use strict';

module.exports = {

    deploy: {
        'vendor/markdown': 'vendor/node_modules/markdown/lib/markdown.js',
        'vendor/vue': [
            'vendor/node_modules/vue/dist/vue.js',
            'vendor/node_modules/vue/dist/vue.min.js'
        ]
    }
};