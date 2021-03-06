const config = require('../../../config/devConfig.json');
const moment = require('moment');
const notification = require('../../notification.js');
const helper = require('../../helper.js');
const response = require('../../response.js');
const securityRules = require('../../securityRules.js');
const package = require('../../../package.json');

// Colors
const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const RED = 16711680;
const GREEN = 65280;
const GREY = 8158332;
const THEHOUR = 1;

/* Show My Biddings */
const myBids = async (BOT, db, msg) => {
  try {
    await msg.author.send('Processing your request...');

    let snapshot = await db.collection('listings').where('arrOfBidders', 'array-contains', msg.author.toString()).where('status', '==', 'ACTIVE').get();

    if (snapshot.empty) {
      response.mybidFail(msg);
    }
    else {
      let arrOfBiddingPromise = [];

      snapshot.forEach(doc => {
        arrOfBiddingPromise.push(new Promise(function(resolve, reject) {
          resolve(doc.data());
        }));
      });

      let results = await Promise.all([...arrOfBiddingPromise]);
      response.mybidsSuccess(msg, results);
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'myBids() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

module.exports = {
  myBids
}
