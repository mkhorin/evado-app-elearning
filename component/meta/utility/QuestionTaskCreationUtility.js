/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/utility/MetaUtility');

module.exports = class QuestionTaskCreationUtility extends Base {

    async execute () {
        const data = await this.resolveMetaParams();
        await this.createTasks(data.model);
        this.controller.sendText('Tasks created');
    }

    async createTasks (question) {
        const taskClass = question.class.meta.getClass('task');
        const security = this.createMetaSecurity();
        await security.resolveOnCreate(taskClass);
        const studentClass = question.class.meta.getClass('student');
        const students = await studentClass.createQuery().ids();
        for (const student of students) {
            const task = await this.createModel(taskClass);
            task.set('question', question.getId());
            task.set('student', student);
            await task.save();
        }
    }
};