import ccxt from 'ccxt';
import moment from 'moment';


// PART 0: First, load up authenticated instances of the exchanges, outside of the normal function call to limit API footprint
const hitbtc = new ccxt.hitbtc({
  apiKey: 'a78a604e901ef77517f7ce265f7c2bd1',
  secret: '1bf1570027cace12a79137cf47fb2886'
});
const bitfinex = new ccxt.bitfinex({
  apiKey: '3FEkc5xKmWltU3ICogQRyDh5xFFVnkH77prWTI0w658',
  secret: '7UGxHr0de0eQbP3Nk44OJeBJBQxKydme20hjBuAvCe9'
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


export const Nash = async () => {

  // <------------------------------------------------------------------------->
  // PART 1: Load up everything that's needed using a promise that throws a timeout if any part takes longer than "n" seconds
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
    // console.log(rejection);
    console.log('*** TIMED OUT: getPrimaryBalance ***');
  });

  getPrimaryLTCOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryLTCOrderBook');
  }, (rejection) => {
    // console.log(rejection);
    console.log('*** TIMED OUT: getPrimaryLTCOrderBook ***');
  });

  getPrimaryETHOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryETHOrderBook');
  }, (rejection) => {
    // console.log(rejection);
    console.log('*** TIMED OUT: getPrimaryETHOrderBook ***');
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

  getSecondaryETHOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryETHOrderBook');
  }, (rejection) => {
    // console.log(rejection);
    console.log('*** TIMED OUT: getSecondaryETHOrderBook ***');
  });


  // Get the current balances
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
  // PART 2: Identify if any permutation has an arbitrage opportunity

  const PRIMARY_FEE = .001; // HitBTC
  const SECONDARY_FEE = .002; // Bitfinex
  const TERTIARY_FEE = .0025; // Bittrex
  const REGULAR_FEES = PRIMARY_FEE + SECONDARY_FEE + TERTIARY_FEE; // .0055%
  const LOWEST_FEES = PRIMARY_FEE + PRIMARY_FEE + TERTIARY_FEE; // .0045%


  // ~~~ NASH ~~~

  // LTC trades can only be in "0.1" increments, while ETH and BTC trades can only be in "0.001" increments
  const LTC_DECIMAL_POINTS = 1; // "n" decimal points
  const GENERAL_DECIMAL_POINTS = 3; // "n" decimal points
  const NASH_MINIMUM_DELTA = .0031 // ("n"*100)% delta needs to be present between the two prices or else taker fees eat up my profits
  const NASH_TRADABLE_PERCENTAGE = .8; // ("n"*100)% of the tradable volume will be traded, to mitigate risk

  // LTC/BTC
  const primaryLTCOpportunity = primaryLTCBid > (secondaryLTCAsk * (1 + NASH_MINIMUM_DELTA));
  const secondaryLTCOpportunity = secondaryLTCBid > (primaryLTCAsk * (1 + NASH_MINIMUM_DELTA));;
  const primaryLTCOpportunityVolume = Math.min(primaryLTCBidVolume, secondaryLTCAskVolume) * NASH_TRADABLE_PERCENTAGE;
  const primaryLTCOpportunityTradableVolume = Math.min(primaryLTCOpportunityVolume, (primaryLTCBalance * (1 - PRIMARY_FEE)), (secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryLTCAsk)).toFixed(LTC_DECIMAL_POINTS);
  const secondaryLTCOpportunityVolume = Math.min(secondaryLTCBidVolume, primaryLTCAskVolume) * NASH_TRADABLE_PERCENTAGE;
  const secondaryLTCOpportunityTradableVolume = Math.min(secondaryLTCOpportunityVolume, (secondaryLTCBalance * (1 - SECONDARY_FEE)), (primaryBTCBalance * (1 - PRIMARY_FEE) / primaryLTCAsk)).toFixed(LTC_DECIMAL_POINTS);

  // ETH/BTC
  const primaryETHOpportunity = primaryETHBid > (secondaryETHAsk * (1 + NASH_MINIMUM_DELTA));
  const secondaryETHOpportunity = secondaryETHBid > (primaryETHAsk * (1 + NASH_MINIMUM_DELTA));;
  const primaryETHOpportunityVolume = Math.min(primaryETHBidVolume, secondaryETHAskVolume) * NASH_TRADABLE_PERCENTAGE;
  const primaryETHOpportunityTradableVolume = Math.min(primaryETHOpportunityVolume, (primaryETHBalance * (1 - PRIMARY_FEE)), (secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryETHAsk)).toFixed(GENERAL_DECIMAL_POINTS);
  const secondaryETHOpportunityVolume = Math.min(secondaryETHBidVolume, primaryETHAskVolume) * NASH_TRADABLE_PERCENTAGE;
  const secondaryETHOpportunityTradableVolume = Math.min(secondaryETHOpportunityVolume, (secondaryETHBalance * (1 - SECONDARY_FEE)), (primaryBTCBalance * (1 - PRIMARY_FEE) / primaryETHAsk)).toFixed(GENERAL_DECIMAL_POINTS);


  // ~~~ TRINITY ~~~
  // (Volume checks are always in BTC equivalent, converted backwards)

  // PERMUTATION ONE
  // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Secondary has LTC (sell LTC for BTC)
  const permutationOneReturnRate = (1 / primaryETHAsk / tertiaryLTCAsk * secondaryLTCBid) - (1 + REGULAR_FEES);
  const permutationOneFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryETHAsk), primaryETHAskVolume);
  const permutationOneFirstTradeBTCValue = (permutationOneFirstTradeVolume * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationOneSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationOneSecondTradeBTCValue = (permutationOneSecondTradeVolume * tertiaryLTCAsk * primaryETHAsk).toFixed(LTC_DECIMAL_POINTS);
  const permutationOneThirdTradeVolume = Math.min((secondaryLTCBalance * (1 - SECONDARY_FEE)), secondaryLTCBidVolume);
  const permutationOneThirdTradeBTCValue = (permutationOneThirdTradeVolume * tertiaryLTCAsk * primaryETHAsk).toFixed(LTC_DECIMAL_POINTS);
  const permutationOneTradeVolume = Math.min(permutationOneFirstTradeBTCValue, permutationOneSecondTradeBTCValue, permutationOneThirdTradeBTCValue);
  const permutationOneFirstTradeAmount = permutationOneTradeVolume.toFixed(GENERAL_DECIMAL_POINTS); // BTC
  const permutationOneSecondTradeAmount = (permutationOneTradeVolume / primaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationOneThirdTradeAmount = (permutationOneTradeVolume / primaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationOneReturn = (1 + permutationOneReturnRate) * permutationOneTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);
  const permutationOneOpportunity = permutationOneReturn > permutationOneTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);

  // PERMUTATION TWO
  // Secondary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
  const permutationTwoReturnRate = (1 / secondaryLTCAsk * tertiaryLTCBid * primaryETHBid) - (1 + REGULAR_FEES);
  const permutationTwoFirstTradeVolume = Math.min((secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryLTCAsk), secondaryLTCAskVolume);
  const permutationTwoFirstTradeBTCValue = (permutationTwoFirstTradeVolume * secondaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationTwoSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationTwoSecondTradeBTCValue = (permutationTwoSecondTradeVolume * secondaryLTCAsk).toFixed(LTC_DECIMAL_POINTS);
  const permutationTwoThirdTradeVolume = Math.min((primaryETHBalance * (1 - PRIMARY_FEE)), primaryETHBidVolume);
  const permutationTwoThirdTradeBTCValue = (permutationTwoThirdTradeVolume / tertiaryLTCBid * secondaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationTwoTradeVolume = Math.min(permutationTwoFirstTradeBTCValue, permutationTwoSecondTradeBTCValue, permutationTwoThirdTradeBTCValue);
  const permutationTwoFirstTradeAmount = permutationTwoTradeVolume.toFixed(GENERAL_DECIMAL_POINTS); // BTC
  const permutationTwoSecondTradeAmount = (permutationTwoTradeVolume / secondaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationTwoThirdTradeAmount = (permutationTwoTradeVolume / secondaryLTCAsk * tertiaryLTCBid).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> LTC -> ETH
  const permutationTwoReturn = (1 + permutationTwoReturnRate) * permutationTwoTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);
  const permutationTwoOpportunity = permutationTwoReturn > permutationTwoTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);

  // PERMUTATION THREE
  // Secondary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
  const permutationThreeReturnRate = (1 / secondaryETHAsk / tertiaryLTCAsk * primaryLTCBid) - (1 + REGULAR_FEES);
  const permutationThreeFirstTradeVolume = Math.min((secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryETHAsk), secondaryETHAskVolume);
  const permutationThreeFirstTradeBTCValue = (permutationThreeFirstTradeVolume * secondaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationThreeSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationThreeSecondTradeBTCValue = (permutationThreeSecondTradeVolume * tertiaryLTCAsk * secondaryETHAsk).toFixed(LTC_DECIMAL_POINTS);
  const permutationThreeThirdTradeVolume = Math.min((primaryLTCBalance * (1 - PRIMARY_FEE)), primaryLTCBidVolume);
  const permutationThreeThirdTradeBTCValue = (permutationThreeThirdTradeVolume * tertiaryLTCAsk * secondaryETHAsk).toFixed(LTC_DECIMAL_POINTS);
  const permutationThreeTradeVolume = Math.min(permutationThreeFirstTradeBTCValue, permutationThreeSecondTradeBTCValue, permutationThreeThirdTradeBTCValue);
  const permutationThreeFirstTradeAmount = permutationThreeTradeVolume.toFixed(GENERAL_DECIMAL_POINTS); // BTC
  const permutationThreeSecondTradeAmount = (permutationThreeTradeVolume / secondaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationThreeThirdTradeAmount = (permutationThreeTradeVolume / secondaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationThreeReturn = (1 + permutationThreeReturnRate) * permutationThreeTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);
  const permutationThreeOpportunity = permutationThreeReturn > permutationThreeTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);

  // PERMUTATION FOUR
  // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Secondary has ETH (sell ETH for BTC)
  const permutationFourReturnRate = (1 / primaryLTCAsk * tertiaryLTCBid * secondaryETHBid) - (1 + REGULAR_FEES);
  const permutationFourFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryLTCAsk), primaryLTCAskVolume);
  const permutationFourFirstTradeBTCValue = (permutationFourFirstTradeVolume * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFourSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationFourSecondTradeBTCValue = (permutationFourSecondTradeVolume * primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS);
  const permutationFourThirdTradeVolume = Math.min((secondaryETHBalance * (1 - SECONDARY_FEE)), secondaryETHBidVolume);
  const permutationFourThirdTradeBTCValue = (permutationFourThirdTradeVolume / tertiaryLTCBid * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFourTradeVolume = Math.min(permutationFourFirstTradeBTCValue, permutationFourSecondTradeBTCValue, permutationFourThirdTradeBTCValue);
  const permutationFourFirstTradeAmount = permutationFourTradeVolume.toFixed(GENERAL_DECIMAL_POINTS); // BTC
  const permutationFourSecondTradeAmount = (permutationFourTradeVolume / primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationFourThirdTradeAmount = (permutationFourTradeVolume / primaryLTCAsk * tertiaryLTCBid).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> LTC -> ETH
  const permutationFourReturn = (1 + permutationFourReturnRate) * permutationFourTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFourOpportunity = permutationFourReturn > permutationFourTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);

  // PERMUTATION FIVE
  // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
  const permutationFiveReturnRate = (1 / primaryETHAsk / tertiaryLTCAsk * primaryLTCBid) - (1 + LOWEST_FEES);
  const permutationFiveFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryETHAsk), primaryETHAskVolume);
  const permutationFiveFirstTradeBTCValue = (permutationFiveFirstTradeVolume * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFiveSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationFiveSecondTradeBTCValue = (permutationFiveSecondTradeVolume * tertiaryLTCAsk * primaryETHAsk).toFixed(LTC_DECIMAL_POINTS);
  const permutationFiveThirdTradeVolume = Math.min((primaryLTCBalance * (1 - PRIMARY_FEE)), primaryLTCBidVolume);
  const permutationFiveThirdTradeBTCValue = (permutationFiveThirdTradeVolume * tertiaryLTCAsk * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFiveTradeVolume = Math.min(permutationFiveFirstTradeBTCValue, permutationFiveSecondTradeBTCValue, permutationFiveThirdTradeBTCValue);
  const permutationFiveFirstTradeAmount = permutationFiveTradeVolume.toFixed(GENERAL_DECIMAL_POINTS); // BTC
  const permutationFiveSecondTradeAmount = (permutationFiveTradeVolume / primaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationFiveThirdTradeAmount = (permutationFiveTradeVolume / primaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationFiveReturn = (1 + permutationFiveReturnRate) * permutationFiveTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFiveOpportunity = permutationFiveReturn > permutationFiveTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);

  // PERMUTATION SIX
  // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
  const permutationSixReturnRate = (1 / primaryLTCAsk * tertiaryLTCBid * primaryETHBid) - (1 + LOWEST_FEES);
  const permutationSixFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryLTCAsk), primaryLTCAskVolume);
  const permutationSixFirstTradeBTCValue = (permutationSixFirstTradeVolume * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationSixSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationSixSecondTradeBTCValue = (permutationSixSecondTradeVolume * primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS);
  const permutationSixThirdTradeVolume = Math.min((primaryETHBalance * (1 - PRIMARY_FEE)), primaryETHBidVolume);
  const permutationSixThirdTradeBTCValue = (permutationSixThirdTradeVolume / tertiaryLTCBid * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationSixTradeVolume = Math.min(permutationSixFirstTradeBTCValue, permutationSixSecondTradeBTCValue, permutationSixThirdTradeBTCValue);
  const permutationSixFirstTradeAmount = permutationSixTradeVolume.toFixed(GENERAL_DECIMAL_POINTS); // BTC
  const permutationSixSecondTradeAmount = (permutationSixTradeVolume / primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationSixThirdTradeAmount = (permutationSixTradeVolume / primaryLTCAsk * tertiaryLTCBid).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> LTC -> ETH
  const permutationSixReturn = (1 + permutationSixReturnRate) * permutationSixTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);
  const permutationSixOpportunity = permutationSixReturn > permutationSixTradeVolume.toFixed(GENERAL_DECIMAL_POINTS);

  /*
  console.log('==========');
  console.log('PERMUTATION SIX:');
  console.log('permutationSixReturnRate:', permutationSixReturnRate);
  console.log('permutationSixTradeVolume:', permutationSixTradeVolume);
  console.log('permutationSixFirstTradeBTCValue:', permutationSixFirstTradeBTCValue);
  console.log('permutationSixSecondTradeBTCValue:', permutationSixSecondTradeBTCValue);
  console.log('permutationSixThirdTradeBTCValue:', permutationSixThirdTradeBTCValue);
  console.log('tertiaryLTCBalance:', tertiaryLTCBalance);
  console.log('tertiaryLTCBidVolume:', tertiaryLTCBidVolume);
  console.log('==========');
  */

  // <------------------------------------------------------------------------->
  // PART 3: Execution sequence. First try to execute Trinity, then NashLTC, then NashETH

  // ~~~ TRINITY ~~~
  // PART 3.1: Identify which Trinity permutation has the highest return (taking volume into account) and execute those trades
  const highestReturnRate = Math.max(permutationOneReturnRate, permutationTwoReturnRate, permutationThreeReturnRate, permutationFourReturnRate, permutationFiveReturnRate, permutationSixReturnRate);
  const highestReturn = Math.max(permutationOneReturn, permutationTwoReturn, permutationThreeReturn, permutationFourReturn, permutationFiveReturn, permutationSixReturn);
  const MINIMUM_RETURN_RATE = .0001; // .01% return
  const MINIMUM_BTC_TRADE_VOLUME = .01; // Because we don't want to trade .001 LTC for example

  if (highestReturnRate > MINIMUM_RETURN_RATE) {

    if (highestReturnRate === permutationOneReturnRate) {
      console.log('highestReturnRate=one', permutationOneReturnRate, 'profit (BTC):', permutationOneReturn);
    } else if (highestReturnRate === permutationTwoReturnRate) {
      console.log('highestReturnRate=two', permutationTwoReturnRate, 'profit (BTC):', permutationTwoReturn);
    } else if (highestReturnRate === permutationThreeReturnRate) {
      console.log('highestReturnRate=three', permutationThreeReturnRate, 'profit (BTC):', permutationThreeReturn);
    } else if (highestReturnRate === permutationFourReturnRate) {
      console.log('highestReturnRate=four', permutationFourReturnRate, 'profit (BTC):', permutationFourReturn);
    } else if (highestReturnRate === permutationFiveReturnRate) {
      console.log('highestReturnRate=five', permutationFiveReturnRate, 'profit (BTC):', permutationFiveReturn);
    } else if (highestReturnRate === permutationSixReturnRate) {
      console.log('highestReturnRate=six', permutationSixReturnRate, 'profit (BTC):', permutationSixReturn);
    }

    // PERMUTATION ONE
    // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Secondary has LTC (sell LTC for BTC)
    if ((permutationOneOpportunity && permutationOneTradeVolume > MINIMUM_BTC_TRADE_VOLUME) && highestReturn === permutationOneReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationOneReturnRate, 'is the highest return (permutationOne):', (permutationOneReturn - permutationOneTradeVolume), 'BTC profit');

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


      // PERMUTATION TWO
      // Secondary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
    } else if ((permutationTwoOpportunity && permutationTwoTradeVolume > MINIMUM_BTC_TRADE_VOLUME) && highestReturn === permutationTwoReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationTwoReturnRate, 'is the highest return (permutationTwo):', (permutationTwoReturn - permutationTwoTradeVolume), 'BTC profit');

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


      // PERMUTATION THREE
      // Secondary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
    } else if ((permutationThreeOpportunity && permutationThreeTradeVolume > MINIMUM_BTC_TRADE_VOLUME) && highestReturn === permutationThreeReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationThreeReturnRate, 'is the highest return (permutationThree):', (permutationThreeReturn - permutationThreeTradeVolume), 'BTC profit');

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


      // PERMUTATION FOUR
      // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Secondary has ETH (sell ETH for BTC)
    } else if ((permutationFourOpportunity && permutationFourTradeVolume > MINIMUM_BTC_TRADE_VOLUME) && highestReturn === permutationFourReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationFourReturnRate, 'is the highest return (permutationFour):', (permutationFourReturn - permutationFourTradeVolume), 'BTC profit');

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


      // PERMUTATION FIVE
      // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
    } else if ((permutationFiveOpportunity && permutationFiveTradeVolume > MINIMUM_BTC_TRADE_VOLUME) && highestReturn === permutationFiveReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationFiveReturnRate, 'is the highest return (permutationFive):', (permutationFiveReturn - permutationFiveTradeVolume), 'BTC profit');

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


      // PERMUTATION SIX
      // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
    } else if ((permutationSixOpportunity && permutationSixTradeVolume > MINIMUM_BTC_TRADE_VOLUME) && highestReturn === permutationSixReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationSixReturnRate, 'is the highest return (permutationSix):', (permutationSixReturn - permutationSixTradeVolume), 'BTC profit');

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
    }


    // PART 3.2
    // Since Trinity has no opportunity, try Nash LTC/BTC then Nash ETH/BTC
  } else {

    // ~~~ NASH ~~~
    const NASH_LTC_MINIMUM_TRADABLE_VOLUME = .1; // Can't place an order smaller than "n" LTC
    const NASH_ETH_MINIMUM_TRADABLE_VOLUME = .01; // Can't place an order smaller than "n" ETH

    // PART 3.2.1a
    // If there's an LTC/BTC opportunity for arbitrage in the PRIMARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
    if (primaryLTCOpportunity && primaryLTCOpportunityVolume > NASH_LTC_MINIMUM_TRADABLE_VOLUME) {

      console.log('*** NASH ***');
      console.log('Selling', primaryLTCOpportunityTradableVolume, 'LTC high from', PRIMARY_MARKET['id'], 'at', primaryLTCBid);
      console.log('Buying', primaryLTCOpportunityTradableVolume, 'LTC low from', SECONDARY_MARKET['id'], 'at', secondaryLTCAsk);

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('LTC/BTC', primaryLTCOpportunityTradableVolume, primaryLTCBid));
      });

      primarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( () => {
          console.log('Retry attempted');
        });
      });

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('LTC/BTC', primaryLTCOpportunityTradableVolume, secondaryLTCAsk));
      });

      secondaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondaryBuyOrder, retrying... ***');
        secondaryBuyOrder.then( () => {
          console.log('Retry attempted');
        });
      });

    // PART 3.2.1b
    // If there's an LTC/BTC opportunity for arbitrage in the SECONDARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
  } else if (secondaryLTCOpportunity && secondaryLTCOpportunityTradableVolume > NASH_LTC_MINIMUM_TRADABLE_VOLUME) {

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
        // console.log('Everything worked fine: secondarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondarySellOrder, retrying... ***');
        secondarySellOrder.then( () => {
          console.log('Retry attempted');
        });
      });

      primaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( () => {
          console.log('Retry attempted');
        });
      });

      // PART 3.2.2a
      // If there's an ETH/BTC opportunity for arbitrage in the PRIMARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
    } else if (primaryETHOpportunity && primaryETHOpportunityTradableVolume > NASH_ETH_MINIMUM_TRADABLE_VOLUME) {

      console.log('*** NASH ***');
      console.log('Selling', primaryETHOpportunityTradableVolume, 'ETH high from', PRIMARY_MARKET['id'], 'at', primaryETHBid);
      console.log('Buying', primaryETHOpportunityTradableVolume, 'ETH low from', SECONDARY_MARKET['id'], 'at', secondaryETHAsk);

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('ETH/BTC', primaryETHOpportunityTradableVolume, primaryETHBid));
      });

      primarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( () => {
          console.log('Retry attempted');
        });
      });

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('ETH/BTC', primaryETHOpportunityTradableVolume, secondaryETHAsk));
      });

      secondaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondaryBuyOrder, retrying... ***');
        secondaryBuyOrder.then( () => {
          console.log('Retry attempted');
        });
      });

    // PART 3.2.2b
    // If there's an ETH/BTC opportunity for arbitrage in the SECONDARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
  } else if (secondaryETHOpportunity && secondaryETHOpportunityTradableVolume > NASH_ETH_MINIMUM_TRADABLE_VOLUME) {

      console.log('*** NASH ***');
      console.log('Selling', secondaryETHOpportunityTradableVolume, 'ETH high from', SECONDARY_MARKET['id'], 'at', secondaryETHBid);
      console.log('Buying', secondaryETHOpportunityTradableVolume, 'ETH low from', PRIMARY_MARKET['id'], 'at', primaryETHAsk);

      const secondarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(SECONDARY_MARKET.createLimitSellOrder('ETH/BTC', secondaryETHOpportunityTradableVolume, secondaryETHBid));
      });

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('ETH/BTC', secondaryETHOpportunityTradableVolume, primaryETHAsk));
      });

      secondarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondarySellOrder, retrying... ***');
        secondarySellOrder.then( () => {
          console.log('Retry attempted');
        });
      });

      primaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( () => {
          console.log('Retry attempted');
        });
      });


    }
  }
};
