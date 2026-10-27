import { ai000ChapterLessons } from "./ai000-outline";

// 与 docs/AI000_CURRICULUM_V2_PLAN.md 的24行分项表对应，单位为分钟。
// 这是完整规划路线的编辑估计，包含未制作课时，不是开放数量或学生实测。
// 维护时先更新分项，再同步规划表；tests/ai000-supervised.test.ts核对两者一致。
const chapterMinutes = [
  [[14,20,12,18,0,0],[16,23,15,22,0,0],[16,22,15,22,0,0]],
  [[16,22,16,24,0,0],[18,25,16,24,0,0]],
  [[10,16,8,14,0,0],[10,16,8,14,0,0],[10,16,8,14,0,0],[12,18,10,16,0,0]],
  [[10,16,16,24,0,0],[12,18,14,20,0,0],[12,18,10,16,0,0],[10,16,8,14,0,0]],
  [[10,16,8,14,0,0],[10,16,8,14,0,0],[10,16,8,14,0,0],[10,16,8,14,0,0],[10,16,8,14,0,0]],
  [[12,18,10,16,0,0],[12,18,10,16,0,0],[12,18,10,16,0,0]],
  [[10,16,8,14,0,0],[10,16,8,14,0,0],[10,15,15,20,35,55]],
] as const;

export const ai000StudyTimePlan = {
  source: "docs/AI000_CURRICULUM_V2_PLAN.md",
  basis: "editorial-estimate",
  includesPlannedLessons: true,
  lessons: chapterMinutes.flatMap((lessons,chapter)=>{
    if(lessons.length!==ai000ChapterLessons[chapter].length) throw new Error("AI000学时表与节级蓝图不一致");
    return lessons.map((minutes,index)=>({
      lessonId:`AI000-C${String(chapter+1).padStart(2,"0")}-L${String(index+1).padStart(2,"0")}`,
      reading:[minutes[0],minutes[1]] as const,
      practice:[minutes[2],minutes[3]] as const,
      project:[minutes[4],minutes[5]] as const,
    }));
  }),
} as const;
