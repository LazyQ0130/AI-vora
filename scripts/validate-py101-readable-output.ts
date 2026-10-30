import assert from"node:assert/strict";
import {spawnSync}from"node:child_process";
import {createHash}from"node:crypto";
import {mkdtempSync,readFileSync,writeFileSync}from"node:fs";
import os from"node:os";
import path from"node:path";
import {fileURLToPath}from"node:url";
import {readableCode,readableBlockNames,type ReadableKey}from"../src/content/resources/python-readable-output";
import {evidencePath}from"./evidence-path";
type Case={id:string;stdin:string;stdout:string;exitCode:0|1;error?:{type:"NameError"|"ValueError";line:number;message:string}};
const ok=(id:string,stdin:string,stdout:string):Case=>({id,stdin,stdout,exitCode:0});
// 起草前PRE_SOLUTIONS独立推演；不从运行结果或正文输出块反推预期。
export const readableContracts:Record<ReadableKey,readonly Case[]>={
 plain:[ok("bare","","6.0\nTrue\n")],insert:[ok("insert","","Total kg: 6.0\n")],literal:[ok("literal","","Total kg: {total_mass}\n")],
 labels:[ok("labels","","Item: Parcel\nCount: 4\nTotal kg: 6.0\n")],chinese:[ok("chinese","","总质量（千克）：6.0\n")],
 receive:[ok("receive","Parcel\n4\n1.5\n","Item: Count: Mass kg: ")],calculate:[ok("calculate","Parcel\n4\n1.5\n","Item: Count: Mass kg: 6.0\nTrue\n")],
 main:[ok("parcel-low","Parcel\n4\n1.5\n","Item: Count: Mass kg: Item: Parcel\nCount: 4\nTotal kg: 6.0\nWithin 10 kg: True\n"),
  ok("crate-equal","Crate B\n4\n2.5\n","Item: Count: Mass kg: Item: Crate B\nCount: 4\nTotal kg: 10.0\nWithin 10 kg: True\n"),
  ok("crate-high","Crate C\n4\n3.0\n","Item: Count: Mass kg: Item: Crate C\nCount: 4\nTotal kg: 12.0\nWithin 10 kg: False\n"),
  ok("unseen-parcel","Bundle D\n2\n2.25\n","Item: Count: Mass kg: Item: Bundle D\nCount: 2\nTotal kg: 4.5\nWithin 10 kg: True\n"),
  {id:"bad-count",stdin:"Parcel\n4.5\n1.5\n",stdout:"Item: Count: Mass kg: ",exitCode:1,error:{type:"ValueError",line:5,message:"ValueError: invalid literal for int() with base 10: '4.5'"}},
  ok("restart-valid","Parcel\n4\n1.5\n","Item: Count: Mass kg: Item: Parcel\nCount: 4\nTotal kg: 6.0\nWithin 10 kg: True\n")],
 ownSummary:[ok("banner-a","Banner A\n6\n0.75\n","Material: Pieces: Length m: Material: Banner A\nPieces: 6\nTotal m: 4.5\n"),
  ok("banner-b","Banner B\n10\n0.5\n","Material: Pieces: Length m: Material: Banner B\nPieces: 10\nTotal m: 5.0\n"),
  ok("unseen-summary","Cable C\n3\n1.25\n","Material: Pieces: Length m: Material: Cable C\nPieces: 3\nTotal m: 3.75\n")],
 ownBoundary:[ok("garden-low","Garden A\n3\n3\n","Batch: Strips: Strip m: Batch: Garden A\nStrips: 3\nTotal m: 9.0\nWithin 12 m: True\n"),
  ok("garden-equal","Garden B\n3\n4\n","Batch: Strips: Strip m: Batch: Garden B\nStrips: 3\nTotal m: 12.0\nWithin 12 m: True\n"),
  ok("garden-high","Garden C\n3\n5\n","Batch: Strips: Strip m: Batch: Garden C\nStrips: 3\nTotal m: 15.0\nWithin 12 m: False\n"),
  ok("unseen-boundary","Garden D\n4\n3\n","Batch: Strips: Strip m: Batch: Garden D\nStrips: 4\nTotal m: 12.0\nWithin 12 m: True\n")],
 nameError:[{id:"unbound-field",stdin:"",stdout:"",exitCode:1,error:{type:"NameError",line:2,message:"NameError: name 'total_mas' is not defined"}}],
 nameRepair:[ok("field-repaired","","Total kg: 6.0\n")],
};
const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
export function readableKey(filename:string,source:string):ReadableKey{const k=(Object.keys(readableCode)as ReadableKey[]).find(k=>readableBlockNames[k]===filename);assert.ok(k,`未登记输出块：${filename}`);assert.equal(source,readableCode[k],`输出块源码改变：${filename}`);return k;}
export function readableContract(key:ReadableKey,id:string,stdin:string){const c=readableContracts[key].find(c=>c.id===id);assert.ok(c,`未知运行组合：${id}`);assert.equal(stdin,c.stdin,`stdin不匹配：${id}`);return c;}
export function checkReadableResult(key:ReadableKey,id:string,stdin:string,r:{exitCode:number|null;stdout:string;stderr:string}){
 const c=readableContract(key,id,stdin);assert.equal(r.exitCode,c.exitCode,id);assert.equal(r.stdout.replaceAll("\r\n","\n"),c.stdout,id);const stderr=r.stderr.replaceAll("\r\n","\n");
 if(!c.error){assert.equal(stderr,"",id);return;}
 assert.ok(stderr.startsWith("Traceback (most recent call last):\n"),id);assert.match(stderr,new RegExp('File "[^"\\n]+\\.py", line '+c.error.line+', in <module>'));assert.ok(stderr.includes(readableCode[key].split("\n")[c.error.line-1]),id);
 const last=stderr.trimEnd().split("\n").at(-1)!;
 if(c.error.type==="NameError")assert.match(last,/^NameError: name 'total_mas' is not defined(?:\. Did you mean: 'total_mass'\?)?$/);else assert.equal(last,c.error.message,id);
 assert.doesNotMatch(stderr,/EOFError|SyntaxError|TypeError/);
}
export function runSavedReadable(key:ReadableKey,id:string,stdin:string,directory?:string){
 const c=readableContract(key,id,stdin),cwd=directory??mkdtempSync(path.join(os.tmpdir(),"aivora-p13-")),filename=readableBlockNames[key].split(" · ")[0],target=path.join(cwd,filename),savedSource=readableCode[key]+"\n";writeFileSync(target,savedSource,"utf8");assert.equal(readFileSync(target,"utf8"),savedSource);
 const python=process.env.AIVORA_PYTHON??"python",r=spawnSync(python,[target],{cwd,input:stdin,encoding:"utf8",timeout:10_000,env:{...process.env,PYTHONIOENCODING:"utf-8",PYTHON_COLORS:"0"}});assert.ifError(r.error);const result={exitCode:r.status,stdout:r.stdout,stderr:r.stderr};checkReadableResult(key,id,stdin,result);
 return{key,caseId:id,filename,cwd,command:[python,target],pid:r.pid,stdin,savedSource,savedSha256:sha(savedSource),expectedStdout:c.stdout,expectedExitCode:c.exitCode,expectedError:c.error??null,...result};
}
export function runReadableExample(filename:string,source:string){const key=readableKey(filename,source),directory=mkdtempSync(path.join(os.tmpdir(),"aivora-p13-"));return{executionMode:"saved-file-real-stdin",key,sourceSha256:sha(source+"\n"),allRunsPassed:true,runs:readableContracts[key].map(c=>runSavedReadable(key,c.id,c.stdin,directory))};}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const directory=mkdtempSync(path.join(os.tmpdir(),"aivora-p13-author-")),rows=(Object.keys(readableCode)as ReadableKey[]).flatMap(k=>readableContracts[k].map(c=>runSavedReadable(k,c.id,c.stdin,directory)));
 const identity=spawnSync(process.env.AIVORA_PYTHON??"python",["-c","import sys,json; print(json.dumps({'version':sys.version.split()[0],'executable':sys.executable,'prefix':sys.prefix}))"],{encoding:"utf8"});assert.equal(identity.status,0);const python=JSON.parse(identity.stdout);const shell=spawnSync("pwsh.exe",["-NoProfile","-Command","$PSVersionTable.PSVersion.ToString()"],{encoding:"utf8"});assert.equal(shell.status,0);
 const report={checkedAt:new Date().toISOString(),platform:process.platform,os:os.release(),shell:"PowerShell "+shell.stdout.trim(),python,method:"保存.py并重读核SHA；真实新Python进程/精确stdin；stdout/stderr不补回显或重排，公开仅替换路径前缀",rows,allAssertionsPassed:true,macOS:"未实机执行"};writeFileSync(path.join(directory,"raw-runs.json"),JSON.stringify(report,null,2)+"\n");
 const redact=(s:string)=>s.replaceAll(directory,"<P13-LAB>").replaceAll(python.prefix,"<BASE-PYTHON>").replaceAll(process.cwd(),"<WORKSPACE>");writeFileSync(evidencePath("PYTHON_RUNS.json"),JSON.stringify(report,(_k,v)=>typeof v==="string"?redact(v):v,2)+"\n");console.log(`${rows.length} saved-file runs passed: literal/f-string, labeled units, real stdin, equal/exceeded boundaries, references and controlled failures/recovery.`);
}
