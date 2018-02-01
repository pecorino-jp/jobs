/**
 * 成立入金取引監視
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

let countExecute = 0;

const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 200;
const taskRepository = new pecorino.repository.Task(pecorino.mongoose.connection);
const transactionRepository = new pecorino.repository.Transaction(pecorino.mongoose.connection);

setInterval(
    async () => {
        if (countExecute > MAX_NUBMER_OF_PARALLEL_TASKS) {
            return;
        }

        countExecute += 1;

        try {
            debug('exporting tasks...');
            await pecorino.service.transaction.deposit.exportTasks(
                pecorino.factory.transactionStatusType.Confirmed
            )(taskRepository, transactionRepository);
        } catch (error) {
            console.error(error.message);
        }

        countExecute -= 1;
    },
    INTERVAL_MILLISECONDS
);
