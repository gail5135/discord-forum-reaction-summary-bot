# Discord Reaction Summary Bot

**타겟 채널**의 `@everyone` 태그가 있는 메시지를 **타겟 채널에 복사**하고, **리액션을 요약**해서 표시하는 Discord 봇입니다.

---

## ✨ 주요 기능

- ✅ `@everyone` 태그가 있는 메시지만 복사
- ✅ 복사 후 원본 메시지 자동 삭제
- ✅ 리액션을 이모지별로 묶어서 멘션 표시
- ✅ 커스텀 이모지 및 애니메이션 이모지 지원
- ✅ 편집/삭제 버튼 (본인만 가능)
- ✅ 캘린더 일정 추가 버튼 (서버 예약 이벤트 등록)
- ✅ JSON 파일로 데이터 영속화 (봇 재시작 시에도 유지)
- ✅ 다국어 UI 지원 (한국어, 일본어, 영어)

---

## 🧱 동작 구조

```
[타겟 채널]
  └ 유저가 @everyone 메시지 작성
        ↓
  └ 봇이 복사 메시지 생성 (편집/삭제 버튼 포함)
        ↓
  └ 원본 메시지 삭제
        ↓
  └ 복사 메시지에 리액션 추가/제거
        ↓
  └ 봇이 리액션 정보를 메시지에 반영
```

---

## 🧩 메시지 포맷 예시

```
## **From** @유저

@everyone 모집합니다

ーーーーーーーーーーーーーーーーーーーーー
👍 : @alice, @bob
🔥 : @charlie

[✏️ 編集] [🗑️ 削除]
```

---

## ⚙️ 필수 환경

- Node.js 18+
- Discord 봇 계정
- TypeScript

---

## 🔐 환경 변수 설정

### `.env`

```env
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
TARGET_CHANNEL_ID=123456789012345678
BOT_LOCALE=ko
```

| 변수                | 설명                                             | 필수 |
| ------------------- | ------------------------------------------------ | ---- |
| `DISCORD_TOKEN`     | Discord Developer Portal에서 발급한 Bot Token    | ✅   |
| `TARGET_CHANNEL_ID` | 원본 메시지가 있고, 복사 메시지가 작성될 채널 ID | ✅   |
| `BOT_LOCALE`        | 버튼 UI 언어 설정 (`ko`, `ja`, `en`)            | ❌   |

> **참고**: `BOT_LOCALE`이 설정되지 않으면 Discord 서버의 기본 언어 설정을 따릅니다.

---

## 🤖 봇 권한 설정

Discord Developer Portal → OAuth2 → URL Generator에서:

### Scopes

- ✅ `bot`

### Bot Permissions

- ✅ `View Channels`
- ✅ `Send Messages`
- ✅ `Manage Messages` (원본 삭제용)
- ✅ `Read Message History`
- ✅ `Add Reactions`
- ✅ `Use External Emojis`
- ✅ `Manage Events` (캘린더 일정 등록용)

### Privileged Gateway Intents (Bot 페이지)

- ✅ `MESSAGE CONTENT INTENT`

---

## 🚀 실행 방법

```bash
npm install
npx ts-node src/index.ts
```

정상 실행 시 콘솔에 다음과 같이 출력됩니다:

```
Logged in as your-bot-name#1234
```

---

## 📁 프로젝트 구조

```
src/
├── config/
│   └── env.ts              # 환경변수 로더
├── services/
│   ├── copyService.ts      # 메시지 복사
│   ├── reactionService.ts  # 리액션 처리
│   └── interactionService.ts # 버튼/모달 처리
├── store/
│   └── messageMap.ts       # 복사 메시지 ID 저장소
├── utils/
│   ├── constants.ts        # 상수 정의
│   └── messageFormat.ts    # 메시지 포맷팅
└── index.ts                # 진입점
```

---

## 📌 주의사항

- `@everyone` 외 아무런 내용이 없는 메시지는 복사되지 않음
- 편집/삭제는 **원본 작성자 본인만** 가능
- `data/` 폴더에 메시지 ID가 저장됨 (`.gitignore`에 포함)

---

## 📄 라이선스

MIT
