//TODO: Refactor to use URLSearchParams

const tickersHandlers = new Map(); // {}

const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickers.keys(),
    ].join(",")}&tsyms=USD&api_key=${process.env.VUE_APP_API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cd) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickers.set(ticker, [...subscribers, cd]);
};

export const unsubscribeToTicker = (ticker) => {
  tickersHandlers.delete(ticker);

  // const subscribers = tickersHandlers.get(ticker) || [];
  // tickersHandlers.set(
  //   ticker,
  //   subscribers.filter((fn) => fn !== cd)
  // );
};

setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;
// получать обновления стоимости обновления криптовалютных пар с API
