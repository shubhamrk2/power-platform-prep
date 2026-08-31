(function(){
var rail=document.getElementById('rail');
var burger=document.getElementById('burger');
if(burger)burger.onclick=function(){rail.classList.toggle('open')};
document.querySelectorAll('#nav a').forEach(function(a){
  a.addEventListener('click',function(){if(innerWidth<=880)rail.classList.remove('open')})});
 
/* progress + subsection spy */
var fill=document.querySelector('.pmeter .fill'),pct=document.getElementById('pct');
var tops=[].slice.call(document.querySelectorAll('.body h2[id],.body h3[id]'));
var subs={};document.querySelectorAll('.subs a').forEach(function(a){
  subs[a.getAttribute('href').replace(/^.*#/,'')]=a});
function onscroll(){
  var h=document.body.scrollHeight-innerHeight;
  var p=h>0?Math.min(100,Math.round(scrollY/h*100)):0;
  if(fill)fill.style.width=p+'%';if(pct)pct.textContent=p+'%';
  var t=document.getElementById('top');if(t)t.classList.toggle('on',scrollY>640);
  var cur=null,y=scrollY+150;
  for(var i=0;i<tops.length;i++)if(tops[i].offsetTop<=y)cur=tops[i];
  for(var k in subs)subs[k].classList.remove('on');
  if(cur&&subs[cur.id])subs[cur.id].classList.add('on');
}
addEventListener('scroll',onscroll,{passive:true});addEventListener('resize',onscroll);onscroll();
var tb=document.getElementById('top');
if(tb)tb.onclick=function(){scrollTo({top:0,
  behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})};
 
/* checkboxes persist per page */
var KEY='ipx-'+(document.body.dataset.page||'x');
var done={};try{done=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
var boxes=[].slice.call(document.querySelectorAll('.checks li'));
boxes.forEach(function(li,i){
  if(done[i])li.classList.add('chk');
  var b=li.querySelector('.box');if(!b)return;
  b.setAttribute('aria-checked',li.classList.contains('chk')?'true':'false');
  function tog(){
    li.classList.toggle('chk');
    var on=li.classList.contains('chk');
    b.setAttribute('aria-checked',on?'true':'false');
    if(on)done[i]=1;else delete done[i];
    try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}
    count();
  }
  b.onclick=tog;
  b.onkeydown=function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();tog()}};
});
function count(){
  var el=document.getElementById('ccount');if(!el||!boxes.length)return;
  el.textContent=document.querySelectorAll('.checks li.chk').length+'/'+boxes.length;
}
count();
var rc=document.getElementById('resetc');
if(rc)rc.onclick=function(){
  if(!confirm('Clear checked items on this page?'))return;
  done={};try{localStorage.removeItem(KEY)}catch(e){}
  document.querySelectorAll('.checks li.chk').forEach(function(li){
    li.classList.remove('chk');
    var b=li.querySelector('.box');if(b)b.setAttribute('aria-checked','false')});
  count();
};
 
/* copy buttons */
document.querySelectorAll('.codeblock .copy').forEach(function(b){
  b.onclick=function(){
    var code=b.parentNode.querySelector('code');
    var txt=code.innerText;
    function ok(){b.textContent='copied';setTimeout(function(){b.textContent='copy'},1400)}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(ok,fallback)
    }else fallback();
    function fallback(){
      var ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);
      ta.select();try{document.execCommand('copy');ok()}catch(e){}
      document.body.removeChild(ta);
    }
  }});
 
/* search across all pages (index built at compile time) */
var find=document.getElementById('find'),inp=document.getElementById('q'),
    res=document.getElementById('res'),sel=-1;
function render(list){
  res.innerHTML=list.length?list.map(function(r,i){
    return '<a href="'+r.u+'" data-i="'+i+'"><span class="pt" style="color:hsl('+r.h+
      ' 68% 62%)">'+r.p+'</span>'+r.t+'</a>'}).join('')
    :'<a style="color:var(--tx3)">No match</a>';
  sel=-1;
}
function open_(){find.classList.add('on');inp.value='';render(SEARCH.slice(0,40));
  setTimeout(function(){inp.focus()},20)}
function close_(){find.classList.remove('on')}
if(inp)inp.oninput=function(){
  var q=inp.value.toLowerCase().trim();
  if(!q)return render(SEARCH.slice(0,40));
  var terms=q.split(/\s+/);
  render(SEARCH.filter(function(r){
    var s=(r.t+' '+r.p).toLowerCase();
    return terms.every(function(w){return s.indexOf(w)>-1})}).slice(0,60));
};
document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();open_();return}
  if(e.key==='/'&&!/input|textarea/i.test(e.target.tagName||'')){e.preventDefault();open_();return}
  if(!find||!find.classList.contains('on'))return;
  if(e.key==='Escape'){close_();return}
  var items=res.querySelectorAll('a');
  if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,items.length-1)}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0)}
  else if(e.key==='Enter'&&sel>-1){e.preventDefault();items[sel].click();return}
  else return;
  items.forEach(function(a,i){a.classList.toggle('sel',i===sel)});
  if(items[sel])items[sel].scrollIntoView({block:'nearest'});
});
if(find){find.onclick=function(e){if(e.target===find)close_()};
  res.onclick=function(e){if(e.target.closest('a'))close_()}}
var sb=document.getElementById('sbtn');if(sb)sb.onclick=open_;

/* dark/light theme toggle (top-right); dossier default is dark */
var THKEY='ipx-theme';
var savedTheme;try{savedTheme=localStorage.getItem(THKEY)}catch(e){}
if(savedTheme==='light')document.documentElement.classList.add('light');
var tbtn=document.createElement('button');
tbtn.className='themebtn';tbtn.type='button';tbtn.setAttribute('aria-label','Toggle light mode');
function _setThemeIcon(){tbtn.textContent=document.documentElement.classList.contains('light')?'☾':'☀'}
_setThemeIcon();
tbtn.onclick=function(){
  document.documentElement.classList.toggle('light');
  var light=document.documentElement.classList.contains('light');
  try{localStorage.setItem(THKEY,light?'light':'dark')}catch(e){}
  _setThemeIcon();
};
document.body.appendChild(tbtn);
})();