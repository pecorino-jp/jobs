/**
 * タスクリトライ
 * @ignore
 */

import * as pecorino from '@motionpicture/pecorino-domain';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

pecorino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions)
    .then()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

let count = 0;

const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 1000;
const RETRY_INTERVAL_MINUTES = 10;
const taskRepo = new pecorino.repository.Task(pecorino.mongoose.connection);

setInterval(
    async () => {
        if (count > MAX_NUBMER_OF_PARALLEL_TASKS) {
            return;
        }

        count += 1;

        try {
            await pecorino.service.task.retry(RETRY_INTERVAL_MINUTES)({ task: taskRepo });
        } catch (error) {
            console.error(error.message);
        }

        count -= 1;
    },
    INTERVAL_MILLISECONDS
);
