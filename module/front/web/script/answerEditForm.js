'use strict';

Vue.component('answer-edit-form', {
    extends: Vue.component('model-form'),
    props: {
        answer: String
    },
    methods: {
        loadMeta () {
            const attrs = [{
                name: 'answer',
                label: 'Text',
                type: 'text',
                required: true
            }];
            return {attrs};
        },
        loadData () {
            return {
                answer: this.answer
            };
        }
    },
    template: '#model-form'
});