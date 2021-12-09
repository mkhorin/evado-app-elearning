'use strict';

Vue.component('task', {
    props: {
        task: String
    },
    data () {
        return {
            id: null,
            answer: null,
            grade: null,
            gradeTitle: null,
            state: null,
            stateTitle: null,
            question: null,
            questionTitle: null
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        onEditAnswer () {
            this.$refs.answerModal.show();
            this.$refs.answerForm?.reset();
        },
        async onReadyAnswer () {
            await Jam.dialog.confirm('Submit this task?');
            try {
                await this.fetchText('transit', {
                    class: 'task',
                    id: this.task,
                    transition: 'ready'
                });
                await this.load();
            } catch (err) {
                this.showError(err);
            }
        },
        onSaveAnswer () {
            const form = this.$refs.answerForm;
            if (form.validate()) {
                this.saveAnswer(form.serialize());
            }
        },
        async saveAnswer (data) {
            try {
                await this.fetchText('update', {
                    class: 'task',
                    id: this.task,
                    data
                });
                this.answer = data.answer;
                this.$refs.answerModal.hide();
            } catch (err) {
                this.showError(err);
            }
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'task',
                view: 'viewByStudent',
                id: this.task
            });
            this.id = data._id;
            this.answer = data.answer;
            this.grade = data.grade;
            this.gradeTitle = Jam.t(this.getValueTitle('grade', data), 'meta.class.task.attr.grade');
            this.state = data._state;
            this.stateTitle = Jam.t(this.getValueTitle('_state', data), 'meta.class.task');
            this.question = data.question?._id;
            this.questionTitle = Jam.t(data.question?._title, 'meta.class.question');
        },
        formatQuestions (items) {
            return items.map(item => ({
                id: item._id,
                text: item.text
            }));
        }
    },
    template: '#task'
});