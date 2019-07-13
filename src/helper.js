const config = require('../config/prodConfig.json');
const package = require('../package.json');
const green = 65280;

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const showZeroAsNA = x => {
  if (x == '0') return 'N/A';
  else return x;
};

/* Weapon */
const buildWeaponEmbed = (
    listingID,
    status,
    expiration,
    ign,
    currentBid,
    minBidInc,
    discordID,
    startingPrice,
    buyoutPrice,
    itemDesc,
    weaponType,
    timestamp,
    imgUrl,
    footer) => {
  return {
    color: green,
    fields: [
      {
        name: 'Listing ID',
        value: listingID,
        inline: true
      },
      {
        name: 'Status',
        value: status,
        inline: true
      },
      {
        name: 'Expiration',
        value: expiration,
        inline: true
      },
      {
        name: 'Main IGN',
        value: ign,
        inline: true
      },
      {
        name: 'Current Bid',
        value: currentBid,
        inline: true
      },
      {
        name: 'Minimum Bid Increment',
        value: `${minBidInc} m`,
        inline: true
      },
      {
        name: 'Discord ID',
        value: discordID,
        inline: true
      },
      {
        name: 'Starting Price',
        value: `${startingPrice} m`,
        inline: true
      },
      {
        name: 'Buyout Price',
        value: `${buyoutPrice} m`,
        inline: true
      },
      {
        name: 'Item Description',
        value: itemDesc,
        inline: true
      },
      {
        name: 'Weapon Type',
        value: weaponType,
        inline: true
      }
    ],
    timestamp: timestamp,
    image: {
      url: imgUrl
    },
    footer: {
      text: footer
    }
  };
};

const weaponNumberToWeaponType = number => {
  switch(number) {
    case '1':
      return 'Blade';
      break;
    case '2':
      return 'Bow';
      break;
    case '3':
      return 'Cannon';
      break;
    case '4':
      return 'Codex';
      break;
    case '5':
      return 'Dagger';
      break;
    case '6':
      return 'Greatsword';
      break;
    case '7':
      return 'Longsword';
      break;
    case '8':
      return 'Orb';
      break;
    case '9':
      return 'Scepter';
      break;
    case '10':
      return 'Shield';
      break;
    case '11':
      return 'Staff';
      break;
    case '12':
      return 'Thrown Weapon';
      break;
  }
};

/* Armor */
const buildArmorEmbed = (
    listingID,
    status,
    expiration,
    ign,
    currentBid,
    minBidInc,
    discordID,
    startingPrice,
    buyoutPrice,
    itemDesc,
    armorType,
    classType,
    timestamp,
    imgUrl,
    footer) => {
  return {
    color: green,
    fields: [
      {
        name: 'Listing ID',
        value: listingID,
        inline: true
      },
      {
        name: 'Status',
        value: status,
        inline: true
      },
      {
        name: 'Expiration',
        value: expiration,
        inline: true
      },
      {
        name: 'Main IGN',
        value: ign,
        inline: true
      },
      {
        name: 'Current Bid',
        value: currentBid,
        inline: true
      },
      {
        name: 'Minimum Bid Increment',
        value: `${minBidInc} m`,
        inline: true
      },
      {
        name: 'Discord ID',
        value: discordID,
        inline: true
      },
      {
        name: 'Starting Price',
        value: `${startingPrice} m`,
        inline: true
      },
      {
        name: 'Buyout Price',
        value: `${buyoutPrice} m`,
        inline: true
      },
      {
        name: 'Item Description',
        value: itemDesc,
        inline: true
      },
      {
        name: 'Armor Type',
        value: armorType,
        inline: true
      },
      {
        name: 'Class',
        value: classType,
        inline: true
      }
    ],
    timestamp: timestamp,
    image: {
      url: imgUrl
    },
    footer: {
      text: footer
    }
  };
};

const armorNumberToArmorType = number => {
  switch(number) {
    case '1':
      return 'Headgear';
      break;
    case '2':
      return 'Top';
      break;
    case '3':
      return 'Bottom';
      break;
    case '4':
      return 'Gloves';
      break;
    case '5':
      return 'Shoes';
      break;
  }
};

const classNumberToClassType = number => {
  switch(number) {
    case '1':
      return 'Archer';
      break;
    case '2':
      return 'Assassin';
      break;
    case '3':
      return 'Berserker';
      break;
    case '4':
      return 'Heavy Gunner';
      break;
    case '5':
      return 'Knight';
      break;
    case '6':
      return 'Priest';
      break;
    case '7':
      return 'Runeblade';
      break;
    case '8':
      return 'Sould Binder';
      break;
    case '9':
      return 'Thief';
      break;
    case '10':
      return 'Wizard';
      break;
  }
};

/* Accessory */
const buildAccessoryEmbed = (
    listingID,
    status,
    expiration,
    ign,
    currentBid,
    minBidInc,
    discordID,
    startingPrice,
    buyoutPrice,
    itemDesc,
    accessoryType,
    socketNumber,
    timestamp,
    imgUrl,
    footer) => {
  return {
    color: green,
    fields: [
      {
        name: 'Listing ID',
        value: listingID,
        inline: true
      },
      {
        name: 'Status',
        value: status,
        inline: true
      },
      {
        name: 'Expiration',
        value: expiration,
        inline: true
      },
      {
        name: 'Main IGN',
        value: ign,
        inline: true
      },
      {
        name: 'Current Bid',
        value: currentBid,
        inline: true
      },
      {
        name: 'Minimum Bid Increment',
        value: `${minBidInc} m`,
        inline: true
      },
      {
        name: 'Discord ID',
        value: discordID,
        inline: true
      },
      {
        name: 'Starting Price',
        value: `${startingPrice} m`,
        inline: true
      },
      {
        name: 'Buyout Price',
        value: `${buyoutPrice} m`,
        inline: true
      },
      {
        name: 'Item Description',
        value: itemDesc,
        inline: true
      },
      {
        name: 'Accessory Type',
        value: accessoryType,
        inline: true
      },
      {
        name: 'Sockets',
        value: socketNumber,
        inline: true
      }
    ],
    timestamp: timestamp,
    image: {
      url: imgUrl
    },
    footer: {
      text: footer
    }
  };
};

const accessoryNumberToAccessoryType = number => {
  switch(number) {
    case '1':
      return 'Necklace';
      break;
    case '2':
      return 'Cape';
      break;
    case '3':
      return 'Earrings';
      break;
    case '4':
      return 'Belt';
      break;
    case '5':
      return 'Ring';
      break;
  }
};

const editListing = (BOT, listingID, embed) => {
  new Promise(async (resolve, reject) => {
    try {
      let message = await BOT.channels.get(config.listingChannelID).fetchMessage(listingID)
      await message.edit('', { embed });
      resolve();
    }
    catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  numberWithCommas,
  showZeroAsNA,
  buildWeaponEmbed,
  weaponNumberToWeaponType,
  buildArmorEmbed,
  armorNumberToArmorType,
  classNumberToClassType,
  buildAccessoryEmbed,
  accessoryNumberToAccessoryType
};
