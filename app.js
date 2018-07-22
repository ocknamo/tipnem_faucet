"use strict";
const Twitter = require("twitter");

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const VerifyUser = require("./routes/verifyuser");
const faucetXem = require("./routes/faucetxem");
const Tips = require("./tips");

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 * filter message: En message OR Ja message OR tip message
 **/
var timeintervalsec = 1;
var exponent = 0;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
var faucet_balance = 0;

function main() {
  timeintervalsec = 60 * Math.pow(2, exponent);
  wait(timeintervalsec * 1000) // インターバルを2^0SEC,2^1SEC,2^2SEC...としてmain taskを実行する実装
    .then(() => {
      let date = new Date();
      console.log(
        date + " Reconnecting... Interval Time = " + timeintervalsec + " sec"
      );

      var stream = client.stream("statuses/filter", {
        track:
          "@tipnem_faucet Please give me NEM:XEM!,@tipnem_faucet NEM:XEMちょっとください,@tipnem tip @tipnem_faucet"
      });
      stream.on("data", function(event) {
        if (event) {
          let requestTweetId = event.id_str;
          let userId = event.user.id_str;
          let userScreenName = event.user.screen_name;
          let userText = event.text;
          let requestAt = Date.now();

          console.info(
            userScreenName +
              userId +
              "から" +
              requestAt +
              "にリクエストを受け取りました。:" +
              userText
          );

          if (new RegExp("@tipnem tip @tipnem_faucet").test(userText)) {
            // tipコマンドを検知した場合のみ残高を確定して処理を終了する。
            ConfirmBalance();
          } else {
            // 残高確認APIの使用頻度をなるべく減らすため前回までの残高をグローバル変数faucet_balanceに記憶させる
            if (faucet_balance < 1) {
              faucetBalance().then(balance => {
                faucet_balance = balance - 1;
                if (balance < 1) {
                  client.post(
                    "statuses/update",
                    {
                      status:
                        "@" +
                        userScreenName +
                        " Sorry. Faucet is empty or stoping tipbot. 残念ですがfaucetの残高が足りないかtipbotが停止しています……(T_T)/  " +
                        Math.floor(Math.random() * 100000)
                    },
                    function(error, tweet, response) {
                      if (!error) {
                        console.log("tweet Faucet empty or stoping tipbot");
                      }
                    }
                  );
                } else {
                  VerifyUser(event, requestAt)
                    .then(result => {
                      if (!result) {
                        return false;
                      } else {
                        console.log("Use faucetBalance");
                        // result[userId, faucetCount]
                        faucetXem(result[0], result[1]);
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }
              });
            } else {
              faucet_balance = faucet_balance-1;
              VerifyUser(event, requestAt)
              .then(result => {
                if (!result) {
                  return false;
                } else {
                  console.log("Don't use faucetBalance");
                  // result[userId, faucetCount]
                  faucetXem(result[0], result[1]);
                }
              })
              .catch(error => {
                console.log(error);
              });
            }
          }
        }
      });
      stream.on("error", function(error) {
        if (exponent > 6) {
          // exponentが6以上つまり 2^12=3840 > 3600sec=1hourの場合処理を終了する
          console.log("再接続間隔が1時間以上となったため終了");
          throw error;
        } else if (error.message == "Status Code: 420") {
          // 420の場合はインターバルを増やして再接続する
          console.log("420のエラーによる再接続");
          stream.destroy(); //多重起動を防止するため
          exponent++;
          main();
        } else {
          console.log("420以外のエラーによる終了");
          throw error;
        }
      });
    })
    .catch();
}
main();

/**
 * @return {number} xem balance
 * // GET　mainnet: https://tipnem.tk:6745/user/balance/tipnem_faucet
 * // GET　testnet: https://tipnem.tk:6746/user/balance/tipfaucet_test
 */
function faucetBalance() {
  let balance = 0;
  let https = require("https");
  const URL = "https://tipnem.tk:6745/user/balance/tipnem_faucet";

  return new Promise((resolve, reject) => {
    var req = https
      .get(URL, res => {
        let body = "";
        res.setEncoding("utf8");

        res.on("data", chunk => {
          body += chunk;
        });
        res.on("end", res => {
          /** 残高確認APIの接続がエラーの場合tipnemのAPIから
           * "not found user info"もしくは"not found select name or not allowed"が返ってくるため
           * 対応する処理を行う
           */
          if (new RegExp("not found").test(body)) {
            console.log(
              "残高確認のリクエストが許可されているか確認してください:" + body
            );
            resolve(0);
          } else {
            res = JSON.parse(body);
            balance = res["nem:xem"] / 1000000;
            resolve(balance);
          }
        });
      })
      .on("error", e => {
        console.log(e.message);
      });
    req.setTimeout(10000); //10000ms応答がない場合はbotが停止しているとみなす
    req.on("timeout", function() {
      console.log("request timed out");
      resolve(0); // botが停止しているときに 0 を返す
      req.abort();
    });
  });
}

/**
 * 自分にtipが投げられた際に残高を確認し受取を確定する
 * 参考： https://namuyan.github.io/nem-tip-bot/index
 */
function ConfirmBalance() {
  let balancedoc = Tips.selectBalanceDoc();
  client.post(
    "statuses/update",
    { status: "@tipnem balance" + " " + balancedoc },
    function(error, tweet, response) {
      if (!error) {
        console.log("tweet @tipnem balance " + balancedoc);
        faucetBalance().then(balance => {
          if (balance) {
            // 同じ残高で何度もtweetしないようにあえて文面は一種類に限定する。
            client.post(
              "statuses/update",
              { status: "Faucetの残高は: " + balance + " xem です。" },
              function(error, tweet, response) {
                if (!error) {
                  console.log("tweet balance");
                }
              }
            );
          }
        });
      }
    }
  );
}

// 定期実行ツイート
const CronJob = require("cron").CronJob;
//          Sec Min Hour DayofMonth Month Dayofweek
new CronJob(
  "00 00 * * * *",
  function() {
    let regulartweet = Tips.selectRegularTweet();
    client.post("statuses/update", { status: regulartweet }, function(
      error,
      tweet,
      response
    ) {
      if (!error) {
        console.info("tweet:" + regulartweet);
      }
    });
  },
  null,
  true,
  "Asia/Tokyo"
);
