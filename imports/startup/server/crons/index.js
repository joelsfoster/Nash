import { SyncedCron } from 'meteor/percolate:synced-cron'; // http://bunkat.github.io/later/parsers.html#text
import { Nash } from './Nash';


SyncedCron.config({ log: false, utc: true });
SyncedCron.start();

SyncedCron.add({
  name: "Nash",
  schedule(parser) {
    return parser.text('every 8 seconds');
  },
  job() {
    Nash();
  },
});

console.log("Nash is running...");
