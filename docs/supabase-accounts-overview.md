# Supabase 계정 및 프로젝트 현황

> 작성일: 2026-03-31

---

## 계정 구조 요약

```
계정 1: sjowon@kakao.com
  └─ Org: sjowon@kakao.com's Org (ugwqvqdykqynzjossfve)
       ├─ sjowon's Project (mqbgyofqomsllnwgsjkn) - ap-southeast-2
       └─ workplatform (kkbrsdtztcvqtsulgcyi) - ap-northeast-1

계정 2: gerrardbak08
  └─ Org: Meslap church (tiflznakijclnovimvsj)
       └─ gerrardbak08's Project - PRODUCTION
```

---

## 계정 1: sjowon@kakao.com

### 프로젝트 1: sjowon's Project

| 항목 | 값 |
|------|-----|
| **ID** | mqbgyofqomsllnwgsjkn |
| **Region** | ap-southeast-2 (Sydney) |
| **생성일** | 2026-03-17 |
| **상태** | ACTIVE_HEALTHY |
| **DB 버전** | PostgreSQL 17.6 |
| **용도** | 업무관리 플랫폼 + 교회 데이터 (혼재) |

#### 테이블 목록 (39개)

| 카테고리 | 테이블 | 데이터 건수 | 용도 |
|----------|--------|:-----------:|------|
| **조직 관리** | | | |
| | Department | 1 | 부서 |
| | Team | 3 | 팀 |
| | UserTeam | 5 | 사용자-팀 매핑 |
| **사용자/인증** | | | |
| | User | 3 | 사용자 (Role: ADMIN/MANAGER/MEMBER/VIEWER) |
| | Account | 0 | OAuth 계정 |
| | Session | 0 | 세션 |
| | VerificationToken | 0 | 인증 토큰 |
| **업무 관리** | | | |
| | Task | 3 | 업무 (Status: TODO/IN_PROGRESS/IN_REVIEW/DONE/CANCELLED) |
| | TaskTag | 0 | 업무 태그 |
| | TaskView | 0 | 업무 조회 기록 |
| | TaskActivity | 4 | 업무 활동 로그 |
| **프로젝트** | | | |
| | Project | 1 | 프로젝트 (Status: PLANNING/ACTIVE/ON_HOLD/COMPLETED/ARCHIVED) |
| | ProjectMember | 3 | 프로젝트 멤버 |
| **문서/파일** | | | |
| | Document | 0 | 문서 |
| | Attachment | 5 | 첨부파일 |
| **법정 의무** | | | |
| | LegalObligation | 52 | 법정 의무사항 |
| **산업재해** | | | |
| | IndustrialAccident | 485 | 산업재해 기록 |
| | AccidentUpload | 2 | 산재 첨부파일 |
| | CustomerAccident | 0 | 고객 사고 |
| **매장 관리** | | | |
| | StoreMaster | 1,334 | 매장 마스터 데이터 |
| | StoreRiskProfile | 9 | 매장 위험 프로필 |
| **교육** | | | |
| | EducationRecord | 0 | 교육 이력 |
| | EducationUpload | 0 | 교육 첨부파일 |
| **인사 관리** | | | |
| | PersonalFile | 1 | 인사 파일 |
| | FileMemo | 0 | 파일 메모 |
| | MemberMemo | 0 | 멤버 메모 |
| | HealthCheckupRecord | 0 | 건강검진 기록 |
| | WorkAssignment | 0 | 업무 배정 |
| | MonthlyTask | 0 | 월간 업무 |
| **소통** | | | |
| | Comment | 0 | 댓글 |
| | Notification | 6 | 알림 |
| | Announcement | 1 | 공지사항 |
| | Meeting | 0 | 회의 |
| | MeetingAttendee | 0 | 회의 참석자 |
| | MeetingAgenda | 0 | 회의 안건 |
| **교회 (혼재)** | | | |
| | church_profiles | 12 | 교회 프로필 |
| | church_verses | 18 | 교회 말씀 |
| | church_progress | 31 | 교회 진행 현황 |
| | progress | 6 | 진행 상황 |

> 업무관리 플랫폼과 교회 관련 데이터가 **같은 프로젝트에 혼재**되어 있음

---

### 프로젝트 2: workplatform

| 항목 | 값 |
|------|-----|
| **ID** | kkbrsdtztcvqtsulgcyi |
| **Region** | ap-northeast-1 (Tokyo) |
| **생성일** | 2026-03-25 |
| **상태** | ACTIVE_HEALTHY |
| **DB 버전** | PostgreSQL 17.6 |
| **용도** | 업무 플랫폼 (초기 상태, 거의 비어있음) |

#### 테이블 목록 (13개)

| 카테고리 | 테이블 | 데이터 건수 | 용도 |
|----------|--------|:-----------:|------|
| **사용자/인증** | | | |
| | User | 1 | 사용자 (Role: ADMIN/MANAGER/MEMBER/VIEWER) |
| | Account | 0 | OAuth 계정 |
| | Session | 0 | 세션 |
| | VerificationToken | 0 | 인증 토큰 |
| **업무 관리** | | | |
| | Task | 0 | 업무 |
| | TaskTag | 0 | 업무 태그 |
| | Announcement | 0 | 공지사항 |
| **프로젝트** | | | |
| | Project | 0 | 프로젝트 |
| | ProjectMember | 0 | 프로젝트 멤버 |
| **문서** | | | |
| | Document | 0 | 문서 |
| **법정/준수** | | | |
| | LegalItem | 0 | 법적 항목 |
| | ComplianceRecord | 0 | 준수 기록 |
| **소통** | | | |
| | Comment | 0 | 댓글 |

> RLS 전체 활성화 상태. 데이터 거의 없음 (User 1건만 존재)

---

## 계정 2: gerrardbak08

### 프로젝트: gerrardbak08's Project

| 항목 | 값 |
|------|-----|
| **Org** | Meslap church (tiflznakijclnovimvsj) |
| **환경** | PRODUCTION |
| **상태** | ACTIVE |
| **용도** | 교회 앱 (예배, 진행 현황) |

#### 확인된 테이블 (Dashboard 스크린샷 기반)

| 테이블 | RLS | 비고 |
|--------|:---:|------|
| worship_records | X (경고) | 예배 기록 — RLS 미활성화 경고 |
| progress | X (경고) | 진행 현황 — RLS 미활성화 경고 |

> Security Advisor에서 **3개 에러** 감지:
> - worship_records: RLS 미활성화 + 정책 존재하나 RLS 꺼짐
> - progress: RLS 미활성화

---

## 문제점 및 권장사항

### 1. 데이터 혼재

| 문제 | 위치 | 설명 |
|------|------|------|
| 업무 + 교회 혼재 | sjowon's Project | church_profiles, church_verses, church_progress가 업무관리 테이블과 같은 DB에 존재 |

**권장**: 교회 관련 데이터는 Meslap church Org의 프로젝트로 분리

### 2. 프로젝트 정리 제안

| 프로젝트 | 현재 상태 | 권장 조치 |
|----------|-----------|-----------|
| sjowon's Project | 업무+교회 혼재 | 교회 테이블(church_*) 분리 후 업무 전용으로 유지 |
| workplatform | 거의 비어있음 | 사용 계획 없으면 정리 또는 활용 검토 |
| gerrardbak08's Project | 교회 앱 | 성경공부보고 프로젝트를 같은 Org에 신규 생성 권장 |

### 3. 성경공부보고 DB 연결 방안

| 방안 | 장점 | 단점 |
|------|------|------|
| **A. Meslap church Org에 새 프로젝트 생성 (권장)** | 교회 프로젝트 분리, 깔끔한 구조 | gerrardbak08 계정으로 직접 생성 필요 |
| B. workplatform 프로젝트 활용 | MCP 접근 가능, 빈 상태 | 교회 데이터가 sjowon 계정에 위치 |
| C. sjowon's Project에 추가 | 바로 사용 가능 | 기존 39개 테이블에 추가 혼재 |

---

## 무료 플랜 한도

| 계정 | Organization | 프로젝트 한도 | 사용 중 | 여유 |
|------|-------------|:------------:|:-------:|:----:|
| sjowon@kakao.com | sjowon's Org | 2 | 2 | **0** |
| gerrardbak08 | Meslap church | 2 | 1 | **1** |
