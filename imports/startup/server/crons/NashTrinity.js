import ccxt from 'ccxt';
import moment from 'moment';


// First, load up authenticated instances of the exchanges, outside of the normal function call
const hitbtc = new ccxt.hitbtc({
  apiKey: '1758e6aa125083e7a2cf24727ffc9039',
  secret: '09f7214e519850095d0f9d2da60b64f9'
});
const bitfinex = new ccxt.bitfinex({
  apiKey: 'kic3gMGcGv1RAckQSBZQlRZsFWmv1598GLz3k3wLZTe',
  secret: 'SiIqMAi6Z1rhbXCiGU6skEddD2voVyXos0IUJO8D3bE'
});
const bittrex = new ccxt.bittrex({
  apiKey: 'e1121fd699dc4bd380aefc9d497b26b6',
  secret: '038ce2903a114dbc9da7928b67053ced'
});
const PRIMARY_MARKET = hitbtc;
const SECONDARY_MARKET = bitfinex;
const TERTIARY_MARKET = bittrex;
PRIMARY_MARKET.loadMarkets();
SECONDARY_MARKET.loadMarkets();
TERTIARY_MARKET.loadMarkets();


export const NashTrinity = async () => {

  // <------------------------------------------------------------------------->
  // Then, load up everything that's needed using promises that throw a timeout if any part takes longer than "n" seconds
  const TIMEOUT = 5000;

  const getPrimaryBalance = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getPrimaryBalance');
    resolve(PRIMARY_MARKET.fetchBalance());
  });

  const getPrimaryLTCOrderBook = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getPrimaryLTCOrderBook');
    resolve(PRIMARY_MARKET.fetchOrderBook('LTC/BTC'));
  });

  const getPrimaryETHOrderBook = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getPrimaryETHOrderBook');
    resolve(PRIMARY_MARKET.fetchOrderBook('ETH/BTC'));
  });

  const getSecondaryBalance = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getSecondaryBalance');
    resolve(SECONDARY_MARKET.fetchBalance());
  });

  const getSecondaryLTCOrderBook = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getSecondaryLTCOrderBook');
    resolve(SECONDARY_MARKET.fetchOrderBook('LTC/BTC'));
  });

  const getSecondaryETHOrderBook = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getSecondaryETHOrderBook');
    resolve(SECONDARY_MARKET.fetchOrderBook('ETH/BTC'));
  });

  const getTertiaryBalance = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getTertiaryBalance');
    resolve(TERTIARY_MARKET.fetchBalance());
  });

  const getTertiaryLTCOrderBook = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getTertiaryLTCOrderBook');
    resolve(TERTIARY_MARKET.fetchOrderBook('LTC/ETH'));
  });

  getPrimaryBalance.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryBalance');
  }, (rejection) => {
    console.log(rejection);
    console.log('*** TIMED OUT: getPrimaryBalance ***');
  });

  getPrimaryLTCOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryLTCOrderBook');
  }, (rejection) => {
    console.log(rejection);
    console.log('*** TIMED OUT: getPrimaryLTCOrderBook ***');
  });

  getPrimaryETHOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryETHOrderBook');
  }, (rejection) => {
    console.log(rejection);
    console.log('*** TIMED OUT: getPrimaryETHOrderBook ***');
  });

  getSecondaryBalance.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryBalance');
  }, (rejection) => {
    console.log(rejection);
    console.log('*** TIMED OUT: getSecondaryBalance ***');
  });

  getSecondaryLTCOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryLTCOrderBook');
  }, (rejection) => {
    console.log(rejection);
    console.log('*** TIMED OUT: getSecondaryLTCOrderBook ***');
  });

  getSecondaryETHOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryETHOrderBook');
  }, (rejection) => {
    console.log(rejection);
    console.log('*** TIMED OUT: getSecondaryETHOrderBook ***');
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
  const tertiaryBalance = await getTertiaryBalance;
  const tertiaryBTCBalance = tertiaryBalance['BTC'] ? tertiaryBalance['BTC']['free'] : 0;
  const tertiaryLTCBalance = tertiaryBalance['LTC'] ? tertiaryBalance['LTC']['free'] : 0;
  const tertiaryETHBalance = tertiaryBalance['ETH'] ? tertiaryBalance['ETH']['free'] : 0;

  // Get the primary and secondary markets' LTC/BTC and ETH/BTC order books' details
  const primaryLTCOrderBook = await getPrimaryLTCOrderBook;
  const primaryLTCBid = primaryLTCOrderBook["bids"][0][0];
  const primaryLTCBidVolume = primaryLTCOrderBook["bids"][0][1];
  const primaryLTCAsk = primaryLTCOrderBook["asks"][0][0];
  const primaryLTCAskVolume = primaryLTCOrderBook["asks"][0][1];
  const primaryETHOrderBook = await getPrimaryETHOrderBook;
  const primaryETHBid = primaryETHOrderBook["bids"][0][0];
  const primaryETHBidVolume = primaryETHOrderBook["bids"][0][1];
  const primaryETHAsk = primaryETHOrderBook["asks"][0][0];
  const primaryETHAskVolume = primaryETHOrderBook["asks"][0][1];
  const secondaryLTCOrderBook = await getSecondaryLTCOrderBook;
  const secondaryLTCBid = secondaryLTCOrderBook["bids"][0][0];
  const secondaryLTCBidVolume = secondaryLTCOrderBook["bids"][0][1];
  const secondaryLTCAsk = secondaryLTCOrderBook["asks"][0][0];
  const secondaryLTCAskVolume = secondaryLTCOrderBook["asks"][0][1];
  const secondaryETHOrderBook = await getSecondaryETHOrderBook;
  const secondaryETHBid = secondaryETHOrderBook["bids"][0][0];
  const secondaryETHBidVolume = secondaryETHOrderBook["bids"][0][1];
  const secondaryETHAsk = secondaryETHOrderBook["asks"][0][0];
  const secondaryETHAskVolume = secondaryETHOrderBook["asks"][0][1];

  // Get the tertiary market's LTC/ETH order book's details
  const tertiaryLTCOrderBook = await getTertiaryLTCOrderBook;
  const tertiaryLTCBid = tertiaryLTCOrderBook["bids"][0][0];
  const tertiaryLTCBidVolume = tertiaryLTCOrderBook["bids"][0][1];
  const tertiaryLTCAsk = tertiaryLTCOrderBook["asks"][0][0];
  const tertiaryLTCAskVolume = tertiaryLTCOrderBook["asks"][0][1];


  // <------------------------------------------------------------------------->
  // Identify if any permutation has an arbitrage opportunity
  // (Volume checks are always in BTC equivalent, converted backwards)

  const PRIMARY_FEE = .001; // HitBTC
  const SECONDARY_FEE = .002; // Bitfinex
  const TERTIARY_FEE = .0025; // Bittrex
  const REGULAR_FEES = PRIMARY_FEE + SECONDARY_FEE + TERTIARY_FEE; // .0055%
  const LOWEST_FEES = PRIMARY_FEE + PRIMARY_FEE + TERTIARY_FEE; // .0045%

  // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Secondary has LTC (sell LTC for BTC)
  const permutationOneReturnRate = (1 / primaryETHAsk / tertiaryLTCAsk * secondaryLTCBid) - (1 + REGULAR_FEES);
  const permutationOneFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryETHAsk), primaryETHAskVolume);
  const permutationOneFirstTradeBTCValue = permutationOneFirstTradeVolume * primaryETHAsk;
  const permutationOneSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationOneSecondTradeBTCValue = permutationOneSecondTradeVolume * tertiaryLTCAsk * primaryETHAsk;
  const permutationOneThirdTradeVolume = Math.min((secondaryLTCBalance * (1 - SECONDARY_FEE)), secondaryLTCBidVolume);
  const permutationOneThirdTradeBTCValue = permutationOneThirdTradeVolume * tertiaryLTCAsk * primaryETHAsk;
  const permutationOneTradeVolume = Math.min(permutationOneFirstTradeBTCValue, permutationOneSecondTradeBTCValue, permutationOneThirdTradeBTCValue);
  const permutationOneFirstTradeAmount = permutationOneTradeVolume; // BTC
  const permutationOneSecondTradeAmount = permutationOneTradeVolume / primaryETHAsk / tertiaryLTCAsk; // BTC -> ETH -> LTC
  const permutationOneThirdTradeAmount = permutationOneTradeVolume / primaryETHAsk / tertiaryLTCAsk; // BTC -> ETH -> LTC
  const permutationOneReturn = (1 + permutationOneReturnRate) * permutationOneTradeVolume;
  const permutationOneOpportunity = permutationOneReturn > permutationOneTradeVolume;

  // Secondary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
  const permutationTwoReturnRate = (1 / secondaryLTCAsk * tertiaryLTCBid * primaryETHBid) - (1 + REGULAR_FEES);
  const permutationTwoFirstTradeVolume = Math.min((secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryLTCAsk), secondaryLTCAskVolume);
  const permutationTwoFirstTradeBTCValue = permutationTwoFirstTradeVolume * secondaryLTCAsk;
  const permutationTwoSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationTwoSecondTradeBTCValue = permutationTwoSecondTradeVolume * secondaryLTCAsk;
  const permutationTwoThirdTradeVolume = Math.min((primaryETHBalance * (1 - PRIMARY_FEE)), primaryETHBidVolume);
  const permutationTwoThirdTradeBTCValue = permutationTwoThirdTradeVolume / tertiaryLTCBid * secondaryLTCAsk;
  const permutationTwoTradeVolume = Math.min(permutationTwoFirstTradeBTCValue, permutationTwoSecondTradeBTCValue, permutationTwoThirdTradeBTCValue);
  const permutationTwoFirstTradeAmount = permutationTwoTradeVolume; // BTC
  const permutationTwoSecondTradeAmount = permutationTwoTradeVolume / secondaryLTCAsk; // BTC -> LTC
  const permutationTwoThirdTradeAmount = permutationTwoTradeVolume / secondaryLTCAsk * tertiaryLTCBid; // BTC -> LTC -> ETH
  const permutationTwoReturn = (1 + permutationTwoReturnRate) * permutationTwoTradeVolume;
  const permutationTwoOpportunity = permutationTwoReturn > permutationTwoTradeVolume;

  // Secondary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
  const permutationThreeReturnRate = (1 / secondaryETHAsk / tertiaryLTCAsk * primaryLTCBid) - (1 + REGULAR_FEES);
  const permutationThreeFirstTradeVolume = Math.min((secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryETHAsk), secondaryETHAskVolume);
  const permutationThreeFirstTradeBTCValue = permutationThreeFirstTradeVolume * secondaryETHAsk;
  const permutationThreeSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationThreeSecondTradeBTCValue = permutationThreeSecondTradeVolume * tertiaryLTCAsk * secondaryETHAsk;
  const permutationThreeThirdTradeVolume = Math.min((primaryLTCBalance * (1 - PRIMARY_FEE)), primaryLTCBidVolume);
  const permutationThreeThirdTradeBTCValue = permutationThreeThirdTradeVolume * tertiaryLTCAsk * secondaryETHAsk;
  const permutationThreeTradeVolume = Math.min(permutationThreeFirstTradeBTCValue, permutationThreeSecondTradeBTCValue, permutationThreeThirdTradeBTCValue);
  const permutationThreeFirstTradeAmount = permutationThreeTradeVolume; // BTC
  const permutationThreeSecondTradeAmount = permutationThreeTradeVolume / secondaryETHAsk / tertiaryLTCAsk; // BTC -> ETH -> LTC
  const permutationThreeThirdTradeAmount = permutationThreeTradeVolume / secondaryETHAsk / tertiaryLTCAsk; // BTC -> ETH -> LTC
  const permutationThreeReturn = (1 + permutationThreeReturnRate) * permutationThreeTradeVolume;
  const permutationThreeOpportunity = permutationThreeReturn > permutationThreeTradeVolume;

  // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Secondary has ETH (sell ETH for BTC)
  const permutationFourReturnRate = (1 / primaryLTCAsk * tertiaryLTCBid * secondaryETHBid) - (1 + REGULAR_FEES);
  const permutationFourFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryLTCAsk), primaryLTCAskVolume);
  const permutationFourFirstTradeBTCValue = permutationFourFirstTradeVolume * primaryLTCAsk;
  const permutationFourSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationFourSecondTradeBTCValue = permutationFourSecondTradeVolume * primaryLTCAsk;
  const permutationFourThirdTradeVolume = Math.min((secondaryETHBalance * (1 - SECONDARY_FEE)), secondaryETHBidVolume);
  const permutationFourThirdTradeBTCValue = permutationFourThirdTradeVolume / tertiaryLTCBid * primaryLTCAsk;
  const permutationFourTradeVolume = Math.min(permutationFourFirstTradeBTCValue, permutationFourSecondTradeBTCValue, permutationFourThirdTradeBTCValue);
  const permutationFourFirstTradeAmount = permutationFourTradeVolume; // BTC
  const permutationFourSecondTradeAmount = permutationFourTradeVolume / primaryLTCAsk; // BTC -> LTC
  const permutationFourThirdTradeAmount = permutationFourTradeVolume / primaryLTCAsk * tertiaryLTCBid; // BTC -> LTC -> ETH
  const permutationFourReturn = (1 + permutationFourReturnRate) * permutationFourTradeVolume;
  const permutationFourOpportunity = permutationFourReturn > permutationFourTradeVolume;

  // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
  const permutationFiveReturnRate = (1 / primaryETHAsk / tertiaryLTCAsk * primaryLTCBid) - (1 + LOWEST_FEES);
  const permutationFiveFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryETHAsk), primaryETHAskVolume);
  const permutationFiveFirstTradeBTCValue = permutationFiveFirstTradeVolume * primaryETHAsk;
  const permutationFiveSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationFiveSecondTradeBTCValue = permutationFiveSecondTradeVolume * tertiaryLTCAsk * primaryETHAsk;
  const permutationFiveThirdTradeVolume = Math.min((primaryLTCBalance * (1 - PRIMARY_FEE)), primaryLTCBidVolume);
  const permutationFiveThirdTradeBTCValue = permutationFiveThirdTradeVolume * tertiaryLTCAsk * primaryETHAsk;
  const permutationFiveTradeVolume = Math.min(permutationFiveFirstTradeBTCValue, permutationFiveSecondTradeBTCValue, permutationFiveThirdTradeBTCValue);
  const permutationFiveFirstTradeAmount = permutationFiveTradeVolume; // BTC
  const permutationFiveSecondTradeAmount = permutationFiveTradeVolume / primaryETHAsk / tertiaryLTCAsk; // BTC -> ETH -> LTC
  const permutationFiveThirdTradeAmount = permutationFiveTradeVolume / primaryETHAsk / tertiaryLTCAsk; // BTC -> ETH -> LTC
  const permutationFiveReturn = (1 + permutationFiveReturnRate) * permutationFiveTradeVolume;
  const permutationFiveOpportunity = permutationFiveReturn > permutationFiveTradeVolume;

  // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
  const permutationSixReturnRate = (1 / primaryLTCAsk * tertiaryLTCBid * primaryETHBid) - (1 + LOWEST_FEES);
  const permutationSixFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryLTCAsk), primaryLTCAskVolume);
  const permutationSixFirstTradeBTCValue = permutationSixFirstTradeVolume * primaryLTCAsk;
  const permutationSixSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationSixSecondTradeBTCValue = permutationSixSecondTradeVolume * primaryLTCAsk;
  const permutationSixThirdTradeVolume = Math.min((primaryETHBalance * (1 - PRIMARY_FEE)), primaryETHBidVolume);
  const permutationSixThirdTradeBTCValue = permutationSixThirdTradeVolume / tertiaryLTCBid * primaryLTCAsk;
  const permutationSixTradeVolume = Math.min(permutationSixFirstTradeBTCValue, permutationSixSecondTradeBTCValue, permutationSixThirdTradeBTCValue);
  const permutationSixFirstTradeAmount = permutationSixTradeVolume; // BTC
  const permutationSixSecondTradeAmount = permutationSixTradeVolume / primaryLTCAsk; // BTC -> LTC
  const permutationSixThirdTradeAmount = permutationSixTradeVolume / primaryLTCAsk * tertiaryLTCBid; // BTC -> LTC -> ETH
  const permutationSixReturn = (1 + permutationSixReturnRate) * permutationSixTradeVolume;
  const permutationSixOpportunity = permutationSixReturn > permutationSixTradeVolume;


  // <------------------------------------------------------------------------->
  // Identify which permutation has the highest return (taking volume into account) and execute those trades

  const highestReturnRate = Math.max(permutationOneReturnRate, permutationTwoReturnRate, permutationThreeReturnRate, permutationFourReturnRate, permutationFiveReturnRate, permutationSixReturnRate);
  const highestReturn = Math.max(permutationOneReturn, permutationTwoReturn, permutationThreeReturn, permutationFourReturn, permutationFiveReturn, permutationSixReturn);
  const MINIMUM_RETURN_RATE = .0001; // .01% return

  /*
  console.log('*** TRINITY ***');
  console.log('highestReturnRate:', highestReturnRate);
  */

  if (highestReturnRate > MINIMUM_RETURN_RATE) {

    // PERMUTATION ONE
    // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Secondary has LTC (sell LTC for BTC)
    if (permutationOneOpportunity && highestReturn === permutationOneReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationOneReturnRate, 'is the highest return (permutationOne):', permutationOneReturn, 'BTC');
      /*
      console.log('Buying', permutationOneFirstTradeAmount, 'ETH/BTC from', PRIMARY_MARKET['id'], 'at', primaryETHAsk);
      console.log('Buying', permutationOneSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCAsk);
      console.log('Selling', permutationOneThirdTradeAmount, 'LTC/BTC from', SECONDARY_MARKET['id'], 'at', secondaryLTCBid);

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('ETH/BTC', permutationOneFirstTradeAmount, primaryETHAsk));
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

      const tertiaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiaryBuyOrder');
        resolve(TERTIARY_MARKET.createLimitBuyOrder('LTC/ETH', permutationOneSecondTradeAmount, tertiaryLTCAsk));
      });

      tertiaryBuyOrder.then( (resolution) => {
        console.log('Everything worked fine: tertiaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiaryBuyOrder, retrying... ***');
        tertiaryBuyOrder.then( () => {
          console.log('Retry completed');
        });
      });

      const secondarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondarySellOrder');
        resolve(SECONDARY_MARKET.createLimitSellOrder('LTC/BTC', permutationOneThirdTradeAmount, secondaryLTCBid));
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
      */

      // PERMUTATION TWO
      // Secondary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
    } else if (permutationTwoOpportunity && highestReturn === permutationTwoReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationTwoReturnRate, 'is the highest return (permutationTwo):', permutationTwoReturn, 'BTC');
      /*
      console.log('Buying', permutationTwoFirstTradeAmount, 'LTC/BTC from', SECONDARY_MARKET['id'], 'at', secondaryLTCAsk);
      console.log('Selling', permutationTwoSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCBid);
      console.log('Selling', permutationTwoThirdTradeAmount, 'ETH/BTC from', PRIMARY_MARKET['id'], 'at', primaryETHBid);

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('LTC/BTC', permutationTwoFirstTradeAmount, secondaryLTCAsk));
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

      const tertiarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiarySellOrder');
        resolve(TERTIARY_MARKET.createLimitSellOrder('LTC/ETH', permutationTwoSecondTradeAmount, tertiaryLTCBid));
      });

      tertiarySellOrder.then( (resolution) => {
        console.log('Everything worked fine: tertiarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiarySellOrder, retrying... ***');
        tertiarySellOrder.then( () => {
          console.log('Retry completed');
        });
      });

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('ETH/BTC', permutationTwoThirdTradeAmount, primaryETHBid));
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
      */

      // PERMUTATION THREE
      // Secondary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
    } else if (permutationThreeOpportunity && highestReturn === permutationThreeReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationThreeReturnRate, 'is the highest return (permutationThree):', permutationThreeReturn, 'BTC');
      /*
      console.log('Buying', permutationThreeFirstTradeAmount, 'ETH/BTC from', SECONDARY_MARKET['id'], 'at', secondaryETHAsk);
      console.log('Buying', permutationThreeSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCAsk);
      console.log('Selling', permutationThreeThirdTradeAmount, 'LTC/BTC from', PRIMARY_MARKET['id'], 'at', primaryLTCBid);

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('ETH/BTC', permutationThreeFirstTradeAmount, secondaryETHAsk));
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

      const tertiaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiaryBuyOrder');
        resolve(TERTIARY_MARKET.createLimitBuyOrder('LTC/ETH', permutationThreeSecondTradeAmount, tertiaryLTCAsk));
      });

      tertiaryBuyOrder.then( (resolution) => {
        console.log('Everything worked fine: tertiaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiaryBuyOrder, retrying... ***');
        tertiaryBuyOrder.then( () => {
          console.log('Retry completed');
        });
      });

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('LTC/BTC', permutationThreeThirdTradeAmount, primaryLTCBid));
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
      */

      // PERMUTATION FOUR
      // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Secondary has ETH (sell ETH for BTC)
    } else if (permutationFourOpportunity && highestReturn === permutationFourReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationFourReturnRate, 'is the highest return (permutationFour):', permutationFourReturn, 'BTC');
      /*
      console.log('Buying', permutationFourFirstTradeAmount, 'LTC/BTC from', PRIMARY_MARKET['id'], 'at', primaryLTCAsk);
      console.log('Selling', permutationFourSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCBid);
      console.log('Selling', permutationFourThirdTradeAmount, 'ETH/BTC from', SECONDARY_MARKET['id'], 'at', secondaryETHBid);

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('LTC/BTC', permutationFourFirstTradeAmount, primaryLTCAsk));
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

      const tertiarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiarySellOrder');
        resolve(TERTIARY_MARKET.createLimitSellOrder('LTC/ETH', permutationFourSecondTradeAmount, tertiaryLTCBid));
      });

      tertiarySellOrder.then( (resolution) => {
        console.log('Everything worked fine: tertiarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiarySellOrder, retrying... ***');
        tertiarySellOrder.then( () => {
          console.log('Retry completed');
        });
      });

      const secondarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondarySellOrder');
        resolve(SECONDARY_MARKET.createLimitSellOrder('ETH/BTC', permutationFourThirdTradeAmount, secondaryETHBid));
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
      */

      // PERMUTATION FIVE
      // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
    } else if (permutationFiveOpportunity && highestReturn === permutationFiveReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationFiveReturnRate, 'is the highest return (permutationFive):', permutationFiveReturn, 'BTC');
      /*
      console.log('Buying', permutationFiveFirstTradeAmount, 'ETH/BTC from', PRIMARY_MARKET['id'], 'at', primaryETHAsk);
      console.log('Buying', permutationFiveSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCAsk);
      console.log('Selling', permutationFiveThirdTradeAmount, 'LTC/BTC from', PRIMARY_MARKET['id'], 'at', primaryLTCBid);

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('ETH/BTC', permutationFiveFirstTradeAmount, primaryETHAsk));
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

      const tertiaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiaryBuyOrder');
        resolve(TERTIARY_MARKET.createLimitBuyOrder('LTC/ETH', permutationFiveSecondTradeAmount, tertiaryLTCAsk));
      });

      tertiaryBuyOrder.then( (resolution) => {
        console.log('Everything worked fine: tertiaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiaryBuyOrder, retrying... ***');
        tertiaryBuyOrder.then( () => {
          console.log('Retry completed');
        });
      });

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('LTC/BTC', permutationFiveThirdTradeAmount, primaryLTCBid));
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
      */

      // PERMUTATION SIX
      // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
    } else if (permutationSixOpportunity && highestReturn === permutationSixReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationSixReturnRate, 'is the highest return (permutationSix):', permutationSixReturn, 'BTC');
      /*
      console.log('Buying', permutationSixFirstTradeAmount, 'LTC/BTC from', PRIMARY_MARKET['id'], 'at', primaryLTCAsk);
      console.log('Selling', permutationSixSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCBid);
      console.log('Selling', permutationSixThirdTradeAmount, 'ETH/BTC from', PRIMARY_MARKET['id'], 'at', primaryETHBid);

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('LTC/BTC', permutationSixFirstTradeAmount, primaryLTCAsk));
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

      const tertiarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiarySellOrder');
        resolve(TERTIARY_MARKET.createLimitSellOrder('LTC/ETH', permutationSixSecondTradeAmount, tertiaryLTCBid));
      });

      tertiarySellOrder.then( (resolution) => {
        console.log('Everything worked fine: tertiarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiarySellOrder, retrying... ***');
        tertiarySellOrder.then( () => {
          console.log('Retry completed');
        });
      });

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('ETH/BTC', permutationSixThirdTradeAmount, primaryETHBid));
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
      */

    }
  }
};

// NashTrinity();
