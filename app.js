'use strict';
const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
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
        client.post('statuses/update', { status: 'Sorry. Faucet is empty. 残念ですがfaucetの残高が足りません……(T_T)/  ' + Math.floor(Math.random() * 100000) }, function (error, tweet, response) {
          if (!error) {
            return false;
          }
        });
      } else {
        VerifyUser(tweetJSON, requestAt).then(result => {
          if (!result) {
            return false;
          } else {
            faucetXem(result[0], result[1]);
          }
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

  http.get(URL, (res) => {
    let body = '';
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', (res) => {
      res = JSON.parse(body);
      balance = res["nem:xem"] / 1000000;
      return balance;
    });

  }).on('error', (e) => {
    console.log(e.message); //エラー時
  });
}

/**
 * 日本語版
var stream = client.stream('statuses/filter', {track: 'テストネット用のXEMください'});
stream.on('data', function(event) {
  console.log("eventId:" + event.id + " text:" + event.text + " username:" + event.user.name + " userId:" + event.user.id);
});

stream.on('error', function(error) {
  throw error;
});
 */