'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'all'
        }
    }, {
        description: 'Teacher can read everything',
        roles: 'teacher',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'all'
        }
    }, {
        description: 'Teacher can manage their own learning materials',
        roles: 'teacher',
        type: 'allow',
        actions: ['create', 'update', 'delete'],
        targets: [{
            type: 'class',
            class: ['lesson', 'task', 'question', 'questionFile', 'comment', 'commentFile']
        }, {
            type: 'transition'
        }],
        rules: 'creator'
    }, {
        description: 'Teacher cannot update draft tasks',
        roles: 'teacher',
        type: 'deny',
        actions: 'update',
        targets: [{
            type: 'state',
            class: 'task',
            state: 'draft'
        }, {
            type: 'transition',
            class: 'task',
            transition: 'ready'
        }]
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
        rules: 'taskExecutor'
    }, {
        description: 'Student can update draft tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'update',
        targets: [{
            type: 'state',
            class: 'task',
            state: 'draft'
        }, {
            type: 'transition',
            class: 'task',
            transition: 'ready'
        }],
        rules: 'taskExecutor'
    }, {
        description: 'Student can manage their own comments',
        roles: 'student',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'class',
            class: ['comment', 'commentFile']
        },
        rules: 'creator'
    }, {
        description: 'Student can read comments from tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'comment'
        },
        rules: 'taskCommentReader'
    }, {
        description: 'Student can read comment files from tasks assigned to him',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'commentFile'
        },
        rules: 'taskFileReader'
    }, {
        description: 'Student can read himself',
        roles: 'student',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'student'
        },
        rules: 'user'
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
            label: 'Upload files',
            description: 'Uploading files via basic metadata API module'
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
                userAttr: '_creator'
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
                refAttr: 'student'
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
            label: 'User',
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