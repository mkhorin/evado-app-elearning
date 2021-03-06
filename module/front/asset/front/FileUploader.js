/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.FileUploader = class FileUploader extends Front.Element {

    init () {
        this.form = this.getClosestHandler('Form');
        this.form.on('form:clear', this.onClear.bind(this));
        this.on('click', '[data-command="addFile"]', this.onAdd.bind(this));
        this.on('click', '[data-command="removeFile"]', this.onRemove.bind(this));
        this.on('change', '[type="file"]', this.onFile.bind(this));
    }

    getItem (element) {
        return $(element).closest('.file-uploader-item');
    }

    getItems () {
        return this.find('.file-uploader-item');
    }

    addError (message, $item) {
        $item.addClass('has-error').find('.error-block').html(message);
        this.setHint('');
    }

    setHint (message, $item) {
        $item.find('.hint-block').html(Jam.t(message));
    }

    update () {
        const links = [];
        for (const item of this.getItems()) {
            const id = $(item).data('id');
            if (id) {
                links.push(id);
            }
        }
        this.find('[name]').val(links.length ? JSON.stringify({links}) : '');
    }

    onClear () {
        this.getItems().remove();
        this.update();
    }

    onAdd () {
        if (this.getItems().length < 3) {
            const item = this.resolveTemplate('fileUploaderItem');
            this.$container.append(item);
        }
    }

    onRemove (event) {
        this.getItem(event.currentTarget).remove();
        this.update();
    }

    onFile (event) {
        this.file = event.currentTarget.files[0];
        this.$item = this.getItem(event.currentTarget);
        this.$item.data('id', null);
        if (this.file) {
            this.setHint('File is uploading...', this.$item);
            this.upload();
        }
    }

    upload () {
        const url = this.front.getData('upload') + '?c=commentFile';
        this.xhr = new XMLHttpRequest;
        this.xhr.open('POST', url);
        this.xhr.onreadystatechange = this.changeReadyState.bind(this);
        const data = new FormData;
        data.append('file', this.file.name);
        data.append('file', this.file);
        this.xhr.send(data);
        this.front.toggleLoader(true);
    }

    changeReadyState () {
        if (this.xhr.readyState === XMLHttpRequest.DONE) {
            this.xhr.status === 200
                ? this.onUploadDone()
                : this.onUploadFail();
        }
    }

    onUploadDone () {
        const {id} = JSON.parse(this.xhr.response);
        const url = this.getDataUrl('create');
        const data = {
            file: id,
            name: this.file.name
        };
        this.front.ajaxQueue.post(url, {class: 'commentFile', data})
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (id) {
        this.front.toggleLoader(false);
        this.$item.data('id', id);
        this.setHint('File uploaded', this.$item);
        this.update();
    }

    onUploadFail () {
        this.front.toggleLoader(false);
        this.addError(this.xhr.response, this.$item);
    }

    onFail (data) {
        this.front.toggleLoader(false);
        this.addError(data.responseText || data.statusText, this.$item);
    }
};