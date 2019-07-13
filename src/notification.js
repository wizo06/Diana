const moment = require('moment');

const RED = 16711680;
const GREEN = 65280;
const GREY = 8158332;

const notifySeller = async (code, BOT, msg, doc, bidAmount) => {
  try {
    if (code === 0) {
      let user = await BOT.fetchUser(doc.data().discordID.match(/[0-9]*/g)[2]);
      let embed = {
        title: 'Item Sold',
        color: GREEN,
        description: `Listing ID: \`${doc.data().listingID}\`\nItem description: \`${doc.data().itemDesc}\`\nBuyout Price: \`${doc.data().buyoutPrice}\` m\nBuyer: ${msg.author.toString()}`
      };

      user.send('', { embed });
    }
    else if (code === 1) {
      let user = await BOT.fetchUser(doc.data().discordID.match(/[0-9]*/g)[2]);
      let embed = {
        title: 'Listing got an initial bid',
        description: `Listing ID: \`${doc.data().listingID}\`\nItem description: \`${doc.data().itemDesc}\`\nStarting Price: \`${doc.data().startingPrice}\` m\nCurrent Bid: \`${bidAmount}\` m`
      };

      user.send('', { embed });
    }
    else if (code === 2) {
      let user = await BOT.fetchUser(doc.data().discordID.match(/[0-9]*/g)[2]);
      let embed = {
        title: 'Listing got bid on',
        color: GREEN,
        description: `Listing ID: \`${doc.data().listingID}\`\nItem description: \`${doc.data().itemDesc}\`\nCurrent Bid: \`${bidAmount}\` m`
      };

      user.send('', { embed });
    }
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const notifyPreviousTopBidder = async (BOT, db, listingID, bidAmount, itemDesc) => {
  try {
    let doc = await db.collection('listings').doc(listingID).get();
    if (doc.exists) {
      let previousTopBidder = await doc.data().arrOfBiddings[doc.data().arrOfBiddings.length-2].bidder;
      let previousTopBidAmount = await doc.data().arrOfBiddings[doc.data().arrOfBiddings.length-2].bidAmount;
      let user = await BOT.fetchUser(previousTopBidder.match(/[0-9]*/g)[2]);
      let embed = {
        title: 'You have been outbid',
        color: GREEN,
        description: `Listing ID: \`${listingID}\`\nItem description: \`${itemDesc}\`\nYour bid was : \`${previousTopBidAmount}\` m\nCurrent top bid is: \`${bidAmount}\` m`
      };

      user.send('', { embed });
    }
    else {
      // could not find listingID. :shrugs:
    }
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const notifyBuyer = async (BOT, msg, listingID, itemDesc, buyoutPrice, sellerDiscordID) => {
  try {
    let embed = {
      title: 'Item Purchased',
      color: GREEN,
      description: `Listing ID: \`${listingID}\`\nItem description: \`${itemDesc}\`\nBuyout Price: \`${buyoutPrice}\` m\nSeller: ${sellerDiscordID}`
    };

    msg.author.send('', { embed });
  }
  catch (err) {
    notifyd4rkwizo(BOT, 'notifyBuyer() error', err);
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const notifyBuyerForCancellation = async (BOT, data) => {
  try {
    let arrOfUniqueBidders = [...new Set(data.arrOfBidders)];
    let listingID = data.listingID;
    let itemDesc = data.itemDesc;
    let sellerDiscordID = data.discordID;
    let imgUrl = data.imgUrl;

    let embed = {
      title: 'A listing that you bid on has been cancelled by the seller',
      description: `Listing ID: ${listingID}\nItem Description: ${itemDesc}\nSeller: ${sellerDiscordID}`,
      image: {
        url: imgUrl
      }
    };

    arrOfUniqueBidders.forEach(async bidder => {

      let user = await BOT.fetchUser(bidder.match(/[0-9]*/g)[2]);
      user.send('', { embed });
    });
  }
  catch (err) {
    console.log(err);
  }
};

const notifyd4rkwizo = async (BOT, title, err) => {
  try {
    let d4rkwizo = await BOT.fetchUser('105897471049207808');

    let embed = {
      title: `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${title}`,
      color: GREEN,
      description: err
    };

    d4rkwizo.send('', { embed });
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

module.exports = {
  notifySeller,
  notifyPreviousTopBidder,
  notifyBuyer,
  notifyBuyerForCancellation,
  notifyd4rkwizo
}
