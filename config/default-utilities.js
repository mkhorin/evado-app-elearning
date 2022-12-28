'use strict';

const parent = require('evado/config/default-utilities');

module.exports = {

    ...parent,

    'questionTaskCreation': {
        Class: 'component/meta/utility/QuestionTaskCreationUtility',
        name: 'Create tasks',
        hint: 'Create tasks for all students',
        enabled: true,
        clientClass: 'QuestionTaskCreation',
        targetClass: 'question',
        actions: ['update']
    },

    'lessonTaskCreation': {
        Class: 'component/meta/utility/LessonTaskCreationUtility',
        name: 'Create tasks',
        hint: 'Create tasks for all students',
        enabled: true,
        clientClass: 'LessonTaskCreation',
        targetClass: 'lesson',
        actions: ['update']
    }
};