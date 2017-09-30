import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
// import { NashLTC } from './NashLTC';
// import { NashTrinity } from './NashTrinity';
import { Nash } from './Nash';


SyncedCron.config({ log: false, utc: true });
SyncedCron.start();

SyncedCron.add({
  name: "Nash",
  schedule(parser) {
    return parser.text('every 10 seconds');
  },
  job() {
    Nash();
  },
});

console.log("Nash is running...");


/*
SyncedCron.config({ log: false, utc: true });
SyncedCron.start();

SyncedCron.add({
  name: "NashLTC",
  schedule(parser) {
    return parser.text('every 10 seconds');
  },
  job() {
    NashLTC();
  },
});

console.log("NashLTC is running...");



SyncedCron.config({ log: false, utc: true });
SyncedCron.start();

SyncedCron.add({
  name: "NashTrinity",
  schedule(parser) {
    return parser.text('every 10 seconds');
  },
  job() {
    NashTrinity();
  },
});

console.log("NashTrinity is running...");
*/
