/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

// users can read files from their tasks
// check user is a task executor

module.exports = class TaskFileReaderRule extends Base {

    execute () {
        return this.isObjectTarget() ? this.checkReader() : this.isAllow();
    }

    async checkReader () {
        const model = this.getTarget();
        const meta = model.class.meta;
        const tasks = await meta.getClass('comment').find({files: model.getId()}).column('task');
        const students = await meta.getClass('task').findById(tasks).column('student');
        const user = await meta.getClass('student').findById(students).and({user: this.getUserId()}).id();
        return this.isAllow() ? !!user : !user;
    }

    async getObjectFilter () { // filter objects in list
        const meta = this.getBaseMeta();
        const student = await meta.getClass('student').find({user: this.getUserId()}).id();
        const task = await meta.getClass('task').find({student}).ids();
        const files = await meta.getClass('comment').find({task}).column('files');
        return {_id: [].concat(...files)};
    }
};