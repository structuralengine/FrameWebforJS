addEventListener("message",({data:a})=>{const t=a.pickList,s=a.fsecCombine,f={},m={};for(const o of Object.keys(t)){const a={fx:0,fy:0,fz:0,mx:0,my:0,mz:0},x=t[o];let e=null;for(const t of x){const f=JSON.parse(JSON.stringify({temp:s[t]})).temp;if(null!=e)for(const t of Object.keys(f)){const s=t.split("_"),m=f[t],o=e[t];for(const a of Object.keys(o)){const x=o[a];if(!(a in m))continue;const M=m[a];"max"===s[1]?M[s[0]]>x[s[0]]&&(e[t][a]=f[t][a]):M[s[0]]<x[s[0]]&&(e[t][a]=f[t][a])}for(const f of e[t])a.fx=Math.max(Math.abs(f.fx),a.fx),a.fy=Math.max(Math.abs(f.fy),a.fy),a.fz=Math.max(Math.abs(f.fz),a.fz),a.mx=Math.max(Math.abs(f.mx),a.mx),a.my=Math.max(Math.abs(f.my),a.my),a.mz=Math.max(Math.abs(f.mz),a.mz)}else{e=f;for(const t of Object.keys(f))for(const s of e[t])a.fx=Math.max(Math.abs(s.fx),a.fx),a.fy=Math.max(Math.abs(s.fy),a.fy),a.fz=Math.max(Math.abs(s.fz),a.fz),a.mx=Math.max(Math.abs(s.mx),a.mx),a.my=Math.max(Math.abs(s.my),a.my),a.mz=Math.max(Math.abs(s.mz),a.mz)}}f[o]=e,m[o]=a,e=null}postMessage({fsecPickup:f,max_values:m})});