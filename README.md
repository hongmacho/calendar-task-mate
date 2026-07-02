# 📅 CalendarTaskMate - 캘린더 우선 드래그 시간블로킹 작업 관리

캘린더 그리드를 주 인터페이스로 하여 회의와 작업을 한눈에 보고, 미배정 작업을 드래그 앤 드롭으로 시간 블록에 할당하는 **개인용 시간블로킹 작업 관리 도구**입니다.

## 🎯 핵심 기능

- **📅 주간 캘린더 그리드** — 월~일별 시간 단위 슬롯으로 표시
- **✅ 작업 관리** — 생성, 수정, 삭제, 상태 추적 (미배정/배정/진행중/완료)
- **📊 통계 대시보드** — 주간 작업 시간, 완료율, 청구 가능 시간
- **🎨 프로젝트 색상** — 클라이언트별 색 구분, 청구 시간 추적
- **🔗 로컬 우선** — SQLite 데이터베이스, 외부 연동 없음

## 🛠️ 기술 스택

| 범주 | 기술 |
|------|------|
| **프레임워크** | Next.js 16 |
| **언어** | TypeScript 6.0 |
| **스타일링** | Tailwind CSS v4 |
| **데이터베이스** | SQLite + better-sqlite3 |
| **ORM** | Drizzle ORM |

## 📋 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 시작
npm run dev

# 3. 프로덕션 빌드
npm run build
npm start
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📖 사용 방법

### 1️⃣ 작업 추가하기
- **작업** 페이지에서 "+ 새 작업" 클릭
- 제목, 설명, 예상 시간 입력

### 2️⃣ 캘린더에 시간블로킹하기
- **캘린더** 페이지에서 미배정 작업 확인
- 작업을 캘린더 시간 슬롯으로 드래그 (구현 예정)
- 자동으로 시간 할당

### 3️⃣ 통계 보기
- **통계** 페이지에서 주간 작업 시간, 완료율 확인
- 프로젝트별 청구 가능 시간 계산

## 🗂️ 프로젝트 구조

```
calendar-task-mate/
├── app/
│   ├── calendar/          # 주간 캘린더 페이지
│   ├── tasks/             # 작업 관리 페이지
│   ├── stats/             # 통계 대시보드
│   ├── api/               # API 라우트
│   │   └── tasks/
│   └── layout.tsx
├── src/
│   ├── db/
│   │   ├── schema.ts      # Drizzle 스키마
│   │   └── index.ts       # DB 인스턴스
│   └── repositories/      # 데이터 접근 계층
├── components/
│   └── Navigation.tsx
├── package.json
└── tsconfig.json
```

## 🗄️ 데이터베이스 스키마

### projects 테이블
- id: 프로젝트 ID
- name: 프로젝트 이름
- color: UI 표시 색상
- billableRate: 시간당 청구 금액

### tasks 테이블
- id: 작업 ID
- title: 작업 제목
- description: 설명
- projectId: 프로젝트 FK
- status: 상태 (unassigned, assigned, in_progress, completed)
- estimatedHours: 예상 시간
- createdAt, updatedAt: 타임스탬프

### timeBlocks 테이블
- id: 시간 블록 ID
- taskId: 작업 FK
- startTime, endTime: 시작/종료 시간

### calendarEvents 테이블
- id: 이벤트 ID
- title: 이벤트 제목
- startTime, endTime: 시작/종료 시간
- description: 설명

## 🧪 개발 명령어

```bash
# TypeScript 타입 체크
npm run type-check

# ESLint 린트
npm run lint

# 데이터베이스 마이그레이션
npm run db:push

# Drizzle Studio (DB 브라우저)
npx drizzle-kit studio
```

## 🔐 보안

- 로컬 SQLite 데이터베이스 (클라우드 불필요)
- 모든 사용자 입력 유효성 검사
- TypeScript 타입 안전성

## 📱 브라우저 지원

- Chrome/Edge 최신 버전
- Safari 최신 버전
- Firefox 최신 버전
- 모바일 (iOS Safari, Chrome Mobile)

## 📈 향후 계획 (v1.1+)

- 드래그 앤 드롭 시간블로킹 구현
- 다크모드 지원
- 팀 협업 기능
- 클라우드 동기화

## 📄 라이센스

MIT License

---

**🎉 Happy Scheduling!** 📅✨
