/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.CommentList = class CommentList extends Front.Loadable {

    init () {
        super.init();
        this.task = this.getData('task');
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 5;
        this.$new = this.find('.comment-modal');
        this.$newError = this.$new.find('.modal-error');
        this.on('change:pagination', this.onChangePagination.bind(this));
        this.on('click', '[data-action="detail"]', this.onDetail.bind(this));
        this.on('click', '[data-command="create"]', this.onCreate.bind(this));
        this.on('click', '[data-command="send"]', this.onSend.bind(this));
        this.load();
    }

    getUrl (action = 'list') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'comment',
            view: 'listInTask',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize(),
            filter: [{
                attr: 'task',
                op: 'equal',
                value: this.task
            }]
        };
    }

    onChangePagination () {
        this.load();
    }

    resolveTemplate (name, data) {
        return super.resolveTemplate(name, data, '##', '##');
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('') || this.resolveTemplate('empty');
        return this.resolveTemplate('list', {items});
    }

    renderItem (data) {
        data.date = Jam.FormatHelper.asDatetime(data._createdAt);
        data.sender = data._creator_title || data._creator;
        data.text = Jam.escape(data.text);
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data?.totalSize);
        this.$content.append(this.pagination.render());
        Jam.t(this.$container);
    }

    onDetail (event) {
        event.preventDefault();
        const {id, task, state} = $(event.currentTarget).closest('.task-item').data();
        const action = state === 'draft' ? 'fillForm' : 'request';
        this.front.trigger(`action:${action}`, {id, task});
    }

    onCreate () {
        this.getHandler('Form').trigger('form:clear');
        this.$newError.addClass('hidden');
        this.$new.modal();
    }

    onSend () {
        const form = this.getHandler('Form');
        if (!form.validate()) {
            return false;
        }
        const data = {
            class: 'comment',
            data: form.serialize()
        };
        data.data.task = {links: [this.task]};
        this.front.ajaxQueue.post(this.getUrl('create'), data)
            .done(this.onSendDone.bind(this))
            .fail(this.onSendFail.bind(this));
    }

    onSendDone () {
        this.$new.modal('hide');
        this.load();
    }

    onSendFail (data) {
        this.$newError.removeClass('hidden').html(data.responseText || data.statusText);
    }
};