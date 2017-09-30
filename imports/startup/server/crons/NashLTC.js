import ccxt from 'ccxt';
import moment from 'moment';


// First, load up authenticated instances of the exchanges, outside of the normal function call
const hitbtc = new ccxt.hitbtc({
  apiKey: 'a78a604e901ef77517f7ce265f7c2bd1',
  secret: '1bf1570027cace12a79137cf47fb2886'
});
const bitfinex = new ccxt.bitfinex({
  apiKey: '3FEkc5xKmWltU3ICogQRyDh5xFFVnkH77prWTI0w658',
  secret: '7UGxHr0de0eQbP3Nk44OJeBJBQxKydme20hjBuAvCe9'
});
const PRIMARY_MARKET = hitbtc;
const SECONDARY_MARKET = bitfinex;
PRIMARY_MARKET.loadMarkets();
SECONDARY_MARKET.loadMarkets();


export const NashLTC = async () => {

  // <------------------------------------------------------------------------->
  // Then, load up everything that's needed using a Promise.race that throws a timeout if any part takes longer than "n" seconds
  const TIMEOUT = 5000;

  const getPrimaryBalance = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getPrimaryBalance');
    resolve(PRIMARY_MARKET.fetchBalance());
  });

  const getPrimaryLTCOrderBook = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getPrimaryLTCOrderBook');
    resolve(PRIMARY_MARKET.fetchOrderBook('LTC/BTC'));
  });

  const getSecondaryBalance = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getSecondaryBalance');
    resolve(SECONDARY_MARKET.fetchBalance());
  });

  const getSecondaryLTCOrderBook = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getSecondaryLTCOrderBook');
    resolve(SECONDARY_MARKET.fetchOrderBook('LTC/BTC'));
  });

  getPrimaryBalance.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryBalance');
  }, (rejection) => {
    // console.log(rejection);
    console.log('*** TIMED OUT: getPrimaryBalance ***');
  });

  getPrimaryLTCOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryLTCOrderBook');
  }, (rejection) => {
    // console.log(rejection);
    console.log('*** TIMED OUT: getPrimaryLTCOrderBook ***');
  });

  getSecondaryBalance.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryBalance');
  }, (rejection) => {
    // console.log(rejection);
    console.log('*** TIMED OUT: getSecondaryBalance ***');
  });

  getSecondaryLTCOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryLTCOrderBook');
  }, (rejection) => {
    // console.log(rejection);
    console.log('*** TIMED OUT: getSecondaryLTCOrderBook ***');
  });


  // Then, get the current balances
  const primaryBalance = await getPrimaryBalance;
  const primaryBTCBalance = primaryBalance['BTC'] ? primaryBalance['BTC']['free'] : 0;
  const primaryLTCBalance = primaryBalance['LTC'] ? primaryBalance['LTC']['free'] : 0;
  const primaryETHBalance = primaryBalance['ETH'] ? primaryBalance['ETH']['free'] : 0;
  const secondaryBalance = await getSecondaryBalance;
  const secondaryBTCBalance = secondaryBalance['BTC'] ? secondaryBalance['BTC']['free'] : 0;
  const secondaryLTCBalance = secondaryBalance['LTC'] ? secondaryBalance['LTC']['free'] : 0;
  const secondaryETHBalance = secondaryBalance['ETH'] ? secondaryBalance['ETH']['free'] : 0;

  // Get the LTC/BTC order book's details
  const primaryLTCOrderBook = await getPrimaryLTCOrderBook;
  const primaryLTCBid = primaryLTCOrderBook["bids"][0][0];
  const primaryLTCBidVolume = primaryLTCOrderBook["bids"][0][1];
  const primaryLTCAsk = primaryLTCOrderBook["asks"][0][0];
  const primaryLTCAskVolume = primaryLTCOrderBook["asks"][0][1];
  const secondaryLTCOrderBook = await getSecondaryLTCOrderBook;
  const secondaryLTCBid = secondaryLTCOrderBook["bids"][0][0];
  const secondaryLTCBidVolume = secondaryLTCOrderBook["bids"][0][1];
  const secondaryLTCAsk = secondaryLTCOrderBook["asks"][0][0];
  const secondaryLTCAskVolume = secondaryLTCOrderBook["asks"][0][1];


  // Identify if there is an arbitrage opportunity
  const MINIMUM_DELTA = .0031 // ("n"*100)% delta needs to be present between the two prices or else taker fees eat up my profits
  const PRIMARY_FEE = .001; // HitBTC
  const SECONDARY_FEE = .002; // Bitfinex
  const TRADABLE_PERCENTAGE = .5; // ("n"*100)% of the tradable volume will be traded, to mitigate risk
  const primaryLTCOpportunity = primaryLTCBid > (secondaryLTCAsk * (1 + MINIMUM_DELTA));
  const secondaryLTCOpportunity = secondaryLTCBid > (primaryLTCAsk * (1 + MINIMUM_DELTA));;
  const primaryLTCOpportunityVolume = Math.min(primaryLTCBidVolume, secondaryLTCAskVolume) * TRADABLE_PERCENTAGE;
  const primaryLTCOpportunityTradableVolume = Math.min(primaryLTCOpportunityVolume, (primaryLTCBalance * (1 - PRIMARY_FEE)), (secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryLTCAsk));
  const secondaryLTCOpportunityVolume = Math.min(secondaryLTCBidVolume, primaryLTCAskVolume) * TRADABLE_PERCENTAGE;
  const secondaryLTCOpportunityTradableVolume = Math.min(secondaryLTCOpportunityVolume, (secondaryLTCBalance * (1 - SECONDARY_FEE)), (primaryBTCBalance * (1 - PRIMARY_FEE) / primaryLTCAsk));

  /*
  console.log('*** NASH ***');
  console.log(primaryLTCBid, 'vs', secondaryLTCAsk);
  console.log(secondaryLTCBid, 'vs', primaryLTCAsk);
  */

  // <------------------------------------------------------------------------->
  // EXECUTION SEQUENCE


  const MINIMUM_TRADABLE_VOLUME = .2; // Can't place an order smaller than "n" LTC

  // If there's an opportunity for arbitrage in the PRIMARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
  if (primaryLTCOpportunity && primaryLTCOpportunityVolume > MINIMUM_TRADABLE_VOLUME) {

    if (primaryLTCOpportunityTradableVolume > MINIMUM_TRADABLE_VOLUME) {

      console.log('*** NASH ***');
      console.log('Selling', primaryLTCOpportunityTradableVolume, 'LTC high from', PRIMARY_MARKET['id'], 'at', primaryLTCBid);
      console.log('Buying', primaryLTCOpportunityTradableVolume, 'LTC low from', SECONDARY_MARKET['id'], 'at', secondaryLTCAsk);

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('LTC/BTC', primaryLTCOpportunityTradableVolume, primaryLTCBid));
      });

      primarySellOrder.then( (resolution) => {
        console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( () => {
          console.log('Retry completed');
        });
      });

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('LTC/BTC', primaryLTCOpportunityTradableVolume, secondaryLTCAsk));
      });

      secondaryBuyOrder.then( (resolution) => {
        console.log('Everything worked fine: secondaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondaryBuyOrder, retrying... ***');
        secondaryBuyOrder.then( () => {
          console.log('Retry completed');
        });
      });

    } else {
      console.log('*** NASH ***');
      console.log('INSUFFICIENT FUNDS');
      console.log('Trying to sell high from', PRIMARY_MARKET['id'], 'at', primaryLTCBid, 'but balance =', primaryLTCBalance, 'LTC');
      console.log('Trying to buy low from', SECONDARY_MARKET['id'], 'at', secondaryLTCAsk, 'but balance =', secondaryBTCBalance, 'BTC');
    }


  // If there's an opportunity for arbitrage in the SECONDARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
  } else if (secondaryLTCOpportunity && primaryLTCOpportunityVolume > MINIMUM_TRADABLE_VOLUME) {

    if (secondaryLTCOpportunityTradableVolume > MINIMUM_TRADABLE_VOLUME) {

      console.log('*** NASH ***');
      console.log('Selling', secondaryLTCOpportunityTradableVolume, 'LTC high from', SECONDARY_MARKET['id'], 'at', secondaryLTCBid);
      console.log('Buying', secondaryLTCOpportunityTradableVolume, 'LTC low from', PRIMARY_MARKET['id'], 'at', primaryLTCAsk);

      const secondarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(SECONDARY_MARKET.createLimitSellOrder('LTC/BTC', secondaryLTCOpportunityTradableVolume, secondaryLTCBid));
      });

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('LTC/BTC', secondaryLTCOpportunityTradableVolume, primaryLTCAsk));
      });

      secondarySellOrder.then( (resolution) => {
        console.log('Everything worked fine: secondarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondarySellOrder, retrying... ***');
        secondarySellOrder.then( () => {
          console.log('Retry completed');
        });
      });

      primaryBuyOrder.then( (resolution) => {
        console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( () => {
          console.log('Retry completed');
        });
      });

    } else {
      console.log('*** NASH ***');
      console.log('INSUFFICIENT FUNDS');
      console.log('Trying to sell high from', SECONDARY_MARKET['id'], 'at', secondaryLTCBid, 'but balance =', secondaryLTCBalance, 'LTC');
      console.log('Trying to buy low from', PRIMARY_MARKET['id'], 'at', primaryLTCAsk, 'but balance =', primaryBTCBalance, 'BTC');
    }
  } else {
    // console.log('No opportunity, continuing to look...');
  }
};

// NashLTC();
