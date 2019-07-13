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

/* Get listing */
const getListing = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Please enter the Listing ID that you want to see',
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
        let embed;

        if (doc.data().itemType === 'weapon') {
          embed = helper.buildWeaponEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign, doc.data().currentBid, doc.data().minBidInc,
          doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice, doc.data().itemDesc, doc.data().weaponType, doc.data().timestamp, doc.data().imgUrl,
          `© Diana v${package.version} built by d4rkwizo#0006`);
        }
        else if (doc.data().itemType === 'armor') {
          embed = helper.buildArmorEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign, doc.data().currentBid, doc.data().minBidInc,
          doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice, doc.data().itemDesc, doc.data().armorType, doc.data().classType, doc.data().timestamp,
          doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
        }
        else if (doc.data().itemType === 'accessory') {
          embed = helper.buildAccessoryEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign, doc.data().currentBid, doc.data().minBidInc,
          doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice, doc.data().itemDesc, doc.data().accessoryType, doc.data().socketNumber, doc.data().timestamp,
          doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
        }

        if (doc.data().status === 'SOLD') embed.color = RED;

        msg.author.send('', { embed });
      }
      else {
        let doc = await db.collection('past_listings').doc(listingID).get();

        if (doc.exists) {
          let embed;

          if (doc.data().itemType === 'weapon') {
            embed = helper.buildWeaponEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign, doc.data().currentBid, doc.data().minBidInc,
            doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice, doc.data().itemDesc, doc.data().weaponType, doc.data().timestamp, doc.data().imgUrl,
            `© Diana v${package.version} built by d4rkwizo#0006`);
          }
          else if (doc.data().itemType === 'armor') {
            embed = helper.buildArmorEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign, doc.data().currentBid, doc.data().minBidInc,
            doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice, doc.data().itemDesc, doc.data().armorType, doc.data().classType, doc.data().timestamp,
            doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }
          else if (doc.data().itemType === 'accessory') {
            embed = helper.buildAccessoryEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign, doc.data().currentBid, doc.data().minBidInc,
            doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice, doc.data().itemDesc, doc.data().accessoryType, doc.data().socketNumber, doc.data().timestamp,
            doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }

          if (doc.data().status === 'SOLD') embed.color = RED;

          msg.author.send('', { embed });
        }
        else {
          response.getlistingFail(msg, 0);
          getListing(msg);
        }
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'getListing() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

module.exports = {
  getListing
}
