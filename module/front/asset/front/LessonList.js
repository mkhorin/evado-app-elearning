/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.LessonList = class LessonList extends Front.Loadable {

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
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.t('No lessons found')});
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