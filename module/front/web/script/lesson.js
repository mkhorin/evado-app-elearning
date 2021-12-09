'use strict';

Vue.component('lesson', {
    props: {
        lesson: String
    },
    data () {
        return {
            id: null,
            name: null,
            content: null,
            questions: []
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        async load () {
            const data = await this.fetchJson('read', {
                class: 'lesson',
                view: 'publicView',
                id: this.lesson
            });
            this.id = data._id;
            this.name = data.name;
            this.content = markdown.toHTML(data.content);
            this.questions = this.formatQuestions(data.questions);
        },
        formatQuestions (items) {
            return items.map(item => ({
                id: item._id,
                text: item.text
            }));
        }
    },
    template: '#lesson'
});