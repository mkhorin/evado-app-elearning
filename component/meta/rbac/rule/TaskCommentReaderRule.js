/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 *
 * Users can read comments from their tasks
 * Check user is a task executor
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

module.exports = class TaskCommentReaderRule extends Base {

    execute () {
        return this.isObjectTarget()
            ? this.checkReader()
            : this.isAllow();
    }

    async checkReader () {
        const model = this.getTarget();
        const meta = model.class.meta;
        const taskClass = meta.getClass('task');
        const taskQuery = taskClass.findById(model.get('task'));
        const student = await taskQuery.scalar('student'); // get single value
        const studentClass = meta.getClass('student');
        const studentQuery = studentClass.findById(student);
        const user = await studentQuery.scalar('user');
        const matched = this.isUser(user);
        return this.isAllow() ? matched : !matched;
    }

    /**
     * Filter objects in list
     */
    async getObjectFilter () {
        const meta = this.getBaseMeta();
        const user = this.getUserId();
        const studentQuery = meta.getClass('student').find({user});
        const student = await studentQuery.id();
        const taskQuery = meta.getClass('task').find({student});
        const task = await taskQuery.ids();
        return {task};
    }
};