var pm2 = require('pm2');
var cronJob = require('cron').CronJob;
var cronTime = "0 0 * * * *"; // 毎日朝6時に実行

//プロセスの状態を確認して終了させる
function showAndDone(){
  pm2.list(function(err, process_list) {
    console.log(process_list);
    // Disconnect to PM2
    pm2.disconnect(function(){
      process.exit(0);
    });
  });
}

//全て再起動
function restartAll(){
  pm2.restart('all', function(err, proc){
    showAndDone();
  });
}

var job = new cronJob({
  cronTime: cronTime,
  onTick: function(){ //指定時に実行したい関数
    console.log('onTick!', new Date()); //時間表示

    //pm2関連を実行
    pm2.connect(function(err) {
      restartAll();
    });

  },
  onComplete: function() { //ジョブの完了または停止時に実行する関数
    console.log('onComplete!');
  },
  start: false // コンストラクタを終する前にジョブを開始するかどうか
  // timeZone: "Japan/Tokyo" //タイムゾーン
});

job.start();