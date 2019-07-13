const response = require('./response.js');

const createInputIsValid = msg => {
  if (msg.attachments.first()) {
    if (msg.content.split(',').length === 5) {
      let arrOfArgs = msg.content.split(',');

      let itemDesc = arrOfArgs[0];
      let startingPrice = arrOfArgs[1];
      let minBidInc = arrOfArgs[2];
      let buyoutPrice = arrOfArgs[3];
      let biddingWindow = arrOfArgs[4];

      if (!isNaN(startingPrice)) {
        if (!isNaN(minBidInc)) {
          if (parseInt(minBidInc) >= 1) {
            if (!isNaN(buyoutPrice)) {
              if (parseInt(startingPrice) < parseInt(buyoutPrice)) {
                if (!isNaN(biddingWindow)) {
                  if (parseInt(biddingWindow) >= 1 && parseInt(biddingWindow) <= 7) {
                    return true;
                  }
                  else {
                    msg.author.send('Bidding Window must be between 1 and 7. Please try again.');
                    return false;
                  }
                }
                else {
                  msg.author.send('Bidding Window must be a number. Please try again.');
                  return false;
                }
              }
              else {
                msg.author.send('Starting Price must be lower than Buyout Price. Please try again.');
                return false;
              }
            }
            else {
              msg.author.send('Buyout Price must be a number. Please try again.');
              return false;
            }
          }
          else {
            msg.author.send('Minimum Bid Increment must be at least 1. Please try again.');
            return false;
          }
        }
        else {
          msg.author.send('Minimum Bid Increment must be a number. Please try again.');
          return false;
        }
      }
      else {
        msg.author.send('Starting Price must be a number. Please try again.');
        return false;
      }
    }
    else {
      msg.author.send('You did not provide enough info or there is an extra comma in your input. Please try again.');
      return false;
    }
  }
  else {
    msg.author.send('You did not attach a screenshot. Please try again.');
    return false;
  }
};

const editArgsAreValid = msg => {
  let arrOfArgs = msg.content.split(' ').slice(1);

  if (arrOfArgs.length >= 3) {
    let listingID = arrOfArgs[0];
    let field = arrOfArgs[1];
    let value = arrOfArgs[2];

    if (field === 'acceptingTrades' ||
        field === 'ign' ||
        field === 'minBidInc' ||
        field === 'buyoutPrice' ||
        field === 'itemDesc' ||
        field === 'imgUrl') {
      if (field === 'minBidInc' || field === 'buyoutPrice') {
        if (!isNaN(value)) {
          return true;
        }
        else {
          response.editFail(msg, 4, { field });
          return false;
        }
      }
      else {
        return true;
      }
    }
    else {
      response.editFail(msg, 2);
      return false;
    }
  }
  else {
    response.editFail(msg, 0);
    return false;
  }
};

const bidInputIsValid = msg => {
  let arrOfArgs = msg.content.split(' ');

  if (arrOfArgs.length === 2) {
    let listingID = arrOfArgs[0];
    let bidAmount = arrOfArgs[1];

    if (!isNaN(bidAmount)) {
      return true;
    }
    else {
      response.bidFail(msg, 1);
      return false;
    }
  }
  else {
    response.bidFail(msg, 0);
    return false;
  }
};

const myignArgsAreValid = msg => {
  let arrOfArgs = msg.content.split(' ').slice(1);

  if (arrOfArgs.length === 1) {
    return true;
  }
  else {
    response.myignFail(msg, 0);
    return false;
  }
};

module.exports = {
  createInputIsValid,
  editArgsAreValid,
  bidInputIsValid,
  myignArgsAreValid
};
