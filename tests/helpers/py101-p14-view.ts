// 旧P0–P14断言只看完整摘要认可后撤销P15的历史对象；当前r2另由P15专项直接验证。
import type {Lesson} from '../../src/content/models';
import {lessonRegistry as currentRegistry,getLearningCourse as currentCourse} from '../../src/lib/course-engine';
import {publicationManifest as currentManifest} from '../../src/content/publication-manifest';
import {beforeApprovedPy101Object} from '../../scripts/py101-p1-compatibility';
export {getAdjacentLessons,resolveLesson} from '../../src/lib/course-engine';
const baseline='cb3927fa0be59a8108a30cf183361aa1f7c8a318';
export const historicalLesson=(lesson:Lesson)=>beforeApprovedPy101Object('lessons',lesson.id,lesson,baseline) as Lesson;
export const lessonRegistry=new Map([...currentRegistry].map(([id,l])=>[id,historicalLesson(l)]));
export const publicationManifest=currentManifest.map(p=>beforeApprovedPy101Object('publications',p.lessonId,p,baseline) as typeof p);
export function getLearningCourse(id:string){
 const course=currentCourse(id);if(!course)return course;
 return {...course,chapters:course.chapters.map(c=>({...c,lessons:c.lessons.map(l=>({...l,contentVersion:publicationManifest.find(p=>p.lessonId===l.lessonId)?.contentVersion??l.contentVersion}))}))};
}
