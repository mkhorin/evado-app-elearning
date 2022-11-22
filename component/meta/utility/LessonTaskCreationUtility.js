/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./QuestionTaskCreationUtility');

module.exports = class LessonTaskCreationUtility extends Base {

    async execute () {
        const data = await this.resolveMetaParams();
        const lesson = data.model.getId();
        const query = data.class.meta.getClass('question').find({lesson});
        const questions = await query.all();
        for (const question of questions) {
            await this.createTasks(question);
        }
        this.controller.sendText('Tasks created');
    }
};