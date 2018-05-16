'use strict';
const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
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
      /**
       * faucetXemのユニットテストを行う場合は以下のclient.postをコメントアウトする
       */
      client.post('statuses/update', { status: '@tipnem_test tip @' + userScreenName + ' 1 xem どうぞ ' + Math.floor(Math.random() * 100000) }, function (error, tweet, response) {
        if (!error) {
          console.info('Faucet to' + useId + '1xem');
          resolve('@tipnem_test tip @' + userScreenName + ' 1 xem どうぞ ' + Math.floor(Math.random() * 100000)); //公式にもテスト例がないため返り値で代用
        }
      });
      
     resolve('@tipnem_test tip @' + userScreenName + ' 1 xem どうぞ ' + Math.floor(Math.random() * 100000)); //公式にもテスト例がないため返り値で代用
    } else {
      /**
       * 配布割合
       *          50% <= 0.5xem
       * 0.5xem < 30% <= 0.7xem
       * 0.7xem < 15% <= 0.9xem
       * 1.0xem = 5%
       */
      let faucetAmount = 0;
      let parcentageParams = Math.floor(Math.random() * 100);
      if (parcentageParams <= 50) {
        faucetAmount = Math.ceil(Math.random() * 5) / 10; //0.1から0.5を0.1刻みでランダムに出力する
      } else if (parcentageParams <= 80) {
        faucetAmount = Math.ceil(Math.random() * 2) / 10 + 0.5; //0.6か0.7をランダムに出力する
      } else if (parcentageParams <= 95) {
        faucetAmount = Math.ceil(Math.random() * 2) / 10 + 0.7; //0.8か0.9をランダムに出力する
      } else if (parcentageParams <= 100) {
        faucetAmount = 1;
      }
      faucetAmount = Math.round(faucetAmount * 10)/10; // 浮動小数点数の精度により"0.8999999999999999"などの値が出力されるバグを防ぐため
      /**
       * faucetXemのユニットテストを行う場合は以下のclient.postをコメントアウトする
       */
      client.post('statuses/update', { status: '@tipnem_test tip @' + userScreenName + ' ' + faucetAmount + ' xem どうぞ ' + Math.floor(Math.random() * 100000) }, function (error, tweet, response) {
        if (!error) {
          console.info('Faucet to' + useId + '' + faucetAmount + 'xem');
          resolve('@tipnem_test tip @' + userScreenName + ' ' + faucetAmount + ' xem どうぞ ' + Math.floor(Math.random() * 100000)); //公式にもテスト例がないため返り値で代用
        }
      });

      resolve('@tipnem_test tip @' + userScreenName + ' ' + faucetAmount + ' xem どうぞ ' + Math.floor(Math.random() * 100000)); //公式にもテスト例がないため返り値で代用      
    }
  });
};

module.exports = faucetXem;
