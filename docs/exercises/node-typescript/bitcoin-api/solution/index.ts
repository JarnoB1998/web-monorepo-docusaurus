import readline from 'readline-sync';

// {
//     "time": {
//       "updated": "Feb 24, 2024 20:37:09 UTC",
//       "updatedISO": "2024-02-24T20:37:09+00:00",
//       "updateduk": "Feb 24, 2024 at 20:37 GMT"
//     },
//     "disclaimer": "This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
//     "chartName": "Bitcoin",
//     "bpi": {
//       "USD": {
//         "code": "USD",
//         "symbol": "&#36;",
//         "rate": "51,557.369",
//         "description": "United States Dollar",
//         "rate_float": 51557.3693
//       },
//       "GBP": {
//         "code": "GBP",
//         "symbol": "&pound;",
//         "rate": "40,663.607",
//         "description": "British Pound Sterling",
//         "rate_float": 40663.6065
//       },
//       "EUR": {
//         "code": "EUR",
//         "symbol": "&euro;",
//         "rate": "47,595.186",
//         "description": "Euro",
//         "rate_float": 47595.1855
//       }
//     }
//   }

interface RootObject {
    bpi: Bpi;
}

interface Bpi {
    USD: Price;
    GBP: Price;
    EUR: Price;
}

interface Price {
    code: string;
    symbol: string;
    rate: string;
    description: string;
    rate_float: number;
}
    

(async () => {
    const currency = readline.question('Welke valuta wil je zien? (EUR, USD, GBP): ');
    if (currency !== 'EUR' && currency !== 'GBP' && currency !== 'USD') {
        console.log('Deze valuta wordt niet ondersteund');
        return;
    }

    const response = await fetch('https://sampleapis.assimilate.be/bitcoin/current');
    const data : RootObject = await response.json();

    let price: Price;
    if (currency === "EUR") {
        price = data.bpi.EUR;
    } else if (currency === "GBP") {
        price = data.bpi.GBP;
    } else {
        price = data.bpi.USD;
    }

    console.log(`De huidige prijs van bitcoin is ${price.rate_float} ${price.code}`);
})();

export {}
