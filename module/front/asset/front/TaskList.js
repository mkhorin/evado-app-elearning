/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.TaskList = class TaskList extends Front.Loadable {

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
        let items = data?.items;
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
        this.pagination.setTotal(data?.totalSize);
        this.$content.append(this.pagination.render());
        Jam.t(this.$container);
    }
};