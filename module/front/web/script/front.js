'use strict';

const front = new Vue({
    el: '#front',
    props: {
        csrf: String,
        authUrl: String,
        dataUrl: String,
        fileUrl: String,
        metaUrl: String,
        thumbnailUrl: String,
        userId: String
    },
    propsData: {
        ...document.querySelector('#front').dataset
    },
    data () {
        return {
            activePage: 'lessons',
            activeComment: null,
            activeLesson: null,
            activeTask: null,
            activeQuestion: null
        };
    },
    computed: {
        activePageProps () {
            switch (this.activePage) {
                case 'lesson':
                    return {
                        key: this.activeLesson,
                        lesson: this.activeLesson
                    };
                case 'task':
                    return {
                        key: this.activeTask,
                        task: this.activeTask
                    };
                case 'question':
                    return {
                        key: this.activeQuestion,
                        lesson: this.activeLesson,
                        question: this.activeQuestion
                    };
                case 'comment':
                    return {
                        key: this.activeComment,
                        comment: this.activeComment,
                        task: this.activeTask
                    };
            }
        }
    },
    created () {
        this.$on('account', this.onAccount);
        this.$on('comment', this.onComment);
        this.$on('lesson', this.onLesson);
        this.$on('lessons', this.onLessons);
        this.$on('question', this.onQuestion);
        this.$on('task', this.onTask);
    },
    methods: {
        onAccount () {
            if (this.requireAuth()) {
                this.activePage = 'account';
            }
        },
        onComment (id) {
            this.activePage = 'comment';
            this.activeComment = id;
        },
        onLesson (id) {
            if (this.requireAuth()) {
                this.activePage = 'lesson';
                this.activeLesson = id;
            }
        },
        onLessons () {
            this.activePage = 'lessons';
        },
        onQuestion (id) {
            this.activePage = 'question';
            this.activeQuestion = id;
        },
        onTask (id) {
            this.activePage = 'task';
            this.activeTask = id;
        }
    }
});