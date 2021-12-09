'use strict';

Vue.component('comment-creation-form', {
    extends: Vue.component('model-form'),
    props: {
        metaClass: {
            default: 'comment'
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
                name: 'text',
                label: 'Message',
                type: 'text',
                required: true
            },{
                name: 'files',
                label: 'Files',
                refClass: 'commentFile'
            }];
            return {attrs};
        },
        loadData () {
            return {};
        }
    },
    template: '#model-form'
});