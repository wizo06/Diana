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

const sendHelpMessage = msg => {
  try {
    let embed = {
      title: 'List of available commands',
      color: embedColor,
      fields: [
        {
          name: '-----------------------',
          value: '**For SELLERS**'
        },
        {
          name: '📈!create',
          value: `Create a new listing.`
        },
        {
          name: '🚫!cancel',
          value: `Cancel a listing.`
        },
        {
          name: '📃!mylistings',
          value: `See all your listings.`
        },
        {
          name: '-----------------------',
          value: '**For BUYERS**'
        },
        {
          name: '💰!bid',
          value: `Bid on a listing.`
        },
        {
          name: '💰!mybids',
          value: 'See all your biddings.'
        },
        {
          name: '-----------------------',
          value: '**Misc**'
        },
        {
          name: '🔄!myign',
          value: `Update your IGN.`
        },
        {
          name: '🔍!search',
          value: 'Search for listings from a filter.'
        },
        {
          name: '📃!getlisting',
          value: 'See all the details of a listing.'
        }
      ],
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    response.helpSuccess(msg, embed);
  }
  catch (err) {
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};
