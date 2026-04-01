# 관리 CRUD — Implementation Plan

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 부서/커리큘럼/리더 관리가 DB seed나 직접 쿼리로만 가능하여 관리자가 자립적으로 운영할 수 없음 |
| **Solution** | 관리자 전용 CRUD Server Actions + UI 페이지로 부서, 커리큘럼, 리더를 완전히 관리 가능하게 함 |
| **Function UX Effect** | 관리자가 웹 UI에서 부서 생성/수정/삭제, 커리큘럼 과정/단원/레슨 관리, 리더 정보 수정 및 계정 삭제 가능 |
| **Core Value** | 관리자 자립 운영 달성 — seed 의존 제거, 실시간 조직 구조 변경 가능 |

---

## Scope

### In Scope
1. **Department CRUD** — 부서 생성, 수정, 삭제
2. **Curriculum CRUD** — Course/Section/Lesson 생성, 수정, 삭제
3. **Leader Update/Delete** — 리더 정보 수정, 비밀번호 초기화, 계정 삭제

### Out of Scope
- 리더 역할 변경 (LEADER → DEPT_HEAD)
- 학습자 일괄 이관 (리더 변경 시)
- Email 알림

---

## Chunk 1: Department CRUD

### Task 1: Department Validation + Server Actions

**Files:**
- Modify: `lib/validations.ts`
- Create: `lib/actions/department.ts`

- [ ] **Step 1: Add departmentSchema to validations**
  ```typescript
  export const departmentSchema = z.object({
    name: z.string().min(1, "부서명을 입력해주세요").max(50, "부서명은 50자 이하여야 합니다"),
  });
  ```

- [ ] **Step 2: Create department server actions**
  - `createDepartment(formState, formData)` — ADMIN only, name uniqueness check
  - `updateDepartment(formState, formData)` — ADMIN only, idSchema + name uniqueness
  - `deleteDepartment(id)` — ADMIN only, idSchema + cascade check (소속 리더 있으면 거부)

### Task 2: Department Query Functions

**Files:**
- Create: `lib/queries/department-admin.ts`

- [ ] **Step 1: Create admin department queries**
  - `getAdminDepartments()` — 전체 부서 목록 + 소속 인원 수
  - `getDepartmentById(id)` — 단일 부서 (수정용)

### Task 3: Department UI Pages

**Files:**
- Create: `app/(dashboard)/admin/departments/page.tsx` — 목록 + 생성 폼
- Create: `app/(dashboard)/admin/departments/[id]/edit/page.tsx` — 수정 페이지
- Create: `components/forms/DepartmentForm.tsx` — 부서 생성/수정 폼

- [ ] **Step 1: Create DepartmentForm component**
  - mode: "create" | "edit"
  - useActionState integration
  - FieldError import from shared component

- [ ] **Step 2: Create departments list page**
  - Table: 부서명, 소속 리더 수, 소속 교육생 수
  - "부서 추가" 버튼
  - 수정/삭제 링크
  - EmptyState 컴포넌트

- [ ] **Step 3: Create department edit page**
  - BackLink + DepartmentForm (edit mode)
  - DeleteButton (소속 인원 있으면 경고)

- [ ] **Step 4: Add sidebar navigation**
  - admin sidebar에 "부서 관리" 링크 추가 (`/admin/departments`)

---

## Chunk 2: Leader Update/Delete

### Task 4: Leader Validation + Server Actions

**Files:**
- Modify: `lib/validations.ts`
- Modify: `lib/actions/leader.ts`

- [ ] **Step 1: Add updateLeaderSchema**
  ```typescript
  export const updateLeaderSchema = z.object({
    name: z.string().min(1).max(50),
    email: z.string().email(),
    phone: z.string().max(20).optional(),
    departmentId: z.string().optional(),
    role: z.enum(["LEADER", "DEPT_HEAD"]).optional(),
  });
  ```

- [ ] **Step 2: Add updateLeader server action**
  - ADMIN only, idSchema validation
  - Email uniqueness check (exclude self)
  - Update name, email, phone, departmentId, role

- [ ] **Step 3: Add deleteLeader server action**
  - ADMIN only, idSchema validation
  - Cascade check: 소속 학습자/보고서 존재 시 경고 후 삭제
  - Cannot delete self

- [ ] **Step 4: Add resetLeaderPassword server action**
  - ADMIN only, 임시 비밀번호 생성 → bcrypt hash → DB update
  - Return generated password to admin

### Task 5: Leader Edit UI

**Files:**
- Create: `app/(dashboard)/admin/leaders/[id]/edit/page.tsx`
- Create: `components/forms/EditLeaderForm.tsx`
- Modify: `app/(dashboard)/admin/leaders/page.tsx` — 수정 링크 추가

- [ ] **Step 1: Create EditLeaderForm**
  - Fields: name, email, phone, department (Select), role (Select)
  - useActionState + FieldError

- [ ] **Step 2: Create leader edit page**
  - BackLink + EditLeaderForm + DeleteButton + 비밀번호 초기화 버튼

- [ ] **Step 3: Update leaders list page**
  - 각 행에 "수정" 링크 추가 → `/admin/leaders/[id]/edit`

---

## Chunk 3: Curriculum Management

### Task 6: Curriculum Validation + Server Actions

**Files:**
- Modify: `lib/validations.ts`
- Create: `lib/actions/curriculum.ts`

- [ ] **Step 1: Add curriculum schemas**
  ```typescript
  export const courseSchema = z.object({
    name: z.string().min(1).max(100),
    level: z.string().min(1).max(20),
    order: z.coerce.number().int().min(0),
  });
  export const sectionSchema = z.object({
    code: z.string().min(1).max(20),
    name: z.string().min(1).max(100),
    order: z.coerce.number().int().min(0),
    courseId: z.string().min(1),
  });
  export const lessonSchema = z.object({
    code: z.string().min(1).max(20),
    name: z.string().min(1).max(100),
    order: z.coerce.number().int().min(0),
    sectionId: z.string().min(1),
  });
  ```

- [ ] **Step 2: Create curriculum server actions**
  - `createCourse`, `updateCourse`, `deleteCourse` — cascade to sections/lessons
  - `createSection`, `updateSection`, `deleteSection` — cascade to lessons
  - `createLesson`, `updateLesson`, `deleteLesson`
  - All ADMIN only + Zod validation

### Task 7: Curriculum Query Functions

**Files:**
- Create: `lib/queries/curriculum.ts`

- [ ] **Step 1: Create curriculum queries**
  - `getCurriculumTree()` — Courses with nested Sections and Lessons (전체 트리)
  - `getCourseById(id)` — 단일 과정 + sections
  - `getSectionById(id)` — 단일 단원 + lessons

### Task 8: Curriculum UI Pages

**Files:**
- Create: `app/(dashboard)/admin/curriculum/page.tsx` — 과정 목록
- Create: `app/(dashboard)/admin/curriculum/[courseId]/page.tsx` — 단원/레슨 트리
- Create: `components/forms/CourseForm.tsx`
- Create: `components/forms/SectionForm.tsx`
- Create: `components/forms/LessonForm.tsx`

- [ ] **Step 1: Create form components**
  - CourseForm: name, level, order
  - SectionForm: code, name, order (courseId hidden)
  - LessonForm: code, name, order (sectionId hidden)

- [ ] **Step 2: Create curriculum list page**
  - Card per course: name, level, section count, lesson count
  - "과정 추가" 버튼 + 인라인 폼 (모달 대신)
  - 수정/삭제 액션

- [ ] **Step 3: Create course detail page**
  - Sections 아코디언 / 접기
  - 각 Section 내 Lesson 목록
  - Section 추가/수정/삭제
  - Lesson 추가/수정/삭제

- [ ] **Step 4: Add sidebar navigation**
  - admin sidebar에 "커리큘럼" 링크 추가 (`/admin/curriculum`)

---

## Chunk 4: Integration & Verification

### Task 9: Loading States + EmptyState

- [ ] **Step 1: Add loading.tsx for new routes**
  - `app/(dashboard)/admin/departments/loading.tsx`
  - `app/(dashboard)/admin/curriculum/loading.tsx`

- [ ] **Step 2: Add EmptyState to all new list pages**

### Task 10: Build Verification

- [ ] **Step 1: TypeScript type check** — `npx tsc --noEmit`
- [ ] **Step 2: Build check** — `npm run build`

---

## Implementation Order

```
Task 1 (Dept validation+actions)
  → Task 2 (Dept queries)
    → Task 3 (Dept UI)
      → Task 4 (Leader validation+actions)
        → Task 5 (Leader edit UI)
          → Task 6 (Curriculum validation+actions)
            → Task 7 (Curriculum queries)
              → Task 8 (Curriculum UI)
                → Task 9 (Loading/Empty)
                  → Task 10 (Build verify)
```

## File Summary

| Action | Count | Files |
|--------|-------|-------|
| Create | 14 | actions/department.ts, actions/curriculum.ts, queries/department-admin.ts, queries/curriculum.ts, 4 pages, 5 form components, 2 loading.tsx |
| Modify | 4 | validations.ts, actions/leader.ts, admin/leaders/page.tsx, Sidebar.tsx |
| Total | 18 | |

## Estimated Steps: 28 (10 Tasks)
