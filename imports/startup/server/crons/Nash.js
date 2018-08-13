import ccxt from 'ccxt';
import moment from 'moment';


// PART 0: First, load up authenticated instances of the exchanges, outside of the normal function call to limit API footprint
const hitbtc = new ccxt.hitbtc({
  apiKey: '00000000000000000000000000000000',
  secret: '00000000000000000000000000000000'
});
const bitfinex = new ccxt.bitfinex({
  apiKey: '0000000000000000000000000000000000000000000',
  secret: '0000000000000000000000000000000000000000000'
});
const bittrex = new ccxt.bittrex({
  apiKey: '00000000000000000000000000000000',
  secret: '00000000000000000000000000000000'
});
const PRIMARY_MARKET = hitbtc;
const SECONDARY_MARKET = bitfinex;
const TERTIARY_MARKET = bittrex;
PRIMARY_MARKET.loadMarkets();
SECONDARY_MARKET.loadMarkets();
TERTIARY_MARKET.loadMarkets();

// Good God, yes I know I have to refactor all this. But my, has this been a learning experience!
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
    console.log('*** TIMED OUT: getPrimaryBalance ***');
  });

  getPrimaryLTCOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryLTCOrderBook');
  }, (rejection) => {
    console.log('*** TIMED OUT: getPrimaryLTCOrderBook ***');
  });

  getPrimaryETHOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryETHOrderBook');
  }, (rejection) => {
    console.log('*** TIMED OUT: getPrimaryETHOrderBook ***');
  });

  getSecondaryBalance.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryBalance');
  }, (rejection) => {
    console.log('*** TIMED OUT: getSecondaryBalance ***');
  });

  getSecondaryLTCOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryLTCOrderBook');
  }, (rejection) => {
    console.log('*** TIMED OUT: getSecondaryLTCOrderBook ***');
  });

  getSecondaryETHOrderBook.then( (resolution) => {
    // console.log('Everything worked fine: getSecondaryETHOrderBook');
  }, (rejection) => {
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


  // Get the markets' order books' details
  const MINIMUM_LTC_VOLUME = .9;
  const MINIMUM_ETH_VOLUME = .14;
  const primaryLTCOrderBook = await getPrimaryLTCOrderBook;
  let primaryLTCBid;
  let primaryLTCBidVolume;
  let primaryLTCAsk;
  let primaryLTCAskVolume;
  const primaryETHOrderBook = await getPrimaryETHOrderBook;
  let primaryETHBid;
  let primaryETHBidVolume;
  let primaryETHAsk;
  let primaryETHAskVolume;
  const secondaryLTCOrderBook = await getSecondaryLTCOrderBook;
  let secondaryLTCBid;
  let secondaryLTCBidVolume;
  let secondaryLTCAsk;
  let secondaryLTCAskVolume;
  const secondaryETHOrderBook = await getSecondaryETHOrderBook;
  let secondaryETHBid;
  let secondaryETHBidVolume;
  let secondaryETHAsk;
  let secondaryETHAskVolume;
  const tertiaryLTCOrderBook = await getTertiaryLTCOrderBook;
  let tertiaryLTCBid;
  let tertiaryLTCBidVolume;
  let tertiaryLTCAsk;
  let tertiaryLTCAskVolume;


  // Do not consider any trades where the volumes are too low. Skip them and look at the next highest (out of the top 5)
  const getBestOrderVolume = () => {
    for (i = 4; i >= 0; i--) {
      if (primaryLTCOrderBook['bids'][i][1] > MINIMUM_LTC_VOLUME) {
        primaryLTCBid = primaryLTCOrderBook['bids'][i][0];
        primaryLTCBidVolume = primaryLTCOrderBook['bids'][i][1];
      }

      if (primaryLTCOrderBook['asks'][i][1] > MINIMUM_LTC_VOLUME) {
        primaryLTCAsk = primaryLTCOrderBook['asks'][i][0];
        primaryLTCAskVolume = primaryLTCOrderBook['asks'][i][1];
      }

      if (primaryETHOrderBook['bids'][i][1] > MINIMUM_ETH_VOLUME) {
        primaryETHBid = primaryETHOrderBook['bids'][i][0];
        primaryETHBidVolume = primaryETHOrderBook['bids'][i][1];
      }

      if (primaryETHOrderBook['asks'][i][1] > MINIMUM_ETH_VOLUME) {
        primaryETHAsk = primaryETHOrderBook['asks'][i][0];
        primaryETHAskVolume = primaryETHOrderBook['asks'][i][1];
      }

      if (secondaryLTCOrderBook['bids'][i][1] > MINIMUM_LTC_VOLUME) {
        secondaryLTCBid = secondaryLTCOrderBook['bids'][i][0];
        secondaryLTCBidVolume = secondaryLTCOrderBook['bids'][i][1];
      }

      if (secondaryLTCOrderBook['asks'][i][1] > MINIMUM_LTC_VOLUME) {
        secondaryLTCAsk = secondaryLTCOrderBook['asks'][i][0];
        secondaryLTCAskVolume = secondaryLTCOrderBook['asks'][i][1];
      }

      if (secondaryETHOrderBook['bids'][i][1] > MINIMUM_ETH_VOLUME) {
        secondaryETHBid = secondaryETHOrderBook['bids'][i][0];
        secondaryETHBidVolume = secondaryETHOrderBook['bids'][i][1];
      }

      if (secondaryETHOrderBook['asks'][i][1] > MINIMUM_ETH_VOLUME) {
        secondaryETHAsk = secondaryETHOrderBook['asks'][i][0];
        secondaryETHAskVolume = secondaryETHOrderBook['asks'][i][1];
      }

      if (tertiaryLTCOrderBook['bids'][i][1] > MINIMUM_LTC_VOLUME) {
        tertiaryLTCBid = tertiaryLTCOrderBook['bids'][i][0];
        tertiaryLTCBidVolume = tertiaryLTCOrderBook['bids'][i][1];
      }

      if (tertiaryLTCOrderBook['asks'][i][1] > MINIMUM_LTC_VOLUME) {
        tertiaryLTCAsk = tertiaryLTCOrderBook['asks'][i][0];
        tertiaryLTCAskVolume = tertiaryLTCOrderBook['asks'][i][1];
      }
    };
  };

  await getBestOrderVolume();

  const primaryLTCBTCBalance = primaryBTCBalance + (primaryLTCBalance * primaryLTCAsk);
  const primaryETHBTCBalance = primaryBTCBalance + (primaryETHBalance * primaryETHAsk);
  const secondaryLTCBTCBalance = secondaryBTCBalance + (secondaryLTCBalance * secondaryLTCAsk);
  const secondaryETHBTCBalance = secondaryBTCBalance + (secondaryETHBalance * secondaryETHAsk);


  // <------------------------------------------------------------------------->
  // PART 2: Identify if any permutation has an arbitrage opportunity

  const PRIMARY_FEE = .001; // HitBTC
  const SECONDARY_FEE = .002; // Bitfinex
  const TERTIARY_FEE = .0025; // Bittrex
  const REGULAR_FEES = PRIMARY_FEE + SECONDARY_FEE + TERTIARY_FEE; // .0055%
  const LOWEST_FEES = PRIMARY_FEE + PRIMARY_FEE + TERTIARY_FEE; // .0045%


  // ~~~ NASH ~~~
  // "If this pair of currencies have uneven balances, the difference is the eligible trade volume"

  // LTC trades can only be in "0.1" increments, while ETH and BTC trades can only be in "0.001" increments
  const LTC_DECIMAL_POINTS = 1; // "n" decimal points
  const GENERAL_DECIMAL_POINTS = 3; // "n" decimal points
  const NASH_MINIMUM_DELTA = .0031 // ("n"*100)% delta needs to be present between the two prices or else taker fees eat up my profits

  // LTC/BTC
  const primaryLTCOpportunity = primaryLTCBid > (secondaryLTCAsk * (1 + NASH_MINIMUM_DELTA));
  const secondaryLTCOpportunity = secondaryLTCBid > (primaryLTCAsk * (1 + NASH_MINIMUM_DELTA));
  const primarySpendableLTC = (primaryLTCBalance - primaryLTCBTCBalance / primaryLTCAsk / 2) > 0 ? (primaryLTCBalance - primaryLTCBTCBalance / primaryLTCAsk / 2 * (1 - PRIMARY_FEE)) : 0;
  const secondarySpendableLTCBTC = (secondaryBTCBalance - secondaryLTCBTCBalance / 2) > 0 ? (secondaryBTCBalance - secondaryLTCBTCBalance / 2 * (1 - SECONDARY_FEE)) : 0;
  const secondarySpendableLTC = (secondaryLTCBalance - secondaryLTCBTCBalance / secondaryLTCAsk / 2) > 0 ? (secondaryLTCBalance - secondaryLTCBTCBalance / secondaryLTCAsk / 2 * (1 - SECONDARY_FEE)) : 0;
  const primarySpendableLTCBTC = (primaryBTCBalance - primaryLTCBTCBalance / 2) > 0 ? (primaryBTCBalance - primaryLTCBTCBalance / 2 * (1 - PRIMARY_FEE)) : 0;
  const primaryLTCOpportunityVolume = Math.min(primaryLTCBidVolume, secondaryLTCAskVolume, primarySpendableLTC.toFixed(LTC_DECIMAL_POINTS), (secondarySpendableLTCBTC / secondaryLTCAsk).toFixed(LTC_DECIMAL_POINTS));
  const secondaryLTCOpportunityVolume = Math.min(secondaryLTCBidVolume, primaryLTCAskVolume, secondarySpendableLTC.toFixed(LTC_DECIMAL_POINTS), (primarySpendableLTCBTC / primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS));

  // ETH/BTC
  const primaryETHOpportunity = primaryETHBid > (secondaryETHAsk * (1 + NASH_MINIMUM_DELTA));
  const secondaryETHOpportunity = secondaryETHBid > (primaryETHAsk * (1 + NASH_MINIMUM_DELTA));
  const primarySpendableETH = (primaryETHBalance - primaryETHBTCBalance / primaryETHAsk / 2) > 0 ? (primaryETHBalance - primaryETHBTCBalance / primaryETHAsk / 2) * (1 - PRIMARY_FEE) : 0;
  const secondarySpendableETHBTC = (secondaryBTCBalance - secondaryETHBTCBalance / 2) > 0 ? (secondaryBTCBalance - secondaryETHBTCBalance / 2) * (1 - SECONDARY_FEE) : 0;
  const secondarySpendableETH = (secondaryETHBalance - secondaryETHBTCBalance / secondaryETHAsk / 2) > 0 ? (secondaryETHBalance - secondaryETHBTCBalance / secondaryETHAsk / 2) * (1 - SECONDARY_FEE) : 0;
  const primarySpendableETHBTC = (primaryBTCBalance - primaryETHBTCBalance / 2) > 0 ? (primaryBTCBalance - primaryETHBTCBalance / 2) * (1 - PRIMARY_FEE) : 0;
  const primaryETHOpportunityVolume = Math.min(primaryETHBidVolume, secondaryETHAskVolume, primarySpendableETH.toFixed(GENERAL_DECIMAL_POINTS), (secondarySpendableETHBTC / secondaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS));
  const secondaryETHOpportunityVolume = Math.min(secondaryETHBidVolume, primaryETHAskVolume, secondarySpendableETH.toFixed(GENERAL_DECIMAL_POINTS), (primarySpendableETHBTC / primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS));

  /*
  console.log('===');
  console.log('primarySpendableETH:', primaryETHBalance, '-', primaryETHBTCBalance, '/ 2 /', primaryETHAsk);
  console.log('secondarySpendableETHBTC:', secondaryBTCBalance, '-', secondaryETHBTCBalance, '/ 2');
  console.log('secondarySpendableETH:', secondaryETHBalance, '-', secondaryETHBTCBalance, '/ 2 /', secondaryETHAsk);
  console.log('primarySpendableETHBTC:', primaryBTCBalance, '-', primaryETHBTCBalance, '/ 2');
  console.log('===');
  */

  // ~~~ TRINITY ~~~
  // (Volume checks are always in BTC equivalent, converted backwards)

  const MINIMUM_RETURN_RATE = .0005; // .05% return

  // PERMUTATION ONE
  // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Secondary has LTC (sell LTC for BTC)
  const permutationOneReturnRate = (1 / primaryETHAsk / tertiaryLTCAsk * secondaryLTCBid) - (1 + REGULAR_FEES);
  const permutationOneFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryETHAsk), primaryETHAskVolume);
  const permutationOneFirstTradeBTCValue = (permutationOneFirstTradeVolume * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationOneSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationOneSecondTradeBTCValue = (permutationOneSecondTradeVolume * tertiaryLTCAsk * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationOneThirdTradeVolume = Math.min((secondaryLTCBalance * (1 - SECONDARY_FEE)), secondaryLTCBidVolume);
  const permutationOneThirdTradeBTCValue = (permutationOneThirdTradeVolume * tertiaryLTCAsk * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationOneTradeVolume = Math.min(permutationOneFirstTradeBTCValue, permutationOneSecondTradeBTCValue, permutationOneThirdTradeBTCValue);
  const permutationOneFirstTradeAmount = (permutationOneTradeVolume / primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> ETH
  const permutationOneSecondTradeAmount = (permutationOneTradeVolume / primaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationOneThirdTradeAmount = (permutationOneTradeVolume / primaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationOneReturn = (permutationOneReturnRate > MINIMUM_RETURN_RATE) ? (permutationOneReturnRate * permutationOneTradeVolume) : 0;

  // PERMUTATION TWO
  // Secondary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
  const permutationTwoReturnRate = (1 / secondaryLTCAsk * tertiaryLTCBid * primaryETHBid) - (1 + REGULAR_FEES);
  const permutationTwoFirstTradeVolume = Math.min((secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryLTCAsk), secondaryLTCAskVolume);
  const permutationTwoFirstTradeBTCValue = (permutationTwoFirstTradeVolume * secondaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationTwoSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationTwoSecondTradeBTCValue = (permutationTwoSecondTradeVolume * secondaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationTwoThirdTradeVolume = Math.min((primaryETHBalance * (1 - PRIMARY_FEE)), primaryETHBidVolume);
  const permutationTwoThirdTradeBTCValue = (permutationTwoThirdTradeVolume / tertiaryLTCBid * secondaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationTwoTradeVolume = Math.min(permutationTwoFirstTradeBTCValue, permutationTwoSecondTradeBTCValue, permutationTwoThirdTradeBTCValue);
  const permutationTwoFirstTradeAmount = (permutationTwoTradeVolume / secondaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationTwoSecondTradeAmount = (permutationTwoTradeVolume / secondaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationTwoThirdTradeAmount = (permutationTwoTradeVolume / secondaryLTCAsk * tertiaryLTCBid).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> LTC -> ETH
  const permutationTwoReturn = (permutationTwoReturnRate > MINIMUM_RETURN_RATE) ? (permutationTwoReturnRate * permutationTwoTradeVolume) : 0;

  // PERMUTATION THREE
  // Secondary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
  const permutationThreeReturnRate = (1 / secondaryETHAsk / tertiaryLTCAsk * primaryLTCBid) - (1 + REGULAR_FEES);
  const permutationThreeFirstTradeVolume = Math.min((secondaryBTCBalance * (1 - SECONDARY_FEE) / secondaryETHAsk), secondaryETHAskVolume);
  const permutationThreeFirstTradeBTCValue = (permutationThreeFirstTradeVolume * secondaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationThreeSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationThreeSecondTradeBTCValue = (permutationThreeSecondTradeVolume * tertiaryLTCAsk * secondaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationThreeThirdTradeVolume = Math.min((primaryLTCBalance * (1 - PRIMARY_FEE)), primaryLTCBidVolume);
  const permutationThreeThirdTradeBTCValue = (permutationThreeThirdTradeVolume * tertiaryLTCAsk * secondaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationThreeTradeVolume = Math.min(permutationThreeFirstTradeBTCValue, permutationThreeSecondTradeBTCValue, permutationThreeThirdTradeBTCValue);
  const permutationThreeFirstTradeAmount = (permutationThreeTradeVolume / secondaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> ETH
  const permutationThreeSecondTradeAmount = (permutationThreeTradeVolume / secondaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationThreeThirdTradeAmount = (permutationThreeTradeVolume / secondaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationThreeReturn = (permutationThreeReturnRate > MINIMUM_RETURN_RATE) ? (permutationThreeReturnRate * permutationThreeTradeVolume) : 0;

  // PERMUTATION FOUR
  // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Secondary has ETH (sell ETH for BTC)
  const permutationFourReturnRate = (1 / primaryLTCAsk * tertiaryLTCBid * secondaryETHBid) - (1 + REGULAR_FEES);
  const permutationFourFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryLTCAsk), primaryLTCAskVolume);
  const permutationFourFirstTradeBTCValue = (permutationFourFirstTradeVolume * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFourSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationFourSecondTradeBTCValue = (permutationFourSecondTradeVolume * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFourThirdTradeVolume = Math.min((secondaryETHBalance * (1 - SECONDARY_FEE)), secondaryETHBidVolume);
  const permutationFourThirdTradeBTCValue = (permutationFourThirdTradeVolume / tertiaryLTCBid * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFourTradeVolume = Math.min(permutationFourFirstTradeBTCValue, permutationFourSecondTradeBTCValue, permutationFourThirdTradeBTCValue);
  const permutationFourFirstTradeAmount = (permutationFourTradeVolume / primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationFourSecondTradeAmount = (permutationFourTradeVolume / primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationFourThirdTradeAmount = (permutationFourTradeVolume / primaryLTCAsk * tertiaryLTCBid).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> LTC -> ETH
  const permutationFourReturn = (permutationFourReturnRate > MINIMUM_RETURN_RATE) ? (permutationFourReturnRate * permutationFourTradeVolume) : 0;

  // PERMUTATION FIVE
  // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
  const permutationFiveReturnRate = (1 / primaryETHAsk / tertiaryLTCAsk * primaryLTCBid) - (1 + LOWEST_FEES);
  const permutationFiveFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryETHAsk), primaryETHAskVolume);
  const permutationFiveFirstTradeBTCValue = (permutationFiveFirstTradeVolume * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFiveSecondTradeVolume = Math.min((tertiaryETHBalance * (1 - TERTIARY_FEE) / tertiaryLTCAsk), tertiaryLTCAskVolume);
  const permutationFiveSecondTradeBTCValue = (permutationFiveSecondTradeVolume * tertiaryLTCAsk * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFiveThirdTradeVolume = Math.min((primaryLTCBalance * (1 - PRIMARY_FEE)), primaryLTCBidVolume);
  const permutationFiveThirdTradeBTCValue = (permutationFiveThirdTradeVolume * tertiaryLTCAsk * primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationFiveTradeVolume = Math.min(permutationFiveFirstTradeBTCValue, permutationFiveSecondTradeBTCValue, permutationFiveThirdTradeBTCValue);
  const permutationFiveFirstTradeAmount = (permutationFiveTradeVolume / primaryETHAsk).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> ETH
  const permutationFiveSecondTradeAmount = (permutationFiveTradeVolume / primaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationFiveThirdTradeAmount = (permutationFiveTradeVolume / primaryETHAsk / tertiaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> ETH -> LTC
  const permutationFiveReturn = (permutationFiveReturnRate > MINIMUM_RETURN_RATE) ? (permutationFiveReturnRate * permutationFiveTradeVolume) : 0;

  // PERMUTATION SIX
  // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
  const permutationSixReturnRate = (1 / primaryLTCAsk * tertiaryLTCBid * primaryETHBid) - (1 + LOWEST_FEES);
  const permutationSixFirstTradeVolume = Math.min((primaryBTCBalance * (1 - PRIMARY_FEE) / primaryLTCAsk), primaryLTCAskVolume);
  const permutationSixFirstTradeBTCValue = (permutationSixFirstTradeVolume * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationSixSecondTradeVolume = Math.min((tertiaryLTCBalance * (1 - TERTIARY_FEE)), tertiaryLTCBidVolume);
  const permutationSixSecondTradeBTCValue = (permutationSixSecondTradeVolume * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationSixThirdTradeVolume = Math.min((primaryETHBalance * (1 - PRIMARY_FEE)), primaryETHBidVolume);
  const permutationSixThirdTradeBTCValue = (permutationSixThirdTradeVolume / tertiaryLTCBid * primaryLTCAsk).toFixed(GENERAL_DECIMAL_POINTS);
  const permutationSixTradeVolume = Math.min(permutationSixFirstTradeBTCValue, permutationSixSecondTradeBTCValue, permutationSixThirdTradeBTCValue);
  const permutationSixFirstTradeAmount = (permutationSixTradeVolume / primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationSixSecondTradeAmount = (permutationSixTradeVolume / primaryLTCAsk).toFixed(LTC_DECIMAL_POINTS); // BTC -> LTC
  const permutationSixThirdTradeAmount = (permutationSixTradeVolume / primaryLTCAsk * tertiaryLTCBid).toFixed(GENERAL_DECIMAL_POINTS); // BTC -> LTC -> ETH
  const permutationSixReturn = (permutationSixReturnRate > MINIMUM_RETURN_RATE) ? (permutationSixReturnRate * permutationSixTradeVolume) : 0;

  /*
  console.log('==========');
  console.log('PERMUTATION SIX');
  console.log('permutationSixReturnRate:', permutationSixReturnRate);
  console.log('permutationSixReturn (BTC):', (permutationSixReturnRate * permutationSixTradeVolume), 'vs', permutationSixTradeVolume);
  console.log('permutationSixTradeVolume:', permutationSixTradeVolume);
  console.log('permutationSixFirstTradeBTCValue:', permutationSixFirstTradeBTCValue);
  console.log('permutationSixSecondTradeBTCValue:', permutationSixSecondTradeBTCValue);
  console.log('permutationSixThirdTradeBTCValue:', permutationSixThirdTradeBTCValue);
  console.log('permutationSixThirdTradeVolume (ETH):', (primaryETHBalance * (1 - PRIMARY_FEE)), 'vs', primaryETHBidVolume);
  console.log('==========');
  */

  // <------------------------------------------------------------------------->
  // PART 3: Execution sequence. First try to execute Trinity, then NashLTC, then NashETH (Geppetto comes afterwards in part 4)

  // ~~~ TRINITY ~~~
  // PART 3.1: Identify which Trinity permutation has the highest return (taking volume into account) and execute those trades
  const highestReturn = Math.max(permutationOneReturn, permutationTwoReturn, permutationThreeReturn, permutationFourReturn, permutationFiveReturn, permutationSixReturn);
  const highestReturnRate = Math.max(permutationOneReturnRate, permutationTwoReturnRate, permutationThreeReturnRate, permutationFourReturnRate, permutationFiveReturnRate, permutationSixReturnRate);
  const MINIMUM_BTC_TRADE_VOLUME = .0015; // Because we don't want to trade tiny LTC amounts, for example
  // console.log(highestReturnRate);
  if (highestReturnRate > MINIMUM_RETURN_RATE) {
    console.log('==========');
    console.log('TRADE PROFIT RATES');
    console.log('ONE:  ', permutationOneReturn, 'profit (BTC) |', permutationOneReturnRate, '*', permutationOneTradeVolume);
    console.log('TWO:  ', permutationTwoReturn, 'profit (BTC) |', permutationTwoReturnRate, '*', permutationTwoTradeVolume);
    console.log('THREE:', permutationThreeReturn, 'profit (BTC) |', permutationThreeReturnRate, '*', permutationThreeTradeVolume);
    console.log('FOUR: ', permutationFourReturn, 'profit (BTC) |', permutationFourReturnRate, '*', permutationFourTradeVolume);
    console.log('FIVE: ', permutationFiveReturn, 'profit (BTC) |', permutationFiveReturnRate, '*', permutationFiveTradeVolume);
    console.log('SIX:  ', permutationSixReturn, 'profit (BTC) |', permutationSixReturnRate, '*', permutationSixTradeVolume);
    console.log('==========');
  }

  if (highestReturn > 0) {

    // PERMUTATION ONE
    // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Secondary has LTC (sell LTC for BTC)
    if (permutationOneTradeVolume > MINIMUM_BTC_TRADE_VOLUME && highestReturn === permutationOneReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationOneReturnRate, 'is the highest return (permutationOne):', permutationOneReturn, 'BTC profit');

      console.log('Buying', permutationOneFirstTradeAmount, 'ETH/BTC from', PRIMARY_MARKET['id'], 'at', primaryETHAsk);
      console.log('Buying', permutationOneSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCAsk);
      console.log('Selling', permutationOneThirdTradeAmount, 'LTC/BTC from', SECONDARY_MARKET['id'], 'at', secondaryLTCBid);

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('ETH/BTC', permutationOneFirstTradeAmount, primaryETHAsk));
      });

      primaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const tertiaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiaryBuyOrder');
        resolve(TERTIARY_MARKET.createLimitBuyOrder('LTC/ETH', permutationOneSecondTradeAmount, tertiaryLTCAsk));
      });

      tertiaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: tertiaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiaryBuyOrder, retrying... ***');
        tertiaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const secondarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondarySellOrder');
        resolve(SECONDARY_MARKET.createLimitSellOrder('LTC/BTC', permutationOneThirdTradeAmount, secondaryLTCBid));
      });

      secondarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondarySellOrder, retrying... ***');
        secondarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });


      // PERMUTATION TWO
      // Secondary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
    } else if (permutationTwoTradeVolume > MINIMUM_BTC_TRADE_VOLUME && highestReturn === permutationTwoReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationTwoReturnRate, 'is the highest return (permutationTwo):', permutationTwoReturn, 'BTC profit');

      console.log('Buying', permutationTwoFirstTradeAmount, 'LTC/BTC from', SECONDARY_MARKET['id'], 'at', secondaryLTCAsk);
      console.log('Selling', permutationTwoSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCBid);
      console.log('Selling', permutationTwoThirdTradeAmount, 'ETH/BTC from', PRIMARY_MARKET['id'], 'at', primaryETHBid);

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('LTC/BTC', permutationTwoFirstTradeAmount, secondaryLTCAsk));
      });

      secondaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondaryBuyOrder, retrying... ***');
        secondaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const tertiarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiarySellOrder');
        resolve(TERTIARY_MARKET.createLimitSellOrder('LTC/ETH', permutationTwoSecondTradeAmount, tertiaryLTCBid));
      });

      tertiarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: tertiarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiarySellOrder, retrying... ***');
        tertiarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('ETH/BTC', permutationTwoThirdTradeAmount, primaryETHBid));
      });

      primarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });


      // PERMUTATION THREE
      // Secondary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
    } else if (permutationThreeTradeVolume > MINIMUM_BTC_TRADE_VOLUME && highestReturn === permutationThreeReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationThreeReturnRate, 'is the highest return (permutationThree):', permutationThreeReturn, 'BTC profit');

      console.log('Buying', permutationThreeFirstTradeAmount, 'ETH/BTC from', SECONDARY_MARKET['id'], 'at', secondaryETHAsk);
      console.log('Buying', permutationThreeSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCAsk);
      console.log('Selling', permutationThreeThirdTradeAmount, 'LTC/BTC from', PRIMARY_MARKET['id'], 'at', primaryLTCBid);

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('ETH/BTC', permutationThreeFirstTradeAmount, secondaryETHAsk));
      });

      secondaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondaryBuyOrder, retrying... ***');
        secondaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const tertiaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiaryBuyOrder');
        resolve(TERTIARY_MARKET.createLimitBuyOrder('LTC/ETH', permutationThreeSecondTradeAmount, tertiaryLTCAsk));
      });

      tertiaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: tertiaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiaryBuyOrder, retrying... ***');
        tertiaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('LTC/BTC', permutationThreeThirdTradeAmount, primaryLTCBid));
      });

      primarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });


      // PERMUTATION FOUR
      // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Secondary has ETH (sell ETH for BTC)
    } else if (permutationFourTradeVolume > MINIMUM_BTC_TRADE_VOLUME && highestReturn === permutationFourReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationFourReturnRate, 'is the highest return (permutationFour):', permutationFourReturn, 'BTC profit');

      console.log('Buying', permutationFourFirstTradeAmount, 'LTC/BTC from', PRIMARY_MARKET['id'], 'at', primaryLTCAsk);
      console.log('Selling', permutationFourSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCBid);
      console.log('Selling', permutationFourThirdTradeAmount, 'ETH/BTC from', SECONDARY_MARKET['id'], 'at', secondaryETHBid);

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('LTC/BTC', permutationFourFirstTradeAmount, primaryLTCAsk));
      });

      primaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const tertiarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiarySellOrder');
        resolve(TERTIARY_MARKET.createLimitSellOrder('LTC/ETH', permutationFourSecondTradeAmount, tertiaryLTCBid));
      });

      tertiarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: tertiarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiarySellOrder, retrying... ***');
        tertiarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const secondarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondarySellOrder');
        resolve(SECONDARY_MARKET.createLimitSellOrder('ETH/BTC', permutationFourThirdTradeAmount, secondaryETHBid));
      });

      secondarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondarySellOrder, retrying... ***');
        secondarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });


      // PERMUTATION FIVE
      // Primary has BTC (buy ETH with BTC), Tertiary has ETH (buy LTC with ETH), Primary has LTC (sell LTC for BTC)
    } else if (permutationFiveTradeVolume > MINIMUM_BTC_TRADE_VOLUME && highestReturn === permutationFiveReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationFiveReturnRate, 'is the highest return (permutationFive):', permutationFiveReturn, 'BTC profit');

      console.log('Buying', permutationFiveFirstTradeAmount, 'ETH/BTC from', PRIMARY_MARKET['id'], 'at', primaryETHAsk);
      console.log('Buying', permutationFiveSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCAsk);
      console.log('Selling', permutationFiveThirdTradeAmount, 'LTC/BTC from', PRIMARY_MARKET['id'], 'at', primaryLTCBid);

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('ETH/BTC', permutationFiveFirstTradeAmount, primaryETHAsk));
      });

      primaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const tertiaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiaryBuyOrder');
        resolve(TERTIARY_MARKET.createLimitBuyOrder('LTC/ETH', permutationFiveSecondTradeAmount, tertiaryLTCAsk));
      });

      tertiaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: tertiaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiaryBuyOrder, retrying... ***');
        tertiaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('LTC/BTC', permutationFiveThirdTradeAmount, primaryLTCBid));
      });

      primarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });


      // PERMUTATION SIX
      // Primary has BTC (buy LTC with BTC), Tertiary has LTC (sell LTC for ETH), Primary has ETH (sell ETH for BTC)
    } else if (permutationSixTradeVolume > MINIMUM_BTC_TRADE_VOLUME && highestReturn === permutationSixReturn) {

      console.log('*** TRINITY ***');
      console.log(permutationSixReturnRate, 'is the highest return (permutationSix):', permutationSixReturn, 'BTC profit');

      console.log('Buying', permutationSixFirstTradeAmount, 'LTC/BTC from', PRIMARY_MARKET['id'], 'at', primaryLTCAsk);
      console.log('Selling', permutationSixSecondTradeAmount, 'LTC/ETH from', TERTIARY_MARKET['id'], 'at', tertiaryLTCBid);
      console.log('Selling', permutationSixThirdTradeAmount, 'ETH/BTC from', PRIMARY_MARKET['id'], 'at', primaryETHBid);

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('LTC/BTC', permutationSixFirstTradeAmount, primaryLTCAsk));
      });

      primaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const tertiarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'tertiarySellOrder');
        resolve(TERTIARY_MARKET.createLimitSellOrder('LTC/ETH', permutationSixSecondTradeAmount, tertiaryLTCBid));
      });

      tertiarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: tertiarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: tertiarySellOrder, retrying... ***');
        tertiarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry completed');
        });
      });

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('ETH/BTC', permutationSixThirdTradeAmount, primaryETHBid));
      });

      primarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( (success, error) => {
          console.log(error);
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
      console.log('Selling', primaryLTCOpportunityVolume, 'LTC high from', PRIMARY_MARKET['id'], 'at', primaryLTCBid);
      console.log('Buying', primaryLTCOpportunityVolume, 'LTC low from', SECONDARY_MARKET['id'], 'at', secondaryLTCAsk);

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('LTC/BTC', primaryLTCOpportunityVolume, primaryLTCBid));
      });

      primarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry attempted');
        });
      });

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('LTC/BTC', primaryLTCOpportunityVolume, secondaryLTCAsk));
      });

      secondaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondaryBuyOrder, retrying... ***');
        secondaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry attempted');
        });
      });

    // PART 3.2.1b
    // If there's an LTC/BTC opportunity for arbitrage in the SECONDARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
  } else if (secondaryLTCOpportunity && secondaryLTCOpportunityVolume > NASH_LTC_MINIMUM_TRADABLE_VOLUME) {

      console.log('*** NASH ***');
      console.log('Selling', secondaryLTCOpportunityVolume, 'LTC high from', SECONDARY_MARKET['id'], 'at', secondaryLTCBid);
      console.log('Buying', secondaryLTCOpportunityVolume, 'LTC low from', PRIMARY_MARKET['id'], 'at', primaryLTCAsk);

      const secondarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondarySellOrder');
        resolve(SECONDARY_MARKET.createLimitSellOrder('LTC/BTC', secondaryLTCOpportunityVolume, secondaryLTCBid));
      });

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('LTC/BTC', secondaryLTCOpportunityVolume, primaryLTCAsk));
      });

      secondarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondarySellOrder, retrying... ***');
        secondarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry attempted');
        });
      });

      primaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry attempted');
        });
      });

      // PART 3.2.2a
      // If there's an ETH/BTC opportunity for arbitrage in the PRIMARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
    } else if (primaryETHOpportunity && primaryETHOpportunityVolume > NASH_ETH_MINIMUM_TRADABLE_VOLUME) {

      console.log('*** NASH ***');
      console.log('Selling', primaryETHOpportunityVolume, 'ETH high from', PRIMARY_MARKET['id'], 'at', primaryETHBid);
      console.log('Buying', primaryETHOpportunityVolume, 'ETH low from', SECONDARY_MARKET['id'], 'at', secondaryETHAsk);

      const primarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primarySellOrder');
        resolve(PRIMARY_MARKET.createLimitSellOrder('ETH/BTC', primaryETHOpportunityVolume, primaryETHBid));
      });

      primarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: primarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
        primarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry attempted');
        });
      });

      const secondaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondaryBuyOrder');
        resolve(SECONDARY_MARKET.createLimitBuyOrder('ETH/BTC', primaryETHOpportunityVolume, secondaryETHAsk));
      });

      secondaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondaryBuyOrder, retrying... ***');
        secondaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry attempted');
        });
      });

    // PART 3.2.2b
    // If there's an ETH/BTC opportunity for arbitrage in the SECONDARY_MARKET, and the opportunity's volume is above the minimum tradable volume, make the trades
  } else if (secondaryETHOpportunity && secondaryETHOpportunityVolume > NASH_ETH_MINIMUM_TRADABLE_VOLUME) {

      console.log('*** NASH ***');
      console.log('Selling', secondaryETHOpportunityVolume, 'ETH high from', SECONDARY_MARKET['id'], 'at', secondaryETHBid);
      console.log('Buying', secondaryETHOpportunityVolume, 'ETH low from', PRIMARY_MARKET['id'], 'at', primaryETHAsk);

      const secondarySellOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'secondarySellOrder');
        resolve(SECONDARY_MARKET.createLimitSellOrder('ETH/BTC', secondaryETHOpportunityVolume, secondaryETHBid));
      });

      const primaryBuyOrder = new Promise( (resolve, reject) => {
        setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
        resolve(PRIMARY_MARKET.createLimitBuyOrder('ETH/BTC', secondaryETHOpportunityVolume, primaryETHAsk));
      });

      secondarySellOrder.then( (resolution) => {
        // console.log('Everything worked fine: secondarySellOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: secondarySellOrder, retrying... ***');
        secondarySellOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry attempted');
        });
      });

      primaryBuyOrder.then( (resolution) => {
        // console.log('Everything worked fine: primaryBuyOrder');
      }, (rejection) => {
        console.log(rejection);
        console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
        primaryBuyOrder.then( (success, error) => {
          console.log(error);
          console.log('Retry attempted');
        });
      });

    }
  }


  // <------------------------------------------------------------------------->
  // PART 4: Run Geppetto, the market maker bot
  // WHEN THIS IS COMPLETED, MOVE IT TO PART 2 SO THAT ITS MORE LIKELY TO CHECK AND PLACE ORDERS BEFORE NASH AND TRINITY

  // ~~~ GEPPETTO ~~~

  /*
  // Look up any outstanding orders
  const getPrimaryLTCOrders = new Promise( (resolve, reject) => {
    setTimeout(reject, TIMEOUT, 'getPrimaryLTCOrders');
    resolve(PRIMARY_MARKET.fetchOrders('LTC/BTC'));
  });

  getPrimaryLTCOrders.then( (resolution) => {
    // console.log('Everything worked fine: getPrimaryLTCOrders');
  }, (rejection) => {
    console.log('*** TIMED OUT: getPrimaryLTCOrders ***');
  });

  // Note: Geppetto doesn't care about the volumes of the current asks/bids, only their positions
  const LTC_MAKER_SPREAD = .00001; // "n" LTC points. WILL NEED ADJUSTING AS LTC VALUES GO UP!
  const makerLTCHighAsk = primaryLTCOrderBook['asks'][0][0] + LTC_MAKER_SPREAD;
  const makerLTCLowBid = primaryLTCOrderBook['bids'][0][0] - LTC_MAKER_SPREAD;
  const primaryLTCOrders = await getPrimaryLTCOrders[0];
  let outstandingLTCSellOrders = [];
  let outstandingLTCBuyOrders = [];

  // If any order is not where it should be according to the maintainance calculation, cancel it...
  primaryLTCOrders.forEach( (order) => {
    if (order['symbol'] === 'LTC/BTC' && order['status'] !== 'closed') {

      // Cancel the sell order
      if (order['side'] === 'sell' && order['price'] > makerLTCHighAsk) {

        const cancelSellOrder = new Promise( (resolve, reject) => {
          setTimeout(reject, TIMEOUT, 'cancelSellOrder');
          resolve(PRIMARY_MARKET.cancelOrder(order['id']));
        });

        cancelSellOrder.then( (resolution) => {
          // console.log('Everything worked fine: cancelSellOrder');
        }, (rejection) => {
          console.log(rejection);
          console.log('*** TIMED OUT: cancelSellOrder, retrying... ***');
          cancelSellOrder.then( (success, error) => {
            console.log(error);
            console.log('Retry attempted');
          });
        });

        // Cancel the buy order
      } else if (order['side'] === 'buy' && order['price'] < makerLTCLowBid) {

        const cancelBuyOrder = new Promise( (resolve, reject) => {
          setTimeout(reject, TIMEOUT, 'cancelBuyOrder');
          resolve(PRIMARY_MARKET.cancelOrder(order['id']));
        });

        cancelBuyOrder.then( (resolution) => {
          // console.log('Everything worked fine: cancelBuyOrder');
        }, (rejection) => {
          console.log(rejection);
          console.log('*** TIMED OUT: cancelBuyOrder, retrying... ***');
          cancelBuyOrder.then( (success, error) => {
            console.log(error);
            console.log('Retry attempted');
          });
        });

      }

      // ...but if the order is still relevant, push it to the appropriate array.
    } else if (order['side'] === 'sell' && order['price'] <= makerLTCHighAsk) {
      outstandingLTCSellOrders.push(order);
    } else if (order['side'] === 'buy' && order['price'] >= makerLTCLowBid) {
      outstandingLTCBuyOrders.push(order);
    } else {
      console.log('GEPPETTO: Rouge order detected');
      console.log(order);
    }
  });

  // If there are fewer than 1 outstanding orders on each side, place both a buy order and a sell order
  if (outstandingLTCSellOrders.length < 1 || outstandingLTCBuyOrders.length < 1) {

    const GEPPETTO_LTC_VOLUME = 1; // "n" LTC
    console.log('GEPPETTO: Placing orders...');

    const primarySellOrder = new Promise( (resolve, reject) => {
      setTimeout(reject, TIMEOUT, 'primarySellOrder');
      resolve(PRIMARY_MARKET.createLimitSellOrder('LTC/BTC', GEPPETTO_LTC_VOLUME, makerLTCHighAsk));
    });

    const primaryBuyOrder = new Promise( (resolve, reject) => {
      setTimeout(reject, TIMEOUT, 'primaryBuyOrder');
      resolve(PRIMARY_MARKET.createLimitBuyOrder('LTC/BTC', GEPPETTO_LTC_VOLUME, makerLTCLowBid));
    });

    primarySellOrder.then( (resolution) => {
      // console.log('Everything worked fine: primarySellOrder');
    }, (rejection) => {
      console.log(rejection);
      console.log('*** TIMED OUT: primarySellOrder, retrying... ***');
      primarySellOrder.then( (success, error) => {
        console.log(error);
        console.log('Retry attempted');
      });
    });

    primaryBuyOrder.then( (resolution) => {
      // console.log('Everything worked fine: primaryBuyOrder');
    }, (rejection) => {
      console.log(rejection);
      console.log('*** TIMED OUT: primaryBuyOrder, retrying... ***');
      primaryBuyOrder.then( (success, error) => {
        console.log(error);
        console.log('Retry attempted');
      });
    });

  }
  */

};
