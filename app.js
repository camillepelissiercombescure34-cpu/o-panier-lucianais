(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
document.documentElement.className='js';

var KEY='opl_consent_v1',TTL=15552000000,mem=null;
var cc=$('cc'),mh=$('mapph'),mw=$('mapwrap');
function getC(){try{var v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&typeof v.t==='number'&&Date.now()-v.t<TTL)return v}catch(e){}return mem}
function setC(m){mem={maps:!!m,t:Date.now()};try{localStorage.setItem(KEY,JSON.stringify(mem))}catch(e){}apply()}
function clearC(){mem=null;try{localStorage.removeItem(KEY)}catch(e){}apply()}
function banner(on){if(!cc)return;if(on){cc.hidden=false;requestAnimationFrame(function(){requestAnimationFrame(function(){cc.classList.add('show')})})}else{cc.classList.remove('show');setTimeout(function(){if(!cc.classList.contains('show'))cc.hidden=true},260)}}
function map(on){if(!mw)return;var fr=$('mapfr');if(on&&!fr){var f=document.createElement('iframe');f.id='mapfr';f.title='Carte Google Maps : O Panier Lucianais, 4 avenue du Quai, Saint-Saturnin-de-Lucian';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');f.src='https://www.google.com/maps?q='+encodeURIComponent('O Panier Lucianais, 4 Av. du Quai, 34725 Saint-Saturnin-de-Lucian')+'&hl=fr&z=17&output=embed';mw.appendChild(f);mh.hidden=true}else if(!on&&fr){fr.remove();mh.hidden=false}}
function apply(){var c=getC();banner(!c);map(!!(c&&c.maps))}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('[data-cc]'):null;if(!t)return;var a=t.getAttribute('data-cc');if(a==='yes')setC(true);else if(a==='no')setC(false);else clearC()});
apply();

if(!$('f'))return;

var DAYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
var AM=[480,750],PM=[960,1170];
var H={0:[AM],1:[],2:[AM,PM],3:[AM,PM],4:[AM,PM],5:[AM,PM],6:[AM,PM]};
function fmt(m){var h=Math.floor(m/60),n=m%60;return h+' h'+(n?' '+(n<10?'0':'')+n:'')}
function paris(){var p={};new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Paris',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});return {d:{Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[p.weekday],m:(+p.hour)*60+(+p.minute)}}
function status(n){var s=H[n.d],i;for(i=0;i<s.length;i++){if(n.m>=s[i][0]&&n.m<s[i][1])return {open:true,txt:'Ouvert · jusqu’à '+fmt(s[i][1])}}for(i=0;i<s.length;i++){if(n.m<s[i][0])return {open:false,txt:'Fermé · ouvre à '+fmt(s[i][0])}}for(i=1;i<=7;i++){var d=(n.d+i)%7;if(H[d].length)return {open:false,txt:'Fermé · ouvre '+(i===1?'demain':DAYS[d])+' à '+fmt(H[d][0][0])}}return null}
try{var now=paris(),st=status(now);if(st){$('st').className='pill '+(st.open?'open':'closed');$('stt').textContent=st.txt}$('d'+now.d).className='today'}catch(e){}

var io=null;
if('IntersectionObserver' in window){io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -80px 0px',threshold:.08})}
function reveal(el){if(io)io.observe(el);else el.classList.add('on')}
var g=$('gal');
Array.prototype.forEach.call(g.querySelectorAll('figure'),function(fg){var im=fg.querySelector('img');if(im.complete&&im.naturalWidth===0){fg.remove();return}im.addEventListener('error',function(){fg.remove()});reveal(fg)});
var OPT=[['boutique.jpg','Intérieur de l’épicerie : voûtes anciennes, carreaux de ciment, rayons en bois, vins et huile d’olive','Dans la boutique',true],['fromage-berger.jpg','La tartine du Berger, fromage au lait cru de brebis, origine Aveyron','Fromage de brebis d’Aveyron',false],['porc.jpg','Côte de porc conditionnée sous vide','Côte de porc',false],['tarte-oignon.jpg','Tartelette à l’oignon et aux anchois','Tartelette oignon et anchois',false]];
OPT.forEach(function(p){var im=new Image();im.onload=function(){var fg=document.createElement('figure');fg.className='pic'+(im.naturalWidth>im.naturalHeight?' wide':'');im.alt=p[1];im.loading='lazy';im.decoding='async';fg.appendChild(im);var c=document.createElement('figcaption');c.textContent=p[2];fg.appendChild(c);if(p[3])g.insertBefore(fg,g.firstChild);else g.appendChild(fg);reveal(fg)};im.src='photos/'+p[0]});

var f=$('f'),err=$('err'),res=$('res'),acts=$('actions'),go=$('go'),last=0,NL=String.fromCharCode(10);
var d0=new Date();d0.setMinutes(d0.getMinutes()-d0.getTimezoneOffset());
var today=d0.toISOString().slice(0,10);$('jour').min=today;
function clean(s,max){var o='',i,c,ch;s=String(s||'');for(i=0;i<s.length&&o.length<max*3;i++){c=s.charCodeAt(i);ch=s.charAt(i);if(ch==='<'||ch==='>')continue;o+=(c<32||c===127)?' ':ch}return o.split(' ').filter(Boolean).join(' ').slice(0,max)}
function tel10(t){var o='',i;for(i=0;i<t.length;i++){if('0123456789+'.indexOf(t.charAt(i))>-1)o+=t.charAt(i)}if(o.indexOf('+33')===0)o='0'+o.slice(3);else if(o.indexOf('0033')===0)o='0'+o.slice(4);return /^0[1-9][0-9]{8}$/.test(o)?o:''}
function fail(m){err.textContent=m;res.style.display='none';acts.textContent=''}
f.addEventListener('submit',function(e){
 e.preventDefault();
 var t=Date.now();
 if(go.disabled||t-last<3000)return;
 var type=f.elements.type.value==='Réservation'?'Réservation':'Commande';
 var nom=clean($('nom').value,40),tel=tel10(clean($('tel').value,20)),jour=$('jour').value,pm=$('cren').value==='a',liste=clean($('liste').value,600);
 if(!nom)return fail('Indiquez votre prénom.');
 if(!tel)return fail('Numéro de téléphone français invalide.');
 if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(jour)||jour<today)return fail('Choisissez un jour valide.');
 var wd=new Date(jour+'T12:00:00').getDay();
 if(wd===1)return fail('L’épicerie est fermée le lundi.');
 if(wd===0&&pm)return fail('Le dimanche, l’épicerie ouvre seulement le matin.');
 if(liste.length<3)return fail('Indiquez votre liste.');
 err.textContent='';last=t;go.disabled=true;setTimeout(function(){go.disabled=false},4000);
 var p=jour.split('-'),tf=tel.replace(/(..)(?=.)/g,'$1 ');
 var msg=type+' O’ Panier Lucianais'+NL+'Prénom : '+nom+NL+'Tél : '+tf+NL+'Retrait : '+p[2]+'/'+p[1]+'/'+p[0]+(pm?' (après-midi)':' (matin)')+NL+'Liste : '+liste;
 res.textContent=msg;res.style.display='block';acts.textContent='';
 var a=document.createElement('a');a.className='btn';a.textContent='Envoyer par SMS';a.href='sms:+33680916372?&body='+encodeURIComponent(msg);
 var m=document.createElement('a');m.className='btn ghost';m.textContent='Envoyer par e-mail';m.href='mailto:opanierlucianais@gmail.com?subject='+encodeURIComponent(type+' – '+nom)+'&body='+encodeURIComponent(msg);
 var b=document.createElement('button');b.type='button';b.className='btn ghost';b.textContent='Copier le message';
 b.addEventListener('click',function(){try{navigator.clipboard.writeText(msg).then(function(){b.textContent='Copié ✓'},function(){b.textContent='Copiez le texte ci-dessus'})}catch(x){b.textContent='Copiez le texte ci-dessus'}});
 acts.appendChild(a);acts.appendChild(m);acts.appendChild(b);
});
})();
