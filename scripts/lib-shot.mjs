import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
mkdirSync('shots',{recursive:true})
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1280,height:900}})
await p.goto('http://localhost:5201/',{waitUntil:'networkidle'})
await p.waitForFunction(()=>!!window.__eng,null,{timeout:10000})
await p.evaluate(()=>window.__eng.setState({role:'senior',page:'library',lang:'fa'}))
await p.waitForTimeout(600)
await p.screenshot({path:'shots/lib.png'})
await b.close();console.log('shot ok')
