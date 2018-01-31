/**
 * 取引期限監視
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
        process.exit(0);
    });

let count = 0;

const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 1000;
const transactionRepository = new pecorino.repository.Transaction(pecorino.mongoose.connection);

setInterval(
    async () => {
        if (count > MAX_NUBMER_OF_PARALLEL_TASKS) {
            return;
        }

        count += 1;

        try {
            debug('transaction expiring...');
            await transactionRepository.makeExpired();
        } catch (error) {
            console.error(error.message);
        }

        count -= 1;
    },
    INTERVAL_MILLISECONDS
);
