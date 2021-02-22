/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Comment = class Comment extends Front.Loadable {

    init () {
        super.init();
        this.on('click', '[data-command="backTask"]', this.onBackTask.bind(this));
        this.on('click', '[data-command="delete"]', this.onDelete.bind(this));
    }

    getUrl (action = 'read') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'comment',
            view: 'readByUser',
            id: this.id
        };
    }

    setComment (id, task) {
        this.id = id;
        this.task = task;
        this.clear();
        this.load();
    }

    render (data) {
        this.data = data;
        data.date = Jam.FormatHelper.asDatetime(data._createdAt);
        data.sender = data._creator_title;
        data.task = this.task;
        data.text = Jam.StringHelper.escapeTags(data.text);
        data.files = this.renderFiles(data.files);
        data.owner = this.front.isUser(data._creator) ? 'owner' : '';
        return this.resolveTemplate('item', data);
    }

    renderFiles (items) {
        items = Array.isArray(items) ? items.map(this.renderFile, this) : [];
        return items.length ? this.resolveTemplate('files', {items: items.join('')}) : '';
    }

    renderFile (data) {
        data.size = Jam.FormatHelper.asBytes(data._size);
        return this.resolveTemplate('file', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onBackTask () {
        this.front.getHandler('TaskPage').showPage();
    }

    onDelete () {
        Jam.dialog.confirmDeletion().then(this.deleteComment.bind(this));
    }

    deleteComment () {
        this.toggleLoader(true);
        this.front.ajaxQueue.post(this.getUrl('delete'), this.getPostData())
            .done(this.onDoneDelete.bind(this))
            .fail(this.onFailDelete.bind(this));
    }

    onDoneDelete () {
        this.toggleLoader(false);
        this.front.trigger('action:task', {task: this.task});
    }

    onFailDelete () {
        this.toggleLoader(false);
        this.$container.append(this.renderError(...arguments));
    }
};