/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./QuestionTaskCreationUtility');

module.exports = class LessonTaskCreationUtility extends Base {

    async execute () {
        const {meta, view} = this.parseBaseMeta();
        const query = this.findModel(this.postParams.model, view);
        const lesson = query ? await query.one() : null;
        if (!lesson) {
            throw new BadRequest('Lesson not found');
        }
        const questions = await meta.getClass('question').find().and({lesson: lesson.getId()}).all();
        for (const question of questions) {
            await this.createTasks(question, meta);
        }
        this.controller.sendText('Tasks created');
    }
};

const BadRequest = require('areto/error/BadRequestHttpException');