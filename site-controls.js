(()=>{
"use strict";
const here=location.pathname,home=!here.includes("/projetos/"),base=home?"":"../";
let lang=new URLSearchParams(location.search).get("lang");
try{if(!["pt","en","es"].includes(lang))lang=localStorage.getItem("wabner-lang")}catch(e){}
if(!["pt","en","es"].includes(lang))lang="pt";
let theme="light";try{if(localStorage.getItem("wabner-theme")==="dark")theme="dark"}catch(e){}
document.documentElement.lang=lang==="pt"?"pt-BR":lang;
document.documentElement.setAttribute("data-theme",theme);
const names={
 pt:["Idioma do site","Ativar modo escuro","Ativar modo claro"],
 en:["Site language","Switch to dark mode","Switch to light mode"],
 es:["Idioma del sitio","Activar modo oscuro","Activar modo claro"]
};
const shared={
 "Trabalhos":["Work","Proyectos"],"Prática":["Approach","Enfoque"],"Sobre":["About","Sobre mí"],"Contato":["Contact","Contacto"],
 "Organização":["Company","Organización"],"Meu papel":["My role","Mi función"],"Foco":["Focus","Enfoque"],
 "Resultados relatados":["Reported results","Resultados comunicados"],
 "← Todos os trabalhos":["← All projects","← Todos los proyectos"],"← Todos os projetos":["← All projects","← Todos los proyectos"],
 "← Voltar ao índice":["← Back to index","← Volver al índice"],"← Índice de projetos":["← Project index","← Índice de proyectos"],
 "Voltar ao início ↑":["Back to top ↑","Volver al inicio ↑"],
 "Design · estratégia · liderança · cultura":["Design · strategy · leadership · culture","Diseño · estrategia · liderazgo · cultura"],
 "↗ Ver estudo de caso":["↗ View case study","↗ Ver caso de estudio"],"Ver estudo de caso":["View case study","Ver caso de estudio"]
};
const sun='<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const moon='<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z"/></svg>';
function localize(){
 const map=Object.assign({},shared,window.WABNER_L10N||{});
 const title=document.title;if(map[title]&&lang!=="pt")document.title=map[title][lang==="en"?0:1];
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){
  return n.nodeValue.trim()&&!n.parentElement.closest("script,style,select,svg")?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
 }});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 const missing=[];
 for(const n of nodes){const full=n.nodeValue,original=full.trim(),translation=map[original]?.[lang==="en"?0:1];
 if(lang!=="pt"&&translation)n.nodeValue=full.replace(original,translation);
 if(lang!=="pt"&&!translation&&original.length>35&&/[ãõçáéíóúâêôà]/i.test(original))missing.push(original);
 }
 if(lang!=="pt"&&missing.length)console.info("Untranslated source strings:",missing);
 const description=document.querySelector('meta[name="description"]');
 if(description&&window.WABNER_META&&lang!=="pt"){description.content=window.WABNER_META[lang];}
 for(const a of document.querySelectorAll('a[href]')){let url;try{url=new URL(a.getAttribute("href"),location.href)}catch(e){continue}
 if(url.origin!==location.origin||!url.pathname.endsWith(".html"))continue;
 if(lang==="pt")url.searchParams.delete("lang");else url.searchParams.set("lang",lang);
 a.setAttribute("href",url.pathname+url.search+url.hash);
 }
}
function addControls(){
 const nav=document.querySelector(".nav");if(!nav)return;
 const area=document.createElement("div");area.className="site-settings";
 const selector=document.createElement("select");selector.className="site-lang";selector.setAttribute("aria-label",names[lang][0]);
 [["pt","PT"],["en","EN"],["es","ES"]].forEach(([key,label])=>{
 const option=document.createElement("option");option.value=key;option.textContent=label;option.selected=key===lang;selector.appendChild(option);
 });
 selector.addEventListener("change",()=>{
 try{localStorage.setItem("wabner-lang",selector.value)}catch(e){}
 const url=new URL(location.href);if(selector.value==="pt")url.searchParams.delete("lang");else url.searchParams.set("lang",selector.value);
 location.assign(url.pathname+url.search+url.hash);
 });
 const toggle=document.createElement("button");toggle.type="button";toggle.className="site-theme";
 function update(){toggle.innerHTML=theme==="dark"?sun:moon;toggle.setAttribute("aria-label",names[lang][theme==="dark"?2:1]);toggle.title=toggle.getAttribute("aria-label");toggle.setAttribute("aria-pressed",theme==="dark"?"true":"false")}
 toggle.addEventListener("click",()=>{theme=theme==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",theme);try{localStorage.setItem("wabner-theme",theme)}catch(e){}update()});update();
 area.append(selector,toggle);nav.insertAdjacentElement("afterend",area);
}
const localeFile=home?"home":here.split("/").pop().replace(/\.html$/,"");
const script=document.createElement("script");script.src=base+"translations/"+localeFile+".js";
script.onload=()=>{localize();addControls()};script.onerror=()=>{console.error("Translations not found",localeFile);addControls()};document.head.appendChild(script);
})();