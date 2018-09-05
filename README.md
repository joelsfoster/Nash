### Nash - Cryptocurrency trading bot

#### History and Disclaimer

This bot was created towards the mid-to-end of 2017, right before the crypto market had it's massive bull run. This bot was effectively profitable so long as there weren't massive swings in price action--back then, the price was going sideways with small ups and downs, but always returning back to a baseline price. Now that crypto has been thrust into the limelight and exchanges are full of people taking advantage of each other for profit, the price is no longer stable and thus this bot is highly ineffective. **I highly advise you do not use this bot for this reason--given the market dynamics, you are almost guaranteed to lose money.**

#### What this bot does

That being said, **Nash** is a triangular arbitrage bot. This means that it trades using 3 currencies and 3 exchanges. A regular 2-sided arbitrage uses 2 currencies and 2 exchanges: for example, if BTC/ETH is different across two exchanges, you can simply sell ETH on one exchange and buy it on the other for easy net profit. This practice is now very, very common and there is little opportunity doing this.

With triangular arbitrage you monitor 3 currencies and their interrelated pairs (i.e. BTC/ETH, BTC/LTC, and ETH/LTC) across 3 different exchanges. When an opportunity arises, you "rotate" funds through those 3 pairs across those 3 exchanges. Example:

```
Binance: Sell 1 BTC for 10 ETH
Bittrex: Sell 10 ETH for 51 LTC
Bitfinex: Sell 51 LTC for 1.1 BTC

```
These 3 orders are placed simultaneously. Because of market inefficiencies across currency pairs, your result will be more in net total value (denominated in $USD or BTC) than you started out with. This bot takes trading fees into account so that it only identifies opportunities past a user-defined threshold.

After I implemented this functionality (aka "Trinity"), I wrote fallback logic to trade any 2-sided arbitrage opportunities (which rarely happened), which I called NashETH and NashLTC. I started working on market-maker logic as well (called "Geppetto"), but I never finished it so it remains commented out.


#### A note for developers

I wrote this when I was just starting to hone my coding skills. The codebase quickly got out of hand and is now in dire need of refactoring. I was poor at using Git so lots of crap is just commented out. I didn't use promises or async/await like I should have. Callback hell is real. I didn't split up the code into manageable files. I broke DRY a LOT. I used the Meteor.js framework along with all its useless boilerplate because that's all I knew how to work with at the time. Please don't judge :), I promise I write far better and more organized code now.

**All bot logic can be found in imports/startup/server/crons/Nash.js**
