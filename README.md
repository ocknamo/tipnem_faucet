# tipnem_faucet
Crypto currency faucet for tipnem on twitter.  
Twitter上でNEMを投げ銭することができるサービスTipnem用のFaucetです。  
Twitterでつぶやくだけで暗号通貨を受け取ることができます。

## Faucetとは
Faucetとは蛇口を意味することばですが、暗号通貨の配布方法のひとつでもあります。
プールされた資金から少額の暗号通貨を条件を満たしたアドレスやアカウントに無料で配布することができます。  
タンクに溜められた水が蛇口から少しずつ滴るようなイメージでしょうか。  
  
## 配布条件
- 特定の文字列をtwitter上でつぶやく。　ー例：NEM:XEMをちょっとだけください!
- 文字列以外の内容を含めても良いが。その場合その他の文字列との間に半角もしくは全角のスペースを含めること。
- 前回配布してから24時間以上経過していること。
- 一定数以上のフォロワーがいるアカウントであること。
  
## 配布量
- 初回1xem,それ以降0〜1xemでランダム若しくは任意の確率で配布する。
  
## How to install

```bash
npm install

pm2 start ecosystem.config.json
```

restart job

```bash
pm2 start pm2restart.js
```

## 参考
[tipnem](https://namuyan.github.io/nem-tip-bot/index)
  
## 注意
これらの仕様は開発中のものですが断りなく変更になる可能性があります。
