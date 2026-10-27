// 全部为教学构造：同一个月内的两类借阅次数，不含真实读者资料。
export const borrowingRecords = [
  { id:"A", science:4, literature:0 },
  { id:"B", science:3, literature:1 },
  { id:"C", science:0, literature:4 },
  { id:"D", science:1, literature:3 },
  { id:"E", science:2, literature:2 },
  { id:"F", science:0, literature:0 },
] as const;

// 作者按“哪一类次数更多”手工提出的观察，不是聚类算法输出或目标标签。
export const borrowingObservations = [
  { ids:["A","B"], title:"候选组1：科普次数较多", note:"两条记录的科普次数都多于文学次数。" },
  { ids:["C","D"], title:"候选组2：文学次数较多", note:"两条记录的文学次数都多于科普次数。" },
  { ids:["E"], title:"E：两类各2次，先单列", note:"没有偏向前两组中的一类，不必强行选组。" },
  { ids:["F"], title:"F：两类均0次，原因待查", note:"只知这两类无记录，不能推出不爱读书。" },
] as const;

export const activityRecords = [
  {id:"P",sport:5,art:1},{id:"Q",sport:4,art:0},
  {id:"R",sport:1,art:5},{id:"S",sport:0,art:4},
  {id:"T",sport:3,art:3},{id:"U",sport:0,art:0},
] as const;
