'use strict';

Front.Lesson = class Lesson extends Front.LoadableContent {

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'lesson',
            view: 'publicView',
            id: this.id
        };
    }

    render (data) {
        data.content = markdown.toHTML(data.content);
        data.questions = this.renderQuestions(data.questions);
        return this.resolveTemplate('lesson', data);
    }

    renderQuestions (items) {
        if (!Array.isArray(items) || !items.length) {
            return this.resolveTemplate('noQuestions');
        }
        items = items.map(this.renderQuestion, this).join('');
        return this.resolveTemplate('questions', {items});
    }

    renderQuestion (data) {
        return this.resolveTemplate('question', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};

Front.LessonList = class LessonList extends Front.LoadableContent {

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 9;
        this.on('change:pagination', this.onChangePagination.bind(this));
        this.load();
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'lesson',
            view: 'publicList'
        };
    }

    render (data) {
        let items = data && data.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.i18n.translate('No lessons found')});
    }

    renderItem (data) {
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        super.onDone(data);
        $(window).scrollTop(0);
    }

    onChangePagination (event, {page}) {
        this.load();
    }
};