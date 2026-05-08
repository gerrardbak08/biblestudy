# Claude Code 인계 문서

이 문서는 Claude Code가 사랑과평안의교회 성경공부 보고 앱을 이어서 개선할 수 있도록 현재 상태, 구조, 배포 방식, 우선 개선 과제를 정리한 문서다.

## 프로젝트 개요

- 서비스명: 사랑과평안의교회 성경공부 관리현황
- 목적: 성경공부 리더가 교육생별 진행 이력과 주간 보고서를 기록하고, 관리자/셀리더/목회자가 전체 진행 현황을 모니터링한다.
- 운영 URL: https://biblestudy-web-production.up.railway.app
- GitHub 저장소: https://github.com/gerrardbak08/biblestudy
- 배포 플랫폼: Railway
- DB: Railway PostgreSQL
- Supabase: 사용하지 않음

## 기술 스택

- Next.js App Router
- TypeScript
- Prisma
- PostgreSQL
- NextAuth Credentials
- Tailwind CSS
- shadcn 스타일 UI 컴포넌트
- Recharts
- Zod

## 현재 구현된 주요 기능

- 로그인 / 역할 기반 라우팅
- 리더 자가 회원가입
- 회원가입 시 소속 드롭다운:
  - 1장년
  - 2장년
  - 청년부
  - 중고등부
- 회원가입 후 리더 계정 자동 로그인
- 관리자 대시보드
- 부서장/셀리더 대시보드
- 리더 대시보드
- 부서 관리
- 리더 계정 관리
- 교육생 관리
- 주간 성경공부 보고서 작성/수정/삭제
- 보고서 상세 PDF 출력
- 커리큘럼 관리
- 기초 과정 seed
- 진행률/부서별/주간 보고 통계
- 보고서 CSV 내보내기
- OG 썸네일/메타데이터
- 앱 아이콘

## 역할 구조

Prisma enum `Role`:

- `ADMIN`: 전체 관리자
- `DEPT_HEAD`: 부서장/셀리더
- `LEADER`: 성경공부 리더

주요 라우트:

- `/login`: 로그인
- `/signup`: 리더 자가 회원가입
- `/admin`: 관리자 대시보드
- `/dept`: 부서장 대시보드
- `/leader`: 리더 대시보드
- `/settings`: 비밀번호 변경

## 중요 파일

- `app/layout.tsx`
  - 전역 metadata, OG, Twitter card, icon 설정
- `middleware.ts`
  - 인증/역할 기반 라우팅
  - public 정적 파일은 미들웨어 우회하도록 설정되어 있음
- `lib/auth.ts`
  - NextAuth 설정
- `lib/actions/auth.ts`
  - 로그인, 회원가입, 비밀번호 변경
- `lib/constants.ts`
  - 회원가입 소속 옵션
- `prisma/schema.prisma`
  - DB schema
- `prisma/seed.ts`
  - 초기 데이터
- `public/og-image-v2.png`
  - 현재 OG 썸네일
- `public/icon-v2.png`
  - 현재 앱 아이콘

## 배포 상태

Railway 프로젝트:

- Project: `biblestudy`
- Service: `biblestudy-web`
- Database: `Postgres`
- Branch: `main`

Railway 서비스는 GitHub repository source에 연결되어 있다. 다만 CLI/웹훅 반응이 늦거나 꼬일 수 있으므로 긴급 배포 시 아래 명령으로 직접 배포할 수 있다.

```bash
cmd /c npx @railway/cli up -s biblestudy-web --ci --message "deploy message"
```

운영 DB 스키마 반영:

```bash
cmd /c npx @railway/cli run -s biblestudy-web -- npx prisma db push
```

운영 DB seed:

```bash
cmd /c npx @railway/cli run -s biblestudy-web -- npx prisma db seed
```

주의: 운영 중 seed 재실행은 샘플 계정/샘플 데이터 중복 또는 갱신 영향을 줄 수 있으므로 신중히 실행한다.

## 환경변수

운영 서비스에 필요한 변수:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

주의:

- `.env`는 Git에 올리지 않는다.
- Railway DB URL, Auth secret 등 민감 값은 문서에 기록하지 않는다.
- Supabase 관련 환경변수는 사용하지 않는다.

## 현재 OG/썸네일 상태

현재 메타태그는 다음 파일을 바라본다.

- OG image: `/og-image-v2.png`
- Twitter image: `/og-image-v2.png`
- icon: `/icon-v2.png`
- apple touch icon: `/apple-touch-icon-v2.png`

검증 명령:

```bash
Invoke-WebRequest -Uri 'https://biblestudy-web-production.up.railway.app/og-image-v2.png' -UseBasicParsing
Invoke-WebRequest -Uri 'https://biblestudy-web-production.up.railway.app/login' -UseBasicParsing
```

기대값:

- OG image 응답 Content-Type: `image/png`
- HTML head에 `og:image`, `twitter:image`, `og:title`, `og:description` 존재

## 현재 알려진 주의점

- Next.js가 `middleware.ts` 대신 `proxy` 파일 convention을 권장한다는 경고가 있다.
- Prisma 7에서 `package.json#prisma` 설정이 deprecated될 예정이라는 경고가 있다.
- `npm audit`에서 취약점 경고가 있다. 운영 영향 확인 후 dependency 업데이트 필요.
- 운영 URL이 공개되어 있으므로 초기 관리자/테스트 계정 비밀번호는 반드시 변경하거나 제거해야 한다.
- GitHub 자동 배포는 연결되어 있으나, Railway CLI 직접 배포가 더 확실했던 이력이 있다.
- 로그인/회원가입 화면은 모바일 중심 레이아웃이라 PC 화면에서 더 개선 여지가 있다.

## 최우선 개선 과제

### 1. 운영 보안 정리

목표:

- 공개 운영 환경에서 seed 계정과 기본 비밀번호 노출 위험을 줄인다.

작업:

- 관리자 비밀번호 변경 UX 확인
- 운영 seed 계정 제거 또는 비활성화 기능 검토
- `seed.ts`를 개발용/운영용으로 분리
- 리더 자가 회원가입 정책 검토
  - 누구나 가입 가능하게 둘지
  - 초대코드/승인제/관리자 승인 중 무엇을 둘지 결정

추천 구현:

- `User.status` 또는 `approvedAt` 추가
- 신규 리더는 가입 후 `PENDING`
- 관리자 승인 후 로그인 가능

### 2. PC 로그인/회원가입 화면 개선

현재 문제:

- 데스크톱에서 중앙 카드만 보이는 구조라 공간 활용이 약하다.
- 관리 시스템다운 신뢰감과 사용 맥락이 부족하다.

추천 방향:

- 1024px 이상에서 2-column 레이아웃
- 왼쪽: 서비스명, 핵심 지표형 미리보기, 사용 목적
- 오른쪽: 로그인/회원가입 폼
- 모바일은 현재처럼 단일 컬럼 유지

주의:

- 과한 랜딩페이지처럼 만들지 말 것
- 실제 업무 도구 느낌 유지
- 카드 안에 카드 중첩하지 말 것
- 버튼/입력 높이와 텍스트 overflow 확인

대상 파일:

- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/signup/SignupForm.tsx`

### 3. 관리자용 DB/운영 관리 화면

목표:

- Railway/Prisma Studio 없이 앱 안에서 운영 데이터를 안전하게 관리한다.

추천 기능:

- 데이터 백업 CSV 다운로드
- 보고서 전체 export
- 교육생/리더 검색
- 최근 가입 리더 승인/비활성화
- 위험 작업 confirmation
- 운영 상태 카드
  - 전체 리더 수
  - 전체 교육생 수
  - 이번 주 보고 수
  - 미보고 리더 수

### 4. 보고서 승인/피드백 흐름

목표:

- 리더가 제출한 보고서를 셀리더/목회자가 확인하고 피드백한다.

추천 schema:

- `StudyReport.status`
  - `DRAFT`
  - `SUBMITTED`
  - `REVIEWED`
  - `RETURNED`
- `StudyReport.reviewedAt`
- `StudyReport.reviewedById`
- `StudyReport.feedback`

UX:

- 리더: 제출 전 수정 가능
- 부서장/관리자: 검토, 반려, 피드백
- 대시보드: 미검토 보고서 표시

### 5. 수료/진도 관리 강화

목표:

- 교육생이 어느 과정 어디까지 왔는지 더 명확히 관리한다.

추천 기능:

- 교육생별 과정 상태
  - 진행중
  - 수료
  - 중단
  - 보류
- 수료일
- 수료증 PDF
- 다음 과정 추천
- 교육생 상세 타임라인

### 6. 알림 기능

목표:

- 미보고/장기 미진행을 자동으로 드러낸다.

추천 단계:

1. 앱 내부 알림
2. 이메일 알림
3. 카카오톡/문자 연동 검토

알림 조건 예시:

- 이번 주 보고 미제출
- 2주 이상 진행 없음
- 신규 리더 승인 대기
- 반려 보고서 수정 필요

### 7. 검색/필터/정렬 강화

대상:

- 관리자 리더 목록
- 교육생 목록
- 보고서 목록
- 부서별 진행 현황

추천 필터:

- 부서
- 리더
- 교육생
- 과정
- 진행 상태
- 보고 주차
- 미보고 여부

### 8. 통계 대시보드 개선

추천 지표:

- 이번 주 보고율
- 부서별 평균 진도
- 과정별 수료율
- 리더별 담당 교육생 수
- 장기 미보고 리더
- 장기 미진행 교육생
- 월별 보고 추이

시각화:

- 막대그래프
- 라인차트
- 진행률 매트릭스
- 부서 비교 테이블

주의:

- 목회자/관리자가 빠르게 스캔할 수 있게 숫자와 표 중심으로 구성한다.
- 장식성 카드 남발 금지.

### 9. PDF 출력 개선

현재:

- 보고서 상세 PDF 출력 가능

개선:

- 월간 보고서 PDF
- 부서별 종합 PDF
- 교육생별 이력 PDF
- 수료증 PDF
- 인쇄 전용 레이아웃 QA

### 10. 코드/인프라 정리

추천:

- `middleware.ts`를 Next.js 권장 `proxy` convention으로 이전 검토
- Prisma config 파일로 이전
- dependency audit 검토
- 테스트 추가
  - auth action
  - signup flow
  - role routing
  - report creation
- E2E smoke test 추가
  - login
  - signup
  - admin dashboard
  - report create

## Claude Code 작업 원칙

- 기존 디자인 톤을 유지한다.
- Supabase를 다시 추가하지 않는다.
- DB schema 변경 시 Prisma schema, 관련 action, seed, UI를 함께 갱신한다.
- 운영 DB에 직접 seed 재실행하지 않는다.
- 민감한 환경변수는 출력하거나 커밋하지 않는다.
- 변경 후 최소 검증:

```bash
cmd /c npm run build
```

- 운영 반영이 필요하면:

```bash
git push origin HEAD:main
cmd /c npx @railway/cli up -s biblestudy-web --ci --message "..."
```

## 추천 작업 순서

1. 운영 보안 정리
2. PC 로그인/회원가입 화면 개선
3. 리더 가입 승인제 또는 초대코드
4. 관리자 운영 관리 화면
5. 보고서 승인/피드백
6. 교육생별 수료/이력 강화
7. 통계 대시보드 고도화
8. 알림 기능
9. PDF 출력 확장
10. 테스트/인프라 정리

## 현재 완료 커밋 기준

최근 주요 커밋:

- `chore: remove text mark from preview assets`
- `fix: allow public metadata assets`
- `feat: add social preview metadata`
- `chore: remove supabase dependency`

Claude Code는 GitHub `main` 기준 최신 상태에서 작업하면 된다.
