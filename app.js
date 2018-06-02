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
 * filter message: En message OR Ja message OR tip message
 **/
var stream = client.stream('statuses/filter', { track: '@tipnem_faucet Please tip me NEM:XEM!,@tipnem_faucet NEM:XEMちょっとください,@tipnem tip @tipnem_faucet' });
stream.on('data', function (event) {
  if (event) {
    let requestTweetId = event.id_str;
    let userId = event.user.id_str;
    let userScreenName = event.user.screen_name;
    let userText = event.text;
    let requestAt = Date.now();

    console.info(userScreenName + userId + 'から' + requestAt + 'にリクエストを受け取りました。:' + userText)
    
    if (new RegExp('@tipnem tip @tipnem_faucet').test(userText)) {
      // tipコマンドを検知した場合のみ残高を確定して処理を終了する。
      ConfirmBalance();
    } else {
      faucetBalance().then(balance => {
        if (balance < 1) {
          client.post('statuses/update', { status: '@' + userScreenName + ' Sorry. Faucet is empty or stoping tipbot. 残念ですがfaucetの残高が足りないかtipbotが停止しています……(T_T)/  ' + Math.floor(Math.random() * 100000) }, function (error, tweet, response) {
            if (!error) {
              console.log('tweet Faucet empty or stoping tipbot');
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
  const URL = 'http://tipnem.tk:5745/user/balance/tipnem_faucet';

  return new Promise((resolve, reject) => {
    var req = http.get(URL, (res) => {
      let body = '';
      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', (res) => {
        /** 残高確認APIの接続がエラーの場合tipnemのAPIから
         * "not found user info"もしくは"not found select name or not allowed"が返ってくるため
         * 対応する処理を行う
        */
        if (new RegExp('not found').test(body)) {
          console.log("残高確認のリクエストが許可されているか確認してください:" + body);
          resolve(0);
        } else {
          res = JSON.parse(body);
          balance = res["nem:xem"] / 1000000;
          resolve(balance);
        }
      });
    }).on('error', (e) => {
      console.log(e.message);
    });
    req.setTimeout(10000); //10000ms応答がない場合はbotが停止しているとみなす
    req.on('timeout', function () {
      console.log('request timed out');
      resolve(0); // botが停止しているときに 0 を返す
      req.abort()
    });
  });
};

/**
 * 自分にtipが投げられた際に残高を確認し受取を確定する
 * 参考： https://namuyan.github.io/nem-tip-bot/index
 */
function ConfirmBalance() {
  client.post('statuses/update', { status: '@tipnem balance' + ' ' + Math.floor(Math.random() * 100000) }, function (error, tweet, response) {
    if (!error) {
      console.log('tweet @tipnem balance');
      faucetBalance().then(balance => {
        if (balance) {
          client.post('statuses/update', { status: 'Faucetの残高は: ' + balance + ' xem です。 ' + Math.floor(Math.random() * 100000) }, function (error, tweet, response) {
            if (!error) {
              console.log('tweet balance');
            }
          });
        }
      });
    }
  });
};

// 定期実行ツイート
const CronJob = require('cron').CronJob;
//                    cron Sec Min Hour DayofMonth Month Dayofweek
let job = new CronJob('00 00 * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
