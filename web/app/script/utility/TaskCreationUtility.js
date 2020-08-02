/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.Utility.QuestionTaskCreation = class QuestionTaskCreationUtility extends Jam.Utility {

    execute () {
        const data = this.getRequestData();
        Jam.toggleGlobalLoader(true);
        Jam.Helper.post(this.getUrl(), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        Jam.toggleGlobalLoader(false);
        this.modal.reload().done(()=> this.getModel().notice.success(data));
    }

    onFail (data) {
        Jam.toggleGlobalLoader(false);
        this.parseModelError(data);
    }
};

Jam.Utility.LessonTaskCreation = class LessonTaskCreationUtility extends Jam.Utility.QuestionTaskCreation {

};