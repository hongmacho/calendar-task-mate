# 📅 CalendarTaskMate - 캘린더 우선 드래그 시간블로킹 작업 관리

캘린더 그리드를 주 인터페이스로 하여 회의와 작업을 한눈에 보고, 미배정 작업을 드래그 앤 드롭으로 시간 블록에 할당하는 **개인용 시간블로킹 작업 관리 도구**입니다.

## 🎯 핵심 기능

- **📅 주간/일간 캘린더 그리드** — 월~일별, 시간 단위 슬롯 표시
- **✅ 작업 관리** — 생성, 읽기, 수정, 삭제, 상태 추적
- **⏱️ 시간블로킹** — 드래그 앤 드롭으로 미배정 작업을 캘린더에 배치
- **📊 통계 대시보드** — 작업 수, 시간, 상태별 집계
- **📥 CSV 내보내기** — 모든 작업 데이터 다운로드
- **🔐 Server-Only 데이터베이스** — 클라이언트 접근 차단
- **🌐 완전 한국어 UI** — 모든 텍스트 한국어

## 🛠️ 기술 스택

| 범주 | 기술 |
|------|------|
| **프레임워크** | Next.js 16 + App Router |
| **언어** | TypeScript (strict mode) |
| **스타일링** | Tailwind CSS v4 |
| **데이터베이스** | SQLite + Drizzle ORM |
| **드라이버** | better-sqlite3 |

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

## 📖 사용 방법

### 1️⃣ 대시보드 보기
- 홈 페이지에서 전체 작업 요약 확인

### 2️⃣ 주간 캘린더에서 시간블로킹
- **캘린더** 페이지에서 주간 그리드 확인
- 왼쪽 미배정 작업 영역에서 작업 선택
- 캘린더 시간 슬롯에 드래그하여 배치

### 3️⃣ 작업 추가 및 관리
- **작업** > **+ 새 작업** 클릭
- 제목, 설명, 예상 시간 입력
- 작업 목록에서 상태 변경

### 4️⃣ 일간 뷰에서 상세 확인
- **캘린더** > **일간 뷰** 클릭
- 오늘의 시간블록 시각화

### 5️⃣ 데이터 내보내기
- **설정** > **CSV로 내보내기** 클릭
- 모든 작업 데이터 다운로드

## 🗂️ 프로젝트 구조

```
calendar-task-mate/
├── app/
│   ├── api/              # API 라우트
│   │   ├── tasks/        # 작업 CRUD
│   │   ├── stats/        # 통계
│   │   └── export/       # CSV 내보내기
│   ├── calendar/         # 캘린더 페이지
│   ├── tasks/            # 작업 관리
│   ├── settings/         # 설정
│   └── layout.tsx        # 루트 레이아웃
├── src/
│   ├── db/
│   │   ├── schema.ts     # Drizzle 스키마
│   │   └── index.ts      # DB 인스턴스
│   └── repositories/     # 데이터 접근 계층
├── components/
│   └── Navigation.tsx    # 네비게이션
└── package.json
```

## 🗄️ 데이터베이스

### 테이블 구조

**projects**: 클라이언트/프로젝트 정보
- id, name, color, billableRate, createdAt

**tasks**: 작업
- id, title, description, projectId, status, estimatedHours, createdAt, updatedAt

**timeBlocks**: 시간 할당
- id, taskId, startTime, endTime, createdAt

**calendarEvents**: 캘린더 이벤트
- id, title, startTime, endTime, description, createdAt

## 📊 개발 명령어

```bash
# TypeScript 타입 체크
npx tsc --noEmit

# ESLint 린트
npx eslint .

# 데이터베이스 마이그레이션
npm run db:push

# Drizzle Studio (DB 브라우저)
npm run db:studio
```

## 🔐 보안 특징

- **Server-Only Database**: `import "server-only"` 패턴으로 클라이언트-서버 경계 강제
- **TypeScript Strict Mode**: 모든 타입 안전성 검증
- **Input Validation**: API에서 모든 입력값 검증
- **로컬 SQLite**: 클라우드 의존 없음

## 📱 브라우저 지원

- Chrome/Edge 최신 버전
- Safari 최신 버전
- Firefox 최신 버전
- 모바일 (iOS Safari, Chrome Mobile)

## 📈 향후 계획

- **v1.1**: 자동 시간블로킹 제안 (AI)
- **v1.2**: 팀 협업 기능
- **v2.0**: 모바일 네이티브 앱 (React Native)

## 📄 라이센스

MIT License

---

**🎉 Happy Scheduling!** 📅✨
