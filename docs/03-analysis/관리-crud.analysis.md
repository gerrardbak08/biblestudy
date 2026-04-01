# 관리-crud Gap Analysis Report

> **Analysis Type**: Gap Analysis (Plan vs Implementation)
> **Project**: 성경공부 관리 시스템
> **Analyst**: gap-detector
> **Date**: 2026-04-01
> **Plan Doc**: `docs/01-plan/features/관리-crud.plan.md`

---

## Executive Summary

| 항목 | 값 |
|------|-----|
| **Overall Match Rate** | **90%** (27/30 steps) |
| Chunk 1: Department CRUD | 100% (10/10) |
| Chunk 2: Leader Update/Delete | 100% (7/7) |
| Chunk 3: Curriculum CRUD | 73% (8/11) |
| Chunk 4: Integration | 100% (2/2) |

### Missing Items (3)
1. `updateLesson` server action — 레슨 수정 불가 (삭제 후 재생성만 가능)
2. `getSectionById` query — 단원 단독 조회 (과정 상세에서 트리 로드로 대체)
3. Section/Lesson inline edit UI — 수정 폼 미구현

### Value Delivered

| 관점 | 내용 |
|------|------|
| **Problem** | 부서/커리큘럼/리더 관리가 seed/직접 쿼리로만 가능 |
| **Solution** | 관리자 CRUD 12개 Server Action + 5개 새 페이지 |
| **Function UX Effect** | 웹 UI에서 부서/커리큘럼/리더 완전 관리 가능 |
| **Core Value** | 관리자 자립 운영 달성, seed 의존 제거 |
