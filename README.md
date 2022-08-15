# How to run
``yarn && yarn start``

## Side notes
- Prices data is fetched via Websocket connections for Binance, Bitfinex, Kraken
- Prices data for Huobi is fetch via local NodeJS Server due to CORS blocking and Huobi websocket not working
- Trades data is fetch via local NodeJS server, due to CORS Blocking on client side (for all providers)

## Folder structure
 - ``/server`` - Holds basic back-end implementation for fetching data for all providers
 - ``/src`` - All front end implementation
 - ``/src/components`` - UI Elements
 - ``/src/contexts`` - Contexts implemented for socket connections & huobi local fetch
 - ``/src/hooks`` - Custom hooks handling logic URL changes, fetched data for prices
 - ``/src/redux`` - Redux implementation for holding trades data in store
 - ``/src/router`` - Basic routing navigation
 - ``/src/screen`` - Hold screen/s (currently only one screen is implemented)
