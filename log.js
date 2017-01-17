const GitHub = require('github');

const github = new GitHub({
  debug: false,
  Promise: require('bluebird')
});
var through = [];
for (var i = 2; i < process.argv.length; i++){
  switch (process.argv[i]) {
    case "push":
      through.push("PushEvent");
      break;
    case "watch":
      through.push("WatchEvent");
      break;
    case "pullrequest":
      through.push("PullRequestEvent");
      through.push("PullRequestReviewCommentEvent");
      break;
    case "issue":
      through.push("IssuesEvent");
      through.push("IssueCommentEvent");
      break;
    case "create":
      through.push("CreateEvent");
      break;
    case "public":
      through.push("PublicEvent");
      break;
    case "gollum":
      through.push("GollumEvent");
      break;
    case "fork":
      through.push("ForkEvent");
      break;
  }
}

github.authenticate({
  type: 'token',
  token: '' // ご自身のトークンをセットしてください
})
function start() {
  github.activity.getEvents({
    per_page: 1
  }).then(function (res) {
    set: for (var i = 0; i < res.length; i++){
      for (var j = 0; j < through.length; j++){
        if (through[j] !== res[i].type) {
          break set;
        }
      }
      switch (res[i].type) {
        case "PushEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、pushを行いました");
          console.log("対象リポジトリ: " + res[i].repo.name);
          console.log("コミットメッセージ");
          for (var j = 0; j < res[i].payload.commits.length; j++){
            console.log(res[i].payload.commits[j].message);
          }
          break;
        case "WatchEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、スターを付けました");
          console.log("対象リポジトリ: " + res[i].repo.name);
          break;
        case "PullRequestEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、Pull Requestをしました");
          console.log("対象リポジトリ: " + res[i].repo.name);
          console.log("Pull Requestの名前: " + res[i].payload.pull_request.title);
          console.log("Pull Requestの説明");
          if (res[i].payload.pull_request.body) {
            console.log(res[i].payload.pull_request.body);
          }else {
            console.log("なし");
          }
          console.log("合計コミット数: " + res[i].payload.pull_request.commits);
          console.log("変更を加えたファイル数: " + res[i].payload.pull_request.changed_files);
          break;
        case "IssuesEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、Issueを作成しました");
          console.log("対象リポジトリ: " + res[i].repo.name);
          console.log("Issueの名前: " + res[i].payload.issue.title);
          break;
        case "CreateEvent":
          if (res[i].payload.ref_type === "tag") {
            // 設定していません
            break set;
          }else if (res[i].payload.ref_type === "branch") {
            console.log("  id: " + res[i].id);
            console.log("時刻: " + res[i].created_at);
            console.log(" " + res[i].actor.login + " さんが、ブランチを作成しました");
            console.log("対象リポジトリ: " + res[i].repo.name);
            console.log("ブランチ名: " + res[i].payload.ref);
          }else if (res[i].payload.ref_type === "repository") {
            console.log("  id: " + res[i].id);
            console.log("時刻: " + res[i].created_at);
            console.log(" " + res[i].actor.login + " さんが、リポジトリを作成しました");
            console.log("リポジトリ名: " + res[i].repo.name);
          }
          break;
        case "ReleaseEvent":
          // 設定していません
          break;
        case "DeleteEvent":
          // 設定していません (消されたの通知する理由ない気がする)
          break;
        case "CommitCommentEvent":
          // 設定してません (よくわからなかった)
          break;
        case "MemberEvent":
          // 設定していません (メンバーの追加の報告はいらないです)
          break;
        case "PublicEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、パブリックリポジトリに変更しました");
          console.log("変更したリポジトリ: " + res[i].repo.name);
          break;
        case "GollumEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、wikiを作成しました");
          console.log("対象リポジトリ: " + res[i].repo.name);
          console.log("wikiのタイトル: " + res[i].payload.pages[0].title);
          break;
        case "ForkEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、リポジトリをフォークしました");
          console.log("フォーク元のリポジトリ: " + res[i].repo.name);
          break;
        case "IssueCommentEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、Issueにコメントをしました");
          console.log("対象リポジトリ: " + res[i].repo.name);
          console.log("Issueの名前: " + res[i].payload.issue.title);
          break;
        case "PullRequestReviewCommentEvent":
          console.log("  id: " + res[i].id);
          console.log("時刻: " + res[i].created_at);
          console.log(" " + res[i].actor.login + " さんが、Pull Requestをレビューしました");
          console.log("対象リポジトリ: " + res[i].repo.name);
          console.log("Pull Requestの名前: " + res[i].payload.pull_request.title);
          break;
        default: console.log(res[i]);
      }
    }
    console.log("");
    start();
  }).catch(function (e) {
    console.error(e);
  })
}

start();
