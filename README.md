# Diana

This bot is still a WIP.

This bot uses [Firebase Firestore](https://firebase.google.com/docs/firestore) as database solution.

## TODO

- [ ] Finish the commands that aren't checked off yet.
- [ ] Have simple and advanced version of each command (simple: more visually appealing UX with embed. advanced: CLI style.)

## Commands

**Super commands**

These commands are for users with the "Admin" role and are executed in a text channel of a Discord guild.

- [ ] !admincreateweapon
- [ ] !admincreatearmor
- [ ] !admincreateaccessory
- [ ] !adminedit
- [x] !admindelete
- [x] !admingetlisting
- [x] !adminsetign
- [x] !admingetign
- [x] !expiredwithnobid
- [x] !expiredwithbidseller
- [x] !expiredwithbidbuyer

**Regular Commands**

These commands are for users with the "Member" role and are executed in direct message to the bot.

- **Seller commands**
- [x] !create
- [x] !cancel
- [x] !mylistings
- **Buyer commands**
- [x] !bid
- [x] !mybids
- **Misc commands**
- [x] !myign
- [x] !search
- [x] !getlisting

## Getting Started

### Create Text Channels in your Discord guild
Create 3 text channels.

One for Weapon, one for armor, and one for accessory.

### Create Roles in your Discord guild
Create 2 roles. One for "Member", one for "Admin".

Users with "Member" role will have access to [*Regular Commands*](#Commands).

Users with "Admin" role will have access to [*Super Commands*](#Commands).

### Installation
```
git clone
npm i
```
### Create Discord config file in `config/` and name it `config.json` with the following content
```json
{
  "guildID":"...",
  "weaponChannelID":"...",
  "armorChannelID":"...",
  "accessoryChannelID":"...",
  "memberRole":"...",
  "adminRole":"...",
  "token":"..." //discord bot token
}
```

To see the ID of Text Channels and/or Guilds:
1. Enable *Developer Mode* (User Settings -> Appearance)
2. Right click on a Text Channel/Guild-> `Copy ID`

### Firebase Service Account JSON file
1. Download the JSON file from [https://console.firebase.google.com](https://console.firebase.google.com)

  Project settings -> Service Accounts -> Generate new private key

2. Place the JSON file in `config/`

3. Edit this line in `src/main.js`
```js
const serviceAccount = require('../config/....json');
```
to reference the JSON file that you placed in `config/`

### Start up the bot
```
npm start
```
