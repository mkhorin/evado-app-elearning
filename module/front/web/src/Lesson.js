/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Lesson = class Lesson extends Front.Loadable {

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