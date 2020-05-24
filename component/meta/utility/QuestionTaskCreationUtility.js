/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/utility/MetaUtility');

module.exports = class QuestionTaskCreationUtility extends Base {

    isActive () {
        if (!this.enabled || !this.isUpdateAction()) {
            return false;
        }
        const meta = this.parseBaseMeta();
        return meta.class && meta.class.name === this.targetClass;
    }

    async execute () {
        const {meta, view} = this.parseBaseMeta();
        const query = this.findModel(this.postParams.model, view);
        const question = query ? await query.one() : null;
        if (!question) {
            throw new BadRequest('Question not found');
        }
        await this.createTasks(question, meta);
        this.controller.sendText('Tasks created');
    }

    async createTasks (question, meta) {
        const taskClass = meta.getClass('task');
        const security = this.createMetaSecurity();
        await security.resolveOnCreate(taskClass);
        const students = await meta.getClass('student').find().ids();
        for (const student of students) {
            const task = this.createModel(taskClass);
            task.set('question', question.getId());
            task.set('student', student);
            await task.save();
        }
    }
};

const BadRequest = require('areto/error/BadRequestHttpException');