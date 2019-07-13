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

/* Show My Listings */
const myListings = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Which listings would you like to see?',
      description: ':one: All\n\n:two: ACTIVE\n\n:three: SOLD\n\nTo exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let typeMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await typeMessage.react('❌');

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    typeMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(() => {
      userReacted = true;
      typeMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let userInput = collected.first().content;

      switch(userInput) {
        case '1':
          await typeMessage.delete();
          myListingsStepTwo(BOT, db, msg, 'All');
          break;
        case '2':
          await typeMessage.delete();
          myListingsStepTwo(BOT, db, msg, 'ACTIVE');
          break;
        case '3':
          await typeMessage.delete();
          myListingsStepTwo(BOT, db, msg, 'SOLD');
          break;
        default:
          await msg.author.send('Invalid number');
          await typeMessage.delete();
          myListings(BOT, db, msg);
          break;
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'myListings() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const myListingsStepTwo = async (BOT, db, msg, option) => {
  try {
    await msg.author.send('Processing your requests...');

    if (option === 'All') {
      let activeSnapshot = await db.collection('listings').where('discordID', '==', msg.author.toString()).get();
      let soldSnapshot = await db.collection('sold_listings').where('discordID', '==', msg.author.toString()).get();

      /* User does not have any listing in database */
      if (activeSnapshot.empty && soldSnapshot.empty) {
        response.mylistingsFail(msg, 0);
      }
      else {
        let arrOfActivePromises = [];
        let arrOfSoldPromises = [];

        activeSnapshot.forEach(doc => {
          arrOfActivePromises.push(new Promise(function(resolve, reject) {
            resolve(doc.data());
          }));
        });

        soldSnapshot.forEach(doc => {
          arrOfSoldPromises.push(new Promise(function(resolve, reject) {
            resolve(doc.data());
          }));
        });

        let results = await Promise.all([...arrOfActivePromises, ...arrOfSoldPromises]);
        response.mylistingsSuccess(msg, results);
      }
    }
    else if (option === 'ACTIVE') {
      let activeSnapshot = await db.collection('listings').where('discordID', '==', msg.author.toString()).where('status', '==', 'ACTIVE').get();

      /* User does not have any listing in database */
      if (activeSnapshot.empty) {
        response.mylistingsFail(msg, 1);
      }
      else {
        let arrOfActivePromises = [];

        activeSnapshot.forEach(doc => {
          arrOfActivePromises.push(new Promise(function(resolve, reject) {
            resolve(doc.data());
          }));
        });

        let results = await Promise.all([...arrOfActivePromises]);
        response.mylistingsSuccess(msg, results);
      }
    }
    else if (option === 'SOLD') {
      let activeSnapshot = await db.collection('listings').where('discordID', '==', msg.author.toString()).where('status', '==', 'SOLD').get();
      let soldSnapshot = await db.collection('sold_listings').where('discordID', '==', msg.author.toString()).get();

      /* User does not have any listing in database */
      if (activeSnapshot.empty && soldSnapshot.empty) {
        response.mylistingsFail(msg, 2);
      }
      else {
        let arrOfActivePromises = [];
        let arrOfSoldPromises = [];

        activeSnapshot.forEach(doc => {
          arrOfActivePromises.push(new Promise(function(resolve, reject) {
            resolve(doc.data());
          }));
        });

        soldSnapshot.forEach(doc => {
          arrOfSoldPromises.push(new Promise(function(resolve, reject) {
            resolve(doc.data());
          }));
        });

        let results = await Promise.all([...arrOfActivePromises, ...arrOfSoldPromises]);
        response.mylistingsSuccess(msg, results);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'myListingsStepTwo() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

module.exports = {
  myListings
}
