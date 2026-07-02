# CalendarTaskMate - 개발 로드맵

**최종 업데이트:** 2026년 7월 2일  
**총 스프린트:** 6개  
**예상 기간:** 12주 (3개월)  
**팀 규모:** 1명 (풀스택 개발자)

---

## 0. 프로젝트 초기화 (Sprint 0: 1주)

### 목표
Next.js 16 프로젝트 골격 설정, 개발 환경 구축, 데이터베이스 초기화

### 소요 시간
5일 (약 30시간)

### 세부 작업

#### 0.1 Next.js 16 프로젝트 생성
```bash
npx create-next-app@latest calendar-task-mate --yes
```

**체크리스트:**
- [ ] TypeScript 선택
- [ ] ESLint 선택 (커스텀 설정 필요)
- [ ] Tailwind CSS v4 선택
- [ ] App Router 자동 선택
- [ ] import alias @/* 자동 설정
- [ ] Turbopack 포함

**주의:** Next.js 16에서 `next lint` 명령은 제거됨. `eslint.config.mjs`를 직접 구성해야 함.

#### 0.2 shadcn/ui 초기화
```bash
npx shadcn@latest init -t next -d
```

**체크리스트:**
- [ ] Radix (기본) 선택
- [ ] /components/ui 생성
- [ ] globals.css 설정 (Tailwind v4)
- [ ] next-themes 설치 (다크모드 선택사항)

**주의:** React 19 peer dependency 확인. 필요시 `--legacy-peer-deps` 사용.

#### 0.3 Drizzle + better-sqlite3 설치
```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

**체크리스트:**
- [ ] `drizzle.config.ts` 생성
- [ ] `src/db/schema.ts` 생성
- [ ] `src/db/index.ts` 생성 (Database 인스턴스)
- [ ] SQLite 파일 경로: `.data/sqlite.db`

**drizzle.config.ts 예시:**
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: './.data/sqlite.db',
  },
});
```

#### 0.4 ESLint 설정
**체크리스트:**
- [ ] `eslint.config.mjs` 수동 작성
  - eslint-plugin-react-hooks
  - eslint-plugin-import
  - @typescript-eslint/eslint-plugin
- [ ] 추가 규칙: no-console (경고), no-unused-vars, no-any

#### 0.5 프로젝트 구조 초기화
```
src/
  app/
    layout.tsx        # Root layout
    page.tsx          # Dashboard 페이지
    calendar/         # 캘린더 관련
      page.tsx
      [view]/         # view=week, day, month
        page.tsx
    tasks/            # 작업 관리
      page.tsx
      [id]/
        page.tsx
    stats/            # 통계
      page.tsx
    settings/         # 설정
      page.tsx
  components/
    ui/               # shadcn 컴포넌트
    calendar/         # 캘린더 그리드, 드래그 등
    tasks/            # 작업 카드, 목록
    common/           # 공통 컴포넌트 (헤더, 사이드바 등)
  db/
    schema.ts         # Drizzle 스키마 정의
    index.ts          # 데이터베이스 인스턴스
  lib/
    utils.ts          # 유틸 함수
    time.ts           # 시간 계산 헬퍼
    constants.ts      # 상수 (색상, 상태 등)
  repositories/       # Repository 패턴 (v1.1)
```

**체크리스트:**
- [ ] 디렉토리 생성
- [ ] `src/app/layout.tsx` 기본 구조 (헤더, 사이드바)
- [ ] Tailwind globals 적용

#### 0.6 개발 환경 검증
**체크리스트:**
- [ ] `npm run dev` 실행 → localhost:3000 정상 응답
- [ ] `npx drizzle-kit push` → 데이터베이스 파일 생성
- [ ] TypeScript 컴파일 오류 없음
- [ ] ESLint 정상 작동

#### 0.7 Git 초기화 및 첫 커밋
```bash
git init
git add .
git commit -m "chore: initialize next.js 16 project with shadcn and drizzle"
```

**체크리스트:**
- [ ] `.gitignore` 설정 (.data/sqlite.db, .env.local 포함)
- [ ] README.md 기본 작성

---

## 1. 데이터베이스 & Repository 레이어 (Sprint 1: 1.5주)

### 목표
모든 엔티티 테이블 정의, Repository 패턴 구현, 데이터 접근 추상화

### 소요 시간
8~10일 (약 50시간)

### 세부 작업

#### 1.1 Drizzle 스키마 정의
**파일**: `src/db/schema.ts`

**체크리스트:**
- [ ] `clients` 테이블 (id, name, color, hourly_rate, timestamps)
- [ ] `projects` 테이블 (id, client_id, name, description, color, timestamps)
- [ ] `tasks` 테이블 (id, project_id, title, description, estimated_hours, status, priority, timestamps)
- [ ] `task_assignments` 테이블 (id, task_id, assigned_date, start_time, end_time, actual_duration, completed_at, timestamps)
- [ ] `calendar_events` 테이블 (id, title, description, event_date, start_time, end_time, color, ical_uid, timestamps)
- [ ] `tags` 테이블 (id, name, created_at)
- [ ] `task_tags` 테이블 (task_id, tag_id, PK)
- [ ] `task_notes` 테이블 (id, task_id, content, timestamps)

**주의사항:**
- **Timestamp 패턴**: Drizzle에서는 정수형 unix timestamp 사용 (integer 타입)
  ```typescript
  created_at: integer({ mode: 'timestamp_ms' }).notNull().defaultNow(),
  ```
- **Foreign Key**: ON DELETE CASCADE 설정
- **Status Enum**: 문자열 check constraint로 구현
  ```typescript
  status: text().notNull().default('unassigned')
    .$type<'unassigned' | 'assigned' | 'in_progress' | 'completed'>(),
  ```

#### 1.2 마이그레이션 생성
```bash
npx drizzle-kit generate
npx drizzle-kit push
```

**체크리스트:**
- [ ] `drizzle/` 폴더에 마이그레이션 파일 생성
- [ ] 데이터베이스에 모든 테이블 생성 확인
- [ ] `better-sqlite3`가 `.data/sqlite.db` 생성 확인

#### 1.3 Repository 패턴 구현
**디렉토리**: `src/repositories/`

각 엔티티별 Repository 클래스:

**1.3.1 ClientRepository**
```typescript
// src/repositories/ClientRepository.ts
export class ClientRepository {
  async create(name: string, color: string, hourly_rate?: number): Promise<Client>
  async findAll(): Promise<Client[]>
  async findById(id: number): Promise<Client | null>
  async update(id: number, data: Partial<Client>): Promise<void>
  async delete(id: number): Promise<void>
}
```

**1.3.2 ProjectRepository**
```typescript
export class ProjectRepository {
  async create(client_id: number, name: string, description?: string, color?: string): Promise<Project>
  async findByClientId(client_id: number): Promise<Project[]>
  async findById(id: number): Promise<Project | null>
  async update(id: number, data: Partial<Project>): Promise<void>
  async delete(id: number): Promise<void>
}
```

**1.3.3 TaskRepository**
```typescript
export class TaskRepository {
  async create(project_id: number, title: string, ...): Promise<Task>
  async findByStatus(status: TaskStatus): Promise<Task[]>
  async findByProjectId(project_id: number): Promise<Task[]>
  async findById(id: number): Promise<Task | null>
  async update(id: number, data: Partial<Task>): Promise<void>
  async delete(id: number): Promise<void>
  async updateStatus(id: number, status: TaskStatus): Promise<void>
}
```

**1.3.4 TaskAssignmentRepository**
```typescript
export class TaskAssignmentRepository {
  async create(task_id: number, assigned_date: string, start_time: number, end_time: number): Promise<TaskAssignment>
  async findByTaskId(task_id: number): Promise<TaskAssignment | null>
  async findByDateRange(startDate: string, endDate: string): Promise<TaskAssignment[]>
  async update(id: number, data: Partial<TaskAssignment>): Promise<void>
  async delete(id: number): Promise<void>
  async completeTask(id: number, actual_duration: number): Promise<void>
}
```

**1.3.5 CalendarEventRepository**
```typescript
export class CalendarEventRepository {
  async create(title: string, event_date: string, start_time: number, end_time: number, ...): Promise<CalendarEvent>
  async findByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]>
  async findById(id: number): Promise<CalendarEvent | null>
  async update(id: number, data: Partial<CalendarEvent>): Promise<void>
  async delete(id: number): Promise<void>
}
```

**체크리스트:**
- [ ] 각 Repository 클래스 구현
- [ ] Database 싱글톤 패턴으로 연결
- [ ] 에러 처리 (try-catch, 트랜잭션)

#### 1.4 데이터베이스 초기화 헬퍼
**파일**: `src/lib/db-init.ts`

```typescript
export async function initializeDatabase() {
  // 테스트용 기본 클라이언트, 프로젝트 생성
  // (개발 편의를 위해)
}
```

**체크리스트:**
- [ ] 개발용 샘플 데이터 생성 함수
- [ ] API 라우트에서 호출 가능하도록 설계

#### 1.5 API 라우트 (기초)
**디렉토리**: `src/app/api/`

기본 CRUD 라우트 스켈레톤:
- `app/api/clients/route.ts` (GET, POST)
- `app/api/clients/[id]/route.ts` (GET, PUT, DELETE)
- `app/api/projects/route.ts` (GET, POST)
- `app/api/tasks/route.ts` (GET, POST)
- `app/api/tasks/[id]/route.ts` (GET, PUT, DELETE)

**체크리스트:**
- [ ] 각 API 라우트 기본 구조 (error handling 포함)
- [ ] TypeScript 타입 정의
- [ ] Repository를 호출하는 구조

#### 1.6 타입 정의
**파일**: `src/types/index.ts`

```typescript
export interface Client { /* ... */ }
export interface Project { /* ... */ }
export interface Task { /* ... */ }
export interface TaskAssignment { /* ... */ }
export interface CalendarEvent { /* ... */ }
export type TaskStatus = 'unassigned' | 'assigned' | 'in_progress' | 'completed'
export type Priority = 'low' | 'medium' | 'high'
```

**체크리스트:**
- [ ] 모든 엔티티 인터페이스 정의
- [ ] Enum 타입 정의 (TaskStatus, Priority 등)

#### 1.7 테스트 (단위)
**디렉토리**: `src/__tests__/repositories/`

**체크리스트:**
- [ ] ClientRepository.test.ts
  - [ ] create 성공/실패
  - [ ] findById
  - [ ] update
  - [ ] delete
- [ ] TaskRepository.test.ts
  - [ ] create
  - [ ] findByStatus
  - [ ] updateStatus

**최소 요구사항**: 80% 커버리지 (Repository 계층만)

---

## 2. 기본 UI & 대시보드 (Sprint 2: 1.5주)

### 목표
레이아웃 구성, 공통 컴포넌트, 대시보드 페이지

### 소요 시간
8~10일 (약 50시간)

### 세부 작업

#### 2.1 레이아웃 및 네비게이션
**파일**: `src/app/layout.tsx`, `src/components/common/Header.tsx`, `src/components/common/Sidebar.tsx`

**체크리스트:**
- [ ] Root Layout (헤더 + 사이드바 + 메인 영역)
- [ ] 헤더 (로고, 검색, 프로필)
- [ ] 사이드바 (네비게이션 링크)
  - 대시보드
  - 캘린더
  - 작업 목록
  - 통계
  - 설정
- [ ] 반응형 (모바일 640px+)
- [ ] 다크/라이트 모드 토글 (next-themes)

#### 2.2 shadcn 기본 컴포넌트 설치
```bash
npx shadcn@latest add button input card dropdown-menu
```

**체크리스트:**
- [ ] Button
- [ ] Input
- [ ] Card
- [ ] DropdownMenu
- [ ] Select
- [ ] Dialog / AlertDialog (작업 삭제 확인)
- [ ] Tabs (상태 필터)
- [ ] Badge (상태 표시)

#### 2.3 대시보드 페이지
**파일**: `src/app/page.tsx`, `src/components/dashboard/`

**레이아웃:**
- 상단: 오늘의 일정 카드
- 중단: 주간 막대 그래프 (배정 시간)
- 하단: 프로젝트별 원형 차트

**체크리스트:**
- [ ] "오늘의 일정" 카드 (배정 시간 / 여유 시간)
- [ ] "주간 작업량" 막대 그래프 (일별 데이터)
- [ ] "프로젝트별 분배" 원형 차트
- [ ] 빠른 링크 (캘린더로 가기, 작업 추가 등)
- [ ] 빈 상태 화면 ("첫 작업 추가" 유도)

#### 2.4 Recharts 통합
**설치**: `npm install recharts`

**체크리스트:**
- [ ] BarChart (주간 일별 시간)
- [ ] PieChart (프로젝트 분배)
- [ ] Legend, Tooltip, ResponsiveContainer
- [ ] 색상 팔레트 (테일윈드 색상)

#### 2.5 공통 컴포넌트
**디렉토리**: `src/components/common/`

**체크리스트:**
- [ ] LoadingSpinner
- [ ] ErrorBoundary
- [ ] EmptyState (여러 타입)
  - 작업 없음
  - 할당 없음
  - 검색 결과 없음
- [ ] ConfirmDialog (삭제 확인)
- [ ] Toast / Notification (shadcn/ui sonner)

#### 2.6 유틸 함수
**파일**: `src/lib/utils.ts`, `src/lib/time.ts`

**체크리스트:**
- [ ] `minutesToTime(minutes)` → "14:30"
- [ ] `timeToMinutes(time)` → 870
- [ ] `getDatesInWeek(date)` → [Mon, Tue, ... Sun]
- [ ] `getMonthDays(date)` → 해당 월의 일자 배열
- [ ] `formatDateShort(date)` → "7/7 (월)"
- [ ] `calculateDuration(start, end)` → 시간 차이

#### 2.7 상수 정의
**파일**: `src/lib/constants.ts`

```typescript
export const TASK_STATUS = {
  UNASSIGNED: 'unassigned',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const COLORS = {
  default: '#3B82F6', // 블루
  error: '#EF4444',   // 레드
  success: '#10B981', // 그린
  // ...프로젝트별 색상 팔레트
};

export const TIME_BLOCKS = [
  { label: '06:00', minutes: 360 },
  { label: '07:00', minutes: 420 },
  // ...22:00까지
];
```

#### 2.8 페이지 라우팅 초기 구조
**체크리스트:**
- [ ] `/` → 대시보드
- [ ] `/calendar` → 캘린더 (기본 주간 뷰)
- [ ] `/tasks` → 작업 목록
- [ ] `/stats` → 통계
- [ ] `/settings` → 설정

#### 2.9 테스트
**디렉토리**: `src/__tests__/components/`

**체크리스트:**
- [ ] Dashboard.test.tsx (차트 렌더링)
- [ ] Layout.test.tsx (네비게이션)
- [ ] TimeUtils.test.ts (시간 변환 함수)

---

## 3. 캘린더 그리드 & 작업 관리 (Sprint 3: 2주)

### 목표
주간 캘린더 그리드, 작업 목록/백로그, 작업 상세 페이지

### 소요 시간
12일 (약 70시간)

### 세부 작업

#### 3.1 캘린더 그리드 컴포넌트 (핵심)
**파일**: `src/components/calendar/WeeklyCalendarGrid.tsx`

**구조:**
```
┌─────────────────────────────────────┐
│ 월     화     수     목     금     토    일  │
├─────────────────────────────────────┤
│06:00  [ ]   [ ]   [ ]   [ ]   [ ]   [ ]  [ ] │
│07:00  [ ]   [ ]   [📅]  [ ]   [ ]   [ ]  [ ] │ (회의)
│ ...                                       │
│14:00  [✓]   [ ]   [ ]   [ ]   [ ]   [ ]  [ ] │ (작업 카드)
│15:00  [✓]   [ ]   [ ]   [ ]   [ ]   [ ]  [ ] │
│ ...                                       │
│22:00  [ ]   [ ]   [ ]   [ ]   [ ]   [ ]  [ ] │
└─────────────────────────────────────┘
```

**체크리스트:**
- [ ] Grid 레이아웃 (CSS Grid, 7열 × 16행)
- [ ] 시간 축 (좌측)
- [ ] 요일 헤더 (상단)
- [ ] 각 셀: 이벤트/작업 컴포넌트 표시
- [ ] 스크롤 가능 (가로/세로)
- [ ] 주 네비게이션 ("이전 주", "오늘", "다음 주")

**기술 주의:**
- CSS Grid 사용 (Tailwind `grid-cols-7`)
- 반응형 고려 (모바일에서는 축소 또는 스크롤)

#### 3.2 캘린더 이벤트/작업 카드 컴포넌트
**파일**: `src/components/calendar/EventCard.tsx`, `src/components/calendar/TaskCard.tsx`

**EventCard:**
- 제목, 시간 표시
- 회의 색 (회색)
- 클릭 시 상세 정보 팝업

**TaskCard:**
- 제목, 예상 시간
- 프로젝트 색
- 상태 아이콘 (진행중/완료)
- 클릭 시 상세 페이지로 이동

**체크리스트:**
- [ ] EventCard 스타일 (회색, 작은 텍스트)
- [ ] TaskCard 스타일 (컬러풀, 프로젝트 배경)
- [ ] Hover 효과
- [ ] 텍스트 오버플로우 처리

#### 3.3 작업 목록 / 백로그 페이지
**경로**: `/tasks`  
**파일**: `src/app/tasks/page.tsx`, `src/components/tasks/TaskList.tsx`

**레이아웃:**
- 좌측: 필터 패널
- 중앙: 작업 테이블/카드 목록
- 우측: (선택) 상세 프리뷰

**필터:**
- 상태 (미배정, 배정됨, 진행중, 완료)
- 클라이언트/프로젝트
- 날짜 범위 (주/월)
- 우선순위

**정렬:**
- 제목, 시간, 생성일, 마감일

**테이블 컬럼:**
- 체크박스 (선택)
- 제목 (클릭 → 상세 페이지)
- 클라이언트 (색 배지)
- 예상 시간
- 상태 (배지)
- 액션 (수정, 삭제)

**체크리스트:**
- [ ] 작업 목록 렌더링
- [ ] 필터 기능 (상태, 클라이언트, 날짜)
- [ ] 정렬 기능 (클릭 헤더로 정렬)
- [ ] 페이지네이션 (선택, 먼저는 전체 목록)
- [ ] "+ 새 작업" 버튼
- [ ] 일괄 삭제 (선택한 작업)
- [ ] 반응형 (모바일에서는 카드 뷰)

#### 3.4 작업 생성/편집 모달/폼
**파일**: `src/components/tasks/TaskForm.tsx`, `src/app/tasks/[id]/page.tsx`

**폼 필드:**
- 제목 (필수)
- 설명 (마크다운 에디터, 선택)
- 클라이언트/프로젝트 (드롭다운, 필수)
- 예상 시간 (숫자, 기본 1.0)
- 우선순위 (Low/Medium/High)
- 태그 (다중 선택)

**저장 로직:**
- Validation (제목 필수)
- POST /api/tasks (생성)
- PUT /api/tasks/[id] (수정)
- 성공 후 목록으로 이동

**체크리스트:**
- [ ] 폼 컴포넌트 (React Hook Form 권장)
- [ ] 유효성 검사 (클라이언트 + 서버)
- [ ] 에러 메시지 표시
- [ ] 저장 중 로딩 상태
- [ ] 성공/실패 토스트 메시지

#### 3.5 작업 상세 페이지
**경로**: `/tasks/:id`  
**파일**: `src/app/tasks/[id]/page.tsx`

**콘텐츠:**
- 제목 (인라인 편집)
- 설명 (마크다운 렌더러)
- 메타데이터 (클라이언트, 프로젝트, 예상 시간, 우선순위)
- 상태 버튼 (미배정 → 배정 → 진행중 → 완료)
- 할당 정보 (배정된 날짜/시간, 있으면)
- 태그
- 메모 (여러 개 추가 가능)
- 삭제 버튼

**체크리스트:**
- [ ] 작업 데이터 조회 (API)
- [ ] 제목 인라인 편집
- [ ] 상태 변경 버튼
- [ ] 메모 추가/삭제
- [ ] 삭제 확인 다이얼로그
- [ ] 뒤로가기 버튼

#### 3.6 백로그 영역 (캘린더 페이지에서)
**파일**: `src/components/calendar/Backlog.tsx`

**목적**: 미배정 작업을 드래그 소스로 제공

**표시:**
- 미배정 작업 목록 (작은 카드)
- 각 카드: 제목, 예상 시간
- 드래그 가능 (다음 Sprint에서 dnd 구현)

**체크리스트:**
- [ ] 미배정 작업 필터 (status='unassigned')
- [ ] 카드 렌더링
- [ ] 카드 스타일 (드래그 가능함을 시각화)

#### 3.7 API 라우트 구현
**체크리스트:**
- [ ] GET /api/tasks (조건 검색, 필터)
- [ ] POST /api/tasks (생성)
- [ ] GET /api/tasks/[id]
- [ ] PUT /api/tasks/[id]
- [ ] DELETE /api/tasks/[id]
- [ ] GET /api/calendar/events (날짜 범위)
- [ ] POST /api/calendar/events (생성)
- [ ] DELETE /api/calendar/events/[id]

#### 3.8 테스트
**체크리스트:**
- [ ] TaskList.test.tsx (필터, 정렬, 렌더링)
- [ ] TaskForm.test.tsx (유효성 검사)
- [ ] API 라우트 테스트 (Repository 호출)

---

## 4. 드래그 앤 드롭 시간블로킹 (Sprint 4: 2주) ⭐ HIGH RISK

### 목표
백로그의 작업을 캘린더 그리드에 드래그해서 시간 할당

### 소요 시간
12일 (약 70시간, 가장 복잡한 부분)

### 세부 작업

#### 4.1 DnD 라이브러리 선택 & 설치

**후보:**
1. **dnd-kit** (권장)
   - 가볍고 현대적 (Next 16 호환)
   - 터치 지원
   - 유연한 커스터마이제이션
2. **react-beautiful-dnd** (대안)
   - 성숙한 라이브러리
   - Framer Motion 기반
   - 모바일 지원

**선택:** dnd-kit (성능, 번들 사이즈)

```bash
npm install @dnd-kit/core @dnd-kit/utilities @dnd-kit/sortable @dnd-kit/html5-emulation
```

**체크리스트:**
- [ ] dnd-kit 설치
- [ ] 타입 정의 설치 (@types/dnd-kit)

#### 4.2 DnD 프로바이더 설정
**파일**: `src/app/layout.tsx` 또는 `src/components/calendar/index.tsx`

```typescript
import { DndContext, DragEndEvent } from '@dnd-kit/core';

export function CalendarWithDnD() {
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* <Backlog /> 와 <CalendarGrid /> */}
    </DndContext>
  );
}
```

**체크리스트:**
- [ ] DndContext 래핑
- [ ] onDragEnd 핸들러 구현

#### 4.3 드래그 가능한 백로그 아이템
**파일**: `src/components/calendar/DraggableTaskCard.tsx`

```typescript
import { useDraggable } from '@dnd-kit/core';

export function DraggableTaskCard({ task }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: `task-${task.id}` });
  return <div ref={setNodeRef} {...listeners} {...attributes}>{task.title}</div>;
}
```

**체크리스트:**
- [ ] useDraggable 훅 사용
- [ ] 드래그 시작 시 커서 변경
- [ ] 드래그 중 opacity/shadow 변경

#### 4.4 드롭 가능한 캘린더 슬롯
**파일**: `src/components/calendar/DroppableCalendarCell.tsx`

```typescript
import { useDroppable } from '@dnd-kit/core';

export function DroppableCalendarCell({ date, timeBlock }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${date}-${timeBlock}`,
    data: { date, timeBlock },
  });
  return (
    <div
      ref={setNodeRef}
      className={isOver ? 'bg-blue-100' : 'bg-gray-50'}
    >
      {/* 이벤트/작업 렌더링 */}
    </div>
  );
}
```

**체크리스트:**
- [ ] useDroppable 훅 사용
- [ ] isOver 상태로 hover 강조
- [ ] data 페이로드 (날짜, 시간)

#### 4.5 드래그 완료 로직
**파일**: `src/components/calendar/WeeklyCalendarGrid.tsx`

```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  
  if (!over) return; // 취소됨
  
  const taskId = parseInt(active.id.toString().split('-')[1]);
  const [date, timeBlock] = over.data?.current;
  
  // 팝업으로 시간 확인
  openTimeConfirmDialog({
    taskId,
    date,
    suggestedStartTime: timeBlock,
  });
};
```

**체크리스트:**
- [ ] active (드래그한 아이템) 파싱
- [ ] over (드롭 대상) 파싱
- [ ] 시간 확인 다이얼로그 표시

#### 4.6 시간 할당 확인 다이얼로그
**파일**: `src/components/calendar/TimeAssignmentDialog.tsx`

**UI:**
- "마케팅 이미지 제작 (예상 1시간)을 월요일 14:00에 배치하시겠습니까?"
- 시작 시간 선택 (기본값: 드롭 위치)
- 종료 시간 (자동 계산: 시작 + 예상 시간)
- "배치", "취소" 버튼

**체크리스트:**
- [ ] 시간 입력 UI (드롭다운 또는 시간선택)
- [ ] 예상 시간 표시
- [ ] "배치" 버튼 클릭 → API 호출

#### 4.7 API: 작업 할당
**엔드포인트**: `POST /api/task-assignments`

```typescript
// Request
{
  task_id: 123,
  assigned_date: "2026-07-07",
  start_time: 840, // 분 단위 (14:00)
  end_time: 900    // 15:00
}

// Response
{
  id: 456,
  task_id: 123,
  ...
}
```

**체크리스트:**
- [ ] 유효성 검사 (시간 범위, 중복 확인)
- [ ] TaskAssignmentRepository.create() 호출
- [ ] Task 상태 업데이트 ('assigned')
- [ ] 성공/실패 응답

#### 4.8 드래그 취소 & 실패 처리
**체크리스트:**
- [ ] ESC 키 → 드래그 취소
- [ ] 영역 외 drop → 취소
- [ ] 시간 겹침 검증 → 알림 표시
- [ ] 네트워크 오류 → 토스트 메시지

#### 4.9 드래그된 작업 즉시 표시
**체크리스트:**
- [ ] API 성공 후 캘린더 새로고침 (또는 optimistic update)
- [ ] 백로그에서 해당 작업 제거
- [ ] 캘린더 셀에 작업 카드 추가
- [ ] 부드러운 애니메이션 (옵션)

#### 4.10 성능 최적화
**체크리스트:**
- [ ] 대량 작업 처리 (100+ 작업 렌더링)
- [ ] Virtual scrolling (선택)
- [ ] 메모이제이션 (React.memo 사용)
- [ ] dnd-kit 성능 검증 (60fps 유지)

#### 4.11 모바일 터치 지원
**체크리스트:**
- [ ] dnd-kit TouchSensor 설치
- [ ] 터치 드래그 테스트
- [ ] 대안: 모바일에서는 버튼 기반 할당 (초기 버전)

#### 4.12 테스트
**체크리스트:**
- [ ] DraggableTaskCard.test.tsx
- [ ] DroppableCalendarCell.test.tsx
- [ ] TimeAssignmentDialog.test.tsx
- [ ] E2E: 드래그 → 할당 → 표시 (Playwright)

---

## 5. 통계 & 추가 기능 (Sprint 5: 1.5주)

### 목표
통계 대시보드, 검색/필터 완성, 빈/로딩/에러 상태

### 소요 시간
8~10일 (약 50시간)

### 세부 작업

#### 5.1 통계 페이지 (완성)
**경로**: `/stats`

**섹션 1: 주간 작업량**
- BarChart: 일별 배정 시간 (월~일)
- 데이터: task_assignments 기반 시간 합산

**섹션 2: 프로젝트별 시간**
- PieChart: 프로젝트별 시간 비율
- 테이블: 프로젝트, 시간, 완료율

**섹션 3: 완료율**
- 이번 주 완료 작업 수 / 전체
- ProgressBar

**섹션 4: 클라이언트별 청구 시간**
- 테이블: 클라이언트, 프로젝트, 시간, 단가, 청구액
- CSV 내보내기 버튼

**체크리스트:**
- [ ] Recharts 차트 구현
- [ ] 데이터 쿼리 (날짜 범위 필터)
- [ ] 기간 선택 (주/월/분기)
- [ ] 차트 레스폰시브 (모바일 최적화)

#### 5.2 검색 기능
**위치**: 캘린더 페이지 우측 상단

**동작:**
- 검색창에 입력
- 제목, 설명, 태그 텍스트 검색
- 작업 + 이벤트 모두 검색

**체크리스트:**
- [ ] 검색 입력 컴포넌트
- [ ] 실시간 검색 (디바운싱)
- [ ] 검색 결과 표시 (드롭다운 또는 필터 적용)
- [ ] 검색어 강조 표시

#### 5.3 필터 패널 (완성)
**위치**: 캘린더 페이지 우측

**필터:**
- [ ] 클라이언트 (체크박스)
- [ ] 상태 (라디오 또는 탭)
- [ ] 날짜 범위 (주/월)
- [ ] 우선순위 (체크박스)

**체크리스트:**
- [ ] 필터 상태 관리 (URL 쿼리 or Context)
- [ ] 필터 적용 (실시간 또는 "적용" 버튼)
- [ ] 필터 리셋 버튼
- [ ] 활성 필터 개수 표시

#### 5.4 빈 상태 화면들
**체크리스트:**
- [ ] 작업 없음 (Dashboard, Task List)
  - 이미지 + "첫 작업을 만들어보세요"
  - "+ 새 작업" 버튼
- [ ] 할당 없음 (백로그)
  - "모든 작업이 캘린더에 배정되었습니다! 🎉"
- [ ] 검색 결과 없음
  - "검색 결과가 없습니다. 다른 검색어를 시도해주세요."
- [ ] 데이터 로드 실패
  - 에러 아이콘 + "데이터를 불러올 수 없습니다."
  - "다시 시도" 버튼

#### 5.5 로딩 상태
**체크리스트:**
- [ ] Skeleton 로더 (캘린더, 차트)
- [ ] 로딩 스피너 (API 호출 중)
- [ ] 진행 상황 표시 (선택)

#### 5.6 에러 처리
**체크리스트:**
- [ ] API 오류 처리 (400, 500)
- [ ] 네트워크 오류
- [ ] 데이터베이스 오류
- [ ] 사용자 친화적 메시지

#### 5.7 설정 페이지 (완성)
**경로**: `/settings`

**섹션 1: 기본 설정**
- 사용자명
- 근무시간 (06:00~22:00)
- 시간 단위 (30분/1시간)

**섹션 2: 클라이언트/프로젝트 관리**
- 클라이언트 목록 (생성, 편집, 삭제)
- 색상 선택 (컬러 피커)
- 프로젝트 목록

**섹션 3: 백업 & 내보내기**
- "데이터 백업" 버튼 → JSON 다운로드
- "데이터 복원" 버튼 → JSON 업로드

**체크리스트:**
- [ ] 클라이언트 CRUD 폼
- [ ] 색상 피커 (Headless UI 또는 shadcn)
- [ ] 데이터 내보내기 (JSON)
- [ ] 데이터 복원 (JSON 파싱 + 삽입)

#### 5.8 다크 모드 전환
**체크리스트:**
- [ ] next-themes 통합 (Layout.tsx)
- [ ] 헤더에 토글 버튼
- [ ] 모든 컬러 다크 모드 지원
- [ ] localStorage 저장

#### 5.9 메타데이터 & SEO
**체크리스트:**
- [ ] 각 페이지 title 설정
- [ ] description (og:description)
- [ ] favicon 설정

#### 5.10 테스트
**체크리스트:**
- [ ] StatsPage.test.tsx (차트 렌더링)
- [ ] SearchBar.test.tsx (검색 기능)
- [ ] FilterPanel.test.tsx (필터 상태)

---

## 6. 마무리 & 최적화 (Sprint 6: 1주)

### 목표
성능 최적화, 버그 수정, 배포 준비

### 소요 시간
5일 (약 30시간)

### 세부 작업

#### 6.1 성능 프로파일링 & 최적화
**체크리스트:**
- [ ] Lighthouse 점수 측정 (Performance 85+)
- [ ] Bundle size 분석 (webpack-bundle-analyzer)
- [ ] 이미지 최적화 (next/image)
- [ ] 코드 분할 (dynamic import)
- [ ] 메모이제이션 검토

#### 6.2 E2E 테스트
**Playwright 시나리오:**

**TC-1: 완전한 워크플로우**
```typescript
test('작업 생성 → 할당 → 완료', async ({ page }) => {
  // 1. 캘린더 페이지 방문
  await page.goto('/calendar');
  
  // 2. "새 작업" 클릭 → 폼 입력
  await page.click('[data-testid="new-task-btn"]');
  await page.fill('[name="title"]', '마케팅 이미지 제작');
  await page.fill('[name="estimated_hours"]', '2');
  await page.click('[data-testid="save-task-btn"]');
  
  // 3. 작업이 백로그에 나타나는지 확인
  await expect(page.locator('[data-testid="backlog"]')).toContainText('마케팅 이미지 제작');
  
  // 4. 드래그 → 월요일 14:00 셀에 드롭
  const taskCard = page.locator('[data-task-id="123"]');
  const targetCell = page.locator('[data-cell-date="2026-07-07"][data-time="840"]');
  await taskCard.dragTo(targetCell);
  
  // 5. 시간 할당 다이얼로그 응답
  await page.click('[data-testid="confirm-assign-btn"]');
  
  // 6. 캘린더에 표시되는지 확인
  await expect(targetCell).toContainText('마케팅 이미지 제작');
  
  // 7. 작업 클릭 → 상태 변경 (진행중 → 완료)
  await page.click('[data-testid="task-card"]');
  await page.click('[data-testid="status-completed-btn"]');
  
  // 8. 대시보드에서 완료 수 증가 확인
  await page.goto('/');
  await expect(page.locator('[data-testid="completed-count"]')).toContainText('1');
});
```

**체크리스트:**
- [ ] E2E 테스트 작성 (5개 이상)
- [ ] 모바일 뷰 테스트
- [ ] 크로스 브라우저 테스트 (Chrome, Safari)

#### 6.3 접근성 감시
**체크리스트:**
- [ ] axe DevTools 검사
- [ ] 키보드 네비게이션 검증
- [ ] 화면 리더 테스트 (VoiceOver)
- [ ] 색상 대비 검증

#### 6.4 보안 감시
**체크리스트:**
- [ ] XSS 검증 (사용자 입력 sanitize)
- [ ] CSRF 토큰 (필요시)
- [ ] 환경변수 검증 (.env.local 사용)
- [ ] 의존성 감시 (npm audit)

#### 6.5 문서화
**파일:**
- [ ] README.md (설치, 사용법, 개발 가이드)
- [ ] CONTRIBUTING.md (기여 방법)
- [ ] API.md (API 엔드포인트 문서)
- [ ] ARCHITECTURE.md (시스템 아키텍처)

**체크리스트:**
- [ ] 설치 지침 (npm install, npm run dev)
- [ ] 초기 데이터 설정 (클라이언트/프로젝트)
- [ ] 배포 가이드 (Vercel)
- [ ] 개발자 가이드 (폴더 구조, 패턴)

#### 6.6 배포 준비
**체크리스트:**
- [ ] `.env.example` 생성
- [ ] build 성공 (`npm run build`)
- [ ] production 환경에서 테스트
- [ ] 데이터베이스 백업 계획

#### 6.7 버그 수정 & 리팩토링
**체크리스트:**
- [ ] 테스트 커버리지 80% 이상 달성
- [ ] 코드 리뷰 (자가 검토)
- [ ] 불필요한 console.log 제거
- [ ] 타입 안전성 (no any)

#### 6.8 최종 점검 체크리스트
**체크리스트:**
- [ ] 모든 Must-Have 기능 완성
- [ ] 모든 화면 구현
- [ ] 모든 API 엔드포인트 작동
- [ ] 테스트 80% 이상
- [ ] 문서 완성
- [ ] 성능 (Lighthouse 85+)
- [ ] 접근성 (WCAG 2.1 Level AA)
- [ ] 배포 준비

---

## 기술 주의사항

### Next.js 16 특성
- **await params**: Server Component에서 `const params = await props.params`로 접근
- **ESLint**: `next lint` 제거됨, eslint.config.mjs 직접 구성
- **Image Optimization**: next/image 사용 (Vercel 호스팅 시 자동)

### Drizzle ORM 패턴
- **Timestamp**: `integer({ mode: 'timestamp_ms' })` 사용 (Unix milliseconds)
- **Foreign Key**: `references(() => table.id, { onDelete: 'cascade' })`
- **Casting**: `sql<number>` 사용 (SUM, COUNT 등)

```typescript
// 예시: 프로젝트별 총 시간 계산
const result = await db
  .select({
    project_id: tasks.project_id,
    total_hours: sql<number>`SUM(${tasks.estimated_hours})`.as('total_hours'),
  })
  .from(tasks)
  .groupBy(tasks.project_id);
```

### BetterSQLite3 제네릭
```typescript
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

type Database = BetterSQLite3Database<typeof schema>;
```

### 드래그 앤 드롭 선택
- **dnd-kit** 권장:
  - 가볍고 현대적 (Drizzle, shadcn 같은 철학)
  - 성능 우수 (60fps)
  - Next.js 16 호환성 검증됨
- **react-beautiful-dnd** 대안:
  - 성숙함, 문서 풍부
  - 더 무거움 (번들 +30KB)
  - Framer Motion 의존

---

## 스프린트 요약

| Sprint | 목표 | 기간 | 완료 기준 |
|--------|------|------|----------|
| 0 | 프로젝트 초기화 | 1주 | npm run dev 성공, DB 생성 |
| 1 | DB & Repository | 1.5주 | CRUD API 모두 작동, 테스트 80% |
| 2 | UI & 대시보드 | 1.5주 | 대시보드 표시, 차트 렌더링 |
| 3 | 캘린더 & 작업 | 2주 | 캘린더 그리드, 작업 CRUD, 백로그 |
| 4 | 드래그 시간블로킹 | 2주 | 드래그 → 할당 → 표시 (E2E) |
| 5 | 통계 & 추가 기능 | 1.5주 | 통계 대시보드, 검색/필터, 에러처리 |
| 6 | 최적화 & 배포 준비 | 1주 | 성능 최적화, 전체 테스트, 문서 |

**총 기간:** 12주 (3개월, 1인 개발 기준)

---

**문서 끝**

**버전 히스토리**
- v1.0 (2026-07-02): 초안 완성, 6개 스프린트, 기술 주의사항 포함
