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
        return this.isObjectTarget() ? this.checkReader() : this.isAllow();
    }

    async checkReader () {
        const model = this.getTarget();
        const meta = model.class.meta;
        const student = await meta.getClass('task').findById(model.get('task')).scalar('student');
        const user = await meta.getClass('student').findById(student).scalar('user');
        const matched = this.isUser(user);
        return this.isAllow() ? matched : !matched;
    }

    /**
     * Filter objects in list
     */
    async getObjectFilter () {
        const meta = this.getBaseMeta();
        const user = this.getUserId();
        const student = await meta.getClass('student').find({user}).id();
        const task = await meta.getClass('task').find({student}).ids();
        return {task};
    }
};