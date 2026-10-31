// P15两张原创关系图的确定性源。只输出这四份PNG和对应SVG；不扩展运行时制图模型。
import {mkdirSync,writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import sharp from "sharp";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const master=path.join(root,"docs/py101-p15/diagram-sources"),assets=path.join(root,"public/learning/py101");
mkdirSync(master,{recursive:true});mkdirSync(assets,{recursive:true});
const esc=(s:string)=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const text=(x:number,y:number,s:string,size=22,fill="#e8efff")=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${fill}" stroke="#0c1529" stroke-width="5" paint-order="stroke">${esc(s)}</text>`;
const rect=(x:number,y:number,w:number,h:number,fill="#17243e",stroke="#688fc2")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const box=(x:number,y:number,w:number,h:number,title:string,lines:string[],font=22)=>rect(x,y,w,h)+text(x+w/2,y+34,title,font+2,"#9fe9f4")+lines.map((s,i)=>text(x+w/2,y+69+i*30,s,font)).join("");
const arrow=(d:string,both=false)=>`<path d="${d}" fill="none" stroke="#85b9ee" stroke-width="3" ${both?'marker-start="url(#back)" ':''}marker-end="url(#head)"/>`;
const svg=(w:number,h:number,title:string,description:string,body:string)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(description)}</desc><defs><marker id="head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#85b9ee"/></marker><marker id="back" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M10 0 L0 5 L10 10 Z" fill="#85b9ee"/></marker></defs><rect width="${w}" height="${h}" rx="18" fill="#0c1529"/><g font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif">${body}</g></svg>`;
const scriptDesc="终端窗口容纳Shell；Shell启动选中的Python解释器，解释器执行指定脚本。cwd是相对路径的解析起点。直接指定环境Python也可运行；激活后仍需核对真实解释器。版本相同不证明环境相同。";
const notebookDesc="浏览器经Notebook服务器编辑和展示；服务器提供文件与会话服务，与Python内核交互。内核执行代码并保留运行状态；磁盘.ipynb保存代码、说明和可保存输出，不是全部内存。服务器Python和内核Python要分别核验。";
const scriptDesktop=svg(820,590,"Shell、Python与脚本的执行关系",scriptDesc,
 rect(30,20,760,135,"#111d35")+text(410,52,"终端窗口",24)+box(55,70,350,65,"Shell：解释命令",[],20)+box(460,70,295,65,"cwd：当前目录",[],20)+
 arrow("M230 145 V235")+text(232,183,"启动",20)+text(232,211,"通常继承cwd",19)+
 box(35,245,355,140,"本次Python解释器",["实际路径决定所用环境","直接调用 或 激活后核对"],21)+
 box(455,245,325,140,"指定的.py文件",["解释器读取并执行","源码放在.venv外"],21)+
 arrow("M398 315 H445")+text(422,296,"执行",18)+arrow("M610 145 V235")+text(610,200,"解析相对脚本路径",20)+
 box(35,435,745,115,"怎样确认选对？",["Interpreter / Environment应属于目标项目；同版本仍可不同环境。"],21));
const scriptMobile=svg(340,790,"Shell、Python与脚本：窄屏关系图",scriptDesc,
 rect(10,10,300,172,"#111d35")+text(160,42,"终端窗口",23)+box(25,58,270,48,"Shell：解释命令",[],20)+box(25,117,270,48,"cwd：当前目录",[],20)+
 arrow("M160 187 V238")+rect(37,198,246,28,"#0c1529","#0c1529")+text(160,218,"Shell启动Python",20)+
 box(10,245,300,140,"本次Python解释器",["路径决定所用环境","可直接调用环境Python","激活后也要核对身份"],20)+
 arrow("M160 391 V435")+rect(65,398,190,27,"#0c1529","#0c1529")+text(160,419,"解释器执行",20)+
 box(10,445,300,116,"指定的.py文件",["相对脚本路径从cwd解析","源码在环境目录外"],20)+
 arrow("M302 142 H327 V428 H285 V438")+text(261,594,"cwd定位相对路径",19)+
 box(10,605,300,150,"核对依据",["Interpreter / Environment","应属于目标项目.venv","相同版本仍可不同环境"],20));
const notebookDesktop=svg(820,700,"浏览器、服务器、内核与Notebook文件",notebookDesc,
 box(210,20,400,100,"浏览器",["编辑单元格，展示结果"],22)+
 arrow("M410 130 V207",true)+text(535,172,"操作 / 结果",20)+
 box(210,220,400,112,"Notebook服务器",["文件、会话服务；转交执行请求"],21)+
 arrow("M300 343 V409 H205 V462",true)+text(150,398,"打开 / 保存",20)+
 arrow("M520 343 V409 H615 V462",true)+text(665,398,"执行 / 返回",20)+
 box(30,475,350,150,".ipynb文件（磁盘）",["代码、说明和已保存输出","保存不等于保存全部内存"],21)+
 box(440,475,350,150,"Python内核",["实际执行，保留名称与值","重启后重新建立运行状态"],21)+
 text(410,670,"服务器Python与内核Python，要分别核对实际位置。",21));
const notebookMobile=svg(340,840,"Notebook四种对象：窄屏关系图",notebookDesc,
 box(20,15,300,100,"浏览器",["编辑与展示"],21)+
 arrow("M170 127 V180",true)+text(250,158,"操作 / 结果",19)+
 box(20,195,300,120,"Notebook服务器",["文件与会话服务","向内核转交执行请求"],20)+
 arrow("M100 326 V380 H85 V428",true)+text(77,370,"打开/保存",19)+
 arrow("M240 326 V380 H255 V428",true)+text(265,370,"执行/返回",19)+
 box(10,440,150,185,".ipynb文件",["代码、说明","和已保存输出"],20)+
 box(180,440,150,185,"Python内核",["执行代码","保留名称与值","重启清旧状态"],20)+
 box(10,670,320,155,"分清文件与运行状态",["保存不等于保存全部内存","服务器Python与内核Python","要分别核对实际位置"],20));
for(const [name,source]of Object.entries({"python-script-runtime":scriptDesktop,"python-script-runtime-mobile":scriptMobile,"python-notebook-runtime":notebookDesktop,"python-notebook-runtime-mobile":notebookMobile})){
 writeFileSync(path.join(master,`${name}.svg`),source+"\n");
 await sharp(Buffer.from(source),{density:192}).png({compressionLevel:9}).toFile(path.join(assets,`${name}.png`));
}
console.log("Generated four fixed PY101 diagram PNGs and their accessible SVG masters.");
