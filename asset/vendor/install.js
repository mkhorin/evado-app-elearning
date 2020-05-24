/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const path = require('path');
const SystemHelper = require('areto/helper/SystemHelper');

(async () => {
    await SystemHelper.spawnProcess(path.join(__dirname, '../../module/front/asset/vendor'), 'npm', ['install']);
    process.exit();
})();