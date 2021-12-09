'use strict';

Vue.component('comment-view-form', {
    extends: Vue.component('model-form'),
    props: {
        metaClass: {
            default: 'comment'
        },
        metaView: {
            default: 'readByUser'
        },
        readOnly: {
            default: true
        },
        fileAttrs: {
            default () {
                return ['files'];
            }
        }
    },
    methods: {
        loadMeta () {
            const attrs = [{
                name: '_creator',
                label: 'Sender'
            },{
                name: '_createdAt',
                label: 'Created at',
                type: 'date',
                viewType: 'localDatetime'
            },{
                name: 'text',
                label: 'Message'
            },{
                name: 'files',
                label: 'Files',
                refClass: 'commentFile'
            }];
            return {attrs};
        }
    },
    template: '#model-form'
});