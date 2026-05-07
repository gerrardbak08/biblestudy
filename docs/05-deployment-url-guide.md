# URL 배포 가이드

이 앱은 Next.js App Router, Prisma, PostgreSQL/Supabase, Auth.js 기반의 풀스택 앱이다. 정적 사이트 배포가 아니라 Node.js 서버 실행을 지원하는 플랫폼을 사용해야 한다.

## 추천 배포처

### 1. Railway

가장 추천한다. Next.js와 Postgres를 같은 프로젝트에서 관리하기 쉽고, 배포 후 `Generate Domain`으로 공개 URL을 바로 만들 수 있다.

절차:

1. GitHub 저장소를 최신 상태로 push한다.
2. Railway에서 `New Project`를 만든다.
3. `Deploy from GitHub repo`를 선택한다.
4. 이 저장소를 연결한다.
5. 서비스 Variables에 필수 환경변수를 추가한다.
6. 배포가 끝나면 서비스의 `Settings > Networking`에서 `Generate Domain`을 누른다.

Build/Start:

```bash
npm install
npm run build
npm run start
```

### 2. Render

Render도 가능하다. Web Service로 배포하고 `*.onrender.com` URL을 받을 수 있다.

설정:

- Service Type: `Web Service`
- Runtime: `Node`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

## 필수 환경변수

배포 플랫폼의 Environment Variables에 아래 값을 넣는다. `.env` 파일은 Git에 올리지 않는다.

```text
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
AUTH_SECRET
```

주의:

- `AUTH_SECRET`은 최소 32자 이상의 안전한 랜덤 문자열을 사용한다.
- `NEXTAUTH_URL=http://localhost:3000`은 배포 환경에 넣지 않는다.
- 꼭 URL 변수를 넣어야 한다면 실제 배포 URL로 설정한다.
- 현재 `lib/auth.ts`에는 `trustHost: true`가 설정되어 있어, 일반적인 Railway/Render 배포에서는 요청 host를 신뢰하도록 동작한다.

## DB 스키마

배포 전에 운영 DB에 Prisma 스키마가 반영되어 있어야 한다.

현재 프로젝트에는 Prisma migrations 폴더가 없으므로, 초기 배포 전에는 아래 중 하나를 선택한다.

1. Supabase SQL Editor에서 필요한 SQL을 적용한다.
2. 로컬에서 운영 DB 환경변수를 바라보게 한 뒤 `npx prisma db push`를 실행한다.

운영 DB가 비어 있다면 seed를 실행해 기본 부서/과정/테스트 계정을 넣을 수 있다.

```bash
npx prisma db seed
```

운영에 테스트 계정을 남기고 싶지 않다면 seed 실행 후 테스트 계정을 삭제하거나, seed 파일을 운영용으로 분리한다.

## URL 배포 후 확인

1. 배포 URL 접속
2. `/signup`에서 리더 자가 회원가입
3. 가입 직후 자동 로그인 확인
4. `/leader/learners`에서 교육생 등록
5. `/leader/reports/new`에서 보고서 작성
6. 관리자 계정으로 `/admin` 대시보드 확인
7. 보고서 상세에서 `PDF 출력` 확인

## 참고 공식 문서

- Railway Next.js + Postgres: https://docs.railway.com/guides/nextjs
- Render Next.js: https://render.com/docs/deploy-nextjs-app
- Auth.js Deployment: https://authjs.dev/getting-started/deployment
- Next.js Environment Variables: https://nextjs.org/docs/app/guides/environment-variables

