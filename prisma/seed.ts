// prisma/seed.ts
// Seeds departments, curriculum (courses/sections/lessons), and test accounts
// Run with: npx prisma db seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ──────────────────────────────────────
// Curriculum data — 2 courses, 15 sections, 88 lessons
// ──────────────────────────────────────

const curriculumData = [
  {
    name: "교인등록 과정",
    level: "기초",
    order: 1,
    sections: [
      {
        code: "1",
        name: "회개하고 복음을 믿으라",
        order: 1,
        lessons: [
          { code: "1-01", name: "나는 누구인가", order: 1 },
          { code: "1-02", name: "일그러진 하나님의 형상", order: 2 },
          { code: "1-03", name: "죄의 소원", order: 3 },
          { code: "1-04", name: "공의의 하나님", order: 4 },
          { code: "1-05", name: "죄의 보응", order: 5 },
          { code: "1-06", name: "예수님의 피", order: 6 },
          { code: "1-07", name: "신앙고백", order: 7 },
        ],
      },
      {
        code: "2",
        name: "우리는 무엇을 믿는가",
        order: 2,
        lessons: [
          { code: "2-01", name: "성부 하나님", order: 1 },
          { code: "2-02", name: "삼위일체 하나님", order: 2 },
          { code: "2-03", name: "성자 하나님 1", order: 3 },
          { code: "2-04", name: "성자 하나님 2 (예수님의 사역)", order: 4 },
          { code: "2-05", name: "성령 하나님 1 (성령님은 누구신가)", order: 5 },
          { code: "2-06", name: "성령 하나님 2", order: 6 },
          { code: "2-07", name: "교회 1 (교회란 무엇인가)", order: 7 },
          { code: "2-08", name: "교회 2", order: 8 },
          { code: "2-09", name: "성도 1 (죄사함.구속.속량)", order: 9 },
          { code: "2-10", name: "성도 2 (믿지 않는 자의 부활)", order: 10 },
          { code: "2-11", name: "성도 3 (믿는 자의 부활과 영생)", order: 11 },
        ],
      },
      {
        code: "3",
        name: "하나님이 기뻐하시는 교회 생활",
        order: 3,
        lessons: [
          { code: "3-01", name: "신앙고백과 교회", order: 1 },
          { code: "3-02", name: "교회는 하나님의 신적기관", order: 2 },
          { code: "3-03", name: "이 땅에 교회를 세우신 목적", order: 3 },
          { code: "3-04", name: "성령충만한 교회", order: 4 },
          { code: "3-05", name: "교회는 예배하는 공동체이다", order: 5 },
          { code: "3-06", name: "교회는 전도하는 공동체이다", order: 6 },
          { code: "3-07", name: "교회는 교제하는 공동체이다", order: 7 },
          { code: "3-08", name: "교회는 성숙하는 공동체이다", order: 8 },
          { code: "3-09", name: "교회는 봉사하는 공동체이다", order: 9 },
          { code: "3-10", name: "집사의 직분, 교인서약", order: 10 },
        ],
      },
    ],
  },
  {
    name: "하나님을 경험하는 삶",
    level: "심화",
    order: 2,
    sections: [
      {
        code: "C-01",
        name: "하나님의 뜻과 당신의 삶",
        order: 1,
        lessons: [
          { code: "C-01/01", name: "예수님이 당신의 길입니다", order: 1 },
          { code: "C-01/02", name: "예수님이 당신의 표본입니다", order: 2 },
          { code: "C-01/03", name: "하나님의 종이 되기를 배우는 것", order: 3 },
          { code: "C-01/04", name: "하나님은 그의 종들을 통해서 일하신다 제1부", order: 4 },
          { code: "C-01/05", name: "하나님은 그의 종들을 통해서 일하신다 제2부", order: 5 },
        ],
      },
      {
        code: "C-02",
        name: "하나님을 바라보라",
        order: 2,
        lessons: [
          { code: "C-02/01", name: "하나님 중심으로 사는 삶", order: 1 },
          { code: "C-02/02", name: "하나님의 계획 대 나의 계획", order: 2 },
          { code: "C-02/03", name: "하나님이 주도권을 잡으신다", order: 3 },
          { code: "C-02/04", name: "하나님은 그의 사람들에게 말씀하신다", order: 4 },
          { code: "C-02/05", name: "하나님은 목적을 가지고 말씀하신다", order: 5 },
        ],
      },
      {
        code: "C-03",
        name: "하나님은 사랑의 관계를 추구하신다",
        order: 3,
        lessons: [
          { code: "C-03/01", name: "사랑의 관계를 위하여 창조되다", order: 1 },
          { code: "C-03/02", name: "하나님과의 사랑의 관계", order: 2 },
          { code: "C-03/03", name: "하나님과 동행함", order: 3 },
          { code: "C-03/04", name: "하나님은 사랑의 관계를 추구하신다", order: 4 },
          { code: "C-03/05", name: "사실적이고 개인적이고 실제적인 관계", order: 5 },
        ],
      },
      {
        code: "C-04",
        name: "하나님의 사랑과 초청",
        order: 4,
        lessons: [
          { code: "C-04/01", name: "하나님을 알라", order: 1 },
          { code: "C-04/02", name: "하나님을 예배하라", order: 2 },
          { code: "C-04/03", name: "하나님을 사랑하라", order: 3 },
          { code: "C-04/04", name: "하나님은 그 분에게 참여하라고 당신을 초청한다", order: 4 },
          { code: "C-04/05", name: "하나님이 어디서 일하고 계신지 아는 것", order: 5 },
        ],
      },
      {
        code: "C-05",
        name: "하나님은 말씀하신다 (1부)",
        order: 5,
        lessons: [
          { code: "C-05/01", name: "하나님은 여러 방법으로 말씀하신다", order: 1 },
          { code: "C-05/02", name: "하나님은 성령으로 말씀하신다", order: 2 },
          { code: "C-05/03", name: "하나님은 계시하신다", order: 3 },
          { code: "C-05/04", name: "하나님은 성경을 통해서 말씀하신다", order: 4 },
          { code: "C-05/05", name: "하나님은 기도를 통해서 말씀하신다", order: 5 },
        ],
      },
      {
        code: "C-06",
        name: "하나님은 말씀하신다 (2부)",
        order: 6,
        lessons: [
          { code: "C-06/01", name: "당신이 기도할 때 어떤 일이 일어납니까?", order: 1 },
          { code: "C-06/02", name: "하나님은 환경을 통해서 말씀하신다", order: 2 },
          { code: "C-06/03", name: "당신이 처한 환경 속의 진리", order: 3 },
          { code: "C-06/04", name: "영적인 표징들", order: 4 },
          { code: "C-06/05", name: "하나님은 교회를 통해서 말씀하신다", order: 5 },
        ],
      },
      {
        code: "C-07",
        name: "믿음의 갈등",
        order: 7,
        lessons: [
          { code: "C-07/01", name: "전환점", order: 1 },
          { code: "C-07/02", name: "하나님과의 만남은 믿음을 요구한다", order: 2 },
          { code: "C-07/03", name: "하나님과의 만남은 하나님 크기의 것이다", order: 3 },
          { code: "C-07/04", name: "당신의 행동이 당신의 믿음을 얘기한다", order: 4 },
          { code: "C-07/05", name: "진정한 믿음은 행동을 요구한다", order: 5 },
        ],
      },
      {
        code: "C-08",
        name: "당신의 인생을 하나님께 조정하라",
        order: 8,
        lessons: [
          { code: "C-08/01", name: "조정이 필수입니다", order: 1 },
          { code: "C-08/02", name: "조정의 종류", order: 2 },
          { code: "C-08/03", name: "순종은 비싼 값을 치르는 것입니다 제1부", order: 3 },
          { code: "C-08/04", name: "순종은 비싼 값을 치르는 것입니다 제2부", order: 4 },
          { code: "C-08/05", name: "하나님을 전적으로 의지하는 것", order: 5 },
        ],
      },
      {
        code: "C-09",
        name: "순종을 통해 하나님을 경험함",
        order: 9,
        lessons: [
          { code: "C-09/01", name: "순종 제1부", order: 1 },
          { code: "C-09/02", name: "순종 제2부", order: 2 },
          { code: "C-09/03", name: "하나님은 당신을 통해서 일하신다", order: 3 },
          { code: "C-09/04", name: "당신이 하나님을 알게 되다", order: 4 },
          { code: "C-09/05", name: "질문들과 답들", order: 5 },
        ],
      },
      {
        code: "C-10",
        name: "하나님의 뜻과 교회",
        order: 10,
        lessons: [
          { code: "C-10/01", name: "교회", order: 1 },
          { code: "C-10/02", name: "한몸으로써 하나님의 뜻을 분별하는 것", order: 2 },
          { code: "C-10/03", name: "그리스도의 몸 제1부", order: 3 },
          { code: "C-10/04", name: "그리스도의 몸 제2부", order: 4 },
          { code: "C-10/05", name: "몸 안의 생명력", order: 5 },
        ],
      },
      {
        code: "C-11",
        name: "하나님 나라 시민들",
        order: 11,
        lessons: [
          { code: "C-11/01", name: "세상을 향한 사명", order: 1 },
          { code: "C-11/02", name: "하나님 나라의 방법들 제1부", order: 2 },
          { code: "C-11/03", name: "하나님 나라의 방법들 제2부", order: 3 },
          { code: "C-11/04", name: "코이노니아", order: 4 },
          { code: "C-11/05", name: "하나님 나라에서의 코이노니아", order: 5 },
        ],
      },
      {
        code: "C-12",
        name: "하나님과의 지속적인 교제",
        order: 12,
        lessons: [
          { code: "C-12/01", name: "깨어진 교제를 고치는 하나님의 구제책", order: 1 },
          { code: "C-12/02", name: "코이노니아의 본질 제1부", order: 2 },
          { code: "C-12/03", name: "코이노니아의 본질 제2부", order: 3 },
          { code: "C-12/04", name: "서로를 돕는 것", order: 4 },
          { code: "C-12/05", name: "당신의 영적인 명세서", order: 5 },
        ],
      },
    ],
  },
];

async function main() {
  // 1. Seed departments
  const departments = ["1장년", "2장년", "청년부", "중고등부"];
  const deptRecords: Record<string, string> = {};

  for (const name of departments) {
    const dept = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    deptRecords[name] = dept.id;
  }
  console.log(`Seeded ${departments.length} departments`);

  // 2. Seed curriculum (courses → sections → lessons)
  let totalLessons = 0;
  for (const courseData of curriculumData) {
    const course = await prisma.course.upsert({
      where: { name: courseData.name },
      update: { level: courseData.level, order: courseData.order },
      create: { name: courseData.name, level: courseData.level, order: courseData.order },
    });

    for (const sectionData of courseData.sections) {
      const section = await prisma.section.upsert({
        where: { courseId_code: { courseId: course.id, code: sectionData.code } },
        update: { name: sectionData.name, order: sectionData.order },
        create: {
          code: sectionData.code,
          name: sectionData.name,
          order: sectionData.order,
          courseId: course.id,
        },
      });

      for (const lessonData of sectionData.lessons) {
        await prisma.lesson.upsert({
          where: { sectionId_code: { sectionId: section.id, code: lessonData.code } },
          update: { name: lessonData.name, order: lessonData.order },
          create: {
            code: lessonData.code,
            name: lessonData.name,
            order: lessonData.order,
            sectionId: section.id,
          },
        });
        totalLessons++;
      }
    }
  }
  console.log(`Seeded ${curriculumData.length} courses, ${totalLessons} lessons`);

  // 3. Seed user accounts
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const deptHeadPassword = await bcrypt.hash("dept1234", 10);
  const leaderPassword = await bcrypt.hash("leader1234", 10);

  const admin = await prisma.user.upsert({
    where: { loginId: "admin" },
    update: {},
    create: {
      loginId: "admin",
      name: "담임목사",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const deptHead = await prisma.user.upsert({
    where: { loginId: "depthead1" },
    update: {},
    create: {
      loginId: "depthead1",
      name: "청년부장",
      password: deptHeadPassword,
      role: "DEPT_HEAD",
      departmentId: deptRecords["청년부"],
    },
  });

  const leader = await prisma.user.upsert({
    where: { loginId: "leader1" },
    update: {},
    create: {
      loginId: "leader1",
      name: "리더1",
      password: leaderPassword,
      role: "LEADER",
      departmentId: deptRecords["청년부"],
    },
  });

  // 4. Seed additional leaders across departments
  const leader2 = await prisma.user.upsert({
    where: { loginId: "leader2" },
    update: {},
    create: {
      loginId: "leader2",
      name: "리더2",
      password: leaderPassword,
      role: "LEADER",
      departmentId: deptRecords["청년부"],
    },
  });

  const leader3 = await prisma.user.upsert({
    where: { loginId: "leader3" },
    update: {},
    create: {
      loginId: "leader3",
      name: "김은혜",
      password: leaderPassword,
      role: "LEADER",
      departmentId: deptRecords["1장년"],
    },
  });

  const leader4 = await prisma.user.upsert({
    where: { loginId: "leader4" },
    update: {},
    create: {
      loginId: "leader4",
      name: "박성민",
      password: leaderPassword,
      role: "LEADER",
      departmentId: deptRecords["2장년"],
    },
  });

  // 5. Seed learners
  const learnerNames = [
    { name: "이수진", phone: "010-1111-1001", notes: "신앙 성장에 열정적", leaderId: leader.id },
    { name: "박민서", phone: "010-1111-1002", notes: "조용하지만 성실", leaderId: leader.id },
    { name: "최유진", phone: "010-1111-1003", notes: "질문이 많음", leaderId: leader.id },
    { name: "정하윤", phone: "010-2222-2001", notes: null, leaderId: leader2.id },
    { name: "강서윤", phone: "010-2222-2002", notes: "새신자, 기초부터", leaderId: leader2.id },
    { name: "윤도현", phone: "010-3333-3001", notes: "2청년부 소속", leaderId: leader3.id },
    { name: "임서연", phone: "010-3333-3002", notes: null, leaderId: leader3.id },
    { name: "한지우", phone: "010-3333-3003", notes: "출석 불규칙", leaderId: leader3.id },
    { name: "오태준", phone: "010-4444-4001", notes: "장년부, 열심", leaderId: leader4.id },
    { name: "신미영", phone: "010-4444-4002", notes: "목양 필요", leaderId: leader4.id },
  ];

  const learners = [];
  for (const l of learnerNames) {
    const learner = await prisma.learner.upsert({
      where: { id: `seed-learner-${l.name}` },
      update: {},
      create: {
        id: `seed-learner-${l.name}`,
        name: l.name,
        phone: l.phone,
        notes: l.notes,
        leaderId: l.leaderId,
      },
    });
    learners.push(learner);
  }
  console.log(`Seeded ${learners.length} learners`);

  // 6. Seed study reports (last 6 weeks)
  const allLessons = await prisma.lesson.findMany({
    orderBy: [{ section: { course: { order: "asc" } } }, { section: { order: "asc" } }, { order: "asc" }],
    select: { id: true },
  });

  const progressStatuses = ["진행중", "진행중", "진행중", "완료", "완료"];
  const contents = [
    "창세기 1장 - 천지창조의 의미와 하나님의 주권에 대해 나눔",
    "요한복음 3:16 암송 및 구원의 확신에 대한 토론",
    "로마서 8장 - 성령의 인도하심에 대해 깊이 묵상",
    "마태복음 5장 - 산상수훈의 팔복 의미 학습",
    "빌립보서 4:13 - 그리스도 안에서의 능력에 대한 나눔",
    "에베소서 6장 - 전신갑주의 영적 의미 토론",
    "시편 23편 - 선한 목자되신 하나님 묵상",
    "잠언 3:5-6 - 여호와를 신뢰하는 삶 나눔",
  ];

  let reportCount = 0;
  const now = new Date();

  for (let weekOffset = 0; weekOffset < 6; weekOffset++) {
    const weekDate = new Date(now);
    weekDate.setDate(weekDate.getDate() - weekOffset * 7);
    // Normalize to Monday
    const day = weekDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekDate.setDate(weekDate.getDate() + diff);
    weekDate.setHours(0, 0, 0, 0);

    for (const learner of learners) {
      // 80% chance of having a report each week
      if (Math.random() > 0.8) continue;

      const lessonIndex = Math.min(weekOffset + learners.indexOf(learner), allLessons.length - 1);
      const attended = Math.random() > 0.15; // 85% attendance

      try {
        await prisma.studyReport.create({
          data: {
            weekDate,
            attended,
            content: contents[(weekOffset + learners.indexOf(learner)) % contents.length],
            notes: attended ? null : "결석 사유: 개인 사정",
            progressStatus: progressStatuses[Math.floor(Math.random() * progressStatuses.length)],
            understandingLevel: Math.floor(Math.random() * 3) + 3, // 3-5
            participationLevel: Math.floor(Math.random() * 3) + 3,
            careLevel: Math.floor(Math.random() * 3) + 2, // 2-4
            nextPlan: weekOffset === 0 ? "다음 주 암송 과제 확인" : null,
            leaderId: learnerNames[learners.indexOf(learner)].leaderId,
            learnerId: learner.id,
            lessonId: allLessons[lessonIndex]?.id ?? null,
          },
        });
        reportCount++;
      } catch {
        // Skip duplicate (learner + weekDate unique constraint)
      }
    }
  }
  console.log(`Seeded ${reportCount} study reports`);

  console.log("Seeded accounts:");
  console.log(`  Admin:     ${admin.loginId} / admin1234`);
  console.log(`  Dept Head: ${deptHead.loginId} / dept1234`);
  console.log(`  Leader:    ${leader.loginId} / leader1234`);
  console.log(`  Leader2:   ${leader2.loginId} / leader1234`);
  console.log(`  Leader3:   ${leader3.loginId} / leader1234`);
  console.log(`  Leader4:   ${leader4.loginId} / leader1234`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
