<img src="https://motionpicture.jp/images/common/logo_01.svg" alt="motionpicture" title="motionpicture" align="right" height="56" width="98"/>

# PECORINO jobs application

[![CircleCI](https://circleci.com/gh/motionpicture/pecorino-jobs.svg?style=svg)](https://circleci.com/gh/motionpicture/pecorino-jobs)

## Table of contents

* [Usage](#usage)
* [License](#license)

## Usage

### Environment variables

| Name                                 | Required              | Value           | Purpose                |
|--------------------------------------|-----------------------|-----------------|------------------------|
| `DEBUG`                              | false                 | pecorino-jobs:* | Debug                  |
| `NPM_TOKEN`                          | true                  |                 | NPM auth token         |
| `NODE_ENV`                           | true                  |                 | environment name       |
| `MONGOLAB_URI`                       | true                  |                 | MongoDB connection URI |
| `SENDGRID_API_KEY`                   | true                  |                 | SendGrid API Key       |
| `DEVELOPER_EMAIL`                    | true                  |                 | 開発者通知用メールアドレス          |
| `DEVELOPER_LINE_NOTIFY_ACCESS_TOKEN` | true                  |                 | 開発者LINE通知アクセストークン      |
| `WEBJOBS_ROOT_PATH`                  | only on Azure WebApps | dst/jobs        |                        |

## License

UNLICENSE
