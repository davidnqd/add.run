'use strict';

function createLinks(symbol) {
  history.pushState({}, '', `${location.protocol}//${location.host}${location.pathname}?q=${encodeURIComponent(symbol)}` )
  document.getElementById("resources").innerHTML = `
    Find ${symbol} in
    <ul>
      <li><a href="https://www.tradingview.com/symbols/${symbol}/ideas?share_your_love=davidnqd" target="_blank">TradingView (Ideas)</a> [ <a href="https://www.tradingview.com/chart/?symbol=${symbol}&share_your_love=davidnqd" target="_blank">Chart</a> ]</li>
      <li><a href="https://finance.yahoo.com/quote/${symbol}" target="_blank">Yahoo Finance</a> [ <a href="https://finance.yahoo.com/quote/${symbol}/key-statistics" target="_blank">Key Statistics</a> | <a href="https://finance.yahoo.com/quote/${symbol}/analysis" target="_blank">Analyst Estimates</a> | <a href="https://finance.yahoo.com/quote/${symbol}/options?straddle=true" target="_blank">Options</a> | <a href="https://finance.yahoo.com/quote/${symbol}/holders" target="_blank">Holders</a> | <a href="https://finance.yahoo.com/quote/${symbol}/insider-transactions" target="_blank">Insider Trading</a> ]</li>
      <li><a href="https://www.tipranks.com/stocks/${symbol}/forecast" target="_blank">Tip Ranks (Analyst Estimates)</a> [ <a href="https://www.tipranks.com/stocks/${symbol}/stock-analysis" target="_blank">Analyst Ratings</a> | <a href="https://www.tipranks.com/stocks/${symbol}/insider-trading" target="_blank">Insider Trading</a> ]</li>
      <li><a href="https://finviz.com/quote.ashx?t=${symbol}" target="_blank">finviz</a> [ <a href="https://finviz.com/screener.ashx?v=111&t=${symbol}" target="_blank">Screener</a> ]</li>
      <li><a href="https://www.barchart.com/stocks/quotes/${symbol}/overview" target="_blank">Barchart</a> [ <a href="https://www.barchart.com/stocks/quotes/${symbol}/analyst-ratings" target="_blank">Analyst Ratings</a> | <a href="https://www.barchart.com/stocks/quotes/${symbol}/earnings-estimates" target="_blank">Analyst Estimates</a> | <a href="https://www.barchart.com/stocks/quotes/${symbol}/options?view=sbs_ohl" target="_blank">Options</a> | <a href="https://www.barchart.com/stocks/quotes/${symbol}/insider-trades" target="_blank">Insider Trading</a> ]</li>
      <li><a href="https://www.dataroma.com/m/stock.php?sym=${symbol}" target="_blank">Dataroma (Holders &amp; Insider Trading)</a></li>
      <li><a href="https://www.earningswhispers.com/stocks/${symbol}" target="_blank">Earnings Whispers</a></li>
      <li><a href="https://stocksera.pythonanywhere.com/ticker/?quote=${symbol}" target="_blank">Stocksera (Analysis)</a> [ <a href="https://stocksera.pythonanywhere.com/ticker/short_volume/?quote=${symbol}" target="_blank">Short Vol</a> | <a href="https://stocksera.pythonanywhere.com/ticker/options/?quote=${symbol}" target="_blank">Options</a> | <a href="https://stocksera.pythonanywhere.com/ticker/borrowed_shares/?quote=${symbol}" target="_blank">Cost to Borrow</a> ]</li>

    </ul>
  `;
}

const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop) });
const symbol = params.q || "AAPL";

const tv = new TradingView.widget({
  "autosize": true,
  "symbol": symbol,
  "timezone": "Etc/UTC",
  "theme": "dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "hide_legend": false,
  "withdateranges": true,
  "range": "12M",
  "allow_symbol_change": true,
  "save_image": false,
  "details": true,
  "studies": [
    "BB@tv-basicstudies",
    "RSI@tv-basicstudies"
  ],
  "container_id": "tradingview_8867f"
});
tv.postMessage.on("quoteUpdate", e => createLinks(e.short_name));
