'use strict';
const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const VerifyUser = require('./routes/verifyuser');
const faucetXem = require('./routes/faucetxem')

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/

var stream = client.stream('statuses/filter', { track: 'Please give me testnet NEM:XEM!' });
stream.on('data', function (event) {
  if (event) {
    let requestTweetId = event.id_str;
    let userId = event.user.id_str;
    let userScreenName = event.user.screen_name;
    let userText = event.text;
    let requestAt = Date.now();

    console.info(userScreenName + userId + 'から' + requestAt + 'にリクエストを受け取りました。:' + userText)

    // 対象のつぶやきにfavoritesをつける 
    client.post('favorites/create', { id: requestTweetId }, function (error, tweet, response) {
      if (!error) {
        console.log("favorite to request tweet.");
      }
    });

    faucetBalance().then(balance => {
      if (balance < 1) {
        client.post('statuses/update', { status: '@' + userScreenName + ' Sorry. Faucet is empty or stoping tipbot. 残念ですがfaucetの残高が足りないかtipbotが停止しています……(T_T)/  ' + Math.floor(Math.random() * 100000) }, function (error, tweet, response) {
          if (!error) {
            return false;
          }
        });
      } else {
        VerifyUser(event, requestAt).then(result => {
          if (!result) {
            return false;
          } else {
            faucetXem(result[0], result[1]);
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }
});

stream.on('error', function (error) {
  throw error;
});

/**
 * @return {number} xem balance
 * // GET　mainnet: http://tipnem.tk:5745/user/balance/tipnem_faucet
 * // GET　testnet: http://tipnem.tk:5746/user/balance/tipfaucet_test
 */
function faucetBalance() {
  let balance = 0;
  let http = require('http');
  const URL = 'http://tipnem.tk:5746/user/balance/tipfaucet_test';

  return new Promise((resolve, reject) => {
      var req = http.get(URL, (res) => {
      let body = '';
      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', (res) => {
        res = JSON.parse(body);
        balance = res["nem:xem"] / 1000000;
        resolve(balance);
      });
    }).on('error', (e) => {
      console.log(e.message); 
    });
    req.setTimeout(500); //500ms応答がない場合はbotが停止しているとみなす

    req.on('timeout', function () {
      console.log('request timed out');
      resolve(0); // botが停止しているときに 0 を返す
      req.abort()
    });
  });
};

