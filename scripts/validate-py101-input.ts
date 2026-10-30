import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {mkdtempSync,readFileSync,writeFileSync} from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {inputCode,inputBlockNames,type InputKey} from "../src/content/resources/python-input-conversion";
import {evidencePath} from "./evidence-path";
type InputCase={id:string;stdin:string;stdout:string;exitCode:0|1;errorLine?:string};
const ok=(id:string,stdin:string,stdout:string):InputCase=>({id,stdin,stdout,exitCode:0});
const bad=(id:string,stdin:string,stdout:string,errorLine:string):InputCase=>({id,stdin,stdout,exitCode:1,errorLine});
// 在新程序实跑前按PRE_SOLUTIONS独立登记。stdout包含真实input提示，无键盘回显。
export const inputContracts:Record<InputKey,readonly InputCase[]>={
 label:[ok("label","Box A\n","Label: Box A\n")],
 rawCount:[ok("raw-four","4\n","Count: 4\n<class 'str'>\n")],
 convertInt:[ok("int-four","4\n","Count: 4\n<class 'int'>\n")],
 inspectInt:[ok("inspect-int","4\n","Count: 4\n<class 'str'>\n4\n<class 'int'>\n")],
 main:[ok("box-four","Box A\n4\n","Label: Count: Box A\n12\n"),ok("tool-two","Tool B\n2\n","Label: Count: Tool B\n6\n")],
 mass:[ok("mass-one","1.5\n","Mass kg: 3.0\n"),ok("mass-two","2.25\n","Mass kg: 4.5\n")],
 inspectFloat:[ok("inspect-float","1.5\n","Mass kg: 1.5\n<class 'str'>\n1.5\n<class 'float'>\n")],
 integerError:[bad("word","four\n","Count: ","ValueError: invalid literal for int() with base 10: 'four'"),bad("decimal-int","4.5\n","Count: ","ValueError: invalid literal for int() with base 10: '4.5'"),ok("int-restart","7\n","Count: 7\n")],
 floatError:[bad("bad-float","bad\n","Mass kg: ","ValueError: could not convert string to float: 'bad'"),ok("float-restart","1.75\n","Mass kg: 3.5\n")],
 ownInteger:[ok("hall-three","Hall C\n3\n","Venue: Teams: Hall C\n15\n"),ok("hall-six","Hall D\n6\n","Venue: Teams: Hall D\n30\n"),ok("unseen-int","Porch E\n7\n","Venue: Teams: Porch E\n35\n")],
 ownMeasure:[ok("length-one","1.25\n","Length m: 5.0\n"),ok("length-two","2.5\n","Length m: 10.0\n"),ok("unseen-float","1.125\n","Length m: 4.5\n")],
 measureError:[bad("bad-length","oops\n","Length m: ","ValueError: could not convert string to float: 'oops'"),ok("length-restart","0.75\n","Length m: 3.0\n")],
};
const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
export function inputKey(filename:string,source:string):InputKey{
 const key=(Object.keys(inputCode)as InputKey[]).find(k=>inputBlockNames[k]===filename);assert.ok(key,`未知输入课代码块：${filename}`);assert.equal(source,inputCode[key],`输入课源码改变：${filename}`);return key;
}
export function inputContract(key:InputKey,id:string,stdin:string){
 const row=inputContracts[key].find(r=>r.id===id);assert.ok(row,`未登记输入组合：${id}`);assert.equal(stdin,row.stdin,`输入数据不匹配：${id}`);return row;
}
export function checkInputResult(key:InputKey,id:string,stdin:string,result:{stdout:string;stderr:string;exitCode:number|null}){
 const row=inputContract(key,id,stdin);assert.equal(result.exitCode,row.exitCode,id);assert.equal(result.stdout.replaceAll("\r\n","\n"),row.stdout,id);
 const stderr=result.stderr.replaceAll("\r\n","\n");
 if(!row.errorLine){assert.equal(stderr,"",id);return;}
 assert.ok(stderr.startsWith("Traceback (most recent call last):\n"),id);assert.equal(stderr.trimEnd().split("\n").at(-1),row.errorLine,id);
 assert.match(stderr,/File "[^"\n]+\.py", line 2, in <module>/);assert.ok(stderr.includes(inputCode[key].split("\n")[1]),id);
 assert.doesNotMatch(stderr,/EOFError|NameError|SyntaxError|TypeError/);
}
export function runSavedInput(key:InputKey,id:string,stdin:string,directory?:string){
 const contract=inputContract(key,id,stdin),cwd=directory??mkdtempSync(path.join(os.tmpdir(),"aivora-p12-")),filename=inputBlockNames[key].split(" · ")[0],target=path.join(cwd,filename),savedSource=inputCode[key]+"\n";
 writeFileSync(target,savedSource,"utf8");assert.equal(readFileSync(target,"utf8"),savedSource);
 const python=process.env.AIVORA_PYTHON??"python",result=spawnSync(python,[target],{cwd,input:stdin,encoding:"utf8",timeout:10_000,env:{...process.env,PYTHONIOENCODING:"utf-8",PYTHON_COLORS:"0"}});assert.ifError(result.error);
 const observation={exitCode:result.status,stdout:result.stdout,stderr:result.stderr};checkInputResult(key,id,stdin,observation);
 return{key,caseId:id,filename,cwd,command:[python,target],pid:result.pid,stdin,savedSource,savedSha256:sha(savedSource),expectedStdout:contract.stdout,expectedExitCode:contract.exitCode,expectedErrorLine:contract.errorLine??null,...observation};
}
export function runInputExample(filename:string,source:string){
 const key=inputKey(filename,source),directory=mkdtempSync(path.join(os.tmpdir(),"aivora-p12-"));
 const runs=inputContracts[key].map(c=>runSavedInput(key,c.id,c.stdin,directory));
 return{executionMode:"saved-file-real-stdin",key,sourceSha256:sha(source+"\n"),allRunsPassed:true,runs};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const directory=mkdtempSync(path.join(os.tmpdir(),"aivora-p12-author-")),rows=(Object.keys(inputCode)as InputKey[]).flatMap(k=>inputContracts[k].map(c=>runSavedInput(k,c.id,c.stdin,directory)));
 const identity=spawnSync(process.env.AIVORA_PYTHON??"python",["-c","import sys,json; print(json.dumps({'version':sys.version.split()[0],'executable':sys.executable,'prefix':sys.prefix}))"],{encoding:"utf8"});assert.equal(identity.status,0);const python=JSON.parse(identity.stdout);
 const shell=spawnSync("pwsh.exe",["-NoProfile","-Command","$PSVersionTable.PSVersion.ToString()"],{encoding:"utf8"});assert.equal(shell.status,0);
 const report={checkedAt:new Date().toISOString(),platform:process.platform,os:os.release(),shell:"PowerShell "+shell.stdout.trim(),python,method:"保存.py并重读核SHA；新真实Python进程逐案提供stdin；stdout/stderr不补造回显或重排，仅公开路径前缀脱敏",rows,allAssertionsPassed:true,macOS:"未实机运行"};
 writeFileSync(path.join(directory,"raw-runs.json"),JSON.stringify(report,null,2)+"\n");
 const redact=(s:string)=>s.replaceAll(directory,"<P12-LAB>").replaceAll(python.prefix,"<BASE-PYTHON>").replaceAll(process.cwd(),"<WORKSPACE>");
 writeFileSync(evidencePath("PYTHON_RUNS.json"),JSON.stringify(report,(_k,v)=>typeof v==="string"?redact(v):v,2)+"\n");
 console.log(`${rows.length} saved-file stdin runs passed; legal pairs, four ValueErrors and fresh-process recoveries recorded.`);
}
