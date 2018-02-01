"use strict";
/**
 * 成立入金取引監視
 * @ignore
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pecorino = require("@motionpicture/pecorino-domain");
const createDebug = require("debug");
const mongooseConnectionOptions_1 = require("../../../mongooseConnectionOptions");
const debug = createDebug('pecorino-jobs:*');
pecorino.mongoose.connect(process.env.MONGOLAB_URI, mongooseConnectionOptions_1.default)
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
setInterval(() => __awaiter(this, void 0, void 0, function* () {
    if (countExecute > MAX_NUBMER_OF_PARALLEL_TASKS) {
        return;
    }
    countExecute += 1;
    try {
        debug('exporting tasks...');
        yield pecorino.service.transaction.deposit.exportTasks(pecorino.factory.transactionStatusType.Confirmed)(taskRepository, transactionRepository);
    }
    catch (error) {
        console.error(error.message);
    }
    countExecute -= 1;
}), INTERVAL_MILLISECONDS);
