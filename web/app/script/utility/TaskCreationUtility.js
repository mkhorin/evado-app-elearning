/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.Utility.QuestionTaskCreation = class QuestionTaskCreationUtility extends Jam.Utility {

    onItemClick (event) {
        event.preventDefault();
        const data = this.getRequestData({
            test: 'Test data'
        });
        Jam.toggleGlobalLoader(true);
        Jam.Helper.post(this.$item, this.getUrl(), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        Jam.toggleGlobalLoader(false);
        const modal = this.getModal();
        modal.reload().done(()=> {
            modal.findInstanceByClass(Jam.Model).notice.success(data);
        });
    }

    onFail (data) {
        Jam.toggleGlobalLoader(false);
    }
};

Jam.Utility.LessonTaskCreation = class LessonTaskCreationUtility extends Jam.Utility.QuestionTaskCreation {

};