export const environment = {
  production: true,
  // coreAppURL: "https://testapi.i4option.com",
  coreAppURL: "https://coreapi.i4option.com",
  wsURL: "wss://wsapii4option.niftyaction.com/", 
  // wsURL: "wss://api.i4option.com", 
  // wsTradeURL: "wss://market.i4option.com",
  // wsTradeURL: "wss://wsapimarket.ensuenotech.com/",
  wsTradeURL: "wss://wsapimarket.niftyaction.com/",
  timezone: "Asia/Kolkata",
  locale: "en-us",authentication: {
    rsa: {
      key: 'i4#12345678900987654321',
      enabled:true
    }
  }
};
