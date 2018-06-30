'use strict';
const Twitter = require('twitter');
const Tips = require('../tips');

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
const faucetXem = function (userScreenName, faucetCount) {
  return new Promise((resolve, reject) => {
    if (faucetCount === 0) {
      let faucetdiscription = Tips.selectTips();
      /**
       * faucetXemのユニットテストを行う場合は以下のclient.postをコメントアウトする
       */
      client.post('statuses/update', { status: '@tipnem tip @' + userScreenName + ' 1 xem ' + faucetdiscription }, function (error, tweet, response) {
        if (!error) {
          console.info('Faucet to ' + userScreenName + ': 1xem');
          resolve('@tipnem tip @' + userScreenName + ' 1 xem ' + faucetdiscription); //テスト用
        }
      });

     resolve('@tipnem tip @' + userScreenName + ' 1 xem ' + faucetdiscription); //テスト用
    } else if (0 < faucetCount || faucetCount < 10) {
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
      faucetAmount = Math.round(faucetAmount * 10)/10; // 浮動小数点数の精度により"0.8999999999999999"などの値が出力されるバグを防ぐため
      let faucetdiscription = Tips.selectTips();
      /**
       * faucetXemのユニットテストを行う場合は以下のclient.postをコメントアウトする
       */
      client.post('statuses/update', { status: '@tipnem tip @' + userScreenName + ' ' + faucetAmount + ' xem ' + faucetdiscription }, function (error, tweet, response) {
        if (!error) {
          console.info('Faucet to' + userScreenName + ':' + faucetAmount + 'xem');
          resolve('@tipnem tip @' + userScreenName + ' ' + faucetAmount + ' xem ' + faucetdiscription); //テスト用
        }
      });
      resolve('@tipnem tip @' + userScreenName + ' ' + faucetAmount + ' xem ' + faucetdiscription); //テスト用
    } else {
      /**
       * 10回以上リクエストを行っていたユーザーの場合の処理
       * 0.1-0.3 をランダムで配布し1/4の割合でtip失敗する
       */
      let faucetAmount = Math.floor(Math.random() * 4) / 10;
      console.info('10回以上リクエストしたユーザー用処理を実行')
      if (faucetAmount == 0) {
        console.info('tip失敗。')
        return false;
      };
      let faucetdiscription = Tips.selectTips();
      client.post('statuses/update', { status: '@tipnem tip @' + userScreenName + ' ' + faucetAmount + ' xem ' + faucetdiscription }, function (error, tweet, response) {
        if (!error) {
          console.info('Faucet to' + userScreenName + ':' + faucetAmount + 'xem');
          resolve('@tipnem tip @' + userScreenName + ' ' + faucetAmount + ' xem ' + faucetdiscription); //テスト用
        }
      });
    }
  });
};

module.exports = faucetXem;
