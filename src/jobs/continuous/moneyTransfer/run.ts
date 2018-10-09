/**
 * 現金転送実行
 */
import * as pecorino from '@pecorino/domain';
import * as createDebug from 'debug';

import { connectMongo } from '../../../connectMongo';

const debug = createDebug('pecorino-jobs:*');

connectMongo().then(() => {
    let count = 0;

    const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
    const INTERVAL_MILLISECONDS = 500;
    const taskRepo = new pecorino.repository.Task(pecorino.mongoose.connection);

    setInterval(
        async () => {
            if (count > MAX_NUBMER_OF_PARALLEL_TASKS) {
                return;
            }

            count += 1;

            try {
                debug('count:', count);
                await pecorino.service.task.executeByName(
                    pecorino.factory.taskName.MoneyTransfer
                )({ taskRepo: taskRepo, connection: pecorino.mongoose.connection });
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.error(error);
            }

            count -= 1;
        },
        INTERVAL_MILLISECONDS
    );
}).catch((err) => {
    // tslint:disable-next-line:no-console
    console.error('connetMongo:', err);
    process.exit(1);
});
