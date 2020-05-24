/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

// users can read comments from their tasks
// check user is a task executor

module.exports = class TaskCommentReaderRule extends Base {

    execute () {
        return this.isObjectTarget() ? this.checkReader() : this.isAllowType();
    }

    async checkReader () {
        const model = this.getTarget();
        const meta = model.class.meta;
        const student = await meta.getClass('task').findById(model.get('task')).scalar('student');
        const user = await meta.getClass('student').findById(student).scalar('user');
        const matched = this.isUser(user);
        return this.isAllowType() ? matched : !matched;
    }

    async getObjectFilter () {
        const meta = this.getBaseMeta();
        const user = this.getUserId();
        const student = await meta.getClass('student').find().and({user}).id();
        const task = await meta.getClass('task').find().and({student}).ids();
        return {task};
    }
};