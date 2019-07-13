const admin = require('firebase-admin');
const config = require('../config/config.json');
const discord = require('discord.js');
const helper = require('./helper.js');
const moment = require('moment');
const notification = require('./notification.js');
const package = require('../package.json');
const response = require('./response.js');
const securityRules = require('./securityRules.js');
const serviceAccount = require('../config/listingbot-9e0b2-firebase-adminsdk-r3c21-9b685f8c54.json');

/* Importing SELLER commands */
const { create } = require('./member_commands/seller/create.js');
const { cancel } = require('./member_commands/seller/cancel.js');
const { myListings } = require('./member_commands/seller/mylistings.js');

/* Importing BUYER commands */
const { bid } = require('./member_commands/buyer/bid.js');
const { mybids } = require('./member_commands/buyer/mybids.js');

/* Misc */
cost { myign } = require ('./member_commands/misc/myign.js');
cost { search } = require ('./member_commands/misc/search.js');
cost { getListing } = require ('./member_commands/misc/getlisting.js');
cost { help } = require ('./member_commands/misc/help.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

const BOT = new discord.Client();

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

/* Admin */
const adminCreateWeapon = async msg => {
  let arrOfArgs = msg.content.split(' ');


};

const adminCreateArmor = async msg => {

};

const adminCreateAccessory = async msg => {
  // !admincreateaccessory <expiration> <ign> <currentBid> <minBidInc> <discordID> <startingPrice> <buyoutPrice> <itemDesc> <accessoryType> <socketNumber> <imgUrl>
  try {
    let arrOfArgs = msg.content.split('"');

    if (arrOfArgs.length === 23) {
      let expiration = arrOfArgs[1];
      let ign = arrOfArgs[3];
      let currentBid = arrOfArgs[5];
      let minBidInc = arrOfArgs[7];
      let discordID = arrOfArgs[9];
      let startingPrice = arrOfArgs[11];
      let buyoutPrice = arrOfArgs[13];
      let itemDesc = arrOfArgs[15];
      let accessoryType = arrOfArgs[17];
      let socketNumber = arrOfArgs[19];
      let imgUrl = arrOfArgs[21];

      let embed = helper.buildAccessoryEmbed('123456789', 'ACTIVE', expiration, ign, currentBid, minBidInc, `<@${discordID}>`, startingPrice, buyoutPrice, itemDesc, accessoryType, socketNumber, moment().toISOString(),
      imgUrl, `© Diana v${package.version} built by d4rkwizo#0006`);

      let listingPost = await BOT.channels.get(config.accessoryChannelID).send('', { embed });


    }
    else {
      msg.channel.send('Wrong number of arguments. Enclose arguments with double quotes. ```!admincreateaccessory <expiration> <ign> <currentBid> <minBidInc> <discordID> <startingPrice> <buyoutPrice> <itemDesc> <accessoryType> <socketNumber> <imgUrl>```')
    }
  }
  catch (err) {
    console.log(err);
  }
};

const adminDelete = async msg => {
  try {
    let arrOfArgs = msg.content.split(' ');

    if (arrOfArgs.length === 2) {
      let listingID = arrOfArgs[1];

      let doc = await db.collection('listings').doc(listingID).get();

      if (doc.exists) {
        let itemType = doc.data().itemType;

        await db.collection('listings').doc(listingID).delete();

        if (itemType === 'weapon') {
          let listing = await BOT.channels.get(config.weaponChannelID).fetchMessage(listingID);
          await listing.delete();
          await msg.channel.send(`Success! Listing \`${listingID}\` has been deleted in the database and in Discord.`);
        }
        else if (itemType === 'armor') {
          let listing = await BOT.channels.get(config.armorChannelID).fetchMessage(listingID);
          await listing.delete();
          await msg.channel.send(`Success! Listing \`${listingID}\` has been deleted in the database and in Discord.`);
        }
        else if (itemType === 'accessory') {
          let listing = await BOT.channels.get(config.accessoryChannelID).fetchMessage(listingID);
          await listing.delete();
          await msg.channel.send(`Success! Listing \`${listingID}\` has been deleted in the database and in Discord.`);
        }
      }
      else {
        await msg.channel.send('Listing ID is not in database.');
      }
    }
    else {
      await msg.channel.send('Wrong usage. Please try `!admindelete listingID`');
    }
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const adminSetIGN = async msg => {
  let arrOfArgs = msg.content.split(' ');

  if (arrOfArgs.length === 3) {
    let discordID = arrOfArgs[1];
    let ign = arrOfArgs[2];

    await db.collection('users').doc(discordID).set({ ign: ign });
    await msg.channel.send(`Success! <@${discordID}> IGN is now \`${ign}\`.`);
  }
  else {
    await msg.channel.send('Wrong usage. Please try `!adminsetign discordID IGN`');
  }
};

const adminGetIGN = async msg => {
  try {
    let arrOfArgs = msg.content.split(' ');

    if (arrOfArgs.length === 2) {
      let discordID = arrOfArgs[1];

      let doc = await db.collection('users').doc(discordID).get();

      if (doc.exists) {
        await msg.channel.send(`<@${discordID}> 's IGN is ${doc.data().ign}`);
      }
      else {
        await msg.channel.send(`<@${discordID}> does not have an IGN in the database.`);
      }
    }
    else {
      await msg.channel.send('Wrong usage. Please try `!admingetign discordID`');
    }
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const adminGetListing = async msg => {
  try {
    let arrOfArgs = msg.content.split(' ');

    if (arrOfArgs.length === 2) {
      let listingID = arrOfArgs[1];

      let doc = await db.collection('listings').doc(listingID).get();

      if (doc.exists) {
        msg.channel.send()
        let user = await BOT.fetchUser('105897471049207808');
        user.send('```JSON.stringify(doc.data())```');
      }
      else {

      }
    }
    else {

    }

  }
  catch (err) {
    console.log(err);
  }
};

const expiredWithNoBid = async msg => {
  try {
    let arrOfArgs = msg.content.split(' ');

    let sellerDiscordID = arrOfArgs[1];
    let listingID = arrOfArgs[2];
    let buyoutPrice = arrOfArgs[3];
    let imgUrl = arrOfArgs[4].slice(1,-1);

    let embed = {
      title: 'Listing expired with no bids',
      description: `Listing ID: ${listingID}\nBuyout Price: ${buyoutPrice}`,
      image: {
        url: imgUrl
      }
    };

    let user = await BOT.fetchUser(sellerDiscordID);
    await user.send('', { embed });

    await msg.channel.send('Copy that.');
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const expiredWithBidSeller = async msg => {
  try {
    let arrOfArgs = msg.content.split(' ');

    let sellerDiscordID = arrOfArgs[1];
    let listingID = arrOfArgs[2];
    let buyoutPrice = arrOfArgs[3];
    let imgUrl = arrOfArgs[4].slice(1,-1);
    let buyerDiscordID = arrOfArgs[5];
    let currentBid = arrOfArgs[6];

    let embed = {
      title: 'Listing expired with bids on it!',
      description: `Listing ID: ${listingID}\nBuyout Price: ${buyoutPrice}\nTop bidder: <@${buyerDiscordID}>\nTop Bid: ${currentBid}`,
      image: {
        url: imgUrl
      }
    };

    let user = await BOT.fetchUser(sellerDiscordID);
    await user.send('', { embed });

    await msg.channel.send('Copy that.');
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const expiredWithBidBuyer = async msg => {
  try {
    let arrOfArgs = msg.content.split(' ');

    let sellerDiscordID = arrOfArgs[1];
    let listingID = arrOfArgs[2];
    let buyoutPrice = arrOfArgs[3];
    let imgUrl = arrOfArgs[4].slice(1,-1);
    let buyerDiscordID = arrOfArgs[5];
    let currentBid = arrOfArgs[6];

    let embed = {
      title: 'Listing expired and you won the bid!',
      description: `Listing ID: ${listingID}\nBuyout Price: ${buyoutPrice}\nSeller: <@${sellerDiscordID}>`,
      image: {
        url: imgUrl
      }
    };

    let user = await BOT.fetchUser(buyerDiscordID);
    await user.send('', { embed });

    await msg.channel.send('Copy that.');
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const edit = async msg => {
  //!edit <Listing ID> <Field> <Value>
  //acceptingTrades, ign, minBidInc, buyoutPrice, itemDesc, imgUrl

  if (securityRules.editArgsAreValid(msg)) {
    let arrOfArgs = msg.content.split(' ').slice(1);

    let listingID = arrOfArgs[0];
    let field = arrOfArgs[1];
    let value = arrOfArgs[2];

    try {
      msg.author.send('Please wait while I process your request.');

      let doc = await db.collection('listings').doc(listingID).get();

      if (doc.exists) {
        if (doc.data().discordID === msg.author.toString()) {
          if (doc.data().status === 'ACTIVE') {

            if (field === 'acceptingTrades') {
              await db.collection('listings').doc(listingID).update({ acceptingTrades: value });

              let embed = helper.constructEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
              doc.data().currentBid, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice,
              doc.data().buyoutPrice, value, doc.data().itemDesc, doc.data().timestamp, doc.data().imgUrl);

              await helper.editListing(BOT, listingID, embed);
              response.editSuccess(msg, { field, value });
            }
            else if (field === 'ign') {
              await db.collection('listings').doc(listingID).update({ ign: value });

              let embed = helper.constructEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, value,
              doc.data().currentBid, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice,
              doc.data().buyoutPrice, doc.data().acceptingTrades, doc.data().itemDesc, doc.data().timestamp, doc.data().imgUrl);

              await helper.editListing(BOT, listingID, embed);
              response.editSuccess(msg, { field, value });
            }
            else if (field === 'minBidInc') {
              await db.collection('listings').doc(listingID).update({ minBidInc: value });

              let embed = helper.constructEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
              doc.data().currentBid, value, doc.data().discordID, doc.data().startingPrice, doc.data().buyoutPrice,
              doc.data().acceptingTrades, doc.data().itemDesc, doc.data().timestamp, doc.data().imgUrl);

              await helper.editListing(BOT, listingID, embed);
              response.editSuccess(msg, { field, value });
            }
            else if (field === 'buyoutPrice') {
              await db.collection('listings').doc(listingID).update({ buyoutPrice: value });

              let embed = helper.constructEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
              doc.data().currentBid, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice, value,
              doc.data().acceptingTrades, doc.data().itemDesc, doc.data().timestamp, doc.data().imgUrl);

              await helper.editListing(BOT, listingID, embed);
              response.editSuccess(msg, { field, value });
            }
            else if (field === 'itemDesc') {
              value = arrOfArgs.slice(2).join(' ');

              await db.collection('listings').doc(listingID).update({ itemDesc: value });

              let embed = helper.constructEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
              doc.data().currentBid, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice,
              doc.data().buyoutPrice, doc.data().acceptingTrades, value, doc.data().timestamp, doc.data().imgUrl);

              await helper.editListing(BOT, listingID, embed);
              response.editSuccess(msg, { field, value });
            }
            else if (field === 'imgUrl') {
              await db.collection('listings').doc(listingID).update({ imgUrl: value });

              let embed = helper.constructEmbed(doc.data().listingID, doc.data().status, doc.data().expiration, doc.data().ign,
              doc.data().currentBid, doc.data().minBidInc, doc.data().discordID, doc.data().startingPrice,
              doc.data().buyoutPrice, doc.data().acceptingTrades, doc.data().itemDesc, doc.data().timestamp, value);

              try {
                await helper.editListing(BOT, listingID, embed);
                response.editSuccess(msg, { field, value });
              }
              catch (err) {
                if (err.code === 50035) response.editFail(msg, 5);
                else console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
              }
            }
          }
          else {
            response.editFail(msg, 6);
          }
        }
        else {
          response.editFail(msg, 1);
        }
      }
      else {
        response.editFail(msg, 3);
      }
    }
    catch (err) {
      console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
    }
  }
};

const test = msg => {
  let expiration = moment('Feb 28, 2019 23:59:59', 'MMM DD, YYYY HH:mm:ss', true);
  console.log(expiration.diff(moment(), 'hours'));
};

const userIsMember = msg => {
  if (BOT.guilds.get(config.guildID).members.get(msg.author.id) &&
      BOT.guilds.get(config.guildID).members.get(msg.author.id).roles.get(config.memberRole)) {
    return true;
  }
  else {
    return false;
  }
};

const userIsAdmin = msg => {
  if (BOT.guilds.get(config.guildID).members.get(msg.author.id) &&
      BOT.guilds.get(config.guildID).members.get(msg.author.id).roles.get(config.adminRole)) {
    return true;
  }
  else {
    return false;
  }
};

/*Listening to incoming messages*/
BOT.on('message', msg => {
  /*Ignore messages from self*/
  if (msg.author.id === BOT.user.id) return;

  let command = msg.content.split(' ')[0];

  switch(msg.channel.type) {
    /*Guild Messages*/
    case 'text':
      /* Super commands for Admin role */
      if (userIsAdmin(msg)) {
        switch(command) {
          // case '!admincreateweapon':
          //   adminCreateWeapon(msg);
          //   break;
          // case '!admincreatearmor':
          //   adminCreateArmor(msg);
          //   break;
          case '!admincreateaccessory':
            adminCreateAccessory(msg);
            break;
          // case '!adminedit':
          //   adminEdit(msg);
          //   break;
          case '!admindelete': // done
            adminDelete(msg);
            break;
          case '!admingetlisting':
            adminGetListing(msg);
            break;
          case '!adminsetign': // done
            adminSetIGN(msg);
            break;
          case '!admingetign': // done
            adminGetIGN(msg);
            break;
          case '!expiredwithnobid': // done
            expiredWithNoBid(msg);
            break;
          case '!expiredwithbidseller': // done
            expiredWithBidSeller(msg);
            break;
          case '!expiredwithbidbuyer': // done
            expiredWithBidBuyer(msg);
            break;
          case '!test':
            test(msg);
            break;
          default:
            break;
        }
      }
      break;
    /*Direct Messages*/
    case 'dm':
      console.log(`${FgYellow}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg.author.tag}: ${msg.content}${Reset}`);

      /* Allow Shank to kill the bot for emergency purposes */
      if (msg.author.id === '119668193089421314' && msg.content === '!kill') process.abort();

      /* Regular commands for Member role */
      if (userIsMember(msg)) {
        switch(command) {
          /* Seller */
          case '!create': // done
            create(BOT, db, msg);
            break;
          case '!cancel': // done
            cancel(BOT, db, msg);
            break;
          case '!mylistings': // done
            myListings(BOT, db, msg);
            break;
          /* Buyer */
          case '!bid': // done
            bid(BOT, db, msg);
            break;
          case '!mybids': // done
            myBids(BOT, db, msg);
            break;
          /* Misc */
          case '!myign': // done
            myign(BOT, db, msg);
            break;
          case '!search': // done
            search(BOT, db, msg);
            break;
          case '!getlisting': // done
            getListing(BOT, db, msg);
            break;
          case '!help':
            help(msg);
            break;
          default:
            break;
        }
      }
      break;
  }
});

/* Greet a new member*/
BOT.on('guildMemberAdd', async guildMember => {
  try {
    console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${guildMember.user.tag} joined the guild${Reset}`);

    let welcomeEmbed = {
      title: 'Hi, I am Diana',
      color: GREEN,
      fields: [
        {
          name: 'Getting Started',
          value: 'Please read #welcome and type in your IGN here'
        }
      ],
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] Sending Welcome message to ${guildMember.user.tag}...${Reset}`);
    await guildMember.send('', { embed: welcomeEmbed });

    let collected = await guildMember.user.dmChannel.awaitMessages(() => true, { max: 1 });

    await guildMember.send('Processing your request...');
    let data = {
      ign: collected.first().content
    };

    console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] Saving ${guildMember.user.tag}'s IGN ${collected.first().content}...${Reset}`);
    await db.collection('users').doc(guildMember.user.id).set(data);

    console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] Assigning Member role to ${guildMember.user.tag}...${Reset}`);
    await BOT.guilds.get(config.guildID).members.get(guildMember.user.id).addRole(config.memberRole);

    response.myignSuccess(collected.first(), { ign: collected.first().content });

    let confirmEmbed = {
      title: `Your IGN is now: ${collected.first().content}.`,
      color: GREEN,
      description: 'If you need to update your IGN later, you can run the \`!myign\` command.',
      fields: [
        {
          name: 'Next step',
          value:  'Please read #guidelines. There will be no warnings or first strikes. The only punishment is a permanent ban.'
        }
      ],
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] Sending Next Step message to ${guildMember.user.tag}...${Reset}`);
    let confirmMessage = await guildMember.send('', { embed: confirmEmbed });
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'guildMemberAdd error', err);

    guildMember.user.send('I could not process your request. Please contact <@105897471049207808> (d4rkwizo#0006) for help.');
    // console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] [${guildMember.user.tag}] ${err}${Reset}`);
    console.log(err);
  }
});

/* Websocket has connection error */
BOT.on('error', err => {
  console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
});

/*Log in*/
BOT.login(config.token)
.then(async () => {
  try {
    console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] Logged in as ${BOT.user.tag}${Reset}`);
    BOT.user.setActivity('MapleStory 2',{type:'PLAYING'})
    console.log(`${FgGreen}**********************************************${Reset}`);

    // console.log(BOT.guilds.get(config.guildID).roles);
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }

})
.catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));
