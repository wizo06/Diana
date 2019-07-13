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

/* Create */
const create = async (BOT, db, msg) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that corresponds to your item',
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
          createWeapon(BOT, db, msg);
          break;
        case '2':
          await typeMessage.delete();
          createArmor(BOT, db, msg);
          break;
        case '3':
          await typeMessage.delete();
          createAccessory(BOT, db, msg);
          break;
        default:
          await msg.author.send('Invalid number');
          await typeMessage.delete();
          create(BOT, db, msg);
          break;
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'create() error', err);
    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

/* Create Weapon */
const createWeapon = async (BOT, db, msg) => {
  // Blade
  // Bow
  // Cannon
  // Codex
  // Dagger
  // Greatsword
  // Longsword
  // Orb
  // Scepter
  // Shield
  // Staff
  // Thrown Weapon

  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that corresponds to your item',
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
      create(msg);
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
        askForWeaponInfo(BOT, db, msg, weaponNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await weaponTypeMessage.delete();
        createWeapon(msg);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'createWeapon() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const askForWeaponInfo = async (BOT, db, msg, weaponNumber) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Provide these info **IN ORDER** (separated by comma) **AND** attach a screenshot of your item along with your message',
      description: '1. Item Description\n2. Starting Price (in millions)\n3. Minimum Bid Increment (in millions. Must be at least 1.)\n4. Buyout Price (in millions)\n5. Bidding Window (in days)',
      fields: [
        {
          name: 'Example',
          value: `
          \`\`\`Piercing 3.2% Physical Piercing 11.2%, 300, 10, 500, 7\`\`\`
          To go back, react ⏪. To exit, react ❌.
          `
        }
      ],
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let askingForInfoMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await askingForInfoMessage.react('⏪');
    await askingForInfoMessage.react('❌');

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    askingForInfoMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await askingForInfoMessage.delete();
      createWeapon(msg);
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`))

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    askingForInfoMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await askingForInfoMessage.delete();
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`))

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    /* Check for input validity */
    if (userReacted === false) {
      await askingForInfoMessage.delete();
      if (securityRules.createInputIsValid(collected.first())) {
        await msg.author.send('Processing your requests...');
        let userDoc = await db.collection('users').doc(msg.author.id).get();
        sendListingPreviewOfWeapon(BOT, db, msg, collected.first(), userDoc.data().ign, weaponNumber);
      }
      else {
        askForWeaponInfo(BOT, db, msg, weaponNumber);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'askForWeaponInfo() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const sendListingPreviewOfWeapon = async (BOT, db, msg, userInput, userIGN, weaponNumber) => {
  try {
    console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] Sending create preview message to ${msg.author.tag}...${Reset}`);
    let arrOfArgs = userInput.content.split(',');

    let itemDesc = arrOfArgs[0];
    let startingPrice = arrOfArgs[1];
    let minBidInc = arrOfArgs[2];
    let buyoutPrice = arrOfArgs[3];
    let biddingWindow = arrOfArgs[4];

    let weaponType = helper.weaponNumberToWeaponType(weaponNumber);

    let embed = helper.buildWeaponEmbed('123456789', 'ACTIVE', moment().add(biddingWindow, 'days').format('MMM DD, YYYY'),
        userIGN, 'N/A', minBidInc, msg.author.toString(), startingPrice, buyoutPrice, itemDesc, weaponType, moment().toISOString(),
        userInput.attachments.first().url, `© Diana v${package.version} built by d4rkwizo#0006`);

    embed.title = `Here is a preview of your listing. React with ⭕ to approve or ❌ to cancel.`;

    let previewMessage = await msg.author.send('', { embed });

    await previewMessage.react('⭕');
    await previewMessage.react('❌');

    const approveFilter = (reaction, user) => reaction.emoji.name === '⭕' && user.id === msg.author.id;

    /*Wait for user to react for approval*/
    previewMessage.awaitReactions(approveFilter, { maxUsers: 1 })
    .then(async () => {
      console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg.author.tag} approved the preview.${Reset}`);
      await msg.author.send('Processing your requests...');

      await previewMessage.delete();

      embed.title = '';

      let listingPost = await BOT.channels.get(config.weaponChannelID).send('', { embed });

      try {
        let data = {
          listingID: listingPost.id,
          status: 'ACTIVE',
          expiration: moment().add(biddingWindow, 'days').format('MMM DD, YYYY'),
          ign: userIGN,
          currentBid: 0,
          minBidInc: parseInt(minBidInc),
          discordID: msg.author.toString(),
          startingPrice: parseInt(startingPrice),
          buyoutPrice: parseInt(buyoutPrice),
          itemDesc: itemDesc,
          itemType: 'weapon',
          weaponType: weaponType,
          timestamp: moment().toISOString(),
          imgUrl: userInput.attachments.first().url,
          arrOfBidders: [],
          arrOfBiddings: []
        };

        console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] Saving ${msg.author.tag}'s listing...${Reset}`);
        await db.collection('listings').doc(listingPost.id).set(data);

        response.createSuccess(msg, {listingID: listingPost.id});

        embed.fields[0].value = `${listingPost.id}`;

        listingPost.edit(`${listingPost.id}`, { embed });
      }
      catch (err) {
        console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);

        listingPost.delete();

        response.createFail(msg, 1);
      }
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));

    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    /* Wait for user to react for exit */
    previewMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg.author.tag} cancelled the preview.${Reset}`);
      await previewMessage.delete();

      response.createFail(msg, 0);
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'sendListingPreviewOfWeapon() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

/* Create Armor */
const createArmor = async (BOT, db, msg) => {
  // Headgear
  // Top
  // Bottom
  // Gloves
  // Shoes

  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that corresponds to your item',
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
      create(msg);
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
        askForClass(BOT, db, msg, armorNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await armorTypeMessage.delete();
        createArmor(msg);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'createArmor() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const askForClass = async (BOT, db, msg, armorNumber) => {
  // Archer
  // Assassin
  // Berserker
  // Heavy Gunner
  // Knight
  // Priest
  // Runeblade
  // Soul Binder
  // Thief
  // Wizard

  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that corresponds to your item',
      description: ':one: Archer\n\n:two: Assassin\n\n:three: Berserker\n\n:four: Heavy Gunner\n\n:five: Knight\n\n:six: Priest\n\n:seven: Runeblade\n\n:eight: Soul Binder\n\n:nine: Thief\n\n:one::zero: Wizard\n\nTo go back, react ⏪. To exit, react ❌.',
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
      createArmor(msg);
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
        askForArmorInfo(BOT, db, msg, armorNumber, classNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await classTypeMessage.delete();
        askForClass(BOT, db, msg, armorNumber);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'askForClass() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const askForArmorInfo = async (BOT, db, msg, armorNumber, classNumber) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Provide these info **IN ORDER** (separated by comma) **AND** attach a screenshot of your item along with your message',
      description: '1. Item Description\n2. Starting Price (in millions)\n3. Minimum Bid Increment (in millions. Must be at least 1.)\n4. Buyout Price (in millions)\n5. Bidding Window (in days)',
      fields: [
        {
          name: 'Example',
          value: `
          \`\`\`Physical Piercing 7%, 250, 20, 400, 7\`\`\`
          To go back, react ⏪. To exit, react ❌.
          `
        }
      ],
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let askingForInfoMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await askingForInfoMessage.react('⏪');
    await askingForInfoMessage.react('❌');

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    askingForInfoMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await askingForInfoMessage.delete();
      askForClass(BOT, db, msg, armorNumber);
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`))

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    askingForInfoMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await askingForInfoMessage.delete();
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    /* Check for input validity */
    if (userReacted === false) {
      await askingForInfoMessage.delete();
      if (securityRules.createInputIsValid(collected.first())) {
        await msg.author.send('Processing your requests...');
        let userDoc = await db.collection('users').doc(msg.author.id).get();
        sendListingPreviewOfArmor(BOT, db, msg, collected.first(), userDoc.data().ign, armorNumber, classNumber);
      }
      else {
        askForArmorInfo(BOT, db, msg, armorNumber, classNumber);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'askForArmorInfo() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const sendListingPreviewOfArmor = async (BOT, db, msg, userInput, userIGN, armorNumber, classNumber) => {
  try {
    console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] Sending create preview message to ${msg.author.tag}...${Reset}`);
    let arrOfArgs = userInput.content.split(',');

    let itemDesc = arrOfArgs[0];
    let startingPrice = arrOfArgs[1];
    let minBidInc = arrOfArgs[2];
    let buyoutPrice = arrOfArgs[3];
    let biddingWindow = arrOfArgs[4];

    let armorType = helper.armorNumberToArmorType(armorNumber);
    let classType = helper.classNumberToClassType(classNumber);

    let embed = helper.buildArmorEmbed('123456789', 'ACTIVE', moment().add(biddingWindow, 'days').format('MMM DD, YYYY'),
        userIGN, 'N/A', minBidInc, msg.author.toString(), startingPrice, buyoutPrice, itemDesc, armorType, classType, moment().toISOString(),
        userInput.attachments.first().url, `© Diana v${package.version} built by d4rkwizo#0006`);

    embed.title = `Here is a preview of your listing. React with ⭕ to approve or ❌ to cancel.`;

    let previewMessage = await msg.author.send('', { embed });

    await previewMessage.react('⭕');
    await previewMessage.react('❌');

    const approveFilter = (reaction, user) => reaction.emoji.name === '⭕' && user.id === msg.author.id;

    /*Wait for user to react for approval*/
    previewMessage.awaitReactions(approveFilter, { maxUsers: 1 })
    .then(async () => {
      console.log(`${FgGreen}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg.author.tag} approved the preview.${Reset}`);
      await msg.author.send('Processing your requests...');

      await previewMessage.delete();

      embed.title = '';

      let listingPost = await BOT.channels.get(config.armorChannelID).send('', { embed });

      try {
        let data = {
          listingID: listingPost.id,
          status: 'ACTIVE',
          expiration: moment().add(biddingWindow, 'days').format('MMM DD, YYYY'),
          ign: userIGN,
          currentBid: 0,
          minBidInc: parseInt(minBidInc),
          discordID: msg.author.toString(),
          startingPrice: parseInt(startingPrice),
          buyoutPrice: parseInt(buyoutPrice),
          itemType: 'armor',
          armorType: armorType,
          classType: classType,
          itemDesc: itemDesc,
          timestamp: moment().toISOString(),
          imgUrl: userInput.attachments.first().url,
          arrOfBidders: [],
          arrOfBiddings: []
        };

        await db.collection('listings').doc(listingPost.id).set(data);

        response.createSuccess(msg, {listingID: listingPost.id});

        embed.fields[0].value = `${listingPost.id}`;

        listingPost.edit(`${listingPost.id}`, { embed });
      }
      catch (err) {
        console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);

        listingPost.delete();

        response.createFail(msg, 1);
      }
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));

    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    /* Wait for user to react for exit */
    previewMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      await previewMessage.delete();

      response.createFail(msg, 0);
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'sendListingPreviewOfArmor() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

/* Create Accessory */
const createAccessory = async (BOT, db, msg) => {
  // Necklace
  // Cape
  // Earrings
  // Belt
  // Ring

  try {
    let embed = {
      color: GREEN,
      title: 'Type in the number that corresponds to your item',
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
      create(msg);
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
        askForSockets(BOT, db, msg, accessoryNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await accessoryTypeMessage.delete();
        createAccessory(msg);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'createAccessory() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const askForSockets = async (BOT, db, msg, accessoryNumber) => {
  // 0
  // 1
  // 2
  // 3

  try {
    let embed = {
      color: GREEN,
      title: 'How many unlocked sockets does your item have?',
      description: ':zero: 0\n\n:one: 1 socket\n\n:two: 2 socket\n\n:three: 3 socket\n\nTo go back, react ⏪. To exit, react ❌.',
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
      createAccessory(msg);
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

      if (socketNumber >= 0 && socketNumber <= 3) {
        await socketTypeMessage.delete();
        askForAccessoryInfo(BOT, db, msg, accessoryNumber, socketNumber);
      }
      else {
        await msg.author.send('Invalid number');
        await socketTypeMessage.delete();
        askForSockets(BOT, db, msg, accessoryNumber); //
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'askForSockets() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const askForAccessoryInfo = async (BOT, db, msg, accessoryNumber, socketNumber) => {
  try {
    let embed = {
      color: GREEN,
      title: 'Provide these info **IN ORDER** (separated by comma) **AND** attach a screenshot of your item along with your message',
      description: '1. Item Description\n2. Starting Price (in millions)\n3. Minimum Bid Increment (in millions. Must be at least 1.)\n4. Buyout Price (in millions)\n5. Bidding Window (in days)',
      fields: [
        {
          name: 'Example',
          value: `
          \`\`\`Piercing 4% Boss Damage 6%, 500, 20, 800, 7\`\`\`
          To go back, react ⏪. To exit, react ❌.
          `
        }
      ],
      footer: {
        text: `© Diana v${package.version} built by d4rkwizo#0006`
      }
    };

    let askingForInfoMessage = await msg.author.send('', { embed });

    let userReacted = false;

    await askingForInfoMessage.react('⏪');
    await askingForInfoMessage.react('❌');

    /* Go back */
    const gobackFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;

    askingForInfoMessage.awaitReactions(gobackFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await askingForInfoMessage.delete();
      askForSockets(BOT, db, msg, accessoryNumber);
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`))

    /* Exit */
    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    askingForInfoMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      userReacted = true;
      await askingForInfoMessage.delete();
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`))

    let collected = await msg.channel.awaitMessages(() => true, { max: 1 });

    /* Check for input validity */
    if (userReacted === false) {
      await askingForInfoMessage.delete();
      if (securityRules.createInputIsValid(collected.first())) {
        await msg.author.send('Processing your requests...');
        let userDoc = await db.collection('users').doc(msg.author.id).get();
        sendListingPreviewOfAccessory(BOT, db, msg, collected.first(), userDoc.data().ign, accessoryNumber, socketNumber);
      }
      else {
        askForAccessoryInfo(BOT, db, msg, accessoryNumber, socketNumber);
      }
    }
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'askForAccessoryInfo error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

const sendListingPreviewOfAccessory = async (BOT, db, msg, userInput, userIGN, accessoryNumber, socketNumber) => {
  try {
    let arrOfArgs = userInput.content.split(',');

    let itemDesc = arrOfArgs[0];
    let startingPrice = arrOfArgs[1];
    let minBidInc = arrOfArgs[2];
    let buyoutPrice = arrOfArgs[3];
    let biddingWindow = arrOfArgs[4];

    let accessoryType = helper.accessoryNumberToAccessoryType(accessoryNumber);

    let embed = helper.buildAccessoryEmbed('123456789', 'ACTIVE', moment().add(biddingWindow, 'days').format('MMM DD, YYYY'),
        userIGN, 'N/A', minBidInc, msg.author.toString(), startingPrice, buyoutPrice, itemDesc, accessoryType, socketNumber, moment().toISOString(),
        userInput.attachments.first().url, `© Diana v${package.version} built by d4rkwizo#0006`);

    embed.title = `Here is a preview of your listing. React with ⭕ to approve or ❌ to cancel.`;

    let previewMessage = await msg.author.send('', { embed });

    await previewMessage.react('⭕');
    await previewMessage.react('❌');

    const approveFilter = (reaction, user) => reaction.emoji.name === '⭕' && user.id === msg.author.id;

    /*Wait for user to react for approval*/
    previewMessage.awaitReactions(approveFilter, { maxUsers: 1 })
    .then(async () => {
      await msg.author.send('Processing your requests...');

      await previewMessage.delete();

      embed.title = '';

      let listingPost = await BOT.channels.get(config.accessoryChannelID).send('', { embed });

      try {
        let data = {
          listingID: listingPost.id,
          status: 'ACTIVE',
          expiration: moment().add(biddingWindow, 'days').format('MMM DD, YYYY'),
          ign: userIGN,
          currentBid: 0,
          minBidInc: parseInt(minBidInc),
          discordID: msg.author.toString(),
          startingPrice: parseInt(startingPrice),
          buyoutPrice: parseInt(buyoutPrice),
          itemType: 'accessory',
          accessoryType: accessoryType,
          socketNumber: socketNumber,
          itemDesc: itemDesc,
          timestamp: moment().toISOString(),
          imgUrl: userInput.attachments.first().url,
          arrOfBidders: [],
          arrOfBiddings: []
        };

        await db.collection('listings').doc(listingPost.id).set(data);

        response.createSuccess(msg, {listingID: listingPost.id});

        embed.fields[0].value = `${listingPost.id}`;

        listingPost.edit(`${listingPost.id}`, { embed });
      }
      catch (err) {
        console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);

        listingPost.delete();

        response.createFail(msg, 1);
      }
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));

    const exitFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === msg.author.id;

    /* Wait for user to react for exit */
    previewMessage.awaitReactions(exitFilter, { maxUsers: 1 })
    .then(async () => {
      await previewMessage.delete();

      response.createFail(msg, 0);
    })
    .catch(err => console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`));
  }
  catch (err) {
    notification.notifyd4rkwizo(BOT, 'sendListingPreviewOfAccessory() error', err);

    console.log(`${FgRed}[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${err}${Reset}`);
  }
};

module.exports = {
  create
};
