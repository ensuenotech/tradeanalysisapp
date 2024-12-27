// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

//TRADE ARRAY
//0	symbol,
// 1	SymbolID,
// 2	OPEN
// 3	HIGH
// 4	LOW
// 5	Close
// 6	privious close
// 7	volume
// 8	oi
// 9	previous OI
// 10	turn over
// 11   ATP
// 12	 Price change
// 13	Change %


//just for testing 

export const environment = {
  production:false,
  // coreAppURL: "http://tradeanalysisapi.i4option.com",
  coreAppURL: "https://testapi.i4option.com",
  timezone: "Asia/Kolkata",
  locale: "en-us",
  authentication: {
    rsa: {
      key: 'i4#12345678900987654321',
      enabled:true
    }
  }
};
