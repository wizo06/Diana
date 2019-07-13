const helper = require('./helper.js');
const embedColor = 65280;
const moment = require('moment');
const package = require('../package.json');
const footerText = `© Diana v${package.version} built by d4rkwizo#0006`;

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

const helpSuccess = (msg, embed) => {
  try {
    msg.author.send('', { embed })
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

/* Seller */
const createSuccess = (msg, extraInfo) => {
  msg.author.send(`Success! Listing has been created. The listing ID is \`${extraInfo.listingID}\`.`);
};

const createFail = (msg, code) => {

  switch(code) {
    case 0:
      msg.author.send('Exited.');
      break;
    case 1:
      msg.author.send('Error! Listing could not be saved. Please contact <@105897471049207808> for help.');
      break;
    default:
      break;
  }
};

const cancelSuccess = (msg, extraInfo) => {
  msg.author.send(`Success! Your listing with ID \`${extraInfo.listingID}\` has been cancelled.`);
};

const cancelFail = (msg, code, extraInfo) => {

  switch(code) {
    case 0:
      msg.author.send('Error! Listing ID does not exist. Please try again.');
      break;
    case 1:
      msg.author.send('Error! You can only cancel your own listings.');
      break;
    case 2:
      msg.author.send('Error! You can only cancel ACTIVE listings.');
      break;
    case 3:
      msg.author.send(`Error! You cannot cancel a listing that is about to expire in less than \`${extraInfo.THEHOUR}\` hour(s).`);
      break;
    default:
      break;
  }
};

const mylistingsSuccess = (msg, results) => {
  let fields = results.map(x => {
    return {
      name: x.listingID,
      value: `Status: ${x.status}\nItem description: ${x.itemDesc}\nCurrent Bid: \`${helper.showZeroAsNA(x.currentBid)}\`\nExpiration: ${x.expiration}`
    }
  });

  let embed = {
    color: embedColor,
    title: 'My listings',
    fields
  };

  msg.author.send('' , { embed });
};

const mylistingsFail = (msg, code) => {

  switch(code) {
    case 0:
      msg.author.send(`Error! You do not have any listings.`);
      break;
    case 1:
      msg.author.send(`Error! You do not have any ACTIVE listings.`);
      break;
    case 2:
      msg.author.send(`Error! You do not have any SOLD listings.`);
      break;
    default:
      break;
  }
};

/* Buyer */
const bidSuccess = (msg, extraInfo) => {
  msg.author.send(`Success! You have bid \`${extraInfo.bidAmount}\` on \`${extraInfo.itemDesc}\`.`);
};

const bidFail = (msg, code, extraInfo) => {

  switch(code) {
    case 0:
      msg.author.send('Error! Missing info. Please try again.');
      break;
    case 1:
      msg.author.send(`Error! \`Bid Amount\` must be a number. Please try again.`);
      break;
    case 2:
      msg.author.send(`Error! Listing ID does not exist. Please try again.`);
      break;
    case 3:
      msg.author.send(`Error! You need to bid higher than the \`current bid\` of \`${extraInfo.currentBid}\` m by at least \`${extraInfo.minBidInc}\` m. Please try again.`)
      break;
    case 4:
      msg.author.send(`Error! You need to bid higher than or equal to the \`starting price\` of \`${extraInfo.startingPrice}\` m. Please try again.`);
      break;
    case 5:
      msg.author.send(`Error! You cannot bid on your own listing.`);
      break;
    case 6:
      msg.author.send(`Error! You cannot bid on a listing that is \`${extraInfo.status}\`.`);
      break;
    case 7:
      msg.author.send(`Error! You cannot bid higher than buyout price. Please try again.`);
      break;
    default:
      break;
  }
};

const mybidsSuccess = (msg, results) => {
  let fields = results.map(x => {
    let myTopBid = 0;

    x.arrOfBiddings.forEach(obj => {
      if (obj.bidder === msg.author.toString() && obj.bidAmount > myTopBid) myTopBid = bidAmount;
    });

    return {
      name: x.listingID,
      value: `Item description: ${x.itemDesc}\nCurrent Bid: \`${helper.showZeroAsNA(x.currentBid)}\`\nExpiration: ${x.expiration}\nMy Bid: \`${myTopBid} m\``
    }
  })

  let embed = {
    color: embedColor,
    fields
  };

  msg.author.send('' , { embed });
};

const mybidFail = msg => {
  msg.author.send('You do not have any bid on any ACTIVE listing.');
};

/* Misc */

const myignSuccess = (msg, extraInfo) => {
  msg.author.send(`Success! Your new IGN \`${extraInfo.ign}\` has been saved.`);
};

const getlistingFail = (msg, code) => {
  // 0 Listing ID does not exist

  switch(code) {
    case 0:
      msg.author.send(`The provided Listing ID does not exist. Please try again.`);
      break;
    default:
      break;
  }
};

const editSuccess = (msg, extraInfo) => {
  msg.author.send(`Success! You have edited \`${extraInfo.field}\` to \`${extraInfo.value}\`.`);
};

const editFail = (msg, code, extraInfo) => {
  // 0 Wrong number of arguments
  // 1 User is not owner of listing
  // 2 Field is not allowed to be edited
  // 3 Listing ID is not in database
  // 4 Value must be a number
  // 5 Invalid image url
  // 6 Cannot edit a listing that is not ACTIVE

  switch(code) {
    case 0:
    msg.author.send(`There should be exactly 3 arguments when running \`!edit\`. Please run the \`!help !edit\` command to see how commands should be run.`);
    break;
    case 1:
    msg.author.send(`You can only edit your own listing.`);
    break;
    case 2:
    msg.author.send(`You can only edit the \`status\`, \`ign\`, \`minBidInc\`, \`buyoutPrice\`, \`itemDesc\`, or \`imgUrl\`.`);
    break;
    case 3:
    msg.author.send(`The provided Listing ID is not in the database.`);
    break;
    case 4:
    msg.author.send(`\`${extraInfo.field}\` must be a number.`);
    break;
    case 5:
    msg.author.send(`You must submit a valid Image Url.`);
    break;
    case 6:
    msg.author.send(`You cannot edit a listing that is not active.`);
    break;
    default:
    break;
  }
};

module.exports = {
  sendHelpMessage,
  /* Seller */
  createSuccess,
  createFail,
  cancelSuccess,
  cancelFail,
  mylistingsSuccess,
  mylistingsFail,
  /* Buyer */
  bidSuccess,
  bidFail,
  mybidsSuccess,
  mybidFail,
  /* Misc */
  myignSuccess,
  getlistingFail,
  /* Admin */
  editSuccess,
  editFail,
};
