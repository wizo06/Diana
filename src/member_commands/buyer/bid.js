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

/* Bidding */
const bid = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Provide these info (separated by space)',
      description: '1. Listing ID\n2. Amount to bid (in millions)',
      fields: [
        {
          name: 'Example',
          value: `
          \`\`\`1234567890 350\`\`\`
          To exit, react ❌.
          `
        }
      ],
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let askingForListingIDAndBidAmountMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await askingForListingIDAndBidAmountMessage.react('❌');

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    askingForListingIDAndBidAmountMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await askingForListingIDAndBidAmountMessage.delete();
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    /* Check for input validity */
    if (userReacted === false) {
      await askingForListingIDAndBidAmountMessage.delete();
      if (securityRules.bidInputIsValid(collected.first())) {
        let listingID = collected.first().content.split(' ')[0];
        let bidAmount = parseInt(collected.first().content.split(' ')[1]);

        await msg.author.send('Processing your requests...');
        let doc = await db.collection('listings').doc(listingID).get();

        if (doc.exists) {
          let itemType = doc.data().itemType;
          bidLogicCheck(BOT, db, msg, doc, listingID, bidAmount, itemType);
        }
        else {
          response.bidFail(msg, 2);
          bid(BOT, db, msg);
        }
      }
      else {
        bid(BOT, db, msg);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'bid() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const bidLogicCheck = async (BOT, db, msg, doc, listingID, bidAmount, itemType) => {
  try {
    let channelID;
    let embed;

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

    /*Prevent owners from bidding on their own listings*/
    if (doc.data().discordID !== msg.author.toString()) {
      /*Allow bidding if listing is still ACTIVE*/
      if (doc.data().status === 'ACTIVE') {

        /*Success*/
        if (doc.data().buyoutPrice !== 0 && bidAmount == doc.data().buyoutPrice) {
          // currentBid = bidAmount
          // status = SOLD

          saveBidderToDB(BOT, db, msg, listingID, bidAmount);

          /*Update database*/
          await db.collection('listings').doc(listingID).update({ currentBid: bidAmount, status: 'SOLD' });

          if (itemType === 'weapon') {
            embed = helper.buildWeaponEmbed(doc.data().listingID, 'SOLD', doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().weaponType, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }
          else if (itemType === 'armor') {
            embed = helper.buildArmorEmbed(doc.data().listingID, 'SOLD', doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().armorType, doc.data().classType, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }
          else if (itemType === 'accessory') {
            embed = helper.buildAccessoryEmbed(doc.data().listingID, 'SOLD', doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().accessoryType, doc.data().socketNumber, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }

          embed.color = RED;

          let message = await BOT.channels.get(channelID).fetchMessage(listingID);
          await message.edit('', { embed });
          response.bidSuccess(msg, { bidAmount: bidAmount, itemDesc: doc.data().itemDesc });

          /* Send notification */
          notification.notifySeller(0, BOT, msg, doc, bidAmount);
          notification.notifyPreviousTopBidder(BOT, db, listingID, bidAmount, doc.data().itemDesc);
          notification.notifyBuyer(BOT, msg, listingID, doc.data().itemDesc, doc.data().buyoutPrice, doc.data().discordID);
        }
        else if (doc.data().currentBid === 0 && bidAmount >= doc.data().startingPrice) {
          // currentBid = bidAmount

          saveBidderToDB(BOT, db, msg, listingID, bidAmount);

          /*Update database*/
          await db.collection('listings').doc(listingID).update({ currentBid: bidAmount });

          if (itemType === 'weapon') {
            embed = helper.buildWeaponEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().weaponType, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }
          else if (itemType === 'armor') {
            embed = helper.buildArmorEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().armorType, doc.data().classType, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }
          else if (itemType === 'accessory') {
            embed = helper.buildAccessoryEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().accessoryType, doc.data().socketNumber, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }

          let message = await BOT.channels.get(channelID).fetchMessage(listingID);
          await message.edit('', { embed });
          response.bidSuccess(msg, { bidAmount: bidAmount, itemDesc: doc.data().itemDesc });

          /* Send notification */
          notification.notifySeller(1, BOT, msg, doc, bidAmount);
        }
        else if (doc.data().currentBid !== 0 && bidAmount >= doc.data().currentBid + doc.data().minBidInc) {
          // currentBid = bidAmount

          saveBidderToDB(BOT, db, msg, listingID, bidAmount);

          /*Update database*/
          await db.collection('listings').doc(listingID).update({ currentBid: bidAmount });

          if (itemType === 'weapon') {
            embed = helper.buildWeaponEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().weaponType, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }
          else if (itemType === 'armor') {
            embed = helper.buildArmorEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().armorType, doc.data().classType, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }
          else if (itemType === 'accessory') {
            embed = helper.buildAccessoryEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
            bidAmount, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
            doc.data().itemDesc, doc.data().accessoryType, doc.data().socketNumber, doc.data().timestamp, doc.data().imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);
          }

          let message = await BOT.channels.get(channelID).fetchMessage(listingID)
          await message.edit('', { embed });
          response.bidSuccess(msg, { bidAmount: bidAmount, itemDesc: doc.data().itemDesc });

          /* Send notification */
          notification.notifySeller(2, BOT, msg, doc, bidAmount);
          notification.notifyPreviousTopBidder(BOT, db, listingID, bidAmount, doc.data().itemDesc);
        }
        /*Fails*/
        else if (doc.data().buyoutPrice !== 0 && bidAmount > doc.data().buyoutPrice) {
          // `You can not bid higher than buyout price`
          response.bidFail(mg, 7);
          bid(BOT, db, msg);
        }
        else if (doc.data().currentBid === 0 && bidAmount < doc.data().startingPrice) {
          // `You must bid higher than or equal to the ${startingPrice}`
          response.bidFail(msg, 4, { startingPrice: doc.data().startingPrice });
          bid(BOT, db, msg);
        }
        else if (doc.data().currentBid !== 0 && bidAmount < doc.data().currentBid + doc.data().minBidInc) {
          // `You must bid higher than or equal to ${currentBid} by **at least** ${minBidInc}`
          response.bidFail(msg, 3, { currentBid: doc.data().currentBid, minBidInc: doc.data().minBidInc });
          bid(BOT, db, msg);
        }
      }
      else {
        response.bidFail(msg, 6, { status: doc.data().status });
      }
    }
    else {
      response.bidFail(msg, 5);
    }
  }
  catch (err)  {
    notification.notifyd4rkwizo(BOT, 'bidLogicCheck() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const saveBidderToDB = async (BOT, db, msg, listingID, bidAmount) => {
  try {
    await db.collection('listings').doc(listingID).update({
      arrOfBidders: admin.firestore.FieldValue.arrayUnion(msg.author.toString()),
      arrOfBiddings: admin.firestore.FieldValue.arrayUnion({ bidder: msg.author.toString(), bidAmount: bidAmount })
    });
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'saveBidderToDB() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

module.exports = {
  bid
}
