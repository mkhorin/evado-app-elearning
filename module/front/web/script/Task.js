'use strict';

Front.Task = class Task extends Front.LoadableContent {

    init () {
        super.init();
        this.$answerModal = this.find('.answer-modal');
        this.$answerError = this.$answerModal.find('.modal-error');
        this.answerForm = this.$answerModal.find('.form').data('handler');
        this.on('click', '[data-action="comment"]', this.onComment.bind(this));
        this.on('click', '[data-command="editAnswer"]', this.onEditAnswer.bind(this));
        this.on('click', '[data-command="saveAnswer"]', this.onSaveAnswer.bind(this));
        this.on('click', '[data-command="readyAnswer"]', this.onReadyAnswer.bind(this));
    }

    setTask (id) {
        this.id = id;
        this.clear();
        this.load();
    }

    getUrl (action = 'read') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'task',
            view: 'viewByStudent',
            id: this.id
        };
    }

    render (data) {
        this.data = data;
        this.answer = data.answer;
        data.questionId = data.question._id;
        data.questionTitle = data.question._title;
        return this.resolveTemplate('task', data);
    }

    renderElements (data) {
        const result = [];
        if (Array.isArray(data._elements)) {
            for (const item of data._elements) {
                result.push(item._group ? this.renderGroup(item) : this.renderAttr(item));
            }
        }
        return result.join('');
    }

    renderGroup (data) {
        data.active = data.active ? 'active' : '';
        data.content = this.renderElements(data);
        return data.content ? this.resolveTemplate('group', data) : '';
    }

    renderAttr (data) {
        data.required = data.required ? 'required' : '';
        data.value = this.renderAttrValue(this.data[data.name], data);
        data.content = this.resolveTemplate('static', data);
        return this.resolveTemplate('attr', data);
    }

    renderAttrValue (value, data) {
        switch (data.type) {
            case 'boolean':
                return Jam.FormatHelper.asBoolean(value);
            case 'date':
                return Jam.FormatHelper.asDate(value);
        }
        value = this.front.meta.formatAsEnum(value, data, 'meta.class.task');
        return Jam.Helper.escapeTags(value);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('errorTask', {text});
    }

    onEditAnswer () {
        this.answerForm.setValue('answer', this.answer);
        this.$answerError.addClass('hidden');
        this.$answerModal.modal();
    }

    onSaveAnswer () {
        const answer = this.answerForm.getValue('answer');
        this.front.toggleLoader(true);
        $.post(this.getUrl('update'), {
            class: 'task',
            id: this.id,
            data: {answer}
        }).done(this.onDoneAnswer.bind(this))
          .fail(this.onFailAnswer.bind(this));
    }

    onDoneAnswer () {
        this.front.toggleLoader(false);
        this.answer = this.answerForm.getValue('answer');
        this.find('.answer .text').html(Jam.Helper.escapeTags(this.answer));
        this.$answerModal.modal('hide');
    }

    onFailAnswer (data) {
        this.front.toggleLoader(false);
        data = data.responseText || data.statusText;
        this.$answerError.html(data).removeClass('hidden');
    }

    onReadyAnswer () {
        Jam.dialog.confirm('Submit this task?').then(this.onSubmitTask.bind(this));
    }

    onSubmitTask () {
        this.toggleLoader(true);
        $.post(this.getUrl('transit'), {
            class: 'task',
            id: this.id,
            transition: 'ready'
        }).done(this.onDoneSubmitTask.bind(this))
          .fail(this.onFailSubmitTask.bind(this));
    }

    onDoneSubmitTask () {
        this.toggleLoader(false);
        this.load();
    }

    onFailSubmitTask (data) {
        this.toggleLoader(false);
        this.$content.prepend(this.renderError(...arguments));
    }

    onComment (event) {
        event.preventDefault();
        const task = this.id;
        const comment = $(event.currentTarget).closest('.comment-item').data('id');
        this.front.trigger(`action:comment`, {task, comment});
    }
};

Front.TaskList = class TaskList extends Front.LoadableContent {

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 5;
        this.on('change:pagination', this.onChangePagination.bind(this));
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'task',
            view: 'listByStudent',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize()
        };
    }

    onChangePagination (event, {page}) {
        this.load();
    }

    render (data) {
        let items = data && data.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        const template = items ? 'list' : 'empty';
        return this.resolveTemplate(template, {items});
    }

    renderItem (data) {
        const state = data._state;
        data.stateTitle = data._state_title;
        data.stateCss = state === 'draft' ? 'text-danger' : state === 'closed' ? 'text-success' : '';
        data.questionTitle = data.question._title;
        data.question = data.question._id;
        data.gradeTitle = data.grade_title;
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data && data.totalSize);
        this.$content.append(this.pagination.render());
        this.translateContainer();
    }
};