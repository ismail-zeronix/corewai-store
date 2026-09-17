import { bootstrapWorker, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

runMigrations(config)
    .then(() => bootstrapWorker(config))
    .then(worker => worker.startJobQueue())
    .catch(err => {
        console.log(err);
    });
