'use strict';

Vue.component('question', {
    props: {
        question: String
    },
    data () {
        return {
            id: null,
            text: null,
            lesson: null,
            lessonTitle: null,
            files: []
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        onLesson () {
            this.$root.$emit('lesson', this.lesson);
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'question',
                view: 'publicView',
                id: this.question
            });
            this.id = data._id;
            this.text = data.text;
            this.lesson = data.lesson?._id;
            this.lessonTitle = data.lesson?._title;
            this.files = this.formatFiles(data.files);
        },
        formatFiles (items) {
            return items.map(item => ({
                id: item._id,
                url: this.getDownloadUrl('questionFile', item._id),
                description: item.description,
                name: item.name
            }));
        }
    },
    template: '#question'
});