addEventListener("message",function(a){var r=function(a){var r,m=null;try{var n=a.toString().trim();n.length>0&&(r=+n,m=isNaN(r)?null:r)}catch(n){m=null}return m},m=a.data.jsonData,n={},e={},_={},t=null;try{for(var l=0,i=Object.keys(m);l<i.length;l++){var u=i[l],d=new Array,x=m[u];if("object"==typeof x&&"reac"in x){var v=x.reac;if(null!==v){for(var c={max_d:Number.MIN_VALUE,max_r:Number.MIN_VALUE,min_d:Number.MAX_VALUE,min_r:Number.MAX_VALUE,max_d_m:"0",max_r_m:"0",min_d_m:"0",min_r_m:"0"},s=0,o=Object.keys(v);s<o.length;s++){var h=o[s],y=v[h],b=r(y.tx),f=r(y.ty),g=r(y.tz),M=r(y.mx),N=r(y.my),A=r(y.mz),p={id:h.replace("node",""),tx:null==b?0:-b,ty:null==f?0:-f,tz:null==g?0:-g,mx:null==M?0:M,my:null==N?0:N,mz:null==A?0:-A};d.push(p);for(var E=0,L=[b,f,g];E<L.length;E++){var j=L[E];c.max_d<j&&(c.max_d=j,c.max_d_m=h),c.min_d>j&&(c.min_d=j,c.min_d_m=h)}for(var z=0,U=[M,N,A];z<U.length;z++){var V=U[z];c.max_r<V&&(c.max_r=V,c.max_r_m=h),c.min_r>V&&(c.min_r=V,c.min_r_m=h)}}var k=u.replace("Case","");n[k]=d,e[k]=Math.max(Math.abs(c.max_d),Math.abs(c.min_d)),_[k]=c}}}}catch(u){t=u}postMessage({reac:n,error:t,max_value:e,value_range:_})});