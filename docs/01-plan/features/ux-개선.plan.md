# UX 개선 — Planning Document

> **Summary**: 3개 역할(관리자/기관장/리더)의 사용 패턴 분석 기반 UX 개선 계획
>
> **Project**: 교회 성경공부 관리 플랫폼
> **Version**: 1.0
> **Author**: PM Agent
> **Date**: 2026-04-02
> **Status**: Draft

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 리더(모바일)는 보고서 제출에 단계가 많고, 관리자(PC)는 시각적 피드백이 부족하며, 기관장은 부서 현황을 한눈에 파악하기 어렵다 |
| **Solution** | 역할별 핵심 플로우를 단축(리더 보고서 탭 1단계 → 제출), 관리자 대시보드에 액션 가능한 알림 추가, 기관장 뷰에 미제출 리더 강조 표시 |
| **Function/UX Effect** | 리더 보고서 제출 탭 수 3→1 감소, 관리자 주간 미제출 현황 즉시 파악, 기관장 부서 리더별 제출 상태 한눈에 확인 |
| **Core Value** | 각 역할이 플랫폼을 "열어야 하는 이유"를 느끼도록 — 리더는 빠른 제출, 관리자는 현황 파악, 기관장은 부서 관리 자신감 |

---

## 1. Overview

### 1.1 Purpose

현재 구현된 기능은 기술적으로 완성되어 있으나 사용자 관점의 마찰(friction)이 존재한다. 특히 매주 반복적으로 보고서를 제출하는 리더와, 기술에 익숙하지 않은 50-60대 관리자 목회자를 위한 UX 최적화가 필요하다.

### 1.2 Background

- 리더(20-40대): 스마트폰으로 교회/출퇴근 중 빠르게 보고서 제출. 현재 보고서 폼은 12개 필드(커리큘럼 3단계 선택 포함)로 인지 부하가 높다.
- 관리자(50-60대 목회자): PC 사용, 기술 비숙련. 통계 카드 4개와 차트 2개가 있으나 "지금 당장 뭘 해야 하는지" 안내가 없다.
- 기관장(40-50대): 부서 보고서 목록이 단순 리스트여서 미제출 리더를 찾으려면 스크롤이 필요하다.

### 1.3 Related Documents

- 기존 플랜: `docs/01-plan/features/관리-crud.plan.md`
- 분석 보고서: `docs/03-analysis/성경공부보고.analysis.md`

---

## 2. Scope

### 2.1 In Scope

- [ ] **리더 보고서 제출 플로우 간소화** — 커리큘럼 선택 선택적(Optional) 처리, 기본값 기억
- [ ] **리더 대시보드 CTA 강화** — "이번 주 미제출 교육생 N명" 배지 + 원클릭 이동
- [ ] **관리자 대시보드 미제출 알림** — 이번 주 미제출 리더 목록 카드 추가
- [ ] **관리자 큰 글씨/고대비 모드** — 폰트 크기 옵션 or 접근성 개선
- [ ] **기관장 리더 목록 제출 상태 배지** — 제출완료/미제출 상태 인라인 표시
- [ ] **모바일 보고서 폼 필드 우선순위 재배치** — 필수 필드 상단 집중, 선택 필드 접기(Collapse)

### 2.2 Out of Scope

- PWA/앱 알림(Push notification) — 별도 기능으로 분리
- 다크 모드 구현 — 이미 shadcn 기반으로 가능하나 이번 스코프 외
- 보고서 일괄 제출(batch submit) — 데이터 모델 변경 필요
- 커리큘럼 구조 변경

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | 요구사항 | Priority | 대상 역할 | Status |
|----|----------|----------|-----------|--------|
| FR-01 | 리더 보고서 폼에서 커리큘럼 선택(과정→단원→레슨) 섹션을 접을 수 있게 처리 | Must | 리더 | Pending |
| FR-02 | WeeklyProgress 컴포넌트에서 미제출 교육생 수를 강조하고 "보고서 작성" 버튼 직접 연결 | Must | 리더 | Pending |
| FR-03 | 관리자 대시보드에 "이번 주 미제출 리더" 카드 추가 (이름 + 클릭 시 보고서 필터) | Must | 관리자 | Pending |
| FR-04 | 기관장 리더 목록(/dept/leaders)에 이번 주 제출 여부 배지 인라인 표시 | Should | 기관장 | Pending |
| FR-05 | 관리자 페이지 전반 body 폰트 크기 옵션(기본/크게) — 설정에서 토글 | Could | 관리자 | Pending |
| FR-06 | 보고서 폼 모바일에서 선택 필드(평가, 다음계획) 기본 접힘 처리 | Should | 리더 | Pending |
| FR-07 | 리더 마지막 제출 레슨을 localStorage에 기억해 다음 제출 시 기본값으로 제안 | Could | 리더 | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | 측정 방법 |
|----------|----------|-----------|
| 모바일 성능 | 보고서 폼 인터랙션 1초 이내 반응 | Chrome DevTools LCP |
| 접근성 | 버튼 최소 tap target 44x44px 유지 | 기존 BottomNav 기준 준수 |
| 폼 안정성 | 기존 Server Action 로직 변경 없이 UI 레이어만 수정 | TypeScript build 통과 |

---

## 4. 핵심 사용 시나리오 분석

### 4.1 리더 — 주간 보고서 제출 (Top 1 시나리오)

**현재 플로우:**
1. 로그인 → 대시보드
2. BottomNav "보고서" 탭
3. "보고서 제출" 버튼
4. 폼 로드 — 교육생 선택 → 날짜 → 출석 → **과정 선택 → 단원 선택 → 레슨 선택** → 공부내용 → 진행상태 → 평가 3개 → 메모 → 다음계획
5. 제출

**불편한 점:**
- 커리큘럼 3단계 선택이 매주 반복됨 (교육생마다 커리큘럼이 고정됨에도)
- 필수/선택 필드 구분 없이 나열되어 스크롤이 길다
- 폼 최상단에 교육생 선택이 있는데, 교육생이 1명이면 선택 불필요

**개선 방향:** FR-01, FR-02, FR-06, FR-07

### 4.2 관리자 — 주간 현황 파악 (Top 1 시나리오)

**현재 플로우:**
1. 로그인 → 관리자 대시보드
2. 4개 통계 카드 확인 (전체 수치, 변화 없음)
3. 주간 차트 확인 — 어떤 리더가 안 냈는지 불명확
4. 리더 목록 → 개별 확인 필요

**불편한 점:**
- 차트는 있지만 "지금 행동해야 할 것"이 안 보임
- 50-60대에게 bar chart가 직관적이지 않을 수 있음
- "미제출 리더" 파악이 리더 목록 + 수동 대조 필요

**개선 방향:** FR-03, FR-05

### 4.3 기관장 — 부서 리더 모니터링 (Top 1 시나리오)

**현재 플로우:**
1. 로그인 → 기관장 대시보드
2. /dept/leaders 이동 → 리더 목록 (이름, 교육생 수)
3. /dept/reports 이동 → 보고서 목록 스크롤

**불편한 점:**
- 리더 목록에서 이번 주 제출 여부를 알 수 없음
- 별도 탭 이동 없이 "이번 주 미제출 리더" 파악 불가

**개선 방향:** FR-04

---

## 5. 생략 가능한 기능 (Won't / Could 재검토)

| 기능 | 현재 상태 | 판단 | 근거 |
|------|-----------|------|------|
| 평가 3개 항목(이해도/참여도/돌봄) | 구현됨 | Could → 접기 권장 | 매주 입력하기 번거롭고 활용 데이터 부재 |
| "다음 계획" 텍스트 필드 | 구현됨 | Could → 선택적 접기 | 리더 부담, 실제 활용 여부 불명 |
| 진행 상태(진행중/완료/중단/보류) | 구현됨 | Should 유지 | 기관장/관리자 필터링에 활용 가능 |
| 부서별 비교 차트 (DeptComparisonChart) | 구현됨 | Should 유지 | 관리자에게 부서간 비교 유용 |
| CSV 내보내기 | 구현됨 | Should 유지 | 관리자 월말 보고용 활용 가능 |
| 보고서 상세 페이지 (/reports/[id]) | 구현됨 | Should 유지 | 기관장 개별 보고서 조회 필요 |

---

## 6. 데이터 시각화 분석

### 현재 차트 유용성

| 차트 | 대상 | 유용성 | 개선 제안 |
|------|------|--------|-----------|
| WeeklyReportChart (주간 제출 현황 bar) | 관리자 | 중간 — 추세는 보이나 누가 안 냈는지 모름 | 미제출 리더 이름 tooltip 추가 |
| DeptComparisonChart (부서별 현황) | 관리자 | 높음 — 부서간 비교 직관적 | 유지 |

### 추가로 필요한 시각화

| 시각화 | 대상 | 필요 이유 |
|--------|------|-----------|
| 이번 주 미제출 리더 리스트 카드 | 관리자 | "지금 연락해야 할 리더" 액션 가이드 |
| 교육생별 출석률 mini bar | 리더 대시보드 | WeeklyProgress에 출석 추세 한 줄 표시 |

---

## 7. Success Criteria

### 7.1 Definition of Done

- [ ] FR-01~FR-04 구현 완료
- [ ] 기존 Server Action 로직 무수정 (UI 레이어만 변경)
- [ ] TypeScript build 통과 (`npx tsc --noEmit`)
- [ ] 모바일 Chrome에서 보고서 폼 스크롤 없이 필수 필드 완성 가능

### 7.2 Quality Criteria

- [ ] BottomNav 탭 접근성 44px 유지
- [ ] Zero lint errors
- [ ] Build succeeds

---

## 8. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 커리큘럼 섹션 접기 시 lessonId 미전송으로 validation 오류 | High | Medium | 접힐 때 lessonId hidden input 값 비워서 "선택 안 함" 처리 — 기존 옵셔널 로직 활용 |
| localStorage 기반 마지막 레슨 기억 — 교육생 변경 시 오염 | Medium | Low | learnerId를 key로 per-learner 저장 |
| 관리자 미제출 카드 쿼리 성능 | Low | Low | 기존 getAdminDashboardData에 weekly summary 추가, 별도 쿼리 1회 |
| 폰트 크기 옵션(FR-05) 복잡도 | Medium | Medium | Could 우선순위 — 첫 이터레이션에서 제외 가능 |

---

## 9. Architecture Considerations

### 9.1 Project Level

현재 프로젝트: **Dynamic** (Next.js App Router + Prisma/PostgreSQL, Server Actions 패턴)

### 9.2 변경 범위

| 레이어 | 변경 내용 | 파일 |
|--------|-----------|------|
| UI 컴포넌트 | ReportForm 필드 접기(Collapsible) 추가 | `components/forms/ReportForm.tsx` |
| UI 컴포넌트 | WeeklyProgress CTA 버튼 강화 | `components/dashboard/WeeklyProgress.tsx` |
| 페이지 | 관리자 대시보드 미제출 카드 추가 | `app/(dashboard)/admin/page.tsx` |
| 쿼리 | 관리자 미제출 리더 주간 쿼리 | `lib/queries/admin.ts` |
| 페이지 | 기관장 리더 목록 제출 배지 | `app/(dashboard)/dept/leaders/page.tsx` |

**Server Action 변경 없음** — 모든 변경은 UI/쿼리 레이어.

---

## 10. Next Steps

1. [ ] CTO 검토 및 Plan 승인
2. [ ] Design 문서 작성 (`/pdca design ux-개선`)
3. [ ] FR-01, FR-02, FR-03, FR-04 순으로 구현 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-02 | Initial draft — 사용자 UX 분석 기반 | PM Agent |
