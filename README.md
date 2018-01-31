<img src="https://motionpicture.jp/images/common/logo_01.svg" alt="motionpicture" title="motionpicture" align="right" height="56" width="98"/>

# PECORINO jobs application

## Getting Started

### インフラ
基本的にnode.jsのウェブアプリケーション。
AzureのWebAppsでWebJobsを動作させる想定。

### 言語
実態としては、linuxあるいはwindows上でのnode.js。プログラミング言語としては、TypeScript。

* [TypeScript](https://www.typescriptlang.org/)

### 開発方法
npmでパッケージをインストール。

```shell
npm install
```
* [npm](https://www.npmjs.com/)

typescriptをjavascriptにコンパイル。

```shell
npm run build
```

### Environment variables
| Name                                          | Required              | Value           | Purpose                |
| --------------------------------------------- | --------------------- | --------------- | ---------------------- |
| `DEBUG`                                       | false                 | pecorino-jobs:* | Debug                  |
| `NPM_TOKEN`                                   | true                  |                 | NPM auth token         |
| `NODE_ENV`                                    | true                  |                 | environment name       |
| `MONGOLAB_URI`                                | true                  |                 | MongoDB connection URI |
| `SENDGRID_API_KEY`                            | true                  |                 | SendGrid API Key       |
| `PECORINO_DEVELOPER_EMAIL`                    | true                  |                 | 開発者通知用メールアドレス    |
| `PECORINO_DEVELOPER_LINE_NOTIFY_ACCESS_TOKEN` | true                  |                 | 開発者LINE通知アクセストークン |
| `WEBJOBS_ROOT_PATH`                           | only on Azure WebApps | dst/jobs        |

## tslint
コード品質チェックをtslintで行う。
* [tslint](https://github.com/palantir/tslint)
* [tslint-microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib)

`npm run check`でチェック実行。

## Security
* [nsp](https://www.npmjs.com/package/nsp)

## clean
`npm run clean`で不要なソース削除。

## Test
`npm test`でテスト実行。

## Docs
`npm run doc` emits jsdoc to ./doc.
