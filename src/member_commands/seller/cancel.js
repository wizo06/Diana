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

/* Cancel */
const cancel = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Please enter the Listing ID that you want to cancel',
      description: 'To exit, react ❌.',
      fields: [
        {
          name: 'Example',
          value: `
          \`\`\`1234567890\`\`\`
          To exit, react ❌.
          `
        }
      ],
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let listingIDMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await listingIDMessage.react('❌');

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    listingIDMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await listingIDMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let listingID = collected.first().content;

      await listingIDMessage.delete();

      let doc = await db.collection('listings').doc(listingID).get();

      if (doc.exists) {
        if (doc.data().discordID === msg.author.toString()) {
          if (doc.data().status === 'ACTIVE') {
            let expiration = moment(`${doc.data().expiration} 23:59:59`, 'MMM DD, YYYY HH:mm:ss', true);

            if (expiration.diff(moment(), 'hours') < THEHOUR) {
              response.cancelFail(msg, 3, { THEHOUR });
            }
            else {
              let itemType = doc.data().itemType;
              let channelID;

              switch(itemType) {
                case 'weapon':
                  channelID = config.weaponChannelID;
                  break;
                case 'armor':
                  channelID = config.armorChannelID;
                  break;
                case 'accessory':
                  channelID = config.accessoryChannelID;
                  break;
              }

              await db.collection('listings').doc(listingID).delete();
              let message = await BOT.channels.get(channelID).fetchMessage(listingID);
              await message.delete();
              response.cancelSuccess(msg, { listingID });

              /* Notify any bidders that the listing has been cancelled */
              notification.notifyBuyerForCancellation(BOT, doc.data());
            }
          }
          else {
            response.cancelFail(msg, 2);
          }
        }
        else {
          response.cancelFail(msg, 1);
        }
      }
      else {
        response.cancelFail(msg, 0);
        cancel(msg);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'cancel() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

module.exports = {
  cancel
};
