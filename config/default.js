'use strict';

module.exports = {

    title: 'eLearning',

    components: {
        'db': {
            settings: {
                'database': process.env.MONGO_NAME || 'evado-eLearning',
            }
        },
        'cookie': {
            secret: 'eLearning.evado'
        },
        'session': {
            secret: 'eLearning.evado'
        },
        'i18n': {
            // language: 'ru'
        },
        'router': {
            // defaultModule: 'front'
        }
    },
    metaModels: {
        'base': {
            Class: require('evado-meta-base/base/BaseMeta')
        },
        'navigation': {
            Class: require('evado-meta-navigation/base/NavMeta')
        }
    },
    modules: {
        'api': {
            config: {
                modules: {
                    'base': {
                        Class: require('evado-api-base/Module')
                    },
                    'navigation': {
                        Class: require('evado-api-navigation/Module')
                    }
                }
            }
        },
        'studio': {
            Class: require('evado-module-studio/Module')
        },
        'office': {
            Class: require('../module/office/Module')
        },
        'account': {
            Class: require('evado-module-account/Module')
        },
        'admin': {
            Class: require('evado-module-admin/Module')
        },
        'front': {
            Class: require('../module/front/Module')
        }
    },
    users: require('./default-users'),
    security: require('./default-security'),
    tasks: require('./default-tasks'),
    utilities: require('./default-utilities'),
    params: {
        'enablePasswordReset': false,
        'enableSignUp': false,
        'enableSignUpVerification': false
    }
};