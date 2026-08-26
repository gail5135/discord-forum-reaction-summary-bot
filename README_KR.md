# Discord Forum Reaction Tracker Bot

감시 중인 **포럼 채널**들 중 하나에 새 스레드가 생기면 봇이 자동으로 추적 메시지를 만들고, 스레드 첫 메시지(스타터)에 달리는 **리액션을 이모지별로 누가 눌렀는지** 실시간으로 기록합니다.

---

## ✨ 기능

- ✅ 새 스레드 생성 시 봇이 즉시 추적 메시지 게시 (빈 상태로 시작)
- ✅ 스타터 메시지 리액션 추가/제거 시 추적 메시지 자동 편집
- ✅ 이모지별로 멘션을 그룹핑 (커스텀/애니메이션 이모지 지원)
- ✅ 봇 시작 시 활성 스레드 스윕으로 누락분 자동 보강
- ✅ 스타터/스레드 삭제 시 매핑 자동 정리
- ✅ 캘린더 일정 등록 버튼 (스레드 OP / 서버 관리자): 음성 채널을 선택하여 일정을 등록하면 Discord 예약 이벤트가 해당 음성 채널에 연결됨
- ✅ JSON 영속화 (재시작 후에도 매핑 유지)
- ✅ 다국어 UI (ko / ja / en)

---

## 🧱 동작

```
[포럼 채널]
  └ 사용자가 새 스레드 작성 (스타터 메시지 자동 생성됨)
        ↓
  └ 봇이 스레드 안에 추적 메시지 게시 ("_아직 반응이 없습니다._")
        ↓
  └ 누군가 스타터 메시지에 리액션 추가
        ↓
  └ 봇이 추적 메시지를 편집:
        👍 : @alice, @bob
        🔥 : @charlie
```

---

## ⚙️ 필수 환경

- Node.js 18+
- Discord 봇 계정
- TypeScript

---

## 🔐 환경 변수

`.env`:
```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
BOT_LOCALE=ko
BOT_TIMEZONE=Asia/Tokyo
```

| 변수 | 설명 | 필수 |
|---|---|---|
| `DISCORD_TOKEN` | Discord Bot 토큰 | ✅ |
| `BOT_LOCALE` | `ko` / `ja` / `en` (미설정 시 길드 기본 → `en`) | ❌ |
| `BOT_TIMEZONE` | 캘린더 일정 입력 시각을 해석할 IANA 타임존 (예: `Asia/Tokyo`). 미설정이거나 유효하지 않은 IANA 타임존이면 기동에 실패 | ✅ |

---

## 감시할 포럼 채널 설정

감시 대상 포럼은 디스코드 안에서 슬래시 명령어로 관리합니다. 재시작은 필요 없습니다.

| 명령 | 설명 |
| --- | --- |
| `/forum add channel:<포럼>` | 해당 포럼 감시 시작. 등록 직후 기존 활성 스레드에도 추적 메시지를 답니다. |
| `/forum remove channel:<포럼>` | 감시 중단. 새 스레드만 추적하지 않으며, 이미 달린 추적 메시지는 남아서 계속 갱신됩니다. |
| `/forum list` | 현재 감시 중인 포럼 목록 |

명령어는 기본적으로 **서버 관리** 권한을 가진 사람에게만 보입니다. 서버 설정 > 연동에서 다른 역할에 열어줄 수 있습니다.

**봇을 처음 켰을 때는 감시 중인 포럼이 없습니다.** `/forum add`를 한 번 실행해야 추적이 시작됩니다.
감시 목록은 `data/forums.json`에 저장되어 재시작 후에도 유지됩니다.

**백필은 활성 스레드만 대상으로 합니다.** 포럼 게시글은 일정 기간이 지나면 자동으로 보관(archive)되는데, 보관된 글에는 추적 메시지를 달지 않습니다. 그래서 오래된 포럼을 등록하면 `scanned: 0`이 나올 수 있습니다 — 고장이 아니라 훑을 활성 스레드가 없다는 뜻이며, 이 경우 응답에 보관된 글이 몇 개인지 함께 표시됩니다. 앞으로 새로 올라오는 글은 정상적으로 추적됩니다.

**기존에 설치되어 있던 봇을 업그레이드하는 경우**: `/forum` 명령어를 쓰려면 `applications.commands` OAuth2 스코프가 필요한데, 예전 초대 링크에는 이 스코프가 빠져 있었습니다. `/forum`이 보이지 않는다면 아래 **봇 권한** 항목을 참고해 두 스코프를 모두 체크한 상태로 봇을 다시 초대해주세요. 다시 초대해도 봇이 서버에서 나가거나 데이터가 사라지지 않으며, 스코프만 추가로 부여됩니다.

---

## 🤖 봇 권한

**OAuth2 Scopes**: `bot`, `applications.commands`

**Bot Permissions**:
- `View Channels`
- `Send Messages in Threads`
- `Read Message History`
- `Manage Events` (캘린더 일정 등록)

**Gateway Intents (Bot 페이지)**: 모두 OFF (Privileged intent 사용 안 함)

---

## 🚀 실행

```bash
npm install
npm start
```

타입체크만:
```bash
npm run typecheck
npm test
```

성공 시 콘솔에 다음과 같이 출력됩니다:
```
Logged in as your-bot-name#1234
[commands] registered for guild <guild-id>
[sweep] no forums registered. Use /forum add to register one.
```

포럼이 하나 이상 등록되어 있으면, 스윕 결과는 대신 포럼별 한 줄과 합계 한 줄로 출력됩니다:
```
[sweep] forum <forum-id>: N scanned, M created, K resynced
[sweep] total: N scanned, M created, K resynced (0 forum(s) skipped)
```

---

## 🛰️ 배포 (pm2)

서버에 상주시킬 때는 `npm start`(ts-node)가 아니라 빌드 결과물을 실행합니다.

```bash
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
```

`pm2 startup`을 한 번 실행해두면 서버 재부팅 후에도 `pm2 save`로 저장된 상태가 자동 복구됩니다.

코드를 업데이트했을 때:
```bash
git pull
npm install
npm run build
pm2 restart forum-bot
```

`dist/`는 `.gitignore` 대상이라 `git pull`만으로는 갱신되지 않습니다. 서버에서 매번 `npm run build`를 실행해야 하고, 빌드에 `typescript`가 필요하므로 `npm install --omit=dev`로 설치하면 안 됩니다.

**작업 디렉터리(cwd) 주의.** `.env`와 `data/`는 실행 시점의 작업 디렉터리 기준으로 찾습니다. `ecosystem.config.js`가 `cwd`를 레포 경로로 고정하므로 위 방법대로 띄우면 문제없지만, 명령줄로 직접 띄운다면 `--cwd`를 반드시 지정하세요:
```bash
pm2 start dist/index.js --name forum-bot --cwd /path/to/repo
```
cwd가 어긋나면 `.env`를 못 찾아 `DISCORD_TOKEN is required`로 죽습니다. 토큰이 시스템 환경변수에 들어 있는 경우엔 봇이 뜨긴 하지만 빈 `data/`를 엉뚱한 위치에 새로 만들기 때문에 **감시 목록이 초기화된 것처럼 보입니다.**

**인스턴스는 반드시 1개.** 봇은 게이트웨이 연결을 하나만 유지해야 합니다. pm2 cluster 모드로 여러 개 띄우면 리액션 이벤트가 중복 처리되고 두 프로세스가 `data/*.json`을 동시에 덮어씁니다.

로그 확인:
```bash
pm2 logs forum-bot
```

---

## 📁 프로젝트 구조

```
src/
├── config/env.ts                 # 환경변수 로더
├── commands/
│   ├── definitions.ts             # /forum 슬래시 명령어 정의 및 길드 등록
│   └── forum.ts                   # /forum add|remove|list 핸들러
├── i18n/                          # 다국어 리소스 (ko/ja/en)
├── services/
│   ├── threadTracker.ts          # threadCreate 처리
│   ├── reactionTracker.ts        # 리액션 변경 처리
│   ├── startupSweeper.ts         # 시작 시 스윕
│   ├── cleanup.ts                # 스타터/스레드 삭제 처리
│   └── calendar/
│       ├── button.ts             # 캘린더 ActionRow
│       ├── eventInterval.ts      # 시작/종료 시각 검증·UTC 변환 (순수 함수)
│       └── handler.ts            # 캘린더 버튼/모달
├── store/
│   ├── forumStore.ts             # 감시 포럼 목록 영속화
│   └── trackingStore.ts          # 매핑 영속화
├── utils/
│   ├── reactionCollector.ts      # 이모지별 유저 ID 집계
│   └── format.ts                 # 추적 메시지 포맷
└── index.ts                       # 진입점
```

---

## 📌 주의사항

- 봇이 꺼져 있는 동안 생성된 스레드는 다음 시작 시 스윕이 보강 (활성 스레드만)
- 아카이브된 스레드는 의도적으로 스윕 안 함
- `data/trackingMap.json`에 매핑 저장 (`.gitignore` 포함)

---

## 📄 라이선스

MIT — [LICENSE](./LICENSE) 파일을 참고하세요.
