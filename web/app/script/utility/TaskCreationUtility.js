/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.Utility.QuestionTaskCreation = class QuestionTaskCreationUtility extends Jam.Utility {

    execute () {
        const data = this.getRequestData();
        Jam.showLoader();
        return Jam.post(this.getUrl(), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        Jam.hideLoader();
        return this.frame.reload()
            .done(() => this.getModel().alert.success(data));
    }

    onFail (data) {
        Jam.hideLoader();
        this.parseModelError(data);
    }
};

Jam.Utility.LessonTaskCreation = class LessonTaskCreationUtility extends Jam.Utility.QuestionTaskCreation {

};