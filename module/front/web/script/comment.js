'use strict';

Vue.component('comment', {
    props: {
        comment: String,
        task: String
    },
    methods: {
        onTask () {
            this.$root.$emit('task', this.task);
        },
        async onDelete () {
            await Jam.dialog.confirmDeletion();
            await this.deleteComment();
        },
        async deleteComment () {
            try {
                await this.fetchText('delete', {
                    class: 'comment',
                    id: this.comment
                });
                this.onTask();
            } catch (err) {
                this.showError(err);
            }
        }
    },
    template: '#comment'
});