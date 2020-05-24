'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {type: 'all'}
    }, {
        description: 'Teacher can read everything',
        roles: 'teacher',
        type: 'allow',
        actions: 'read',
        targets: {type: 'all'}
    }, {
        description: 'Teacher can manage their own learning materials',
        roles: 'teacher',
        type: 'allow',
        actions: ['create', 'update', 'delete'],
        targets: {
            type: 'class',
            class: ['lesson', 'task', 'question', 'questionFile', 'comment', 'commentFile']
        },
        rule: 'Author'
    }, {
        description: 'Teacher cannot update draft tasks',
        roles: 'teacher',
        type: 'deny',
        actions: 'update',
        targets: {
            type: 'state',
            class: 'task',
            state: 'draft'
        }
    }, {
        description: 'Student can read any learning material',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: ['lesson', 'question', 'questionFile']
        }
    }, {
        description: 'Student can read tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'task'
        },
        rule: 'Task executor'
    }, {
        description: 'Student can update draft tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'update',
        targets: {
            type: 'state',
            class: 'task',
            state: 'draft'
        },
        rule: 'Task executor'
    }, {
        description: 'Student can manage their own comments',
        roles: 'student',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'class',
            class: ['comment', 'commentFile']
        },
        rule: 'Author'
    }, {
        description: 'Student can read comments from tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'comment'
        },
        rule: 'Task comment reader'
    }, {
        description: 'Student can read comment files from tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'commentFile'
        },
        rule: 'Task file reader'
    }, {
        description: 'Student can read himself',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'student'
        },
        rule: 'User'
    }, {
        description: 'Guests can list lessons',
        roles: 'guest',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'view',
            class: 'lesson',
            view: 'publicList'
        }
    }],

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Admin module',
            description: 'Access to Admin module'
        },
        'moduleOffice': {
            label: 'Office module',
            description: 'Access to Office module'
        },
        'moduleStudio': {
            label: 'Studio module',
            description: 'Access to Studio module'
        }
    },

    roles: {
        'administrator': {
            label: 'Administrator',
            description: 'Full access to all',
            children: [
                'moduleAdmin',
                'moduleOffice',
                'moduleStudio',
                'upload'
            ]
        },
        'student': {
            label: 'Student',
            children: [
                'moduleOffice'
            ]
        },
        'teacher': {
            label: 'Teacher',
            children: [
                'moduleOffice'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for unauthenticated users'
        }
    },

    assignments: {
        'Adam': 'administrator',
        'Bart': 'student',
        'Sara': 'student',
        'Tim': 'teacher'
    },

    rules: {
        'Author': {
            description: 'Check user is object creator',
            config: '{"Class": "evado/component/meta/rbac/rule/AuthorRule"}'
        },
        'Task comment reader': {
            description: 'Users can read comments from their tasks',
            config: '{"Class": "component/meta/rbac/rule/TaskCommentReaderRule"}'
        },
        'Task executor': {
            description: 'Check user is a task executor',
            config: '{"Class": "evado/component/meta/rbac/rule/RefUserRule", "attr": "student"}'
        },
        'Task file reader': {
            description: 'Users can read files from their tasks',
            config: '{"Class": "component/meta/rbac/rule/TaskFileReaderRule"}'
        },
        'User': {
            description: 'Check user bind',
            config: '{"Class": "evado/component/meta/rbac/rule/AuthorRule", "userAttr": "user"}'
        }
    }
};