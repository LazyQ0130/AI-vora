import { ai000StudyTimePlan } from "../content/ai000-study-time";

export function getCourseStudyEstimate(courseId: string) {
  if(courseId!=="AI000") return undefined;
  const totalMinutes=[0,0];
  for(const lesson of ai000StudyTimePlan.lessons)
    for(const category of [lesson.reading,lesson.practice,lesson.project]) {
      totalMinutes[0]+=category[0]; totalMinutes[1]+=category[1];
    }
  return {
    ...ai000StudyTimePlan,
    lessonCount:ai000StudyTimePlan.lessons.length,
    totalMinutes,
    hours:totalMinutes.map(m=>(m/60).toFixed(1)).join("–"),
  };
}

export function getCourseTimeLabel(course: {id:string;hours:string}) {
  const estimate=getCourseStudyEstimate(course.id);
  return estimate ? `编辑预计 ${estimate.hours} 小时` : `预计 ${course.hours} 小时`;
}
