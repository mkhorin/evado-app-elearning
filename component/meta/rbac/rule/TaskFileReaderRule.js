/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 *
 * Users can read files from their tasks
 * Check user is a task executor
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

module.exports = class TaskFileReaderRule extends Base {

    execute () {
        return this.isObjectTarget() ? this.checkReader() : this.isAllow();
    }

    async checkReader () {
        const model = this.getTarget();
        const meta = model.class.meta;
        const commentClass = meta.getClass('comment');
        const commentQuery  = commentClass.find({
            files: model.getId()
        });
        const tasks = await commentQuery.column('task');
        const taskClass = meta.getClass('task');
        const taskQuery = taskClass.findById(tasks);
        const students = await taskQuery.column('student');
        const studentClass = meta.getClass('student');
        const studentQuery = studentClass.findById(students).and({
            user: this.getUserId()
        });
        const user = await studentQuery.id();
        return this.isAllow() ? !!user : !user;
    }

    /**
     * Filter objects in list
     */
    async getObjectFilter () {
        const meta = this.getBaseMeta();
        const studentClass = meta.getClass('student');
        const studentQuery = studentClass.find({
            user: this.getUserId()
        });
        const student = await studentQuery.id();
        const taskClass = meta.getClass('task');
        const taskQuery = taskClass.find({student});
        const task = await taskQuery.ids();
        const commentClass = meta.getClass('comment');
        const commentQuery = commentClass.find({task});
        const files = await commentQuery.column('files');
        const ids = [].concat(...files);
        return {_id: ids};
    }
};