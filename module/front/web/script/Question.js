'use strict';

Front.Question = class Lesson extends Front.Loadable {

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'question',
            view: 'publicView',
            id: this.id
        };
    }

    render (data) {
        data.lessonId = data.lesson._id;
        data.lessonTitle = data.lesson._title;
        data.files = this.renderFiles(data.files);
        return this.resolveTemplate('question', data);
    }

    renderFiles (items) {
        if (!Array.isArray(items) || !items.length) {
            return '';
        }
        items = items.map(this.renderFile, this).join('');
        return this.resolveTemplate('files', {items});
    }

    renderFile (data) {
        return this.resolveTemplate('file', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};