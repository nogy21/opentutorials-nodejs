# opentutorials-nodejs

_생활코딩 node.js 강의 학습 내용입니다. 해당 강의에서는 Node.js의 동작 원리 등 개념적인 내용보다는 초심자 입장에서 Node.js를 활용해보는 것을 목표로 합니다. 그래서 JavaScript의 문법 내용도 가볍게 짚고 넘어가며, 최종적으로는 CRUD 기능이 담긴 간단한 웹 애플리케이션 구축을 목표로 합니다._

<br>

> ### Node.js 설치 방법

- [Node.js](https://nodejs.org/en/)에서 최신 LTS 버전 다운로드 후 설치를 마치면 `cmd`로 `node -v` 명령어를 통해 설치된 버전 확인 가능

- `node`명령어 입력 후 `conole.log(1+1);`을 입력해서 정상적으로 동작하는 것 확인

<br>

> ### Node.js 특징

- 싱글 스레드
- 비동기 I/O
- 이벤트 기반

nodejs의 성격을 잘 살릴 수 있는 프로그램: 네트워크 애플리케이션 → I/O가 빈번

<br>

> ### PM2

: `Node.js` 애플리케이션의 관리를 도와주는 프로세스 매니저. 프로세스를 감시, 관리하여 서비스가 중단되거나 문제가 발생할 경우 자동으로 재시작을 해주기도 하고 로그를 남기는 등 다양한 기능 제공. 

- 설치: `npm install pm2 -g`
- 실행: `pm2 start app.js` 
- 모니터링: `pm2 monit`, 모니터링 나가기: `q`
- 프로세스 종료: `pm2 list` → `pm2 stop processname`
- 소스 코드 변경 자동 감지: `pm2 start app.js --watch`  -> 리로드 없이 수정된 사항 자동 반영
- 로그: `pm2 log`

<br>

> ### Modules

  `Node.js`에서는 외부 모듈을 `required()` function을 이용해 사용 가능합니다. 수업에서는 `HTTP`, `File System`, `URL`, `QueryString` 모듈을 사용합니다.

var http = require('http');

var fs = require('fs');

var url = require('url');

var qs = require('querystring');
