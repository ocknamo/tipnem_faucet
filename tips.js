'use strict';

/**
 * Tips of crypto currency knowledges to contain @mention.
 * Select one tips from hundreds tips random.
 */

/**
 * Array of tips lists.
 * < 90 chars
 */
const tips = [
  '「Don\'t trust, verify. 信頼するな、検証しろ。」by Blockstream.',
  'NEMは暗号通貨の名前ですが、通貨の単位はXEMです。日本円で例えると、NEM=日本、XEM=円です。',
  'NEM:XEMの初期発行量は8,999,999,999XEMで約1600人分のアドレスに配布されました。全て発行済みでこれ以上増えることは(ハードフォークしない限り)ありません。',
  '「ハードフォーク」とはプロトコルに後方互換性がない変更を加えることです。例えば紙幣が漱石から英世に変わって銀行が旧札を受け取ってくれなくなるみたいな感じ。',
  '「ソフトフォーク」とはプロトコルに後方互換性がある変更を加えることです。二千円札を作るけどこれまで通り他の紙幣も使えますよみたいな感じ。え？ 二千円札知らない？',
  'NEMは昔はNewEconomyMovementの略だと名乗っていましたが最近は「NEM」という固有名詞だと言ってるみたい。実は昔の名前が好きなNEMberも多い。',
  'NEMには自由に自分の通貨≒トークンを発行する機能があります。',
  'NEMの取引内容はNEMブロックチェーンエクスプローラー(NEMBEX http://chain.nem.ninja/#/blocks/0 )で確認できます。大概の暗号通貨にはブロックチェーンクスプローラーがあるよ。',
  'NEMでトークンを発行するにはネームスペースというのを作る必要がある。ネームスペースがあれば自分のアドレスを簡単なキーワードに紐付けることができる。',
  '暗号通貨の秘密鍵は絶対に他人に知られてはいけないし無くしてはいけない。逆に秘密鍵さえ無くさず持っていればあなたのウォレットは復旧できる。',
  '暗号通貨の扱いは(人類にはまだ)難しい。大金を入れるのは、まずは少額で送金テストしたりブロックチェーンエクスプローラーで確認したりして慣れてからにしましょう。',
  'XEMを送金したときにかかる手数料はハーベストした人の元に行きます。ハーベストとは送金が正しいものかどうか検証してブロックチェーンに記録する作業です。',
  'NEMが誕生したのは2015年3月29日。NEMのジェネシスブロックをNEMBEXで見ることができます。 http://chain.nem.ninja/#/block/1',
  '暗号通貨の取引はブロックチェーンエクスプローラで確認することができます。NEMBEXで確認してみましょう。(NEMBEX http://chain.nem.ninja/#/blocks/0 )',
  'BTCやNEMなどの暗号通貨には銀行のような管理者がいません。これらの決済システムは世界中の人が独自に動かすコンピュータ(ノード)同士が合意形成を行うことで管理しています。',
  'ブロックチェーンを使った暗号通貨の一番最初のブロックのことを「ジェネシスブロック」と呼びます。これはビットコインの創始者ナカモト・サトシが名付けたものです。',
  '暗号通貨の利点は送金が早くて安いところだ！ という話がありますが、手数料は高騰する場合があり手数料が足りないと送金にとても時間がかかったり承認されないこともあります。',
  'ナカモト・サトシはドリアン・ナカモトではありません。',
  'ナカモト・サトシはビットコインのコンセプトと概要を記した９枚の論文とビットコインの実装を残していなくなりました。',
  'トークンエコノミーとはなんでしょうか。実ははっきりした定義はありません。',
  '暗号通貨の送金を取り消す方法はないと思ってください。それがこの技術の特徴です。相手にお願いして送り返してもらうことは可能ですが。',
  'ビットコインのホワイトペーパーには暗号通貨の基本的な概念が記されています。日本語訳もあるので読んでみましょう。',
  'ビットコインができた後に生まれた暗号通貨のことをアルトコイン(オルトコイン)と呼びます。NEMはビットコイン2.0と呼ばれるアルトコインです。',
  '秘密鍵から公開鍵が、公開鍵からアドレスが生み出されます。公開鍵から秘密鍵を割り出すのは今の人類には不可能です。将来的にどうかはわかりませんけど。',
  '暗号通貨を欲しい人が増えて売る人が少なければ値段は上がります。逆になれば値段は下がります。暗号通貨を売り買いするのでなく使う人が増えれば値段は安定するかもしれません。',
  'コンピュータは内部の状態が変化する箱。暗号通貨もブロックが作られる度に内部状態が変化します。暗号通貨をコンピュータとして見たときに動くプログラム、それがスマートコントラクトです。',
  '秘密鍵はパスワードとは違います。秘密鍵を忘れてもパスワードのように初期化したり新しく作り直したりすることはできません。',
  'NEM好きのことを「NEMBER（ネンバー。メンバーのもじり）」と呼びます。ビットコイン好きのことはビットコイナー。イーサリアム好きのことはイーサリアンと呼んだりします。',
  'ビットコインの取引を検証して報酬をもらうことを「マイニング」といいますがNEMでは「ハーベスト」を行って取引を検証し報酬をもらうことができます。報酬の原資は取引手数料です。',
  '「暗号通貨を所有する」ということは「暗号通貨の入ったアドレスの秘密鍵を知っている」ということです。なので秘密鍵は必ずバックアップしましょう。',
  '暗号通貨を管理しているのは多数のノードです。ノードはコンピュータとネットワークがあれば誰でも立てることができます。',
  'コインチェックから多額のXEMが盗まれた事件では取引所から利用者に日本円での補償が行われました。しかし犯人はまだ捕まっていません。',
  'コインチェックやMt.GOXの事件のように取引所から暗号通貨が盗まれることがあります。このように暗号通貨が失われることを「GOX」と呼びます。例:「秘密鍵忘れてGOXしたwww」',
  'NEMのコンセンサスアルゴリズムのはPOIといいます。XEMを所有する人と使用する人がより多くのXEMを受け取れる仕組みです。POSの実装の一つともいえるでしょう。',
  '2010年5月22日に暗号通貨(ビットコイン)で初めて現実の物品が購入されました。電子クズと呼ばれた暗号通貨に価値が生まれた瞬間です。買われたものがピザだったので5月22日はピザの日です。',
  'NEMはカタパルトの発表に伴いオープンソースに移行するらしいです。',
  'DAOとは分散型自律組織のことです。世界初のDAOはビットコインだと言われています。',
  '価値とはなんでしょう。価値は価格ではありません。価値は人間の意識の中にしか存在しません。',
  'NEMのブロック生成間隔は数十秒から数分です。なので送金しても承認されるまでそれくらいかかります。送金額が大金の場合は一般的に6承認以上待った方が良いとされています',
  'tipnemは仮想通貨をツイッター上で投げ銭できるサービスです。他にも投げ銭の元祖tipmonaなどがあります。tipbotはウォレットでは無いので大金は入れないように!',
  'tipbotはブロックチェーンじゃないので手数料はかかりません。でもブロックチェーンほどセキュアではないので大金は入れないようにしましょう。',
  '「通貨が生まれる前には物々交換の時代があった、物々交換では不便なので通貨が発明された」という事実はありません。(負債論より)',
  '発行した政府が滅んだ後も機能していた通貨がかつてあったといいます。',
  '暗号通貨は電子データなのにコピーしたり勝手に増やしたりできません。勝手に増やしたりコピーできないものは通貨として使えます。',
  '暗号通貨に使われている技術のほとんどは、実は「最先端技術」ではなく「枯れた技術」です。',
  '通貨を受け取る人が次の人も通貨を受け取ってくれると考える限り通貨は通貨として機能し続けます。'
]

/**
 * Array of descriptions putted on front of tips.
 * < 20 chars
 */
const description = [
  'どうぞ🚰',
  'どうぞ〜🚰',
  'ちょっとだけな🚰',
  '🚰じゃー！',
  'ぽたぽた……🚰',
  'ぽたぽたぽた……🚰',
  'どうぞじゃー🚰',
  '水漏れ……🚰',
  'おすそ分けじゃー🚰',
  'Tip you xem!🚰',
  'Give you xem!🚰',
  '🚰',
  '君もNEMber'
]

const regulartweets = [
  '投げ銭ツイートに含まれるTips(ヒント)はtwitter社さんから「似たようなツイートをしまくるのはスパムと判定するからやめて」と言われたので作りました。Bot作る人は気をつけるんじゃー！',
  'このFaucetのプール金は有志NEMber様の寄付で成り立っています。運営は1XEMも抜いていません。もしよければFaucetに寄付をお願いします〜',
  '「@tipnem_faucet Please give me NEM:XEM!」もしくは「@tipnem_faucet NEM:XEMちょっとください」とつぶやくとちょっとだけXEMがもらえたりもらえなかったり……🚰？',
  'tipnemの使い方はこちらを読んでください！ https://namuyan.github.io/nem-tip-bot/index ',
  'tipnem_faucetはMITライセンスで公開してますじゃー🚰 https://github.com/ocknamo/tipnem_faucet',
  'tipnem_faucetの説明じゃー🚰　→　https://github.com/ocknamo/tipnem_faucet ',
  'xemはもらえたりもらえなかったりじゃー🚰',
  'もらったXEMはtipnemで他の人に投げたりWalletに出金することもできるよ。https://namuyan.github.io/nem-tip-bot/index ',
  'tipnem_faucetはただの派生サービスで@tipnem作ってる人とは関係ないんじゃー🚰',
  'tipnem_faucetはtip(投げ銭)と同時にTips(ヒント)を送っています。',
  'フォロワーが少なかったりするともらえない場合があります。'
]

/**
 * Array of descriptions putted on follow of '@tipnem balance '.
 * < 20 chars
 * 攻撃を受けた場合に短時間に10程度の連続tweetで終了させるため種類は10種類以下とする
 */
const balanceDocList = [
  '🚰',
  'どれくらい???🚰',
  'ちょっとかな🚰',
  '🚰じゃー！',
  'ぽたぽた……🚰',
  'ぽたぽたぽた……🚰',
  'じゃー🚰',
  '水漏れ……🚰',
  '貯まってますか？🚰',
]

/**
 * FaucetTweetの文面をランダムに作成する
 */
const selectTips = function () {
  // select description
  let selecteddescription = description[Math.floor(Math.random() * description.length)];

  // select tips
  let tipsnumber = Math.floor(Math.random() * tips.length); // To contain tipsnumber in faucetTweet.
  let selectedtips = tips[tipsnumber];

  let faucetTweet = selecteddescription + " Tips" + tipsnumber + ": 「" + selectedtips + "」";
  return faucetTweet;
};

/**
 * 定期実行Tweetの文面をランダムに作成する
 */
const selectRegularTweet = function () {
  // RegularTweet
  let selectedregulartweet = regulartweets[Math.floor(Math.random() * regulartweets.length)];
  return selectedregulartweet;
};

/**
 * 残高確認Tweetの文面をランダムに作成する
 */
const selectBalanceDoc = function () {
  let balanceDoc = balanceDocList[Math.floor(Math.random() * balanceDocList.length)];
  return balanceDoc;
};

module.exports = {
  selectTips: selectTips,
  selectRegularTweet: selectRegularTweet,
  selectBalanceDoc: selectBalanceDoc,
};