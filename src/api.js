//TODO: Refactor to use URLSearchParams

const tickersHandlers = new Map(); // {}

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${process.env.VUE_APP_API_KEY}`
);

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTicker = (ticker, cd) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cd]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

window.tickers = tickersHandlers;
// получать обновления стоимости обновления криптовалютных пар с API

// не испольуется
// const loadTickers = () => {
//   if (tickersHandlers.size === 0) {
//     return;
//   }

//   fetch(
//     `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
//       ...tickers.keys(),
//     ].join(",")}&tsyms=USD&api_key=${process.env.VUE_APP_API_KEY}`
//   )
//     .then((r) => r.json())
//     .then((rawData) => {
//       const updatedPrices = Object.fromEntries(
//         Object.entries(rawData).map(([key, value]) => [key, value.USD])
//       );

//       Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
//         const handlers = tickersHandlers.get(currency) ?? [];
//         handlers.forEach((fn) => fn(newPrice));
//       });
//     });
// };
// setInterval(loadTickers, 500000000);
