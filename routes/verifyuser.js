'use strict';

const loader = require('../models/sequelize-loader');
const Op = loader.Sequelize.Op
var User = require('../models/user');
User.sync();

// Time: /mmsec
const OneHour = 1000 * 60 * 60;
const OneDay = OneHour * 24;

/**
 * Verufy requested user.
 * リクエストを行ったユーザーの検証。
 * @param {JSON} tweetJSON 
 * @param {Number} requestAt 
 * @return {Array} [userId, faucetCount] or false
 */
const VerifyUser = function (tweetJSON, requestAt) {
  let userId = tweetJSON.user.id_str;
  let userScreenName = tweetJSON.user.screen_name;
  
  return new Promise((resolve, reject) => {
    User.findOne({
      where: {
        userId: userId
      }
    }).then(pastRequest => {

      if (tweetJSON.user.friends_count < 50 || tweetJSON.user.statuses_count < 100) { // フォロワー数が50以上かつツイート数が100以上か
        resolve(false);
        console.log('フォロワー数が50以下もしくはツイート数が100以下のため検証修了');
      } else if (pastRequest) {
        let pastRequestAt = pastRequest.lastRequest;
        let intervalTime = requestAt - pastRequestAt;
        if (OneDay < intervalTime) {
          userRegistration(tweetJSON, requestAt, pastRequest.faucetCount);
          let returnData = [userScreenName, pastRequest.faucetCount];
          resolve(returnData);
        }
        console.log('24時間以内にリクエストを行っていたため検証修了');
        resolve(false);
      } else if (!pastRequest) {
        userRegistration(tweetJSON, requestAt,0);
        let returnData = [userScreenName, 0];
        resolve(returnData); // 過去にリクエストが存在しない場合は初回ユーザーであることを返す
      }
    });
  });
};

/**
 * User Registration
 * リクエストが検証を通過したしたユーザーをデータベースに記録・更新する
 * @param {JSON} tweetJSON 
 * @param {Number} requestAt 
 * @param {Number} lastFaucetCount 
 */
function userRegistration(tweetJSON, requestAt, lastFaucetCount) {
  let userId = tweetJSON.user.id_str;
  let userScreenName = tweetJSON.user.screen_name;
  let userText = tweetJSON.text;
  let faucetCount = lastFaucetCount + 1;

  User.upsert({
    userId: userId,
    userScreenName: userScreenName,
    lastRequest: requestAt,
    lastText: userText,
    faucetCount: faucetCount
  });
};

module.exports = VerifyUser;
