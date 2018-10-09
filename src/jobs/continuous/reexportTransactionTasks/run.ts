/**
 * 取引キューエクスポートが実行中のままになっている取引を監視する
 */
import * as pecorino from '@pecorino/domain';
import * as createDebug from 'debug';

import { connectMongo } from '../../../connectMongo';

const debug = createDebug('pecorino-jobs:*');

connectMongo().then(() => {
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
                // tslint:disable-next-line:no-console
                console.error(error);
            }

            countRetry -= 1;
        },
        INTERVAL_MILLISECONDS
    );
}).catch((err) => {
    // tslint:disable-next-line:no-console
    console.error('connetMongo:', err);
    process.exit(1);
});
