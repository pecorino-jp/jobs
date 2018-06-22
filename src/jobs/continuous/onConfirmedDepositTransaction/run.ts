/**
 * 成立入金取引監視
 */
import * as pecorino from '@motionpicture/pecorino-domain';
import * as createDebug from 'debug';

import { connectMongo } from '../../../connectMongo';

const debug = createDebug('pecorino-jobs:*');

connectMongo().then(() => {
    let countExecute = 0;

    const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
    const INTERVAL_MILLISECONDS = 200;
    const taskRepo = new pecorino.repository.Task(pecorino.mongoose.connection);
    const transactionRepo = new pecorino.repository.Transaction(pecorino.mongoose.connection);

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
                )({ task: taskRepo, transaction: transactionRepo });
            } catch (error) {
                console.error(error);
            }

            countExecute -= 1;
        },
        INTERVAL_MILLISECONDS
    );
}).catch((err) => {
    console.error('connetMongo:', err);
    process.exit(1);
});
