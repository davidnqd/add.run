'use strict';

const PAIRS = {
    "SRM": "5suXmvdbKQ98VonxGCXqViuWRu8k4zgZRxndYKsH2fJg",
    "SLND": "CviGNzD2C9ZCMmjDt5DKCce5cLV4Emrcm3NFvwudBFKA",
    "FTT": "8bDyV3N7ctLKoaSVqUoEwUzw6msS2F65yyNPgAVUisKm",
    "MER": "5Sb6wDpweg6mtYksPJ2pfGbSyikrhR8Ut8GszcULQ83A",
    "UST": "Ab48bKsiEzdm481mGaNVmv9m9DmXsWWxcYHM588M59Yd",
    "USDC": "BgxfHJDzm44T7XG68MYKx7YisTjZu73tVovyZSjJMpmw",
    "SBR": "Hthrt4Lab21Yz1Dx9Q4sFW4WVihdBUTtWRQBjPsYHCor",
    "ETH": "CPDiKagfozERtJ33p7HHhEfJERjvfk1VAjMXAFLrvrKP",
    "mSOL": "CCpirWrgNuBVLdkP2haxLTbD6XqEgaYuVXixbbpxUB6",
    "USDT": "8K9WC8xoh2rtQNY7iEGXtPvfbDCi563SdWhCAhuMP2xE",
    "RAY": "9n2exoMQwMTzfw6NFoFFujxYPndWVLtKREJePssrKb36",
    "BTC": "GYzjMCXTDue12eUGKKWAqtF5jcBYNmewr6Db6LaguEaX",
    "stSOL": "5sjkv6HD8wycocJ4tC4U36HHbvgcXYqcyiPRUkncnwWs",
    "ORCA": "FKZTsydxPShJ8baThobis6qFxTjALMkVC49EA88wqvm7",
    "USDT-USDC": "9mZsd1b9cN7JyqJvkbqhVuTfg8PAuKjuhPxpcsVNjYoC",
    "SOL": "8PbodeaosQP19SjYFx855UMqWxH2HynZLdBXmsrbac36",
    "soFTT": "2dC4V23zJxuv521iYQj8c471jrxYLNQFaGS6YPwtTHMd",
    "scnSOL": "DUExYJG5sc1SQdMMdq6LdUYW9ULXbo2fFFTbedywgjNN",
    "soETH": "3PArRsZQ6SLkr1WERZWyC6AqsajtALMq4C66ZMYz4dKQ",
    "mSOL-SOL": "6ve8XyELbecPdbzSTsyhYKiWr7wg3JpjfxE1cqoN9qhN"
};

let apyData;
let wallet;
let lastReload;

async function reload() {
  const marinade = fetch(new Request('https://api.marinade.finance/msol/apy/1y', {
    method: 'GET',
    headers: { accept: 'application/json' },
    mode: 'cors',
    cache: 'default'
  })).then(response => response.json());
  const solend = fetch(new Request(`https://api.solend.fi/v1/reserves/?ids=${$('#supply').val()},${$('#borrow').val()}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
    mode: 'cors',
    cache: 'default'
  })).then(response => response.json());
  return Promise.all([marinade, solend])
    .then(val => {
      lastReload = new Date();
      return val;
    });
}

function map(raw, symbol) {
  const result = {
    supply: {
      [symbol]: raw.rates.supplyInterest / 100
    },
    borrow: {
      [symbol]: raw.rates.borrowInterest / -100
    },
    value: raw.reserve.liquidity.marketPrice/10**18,
    protocalFee: (raw.reserve.config.fees.borrowFeeWad/10**18) * -1
  };
  raw.rewards.forEach((item) => result[item.side][item.rewardSymbol] = (result[item.side][item.rewardSymbol] || 0) + item.apy / 100);
  return result;
}

function cacheValues(values) {
  const [marinade, solend] = values;
  const supplySymbol = $( "#supply option:selected" ).text();
  const borrowSymbol = $( "#borrow option:selected" ).text();
  apyData = {
    [supplySymbol]: map(solend.results[0], supplySymbol),
    [borrowSymbol]: map(solend.results[1], borrowSymbol)
  };
  if (supplySymbol === 'mSOL') {
    apyData['mSOL'].supply['mSOL Intrinsic APY'] = marinade.value;
  }
}

function addToWallet(symbol, amount, ...notes) {
  wallet[symbol] = (wallet[symbol] || 0) + amount;
  let log = `${symbol.padEnd(20, ' ')} + $${amount}`.padEnd(45, ' ');
  for (let note of notes) {
    log += ` = ${note}`;
  }
  log += `\n`;
  output.append(log);
}

function supply(limit, symbol) {
  let fee = $('#fee').val() * -1;
  let netAPY = 0;
  addToWallet(symbol, limit, `Supply $${limit} as ${symbol}`);
  addToWallet('SOL', fee, 'Transaction Fee');
  for (const reward in apyData[symbol].supply) {
    const rewardApy = apyData[symbol].supply[reward];
    const rewardValue = limit * rewardApy;
    addToWallet(reward, rewardValue, `$${limit} * ${rewardApy*100}%`);
  }
}

function borrow(limit, symbol) {
  let protocalFee = limit * apyData[symbol].protocalFee;
  let transactionFee = $('#fee').val() * -1;
  let fee = protocalFee + transactionFee;
  addToWallet(symbol, limit*-1, `Borrow $${limit} as ${symbol}`);
  addToWallet('SOL', fee, 'Fee', `$${transactionFee} + ($${limit} * ${apyData[symbol].protocalFee * 100}%)`, 'Transaction Fee + Protocal Fee');
  let netAPY = 0;
  for (const reward in apyData[symbol].borrow) {
    const rewardApy = apyData[symbol].borrow[reward];
    const rewardValue = limit * rewardApy;
    addToWallet(reward, rewardValue, `$${limit} * ${rewardApy*100}%`, `$${limit} * APY%`);
  }
}

function redraw() {
  const supplySymbol = $( "#supply option:selected" ).text();
  const borrowSymbol = $( "#borrow option:selected" ).text();
  wallet = { SOL: 0, mSOL: 0 };
  wallet[supplySymbol] = 0;
  wallet[borrowSymbol] = 0;
  const initialValue = parseFloat(initial.value);
  output.innerHTML = '\nFull Details\n';
  output.append(`--------------------------------------------------------------------------------\n`);
  output.append(`When this page was loaded (${lastReload}), your browser requested the following data from solend.fi and marinade.finance APIs:\n`);
  output.append(jsyaml.dump(apyData) + '\n');
  output.append(`Initial Supply\n`);
  supply(initialValue, $("#supply option:selected" ).text());
  let sum = Object.values(wallet).reduce((partialSum, a) => partialSum + a, 0);
  output.append(`--------------------------------------------------------------------------------\n`);
  output.append(`Net = ${sum-initialValue} Total = ${sum}\n\n`);

  let lastSum;
  let limit = initialValue;
  for (let i = 1; i <= parseInt(loops.value); i++) {
    lastSum = sum;
    limit = limit * parseFloat(ltv.value);
    output.append(`Loop Iteration: ${i}\n`);
    borrow(limit, $("#borrow option:selected" ).text());
    addToWallet('SOL', $('#fee').val() * -1, 'Transaction Fee', `Swapping/Staking ${borrowSymbol} for ${supplySymbol}`);
    supply(limit, $("#supply option:selected" ).text());
    sum = Object.values(wallet).reduce((partialSum, a) => partialSum + a, 0);
    output.append(`--------------------------------------------------------------------------------\n`);
    output.append(`Net\t= ${sum-lastSum}\n\n`);
  }
  sum = Object.values(wallet).reduce((partialSum, a) => partialSum + a, 0);
  output.prepend(`TOTAL                = $${sum}\n`);
  output.prepend(`NET                  = $${sum - initialValue}\n`);
  output.prepend(`================================================================================\n`);
  for (const reward in wallet) {
    output.prepend(`${reward.padEnd(20, ' ')} = $${wallet[reward]}\n`);
  }
}

async function refresh() {
  return reload()
    .then(cacheValues)
    .then(redraw);
}

for (let symbol in PAIRS) {
  $('#supply').append($('<option>', {
      value: PAIRS[symbol],
      text: symbol,
      selected: symbol === 'mSOL'
  }));
  $('#borrow').append($('<option>', {
      value: PAIRS[symbol],
      text: symbol,
      selected: symbol === 'SOL'
  }));
}
refresh();
