const RELEASE=new Date("2026-10-09T00:00:00+07:00");
const PHOTOS=[
 {src:"assets/adea-01.jpg",caption:"one of my favorite views ♡"},
 {src:"assets/adea-02.jpg",caption:"senyummu yang selalu aku suka."},
 {src:"assets/adea-03.jpg",caption:"cantikmu, dengan caramu sendiri."},
 {src:"assets/adea-04.jpg",caption:"one more memory to keep."},
 {src:"assets/adea-05.jpg",caption:"semoga masih banyak cerita setelah ini."},
 {src:"assets/memory-06.jpg",caption:"little moments I want to remember."},
 {src:"assets/memory-07.jpg",caption:"that face I could never get tired of."},
 {src:"assets/memory-08.jpg",caption:"another favorite little moment."},
 {src:"assets/memory-09.jpg",caption:"keep this one close ♡"}
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const params=new URLSearchParams(location.search), preview=params.get("preview")==="1";

window.addEventListener("load",()=>{
  setTimeout(()=>$("#preloader").classList.add("done"),700);
  setTimeout(()=>$("#typeLine").textContent="Comelll...",900);
});
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window._t);window._t=setTimeout(()=>x.classList.remove("show"),2500)}
function go(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"});$("#menu").classList.remove("open")}
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
$("#menuBtn").addEventListener("click",()=>$("#menu").classList.toggle("open"));
document.addEventListener("click",e=>{if(!e.target.closest("#menu")&&!e.target.closest("#menuBtn"))$("#menu").classList.remove("open")});

// ambience
for(let i=0;i<130;i++){let s=document.createElement("i");s.className="star";s.style.left=Math.random()*100+"%";s.style.top=Math.random()*100+"%";s.style.setProperty("--d",(1+Math.random()*4)+"s");$("#stars").appendChild(s)}
for(let i=0;i<18;i++){let p=document.createElement("i");p.className="petal";p.style.left=Math.random()*100+"%";p.style.setProperty("--d",(8+Math.random()*10)+"s");p.style.animationDelay=(-Math.random()*12)+"s";$("#petals").appendChild(p)}
document.addEventListener("pointermove",e=>{let g=$(".cursor-glow");g.style.left=e.clientX+"px";g.style.top=e.clientY+"px"});

// countdown
function tick(){
 const d=RELEASE-Date.now();
 if(preview||d<=0){$("#enterBtn").disabled=false;$("#countdown").textContent="00 : 00 · OPEN";return}
 const days=Math.floor(d/86400000),h=Math.floor(d/3600000)%24,m=Math.floor(d/60000)%60,s=Math.floor(d/1000)%60;
 $("#countdown").textContent=`${String(days).padStart(2,"0")} : ${String(h).padStart(2,"0")} : ${String(m).padStart(2,"0")} : ${String(s).padStart(2,"0")}`;
}
setInterval(tick,1000);tick();
$("#enterBtn").addEventListener("click",()=>{go("hero");startMusic()});
$("#previewBtn").addEventListener("click",()=>go("hero"));

// section progress
const scenes=$$(".scene"), num=$("#sectionNumber");
const io=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.isIntersecting){e.target.querySelectorAll(".cinematic").forEach(x=>x.classList.add("visible"));let n=scenes.indexOf(e.target)+1;num.textContent=String(n).padStart(2,"0")}
}),{threshold:.18});
scenes.forEach(s=>io.observe(s));

// music
const music=$("#music");
async function startMusic(){try{await music.play();$("#musicBtn").innerHTML="♫ <span>Music ON</span>"}catch{toast("Tambahkan assets/music.mp3 untuk musik.")}}
$("#musicBtn").addEventListener("click",()=>music.paused?startMusic():(music.pause(),$("#musicBtn").innerHTML="♫ <span>Music</span>"));

// mission
let found=0;
function move(dir){
 let x=+($("#panda").dataset.x||48),y=+($("#panda").dataset.y||11);
 if(dir==="left")x-=6;if(dir==="right")x+=6;if(dir==="up")y+=5;if(dir==="down")y-=5;
 x=Math.max(7,Math.min(93,x));y=Math.max(7,Math.min(70,y));$("#panda").dataset.x=x;$("#panda").dataset.y=y;$("#panda").style.left=x+"%";$("#panda").style.bottom=y+"%";check()
}
$$(".game-controls button").forEach(b=>b.addEventListener("click",()=>move(b.dataset.dir)));
document.addEventListener("keydown",e=>{let m={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"};if(m[e.key])move(m[e.key])});
let tx=0,ty=0;$("#game").addEventListener("touchstart",e=>{tx=e.changedTouches[0].clientX;ty=e.changedTouches[0].clientY},{passive:true});
$("#game").addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.max(Math.abs(dx),Math.abs(dy))<25)return;move(Math.abs(dx)>Math.abs(dy)?dx>0?"right":"left":dy>0?"down":"up")},{passive:true});
function foundOne(h){
  if(h.classList.contains("found"))return;
  h.classList.add("found");
  found++;
  $("#found").textContent=found;
  if(found===3){
    setTimeout(()=>{
      $("#giftReveal").classList.add("show");
      $("#giftReveal").setAttribute("aria-hidden","false");
      toast("Panda menemukan semua hati ♡ Ada hadiah untukmu...");
    },450);
  }
}
function check(){
  let p=$("#panda").getBoundingClientRect();
  $$(".heart-target:not(.found)").forEach(h=>{
    let r=h.getBoundingClientRect();
    if(Math.hypot((p.left+p.right)/2-(r.left+r.right)/2,(p.top+p.bottom)/2-(r.top+r.bottom)/2)<75)foundOne(h);
  });
}
$$(".heart-target").forEach(h=>h.addEventListener("click",()=>foundOne(h)));

// birthday gift → cake → candle blow → grand celebration
let giftOpened=false, candleBlown=false;
$("#openGift").addEventListener("click",()=>{
  if(giftOpened)return;
  giftOpened=true;
  $("#openGift").classList.add("opened");
  $("#openGift").disabled=true;
  setTimeout(()=>{
    $(".gift-intro").style.display="none";
    $("#cakeReveal").classList.add("show");
    $("#cakeReveal").setAttribute("aria-hidden","false");
    toast("Satu kue kecil khusus untuk Comelll 🎂");
  },650);
});

$("#blowCandle").addEventListener("click",()=>{
  if(candleBlown)return;
  candleBlown=true;
  $("#cakePanda").classList.add("blowing");
  for(let i=0;i<4;i++){
    const puff=document.createElement("i");puff.className="blow-puff";puff.style.setProperty("--delay",(i*.11)+"s");
    $(".cake-scene").appendChild(puff);
    setTimeout(()=>puff.remove(),1100);
  }
  $("#blowCandle").disabled=true;
  $("#candleMessage").textContent="Panda meniup lilinnya... make a wish ♡";
  setTimeout(()=>{
    $("#flame").classList.add("off");
    $("#candleMessage").textContent="Wish made! Happy Birthday, my Comelll ♡";
    $("#cakePanda").classList.remove("blowing");
    setTimeout(startCelebration,650);
  },1050);
});

function startCelebration(){
  $("#cakeReveal").classList.remove("show");
  $("#celebration").classList.add("show");
  $("#celebration").setAttribute("aria-hidden","false");
  makeBalloons();
  makeConfetti();
  makeCelebrationFireworks();
  setTimeout(()=>toast("Happy Birthday, Adea! 🎂✨"),350);
}
function makeBalloons(){
  const box=$("#balloonField");
  box.innerHTML="";
  for(let i=0;i<18;i++){
    const b=document.createElement("i");b.className="balloon";
    b.style.left=(2+Math.random()*96)+"%";
    b.style.setProperty("--rise",(7+Math.random()*5)+"s");
    b.style.setProperty("--delay",(Math.random()*2.4)+"s");
    box.appendChild(b);
  }
}
function makeConfetti(){
  const box=$("#balloonField");
  for(let i=0;i<75;i++){
    const c=document.createElement("i");c.className="confetti";
    c.style.left=Math.random()*100+"%";
    c.style.setProperty("--fall",(4+Math.random()*5)+"s");
    c.style.setProperty("--delay",(Math.random()*2)+"s");
    c.style.setProperty("--rot",(Math.random()*360)+"deg");
    box.appendChild(c);
  }
}
function makeCelebrationFireworks(){
  const box=$("#celebrationFireworks");box.innerHTML="";
  for(let k=0;k<14;k++){
    const burst=document.createElement("div");burst.className="firework-burst";
    burst.style.left=(5+Math.random()*90)+"%";burst.style.top=(7+Math.random()*57)+"%";
    burst.style.setProperty("--delay",(k*.22+Math.random()*.25)+"s");
    const count=22+Math.floor(Math.random()*8);
    for(let i=0;i<count;i++){
      const s=document.createElement("i");s.className="firework-spark";
      const a=i*Math.PI*2/count;const r=55+Math.random()*105;
      s.style.setProperty("--angle",(a*180/Math.PI)+"deg");
      s.style.setProperty("--x",Math.cos(a)*r+"px");
      s.style.setProperty("--y",Math.sin(a)*r+"px");
      burst.appendChild(s);
    }
    box.appendChild(burst);
  }
}
$("#celebrationNext").addEventListener("click",()=>{
  $("#giftReveal").classList.remove("show");
  $("#giftReveal").setAttribute("aria-hidden","true");
  $("#missionNext").classList.remove("hidden");
});

// gallery
let gi=0,modal=$("#galleryModal");
function openGallery(i){gi=(i+PHOTOS.length)%PHOTOS.length;$("#modalImg").src=PHOTOS[gi].src;$("#modalCaption").textContent=PHOTOS[gi].caption;$("#memoryCounter").textContent=String(gi+1).padStart(2,"0");modal.classList.add("open")}
$$(".memory-stage [data-index]").forEach(b=>b.addEventListener("click",()=>openGallery(+b.dataset.index)));
$("#modalClose").addEventListener("click",()=>modal.classList.remove("open"));
$("#modalPrev").addEventListener("click",()=>openGallery(gi-1));$("#modalNext").addEventListener("click",()=>openGallery(gi+1));
document.addEventListener("keydown",e=>{if(!modal.classList.contains("open"))return;if(e.key==="Escape")modal.classList.remove("open");if(e.key==="ArrowLeft")openGallery(gi-1);if(e.key==="ArrowRight")openGallery(gi+1)});

// videos — cinematic filmstrip, supports mixed vertical + landscape clips
const VIDEO_LIST=[
 {src:"assets/video-01.mp4",poster:"assets/video-01.jpg",title:"the first little memory"},
 {src:"assets/video-02.mp4",poster:"assets/video-02.jpg",title:"a little moment"},
 {src:"assets/video-03.mp4",poster:"assets/video-03.jpg",title:"just you being you"},
 {src:"assets/video-04.mp4",poster:"assets/video-04.jpg",title:"one more memory"},
 {src:"assets/video-05.mp4",poster:"assets/video-05.jpg",title:"that smile ♡"},
 {src:"assets/video-06.mp4",poster:"assets/video-06.jpg",title:"a tiny piece of us"},
 {src:"assets/video-07.mp4",poster:"assets/video-07.jpg",title:"another favorite"},
 {src:"assets/video-08.mp4",poster:"assets/video-08.jpg",title:"keep this moment"},
 {src:"assets/video-09.mp4",poster:"assets/video-09.jpg",title:"a little story"},
 {src:"assets/video-10.mp4",poster:"assets/video-10.jpg",title:"one for the memories"},
 {src:"assets/video-11.mp4",poster:"assets/video-11.jpg",title:"and another ♡"}
];
const vid=$("#loveVideo"),ve=$("#videoEmpty"),videoSource=$("#loveVideoSource"),videoTitle=$("#videoTitle"),videoCounter=$("#videoCounter");
function selectVideo(i,autoplay=false){
  const item=VIDEO_LIST[(i+VIDEO_LIST.length)%VIDEO_LIST.length];
  $$(".video-thumb").forEach((b,n)=>b.classList.toggle("active",n===((i+VIDEO_LIST.length)%VIDEO_LIST.length)));
  const activeThumb=$$(".video-thumb")[(i+VIDEO_LIST.length)%VIDEO_LIST.length];
  if(activeThumb && autoplay) activeThumb.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
  videoSource.src=item.src; vid.poster=item.poster; videoTitle.textContent=item.title; videoCounter.textContent=String((i+VIDEO_LIST.length)%VIDEO_LIST.length+1).padStart(2,"0");
  vid.load(); ve.style.display="grid";
  if(autoplay){vid.play().then(()=>ve.style.display="none").catch(()=>{});}
}
vid.addEventListener("loadeddata",()=>ve.style.display="none");
vid.addEventListener("error",()=>ve.style.display="grid");
$("#videoPlay").addEventListener("click",()=>{vid.play().then(()=>ve.style.display="none").catch(()=>toast("Video belum siap diputar."))});
$$('.video-thumb').forEach(b=>b.addEventListener('click',()=>selectVideo(+b.dataset.video,true)));
vid.addEventListener('play',()=>{if(!$("#music").paused) $("#music").pause();});
vid.addEventListener('ended',()=>{if(!$("#music").paused) return; /* keep the birthday track quiet after a video until the user chooses Music */});
selectVideo(0,false);

// letter
$("#openLetter").addEventListener("click",()=>{
 const envelope=$("#letterEnvelope"), letter=$("#letter"), paper=$("#letterPaper"), next=$("#letterNext"), btn=$("#openLetter");
 if(envelope.classList.contains("opening")) return;
 btn.disabled=true;
 envelope.classList.add("opening");
 setTimeout(()=>{
   letter.classList.add("glowing");
 },420);
 setTimeout(()=>{
   envelope.classList.add("hidden");
   paper.classList.add("show");
 },1050);
 setTimeout(()=>{
   next.classList.remove("hidden");
 },1850);
});

// fireworks
function fireworks(){
 const box=$("#fireworks");
 for(let k=0;k<8;k++){
  const cx=15+Math.random()*70,cy=18+Math.random()*45;
  for(let i=0;i<18;i++){
   const s=document.createElement("i");s.className="spark";s.style.left=cx+"%";s.style.top=cy+"%";
   const a=i*Math.PI*2/18,r=50+Math.random()*75;s.style.setProperty("--x",Math.cos(a)*r+"px");s.style.setProperty("--y",Math.sin(a)*r+"px");s.style.animationDelay=(k*.22)+"s";box.appendChild(s);
  }
 }
}
$("#openSurprise").addEventListener("click",()=>{
 $("#secret").classList.add("show");$("#openSurprise").textContent="♡ Opened";$("#openSurprise").disabled=true;$("#finalNext").classList.remove("hidden");fireworks();
});
$("#restart").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

// Love-note interaction: the zig-zag stays intact, while the selected card
// rises above the others so its full message is always readable.
const reasonCards = $$(".things .reason-card");
reasonCards.forEach(card=>{
  card.setAttribute("tabindex","0");
  card.setAttribute("role","button");
  const activate=()=>{
    reasonCards.forEach(c=>c.classList.remove("is-active"));
    card.classList.add("is-active");
  };
  card.addEventListener("mouseenter",()=>{
    if(window.matchMedia("(hover:hover)").matches) activate();
  });
  card.addEventListener("focus",activate);
  card.addEventListener("click",e=>{
    e.stopPropagation();
    if(card.classList.contains("is-active")) card.classList.remove("is-active");
    else activate();
  });
});
document.addEventListener("click",e=>{
  if(!e.target.closest(".things .reason-card")) reasonCards.forEach(c=>c.classList.remove("is-active"));
});
