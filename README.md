# 사랑과평안의교회 성경공부 보고 앱

성경공부 리더가 교육생별 진행 이력을 기록하고, 셀리더와 목회자가 전체 진행 현황을 모니터링하는 풀스택 웹앱입니다.

## 핵심 사용자

- 관리자/목회자: 전체 대시보드, 커리큘럼/보고서 모니터링
- 부서장/셀리더: 소속 부서 리더와 보고 현황 모니터링
- 성경공부 리더: 직접 회원가입, 교육생 등록, 주간 보고서 작성, 개인별 진도 확인

## 현재 구현 범위

- 로그인 및 역할 기반 라우팅
- 리더 자가 회원가입
- 가입 시 `1장년`, `2장년`, `청년부`, `중고등부` 중 소속 선택
- 가입 완료 후 리더 계정으로 자동 로그인
- 관리자, 부서장, 리더 대시보드
- 부서 CRUD
- 리더 생성, 수정, 삭제, 비밀번호 변경
- 교육생 등록, 수정, 삭제
- 주간 성경공부 보고서 작성, 수정, 삭제
- 보고서 상세 PDF 출력: 제목, 출력일, 확인 서명란 포함
- 기초 과정 28강 커리큘럼 seed
- 커리큘럼 과정/단원/레슨 관리
- 인도자별 교육생 진도 매트릭스
- 과정별 진행률, 부서별 현황, 주간/월별 보고 추이
- 보고서 CSV 내보내기

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

## 실행

```bash
cmd /c npm install
cmd /c npx prisma generate
cmd /c npm run dev
```

개발 서버 기본 주소는 `http://localhost:3000` 입니다.

## 빌드 검증

```bash
cmd /c npm run build
```

## Seed

```bash
cmd /c npx prisma db seed
```

Seed 계정:

- 관리자: `admin` / `admin1234`
- 부서장: `depthead1` / `dept1234`
- 리더: `leader1` / `leader1234`

## 주요 경로

- `/login`: 로그인
- `/signup`: 리더 자가 회원가입
- `/admin`: 관리자 대시보드
- `/admin/curriculum`: 커리큘럼 관리
- `/admin/reports`: 전체 보고서
- `/dept`: 부서장 대시보드
- `/leader`: 리더 대시보드
- `/leader/learners`: 교육생 관리
- `/leader/reports/new`: 보고서 작성
