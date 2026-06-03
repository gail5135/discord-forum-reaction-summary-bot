# Discord Forum Reaction Tracker Bot

지정한 **포럼 채널**에 새 스레드가 생기면 봇이 자동으로 추적 메시지를 만들고, 스레드 첫 메시지(스타터)에 달리는 **리액션을 이모지별로 누가 눌렀는지** 실시간으로 기록합니다.

---

## ✨ 기능

- ✅ 새 스레드 생성 시 봇이 즉시 추적 메시지 게시 (빈 상태로 시작)
- ✅ 스타터 메시지 리액션 추가/제거 시 추적 메시지 자동 편집
- ✅ 이모지별로 멘션을 그룹핑 (커스텀/애니메이션 이모지 지원)
- ✅ 봇 시작 시 활성 스레드 스윕으로 누락분 자동 보강
- ✅ 스타터/스레드 삭제 시 매핑 자동 정리
- ✅ 캘린더 일정 등록 버튼 (스레드 OP / 서버 관리자)
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
TARGET_FORUM_ID=123456789012345678
BOT_LOCALE=ko
```

| 변수 | 설명 | 필수 |
|---|---|---|
| `DISCORD_TOKEN` | Discord Bot 토큰 | ✅ |
| `TARGET_FORUM_ID` | 감시할 포럼 채널 ID | ✅ |
| `BOT_LOCALE` | `ko` / `ja` / `en` (미설정 시 길드 기본 → `en`) | ❌ |

---

## 🤖 봇 권한

**OAuth2 Scopes**: `bot`

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
```

성공 시 콘솔에 다음과 같이 출력됩니다:
```
Logged in as your-bot-name#1234
[sweep] N scanned, M created, K resynced
```

---

## 📁 프로젝트 구조

```
src/
├── config/env.ts                 # 환경변수 로더
├── i18n/                          # 다국어 리소스 (ko/ja/en)
├── services/
│   ├── threadTracker.ts          # threadCreate 처리
│   ├── reactionTracker.ts        # 리액션 변경 처리
│   ├── startupSweeper.ts         # 시작 시 스윕
│   ├── cleanup.ts                # 스타터/스레드 삭제 처리
│   └── calendar/
│       ├── button.ts             # 캘린더 ActionRow
│       └── handler.ts            # 캘린더 버튼/모달
├── store/
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

MIT
