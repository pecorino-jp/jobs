"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 期限切れ取引監視
 */
const pecorino = require("@pecorino/domain");
const createDebug = require("debug");
const mongoose = require("mongoose");
const connectMongo_1 = require("../../../connectMongo");
const debug = createDebug('pecorino-jobs:*');
connectMongo_1.connectMongo().then(() => {
    let countExecute = 0;
    const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
    const INTERVAL_MILLISECONDS = 500;
    const taskRepo = new pecorino.repository.Task(mongoose.connection);
    const transactionRepo = new pecorino.repository.Transaction(mongoose.connection);
    setInterval(() => __awaiter(this, void 0, void 0, function* () {
        if (countExecute > MAX_NUBMER_OF_PARALLEL_TASKS) {
            return;
        }
        countExecute += 1;
        try {
            debug('exporting tasks...');
            yield pecorino.service.transaction.withdraw.exportTasks(pecorino.factory.transactionStatusType.Expired)({ task: taskRepo, transaction: transactionRepo });
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
        }
        countExecute -= 1;
    }), INTERVAL_MILLISECONDS);
}).catch((err) => {
    // tslint:disable-next-line:no-console
    console.error('connetMongo:', err);
    process.exit(1);
});
