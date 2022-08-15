const BASE_URL = process.env.REACT_APP_LOCAL_SERVER;

// Fetch data from local server API to get data for trades from all providers
export function fetchTrades(pair) {
  return fetch(`${BASE_URL}/${pair}`)
    .then((res) => res.json())
    .then((data) => {
      return Promise.resolve({ data });
    })
    .catch((err) => {
      return Promise.resolve({ data: [] });
    });
}
