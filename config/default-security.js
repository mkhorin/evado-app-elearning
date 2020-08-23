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
        rule: 'creator'
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
        rule: 'taskExecutor'
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
        rule: 'taskExecutor'
    }, {
        description: 'Student can manage their own comments',
        roles: 'student',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'class',
            class: ['comment', 'commentFile']
        },
        rule: 'creator'
    }, {
        description: 'Student can read comments from tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'comment'
        },
        rule: 'taskCommentReader'
    }, {
        description: 'Student can read comment files from tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'commentFile'
        },
        rule: 'taskFileReader'
    }, {
        description: 'Student can read himself',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'student'
        },
        rule: 'user'
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
        },
        'moduleApiBaseUpload': {
            label: 'Upload files'
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
                'moduleApiBaseUpload'
            ]
        },
        'student': {
            label: 'Student',
            children: [
                'moduleOffice',
                'moduleApiBaseUpload'
            ]
        },
        'teacher': {
            label: 'Teacher',
            children: [
                'moduleOffice',
                'moduleApiBaseUpload'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for unauthenticated users'
        }
    },

    rules: {
        'creator': {
            label: 'Creator',
            description: 'Check user is object creator',
            config: {
                Class: 'evado/component/meta/rbac/rule/UserRule',
                attr: '_creator'
            }
        },
        'taskCommentReader': {
            label: 'Task comment reader',
            description: 'Users can read comments from their tasks',
            config: {
                Class: 'component/meta/rbac/rule/TaskCommentReaderRule'
            }
        },
        'taskExecutor': {
            label: 'Task executor',
            description: 'Check user is a task executor',
            config: {
                Class: 'evado/component/meta/rbac/rule/RefUserRule',
                attr: 'student'
            }
        },
        'taskFileReader': {
            label: 'Task file reader',
            description: 'Users can read files from their tasks',
            config: {
                Class: 'component/meta/rbac/rule/TaskFileReaderRule'
            }
        },
        'user': {
            description: 'Check user binding',
            config: {
                Class: 'evado/component/meta/rbac/rule/UserRule'
            }
        }
    },

    assignments: {
        'Adam': 'administrator',
        'Bart': 'student',
        'Sara': 'student',
        'Tim': 'teacher'
    }
};