'use strict';
const assert = require('assert');

const loader = require('../models/sequelize-loader');
const Op = loader.Sequelize.Op
var User = require('../models/user');
User.sync();

const VerifyUser = require('../routes/verifyuser');
const faucetXem = require('../routes/faucetxem')

// Time: mm sec
const OneHour = 1000 * 60 * 60;
const OneDay = OneHour * 24;

let tweetJSON = {
  created_at: 'Fri May 11 13:35:39 +0000 2018',
  id: 994934058399363100,
  id_str: '994934058399363073',
  text: 'テスト3 #tipnemfaucet_test',
  source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
  truncated: false,
  in_reply_to_status_id: null,
  in_reply_to_status_id_str: null,
  in_reply_to_user_id: null,
  in_reply_to_user_id_str: null,
  in_reply_to_screen_name: null,
  user:
    {
      id: 994870146119405600,
      id_str: '994870146119405568',
      name: 'testnet_faucet',
      screen_name: 'tipfaucet_test',
      location: 'bot星',
      url: null,
      description: null,
      translator_type: 'none',
      protected: false,
      verified: false,
      followers_count: 1,
      friends_count: 50,
      listed_count: 0,
      favourites_count: 1,
      statuses_count: 100,
      created_at: 'Fri May 11 09:21:41 +0000 2018',
      utc_offset: -25200,
      time_zone: 'Pacific Time (US & Canada)',
      geo_enabled: false,
      lang: 'ja',
      contributors_enabled: false,
      is_translator: false,
      profile_background_color: 'F5F8FA',
      profile_background_image_url: '',
      profile_background_image_url_https: '',
      profile_background_tile: false,
      profile_link_color: '1DA1F2',
      profile_sidebar_border_color: 'C0DEED',
      profile_sidebar_fill_color: 'DDEEF6',
      profile_text_color: '333333',
      profile_use_background_image: true,
      profile_image_url: 'http://pbs.twimg.com/profile_images/994871667427069953/tNsekII6_normal.jpg',
      profile_image_url_https: 'https://pbs.twimg.com/profile_images/994871667427069953/tNsekII6_normal.jpg',
      profile_banner_url: 'https://pbs.twimg.com/profile_banners/994870146119405568/1526030897',
      default_profile: true,
      default_profile_image: false,
      following: null,
      follow_request_sent: null,
      notifications: null
    },
  geo: null,
  coordinates: null,
  place: null,
  contributors: null,
  is_quote_status: false,
  quote_count: 0,
  reply_count: 0,
  retweet_count: 0,
  favorite_count: 0,
  entities:
    {
      hashtags: [[Object]],
      urls: [],
      user_mentions: [],
      symbols: []
    },
  favorited: false,
  retweeted: false,
  filter_level: 'low',
  lang: 'ja',
  timestamp_ms: '1526045739160'
};

let requestAt = Date.now();


describe('#VerifyUser()', () => {
  before(() => {
    // TODO データベースからテスト用データを削除する
    User.destroy({
      where: {
        userId: '994870146119405568'
      }
    });
  });

  it('初めてリクエストを行ったユーザーの検証ができる', () => {
    return VerifyUser(tweetJSON, requestAt).then(result => { //promiseのためこの書き方になる
      assert.equal(result[0], 'tipfaucet_test');
      assert.equal(result[1], 0);
    });
  });

  it('初めてリクエストを行ったがフォロワー数が50以下のユーザーの検証ができる', () => {
    tweetJSON.user.friends_count = 49;
    tweetJSON.user.statuses_count = 100;
    return VerifyUser(tweetJSON, requestAt).then(result => { //promiseのためこの書き方になる
      assert.equal(result, false);
    });
  });

  it('初めてリクエストを行ったがツイート数が100以下のユーザーの検証ができる', () => {
    tweetJSON.user.friends_count = 50;
    tweetJSON.user.statuses_count = 99;
    return VerifyUser(tweetJSON, requestAt).then(result => { //promiseのためこの書き方になる
      assert.equal(result, false);
    });
  });
});

describe('#VerifyUser()', () => {
  before(() => {
    tweetJSON.user.friends_count = 50;
    tweetJSON.user.statuses_count = 100;
  });
  after(() => {
    // TODO データベースからテスト用データを削除する
    User.destroy({
      where: {
        userId: '994870146119405568'
      }
    });
  });

  it('過去24時間以内にリクエストを行ったユーザーの検証ができる', () => {
    return User.upsert({
      userId: '994870146119405568',
      userScreenName: 'tipfaucet_test',
      lastRequest: requestAt - OneDay + 100,
      lastText: 'This is last Test Tweet.',
      faucetCount: 2
    }).then(() => {
      return VerifyUser(tweetJSON, requestAt).then(result => { //promiseのためこの書き方になる
        assert.equal(result, false);
      });
    });
  });

  it('24時間以上間隔を開けてリクエストを行ったユーザーの検証ができる', () => {
    return User.upsert({
      userId: '994870146119405568',
      userScreenName: 'tipfaucet_test',
      lastRequest: requestAt - OneDay - 100,
      lastText: 'This is last Test Tweet.',
      faucetCount: 2
    }).then(() => {
      return VerifyUser(tweetJSON, requestAt).then(result => { //promiseのためこの書き方になる
        assert.equal(result[0], 'tipfaucet_test');
        assert.equal(result[1], 2);
      });
    });
  });

  it('24時間以上間隔を開けてリクエストを行ったがフォロワーが50以下のユーザーの検証ができる', () => {
    tweetJSON.user.friends_count = 49;
    tweetJSON.user.statuses_count = 100;
    return User.upsert({
      userId: '994870146119405568',
      userScreenName: 'tipfaucet_test',
      lastRequest: requestAt - OneDay - 100,
      lastText: 'This is last Test Tweet.',
      faucetCount: 2
    }).then(() => {
      return VerifyUser(tweetJSON, requestAt).then(result => { //promiseのためこの書き方になる
        assert.equal(result, false);
      });
    });
  });

  it('24時間以上間隔を開けてリクエストを行ったがツイートが100以下のユーザーの検証ができる', () => {
    tweetJSON.user.friends_count = 50;
    tweetJSON.user.statuses_count = 99;
    return User.upsert({
      userId: '994870146119405568',
      userScreenName: 'tipfaucet_test',
      lastRequest: requestAt - OneDay - 100,
      lastText: 'This is last Test Tweet.',
      faucetCount: 2
    }).then(() => {
      return VerifyUser(tweetJSON, requestAt).then(result => { //promiseのためこの書き方になる
        assert.equal(result, false);
      });
    });
  });
});

/**
 * faucetXemユニットテスト
 *  テストを行う際は faucetxem.js 内のclient.postをコメントアウトすること 
describe('#faucetXem()', () => {
  before(() => {
  });

  it('初めてリクエストしたユーザーに1xemを投げることができる', () => {
    return faucetXem('TestUserScreenName',0).then(result => {
      console.log(result);
      assert(result.length > 0 );
    })
  });

  it('2回目以降にリクエストしたユーザーに0~1xemを投げることができる', () => {
    return faucetXem('TestUserScreenName',1).then(result => {
      console.log(result);
      assert(result.length > 0 );
    })
  });
});
*/