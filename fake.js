const createServer = require('sse-fake-server');
const { v4: uuidv4 } = require('uuid');

const generateRandomDecimal = (currency) => {
  const multiplier = currency==='usd' ? 0.00998 : 0.00998 * 1.7;
  const randomValue = Math.random() * multiplier + 0.001;
  const formattedValue = randomValue.toFixed(15);
  return formattedValue;
}

const configs = [
  {
    currency: 'usd',
    port: 5555
  },
  {
    currency: 'sgd',
    port: 5556
  }
]

const providers = ['Coinbase', 'Kraken', 'Fixer', 'Lightnet', 'dLocal', 'mainsys', 'Flutterwave'];

for (let config of configs) {
  const { currency, port } = config;
  createServer(currency, port, client => {
    let rates_count = 0;
    // Every 2 seconds send data to client
    setInterval(() => {
      const id = uuidv4();
      const date = new Date();
      rates_count++;

      const data = {
        id,
        version: 1,
        providers_contrib: {
          name: providers[Math.floor(Math.random() * 7)],
        },
        rates_count,
        outliers_perc: 0,
        created_at: date.toISOString(),
        base: currency.toUpperCase(),
        quote: "BTC",
        rate_base_quote: "123",
        rate_base: "1",
        rate_quote: generateRandomDecimal(currency),
      };

      client.send(JSON.stringify(data));
    }, 2000);
  });
}
