/**
 * 取引キューエクスポートが実行中のままになっている取引を監視する
 * @ignore
 */

import * as pecorino from '@motionpicture/pecorino-domain';
import * as createDebug from 'debug';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

const debug = createDebug('pecorino-jobs:*');

pecorino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions)
    .then()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

let countRetry = 0;

const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 500;
const transactionRepo = new pecorino.repository.Transaction(pecorino.mongoose.connection);
const RETRY_INTERVAL_MINUTES = 10;

setInterval(
    async () => {
        if (countRetry > MAX_NUBMER_OF_PARALLEL_TASKS) {
            return;
        }

        countRetry += 1;

        try {
            debug('reexporting tasks...');
            await transactionRepo.reexportTasks(RETRY_INTERVAL_MINUTES);
        } catch (error) {
            console.error(error.message);
        }

        countRetry -= 1;
    },
    INTERVAL_MILLISECONDS
);
