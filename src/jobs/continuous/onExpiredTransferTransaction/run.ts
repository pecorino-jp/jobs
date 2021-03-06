/**
 * 期限切れ転送引監視
 */
import * as pecorino from '@pecorino/domain';
import * as createDebug from 'debug';
import * as mongoose from 'mongoose';

import { connectMongo } from '../../../connectMongo';

const debug = createDebug('pecorino-jobs:*');

connectMongo().then(() => {
    let countExecute = 0;

    const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
    const INTERVAL_MILLISECONDS = 500;
    const taskRepo = new pecorino.repository.Task(mongoose.connection);
    const transactionRepo = new pecorino.repository.Transaction(mongoose.connection);

    setInterval(
        async () => {
            if (countExecute > MAX_NUBMER_OF_PARALLEL_TASKS) {
                return;
            }

            countExecute += 1;

            try {
                debug('exporting tasks...');
                await pecorino.service.transaction.transfer.exportTasks(
                    pecorino.factory.transactionStatusType.Expired
                )({ task: taskRepo, transaction: transactionRepo });
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.error(error);
            }

            countExecute -= 1;
        },
        INTERVAL_MILLISECONDS
    );
}).catch((err) => {
    // tslint:disable-next-line:no-console
    console.error('connetMongo:', err);
    process.exit(1);
});
