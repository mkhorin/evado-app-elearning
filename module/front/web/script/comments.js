'use strict';

Vue.component('comments', {
    props: {
        commentCreation: Boolean,
        pageSize: {
            type: Number,
            default: 5
        },
        task: String
    },
    data () {
        return {
            items: []
        };
    },
    computed: {
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        onComment (id) {
            this.$root.$emit('comment', id);
        },
        onNew () {
            this.$refs.newComment.show();
            this.$refs.newCommentForm?.reset();
        },
        onSend () {
            const form = this.$refs.newCommentForm;
            if (form.validate()) {
                this.send(form.serialize());
            }
        },
        async send (data) {
            try {
                data = {
                    task: this.task,
                    ...data
                };
                await this.fetchText('create', {
                    class: 'comment',
                    data
                });
                this.$refs.newComment.hide();
                await this.reload();
            } catch (err) {
                this.showError(err);
            }
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'comment',
                view: 'listInTask',
                length: this.pageSize,
                start: page * this.pageSize,
                filter: this.getFilter()
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        getFilter () {
            return [{
                attr: 'task',
                op: 'equal',
                value: this.task
            }];
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                date: Jam.FormatHelper.asDatetime(item._createdAt),
                sender: this.getValueTitle('_creator', item),
                message: item.text
            }));
        }
    },
    template: '#comments'
});