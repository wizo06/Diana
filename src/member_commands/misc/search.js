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

/* Search */
const search = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that you want to search',
      description: ':one: Weapon\n\n:two: Armor\n\n:three: Accessory\n\nTo exit, react ❌.',
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
          searchWeapon(BOT, db, msg);
          break;
        case '2':
          await typeMessage.delete();
          searchArmor(BOT, db, msg);
          break;
        case '3':
          await typeMessage.delete();
          searchAccessory(BOT, db, msg);
          break;
        default:
          await msg.author.send('Invalid number');
          await typeMessage.delete();
          search(BOT, db, msg);
          break;
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'search() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

/* Search Weapon */
const searchWeapon = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that you want to search',
      description: ':one: Blade\n\n:two: Bow\n\n:three: Cannon\n\n:four: Codex\n\n:five: Dagger\n\n:six: Greatsword\n\n:seven: Longsword\n\n:eight: Orb\n\n:nine: Scepter\n\n:one::zero: Shield\n\n:one::one: Staff\n\n:one::two: Thrown Weapon\n\nTo go back, react ⏪. To exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let weaponTypeMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await weaponTypeMessage.react('⏪');
    await weaponTypeMessage.react('❌');

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    weaponTypeMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await weaponTypeMessage.delete();
      search(BOT, db, msg);
    });

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    weaponTypeMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await weaponTypeMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let weaponNumber = collected.first().content;

      if (weaponNumber >= 1 && weaponNumber <= 12) {
        await weaponTypeMessage.delete();
        searchWeaponKeywords(BOT, db, msg, weaponNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await weaponTypeMessage.delete();
        searchWeapon(BOT, db, msg);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'searchWeapon() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const searchWeaponKeywords = async (BOT, db, msg, weaponNumber) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in any word that you want to use as filter. This will be match against the \`Item Description\` of the listing.',
      description: 'To omit this step, react ⏩.To go back, react ⏪. To exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let filterMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await filterMessage.react('⏩');
    await filterMessage.react('⏪');
    await filterMessage.react('❌');

    /* Omit */
    const omitFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === msg.author.id;

    filterMessage.awaitReactions(omitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
      queryWithNoFilterForWeapon(BOT, db, msg, weaponNumber);
    });

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    filterMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
      searchWeapon(BOT, db, msg);
    });

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    filterMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let userInput = collected.first().content;
      await filterMessage.delete();
      queryWithFilterForWeapon(BOT, db, msg, weaponNumber, userInput);
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'searchWeaponKeywords() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const queryWithNoFilterForWeapon = async (BOT, db, msg, weaponNumber) => {
  try {
    let weaponType = helper.weaponNumberToWeaponType(weaponNumber);

    let snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'weapon').where('weaponType', '==', weaponType).get();

    if (snapshot.empty) {
      let embed = {
        color: GREEN,
        title: 'Search reults',
        description: 'None'
      };

      msg.author.send('', { embed });
    }
    else {
      let arrOfPromises = [];

      snapshot.forEach(doc => {
        arrOfPromises.push(new Promise(function(resolve, reject) {
          resolve(doc.data());
        }))
      });

      let results = await Promise.all([...arrOfPromises]);

      let fields = results.map(x => {
        return {
          name: x.listingID,
          value: `Item description: ${x.itemDesc}\nCurrent Bid: \`${helper.showZeroAsNA(x.currentBid)}\`\nBuyout Price: \`${x.buyoutPrice}\`\nExpiration: ${x.expiration}`
        }
      });

      let embed = {
        color: GREEN,
        title: 'Search reults',
        fields
      };

      msg.author.send('', { embed });
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'queryWithNoFilterForWeapon() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const queryWithFilterForWeapon = async (BOT, db, msg, weaponNumber, userInput) => {
  try {
    let weaponType = helper.weaponNumberToWeaponType(weaponNumber);

    let arrOfKeywords = userInput.toLowerCase().split(' ');

    let snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'weapon').where('weaponType', '==', weaponType).get();

    if (snapshot.empty) {
      let embed = {
        color: GREEN,
        title: 'Search reults',
        description: 'None'
      };

      msg.author.send('', { embed });
    }
    else {
      let arrOfPromises = [];

      snapshot.forEach(doc => {
        let itemDesc = doc.data().itemDesc.toLowerCase();

        /* Check if all keywords from user is a substring of itemDesc */
        let documentMatches = arrOfKeywords.every((currentKeyword) => {
          return itemDesc.indexOf(currentKeyword) > -1;
        });

        if (documentMatches) {
          arrOfPromises.push(new Promise(function(resolve, reject) {
            resolve(doc.data());
          }))
        }
      })

      let results = await Promise.all([...arrOfPromises]);

      if (results.length === 0) {
        let embed = {
          color: GREEN,
          title: 'Search reults',
          description: 'None'
        };

        msg.author.send('', { embed });
      }
      else {
        let fields = results.map(x => {
          return {
            name: x.listingID,
            value: `Item description: ${x.itemDesc}\nCurrent Bid: \`${helper.showZeroAsNA(x.currentBid)}\`\nBuyout Price: \`${x.buyoutPrice}\`\nExpiration: ${x.expiration}`
          }
        });

        let embed = {
          color: GREEN,
          title: 'Search reults',
          fields
        };

        msg.author.send('', { embed });
      }
    }

  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'queryWithFilterForWeapon() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

/* Search Armor */
const searchArmor = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that you want to search',
      description: ':one: Headgear\n\n:two: Top\n\n:three: Bottom\n\n:four: Gloves\n\n:five: Shoes\n\nTo go back, react ⏪. To exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let armorTypeMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await armorTypeMessage.react('⏪');
    await armorTypeMessage.react('❌');

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    armorTypeMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await armorTypeMessage.delete();
      search(BOT, db, msg);
    });

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    armorTypeMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await armorTypeMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let armorNumber = collected.first().content;

      if (armorNumber >= 1 && armorNumber <= 5) {
        await armorTypeMessage.delete();
        searchClass(BOT, db, msg, armorNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await armorTypeMessage.delete();
        searchArmor(BOT, db, msg);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'searchArmor() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const searchClass = async (BOT, db, msg, armorNumber) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that you want to search',
      description: ':one: Archer\n\n:two: Assassin\n\n:three: Berserker\n\n:four: Heavy Gunner\n\n:five: Knight\n\n:six: Priest\n\n:seven: Runeblade\n\n:eight: Sould Binder\n\n:nine: Thief\n\n:one::zero: Wizard\n\nTo go back, react ⏪. To exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let classTypeMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await classTypeMessage.react('⏪');
    await classTypeMessage.react('❌');

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    classTypeMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await classTypeMessage.delete();
      searchArmor(BOT, db, msg);
    });

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    classTypeMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await classTypeMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let classNumber = collected.first().content;

      if (classNumber >= 1 && classNumber <= 10) {
        await classTypeMessage.delete();
        searchArmorKeywords(BOT, db, msg, armorNumber, classNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await classTypeMessage.delete();
        searchClass(BOT, db, msg, armorNumber);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'searchClass() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const searchArmorKeywords = async (BOT, db, msg, armorNumber, classNumber) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in any word that you want to use as filter. This will be match against the \`Item Description\` of the listing.',
      description: 'To omit this step, react ⏩.To go back, react ⏪. To exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let filterMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await filterMessage.react('⏩');
    await filterMessage.react('⏪');
    await filterMessage.react('❌');

    /* Omit */
    const omitFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === msg.author.id;

    filterMessage.awaitReactions(omitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
      queryWithNoFilterForArmor(BOT, db, msg, armorNumber, classNumber);
    });

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    filterMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
      searchClass(BOT, db, msg, armorNumber);
    });

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    filterMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let userInput = collected.first().content;

      await filterMessage.delete();
      queryWithFilterForArmor(BOT, db, msg, armorNumber, classNumber, userInput);
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'searchArmorKeywords() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const queryWithNoFilterForArmor = async (BOT, db, msg, armorNumber, classNumber) => {
  try {
    let armorType = helper.armorNumberToArmorType(armorNumber);
    let classType = helper.armorNumberToArmorType(classNumber);

    let snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'armor').where('armorType', '==', armorType).where('classType', '==', classType).get();

    if (snapshot.empty) {
      let embed = {
        color: GREEN,
        title: 'Search reults',
        description: 'None'
      };

      msg.author.send('', { embed });
    }
    else {
      let arrOfPromises = [];

      snapshot.forEach(doc => {
        arrOfPromises.push(new Promise(function(resolve, reject) {
          resolve(doc.data());
        }))
      });

      let results = await Promise.all([...arrOfPromises]);

      let fields = results.map(x => {
        return {
          name: x.listingID,
          value: `Item description: ${x.itemDesc}\nCurrent Bid: \`${helper.showZeroAsNA(x.currentBid)}\`\nBuyout Price: \`${x.buyoutPrice}\`\nExpiration: ${x.expiration}`
        }
      });

      let embed = {
        color: GREEN,
        title: 'Search reults',
        fields
      };

      msg.author.send('', { embed });
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'queryWithNoFilterForArmor() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const queryWithFilterForArmor = async (BOT, db, msg, armorNumber, classNumber, userInput) => {
  try {
    let armorType = helper.armorNumberToArmorType(armorNumber);
    let classType = helper.armorNumberToArmorType(classNumber);

    let arrOfKeywords = userInput.toLowerCase().split(' ');

    let snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'armor').where('armorType', '==', armorType).where('classType', '==', classType).get();

    if (snapshot.empty) {
      let embed = {
        color: GREEN,
        title: 'Search reults',
        description: 'None'
      };

      msg.author.send('', { embed });
    }
    else {
      let arrOfPromises = [];

      snapshot.forEach(doc => {
        let itemDesc = doc.data().itemDesc.toLowerCase();

        /* Check if all keywords from user is a substring of itemDesc */
        let documentMatches = arrOfKeywords.every((currentKeyword) => {
          return itemDesc.indexOf(currentKeyword) > -1;
        });

        if (documentMatches) {
          arrOfPromises.push(new Promise(function(resolve, reject) {
            resolve(doc.data());
          }))
        }
      })

      let results = await Promise.all([...arrOfPromises]);

      if (results.length === 0) {
        let embed = {
          color: GREEN,
          title: 'Search reults',
          description: 'None'
        };

        msg.author.send('', { embed });
      }
      else {
        let fields = results.map(x => {
          return {
            name: x.listingID,
            value: `Item description: ${x.itemDesc}\nCurrent Bid: \`${helper.showZeroAsNA(x.currentBid)}\`\nBuyout Price: \`${x.buyoutPrice}\`\nExpiration: ${x.expiration}`
          }
        });

        let embed = {
          color: GREEN,
          title: 'Search reults',
          fields
        };

        msg.author.send('', { embed });
      }
    }

  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'queryWithFilterForArmor() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

/* Search Accessory */
const searchAccessory = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that you want to search',
      description: ':one: Necklace\n\n:two: Cape\n\n:three: Earrings\n\n:four: Belt\n\n:five: Ring\n\nTo go back, react ⏪. To exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let accessoryTypeMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await accessoryTypeMessage.react('⏪');
    await accessoryTypeMessage.react('❌');

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    accessoryTypeMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await accessoryTypeMessage.delete();
      search(BOT, db, msg);
    });

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    accessoryTypeMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await accessoryTypeMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let accessoryNumber = collected.first().content;

      if (accessoryNumber >= 1 && accessoryNumber <= 5) {
        await accessoryTypeMessage.delete();
        searchSockets(BOT, db, msg, accessoryNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await armorTypeMessage.delete();
        searchAccessory(BOT, db, msg);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'searchAccessory() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const searchSockets = async (BOT, db, msg, accessoryNumber) => {
  try {
    let embed = {
      color: GREEN,
      title: 'How many sockets are you searching for?',
      description: ':zero: 0\n\n:one: 1 socket\n\n:two: 2 socket\n\n:three: 3 socket\n\n:four: All of the above\n\nTo go back, react ⏪. To exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let socketTypeMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await socketTypeMessage.react('⏪');
    await socketTypeMessage.react('❌');

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    socketTypeMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await socketTypeMessage.delete();
      searchAccessory(BOT, db, msg);
    });

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    socketTypeMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await socketTypeMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let socketNumber = collected.first().content;

      if (socketNumber >= 1 && socketNumber <= 4) {
        await socketTypeMessage.delete();
        searchAccessoryKeywords(BOT, db, msg, accessoryNumber, socketNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await socketTypeMessage.delete();
        searchSockets(BOT, db, msg, accessoryNumber);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'searchSockets() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const searchAccessoryKeywords = async (BOT, db, msg, accessoryNumber, socketNumber) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in any word that you want to use as filter. This will be match against the \`Item Description\` of the listing.',
      description: 'To omit this step, react ⏩.To go back, react ⏪. To exit, react ❌.',
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let filterMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await filterMessage.react('⏩');
    await filterMessage.react('⏪');
    await filterMessage.react('❌');

    /* Omit */
    const omitFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === msg.author.id;

    filterMessage.awaitReactions(omitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
      queryWithNoFilterForAccessory(BOT, db, msg, accessoryNumber, socketNumber);
    });

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    filterMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
      searchSockets(BOT, db, msg, accessoryNumber);
    });

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    filterMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await filterMessage.delete();
    });

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    if (userReacted === false) {
      let userInput = collected.first().content;

      await filterMessage.delete();
      queryWithFilterForAccessory(BOT, db, msg, accessoryNumber, socketNumber, userInput);
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'searchAccessoryKeywords() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const queryWithNoFilterForAccessory = async (BOT, db, msg, accessoryNumber, socketNumber) => {
  try {
    let accessoryType = helper.accessoryNumberToAccessoryType(accessoryNumber);
    let snapshot;

    if (socketNumber === '0') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).where('socketNumber', '==', '0').get();
    }
    else if (socketNumber === '1') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).where('socketNumber', '==', '1').get();
    }
    else if (socketNumber === '2') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).where('socketNumber', '==', '2').get();
    }
    else if (socketNumber === '3') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).where('socketNumber', '==', '3').get();
    }
    else if (socketNumber === '4') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).get();
    }

    if (snapshot.empty) {
      let embed = {
        color: GREEN,
        title: 'Search reults',
        description: 'None'
      };

      msg.author.send('', { embed });
    }
    else {
      let arrOfPromises = [];

      snapshot.forEach(doc => {
        arrOfPromises.push(new Promise(function(resolve, reject) {
          resolve(doc.data());
        }))
      });

      let results = await Promise.all([...arrOfPromises]);

      let fields = results.map(x => {
        return {
          name: x.listingID,
          value: `Item description: ${x.itemDesc}\nCurrent Bid: \`${helper.showZeroAsNA(x.currentBid)}\`\nBuyout Price: \`${x.buyoutPrice}\`\nExpiration: ${x.expiration}`
        }
      });

      let embed = {
        color: GREEN,
        title: 'Search reults',
        fields
      };

      msg.author.send('', { embed });
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'queryWithNoFilterForAccessory() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const queryWithFilterForAccessory = async (BOT, db, msg, accessoryNumber, socketNumber, userInput) => {
  try {
    let accessoryType = helper.accessoryNumberToAccessoryType(accessoryNumber);
    let snapshot;

    let arrOfKeywords = userInput.toLowerCase().split(' ');

    if (socketNumber === '0') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).where('socketNumber', '==', '0').get();
    }
    else if (socketNumber === '1') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).where('socketNumber', '==', '1').get();
    }
    else if (socketNumber === '2') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).where('socketNumber', '==', '2').get();
    }
    else if (socketNumber === '3') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).where('socketNumber', '==', '3').get();
    }
    else if (socketNumber === '4') {
      snapshot = await db.collection('listings').where('status', '==', 'ACTIVE').where('itemType', '==', 'accessory').where('accessoryType', '==', accessoryType).get();
    }

    if (snapshot.empty) {
      let embed = {
        color: GREEN,
        title: 'Search reults',
        description: 'None'
      };

      msg.author.send('', { embed });
    }
    else {
      let arrOfPromises = [];

      snapshot.forEach(doc => {
        let itemDesc = doc.data().itemDesc.toLowerCase();

        /* Check if all keywords from user is a substring of itemDesc */
        let documentMatches = arrOfKeywords.every((currentKeyword) => {
          return itemDesc.indexOf(currentKeyword) > -1;
        });

        if (documentMatches) {
          arrOfPromises.push(new Promise(function(resolve, reject) {
            resolve(doc.data());
          }))
        }
      })

      let results = await Promise.all([...arrOfPromises]);

      if (results.length === 0) {
        let embed = {
          color: GREEN,
          title: 'Search reults',
          description: 'None'
        };

        msg.author.send('', { embed });
      }
      else {
        let fields = results.map(x => {
          return {
            name: x.listingID,
            value: `Item description: ${x.itemDesc}\nCurrent Bid: \`${helper.showZeroAsNA(x.currentBid)}\`\nBuyout Price: \`${x.buyoutPrice}\`\nExpiration: ${x.expiration}`
          }
        });

        let embed = {
          color: GREEN,
          title: 'Search reults',
          fields
        };

        msg.author.send('', { embed });
      }
    }

  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'queryWithFilterForAccessory() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};
