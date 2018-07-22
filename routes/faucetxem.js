"use strict";
const Twitter = require("twitter");
const Tips = require("../tips");

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Detect faucet amount and tip.
 * @param {String} userScreenName
 * @param {Number} faucetCount
 * @return {String} (for test)
 */
const faucetXem = function(userScreenName, faucetCount) {
  if (faucetCount === 0) {
    /**
     * 初回のユーザーは1xem配布
     */
    post(userScreenName, 1);
  } else if (0 < faucetCount && faucetCount < 10) {
    /**
     * 配布割合
     *          80% <= 0.5xem
     * 0.5xem < 10% <= 0.7xem
     * 0.7xem < 8% <= 0.9xem
     * 1.0xem = 2%
     */
    let faucetAmount = 0;
    let parcentageParams = Math.floor(Math.random() * 100);
    if (parcentageParams <= 80) {
      faucetAmount = Math.ceil(Math.random() * 5) / 10; //0.1から0.5を0.1刻みでランダムに出力する
    } else if (parcentageParams <= 90) {
      faucetAmount = Math.ceil(Math.random() * 2) / 10 + 0.5; //0.6か0.7をランダムに出力する
    } else if (parcentageParams <= 98) {
      faucetAmount = Math.ceil(Math.random() * 2) / 10 + 0.7; //0.8か0.9をランダムに出力する
    } else if (parcentageParams <= 100) {
      faucetAmount = 1;
    }
    faucetAmount = Math.round(faucetAmount * 10) / 10; // 浮動小数点数の精度により"0.8999999999999999"などの値が出力されるバグを防ぐため
    let faucetdiscription = Tips.selectTips();
    post(userScreenName, faucetAmount);
  } else if (10 <= faucetCount && faucetCount < 20) {
    /**
     * 10回以上リクエストを行っていたユーザーの場合の処理
     * 0.1-0.3 をランダムで配布し1/4の割合でtip失敗する
     */
    console.info("10回以上リクエストしたユーザー用処理を実行");
    let faucetAmount = Math.floor(Math.random() * 4) / 10;
    if (faucetAmount == 0) {
      console.info("tip失敗。");
      return false;
    }
    post(userScreenName, faucetAmount);
  } else {
    /**
     * 20回以上リクエストを行っていたユーザーの場合の処理
     * 1/5の確率で0.1xemを配布し、4/5の確率で失敗する
     */
    console.info("20回以上リクエストしたユーザー用処理を実行");
    let faucetAmount = Math.floor(Math.random() * 5) / 10;
    if (faucetAmount == 0.1) {
      post(userScreenName, faucetAmount);
    }
    console.info("tip失敗。");
    return false;
  }
};

function post(userScreenName, faucetAmount) {
  let faucetdiscription = Tips.selectTips();
  client.post(
    "statuses/update",
    {
      status:
        "@tipnem tip @" +
        userScreenName +
        " " +
        faucetAmount +
        " xem " +
        faucetdiscription
    },
    function(error, tweet, response) {
      if (!error) {
        console.info("Faucet to" + userScreenName + ":" + faucetAmount + "xem");
        return false;
      }
    }
  );
}

module.exports = faucetXem;
