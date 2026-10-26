export type Point2 = readonly [number,number];
export const add2 = (a: Point2,b: Point2): Point2 => [a[0]+b[0],a[1]+b[1]];
export const scale2 = (factor: number,u: Point2): Point2 => [factor*u[0],factor*u[1]];
export const displacement2 = (start: Point2,end: Point2): Point2 => [end[0]-start[0],end[1]-start[1]];
export const teachingU: Point2 = [3,2];
export const teachingV: Point2 = [-1,1];
export const scalingFactors = [2,.5,-1,0] as const;
// 相同轴比例，数学 y 向上；SVG y 向下。
export const vectorView = { width:400,height:320,minX:-4,maxX:7,minY:-3,maxY:5,scale:29,left:44,bottom:278 };
export const vectorPixel = ([x,y]: Point2): Point2 => [vectorView.left+(x-vectorView.minX)*vectorView.scale,vectorView.bottom-(y-vectorView.minY)*vectorView.scale];
