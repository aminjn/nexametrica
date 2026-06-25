// @ts-nocheck
/* eslint-disable */
/**
 * AUTO-PORTED from `project/Nexa Metrica.dc.html` (the approved Claude Design
 * prototype's <script data-dc-script> Component class).
 *
 * The data, i18n strings, role/nav config, view-models (vm_*), the chart engine
 * and renderVals() are preserved VERBATIM. Only the React.Component-style base
 * (DCLogic) was swapped for a tiny observable `Logic` base, so the exact same
 * logic now drives a real Vite + React app instead of the design runtime.
 *
 * Regenerate with: node scripts/extract-engine.mjs
 */
import React from 'react'

class Logic {
  constructor() {
    this.state = {}
    this._subs = new Set()
  }
  // Supports both object and updater-fn forms, like React's setState.
  setState(update, cb) {
    const patch = typeof update === 'function' ? update(this.state) : update
    if (patch) this.state = { ...this.state, ...patch }
    this._subs.forEach((s) => s())
    if (cb) cb()
  }
  subscribe(fn) {
    this._subs.add(fn)
    return () => this._subs.delete(fn)
  }
  forceUpdate() {
    this._subs.forEach((s) => s())
  }
}

class Engine extends Logic {
  state = { page:'dashboard', lang:'fa', ai:false, aiTab:'chat', aiInput:'', thread:[],
    persona:{ style:'attack', depth:'detailed', focus:'tactical' }, why:{}, scoutScope:'team', role:'senior', roleMenu:false, sysTab:'overview', tacTab:'heatmap', repType:'team', showcase:false, scoutView:'list', scoutPos:'all', bookmarks:{}, profileIdx:7, profileMenu:false,
    navCollapsed:{}, leagueSearch:'', leaguePos:'all', leagueTeam:'all', leagueSort:{ key:'rate', dir:'desc' }, profileSel:null, activeLeagues:['pg'], nutritionAppr:{}, schedMonth:0,
    ldbView:'myteam', leagueInput:'', customLeagues:[], fetchingLeague:'', teamSessions:null, teamSessionSel:0 };

  ROLES = {
    senior:  { fa:'آنالیزور ارشد', en:'Senior Analyst', name:'کاوه مرادی', nameEn:'Kaveh Moradi', ini:'ک.م', color:'#a3e635', home:'dashboard',
      pages:['dashboard','library','gamecloud','model','player','coding','matrix','dataint','telestration','tactical','physical','scouting','leaguedb','transfer','schedule','training','nutrition','reports','clips','sharing','assistant','settings'] },
    analyst: { fa:'آنالیزور', en:'Analyst', name:'رضا فلاح', nameEn:'R. Fallah', ini:'ر.ف', color:'#4ade80', home:'library',
      pages:['dashboard','library','player','coding','matrix','dataint','telestration','tactical','physical','leaguedb','schedule','training','nutrition','clips','sharing','assistant'] },
    coach:   { fa:'مربی', en:'Coach', name:'سارا عظیمی', nameEn:'S. Azimi', ini:'س.ع', color:'#38bdf8', home:'dashboard',
      pages:['dashboard','telestration','tactical','physical','scouting','leaguedb','transfer','schedule','training','nutrition','clips','reports','sharing','assistant'] },
    player:  { fa:'بازیکن', en:'Player', name:'امیر حسینی', nameEn:'A. Hosseini', ini:'ا.ح', color:'#f59e0b', home:'profile',
      pages:['profile','physical','schedule','training','nutrition','clips','sharing','assistant'] },
    admin:   { fa:'مدیر باشگاه', en:'Club Admin', name:'بهرام نیک‌پور', nameEn:'B. Nikpour', ini:'ب.ن', color:'#c084fc', home:'dashboard',
      pages:['dashboard','gamecloud','model','leaguedb','schedule','training','nutrition','reports','sharing','settings'] },
    super:   { fa:'سوپر ادمین', en:'Super Admin', name:'مدیر سامانه نکسا', nameEn:'Nexa Sysadmin', ini:'SA', color:'#f43f5e', home:'sysadmin',
      pages:['sysadmin','dashboard','gamecloud','model','settings'] },
  };
  setRole = (r)=>{ const home=this.ROLES[r].home; this.setState({ role:r, page:home, roleMenu:false, ai:false }); };
  toggleRoleMenu = ()=> this.setState({ roleMenu: !this.state.roleMenu });
  setSysTab = (t)=> this.setState({ sysTab:t });
  setTacTab = (t)=> this.setState({ tacTab:t });
  setRepType = (t)=> this.setState({ repType:t });
  toggleShowcase = ()=> this.setState({ showcase: !this.state.showcase });
  setScoutView = (v)=> this.setState({ scoutView:v });
  toggleNavGroup = (i)=> this.setState(s=>{ const c={...s.navCollapsed}; c[i]=!c[i]; return { navCollapsed:c }; });
  onLeagueSearch = (e)=> this.setState({ leagueSearch:e.target.value });
  setLeaguePos = (p)=> this.setState({ leaguePos:p });
  setLeagueTeam = (t)=> this.setState({ leagueTeam:t });
  viewPlayer = (sel)=> this.setState({ profileSel:sel, page:'profile' });
  addLeague = ()=> this.setState(s=>{ const avail=this.LEAGUES.map(l=>l.id).filter(id=>!s.activeLeagues.includes(id)); return avail.length? { activeLeagues:[...s.activeLeagues, avail[0]] } : {}; });
  goLdb = (v)=> this.setState({ page:'leaguedb', ldbView:v });
  onLeagueInput = (e)=> this.setState({ leagueInput:e.target.value });
  CITY = ['تهران','اصفهان','شیراز','تبریز','مشهد','اهواز','کرمان','رشت','یزد','قم','همدان','اردبیل'];
  TPRE = ['اتحاد','شاهین','پاس','سپاهان','ذوب‌آهن','نفت','فولاد','استقلال','مس','صنعت'];
  genLeagueTeams(name){ const s=name.length; return Array.from({length:4},(_,i)=>this.TPRE[(s+i*3)%this.TPRE.length]+' '+this.CITY[(s+i*5)%this.CITY.length]); }
  addLeagueByName = ()=>{ const name=(this.state.leagueInput||'').trim(); if(!name) return;
    const lc=name.toLowerCase();
    const known=this.LEAGUES.find(l=>l.name.includes(name)||name.includes(l.name)||l.nameEn.toLowerCase().includes(lc)||lc.includes(l.nameEn.toLowerCase()));
    const id = known? known.id : 'custom:'+Date.now();
    if(this.state.activeLeagues.includes(id)){ this.setState({ leagueInput:'' }); return; }
    // simulate AI fetch
    this.setState({ fetchingLeague:name, leagueInput:'' });
    setTimeout(()=>{ this.setState(s=>{ const add={ activeLeagues:[...s.activeLeagues, id], fetchingLeague:'' };
      if(!known) add.customLeagues=[...s.customLeagues, { id, name, nameEn:name, teams:this.genLeagueTeams(name), custom:true }];
      return add; }); }, 1100); };
  removeLeague = (id)=> this.setState(s=>({ activeLeagues:s.activeLeagues.filter(x=>x!==id), leagueTeam: s.leagueTeam.indexOf(id)>=0?'all':s.leagueTeam }));
  setLeagueSort = (k)=> this.setState(s=>({ leagueSort: s.leagueSort.key===k ? { key:k, dir: s.leagueSort.dir==='asc'?'desc':'asc' } : { key:k, dir:'desc' } }));
  setProfile = (i)=> this.setState({ profileIdx:i, profileMenu:false });
  toggleProfileMenu = ()=> this.setState({ profileMenu: !this.state.profileMenu });
  setScoutPos = (p)=> this.setState({ scoutPos:p });
  toggleBookmark = (id)=> this.setState(s=>{ const b={...s.bookmarks}; b[id]=!b[id]; return { bookmarks:b }; });

  setScope = (s)=> this.setState({ scoutScope:s });

  toggleWhy = (id)=> this.setState(s=>({ why:{ ...s.why, [id]: !s.why[id] } }));
  isWhy(id){ return !!this.state.why[id]; }
  mkAI(id, text, explain){ const fa=this.state.lang==='fa'; const open=this.isWhy(id);
    return { id, text, explain, open, onWhy:()=>this.toggleWhy(id),
      whyLabel: open?(fa?'بستن توضیح':'Hide explanation'):(fa?'چرا این تحلیل؟':'Why this?') }; }

  C = { ac:'#a3e635', ai:'#38bdf8', warn:'#f59e0b', dng:'#ef4444', good:'#4ade80',
        tx:'#e7e9ec', sub:'#9097a0', mut:'#646b74', grid:'rgba(255,255,255,.06)', card:'#16191c', raised:'#21262e' };

  h(tag, props, ...kids){ return React.createElement(tag, props||{}, ...kids.flat().filter(k=>k!==null&&k!==undefined&&k!==false)); }
  faN(s){ const m={'0':'۰','1':'۱','2':'۲','3':'۳','4':'۴','5':'۵','6':'۶','7':'۷','8':'۸','9':'۹'}; return String(s).replace(/[0-9]/g,d=>this.state.lang==='fa'?m[d]:d); }

  // ============ NAV ============
  NAV = [
    { fa:'اصلی', en:'MAIN', items:[
      { id:'dashboard', fa:'داشبورد', en:'Dashboard', icon:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
    ]},
    { fa:'ورودی و ابر', en:'INTAKE & CLOUD', items:[
      { id:'library', fa:'کتابخانه ویدیو', en:'Video Library', icon:'M3 4h18v16H3zM7 4v16M17 4v16M3 8h4M3 16h4M17 8h4M17 16h4' },
      { id:'gamecloud', fa:'فضای ابری و اعتبار', en:'GameCloud', icon:'M17.5 19a4.5 4.5 0 0 0 0-9h-.6A6 6 0 1 0 6 19h11.5z' },
      { id:'model', fa:'وضعیت مدل', en:'Model Status', icon:'M6 6h12v12H6zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3' },
    ]},
    { fa:'ردیابی و کدگذاری', en:'TRACKING & CODING', items:[
      { id:'player', fa:'پخش و ردیابی', en:'Player & Tracking', icon:'M5 3v18l15-9z', badge:'AI' },
      { id:'coding', fa:'کدگذاری', en:'Coding Pad', icon:'M8 6l-5 6 5 6M16 6l5 6-5 6M13 4l-2 16', badge:'AI' },
      { id:'matrix', fa:'تایم‌لاین و ماتریس', en:'Timeline & Matrix', icon:'M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18' },
      { id:'dataint', fa:'ادغام داده', en:'Data Integration', icon:'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1' },
    ]},
    { fa:'تاکتیک و تحلیل', en:'TACTICS', items:[
      { id:'telestration', fa:'رسم روی ویدیو', en:'Telestration', icon:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z' },
      { id:'tactical', fa:'آنالیز تاکتیکی', en:'Tactical', icon:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
      { id:'physical', fa:'آنالیز فیزیکی', en:'Physical', icon:'M22 12h-4l-3 9L9 3l-3 9H2' },
    ]},
    { fa:'بازیکن و اسکاوتینگ', en:'PLAYERS & SCOUTING', items:[
      { id:'profile', fa:'پروفایل بازیکن', en:'Player Profile', icon:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
      { id:'scouting', fa:'اسکاوتینگ', en:'Scouting', icon:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3' },
      { id:'leaguedb', fa:'بازیکنان و تیم‌های لیگ', en:'Players & League Teams', icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8', children:[
        { fa:'تیم من', en:'My Team', view:'myteam' },
        { fa:'لیگ', en:'League', view:'league' },
      ] },
      { id:'transfer', fa:'آنالیز خرید', en:'Transfer Analysis', icon:'M16 3h5v5M21 3l-9 9M8 3H3v5M3 3l9 9M16 21h5v-5M21 21l-9-9M8 21H3v-5M3 21l9-9', badge:'AI' },
      { id:'reports', fa:'گزارش‌ها', en:'Reports', icon:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 14h6M9 18h4' },
    ]},
    { fa:'برنامه‌ریزی و آماده‌سازی', en:'PLANNING & PREP', items:[
      { id:'schedule', fa:'برنامه بازی‌ها', en:'Match Schedule', icon:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
      { id:'training', fa:'برنامه تمرینی', en:'Training Plan', icon:'M6.5 6.5l11 11M5 8l-1.5-1.5a2 2 0 0 1 0-3l0 0a2 2 0 0 1 3 0L8 5M16 19l1.5 1.5a2 2 0 0 0 3 0l0 0a2 2 0 0 0 0-3L19 16', badge:'AI' },
      { id:'nutrition', fa:'تغذیه و تمرین اختصاصی', en:'Nutrition & Custom', icon:'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zM12 6v7M8.5 9.5h7', badge:'AI' },
    ]},
    { fa:'خروجی و ارتباط', en:'OUTPUT & COMMS', items:[
      { id:'clips', fa:'کلیپ و پلی‌لیست', en:'Clips & Playlists', icon:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
      { id:'sharing', fa:'اشتراک و فیدبک', en:'Sharing & Feedback', icon:'M18 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4' },
      { id:'assistant', fa:'دستیار هوشمند', en:'AI Assistant', icon:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', badge:'AI' },
    ]},
    { fa:'سیستم', en:'SYSTEM', items:[
      { id:'sysadmin', fa:'سوپر ادمین', en:'Super Admin', icon:'M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3zM9 12l2 2 4-4', badge:'SA' },
      { id:'settings', fa:'مدیریت و تنظیمات', en:'Settings', icon:'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M16 16h6' },
    ]},
  ];

  // ============ i18n ============
  STR = {
    fa: { brand:'نکسا متریکا', brandSub:'NEXA METRICA', userName:'کاوه مرادی', userRole:'آنالیزور ارشد', viewAs:'مشاهده به‌عنوان نقش',
      search:'جستجوی بازی، بازیکن، کلیپ…', langSwitch:'EN', assistant:'دستیار', team:'پارس تهران',
      season:'فصل ۱۴۰۳–۰۴', league:'لیگ برتر', export:'خروجی PDF', newAnalysis:'+ آنالیز جدید',
      lastMatch:'آخرین بازی', win:'برد', draw:'مساوی', loss:'باخت', vs:'مقابل', home:'خانه', away:'خارج',
      expGoals:'گل مورد انتظار', possession:'مالکیت توپ', pressInt:'شدت پرس', higherPress:'پرس فشرده‌تر از میانگین',
      xgTrendTitle:'روند گل مورد انتظار', lastN:'آخرین', matches:'بازی', xgFor:'به‌نفع', xgAgainst:'علیه',
      aiGenerated:'تولید هوش مصنوعی', confidence:'اطمینان', aiInsights:'بینش‌های هوش مصنوعی',
      approve:'تأیید تحلیل', correct:'اصلاح', teamForm:'فرم تیمی', recentSessions:'جلسات اخیر', viewAll:'مشاهده همه',
      aiName:'دستیار نکسا', aiPersonalized:'شخصی‌سازی‌شده برای شما', aiHello:'سلام کاوه! تحلیل بازی مقابل زاگرس آماده است. می‌خواهی از کجا شروع کنیم؟ (می‌دانم تمرکز تو روی فازهای حمله است)',
      quickQuestions:'سوال‌های سریع', askPlaceholder:'از دستیار بپرس…', aiAdapts:'دستیار با سبک فکری تو تطبیق پیدا می‌کند',
      dropTitle:'ویدیو را بکشید و رها کنید', dropSub:'پشتیبانی از فیلم موبایل و چندزاویه · MP4، MOV تا ۸K', chooseFile:'انتخاب فایل',
      totalVideos:'کل ویدیوها', processing:'در حال پردازش', storage:'فضای ذخیره', all:'همه', matchType:'بازی', trainingType:'تمرین', scoutType:'حریف', filter:'فیلتر',
      liveProcessing:'پردازش زنده‌ی هوش مصنوعی', aiWorking:'در حال کار',
      autoTracking:'ردیابی خودکار بازیکنان', eventTimeline:'تایم‌لاین رویدادها', syncedEvents:'سینک‌شده با ویدیو', detectedEvents:'رویدادهای تشخیص‌داده‌شده',
      livePost:'پس از بازی', liveTag:'تگ‌گذاری زنده', tagPalette:'پنل تگ‌ها', customCode:'قالب کد سفارشی', aiSuggests:'پیشنهاد هوش مصنوعی',
      aiTagHint:'۸ رویداد در ۲ دقیقه آینده شناسایی شد. برای تأیید گروهی کلیک کنید.',
      aiKeyMoments:'لحظات کلیدی پیشنهادی هوش مصنوعی', aiMarkedDraw:'AI این لحظات را برای رسم علامت زد', drawIt:'رسم', aiEval:'ارزیابی خودکار هوش مصنوعی',
      heatmap:'نقشه حرارتی', passNetwork:'شبکه پاس', formation:'آرایش', pitchControl:'کنترل فضا', pressTrans:'پرس و انتقال', fieldRadar:'رادار زمین', oopShape:'فاز خارج از مالکیت (OOP)',
      discoveredPatterns:'الگوهای کشف‌شده توسط AI', distance:'مسافت طی‌شده', sprints:'تعداد اسپرینت', topSpeed:'سرعت بیشینه', accelDecel:'شتاب/کاهش', workload:'بار کاری',
      speedZones:'مناطق سرعتی (km/h)', workloadTrend:'روند بار کاری', injuryRisk:'ریسک مصدومیت', acwr:'نسبت بار حاد/مزمن', player:'بازیکن', loadIdx:'شاخص بار',
      compare:'مقایسه', seasonForm:'فرم فصل', personalClips:'کلیپ‌های شخصی', skillRadar:'رادار مهارت',
      addMatch:'افزودن بازی', addLeague:'افزودن لیگ', matchDay:'روز بازی', trainDay:'روز تمرین', microcycle:'میکروسیکل هفتگی (MD)', perPlayerPlan:'برنامه‌ی تک‌به‌تک بازیکنان (AI)', focusArea:'محور تمرکز', recommendedDrill:'تمرین پیشنهادی', load:'بار', aiProposal:'پیشنهاد هوش مصنوعی', protein:'پروتئین', carbs:'کربوهیدرات', fat:'چربی', customDrill:'تمرین اختصاصی', approve:'تأیید', day:'روز',
      filters:'فیلترها', position:'پوزیشن', age:'سن', style:'سبک بازی', rating:'امتیاز', goals:'گل', assists:'پاس گل', scoutReport:'گزارش اسکاوتینگ',
      scopeTeam:'تیم خودی', scopeLeague:'کل لیگ', fromFilms:'بازیکن شناسایی‌شده از فیلم‌ها', club:'باشگاه', fromFilm:'از فیلم', similarPlayer:'بازیکن مشابه (پیشنهاد AI)', matchPct:'تطابق', filmsAnalyzed:'فیلم آنالیزشده',
      playerParams:'پارامترهای بازیکن', portfolio:'پورتفولیو و قرارداد', contractEnd:'پایان قرارداد', remaining:'باقی‌مانده', mlNote:'مدل قد، وزن، سن، پای برتر و قرارداد را در تحلیل سبک و ریسک لحاظ می‌کند', retainedForAll:'این داده‌ها برای همه‌ی بازیکنان شناسایی‌شده نگهداری می‌شود',
      rankings:'لیدربورد', byRating:'بر اساس امتیاز', scatterTitle:'اسکتر پلات', scatterSub:'xG/۹۰ در برابر پاس کلیدی/۹۰', shadowTeam:'تیم سایه', aiPicked:'انتخاب AI', shadowDesc:'بهترین ترکیب از اهداف نقل‌وانتقالاتی، انتخاب‌شده توسط هوش مصنوعی از روی فیلم‌های لیگ.', excelExport:'خروجی Excel',
      autoCut:'برش خودکار', playlists:'پلی‌لیست‌ها', presentMode:'حالت ارائه', shareWith:'اشتراک با بازیکن', newPlaylist:'پلی‌لیست جدید',
      matchSummary:'خلاصه بازی', teamVsTeam:'تیم مقابل تیم', downloadPdf:'دانلود PDF', us:'پارس تهران', them:'زاگرس اصفهان',
      chatHistory:'تاریخچه گفتگو', personalization:'شخصی‌سازی دستیار', learnedAbout:'دستیار از شما یاد گرفته', styleAxis:'سبک تحلیل', attacking:'تهاجمی', defensive:'دفاعی',
      depthAxis:'عمق تحلیل', brief:'خلاصه', detailed:'مفصل', focusAxis:'زاویه تحلیل', tacticalF:'تاکتیکی', statistical:'آماری', saveSettings:'ذخیره تنظیمات',
      modelAccuracy:'دقت مدل در طول زمان', gamesProcessed:'بازی پردازش‌شده', learningLevel:'سطح یادگیری از تیم', eventAccuracy:'دقت تشخیص رویداد', recentCorrections:'اصلاحات اخیر کاربر', feedsTraining:'به آموزش مدل کمک می‌کند',
      teams:'تیم‌ها', seasons:'فصل‌ها', usersRoles:'کاربران و دسترسی', general:'عمومی', name:'نام', role:'نقش', access:'دسترسی', language:'زبان رابط', addUser:'+ افزودن کاربر',
      playerInfo:'اطلاعات بازیکن', savePlayer:'ذخیره اطلاعات بازیکن', shirtNo:'شماره پیراهن', heightL:'قد (cm)', weightL:'وزن (kg)', footL:'پای برتر', natL:'ملیت', valueL:'ارزش بازار', editPlayer:'بازیکن برای ویرایش', addPlayer:'+ بازیکن جدید', playerInfoNote:'این اطلاعات پایه‌ی تحلیل‌های مدل است و در ارزیابی سبک و ریسک مصدومیت لحاظ می‌شود.',
      injuryHistory:'سابقه‌ی مصدومیت', records:'مورد', daysOut:'روز دوری', injuryDate:'تاریخ مصدومیت', injuryArea:'ناحیه', addInjury:'+ افزودن مصدومیت', selectTeam:'انتخاب تیم', ownTeam:'تیم خودی', leagueClubs:'باشگاه‌های لیگ',
      transferAnalysis:'آنالیز خرید', buyScore:'امتیاز خرید', recommend:'پیشنهاد', recBuy:'خرید توصیه می‌شود', recWatch:'زیرنظر بگیرید', recAvoid:'پرهیز', valueForMoney:'ارزش به قیمت', injuryRiskF:'ریسک مصدومیت', ageFactor:'سن', styleFit:'تناسب سبک', contractF:'وضعیت قرارداد', target:'هدف نقل‌وانتقالاتی', estCost:'هزینه برآوردی', addTarget:'+ هدف جدید',
      allPlayers:'همه بازیکنان', myTeam:'تیم من', leagues:'لیگ‌ها', addLeague:'افزودن لیگ', view:'نمایش', actions:'عملیات',
      addLeagueTitle:'افزودن لیگ با هوش مصنوعی', addLeagueDesc:'نام لیگ را وارد کنید؛ هوش مصنوعی و یادگیری ماشین تیم‌ها و بازیکنان آن را از فیلم‌ها و منابع داده استخراج می‌کند.', leagueNamePh:'مثال: لیگ برتر خلیج‌فارس', fetchLeague:'استخراج با AI', fetchingMsg:'در حال استخراج لیگ', activeLeagues:'لیگ‌های فعال', ownLeague:'لیگ تیم من',
      sources:'منابع آپلود', srcBroadcast:'پخش تلویزیونی', srcTactical:'دوربین تاکتیکی', srcDrone:'پهپاد', srcMobile:'موبایل', srcScout:'فید اسکاوتینگ', srcLive:'فید زنده IP',
      pitchCalib:'کالیبراسیون زمین', calibDesc:'چهار گوشه‌ی زمین را برای ردیابی دقیق مشخص کنید', calibrate:'کالیبره کن', calibrated:'کالیبره‌شده',
      trackModes:'حالت ردیابی', manualPitch:'ردیابی دستی زمین', autoTrack:'ردیابی خودکار بازیکن و زمین', fullClip:'ردیابی کل کلیپ', skeleton:'نمایش اسکلت ردیابی', trackedPlayers:'بازیکنان ردیابی‌شده',
      creditsLeft:'دقیقه پردازش باقی‌مانده', creditUsage:'مصرف اعتبار', storageUsed:'فضای استفاده‌شده', coordExport:'خروجی مختصات x/y', coordDesc:'مختصات لحظه‌ای هر دو تیم و توپ برای تحلیل سفارشی', remoteAccess:'دسترسی از راه دور', cloudActivity:'فعالیت اخیر ابر', buyCredits:'افزایش اعتبار', perMin:'هر دقیقه پردازش', processingCredits:'اعتبار پردازش',
      smartTagging:'تگ‌گذاری هوشمند', codeBtns:'دکمه‌های کد', labelBtns:'برچسب‌ها', codeGroups:'گروه‌های کد', flags:'پرچم‌ها', addFlag:'+ پرچم', xmlExport:'خروجی XML', generatedCodes:'تگ‌های تولیدشده', shortcut:'میانبر', addCode:'+ دکمه کد',
      passMatrix:'ماتریس پاس', passMatrixDesc:'چه کسی به چه کسی پاس داد', inCodeCharts:'نمودارهای متصل به ویدیو', findOutput:'جستجو و خروجی', clickToPlay:'کلیک = پخش کلیپ', totalEvents:'کل رویدادها',
      connectors:'اتصال‌ها', connected:'متصل', available:'در دسترس', liveEvent:'داده‌ی رویداد زنده', xmlImport:'ورود/خروج XML', apiAccess:'دسترسی API', pythonR:'کتابخانه Python و R', codeLib:'کد تحلیل سفارشی', connect:'اتصال', configure:'پیکربندی',
      sharedClips:'کلیپ‌های اشتراکی', comments:'کامنت‌ها', liveCollab:'همکاری زنده', analystsOnline:'آنالیزور آنلاین', messenger:'پیام‌رسان', addComment:'کامنت بگذار…', sharedWith:'اشتراک با', mentionHint:'با @ بازیکن یا کادر را تگ کن', showcase:'حالت ارائه', send:'ارسال',
      saOverview:'نمای کلی سیستم', saAiApi:'API هوش مصنوعی', saMl:'یادگیری ماشین', saSms:'پیامک و OTP', saBilling:'صورت‌حساب و اشتراک', saLogs:'لاگ و استفاده', saGeneral:'تنظیمات عمومی',
      activeClubs:'باشگاه فعال', totalUsers:'کل کاربران', apiToday:'درخواست API امروز', systemHealth:'سلامت سیستم', uptime:'آپ‌تایم', apiStatus:'وضعیت API', operational:'عملیاتی', degraded:'کند', recentEvents:'رویدادهای اخیر سیستم',
      provider:'ارائه‌دهنده مدل', apiKey:'کلید API', endpoint:'آدرس Endpoint', modelSel:'مدل', temperature:'دما (Temperature)', testConn:'تست اتصال', connOk:'اتصال موفق', usageTokens:'مصرف توکن (۳۰ روز)', monthlyCost:'هزینه ماهانه', save:'ذخیره تغییرات', addModel:'+ افزودن مدل', modelsTitle:'مدل‌های هوش مصنوعی پروژه', sharedKey:'کلید مشترک پروژه',
      modelVersion:'نسخه مدل', retrain:'آموزش مجدد مدل', lastTrained:'آخرین آموزش', datasetSize:'حجم داده آموزش', trainSchedule:'زمان‌بندی آموزش', autoRetrain:'آموزش خودکار هفتگی',
      ippanelKey:'کلید API آی‌پی‌پنل', sendLine:'خط ارسال', testSms:'ارسال پیامک تست', otpLogin:'ورود پیامکی (OTP)', otpLen:'طول کد', otpValid:'اعتبار کد (دقیقه)', smsTemplates:'قالب‌های پیامک', smsLog:'لاگ ارسال پیامک', recipient:'گیرنده', statusW:'وضعیت', delivered:'تحویل‌شده', failed:'ناموفق', otpTemplate:'قالب کد ورود', welcomeTemplate:'قالب خوش‌آمدگویی',
      subscriptions:'اشتراک باشگاه‌ها', plan:'پلن', revenue:'درآمد ماهانه', creditPool:'استخر اعتبار پردازش', clubName:'باشگاه', nextBill:'صورت‌حساب بعدی', planBasic:'پایه', planPro:'حرفه‌ای', planEnt:'سازمانی',
      userActivity:'تاریخچه‌ی استفاده‌ی کاربران', systemLog:'لاگ سیستم', actionW:'اقدام', timeW:'زمان', levelW:'سطح',
      platformName:'نام پلتفرم', logoW:'لوگو', defaultLang:'زبان پیش‌فرض', security:'امنیت', twoFA:'احراز هویت دومرحله‌ای', sessionTimeout:'مهلت نشست (دقیقه)', passwordPolicy:'سیاست رمز عبور', uploadLogo:'بارگذاری لوگو', strong:'قوی',
    },
    en: { brand:'Nexa Metrica', brandSub:'AI FOOTBALL ANALYSIS', userName:'Kaveh Moradi', userRole:'Senior Analyst', viewAs:'View as role',
      search:'Search match, player, clip…', langSwitch:'فا', assistant:'Assistant', team:'Pars Tehran',
      season:'Season 24–25', league:'Premier League', export:'Export PDF', newAnalysis:'+ New Analysis',
      lastMatch:'Last Match', win:'WIN', draw:'DRAW', loss:'LOSS', vs:'vs', home:'Home', away:'Away',
      expGoals:'Expected Goals', possession:'Possession', pressInt:'Press Intensity', higherPress:'Higher press than average',
      xgTrendTitle:'Expected Goals Trend', lastN:'Last', matches:'matches', xgFor:'For', xgAgainst:'Against',
      aiGenerated:'AI Generated', confidence:'Confidence', aiInsights:'AI Insights',
      approve:'Approve', correct:'Correct', teamForm:'Team Form', recentSessions:'Recent Sessions', viewAll:'View all',
      aiName:'Nexa Assistant', aiPersonalized:'Personalized for you', aiHello:'Hi Kaveh! The analysis vs Zagros is ready. Where should we start? (I know you focus on attacking phases)',
      quickQuestions:'Quick questions', askPlaceholder:'Ask the assistant…', aiAdapts:'The assistant adapts to your thinking style',
      dropTitle:'Drag & drop your video', dropSub:'Supports mobile & multi-angle footage · MP4, MOV up to 8K', chooseFile:'Choose file',
      totalVideos:'Total videos', processing:'Processing', storage:'Storage', all:'All', matchType:'Match', trainingType:'Training', scoutType:'Scout', filter:'Filter',
      liveProcessing:'Live AI processing', aiWorking:'Working',
      autoTracking:'Auto player tracking', eventTimeline:'Event timeline', syncedEvents:'Synced to video', detectedEvents:'Detected events',
      livePost:'Post-match', liveTag:'Live tagging', tagPalette:'Tag palette', customCode:'Custom code template', aiSuggests:'AI suggestion',
      aiTagHint:'8 events detected in the next 2 minutes. Click to batch-confirm.',
      aiKeyMoments:'AI-suggested key moments', aiMarkedDraw:'AI marked these moments for drawing', drawIt:'Draw', aiEval:'AI auto-evaluation',
      heatmap:'Heatmap', passNetwork:'Passing network', formation:'Formation', pitchControl:'Pitch control', pressTrans:'Press & transition', fieldRadar:'Field radar', oopShape:'Out of possession (OOP)',
      discoveredPatterns:'Patterns discovered by AI', distance:'Distance covered', sprints:'Sprints', topSpeed:'Top speed', accelDecel:'Accel/Decel', workload:'Workload',
      speedZones:'Speed zones (km/h)', workloadTrend:'Workload trend', injuryRisk:'Injury risk', acwr:'Acute:Chronic ratio', player:'Player', loadIdx:'Load index',
      compare:'Compare', seasonForm:'Season form', personalClips:'Personal clips', skillRadar:'Skill radar',
      addMatch:'Add match', addLeague:'Add competition', matchDay:'Match day', trainDay:'Training day', microcycle:'Weekly microcycle (MD)', perPlayerPlan:'Per-player plan (AI)', focusArea:'Focus area', recommendedDrill:'Recommended drill', load:'Load', aiProposal:'AI proposal', protein:'Protein', carbs:'Carbs', fat:'Fat', customDrill:'Custom drill', approve:'Approve', day:'day',
      filters:'Filters', position:'Position', age:'Age', style:'Play style', rating:'Rating', goals:'Goals', assists:'Assists', scoutReport:'Scout report',
      scopeTeam:'My team', scopeLeague:'Whole league', fromFilms:'players identified from films', club:'Club', fromFilm:'from film', similarPlayer:'Similar player (AI)', matchPct:'match', filmsAnalyzed:'films analyzed',
      playerParams:'Player parameters', portfolio:'Portfolio & contract', contractEnd:'Contract end', remaining:'remaining', mlNote:'The model factors height, weight, age, foot & contract into style and risk analysis', retainedForAll:'This data is retained for every identified player',
      rankings:'Leaderboard', byRating:'by rating', scatterTitle:'Scatter plot', scatterSub:'xG/90 vs key passes/90', shadowTeam:'Shadow team', aiPicked:'AI pick', shadowDesc:'Best XI of transfer targets, selected by AI from league films.', excelExport:'Export Excel',
      autoCut:'Auto-cut clips', playlists:'Playlists', presentMode:'Presentation mode', shareWith:'Share with player', newPlaylist:'New playlist',
      matchSummary:'Match summary', teamVsTeam:'Team vs team', downloadPdf:'Download PDF', us:'Pars Tehran', them:'Zagros Esfahan',
      chatHistory:'Chat history', personalization:'Assistant personalization', learnedAbout:'What the assistant learned', styleAxis:'Analysis style', attacking:'Attacking', defensive:'Defensive',
      depthAxis:'Analysis depth', brief:'Brief', detailed:'Detailed', focusAxis:'Analysis angle', tacticalF:'Tactical', statistical:'Statistical', saveSettings:'Save settings',
      modelAccuracy:'Model accuracy over time', gamesProcessed:'Games processed', learningLevel:'Learning from your team', eventAccuracy:'Event detection accuracy', recentCorrections:'Recent user corrections', feedsTraining:'feeds model training',
      teams:'Teams', seasons:'Seasons', usersRoles:'Users & access', general:'General', name:'Name', role:'Role', access:'Access', language:'Interface language', addUser:'+ Add user',
      playerInfo:'Player info', savePlayer:'Save player info', shirtNo:'Shirt number', heightL:'Height (cm)', weightL:'Weight (kg)', footL:'Strong foot', natL:'Nationality', valueL:'Market value', editPlayer:'Player to edit', addPlayer:'+ New player', playerInfoNote:'This data is the basis of the model\u2019s analysis and feeds style and injury-risk evaluation.',
      injuryHistory:'Injury history', records:'records', daysOut:'days out', injuryDate:'Injury date', injuryArea:'Area', addInjury:'+ Add injury', selectTeam:'Select team', ownTeam:'Own team', leagueClubs:'League clubs',
      transferAnalysis:'Transfer analysis', buyScore:'Buy score', recommend:'Recommendation', recBuy:'Recommended buy', recWatch:'Watch', recAvoid:'Avoid', valueForMoney:'Value for money', injuryRiskF:'Injury risk', ageFactor:'Age', styleFit:'Style fit', contractF:'Contract', target:'Transfer target', estCost:'Estimated cost', addTarget:'+ New target',
      allPlayers:'All players', myTeam:'My team', leagues:'Leagues', addLeague:'Add league', view:'View', actions:'Actions',
      addLeagueTitle:'Add league with AI', addLeagueDesc:'Enter a league name; AI & machine learning extract its teams and players from footage and data sources.', leagueNamePh:'e.g. Persian Gulf League', fetchLeague:'Fetch with AI', fetchingMsg:'Fetching league', activeLeagues:'Active leagues', ownLeague:'My league',
      sources:'Upload sources', srcBroadcast:'TV broadcast', srcTactical:'Tactical camera', srcDrone:'Drone', srcMobile:'Mobile', srcScout:'Scouting feed', srcLive:'Live IP feed',
      pitchCalib:'Pitch calibration', calibDesc:'Mark the four pitch corners for accurate tracking', calibrate:'Calibrate', calibrated:'Calibrated',
      trackModes:'Tracking mode', manualPitch:'Manual pitch tracking', autoTrack:'Auto player & pitch tracking', fullClip:'Full clip tracking', skeleton:'Show tracking skeleton', trackedPlayers:'Tracked players',
      creditsLeft:'Processing minutes left', creditUsage:'Credit usage', storageUsed:'Storage used', coordExport:'x/y coordinate export', coordDesc:'Per-frame coordinates of both teams & the ball for custom analysis', remoteAccess:'Remote access', cloudActivity:'Recent cloud activity', buyCredits:'Add credits', perMin:'per processing minute', processingCredits:'Processing credits',
      smartTagging:'Smart Tagging', codeBtns:'Code buttons', labelBtns:'Labels', codeGroups:'Code groups', flags:'Flags', addFlag:'+ Flag', xmlExport:'Export XML', generatedCodes:'Generated tags', shortcut:'Shortcut', addCode:'+ Code button',
      passMatrix:'Passing matrix', passMatrixDesc:'Who passed to whom', inCodeCharts:'Video-linked charts', findOutput:'Find & Output', clickToPlay:'click = play clip', totalEvents:'Total events',
      connectors:'Connectors', connected:'Connected', available:'Available', liveEvent:'Live event data', xmlImport:'XML import/export', apiAccess:'API access', pythonR:'Python & R library', codeLib:'Custom analysis code', connect:'Connect', configure:'Configure',
      sharedClips:'Shared clips', comments:'Comments', liveCollab:'Live collaboration', analystsOnline:'analysts online', messenger:'Messenger', addComment:'Add a comment…', sharedWith:'Shared with', mentionHint:'Tag a player or staff with @', showcase:'Showcase mode', send:'Send',
      saOverview:'System overview', saAiApi:'AI API', saMl:'Machine learning', saSms:'SMS & OTP', saBilling:'Billing & subscriptions', saLogs:'Logs & usage', saGeneral:'General settings',
      activeClubs:'Active clubs', totalUsers:'Total users', apiToday:'API requests today', systemHealth:'System health', uptime:'Uptime', apiStatus:'API status', operational:'Operational', degraded:'Degraded', recentEvents:'Recent system events',
      provider:'Model provider', apiKey:'API key', endpoint:'Endpoint URL', modelSel:'Model', temperature:'Temperature', testConn:'Test connection', connOk:'Connection OK', usageTokens:'Token usage (30d)', monthlyCost:'Monthly cost', save:'Save changes', addModel:'+ Add model', modelsTitle:'Project AI models', sharedKey:'Shared project key',
      modelVersion:'Model version', retrain:'Retrain model', lastTrained:'Last trained', datasetSize:'Training data size', trainSchedule:'Training schedule', autoRetrain:'Weekly auto-retrain',
      ippanelKey:'IPPanel API key', sendLine:'Sending line', testSms:'Send test SMS', otpLogin:'SMS login (OTP)', otpLen:'Code length', otpValid:'Code validity (min)', smsTemplates:'SMS templates', smsLog:'SMS delivery log', recipient:'Recipient', statusW:'Status', delivered:'Delivered', failed:'Failed', otpTemplate:'OTP code template', welcomeTemplate:'Welcome template',
      subscriptions:'Club subscriptions', plan:'Plan', revenue:'Monthly revenue', creditPool:'Processing credit pool', clubName:'Club', nextBill:'Next invoice', planBasic:'Basic', planPro:'Pro', planEnt:'Enterprise',
      userActivity:'User usage history', systemLog:'System log', actionW:'Action', timeW:'Time', levelW:'Level',
      platformName:'Platform name', logoW:'Logo', defaultLang:'Default language', security:'Security', twoFA:'Two-factor auth', sessionTimeout:'Session timeout (min)', passwordPolicy:'Password policy', uploadLogo:'Upload logo', strong:'Strong',
    }
  };

  // ============ CHART ENGINE ============
  lineArea(series, o={}){
    const W=o.w||620,H=o.h||190,p={t:14,r:14,b:24,l:30,...(o.pad||{})};
    const all=series.flatMap(s=>s.data); const max=o.max??Math.max(...all)*1.15, min=o.min??0;
    const n=series[0].data.length;
    const X=i=> p.l + (i/(n-1))*(W-p.l-p.r);
    const Y=v=> H-p.b - ((v-min)/(max-min))*(H-p.t-p.b);
    const grids=[]; const rows=4;
    for(let i=0;i<=rows;i++){ const y=p.t+(i/rows)*(H-p.t-p.b); grids.push(this.h('line',{key:'g'+i,x1:p.l,y1:y,x2:W-p.r,y2:y,stroke:this.C.grid,strokeWidth:1})); }
    const layers=[];
    series.forEach((s,si)=>{
      const pts=s.data.map((v,i)=>`${X(i)},${Y(v)}`).join(' ');
      if(s.fill){ const id='ga'+si+(o.id||''); layers.push(this.h('defs',{key:'d'+si},this.h('linearGradient',{id,x1:0,y1:0,x2:0,y2:1},this.h('stop',{offset:'0%',stopColor:s.color,stopOpacity:.32}),this.h('stop',{offset:'100%',stopColor:s.color,stopOpacity:0}))));
        layers.push(this.h('polygon',{key:'f'+si,points:`${X(0)},${H-p.b} ${pts} ${X(n-1)},${H-p.b}`,fill:`url(#${id})`})); }
      layers.push(this.h('polyline',{key:'l'+si,points:pts,fill:'none',stroke:s.color,strokeWidth:s.w||2.4,strokeLinecap:'round',strokeLinejoin:'round'}));
      if(s.dots!==false) s.data.forEach((v,i)=> layers.push(this.h('circle',{key:'c'+si+i,cx:X(i),cy:Y(v),r:si===0?3:2.4,fill:o.bgDot||'#16191c',stroke:s.color,strokeWidth:2})));
    });
    const labels=(o.labels||[]).map((lb,i)=> this.h('text',{key:'x'+i,x:X(i),y:H-7,fill:this.C.mut,fontSize:9.5,textAnchor:'middle'},lb));
    return this.h('svg',{viewBox:`0 0 ${W} ${H}`,width:'100%',style:{display:'block'}},...grids,...layers,...labels);
  }

  donut(v,color,size=64,thick=7){
    const r=size/2-thick/2-1,c=2*Math.PI*r,off=c*(1-v/100);
    return this.h('svg',{width:size,height:size,viewBox:`0 0 ${size} ${size}`},
      this.h('circle',{cx:size/2,cy:size/2,r,fill:'none',stroke:'rgba(255,255,255,.08)',strokeWidth:thick}),
      this.h('circle',{cx:size/2,cy:size/2,r,fill:'none',stroke:color,strokeWidth:thick,strokeLinecap:'round',strokeDasharray:c,strokeDashoffset:off,transform:`rotate(-90 ${size/2} ${size/2})`}),
      this.h('text',{x:'50%',y:'50%',dy:'.36em',textAnchor:'middle',fill:'#e7e9ec',fontSize:size*0.26,fontWeight:800},this.faN(v)+'٪'));
  }

  radar(axes, sets, o={}){
    const size=o.size||230, cx=size/2, cy=size/2, R=size/2-30, N=axes.length;
    const ang=i=> (Math.PI*2*i/N) - Math.PI/2;
    const pt=(i,rad)=> [cx+Math.cos(ang(i))*rad, cy+Math.sin(ang(i))*rad];
    const rings=[]; for(let g=1;g<=4;g++){ const rr=R*g/4; const pp=axes.map((_,i)=>pt(i,rr).join(',')).join(' '); rings.push(this.h('polygon',{key:'r'+g,points:pp,fill:'none',stroke:this.C.grid,strokeWidth:1})); }
    const spokes=axes.map((a,i)=>{ const[x,y]=pt(i,R); return this.h('line',{key:'s'+i,x1:cx,y1:cy,x2:x,y2:y,stroke:this.C.grid,strokeWidth:1}); });
    const labels=axes.map((a,i)=>{ const[x,y]=pt(i,R+15); return this.h('text',{key:'t'+i,x,y,dy:'.32em',textAnchor:'middle',fill:this.C.sub,fontSize:10.5,fontWeight:600},a); });
    const polys=sets.map((s,si)=>{ const pp=s.values.map((v,i)=>pt(i,R*v/100).join(',')).join(' ');
      return this.h('g',{key:'p'+si},this.h('polygon',{points:pp,fill:s.color,fillOpacity:s.fill??.18,stroke:s.color,strokeWidth:2}),
        ...s.values.map((v,i)=>{const[x,y]=pt(i,R*v/100);return this.h('circle',{key:i,cx:x,cy:y,r:2.6,fill:s.color});})); });
    return this.h('svg',{width:size,height:size,viewBox:`0 0 ${size} ${size}`,style:{display:'block',margin:'0 auto'}},...rings,...spokes,...polys,...labels);
  }

  // soccer pitch (horizontal). returns array of svg children sized to W x H
  pitchEls(W,H,stroke='rgba(255,255,255,.14)'){
    const m=4, x=m,y=m,w=W-2*m,hh=H-2*m, cx=W/2;
    const L=(p)=>this.h('line',p), R=(p)=>this.h('rect',{...p,fill:'none'}), C=(p)=>this.h('circle',{...p,fill:'none'});
    const sw={stroke,strokeWidth:1.4,fill:'none'};
    return [
      this.h('rect',{key:'bg',x,y,width:w,height:hh,rx:6,fill:'rgba(120,200,90,.04)',...sw}),
      this.h('line',{key:'half',x1:cx,y1:y,x2:cx,y2:y+hh,...sw}),
      this.h('circle',{key:'cc',cx,cy:H/2,r:hh*0.13,...sw}),
      this.h('circle',{key:'cs',cx,cy:H/2,r:2,fill:stroke}),
      this.h('rect',{key:'pl',x,y:H/2-hh*0.28,width:w*0.16,height:hh*0.56,...sw}),
      this.h('rect',{key:'pr',x:x+w-w*0.16,y:H/2-hh*0.28,width:w*0.16,height:hh*0.56,...sw}),
      this.h('rect',{key:'gl',x,y:H/2-hh*0.13,width:w*0.06,height:hh*0.26,...sw}),
      this.h('rect',{key:'gr',x:x+w-w*0.06,y:H/2-hh*0.13,width:w*0.06,height:hh*0.26,...sw}),
    ];
  }
  pitch(W,H,children,o={}){
    return this.h('svg',{viewBox:`0 0 ${W} ${H}`,width:'100%',style:{display:'block'}},
      ...this.pitchEls(W,H,o.stroke),...(children||[]));
  }
  heatGrid(W,H,grid,o={}){ // grid: 2d array rows x cols of 0..1
    const m=4,w=W-2*m,hh=H-2*m,rows=grid.length,cols=grid[0].length;
    const cw=w/cols,ch=hh/rows,cells=[];
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){ const v=grid[r][c]; if(v<=0.02)continue;
      const col=v<.4?`rgba(56,189,248,${v*.9})`:v<.7?`rgba(163,230,53,${v*.85})`:`rgba(245,158,11,${v})`;
      cells.push(this.h('rect',{key:r+'_'+c,x:m+c*cw,y:m+r*ch,width:cw+0.5,height:ch+0.5,fill:col,style:{filter:'blur(7px)'}})); }
    return cells;
  }
  vbars(items,o={}){ const W=o.w||3,gap=o.gap||3;
    return items.map((v,i)=> this.h('div',{key:i,style:{width:W,height:o.h||26,borderRadius:2,background:i/items.length<v?this.C.ac:'#2b313a',alignSelf:'flex-end',transform:`scaleY(${0.4+v*0.6})`,transformOrigin:'bottom'}}));
  }

  // ============ DATA ============
  matches = [
    { opp:'زاگرس اصفهان', date:'۲۱ آذر', res:'۲–۱', win:'win', xgF:1.84, xgA:0.97 },
    { opp:'خلیج‌فارس بندر', date:'۱۴ آذر', res:'۰–۰', win:'draw', xgF:1.12, xgA:1.05 },
    { opp:'البرز کرج', date:'۷ آذر', res:'۳–۱', win:'win', xgF:2.40, xgA:0.88 },
    { opp:'کاسپین رشت', date:'۳۰ آبان', res:'۱–۲', win:'loss', xgF:1.31, xgA:1.70 },
  ];

  go = (p)=> this.setState({ page:p });
  toggleLang = ()=> this.setState({ lang: this.state.lang==='fa'?'en':'fa' });
  toggleAI = ()=> this.setState({ ai: !this.state.ai });
  onAiInput = (e)=> this.setState({ aiInput: e.target.value });
  askAi = (q)=>{ const a = this.aiAnswer(q); this.setState({ thread:[...this.state.thread, {role:'user',text:q},{role:'ai',text:a}], aiInput:'', ai:true }); };
  sendAi = ()=>{ const q=this.state.aiInput.trim(); if(q) this.askAi(q); };
  aiAnswer(q){ return this.state.lang==='fa'
    ? 'بر اساس داده‌های بازی اخیر: تیم در فاز حمله از جناح راست ۶۴٪ از موقعیت‌ها را ساخته. پیشنهاد می‌کنم روی نفوذ پشت مدافعان با پاس‌های عمقی تمرکز کنیم. (اطمینان ۸۹٪)'
    : 'Based on the latest match: 64% of chances came from the right flank. I suggest focusing on through-balls behind the defensive line. (Confidence 89%)'; }

  // ============ VIEW MODELS ============
  vm_dashboard(){
    const t=this.STR[this.state.lang];
    const xg=[0.9,1.4,1.1,2.0,1.6,0.8,2.4,1.3,1.12,1.84];
    const xga=[1.2,0.9,1.5,0.8,1.1,1.4,0.88,1.7,1.05,0.97];
    const labels=['۱','۲','۳','۴','۵','۶','۷','۸','۹','۱۰'].map(x=>this.faN(x));
    const xgChart=this.lineArea([
      {data:xg,color:this.C.ac,fill:true,w:2.6},
      {data:xga,color:this.C.mut,fill:false,w:2,dots:false}
    ],{h:200,labels,max:2.8,id:'dash'});
    const possBars=this.vbars([.5,.7,.6,.9,.55,.75,.65,.8,.6,.7,.85,.5],{w:5,gap:0,h:22});
    const fa0=this.state.lang==='fa';
    const insights = fa0 ? [
      this.mkAI('d0','در نیمه دوم، پرس تیم ۲۳٪ مؤثرتر شد و ۴ بازیافت توپ در زمین حریف ایجاد کرد.','مدل ۸۲۴ کنش پرس را در دو نیمه مقایسه کرد؛ نرخ بازیافت در یک‌سوم هجومی از ۰٫۹ به ۱٫۲ در دقیقه رسید و PPDA از ۱۱٫۲ به ۸٫۴ کاهش یافت.'),
      this.mkAI('d1','بیشترین تهدید از جناح راست با نفوذ «امیر حسینی» شکل گرفت — ۰٫۹ xThreat.','از ۳۱ حمله‌ی ثبت‌شده، ۲۰ مورد از کریدور راست عبور کرد. مدل بالاترین مقدار xThreat تجمعی (۰٫۹) را به این مسیر نسبت داد.'),
      this.mkAI('d2','ضعف در پوشش فضای بین خطوط هنگام ضدحمله؛ ۲ موقعیت خطرناک حریف از این ناحیه.','در ۲ ضدحمله، فاصله‌ی خط دفاع تا هافبک دفاعی بیش از ۱۸ متر شد؛ مدل این فضا را با اطمینان ۸۷٪ پرریسک علامت زد.')
    ] : [
      this.mkAI('d0','Second-half press was 23% more effective, forcing 4 recoveries in the opponent half.','The model compared 824 press actions across halves; recovery rate in the final third rose from 0.9 to 1.2/min and PPDA fell from 11.2 to 8.4.'),
      this.mkAI('d1','Most threat came from the right flank via "Amir Hosseini" — 0.9 xThreat.','Of 31 logged attacks, 20 went through the right corridor. The model attributed the highest cumulative xThreat (0.9) to this path.'),
      this.mkAI('d2','Weakness covering space between the lines on transitions; 2 dangerous chances conceded.','On 2 transitions, the gap between the defensive line and the DM exceeded 18m; the model flagged this space as high-risk with 87% confidence.')
    ];
    const formMetrics = [
      { label: this.state.lang==='fa'?'دقت پاس':'Pass accuracy', val:'۸۷٪', pct:'87%', color:this.C.ac },
      { label: this.state.lang==='fa'?'موفقیت دوئل':'Duels won', val:'۵۴٪', pct:'54%', color:this.C.ai },
      { label: this.state.lang==='fa'?'مالکیت در زمین حریف':'Final-third poss.', val:'۳۸٪', pct:'38%', color:this.C.warn },
      { label: this.state.lang==='fa'?'تبدیل موقعیت':'Chance conversion', val:'۲۲٪', pct:'22%', color:this.C.good },
    ].map(m=>({...m, val:this.faN(m.val)}));
    const sessions = [
      { title:'پارس تهران ۲–۱ زاگرس اصفهان', date:'۲۱ آذر', dur:'۹۴ دقیقه', status:'آماده', sc:'good', icon:this.C.ac },
      { title:'جلسه تمرین — فاز دفاعی', date:'۱۹ آذر', dur:'۴۷ دقیقه', status:'در حال تگ‌گذاری', sc:'ai', icon:this.C.ai },
      { title:'پارس تهران — خلیج‌فارس بندر', date:'۱۴ آذر', dur:'۹۰ دقیقه', status:'آماده', sc:'good', icon:this.C.ac },
      { title:'آنالیز حریف — البرز کرج', date:'۱۰ آذر', dur:'۲۸ دقیقه', status:'در صف پردازش', sc:'warn', icon:this.C.warn },
    ].map(s=>({ ...s,
      iconColor:s.icon,
      status:this.state.lang==='fa'?s.status:(s.sc==='good'?'Ready':s.sc==='ai'?'Tagging':'Queued'),
      statusColor:s.sc==='good'?this.C.good:s.sc==='ai'?this.C.ai:this.C.warn,
      statusBg:s.sc==='good'?'rgba(74,222,128,.13)':s.sc==='ai'?'rgba(56,189,248,.13)':'rgba(245,158,11,.13)' }));
    return { xgChart, possBars, insights, formMetrics, sessions };
  }

  // ===== shared roster =====
  roster = [
    { n:'علی رستمی', en:'A. Rostami', pos:'دروازه‌بان', pe:'GK', num:1, age:29, rate:7.1, g:0, a:0, dist:5.2, sp:6 },
    { n:'حسین کریمی', en:'H. Karimi', pos:'مدافع راست', pe:'RB', num:2, age:25, rate:7.4, g:1, a:3, dist:10.8, sp:31 },
    { n:'مهدی شریفی', en:'M. Sharifi', pos:'مدافع میانی', pe:'CB', num:4, age:28, rate:7.6, g:2, a:0, dist:9.6, sp:14 },
    { n:'رضا نوری', en:'R. Nouri', pos:'مدافع میانی', pe:'CB', num:5, age:31, rate:7.2, g:0, a:1, dist:9.4, sp:11 },
    { n:'سجاد محمدی', en:'S. Mohammadi', pos:'مدافع چپ', pe:'LB', num:3, age:24, rate:7.0, g:0, a:2, dist:10.5, sp:28 },
    { n:'نوید رضایی', en:'N. Rezaei', pos:'هافبک دفاعی', pe:'DM', num:6, age:27, rate:7.8, g:1, a:4, dist:11.4, sp:18 },
    { n:'آرش کاظمی', en:'A. Kazemi', pos:'هافبک میانی', pe:'CM', num:8, age:26, rate:7.5, g:3, a:6, dist:11.9, sp:22 },
    { n:'امیر حسینی', en:'A. Hosseini', pos:'وینگر راست', pe:'RW', num:7, age:23, rate:8.3, g:9, a:7, dist:11.1, sp:41 },
    { n:'کاوه احمدی', en:'K. Ahmadi', pos:'مهاجم', pe:'ST', num:9, age:27, rate:8.1, g:14, a:4, dist:9.8, sp:35 },
    { n:'میلاد قاسمی', en:'M. Ghasemi', pos:'وینگر چپ', pe:'LW', num:11, age:22, rate:7.7, g:6, a:8, dist:11.3, sp:38 },
    { n:'سامان یوسفی', en:'S. Yousefi', pos:'هافبک هجومی', pe:'AM', num:10, age:25, rate:7.9, g:5, a:9, dist:11.0, sp:25 },
  ];
  star = { n:'امیر حسینی', en:'Amir Hosseini', pos:'وینگر راست', pe:'Right Winger', num:7, age:23, rate:8.3,
    ht:179, wt:72, foot:'راست', footEn:'Right', nat:'ایران', natEn:'Iran', value:'۲٫۴M €', valueEn:'€2.4M', contract:'۱۴۰۵/۰۳', contractEn:'Jun 2026', contractLeft:'۱۸ ماه',
    radar:[88,82,91,46,93,71], radarEn:['Pass','Shot','Dribble','Defend','Pace','Power'], radarFa:['پاس','شوت','دریبل','دفاع','سرعت','قدرت'],
    injuries:[['کشیدگی همسترینگ','Hamstring strain','۱۴۰۴/۰۶','۱۸',2],['پیچ‌خوردگی مچ پا','Ankle sprain','۱۴۰۳/۱۱','۹',1]],
    form:[6.8,7.2,7.9,8.1,7.4,8.6,8.0,8.3,7.7,8.3] };

  passNet(W,H){
    const nodes=[ {x:8,y:50,l:'GK'},{x:24,y:18,l:'RB'},{x:22,y:40,l:'CB'},{x:22,y:60,l:'CB'},{x:24,y:82,l:'LB'},
      {x:42,y:50,l:'DM'},{x:54,y:30,l:'CM'},{x:78,y:18,l:'RW',hot:1},{x:72,y:50,l:'AM'},{x:78,y:82,l:'LW'},{x:88,y:50,l:'ST',hot:1} ];
    const links=[[0,2,3],[0,3,3],[2,5,5],[3,5,4],[2,1,4],[3,4,4],[5,6,6],[5,8,5],[1,7,7],[6,7,5],[7,8,6],[7,10,7],[8,10,5],[4,9,5],[9,8,3],[8,10,4]];
    const px=n=>4+(n.x/100)*(W-8), py=n=>4+(n.y/100)*(H-8);
    const els=[];
    links.forEach((lk,i)=>{ const a=nodes[lk[0]],b=nodes[lk[1]]; els.push(this.h('line',{key:'k'+i,x1:px(a),y1:py(a),x2:px(b),y2:py(b),stroke:'rgba(163,230,53,'+(0.12+lk[2]*0.06)+')',strokeWidth:0.8+lk[2]*0.7,strokeLinecap:'round'})); });
    nodes.forEach((n,i)=>{ const r=n.hot?13:10; els.push(this.h('circle',{key:'n'+i,cx:px(n),cy:py(n),r,fill:n.hot?this.C.ac:'#2a2f38',stroke:n.hot?'#0d0f12':this.C.ac,strokeWidth:n.hot?0:1.4}));
      els.push(this.h('text',{key:'t'+i,x:px(n),y:py(n),dy:'.34em',textAnchor:'middle',fill:n.hot?'#0d0f12':this.C.ac,fontSize:8.5,fontWeight:800},n.l)); });
    return els;
  }

  vm_library(){
    const fa=this.state.lang==='fa';
    const vids=[
      { t:'پارس تهران ۲–۱ زاگرس اصفهان', te:'Pars 2–1 Zagros', type:fa?'بازی رسمی':'Match', date:'۲۱ آذر', dur:'۹۴:۱۲', ang:3, st:'ready', conf:96 },
      { t:'جلسه تمرین — فاز دفاعی', te:'Training — Defensive phase', type:fa?'تمرین':'Training', date:'۱۹ آذر', dur:'۴۷:۳۰', ang:2, st:'tag', conf:88, prog:64 },
      { t:'پارس تهران — خلیج‌فارس بندر', te:'Pars — Khalij Fars', type:fa?'بازی رسمی':'Match', date:'۱۴ آذر', dur:'۹۰:۰۰', ang:4, st:'ready', conf:95 },
      { t:'آنالیز حریف — البرز کرج', te:'Opponent — Alborz', type:fa?'آنالیز حریف':'Scout', date:'۱۰ آذر', dur:'۲۸:۱۵', ang:1, st:'track', conf:0, prog:31 },
      { t:'تمرین ضربات ایستگاهی', te:'Set-piece session', type:fa?'تمرین':'Training', date:'۸ آذر', dur:'۳۳:۴۰', ang:2, st:'ready', conf:91 },
      { t:'پارس تهران ۳–۱ البرز کرج', te:'Pars 3–1 Alborz', type:fa?'بازی رسمی':'Match', date:'۷ آذر', dur:'۹۲:۲۰', ang:3, st:'ready', conf:97 },
    ];
    const stMap={ ready:{fa:'آماده',en:'Ready',c:this.C.good,b:'rgba(74,222,128,.13)'}, tag:{fa:'تگ‌گذاری AI',en:'AI Tagging',c:this.C.ai,b:'rgba(56,189,248,.13)'}, track:{fa:'ردیابی بازیکن',en:'Tracking',c:this.C.warn,b:'rgba(245,158,11,.13)'} };
    const stages=[
      { fa:'ردیابی بازیکنان', en:'Player tracking', s:'done' },
      { fa:'تشخیص رویدادها', en:'Event detection', s:'active', pct:64 },
      { fa:'تحلیل تاکتیکی', en:'Tactical analysis', s:'pending' },
      { fa:'آماده', en:'Ready', s:'pending' },
    ].map(st=>{ const c= st.s==='done'?this.C.good : st.s==='active'?this.C.ai : this.C.mut;
      return { label:fa?st.fa:st.en, s:st.s, pct:st.pct?this.faN(st.pct):null, c,
        dot: st.s==='done'?this.C.good : st.s==='active'?this.C.ai : '#2b313a',
        ring: st.s==='active'?this.C.ai:'transparent', txtC: st.s==='pending'?this.C.mut:this.C.tx }; });
    return { vids: vids.map(v=>({ ...v, title:fa?v.t:v.te, st:stMap[v.st], stLabel:fa?stMap[v.st].fa:stMap[v.st].en })),
      stages, procVideo: fa?'جلسه تمرین — فاز دفاعی':'Training — Defensive phase' };
  }

  vm_player(){
    const fa=this.state.lang==='fa';
    const events=[
      { p:8, c:this.C.ac, ty:fa?'پاس کلیدی':'Key pass', t:'۱۲:۰۴', auto:1, conf:94 },
      { p:18, c:this.C.ai, ty:fa?'پرس موفق':'Press won', t:'۱۹:۳۱', auto:1, conf:88 },
      { p:27, c:this.C.warn, ty:fa?'شوت':'Shot', t:'۲۶:۱۲', auto:1, conf:91 },
      { p:41, c:this.C.ac, ty:fa?'گل':'Goal', t:'۳۸:۴۵', auto:0, conf:99 },
      { p:55, c:this.C.dng, ty:fa?'تکل':'Tackle', t:'۵۱:۰۸', auto:1, conf:79 },
      { p:68, c:this.C.ac, ty:fa?'پاس کلیدی':'Key pass', t:'۶۱:۲۲', auto:1, conf:86 },
      { p:82, c:this.C.warn, ty:fa?'شوت':'Shot', t:'۷۴:۵۰', auto:1, conf:90 },
      { p:91, c:this.C.ai, ty:fa?'پرس موفق':'Press won', t:'۸۲:۱۷', auto:1, conf:84 },
    ];
    const tags=[ {fa:'پاس',en:'Pass',c:this.C.ac},{fa:'شوت',en:'Shot',c:this.C.warn},{fa:'تکل',en:'Tackle',c:this.C.dng},{fa:'پرس',en:'Press',c:this.C.ai},{fa:'دریبل',en:'Dribble',c:this.C.good},{fa:'سانتر',en:'Cross',c:'#c084fc'},{fa:'گل',en:'Goal',c:this.C.ac},{fa:'خطا',en:'Foul',c:this.C.sub} ];
    return { events: events.map(e=>({ ...e, conf:this.faN(e.conf) })),
      tags: tags.map(x=>({ label:fa?x.fa:x.en, c:x.c })),
      eventList: events.slice(0,5).map(e=>({ ty:e.ty, t:e.t, auto:e.auto, conf:this.faN(e.conf), confC: e.conf>=90?this.C.good:e.conf>=80?this.C.warn:this.C.dng })) };
  }

  vm_telestration(){
    const W=620,H=380, el=this.h.bind(this);
    const draw=[
      el('defs',{key:'d'}, el('marker',{id:'arr',markerWidth:9,markerHeight:9,refX:6,refY:3,orient:'auto'}, el('path',{d:'M0,0 L7,3 L0,6 Z',fill:this.C.ac}))),
      el('circle',{key:'hl',cx:200,cy:160,r:34,fill:'none',stroke:this.C.ac,strokeWidth:2.5,strokeDasharray:'5 4'}),
      el('path',{key:'a1',d:'M200,160 C 280,120 360,140 430,110',fill:'none',stroke:this.C.ac,strokeWidth:2.5,markerEnd:'url(#arr)'}),
      el('path',{key:'a2',d:'M200,160 C 250,230 340,250 410,240',fill:'none',stroke:this.C.ai,strokeWidth:2.5,strokeDasharray:'7 5',markerEnd:'url(#arr)'}),
      el('polygon',{key:'sp',points:'420,90 520,80 540,160 440,180',fill:'rgba(245,158,11,.14)',stroke:this.C.warn,strokeWidth:1.5,strokeDasharray:'4 4'}),
      el('line',{key:'cn',x1:200,y1:160,x2:430,y2:110,stroke:'rgba(255,255,255,.25)',strokeWidth:1,strokeDasharray:'2 3'}),
      ...[[200,160,'۷'],[430,110,'۹'],[410,240,'۱۱']].map((p,i)=> el('g',{key:'pl'+i},
        el('circle',{cx:p[0],cy:p[1],r:13,fill:'#0d0f12',stroke:this.C.ac,strokeWidth:2}),
        el('text',{x:p[0],y:p[1],dy:'.34em',textAnchor:'middle',fill:this.C.ac,fontSize:11,fontWeight:800},this.faN(p[2])))),
    ];
    const tools=[ {fa:'انتخاب',en:'Select',ic:'M3 3l7 17 2-7 7-2z'},{fa:'فلش',en:'Arrow',ic:'M5 12h14M13 6l6 6-6 6'},{fa:'دایره',en:'Circle',ic:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'},{fa:'خط',en:'Line',ic:'M4 20 20 4'},{fa:'سایه فضا',en:'Space',ic:'M3 7h18v10H3zM3 7l9 5 9-5'},{fa:'شناسه بازیکن',en:'Player ID',ic:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0'},{fa:'خط ارتباط',en:'Connect',ic:'M6 18 18 6M6 6h.01M18 18h.01'},{fa:'ذره‌بین',en:'Zoom',ic:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4-4M11 8v6M8 11h6'} ];
    return { drawing: this.h('svg',{viewBox:`0 0 ${W} ${H}`,width:'100%',style:{display:'block'}}, ...this.pitchEls(W,H,'rgba(255,255,255,.1)'), ...draw),
      moments: [
        { ty:this.state.lang==='fa'?'فضای باز پشت مدافع راست':'Space behind RB', t:'۳۸:۴۵', conf:94 },
        { ty:this.state.lang==='fa'?'پرس هماهنگ سه‌نفره':'3-man press trigger', t:'۵۱:۰۸', conf:88 },
        { ty:this.state.lang==='fa'?'خط پاس عمقی':'Through-ball lane', t:'۶۱:۲۲', conf:91 },
      ].map(m=>({ ...m, conf:this.faN(m.conf), confC: m.conf>=90?this.C.good:this.C.warn })),
      tools: tools.map((x,i)=>({ label:this.state.lang==='fa'?x.fa:x.en, ic:x.ic,
        bg:i===1?'var(--acd)':'transparent', bd:i===1?'rgba(163,230,53,.35)':'var(--bd)', fg:i===1?'var(--ac)':'var(--sub)' })) };
  }

  vm_tactical(){
    const fa=this.state.lang==='fa';
    const grid=[
      [.05,.1,.15,.2,.25,.35,.45,.55,.5,.4,.3,.2],
      [.1,.2,.35,.5,.55,.65,.7,.8,.75,.6,.45,.3],
      [.15,.3,.45,.6,.7,.85,.95,.9,.85,.7,.5,.35],
      [.1,.25,.4,.55,.6,.75,.85,.8,.7,.55,.4,.25],
      [.05,.12,.2,.3,.4,.5,.6,.55,.45,.35,.25,.15],
    ];
    const W=460,Hh=300, ac=this.C.ac, ai=this.C.ai;
    const PX=n=>4+(n[0]/100)*(W-8), PY=n=>4+(n[1]/100)*(Hh-8);
    const dot=(n,r,fill,stroke)=>this.h('circle',{cx:PX(n),cy:PY(n),r,fill,stroke,strokeWidth:stroke?1.6:0});
    const svg=(...kids)=>this.h('svg',{viewBox:`0 0 ${W} ${Hh}`,width:'100%',style:{display:'block'}},...kids);
    const heat=svg(...this.heatGrid(W,Hh,grid), ...this.pitchEls(W,Hh,'rgba(255,255,255,.16)'));
    const net=svg(...this.pitchEls(W,Hh,'rgba(255,255,255,.12)'), ...this.passNet(W,Hh));
    const F=[[9,50,'GK'],[22,16,'RB'],[20,38,'CB'],[20,62,'CB'],[22,84,'LB'],[42,30,'CM'],[44,50,'DM'],[42,70,'CM'],[76,18,'RW'],[87,50,'ST'],[76,82,'LW']];
    const formationEl=svg(...this.pitchEls(W,Hh,'rgba(255,255,255,.12)'),
      ...[22,43,80].map((x,i)=>this.h('line',{key:'fl'+i,x1:4+(x/100)*(W-8),y1:24,x2:4+(x/100)*(W-8),y2:Hh-24,stroke:'rgba(163,230,53,.16)',strokeWidth:1,strokeDasharray:'4 5'})),
      ...F.map((n,i)=>this.h('g',{key:'fn'+i},dot(n,11,'#0d0f12',ac),this.h('text',{x:PX(n),y:PY(n),dy:'.34em',textAnchor:'middle',fill:ac,fontSize:8,fontWeight:800},n[2]))));
    const cg=[[1,1,.7,.4,.2,-.1,-.3,-.5,-.6,-.7,-.8,-.9],[1,.9,.6,.3,0,-.2,-.4,-.5,-.4,-.6,-.7,-.8],[1,.8,.5,.2,-.1,-.3,-.2,-.3,-.5,-.6,-.7,-.9],[1,.9,.6,.3,0,-.2,-.4,-.5,-.4,-.6,-.7,-.8],[1,1,.7,.4,.2,-.1,-.3,-.5,-.6,-.7,-.8,-.9]];
    const cw=(W-8)/12, ch=(Hh-8)/5, ccells=[];
    cg.forEach((row,r)=>row.forEach((v,c)=>{ const col=v>0?`rgba(163,230,53,${Math.abs(v)*.42})`:`rgba(56,189,248,${Math.abs(v)*.42})`;
      ccells.push(this.h('rect',{key:'cc'+r+'_'+c,x:4+c*cw,y:4+r*ch,width:cw+.6,height:ch+.6,fill:col,style:{filter:'blur(5px)'}})); }));
    const controlEl=svg(...ccells, ...this.pitchEls(W,Hh,'rgba(255,255,255,.18)'));
    const pgrid=[[.05,.1,.2,.4,.7,.85,.6,.35],[.1,.25,.45,.7,.92,.75,.5,.3],[.1,.3,.55,.78,.88,.65,.42,.25],[.08,.2,.4,.62,.74,.55,.35,.2],[.05,.12,.28,.5,.66,.45,.28,.15]];
    const pressEl=svg(...this.heatGrid(W,Hh,pgrid), ...this.pitchEls(W,Hh,'rgba(255,255,255,.16)'));
    const us=[[10,50],[24,20],[22,42],[22,58],[24,80],[42,34],[44,50],[42,66],[70,24],[82,50],[70,76]];
    const them=[[90,50],[76,26],[78,44],[78,56],[76,74],[60,36],[58,50],[60,64],[36,30],[30,50],[36,70]];
    const fieldRadar=svg(...this.pitchEls(W,Hh,'rgba(255,255,255,.13)'),
      ...us.map((n,i)=>this.h('circle',{key:'u'+i,cx:PX(n),cy:PY(n),r:5.5,fill:ac,style:{filter:'drop-shadow(0 0 4px rgba(163,230,53,.6))'}})),
      ...them.map((n,i)=>this.h('circle',{key:'th'+i,cx:PX(n),cy:PY(n),r:5.5,fill:ai})),
      this.h('circle',{cx:PX([53,46]),cy:PY([53,46]),r:3.2,fill:'#fff',stroke:'#0d0f12',strokeWidth:1}));
    const tt=this.state.tacTab;
    const tabDefs=[['heatmap',fa?'نقشه حرارتی':'Heatmap'],['passing',fa?'شبکه پاس':'Passing'],['formation',fa?'آرایش':'Formation'],['control',fa?'کنترل فضا':'Pitch Control'],['press',fa?'پرس و انتقال':'Press']];
    const tacTabs=tabDefs.map(([id,label])=>({ id, label, active:id===tt,
      bg:id===tt?ac:'transparent', fg:id===tt?'#0d0f12':this.C.sub, set:()=>this.setTacTab(id) }));
    const vizMap={ heatmap:heat, passing:net, formation:formationEl, control:controlEl, press:pressEl };
    const titleMap=Object.fromEntries(tabDefs);
    const oop= fa
      ? 'تیم در فاز خارج از مالکیت به آرایش ۴-۴-۲ فشرده می‌شود؛ میانگین فشردگی عمودی ۲۸ متر و خط دفاع روی خط ۴۰ متری ایستاده است.'
      : 'Out of possession the team compacts into a 4-4-2 block; vertical compactness averages 28m with the defensive line at ~40m.';
    const metrics=[
      { k:'xG', v:'۱٫۸۴', d:fa?'گل مورد انتظار':'Expected goals', c:this.C.ac },
      { k:'xA', v:'۱٫۲۱', d:fa?'پاس گل مورد انتظار':'Expected assists', c:this.C.ai },
      { k:'PPDA', v:'۸٫۴', d:fa?'شدت پرس':'Press intensity', c:this.C.good },
      { k:'xT', v:'+۰٫۹۲', d:fa?'تهدید مورد انتظار':'Expected threat', c:this.C.warn },
    ];
    const patterns= fa ? [
      this.mkAI('t0','الگوی تکرارشونده: ساخت بازی از مدافع راست به وینگر (۷) — ۶۴٪ حملات.','مدل ۴۸۲ زنجیره‌ی پاس را خوشه‌بندی کرد؛ پرتکرارترین خوشه مسیر مدافع راست → وینگر بود که در ۶۴٪ حملات و با اطمینان ۹۱٪ ظاهر شد.'),
      this.mkAI('t1','انتقال سریع پس از بازیافت توپ در زمین میانی، میانگین ۴٫۲ ثانیه تا شوت.','از ۱۸ بازیافت در زمین میانی، ۷ مورد ظرف ۵ ثانیه به شوت رسید؛ میانگین زمان انتقال ۴٫۲ ثانیه محاسبه شد.'),
      this.mkAI('t2','تمرکز پرس روی هافبک دفاعی حریف؛ ۹ بازیافت در یک‌سوم هجومی.','نقشه‌ی کنش‌های دفاعی نشان داد ۹ بازیافت از ۱۴ بازیافت هجومی دقیقاً در منطقه‌ی هافبک دفاعی حریف رخ داده است.')
    ] : [
      this.mkAI('t0','Recurring pattern: build-up from RB to winger (#7) — 64% of attacks.','The model clustered 482 pass chains; the most frequent cluster was RB → winger, appearing in 64% of attacks with 91% confidence.'),
      this.mkAI('t1','Fast transition after recovery in midfield, avg 4.2s to shot.','Of 18 midfield recoveries, 7 reached a shot within 5s; average transition time computed at 4.2s.'),
      this.mkAI('t2','Press focused on opponent DM; 9 recoveries in the attacking third.','The defensive-action map showed 9 of 14 attacking recoveries occurred exactly in the opponent DM zone.')
    ];
    return { heat, net, metrics, patterns: patterns.map((p,i)=>({ ...p, n:this.faN(i+1) })),
      tacTabs, activeViz:vizMap[tt], activeTitle:titleMap[tt], fieldRadar, oop };
  }

  vm_physical(){
    const fa=this.state.lang==='fa';
    const zones=this.h('svg',{viewBox:'0 0 300 150',width:'100%',style:{display:'block'}},
      ...[['۰-۷',.85,this.C.ai],['۷-۱۵',.6,this.C.good],['۱۵-۲۰',.4,this.C.ac],['۲۰-۲۵',.22,this.C.warn],['۲۵+',.1,this.C.dng]].map((z,i)=>{
        const x=20+i*56,bh=z[1]*110; return this.h('g',{key:i},
          this.h('rect',{x,y:130-bh,width:38,height:bh,rx:4,fill:z[2],opacity:.85}),
          this.h('text',{x:x+19,y:145,textAnchor:'middle',fill:this.C.mut,fontSize:9},this.faN(z[0]))); }));
    const workload=this.lineArea([{data:[72,78,85,80,92,88,95,82],color:this.C.ac,fill:true,w:2.4}],{h:160,id:'wl',max:110,
      labels:['ج۱','ج۲','ج۳','ج۴','ج۵','ج۶','ج۷','ج۸'].map(x=>this.faN(x))});
    const risk=[
      { n:'امیر حسینی', acwr:1.42, lvl:'high', ex:['بار حاد هفته‌ی اخیر ۳۸٪ بالاتر از میانگین ۴ هفته بود؛ نسبت ۱٫۴۲ از آستانه‌ی ۱٫۳ عبور کرده و مدل با اطمینان ۹۰٪ ریسک را بالا برآورد کرد.','Acute load was 38% above the 4-week mean; ratio 1.42 crossed the 1.3 threshold — model rates risk high with 90% confidence.'] },
      { n:'کاوه احمدی', acwr:1.18, lvl:'med', ex:['نسبت بار در محدوده‌ی هشدار (۱٫۱–۱٫۳) قرار دارد؛ افزایش تدریجی شدت اسپرینت در ۳ جلسه‌ی اخیر علت اصلی است.','Load ratio sits in the caution band (1.1–1.3); gradual sprint-intensity rise over the last 3 sessions is the main driver.'] },
      { n:'نوید رضایی', acwr:0.94, lvl:'low', ex:['بار حاد و مزمن متعادل است (۰٫۹۴)؛ مدل هیچ الگوی پرشِ ناگهانی در داده‌ی GPS تشخیص نداد.','Acute and chronic load are balanced (0.94); no sudden spikes detected in the GPS data.'] },
      { n:'سجاد محمدی', acwr:1.31, lvl:'med', ex:['نسبت ۱٫۳۱ کمی بالای آستانه است؛ بیشترین سهم از دوی‌های پرشتاب در نیمه‌ی دوم تمرین‌ها بوده.','Ratio 1.31 is slightly over threshold; most of it comes from high-accel runs in the second half of sessions.'] },
    ].map((r,i)=>{ const m={ high:{fa:'بالا',en:'High',c:this.C.dng,b:'rgba(239,68,68,.13)'}, med:{fa:'متوسط',en:'Moderate',c:this.C.warn,b:'rgba(245,158,11,.13)'}, low:{fa:'پایین',en:'Low',c:this.C.good,b:'rgba(74,222,128,.13)'} }[r.lvl];
      const a=this.mkAI('r'+i, '', fa?r.ex[0]:r.ex[1]);
      return { ...r, acwr:this.faN(r.acwr.toFixed(2)), lbl:fa?m.fa:m.en, c:m.c, b:m.b, pct:Math.min(100,r.acwr/1.6*100)+'%',
        open:a.open, onWhy:a.onWhy, whyLabel:a.whyLabel, explain:a.explain }; });
    const tbl=this.roster.slice(0,7).map(p=>({ n:p.n, dist:this.faN(p.dist.toFixed(1)), sp:this.faN(p.sp), load:this.faN(Math.round(p.dist*8+p.sp*3)) }));
    return { zones, workload, risk, tbl };
  }

  genBio(p){ const ht=171+(p.num*7%19), wt=66+(p.num*5%16);
    return { ht, wt, foot: p.num%4===0?['چپ','Left']:['راست','Right'], nat:['ایران','Iran'],
      value:[(p.rate*0.55).toFixed(1)+'M €','€'+(p.rate*0.55).toFixed(1)+'M'],
      contract:['۱۴۰'+(4+p.num%3)+'/۰'+(1+p.num%8), '20'+(25+p.num%3)], contractLeft:['۱'+(2+p.num%9)+' ماه','1'+(2+p.num%9)+'mo'],
      injuries: p.num%3===0 ? [['کشیدگی عضله ران','Thigh strain','۱۴۰۴/۰'+(2+p.num%6),'۱'+(1+p.num%5),p.num%2+1]] : (p.num%3===1?[['پیچ‌خوردگی زانو','Knee sprain','۱۴۰۳/۱'+(p.num%2),'۲'+(p.num%6),1],['کوفتگی','Contusion','۱۴۰۴/۰'+(1+p.num%5),'۵',1]]:[]) }; }
  genRadar(pe){ return ({GK:[30,15,22,82,55,72],RB:[72,42,66,80,84,68],CB:[60,46,42,90,60,84],LB:[70,40,68,78,82,64],DM:[84,52,56,82,68,80],CM:[86,62,72,68,76,70],AM:[88,72,82,52,80,66],RW:[84,78,90,46,92,68],LW:[82,80,86,44,90,66],ST:[68,90,72,40,82,86]}[pe]) || [72,62,66,62,72,70]; }
  fullPlayer(idx){ const p=this.roster[idx]; if(idx===7) return { ...p, ...this.star, isStar:true };
    const b=this.genBio(p); return { ...p, ht:b.ht, wt:b.wt, foot:b.foot[0], footEn:b.foot[1], nat:b.nat[0], natEn:b.nat[1],
      value:b.value[0], valueEn:b.value[1], contract:b.contract[0], contractEn:b.contract[1], contractLeft:b.contractLeft[0], injuries:b.injuries,
      radar:this.genRadar(p.pe), radarFa:['پاس','شوت','دریبل','دفاع','سرعت','قدرت'], radarEn:['Pass','Shot','Dribble','Defend','Pace','Power'],
      form:[0,1,2,3,4,5,6,7,8,9].map(i=>+(p.rate-0.6+Math.sin(i*1.1+p.num)*0.5+i*0.04).toFixed(1)) }; }

  vm_profile(){
    const fa=this.state.lang==='fa';
    const sel = this.state.role==='player' ? {kind:'roster',idx:7} : (this.state.profileSel || {kind:'roster',idx:7});
    const idx = sel.kind==='roster' ? sel.idx : -1;
    const s=this.playerProfile(sel);
    const clubLabel = s.fromLeague ? (fa?s.club:s.clubEn) : (fa?'پارس تهران':'Pars Tehran');
    const radar=this.radar(fa?s.radarFa:s.radarEn, [{values:s.radar,color:this.C.ac}],{size:240});
    const form=this.lineArea([{data:s.form,color:this.C.ac,fill:true,w:2.6}],{h:150,id:'pf',max:10,min:5,
      labels:s.form.map((_,i)=>this.faN(i+1))});
    const sd = (s.num!=null ? Number(s.num) : Math.round((s.rate||7)*7));
    const tiles=[
      { k:fa?'گل':'Goals', v:s.g },{ k:fa?'پاس گل':'Assists', v:s.a },{ k:fa?'دقت پاس':'Pass %', v:(74+sd%20)+'٪' },
      { k:fa?'دریبل موفق':'Dribbles', v:(48+sd%32)+'٪' },{ k:'xG', v:((s.rate||7)*0.82).toFixed(1) },{ k:fa?'سرعت بیشینه':'Top spd', v:(30+sd%9)+'٫'+(1+s.age%8) },
    ].map(x=>({...x, v:this.faN(String(x.v))}));
    const bio=[
      { k:fa?'قد':'Height', v:this.faN(s.ht)+(fa?' سانتی‌متر':' cm') },
      { k:fa?'وزن':'Weight', v:this.faN(s.wt)+(fa?' کیلوگرم':' kg') },
      { k:fa?'سن':'Age', v:this.faN(s.age)+(fa?' سال':' yrs') },
      { k:fa?'پای برتر':'Strong foot', v:fa?s.foot:s.footEn },
      { k:fa?'ملیت':'Nationality', v:fa?s.nat:s.natEn },
      { k:fa?'ارزش بازار':'Market value', v:fa?s.value:s.valueEn },
    ];
    const contract={ end:fa?s.contract:s.contractEn, left:s.contractLeft };
    const ax=fa?s.radarFa:s.radarEn, rv=s.radar;
    const ord=[...rv.keys()].sort((a,b)=>rv[b]-rv[a]);
    const evalAI = this.mkAI('peval'+idx,
      fa?`${s.n} در پوزیشن ${s.pos} با نقاط قوت ${ax[ord[0]]} (${this.faN(rv[ord[0]])}) و ${ax[ord[1]]} (${this.faN(rv[ord[1]])}) شناخته می‌شود؛ ضعف نسبی در ${ax[ord[5]]}. با قد ${this.faN(s.ht)} و وزن ${this.faN(s.wt)}، پروفایل فیزیکی او در تحلیل سبک و ریسک لحاظ شده است.`
       :`${s.en} (${s.pe}) stands out for ${ax[ord[0]]} (${rv[ord[0]]}) and ${ax[ord[1]]} (${rv[ord[1]]}); relatively weak in ${ax[ord[5]]}. At ${s.ht}cm/${s.wt}kg his physical profile feeds the style and risk analysis.`,
      fa?`این ارزیابی از داده‌ی فصل، کنش‌های با توپ، GPS و پارامترهای فیزیکی (قد/وزن) این بازیکن ساخته شده است.`
       :`This evaluation is built from season data, on-ball actions, GPS and this player's physical parameters.`);
    const playerList=this.roster.map((p,i)=>({ name:fa?p.n:p.en, pos:fa?p.pos:p.pe, num:this.faN(p.num), active:i===idx,
      bg:i===idx?'var(--card2)':'transparent', set:()=>this.setProfile(i) }));
    const pm=this.state.profileMenu;
    const injuries=(s.injuries||[]).map(x=>({ name:fa?x[0]:x[1], date:x[2], days:this.faN(x[3]),
      c:x[4]>=2?this.C.dng:this.C.warn, bg:x[4]>=2?'rgba(239,68,68,.13)':'rgba(245,158,11,.13)' }));
    return { radar, form, tiles, bio, contract, evalAI, evalConf:this.faN(s.isStar?91:Math.round(82+s.rate)), injuries, injuryCount:this.faN(injuries.length),
      name:s.n, pos:fa?s.pos:s.pe, num:this.faN(s.num), age:this.faN(s.age), rate:this.faN(s.rate.toFixed(1)),
      canPick:false, playerList, toggleProfileMenu:this.toggleProfileMenu, notPick:true, clubLabel,
      pmOpacity:pm?'1':'0', pmPointer:pm?'auto':'none', pmTransform:pm?'translateY(0)':'translateY(-8px)' };
  }

  league = [
    { n:'آرمین صادقی', en:'A. Sadeghi', pos:'مهاجم', pe:'ST', club:'زاگرس اصفهان', clubEn:'Zagros', age:26, rate:8.4, g:12, a:3 },
    { n:'کیان عباسی', en:'K. Abbasi', pos:'وینگر راست', pe:'RW', club:'البرز کرج', clubEn:'Alborz', age:21, rate:8.1, g:8, a:9 },
    { n:'بهنام تقوی', en:'B. Taghavi', pos:'وینگر چپ', pe:'LW', club:'خلیج‌فارس بندر', clubEn:'Khalij Fars', age:24, rate:8.0, g:7, a:6 },
    { n:'فرهاد یزدانی', en:'F. Yazdani', pos:'هافبک هجومی', pe:'AM', club:'البرز کرج', clubEn:'Alborz', age:28, rate:7.9, g:5, a:11 },
    { n:'سهیل ناصری', en:'S. Naseri', pos:'مهاجم', pe:'ST', club:'کاسپین رشت', clubEn:'Caspian', age:24, rate:7.9, g:10, a:2 },
    { n:'نیما فتحی', en:'N. Fathi', pos:'هافبک دفاعی', pe:'DM', club:'کاسپین رشت', clubEn:'Caspian', age:27, rate:7.7, g:1, a:4 },
    { n:'داریوش کمالی', en:'D. Kamali', pos:'مدافع میانی', pe:'CB', club:'خلیج‌فارس بندر', clubEn:'Khalij Fars', age:30, rate:7.6, g:2, a:1 },
    { n:'وحید اکبری', en:'V. Akbari', pos:'هافبک میانی', pe:'CM', club:'زاگرس اصفهان', clubEn:'Zagros', age:26, rate:7.6, g:3, a:7 },
    { n:'رامین جلالی', en:'R. Jalali', pos:'مدافع راست', pe:'RB', club:'البرز کرج', clubEn:'Alborz', age:25, rate:7.4, g:1, a:5 },
    { n:'پیمان رستگار', en:'P. Rastegar', pos:'دروازه‌بان', pe:'GK', club:'خلیج‌فارس بندر', clubEn:'Khalij Fars', age:29, rate:7.5, g:0, a:0 },
    { n:'شایان مرادی', en:'S. Moradi', pos:'مهاجم', pe:'ST', club:'زاگرس اصفهان', clubEn:'Zagros', age:22, rate:7.8, g:9, a:4 },
    { n:'حسام رحیمی', en:'H. Rahimi', pos:'وینگر راست', pe:'RW', club:'کاسپین رشت', clubEn:'Caspian', age:23, rate:7.7, g:6, a:8 },
  ];

  vm_scouting(){
    const fa=this.state.lang==='fa', league=this.state.scoutScope==='league';
    const pf=this.state.scoutPos;
    const posCat=p=>{ const s=(p.pos||'')+(p.pe||''); if(/دروازه|GK/.test(s))return'gk'; if(/مدافع|B$|CB|RB|LB/.test(s))return'def'; if(/هافبک|M$|DM|CM|AM/.test(s))return'mid'; return'fwd'; };
    const src=(league ? this.league : this.roster).filter(p=> pf==='all' || posCat(p)===pf);
    const posDefs=[['all',fa?'همه':'All'],['gk',fa?'دروازه‌بان':'GK'],['def',fa?'مدافع':'DEF'],['mid',fa?'هافبک':'MID'],['fwd',fa?'مهاجم':'FWD']];
    const posFilters=posDefs.map(([id,label])=>({ id, label, active:id===pf,
      bg:id===pf?'var(--card2)':'var(--card)', bd:id===pf?'var(--bd2)':'var(--bd)', fg:id===pf?'var(--tx)':'var(--sub)', set:()=>this.setScoutPos(id) }));
    const rows=src.map(p=>({ n:fa?p.n:p.en, pos:fa?p.pos:p.pe, num:league?'':this.faN(p.num),
      tag: league ? (fa?p.n:p.en).slice(0,1) : this.faN(p.num),
      club: league?(fa?p.club:p.clubEn):(fa?'پارس تهران':'Pars Tehran'),
      age:this.faN(p.age), rate:this.faN(p.rate.toFixed(1)), g:this.faN(p.g), a:this.faN(p.a),
      rateC: p.rate>=8?this.C.ac:p.rate>=7.5?this.C.good:this.C.sub, fromFilm:league }));
    const cmp=this.radar(fa?['پاس','شوت','دریبل','دفاع','سرعت','قدرت']:['Pass','Shot','Drib','Def','Pace','Pow'],
      [{values:[88,82,91,46,93,71],color:this.C.ac},{values:[74,90,68,40,80,85],color:this.C.ai}],{size:230});
    const similar=[
      { n: fa?'کیان عباسی':'K. Abbasi', club: fa?'البرز کرج':'Alborz', match:92 },
      { n: fa?'بهنام تقوی':'B. Taghavi', club: fa?'خلیج‌فارس بندر':'Khalij Fars', match:87 },
      { n: fa?'حسام رحیمی':'H. Rahimi', club: fa?'کاسپین رشت':'Caspian', match:84 },
    ].map(s=>({ ...s, matchF:this.faN(s.match) }));
    const scopeTeam = this.state.scoutScope==='team';
    const s=this.star;
    const pbio=[
      { k:fa?'قد':'Height', v:this.faN(s.ht)+(fa?' سانتی‌متر':' cm') },
      { k:fa?'وزن':'Weight', v:this.faN(s.wt)+(fa?' کیلوگرم':' kg') },
      { k:fa?'سن':'Age', v:this.faN(s.age) },
      { k:fa?'پای برتر':'Foot', v:fa?s.foot:s.footEn },
      { k:fa?'ارزش بازار':'Market value', v:fa?s.value:s.valueEn },
      { k:fa?'پایان قرارداد':'Contract end', v:fa?s.contract:s.contractEn, warn:true },
    ];
    const view=this.state.scoutView, C=this.C;
    const viewDefs=[['list',fa?'فهرست':'List'],['rankings',fa?'رتبه‌بندی':'Rankings'],['shadow',fa?'تیم سایه':'Shadow team']];
    const scoutViews=viewDefs.map(([id,label])=>({ id, label, active:id===view,
      bg:id===view?'var(--card2)':'transparent', fg:id===view?this.C.ac:this.C.sub, set:()=>this.setScoutView(id) }));
    // leaderboard (top by rating from league)
    const lb=[...this.league].sort((a,b)=>b.rate-a.rate).slice(0,7).map((p,i)=>({ rank:this.faN(i+1), n:fa?p.n:p.en, club:fa?p.club:p.clubEn,
      rate:this.faN(p.rate.toFixed(1)), pct:(p.rate/9*100)+'%', c:i===0?this.C.ac:i<3?this.C.good:this.C.sub }));
    // scatter: x=keyPass/90 (proxy a), y=xG/90 (proxy g/10)
    const SW=320,SH=230,sp={l:38,b:30,t:12,r:12};
    const sx=v=>sp.l+(v/10)*(SW-sp.l-sp.r), sy=v=>SH-sp.b-(v/1)*(SH-sp.t-sp.b);
    const sgrid=[]; for(let i=0;i<=4;i++){ const y=sp.t+(i/4)*(SH-sp.t-sp.b); sgrid.push(this.h('line',{key:'sg'+i,x1:sp.l,y1:y,x2:SW-sp.r,y2:y,stroke:this.C.grid,strokeWidth:1})); }
    const sdots=this.league.slice(0,10).map((p,i)=>{ const x=sx((p.a/12)*10), y=sy(Math.min(1,(p.g/14)));
      const hot=p.rate>=8; return this.h('g',{key:'sd'+i},
        this.h('circle',{cx:x,cy:y,r:hot?6:4.5,fill:hot?this.C.ac:this.C.ai,fillOpacity:hot?1:.7}),
        hot?this.h('text',{x,y:y-9,textAnchor:'middle',fill:this.C.sub,fontSize:8,fontWeight:700},(fa?p.n:p.en).split(' ').pop()):null); });
    const scatterEl=this.h('svg',{viewBox:`0 0 ${SW} ${SH}`,width:'100%',style:{display:'block'}},...sgrid,
      this.h('text',{x:SW/2,y:SH-8,textAnchor:'middle',fill:this.C.mut,fontSize:9},fa?'پاس کلیدی / ۹۰':'Key passes / 90'),
      this.h('text',{x:12,y:SH/2,textAnchor:'middle',fill:this.C.mut,fontSize:9,transform:`rotate(-90 12 ${SH/2})`},'xG / 90'),
      ...sdots);
    // shadow team 4-3-3
    const sh=[['دروازه‌بان','پیمان رستگار','۷٫۵',9,50],['مدافع راست','رامین جلالی','۷٫۴',24,18],['مدافع میانی','داریوش کمالی','۷٫۶',22,40],['مدافع میانی','مهدی شریفی','۷٫۶',22,60],['مدافع چپ','سجاد محمدی','۷٫۰',24,82],['هافبک','نیما فتحی','۷٫۷',42,30],['هافبک','فرهاد یزدانی','۷٫۹',44,50],['هافبک','وحید اکبری','۷٫۶',42,70],['وینگر راست','کیان عباسی','۸٫۱',76,20],['مهاجم','آرمین صادقی','۸٫۴',86,50],['وینگر چپ','بهنام تقوی','۸٫۰',76,80]];
    const SPW=460,SPH=300, spx=x=>4+(x/100)*(SPW-8), spy=y=>4+(y/100)*(SPH-8);
    const shadowEl=this.h('svg',{viewBox:`0 0 ${SPW} ${SPH}`,width:'100%',style:{display:'block'}},...this.pitchEls(SPW,SPH,'rgba(255,255,255,.12)'),
      ...sh.map((p,i)=>this.h('g',{key:'sh'+i},
        this.h('circle',{cx:spx(p[3]),cy:spy(p[4]),r:13,fill:'#0d0f12',stroke:this.C.ac,strokeWidth:1.6}),
        this.h('text',{x:spx(p[3]),y:spy(p[4]),dy:'.34em',textAnchor:'middle',fill:this.C.ac,fontSize:9,fontWeight:800},p[2]),
        this.h('text',{x:spx(p[3]),y:spy(p[4])+22,textAnchor:'middle',fill:this.C.sub,fontSize:8.5},p[1].split(' ')[0]))));
    return { rows, cmp, similar, league, pbio, pName:s.n, scoutViews, posFilters,
      excelExport:()=>{},
      vw_list:view==='list', vw_rankings:view==='rankings', vw_shadow:view==='shadow',
      leaderboard:lb, scatterEl, shadowEl,
      scopeTeamBg: scopeTeam?'var(--ac)':'transparent', scopeTeamFg: scopeTeam?'#0d0f12':'var(--sub)',
      scopeLeagueBg: league?'var(--ac)':'transparent', scopeLeagueFg: league?'#0d0f12':'var(--sub)',
      setTeam:()=>this.setScope('team'), setLeague:()=>this.setScope('league'),
      playerCount:this.faN(league?'۱٬۸۴۰':'۱۱') };
  }

  vm_clips(){
    const fa=this.state.lang==='fa';
    const clips=[
      { t:fa?'گل امیر حسینی — دقیقه ۳۸':'Hosseini goal — 38\'', dur:'۰:۱۲', ty:fa?'گل':'Goal', c:this.C.ac },
      { t:fa?'پرس موفق نیمه دوم':'H2 press recovery', dur:'۰:۰۸', ty:fa?'پرس':'Press', c:this.C.ai },
      { t:fa?'پاس کلیدی کاظمی':'Kazemi key pass', dur:'۰:۰۹', ty:fa?'پاس':'Pass', c:this.C.good },
      { t:fa?'موقعیت از دست‌رفته — دقیقه ۷۴':'Missed chance — 74\'', dur:'۰:۱۵', ty:fa?'شوت':'Shot', c:this.C.warn },
      { t:fa?'تکل دفاعی شریفی':'Sharifi tackle', dur:'۰:۰۷', ty:fa?'تکل':'Tackle', c:this.C.dng },
      { t:fa?'ضدحمله سریع':'Quick counter', dur:'۰:۱۱', ty:fa?'انتقال':'Transition', c:this.C.ac },
    ];
    const lists=[
      { n:fa?'بازی کامل — زاگرس':'Full match — Zagros', cnt:42 },
      { n:fa?'جلسه تیمی دوشنبه':'Team meeting Mon', cnt:18, active:1 },
      { n:fa?'کلیپ‌های امیر حسینی':'Amir Hosseini clips', cnt:12 },
      { n:fa?'فازهای دفاعی':'Defensive phases', cnt:9 },
    ];
    return { clips: clips.map((c,i)=>{ const bk=!!this.state.bookmarks['clip'+i];
        return { ...c, bk, bkColor:bk?'var(--warn)':'var(--sub)', bkFill:bk?'var(--warn)':'none', onBk:()=>this.toggleBookmark('clip'+i) }; }),
      lists: lists.map(l=>({...l, cnt:this.faN(l.cnt),
        bg:l.active?'var(--acd)':'var(--card)', bd:l.active?'rgba(163,230,53,.35)':'var(--bd)', fg:l.active?'var(--ac)':'var(--tx)' })) };
  }

  vm_reports(){
    const fa=this.state.lang==='fa';
    const cmpBars=[
      { k:fa?'مالکیت':'Possession', a:58, b:42 },
      { k:fa?'شوت':'Shots', a:14, b:8, max:20 },
      { k:fa?'شوت در چارچوب':'On target', a:6, b:3, max:10 },
      { k:'xG', a:65, b:35 },
      { k:fa?'دقت پاس':'Pass %', a:87, b:79 },
      { k:fa?'بازیافت':'Recoveries', a:54, b:46 },
    ].map(x=>({ ...x, ap:(x.a/(x.max||100)*100), bp:(x.b/(x.max||100)*100), av:this.faN(x.a), bv:this.faN(x.b) }));
    const rt=this.state.repType;
    const typeDefs=[
      ['team', fa?'تیم‌مقابل‌تیم':'Team vs team'],
      ['match', fa?'خلاصه بازی':'Match summary'],
      ['matchday', fa?'روز بازی':'Match day'],
      ['prematch', fa?'پیش‌بازی':'Pre-match'],
      ['season', fa?'فصل':'Season'],
    ];
    const repTypes=typeDefs.map(([id,label])=>({ id, label, active:id===rt,
      bg:id===rt?'var(--ac)':'var(--card)', fg:id===rt?'#0d0f12':'var(--sub)', bd:id===rt?'var(--ac)':'var(--bd)', set:()=>this.setRepType(id) }));
    const summaries={
      team: fa?'پارس تهران با کنترل مالکیت و فشار مؤثر در یک‌سوم هجومی برتری داشت. تفاوت کلیدی در کیفیت موقعیت‌سازی (xG ۱٫۸۴ مقابل ۰٫۹۷) و دقت پاس بود.':'Pars Tehran dominated with possession and effective pressing. Key difference was chance quality (xG 1.84 vs 0.97) and pass accuracy.',
      match: fa?'بازی در نیمه‌ی دوم با گل دقیقه ۳۸ امیر حسینی و افزایش شدت پرس به سود پارس چرخید؛ مجموع ۱۴ شوت و ۶ موقعیت در چارچوب.':'The match turned in the second half after Hosseini\'s 38\' goal and a higher press; 14 shots, 6 on target.',
      matchday: fa?'گزارش روز بازی: ترکیب پیشنهادی ۴-۳-۳، تمرکز بر نفوذ جناح راست و آماده‌باش برای ضدحمله‌های حریف از کریدور چپ.':'Match-day report: suggested 4-3-3, focus on right-flank penetration, alert to opponent counters down the left.',
      prematch: fa?'گزارش پیش‌بازی حریف (زاگرس اصفهان): الگوی ساخت بازی از عقب، ضعف در پوشش فضای بین خطوط و آسیب‌پذیری روی ضربات ایستگاهی.':'Pre-match scout (Zagros): build-up from the back, weak between-the-lines cover, vulnerable on set-pieces.',
      season: fa?'گزارش فصل: ۱۲ برد، ۵ مساوی، ۳ باخت. روند xG صعودی، میانگین PPDA ۸٫۹ و بهترین گلزن امیر حسینی با ۹ گل.':'Season report: 12W-5D-3L. Rising xG trend, average PPDA 8.9, top scorer Hosseini with 9 goals.',
    };
    const titleMap=Object.fromEntries(typeDefs);
    return { cmpBars, repTypes, repSummary:summaries[rt], repTitle:titleMap[rt], isTeamRep: rt==='team' };
  }

  vm_assistant(){
    const fa=this.state.lang==='fa';
    const learned= fa ? [
      'تمرکز تحلیلی: فازهای حمله و نفوذ از جناح‌ها',
      'سبک مورد علاقه: تهاجمی با ریسک‌پذیری بالا',
      'عمق ترجیحی: تحلیل مفصل با جزئیات تاکتیکی',
      'بازیکنان کلیدی موردتوجه: امیر حسینی، کاوه احمدی'
    ] : [
      'Analytical focus: attacking phases & flank penetration',
      'Preferred style: aggressive, high risk-taking',
      'Preferred depth: detailed tactical breakdown',
      'Key players tracked: Hosseini, Ahmadi'
    ];
    const history=[
      { t:fa?'تحلیل بازی زاگرس':'Zagros analysis', d:fa?'امروز':'Today', active:1 },
      { t:fa?'مقایسه فرم مهاجمان':'Strikers form', d:fa?'دیروز':'Yesterday' },
      { t:fa?'پلن تمرین هفته':'Weekly plan', d:fa?'۳ روز پیش':'3d ago' },
      { t:fa?'آنالیز حریف البرز':'Alborz scout', d:fa?'هفته پیش':'1w ago' },
    ];
    const p=this.state.persona;
    const seg=(key,opts)=>({ key, opts: opts.map(o=>({ label:fa?o.fa:o.en, val:o.v,
      bg:p[key]===o.v?'var(--ac)':'transparent', fg:p[key]===o.v?'#0d0f12':'var(--sub)', set:()=>this.setPersona(key,o.v) })) });
    const segments=[
      { title:fa?'سبک تحلیل':'Analysis style', ...seg('style',[{v:'attack',fa:'تهاجمی',en:'Attacking'},{v:'balanced',fa:'متعادل',en:'Balanced'},{v:'defense',fa:'دفاعی',en:'Defensive'}]) },
      { title:fa?'عمق تحلیل':'Analysis depth', ...seg('depth',[{v:'brief',fa:'خلاصه',en:'Brief'},{v:'detailed',fa:'مفصل',en:'Detailed'}]) },
      { title:fa?'زاویه تحلیل':'Analysis angle', ...seg('focus',[{v:'tactical',fa:'تاکتیکی',en:'Tactical'},{v:'statistical',fa:'آماری',en:'Statistical'}]) },
    ];
    return { learned, history: history.map(h=>({...h, bg:h.active?'var(--acd)':'transparent', bd:h.active?'rgba(163,230,53,.3)':'var(--bd)'})), segments };
  }

  vm_model(){
    const fa=this.state.lang==='fa';
    const acc=this.lineArea([
      {data:[85,87,88,90,91,92,93,94,95,96],color:this.C.ac,fill:true,w:2.8},
    ],{h:210,id:'acc',max:100,min:80,labels:['د۱','د۲','د۳','د۴','د۵','د۶','د۷','د۸','د۹','د۱۰'].map(x=>this.faN(x))});
    const evAcc=[
      { k:fa?'تشخیص پاس':'Pass detection', v:97 },
      { k:fa?'تشخیص شوت':'Shot detection', v:95 },
      { k:fa?'ردیابی بازیکن':'Player tracking', v:93 },
      { k:fa?'تشخیص پرس':'Press detection', v:89 },
      { k:fa?'تشخیص آفساید':'Offside calls', v:91 },
    ].map(x=>({ ...x, vF:this.faN(x.v), c: x.v>=95?this.C.good:x.v>=90?this.C.ac:this.C.warn }));
    const corrections= fa ? [
      { u:'کاوه مرادی', a:'«پرس» به «تکل» اصلاح شد', t:'۲ ساعت پیش' },
      { u:'سارا عظیمی', a:'مرز فاز انتقال جابه‌جا شد', t:'۵ ساعت پیش' },
      { u:'کاوه مرادی', a:'تأیید ۱۸ تگ خودکار پاس', t:'دیروز' },
      { u:'رضا فلاح', a:'موقعیت آفساید اصلاح شد', t:'۲ روز پیش' },
    ] : [
      { u:'K. Moradi', a:'"Press" corrected to "Tackle"', t:'2h ago' },
      { u:'S. Azimi', a:'Transition boundary adjusted', t:'5h ago' },
      { u:'K. Moradi', a:'Confirmed 18 auto pass tags', t:'Yesterday' },
      { u:'R. Fallah', a:'Offside position corrected', t:'2d ago' },
    ];
    return { acc, evAcc, corrections };
  }

  LEAGUES = [
    { id:'pg', name:'لیگ برتر خلیج‌فارس', nameEn:'Persian Gulf League', teams:['زاگرس اصفهان','البرز کرج','خلیج‌فارس بندر','کاسپین رشت'] },
    { id:'azadegan', name:'لیگ آزادگان', nameEn:'Azadegan League', teams:['فجر شیراز','مس کرمان','نساجی قائم‌شهر'] },
    { id:'youth', name:'لیگ امید (جوانان)', nameEn:'U21 League', teams:['آینده‌سازان تهران','ستارگان نوین'] },
  ];
  FN = ['آرش','کیان','بهنام','فرهاد','سهیل','نیما','حسام','مهدی','رضا','امیر','سامان','میلاد','کاوه','نوید','آرمین','شایان','پارسا','یاسین','بردیا','هومن','احسان','مازیار'];
  LN = ['کریمی','رستمی','نوری','شریفی','قاسمی','یوسفی','نصری','فتحی','رحیمی','مرادی','صادقی','عباسی','تقوی','یزدانی','اکبری','حیدری','جعفری','موسوی','سلطانی','کاظمی','بهرامی','رضوی'];
  GPOS = [['دروازه‌بان','GK'],['مدافع میانی','CB'],['مدافع راست','RB'],['هافبک دفاعی','DM'],['هافبک هجومی','AM'],['وینگر راست','RW'],['وینگر چپ','LW'],['مهاجم','ST']];
  genTeamPlayers(team, teamEn, seed){ return Array.from({length:5},(_,i)=>{ const s=seed*7+i*13; const pos=this.GPOS[s%this.GPOS.length];
    return { n:this.FN[s%this.FN.length]+' '+this.LN[(s*3)%this.LN.length], en:'Player '+(s%99), pos:pos[0], pe:pos[1], age:19+s%14,
      rate:+(6.7+(s%14)/10).toFixed(1), g:s%6, a:(s*2)%5, num:(s%23)+1, club:team, clubEn:teamEn }; }); }

  playerProfile(sel){
    if(!sel || sel.kind==='roster') return this.fullPlayer(sel ? sel.idx : 7);
    const p={ ...sel.p, num: sel.p.num || ((sel.p.n||'').length*3 + (sel.p.age||22)) };
    const b=this.genBio(p);
    return { ...p, ht:b.ht, wt:b.wt, foot:b.foot[0], footEn:b.foot[1], nat:b.nat[0], natEn:b.nat[1],
      value:b.value[0], valueEn:b.value[1], contract:b.contract[0], contractEn:b.contract[1], contractLeft:b.contractLeft[0], injuries:b.injuries,
      radar:this.genRadar(p.pe), radarFa:['پاس','شوت','دریبل','دفاع','سرعت','قدرت'], radarEn:['Pass','Shot','Dribble','Defend','Pace','Power'],
      form:[0,1,2,3,4,5,6,7,8,9].map(i=>+(p.rate-0.6+Math.sin(i*1.1+p.num)*0.5+i*0.04).toFixed(1)), fromLeague:true };
  }

  vm_leaguedb(){
    const fa=this.state.lang==='fa', C=this.C, st=this.state;
    const OWN=fa?'پارس تهران':'Pars Tehran';
    const view=st.ldbView||'myteam';
    const ALL_LG=[...this.LEAGUES, ...st.customLeagues];
    const posCat=(pos,pe)=>{ const s=(pos||'')+(pe||''); if(/دروازه|GK/.test(s))return'gk'; if(/مدافع|B$|CB|RB|LB/.test(s))return'def'; if(/هافبک|M$|DM|CM|AM/.test(s))return'mid'; return'fwd'; };
    const PR={gk:0,def:1,mid:2,fwd:3};
    const mk=(p,seed,club,clubEn,own,sel)=>{ const pc=posCat(p.pos,p.pe); return { n:fa?p.n:p.en, club:fa?club:clubEn, clubRaw:club, pos:fa?p.pos:p.pe, posCat:pc, posRank:PR[pc],
      age:p.age, ht:171+(seed*7%19), wt:66+(seed*5%16), foot: seed%4===0?(fa?'چپ':'L'):(fa?'راست':'R'),
      rate:p.rate, valN:+(p.rate*0.55).toFixed(1), inj:seed%3, contract:'۱۴۰'+(4+seed%3)+'/۰'+(1+seed%8), own, sel }; };
    // own roster
    const own=this.roster.map((p,i)=>mk(p,p.num,'پارس تهران','Pars Tehran',true,{kind:'roster',idx:i}));
    // players for every active league
    let lg=[];
    st.activeLeagues.forEach(lid=>{
      if(lid==='pg'){ this.league.forEach((p,i)=>lg.push(mk(p,i+20,p.club,p.clubEn,false,{kind:'obj',p}))); }
      else { const L=ALL_LG.find(x=>x.id===lid); if(L) L.teams.forEach((tn,ti)=>this.genTeamPlayers(tn,tn,(lid.length+ti+3))
        .forEach((p,pi)=>lg.push(mk(p,(ti+2)*9+pi*5,p.club,p.clubEn,false,{kind:'obj',p})))); }
    });
    let all = view==='myteam' ? [...own] : [...lg];
    // league-view left rail: leagues (nested teams) + all
    const railAll={ active:st.leagueTeam==='all', bg:st.leagueTeam==='all'?'var(--card2)':'transparent', fg:st.leagueTeam==='all'?'var(--ac)':'var(--sub)', set:()=>this.setLeagueTeam('all') };
    const railLeagues=st.activeLeagues.map(lid=>{ const L=ALL_LG.find(x=>x.id===lid); const key='league:'+lid; const lon=st.leagueTeam===key;
      return { name:fa?L.name:L.nameEn, active:lon, bg:lon?'var(--card2)':'transparent', fg:lon?'var(--ac)':'var(--sub)', set:()=>this.setLeagueTeam(key),
        teams:L.teams.map(tn=>({ name:tn, active:st.leagueTeam===tn, fg:st.leagueTeam===tn?'var(--ac)':'var(--sub)', set:()=>this.setLeagueTeam(tn) })) }; });
    // filter (league view uses rail; myteam ignores rail)
    const T=st.leagueTeam, q=st.leagueSearch.trim();
    all=all.filter(p=>{ let teamOk=true;
      if(view==='myteam') teamOk=true;
      else if(T==='all') teamOk=true;
      else if(T.indexOf('league:')===0){ const L=ALL_LG.find(x=>'league:'+x.id===T); teamOk=!!L && L.teams.includes(p.clubRaw); }
      else teamOk=p.clubRaw===T;
      return teamOk && (st.leaguePos==='all'||p.posCat===st.leaguePos) && (!q || (p.n+p.club+p.pos).includes(q)); });
    const posDefs=[['all',fa?'همه':'All'],['gk',fa?'دروازه‌بان':'GK'],['def',fa?'مدافع':'DEF'],['mid',fa?'هافبک':'MID'],['fwd',fa?'مهاجم':'FWD']];
    const posFilters=posDefs.map(([id,label])=>({ id,label, active:id===st.leaguePos, bg:id===st.leaguePos?'var(--card2)':'transparent', fg:id===st.leaguePos?'var(--ac)':'var(--sub)', set:()=>this.setLeaguePos(id) }));
    const sk=st.leagueSort.key, sd=st.leagueSort.dir==='asc'?1:-1;
    all.sort((a,b)=>{ if(sk==='pos'){ return (a.posRank-b.posRank)*sd || b.rate-a.rate; }
      const av=a[sk],bv=b[sk]; return (typeof av==='string'? String(av).localeCompare(String(bv),'fa') : av-bv)*sd; });
    const cols=[['n',fa?'نام':'Name'],['club',fa?'باشگاه':'Club'],['pos',fa?'پوزیشن':'Position'],['age',fa?'سن':'Age'],['ht',fa?'قد':'Ht'],['wt',fa?'وزن':'Wt'],['rate',fa?'امتیاز':'Rating'],['valN',fa?'ارزش':'Value'],['inj',fa?'مصدومیت':'Inj'],['contract',fa?'قرارداد':'Contract']];
    const columns=cols.map(([key,label])=>({ key,label, active:key===sk, arrow: key===sk?(st.leagueSort.dir==='asc'?'↑':'↓'):'', fg:key===sk?'var(--ac)':'var(--mut)', set:()=>this.setLeagueSort(key) }));
    const rows=all.map(p=>({ n:p.n, club:p.club, pos:p.pos, age:this.faN(p.age), ht:this.faN(p.ht), wt:this.faN(p.wt),
      rate:this.faN(p.rate.toFixed(1)), rateC:p.rate>=8?C.ac:p.rate>=7.5?C.good:C.sub, val:this.faN(p.valN)+'M', inj:this.faN(p.inj), injC:p.inj>=2?C.dng:p.inj===1?C.warn:C.mut,
      contract:p.contract, ini:p.n.slice(0,1), ownTag: p.own?(fa?'خودی':'Own'):'', view:()=>this.viewPlayer(p.sel) }));
    // manage view: list of active leagues
    const manageLeagues=st.activeLeagues.map(lid=>{ const L=ALL_LG.find(x=>x.id===lid);
      const pCount = lid==='pg'? this.league.length : L.teams.length*5;
      return { id:lid, name:fa?L.name:L.nameEn, teamsN:this.faN(L.teams.length), playersN:this.faN(pCount),
        teamList:L.teams.join('، '), own: lid==='pg', custom:!!L.custom, remove:()=>this.removeLeague(lid) }; });
    return { view, ldb_manage:view==='manage', ldb_myteam:view==='myteam', ldb_league:view==='league', ldb_table:view!=='manage',
      railAll, railLeagues, manageLeagues, posFilters, columns, rows,
      leagueInput:st.leagueInput, onLeagueInput:this.onLeagueInput, addLeagueByName:this.addLeagueByName,
      fetchingLeague:st.fetchingLeague, isFetching: !!st.fetchingLeague,
      count:this.faN(rows.length), teamCount:this.faN(new Set(all.map(p=>p.clubRaw)).size),
      search:st.leagueSearch, onSearch:this.onLeagueSearch };
  }

  vm_transfer(){
    const fa=this.state.lang==='fa', C=this.C;
    const T=[
      { n:'کیان عباسی', en:'K. Abbasi', club:'البرز کرج', clubEn:'Alborz', pos:'وینگر راست', pe:'RW', age:21, val:'۴٫۵M €', score:88, vfm:84, inj:18, agef:92, fit:90, con:70 },
      { n:'آرمین صادقی', en:'A. Sadeghi', club:'زاگرس اصفهان', clubEn:'Zagros', pos:'مهاجم', pe:'ST', age:26, val:'۶٫۲M €', score:81, vfm:68, inj:30, agef:72, fit:86, con:55 },
      { n:'بهنام تقوی', en:'B. Taghavi', club:'خلیج‌فارس بندر', clubEn:'Khalij', pos:'وینگر چپ', pe:'LW', age:24, val:'۴٫۸M €', score:76, vfm:74, inj:45, agef:80, fit:78, con:60 },
      { n:'فرهاد یزدانی', en:'F. Yazdani', club:'البرز کرج', clubEn:'Alborz', pos:'هافبک هجومی', pe:'AM', age:28, val:'۳٫۹M €', score:69, vfm:82, inj:55, agef:58, fit:72, con:80 },
    ].map((t,i)=>({ ...t, name:fa?t.n:t.en, clubN:fa?t.club:t.clubEn, posN:fa?t.pos:t.pe, age:this.faN(t.age), scoreF:this.faN(t.score),
      sc: t.score>=85?C.ac:t.score>=72?C.good:C.warn,
      rec: t.score>=85?(fa?'خرید توصیه می‌شود':'Recommended buy'):t.score>=72?(fa?'زیرنظر بگیرید':'Watch'):(fa?'پرهیز':'Avoid'),
      recC: t.score>=85?C.ac:t.score>=72?C.good:C.warn, active:i===0 }));
    const sel=T[0];
    const factors=[
      { k:fa?'ارزش به قیمت':'Value for money', v:sel.vfm },
      { k:fa?'ریسک مصدومیت (پایین بهتر)':'Injury risk (lower=better)', v:100-sel.inj, raw:sel.inj, inv:true },
      { k:fa?'سن':'Age', v:sel.agef },
      { k:fa?'تناسب سبک':'Style fit', v:sel.fit },
      { k:fa?'وضعیت قرارداد':'Contract leverage', v:sel.con },
    ].map(f=>({ ...f, vF:this.faN(f.v), pct:f.v+'%', c: f.v>=80?C.ac:f.v>=60?C.good:C.warn }));
    const buyDonut=this.donut(sel.score, sel.sc, 92, 9);
    return { targets:T, sel, factors, buyDonut, selName:sel.name, selRec:sel.rec, selRecC:sel.recC, selVal:sel.val };
  }

  vm_settings(){
    const fa=this.state.lang==='fa';
    const users=[
      { n:'کاوه مرادی', en:'K. Moradi', role:fa?'آنالیزور ارشد':'Senior Analyst', rc:this.C.ac },
      { n:'سارا عظیمی', en:'S. Azimi', role:fa?'مربی':'Coach', rc:this.C.ai },
      { n:'رضا فلاح', en:'R. Fallah', role:fa?'آنالیزور':'Analyst', rc:this.C.good },
      { n:'امیر حسینی', en:'A. Hosseini', role:fa?'بازیکن':'Player', rc:this.C.sub },
      { n:'بهرام نیک‌پور', en:'B. Nikpour', role:fa?'مدیر باشگاه':'Club Admin', rc:'#c084fc' },
      { n:'مدیر سامانه نکسا', en:'Nexa Sysadmin', role:fa?'سوپر ادمین':'Super Admin', rc:'#f43f5e' },
    ].map(u=>({ ...u, name:fa?u.n:u.en, ini:(fa?u.n:u.en).slice(0,1) }));
    return { users };
  }

  vm_sysadmin(){
    const fa=this.state.lang==='fa', tab=this.state.sysTab, C=this.C;
    const tabs=[
      { id:'overview', label:fa?'نمای کلی':'Overview', ic:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
      { id:'aiapi', label:fa?'API هوش مصنوعی':'AI API', ic:'M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z' },
      { id:'ml', label:fa?'یادگیری ماشین':'ML', ic:'M6 6h12v12H6zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3' },
      { id:'sms', label:fa?'پیامک و OTP':'SMS & OTP', ic:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
      { id:'billing', label:fa?'صورت‌حساب':'Billing', ic:'M2 7h20v12H2zM2 11h20M6 15h4' },
      { id:'logs', label:fa?'لاگ و استفاده':'Logs', ic:'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5' },
      { id:'general', label:fa?'عمومی':'General', ic:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.5L17 7a8 8 0 0 0-1.7-1L15 3H9l-.3 3A8 8 0 0 0 7 7L4.6 6 2.6 9.5 4.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.5L7 17a8 8 0 0 0 1.7 1L9 21h6l.3-3a8 8 0 0 0 1.7-1l2.4 1 2-3.5z' },
    ].map(t=>({ ...t, active:t.id===tab, bg:t.id===tab?'var(--card2)':'transparent', fg:t.id===tab?'#f43f5e':'var(--sub)', set:()=>this.setSysTab(t.id) }));
    const flags={}; ['overview','aiapi','ml','sms','billing','logs','general'].forEach(x=>flags['sy_'+x]=tab===x);
    const aiModels=[
      { tag: fa?'مدل متنی (LLM)':'Text model (LLM)', use: fa?'چت دستیار، گزارش، تحلیل زبانی':'Assistant chat, reports, language analysis', prov:'Anthropic Claude', model:'claude-opus-4', ep:'api.anthropic.com/v1', on:true, c:'#38bdf8', bg:'rgba(56,189,248,.13)', icon:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
      { tag: fa?'مدل بینایی/تصویری':'Vision model', use: fa?'ردیابی بازیکن، تشخیص رویداد، اسکلت':'Player tracking, event detection, skeleton', prov:'Google Gemini Vision', model:'gemini-2.0-vision', ep:'generativelanguage.googleapis.com', on:true, c:'#a3e635', bg:'rgba(163,230,53,.13)', icon:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z' },
      { tag: fa?'مدل تعبیه (Embedding)':'Embedding model', use: fa?'بازیکن مشابه، جستجوی معنایی':'Similar players, semantic search', prov:'OpenAI', model:'text-embedding-3-large', ep:'api.openai.com/v1', on:true, c:'#c084fc', bg:'rgba(192,132,252,.13)', icon:'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
      { tag: fa?'تشخیص حالت بدن (Pose)':'Pose estimation', use: fa?'اسکلت و تحلیل بایومکانیک':'Skeleton & biomechanics', prov:'YOLO-Pose / MediaPipe', model:'yolov8-pose', ep:'self-hosted · gpu-cluster', on:true, c:'#f59e0b', bg:'rgba(245,158,11,.13)', icon:'M13 4a2 2 0 1 1-.01-.01M6 20l3-5 2 2 3-6 4 4' },
      { tag: fa?'گفتار به متن (ASR)':'Speech-to-text', use: fa?'یادداشت صوتی آنالیزور':'Analyst voice notes', prov:'OpenAI Whisper', model:'whisper-large-v3', ep:'api.openai.com/v1/audio', on:false, c:'#4ade80', bg:'rgba(74,222,128,.13)', icon:'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10a7 7 0 0 1-14 0M12 19v4' },
    ].concat(this.state.aiExtra||[]).map((m,i)=>({ ...m, stc: m.on?'#4ade80':'#6b7280', stLabel: m.on?(fa?'فعال':'Active'):(fa?'غیرفعال':'Off'),
      testState: (this.state.modelTest||{})[i],
      testLabel: ((this.state.modelTest||{})[i]==='testing')?(fa?'در حال تست…':'Testing…'):(((this.state.modelTest||{})[i]==='ok')?(fa?'✓ اتصال موفق':'✓ Connected'):(fa?'تست اتصال':'Test')),
      testBg: ((this.state.modelTest||{})[i]==='ok')?'rgba(74,222,128,.15)':'var(--card2)',
      testFg: ((this.state.modelTest||{})[i]==='ok')?'#4ade80':'var(--tx)',
      test:()=>this.testModel(i) }));
    const apiUsage=this.lineArea([{data:[820,940,1100,980,1240,1180,1420,1310,1180,1480,1390,1620,1540,1710],color:'#f43f5e',fill:true,w:2.4,bgDot:'#16191c'}],{h:170,id:'sysapi',max:1900,
      labels:['','','','','','','','','','','','','',''] });
    const tokenUse=this.lineArea([{data:[3.2,4.1,3.8,5.2,4.9,6.1,5.8,7.2,6.9,8.1],color:C.ai,fill:true,w:2.4}],{h:150,id:'tok',max:9,labels:['','','','','','','','','','']});
    const revenue=this.lineArea([{data:[42,48,51,55,62,68,71,78,82,89,94,102],color:C.good,fill:true,w:2.4}],{h:150,id:'rev',max:120,labels:['','','','','','','','','','','','']});
    const sysEvents=[
      { a:fa?'آموزش مجدد مدل با موفقیت انجام شد':'Model retrained successfully', t:fa?'۱۲ دقیقه پیش':'12m ago', c:C.good, lv:'info' },
      { a:fa?'مصرف API به ۸۰٪ سقف ماهانه رسید':'API usage reached 80% of monthly cap', t:fa?'۱ ساعت پیش':'1h ago', c:C.warn, lv:'warn' },
      { a:fa?'باشگاه جدید ثبت شد: کاسپین رشت':'New club onboarded: Caspian Rasht', t:fa?'۳ ساعت پیش':'3h ago', c:C.ai, lv:'info' },
      { a:fa?'خطای موقت در صف پردازش (بازیابی شد)':'Transient processing queue error (recovered)', t:fa?'دیروز':'Yesterday', c:C.dng, lv:'error' },
    ];
    const smsLog=[
      { to:'۰۹۱۲۳۴۵۶۷۸۹', st:'delivered', t:'۱۴:۳۲', txt:fa?'کد ورود: ۸۴۳۱':'OTP: 8431' },
      { to:'۰۹۳۳۱۱۲۲۳۳۴', st:'delivered', t:'۱۴:۲۸', txt:fa?'کد ورود: ۲۲۹۰':'OTP: 2290' },
      { to:'۰۹۱۰۵۵۶۶۷۷۸', st:'failed', t:'۱۴:۱۵', txt:fa?'خوش‌آمدگویی':'Welcome' },
      { to:'۰۹۱۲۹۹۸۸۷۷۶', st:'delivered', t:'۱۳:۵۱', txt:fa?'کد ورود: ۷۱۰۴':'OTP: 7104' },
    ].map(s=>({ ...s, stLabel: s.st==='delivered'?(fa?'تحویل‌شده':'Delivered'):(fa?'ناموفق':'Failed'),
      sc: s.st==='delivered'?C.good:C.dng, sb: s.st==='delivered'?'rgba(74,222,128,.13)':'rgba(239,68,68,.13)' }));
    const userLog=[
      { u:'کاوه مرادی', en:'K. Moradi', a:fa?'ورود · ۱۲ صفحه · ۸ پرسش از دستیار':'Login · 12 pages · 8 AI queries', t:fa?'فعال اکنون':'Active now', on:1 },
      { u:'سارا عظیمی', en:'S. Azimi', a:fa?'۴ کلیپ ساخت · ۲ گزارش':'4 clips · 2 reports', t:fa?'۲۰ دقیقه پیش':'20m ago' },
      { u:'رضا فلاح', en:'R. Fallah', a:fa?'تگ‌گذاری ۹۴ دقیقه ویدیو':'Tagged 94min of video', t:fa?'۱ ساعت پیش':'1h ago' },
      { u:'بهرام نیک‌پور', en:'B. Nikpour', a:fa?'افزایش اعتبار · مشاهده صورت‌حساب':'Topped up credits · viewed billing', t:fa?'۳ ساعت پیش':'3h ago' },
    ].map(x=>({ ...x, name:fa?x.u:x.en, ini:(fa?x.u:x.en).slice(0,1) }));
    const subs=[
      { c:fa?'پارس تهران':'Pars Tehran', plan:fa?'سازمانی':'Enterprise', pc:'#f43f5e', credit:'۸٬۴۲۰', next:'۱۴۰۴/۱۰/۰۱', amt:'۴۸٬۰۰۰٬۰۰۰' },
      { c:fa?'زاگرس اصفهان':'Zagros', plan:fa?'حرفه‌ای':'Pro', pc:C.ai, credit:'۳٬۱۰۰', next:'۱۴۰۴/۰۹/۲۵', amt:'۲۴٬۰۰۰٬۰۰۰' },
      { c:fa?'البرز کرج':'Alborz', plan:fa?'حرفه‌ای':'Pro', pc:C.ai, credit:'۲٬۷۴۰', next:'۱۴۰۴/۰۹/۱۸', amt:'۲۴٬۰۰۰٬۰۰۰' },
      { c:fa?'کاسپین رشت':'Caspian', plan:fa?'پایه':'Basic', pc:C.sub, credit:'۹۲۰', next:'۱۴۰۴/۱۰/۰۵', amt:'۱۲٬۰۰۰٬۰۰۰' },
    ];
    return { tabs, ...flags, aiModels, apiUsage, tokenUse, revenue, sysEvents, smsLog, userLog, subs,
      addAiModel:this.addAiModel };
  }

  setPersona = (k,v)=> this.setState({ persona:{ ...this.state.persona, [k]:v } });

  vm_gamecloud(){
    const fa=this.state.lang==='fa';
    const usage=this.lineArea([{data:[120,180,150,240,200,310,280,260],color:this.C.ai,fill:true,w:2.6}],{h:160,id:'gc',max:360,
      labels:['د۱','د۲','د۳','د۴','د۵','د۶','د۷','د۸'].map(x=>this.faN(x))});
    const breakdown=[
      { k:fa?'ویدیوهای بازی':'Match videos', v:'۱٫۱ TB', pct:'62%', c:this.C.ac },
      { k:fa?'تمرین‌ها':'Training', v:'۴۸۰ GB', pct:'26%', c:this.C.ai },
      { k:fa?'کلیپ و خروجی':'Clips & exports', v:'۲۲۰ GB', pct:'12%', c:this.C.warn },
    ];
    const activity=[
      { a:fa?'پردازش بازی زاگرس کامل شد':'Zagros match processed', t:fa?'۲ ساعت پیش':'2h ago', c:this.C.good, m:'−۹۴ '+(fa?'دقیقه':'min') },
      { a:fa?'خروجی مختصات x/y گرفته شد':'x/y coordinates exported', t:fa?'۵ ساعت پیش':'5h ago', c:this.C.ai, m:'XML' },
      { a:fa?'آپلود تمرین دفاعی':'Defensive training uploaded', t:fa?'دیروز':'Yesterday', c:this.C.ac, m:'۴۷ '+(fa?'دقیقه':'min') },
      { a:fa?'اعتبار پردازش افزایش یافت':'Credits topped up', t:fa?'۲ روز پیش':'2d ago', c:this.C.good, m:'+۵٬۰۰۰' },
    ];
    return { usage, breakdown, activity };
  }

  vm_coding(){
    const fa=this.state.lang==='fa';
    const codes=[
      { l:fa?'پاس':'Pass', c:this.C.ac, sc:'P', n:482 },{ l:fa?'شوت':'Shot', c:this.C.warn, sc:'S', n:14 },
      { l:fa?'تکل':'Tackle', c:this.C.dng, sc:'T', n:23 },{ l:fa?'پرس':'Press', c:this.C.ai, sc:'R', n:67 },
      { l:fa?'دریبل':'Dribble', c:this.C.good, sc:'D', n:31 },{ l:fa?'سانتر':'Cross', c:'#c084fc', sc:'C', n:19 },
      { l:fa?'گل':'Goal', c:this.C.ac, sc:'G', n:2 },{ l:fa?'کرنر':'Corner', c:'#60a5fa', sc:'K', n:7 },
      { l:fa?'خطا':'Foul', c:this.C.sub, sc:'F', n:12 },{ l:fa?'آفساید':'Offside', c:this.C.warn, sc:'O', n:3 },
    ].map(x=>({ ...x, n:this.faN(x.n) }));
    const gen=[
      { ty:fa?'پاس کلیدی':'Key pass', t:'۱۲:۰۴', conf:94 },{ ty:fa?'پرس موفق':'Press won', t:'۱۹:۳۱', conf:88 },
      { ty:fa?'شوت':'Shot', t:'۲۶:۱۲', conf:91 },{ ty:fa?'گل':'Goal', t:'۳۸:۴۵', conf:99 },
      { ty:fa?'تکل':'Tackle', t:'۵۱:۰۸', conf:79 },{ ty:fa?'سانتر':'Cross', t:'۶۱:۲۲', conf:86 },
    ].map(e=>({ ...e, conf:this.faN(e.conf), confC:e.conf>=90?this.C.good:e.conf>=80?this.C.warn:this.C.dng }));
    return { codes, gen };
  }

  vm_matrix(){
    const fa=this.state.lang==='fa';
    const labels=['عاب','کری','شری','نوی','رضا','کاظ','حسی','احم'];
    const M=[
      [0,8,6,2,5,3,4,1],[7,0,9,1,6,4,8,2],[5,8,0,7,9,3,2,1],[2,1,6,0,8,5,1,0],
      [4,5,9,7,0,9,6,3],[3,4,2,5,8,0,7,9],[5,9,1,1,5,8,0,9],[1,2,0,0,2,9,8,0],
    ];
    const max=9;
    const rows=M.map((row,i)=>({ label:labels[i], cells:row.map((v,j)=>{ const t=v/max;
      const bg= i===j?'#0e1116' : v===0?'rgba(255,255,255,.02)' : `rgba(163,230,53,${0.08+t*0.5})`;
      return { v:this.faN(v), bg, fg: t>0.55?'#0d0f12':(v===0?'#3a414d':'#cdd2d8'), self:i===j }; }) }));
    const eventBars=[
      { k:fa?'پاس':'Pass', v:482, c:this.C.ac },{ k:fa?'پرس':'Press', v:67, c:this.C.ai },
      { k:fa?'دریبل':'Dribble', v:31, c:this.C.good },{ k:fa?'تکل':'Tackle', v:23, c:this.C.dng },
      { k:fa?'سانتر':'Cross', v:19, c:'#c084fc' },{ k:fa?'شوت':'Shot', v:14, c:this.C.warn },
    ];
    const emax=482;
    const ch=[ this.h('div',{key:'c'}) ];
    labels.forEach((lb,i)=> ch.push(this.h('div',{key:'h'+i,style:{fontSize:10,color:this.C.mut,textAlign:'center',paddingBottom:4,fontWeight:700}},lb)));
    rows.forEach((row,i)=>{ ch.push(this.h('div',{key:'rl'+i,style:{fontSize:10,color:this.C.mut,display:'flex',alignItems:'center',justifyContent:'flex-end',paddingInlineEnd:5,fontWeight:700}},row.label));
      row.cells.forEach((c,j)=> ch.push(this.h('div',{key:i+'_'+j,title:row.label+'→'+labels[j],style:{aspectRatio:'1',background:c.bg,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10.5,color:c.fg,fontWeight:600,cursor:c.self?'default':'pointer'}},c.self?'':c.v))); });
    const matrixEl=this.h('div',{style:{display:'grid',gridTemplateColumns:'34px repeat(8,1fr)',gap:3}},...ch);
    return { labels, rows, eventBars: eventBars.map(b=>({ ...b, pct:Math.max(6,b.v/emax*100)+'%', vF:this.faN(b.v) })), matrixEl };
  }

  vm_dataint(){
    const fa=this.state.lang==='fa';
    const conns=[
      { n:'Opta', d:fa?'داده‌ی رویداد زنده‌ی روز بازی':'Live match-day event data', st:'on', ic:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 7v10M7 12h10' },
      { n:'StatsBomb', d:fa?'داده‌ی رویداد و فریزفریم':'Event & freeze-frame data', st:'on', ic:'M3 12h4l3 8 4-16 3 8h4' },
      { n:'XML / SportsCode', d:fa?'ورود و خروج تگ‌ها':'Import/export tags', st:'on', ic:'M8 6l-5 6 5 6M16 6l5 6-5 6' },
      { n:'GPS / Catapult', d:fa?'داده‌ی فیزیکی بازیکن':'Player physical data', st:'on', ic:'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zM12 9h.01' },
      { n:'REST API', d:fa?'دسترسی برنامه‌نویسی به داده':'Programmatic data access', st:'avail', ic:'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1' },
      { n:'Python / R', d:fa?'کتابخانه‌ی کد تحلیل سفارشی':'Custom analysis code library', st:'avail', ic:'M16 18l6-6-6-6M8 6l-6 6 6 6' },
    ].map(c=>({ ...c, label: c.st==='on'?(fa?'متصل':'Connected'):(fa?'در دسترس':'Available'),
      sc: c.st==='on'?this.C.good:this.C.sub, sb: c.st==='on'?'rgba(74,222,128,.13)':'rgba(255,255,255,.05)',
      btn: c.st==='on'?(fa?'پیکربندی':'Configure'):(fa?'اتصال':'Connect') }));
    const snippet = `import nexa\nmatch = nexa.load("pars_vs_zagros")\nxt = match.xthreat(team="home")\nprint(xt.by_zone())  # → 0.92 right flank`;
    return { conns, snippet };
  }

  vm_sharing(){
    const fa=this.state.lang==='fa';
    const clips=[
      { t:fa?'گل امیر حسینی — دقیقه ۳۸':'Hosseini goal — 38\'', by:'کاوه مرادی', tg:fa?'امیر حسینی':'A. Hosseini', cm:4, t2:fa?'۲ ساعت پیش':'2h ago' },
      { t:fa?'فاز پرس نیمه دوم':'H2 press phase', by:'سارا عظیمی', tg:fa?'کادر دفاعی':'Defense unit', cm:7, t2:fa?'۵ ساعت پیش':'5h ago' },
      { t:fa?'اشتباه پوزیشن‌گیری — دقیقه ۵۱':'Positioning error — 51\'', by:'رضا فلاح', tg:fa?'مهدی شریفی':'M. Sharifi', cm:2, t2:fa?'دیروز':'Yesterday' },
    ].map(c=>({ ...c, cm:this.faN(c.cm) }));
    const online=[
      { ini:'ک', c:this.C.ac },{ ini:'س', c:this.C.ai },{ ini:'ر', c:this.C.good },
    ];
    const msgs=[
      { who:'سارا عظیمی', whoEn:'S. Azimi', text:fa?'کلیپ پرس رو دیدی؟ فکر کنم باید زودتر فشار بیاریم':'Did you see the press clip? I think we should press earlier', mine:false },
      { who:'کاوه مرادی', whoEn:'You', text:fa?'آره، دستیار هم همین رو پیشنهاد داد. برات یه پلی‌لیست می‌سازم':'Yes, the assistant suggested the same. I\'ll build you a playlist', mine:true },
    ].map(m=>({ ...m, name: fa?m.who:m.whoEn, bg:m.mine?'var(--acd)':'var(--card)', bd:m.mine?'rgba(163,230,53,.3)':'var(--bd)', align:m.mine?'flex-end':'flex-start' }));
    return { clips, online: online.map(o=>({...o})), msgs };
  }

  renderVals(){
    const lang=this.state.lang, t=this.STR[lang], dir=lang==='fa'?'rtl':'ltr', page=this.state.page;
    const titles={ dashboard:[t.brand+' — '+(lang==='fa'?'داشبورد':'Dashboard'), lang==='fa'?'نمای کلی عملکرد تیم':'Team performance overview'] };
    const role=this.ROLES[this.state.role], allowed=role.pages;
    const navGroups=this.NAV.map((g,gi)=>{ const items=g.items.filter(it=>allowed.includes(it.id)).map(it=>{ const active=it.id===page;
      const kids=(it.children||[]).map(ch=>{ const ca=page==='leaguedb' && this.state.ldbView===ch.view;
        return { label:lang==='fa'?ch.fa:ch.en, fg: ca?this.C.ac:this.C.mut, bg: ca?'var(--bg2)':'transparent', w: ca?'700':'500', go:()=>this.goLdb(ch.view) }; });
      return { ...it, label: lang==='fa'?it.fa:it.en, fg: active?this.C.ac:this.C.sub, bg: active?'rgba(163,230,53,.12)':'transparent', w: active?'700':'500',
        go: it.id==='leaguedb'? (()=>this.goLdb('manage')) : (()=>this.go(it.id)), badge: it.badge, kids: kids.length?kids:null }; });
      const hasActive=items.some(it=>it.id===page); const collapsed=!!this.state.navCollapsed[gi] && !hasActive;
      return { label: lang==='fa'?g.fa:g.en, items, collapsed, shown: collapsed?[]:items,
        chevron: collapsed?'rotate(-90deg)':'rotate(0deg)', toggle:()=>this.toggleNavGroup(gi) }; })
      .filter(g=>g.items.length>0);
    const roleList=Object.keys(this.ROLES).map(k=>{ const r=this.ROLES[k], on=k===this.state.role;
      return { key:k, label: lang==='fa'?r.fa:r.en, ini:r.ini, color:r.color, on,
        bg: on?'var(--card2)':'transparent', dot:on?r.color:'transparent', set:()=>this.setRole(k) }; });
    const pages=['dashboard','library','gamecloud','player','coding','matrix','dataint','telestration','tactical','physical','profile','scouting','leaguedb','transfer','schedule','training','nutrition','reports','clips','sharing','assistant','model','settings','sysadmin'];
    const flags={}; pages.forEach(p=>flags['is_'+p]= page===p);
    const meta=this.pageMeta(lang,page);
    const vm=(this['vm_'+page]||(()=>({}))).call(this);
    const ai=this.state.ai;
    const thread=this.state.thread.map(m=> m.role==='user'
      ? { text:m.text, dir:'row', align:'flex-end', bg:'var(--acd)', bd:'rgba(163,230,53,.3)', color:'#e7e9ec' }
      : { text:m.text, dir:'row', align:'flex-start', bg:'var(--card)', bd:'var(--bd)', color:'#cdd2d8' });
    const quick=(lang==='fa'
      ? ['پرس ما در نیمه دوم چطور بود؟','بهترین بازیکن بازی کی بود؟','خلاصه تاکتیکی بازی را بده']
      : ['How was our press in H2?','Who was the best player?','Give me a tactical summary'])
      .map(q=>({ text:q, go:()=>this.askAi(q) }));
    const md=this.state.modal;
    const mv=this.state.modalVals||{};
    const modal = md ? {
      open:true, title:md.title, icon:md.icon, submitLabel:md.submitLabel||t.save,
      cancelLabel: lang==='fa'?'انصراف':'Cancel',
      stop:(e)=>e.stopPropagation(), close:this.closeModal, submit:this.submitModal,
      fields:(md.fields||[]).map(f=>({
        key:f.key, label:f.label, placeholder:f.placeholder||'',
        value: mv[f.key]??'',
        isSelect: f.type==='select',
        isText: f.type!=='select',
        inputType: f.type==='number'?'number':'text',
        onInput:(e)=>this.setMField(f.key, e.target.value),
        options:(f.options||[]).map(o=>({ v:o.v, l:o.l, sel:String(mv[f.key])===String(o.v) }))
      }))
    } : { open:false, fields:[] };
    return { t, dir, lang, page, navGroups, vm, modal, ...flags,
      pageTitle:meta[0], pageSub:meta[1],
      go:this.go, toggleLang:this.toggleLang, toggleAI:this.toggleAI,
      goLibrary:()=>this.go('library'), goClips:()=>this.go('clips'),
      newChat:()=>this.setState({thread:[]}),
      showcase:this.state.showcase, toggleShowcase:this.toggleShowcase,
      setFa:()=>this.setState({lang:'fa'}), setEn:()=>this.setState({lang:'en'}),
      faBtnBg: lang==='fa'?'var(--ac)':'transparent', faBtnFg: lang==='fa'?'#0d0f12':'var(--sub)',
      enBtnBg: lang==='en'?'var(--ac)':'transparent', enBtnFg: lang==='en'?'#0d0f12':'var(--sub)',
      aiOverlayOpacity: ai?'1':'0', aiPointer: ai?'auto':'none', aiTransform: ai?'translateX(0)':(dir==='rtl'?'translateX(-105%)':'translateX(105%)'),
      aiThread:thread, vm_ai_quick:quick, aiInput:this.state.aiInput, onAiInput:this.onAiInput, sendAi:this.sendAi,
      persona:this.state.persona, setPersona:this.setPersona,
      roleName: lang==='fa'?role.name:role.nameEn, roleLabel: lang==='fa'?role.fa:role.en, roleIni:role.ini, roleColor:role.color,
      roleList, roleMenu:this.state.roleMenu, toggleRoleMenu:this.toggleRoleMenu,
      roleMenuOpacity:this.state.roleMenu?'1':'0', roleMenuPointer:this.state.roleMenu?'auto':'none', roleMenuTransform:this.state.roleMenu?'translateY(0)':'translateY(-8px)' };
  }

  approveNutrition = (i)=> this.setState(s=>{ const a={...s.nutritionAppr}; a[i]=true; return { nutritionAppr:a }; });

  schedDefaults(){
    return {
      comps:[
        { name:'لیگ برتر خلیج‌فارس', nameEn:'Persian Gulf League', c:this.C.ac },
        { name:'جام حذفی', nameEn:'Hazfi Cup', c:this.C.ai },
        { name:'دوستانه', nameEn:'Friendlies', c:this.C.sub },
      ],
      fix:[
        { d:'۱۴۰۴/۰۸/۰۲', wd:'جمعه', wdEn:'Fri', opp:'زاگرس اصفهان', oppEn:'Zagros', ha:'home', comp:0, st:'done', score:'۲–۱' },
        { d:'۱۴۰۴/۰۸/۰۹', wd:'جمعه', wdEn:'Fri', opp:'البرز کرج', oppEn:'Alborz', ha:'away', comp:0, st:'done', score:'۰–۰' },
        { d:'۱۴۰۴/۰۸/۱۳', wd:'سه‌شنبه', wdEn:'Tue', opp:'مس کرمان', oppEn:'Mes K.', ha:'home', comp:1, st:'next', score:'' },
        { d:'۱۴۰۴/۰۸/۱۶', wd:'جمعه', wdEn:'Fri', opp:'کاسپین رشت', oppEn:'Caspian', ha:'home', comp:0, st:'up', score:'' },
        { d:'۱۴۰۴/۰۸/۲۳', wd:'جمعه', wdEn:'Fri', opp:'خلیج‌فارس بندر', oppEn:'KhalijFars', ha:'away', comp:0, st:'up', score:'' },
        { d:'۱۴۰۴/۰۸/۳۰', wd:'جمعه', wdEn:'Fri', opp:'فجر شیراز', oppEn:'Fajr', ha:'home', comp:0, st:'up', score:'' },
      ]
    };
  }
  openModal = (cfg)=>{ const vals={}; (cfg.fields||[]).forEach(f=>{ vals[f.key]=(f.value!==undefined&&f.value!==null)?f.value:''; });
    this._mSubmit=cfg.onSubmit; this.setState({ modal:{ title:cfg.title, submitLabel:cfg.submitLabel, icon:cfg.icon||'M12 5v14M5 12h14', fields:cfg.fields }, modalVals:vals }); };
  closeModal = ()=>{ this._mSubmit=null; this.setState({ modal:null, modalVals:{} }); };
  setMField = (k,v)=> this.setState(s=>({ modalVals:{ ...(s.modalVals||{}), [k]:v } }));
  submitModal = ()=>{ const cb=this._mSubmit; const vals={ ...(this.state.modalVals||{}) }; this.closeModal(); if(cb) cb(vals); };
  addSchedLeague = ()=>{ const fa=this.state.lang==='fa';
    this.openModal({ title:fa?'افزودن لیگ / مسابقه':'Add competition', submitLabel:fa?'افزودن':'Add', icon:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
      fields:[{ key:'name', label:fa?'نام لیگ / مسابقه':'Competition name', type:'text', placeholder:fa?'مثلاً جام حذفی':'e.g. Hazfi Cup' }],
      onSubmit:(v)=>{ const name=(v.name||'').trim(); if(!name)return;
        const comps=[...(this.state.schedComps??this.schedDefaults().comps)];
        const pal=[this.C.ac,this.C.ai,this.C.warn,this.C.good,this.C.dng];
        comps.push({ name, nameEn:name, c:pal[comps.length%pal.length] });
        this.setState({ schedComps:comps }); } }); };
  addMatch = ()=>{ const fa=this.state.lang==='fa';
    const comps=(this.state.schedComps??this.schedDefaults().comps);
    this.openModal({ title:fa?'افزودن بازی':'Add match', submitLabel:fa?'افزودن بازی':'Add match', icon:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      fields:[
        { key:'opp', label:fa?'حریف':'Opponent', type:'text', placeholder:fa?'نام تیم حریف':'Opponent team' },
        { key:'date', label:fa?'تاریخ بازی':'Match date', type:'text', value:fa?'۱۴۰۴/۰۹/۰۷':'2025/11/28', placeholder:'۱۴۰۴/۰۹/۰۷' },
        { key:'ha', label:fa?'میزبانی':'Venue', type:'select', value:'home', options:[{v:'home',l:fa?'خانه':'Home'},{v:'away',l:fa?'خارج از خانه':'Away'}] },
        { key:'comp', label:fa?'مسابقه':'Competition', type:'select', value:'0', options:comps.map((c,i)=>({ v:String(i), l:fa?c.name:c.nameEn })) },
      ],
      onSubmit:(v)=>{ const opp=(v.opp||'').trim(); if(!opp)return;
        const fix=[...(this.state.schedFix??this.schedDefaults().fix)];
        fix.push({ d:v.date||'', wd:'', wdEn:'', opp, oppEn:opp, ha:v.ha==='away'?'away':'home', comp:parseInt(v.comp,10)||0, st:'up', score:'' });
        this.setState({ schedFix:fix }); } }); };
  editMatch = (i)=>{ const fa=this.state.lang==='fa';
    const fix=(this.state.schedFix??this.schedDefaults().fix); const f=fix[i]; if(!f)return;
    const comps=(this.state.schedComps??this.schedDefaults().comps);
    this.openModal({ title:fa?'ویرایش بازی':'Edit match', submitLabel:fa?'ذخیره':'Save', icon:'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
      fields:[
        { key:'opp', label:fa?'حریف':'Opponent', type:'text', value:fa?f.opp:f.oppEn },
        { key:'date', label:fa?'تاریخ بازی':'Date', type:'text', value:f.d },
        { key:'ha', label:fa?'میزبانی':'Venue', type:'select', value:f.ha, options:[{v:'home',l:fa?'خانه':'Home'},{v:'away',l:fa?'خارج از خانه':'Away'}] },
        { key:'comp', label:fa?'مسابقه':'Competition', type:'select', value:String(f.comp), options:comps.map((c,j)=>({ v:String(j), l:fa?c.name:c.nameEn })) },
        { key:'score', label:fa?'نتیجه (خالی = بازی‌نشده)':'Score (blank = unplayed)', type:'text', value:f.score },
      ],
      onSubmit:(v)=>{ const fx=[...(this.state.schedFix??this.schedDefaults().fix)]; const ff=fx[i]; if(!ff)return;
        const sc=(v.score||'').trim();
        fx[i]={ ...ff, opp:(v.opp||'').trim()||ff.opp, oppEn:(v.opp||'').trim()||ff.oppEn, d:v.date||ff.d, ha:v.ha||ff.ha, comp:parseInt(v.comp,10)||0, score:sc,
          st: sc?'done':(ff.st==='done'?'up':ff.st) };
        this.setState({ schedFix:fx }); } }); };
  removeMatch = (i)=>{ const fix=[...(this.state.schedFix??this.schedDefaults().fix)]; fix.splice(i,1); this.setState({ schedFix:fix }); };

  trainDefaults(){
    return [
      { name:'تمرین تاکتیکی — پرس بالا', nameEn:'Tactical — High Press', intensity:90, focus:'پرسینگ هماهنگ در زمین حریف', focusEn:'Coordinated pressing in opp half', dur:75,
        stations:[ {x:50,y:14,l:'۱',t:'drill',d:'دروازه‌بان — شروع ساخت بازی',dEn:'GK — build-up start'},
          {x:26,y:34,l:'۲',t:'press',d:'مدافعان — خط پرس اول',dEn:'Defenders — first press line'},
          {x:74,y:34,l:'۳',t:'press',d:'وینگرها — بستن مسیر پاس',dEn:'Wingers — cut passing lane'},
          {x:50,y:54,l:'۴',t:'tac',d:'هافبک‌ها — پوشش فضای میانی',dEn:'Mids — cover central space'},
          {x:38,y:78,l:'۵',t:'fin',d:'مهاجم — پرس روی مدافع آخر',dEn:'ST — press last defender'},
          {x:64,y:80,l:'۶',t:'fin',d:'گذار سریع به حمله',dEn:'Quick transition to attack'} ] },
      { name:'تمرین حفظ مالکیت — رondo', nameEn:'Possession — Rondo', intensity:65, focus:'گردش توپ و الگوی پاس سوم‌نفر', focusEn:'Ball circulation & third-man runs', dur:60,
        stations:[ {x:30,y:28,l:'۱',t:'drill',d:'مربع پاس ۴v۲',dEn:'4v2 passing square'},
          {x:70,y:30,l:'۲',t:'drill',d:'مربع پاس ۴v۲',dEn:'4v2 passing square'},
          {x:50,y:52,l:'۳',t:'tac',d:'بازیکن آزاد میانی',dEn:'Free central player'},
          {x:36,y:74,l:'۴',t:'fin',d:'انتقال به فاز فینیشینگ',dEn:'Move to finishing phase'},
          {x:66,y:74,l:'۵',t:'fin',d:'ضربه نهایی هدفمند',dEn:'Targeted final shot'} ] },
    ];
  }
  selectTeamSession = (i)=> this.setState({ teamSessionSel:i });
  testModel = (i)=>{ const mt={...(this.state.modelTest||{})}; mt[i]='testing'; this.setState({modelTest:mt});
    setTimeout(()=>{ const m2={...(this.state.modelTest||{})}; m2[i]='ok'; this.setState({modelTest:m2}); }, 1100); };
  addAiModel = ()=>{ const fa=this.state.lang==='fa';
    this.openModal({ title:fa?'افزودن مدل هوش مصنوعی':'Add AI model', submitLabel:fa?'افزودن مدل':'Add model', icon:'M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z',
      fields:[
        { key:'tag', label:fa?'نام / نوع مدل':'Model name / type', type:'text', placeholder:fa?'مثلاً مدل ترجمه':'e.g. Translation model' },
        { key:'prov', label:fa?'ارائه‌دهنده':'Provider', type:'text', value:'OpenAI' },
        { key:'model', label:fa?'شناسه‌ی مدل':'Model id', type:'text', value:'gpt-4o' },
      ],
      onSubmit:(v)=>{ const tag=(v.tag||'').trim(); if(!tag)return;
        const nm={ tag, use:fa?'مدل افزوده‌شده توسط ادمین':'Admin-added model', prov:(v.prov||'—').trim()||'—', model:(v.model||'—').trim()||'—', ep:'api.custom/v1', on:true, c:'#38bdf8', bg:'rgba(56,189,248,.13)', icon:'M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z' };
        this.setState({ aiExtra:[...(this.state.aiExtra||[]), nm] }); } }); };
  addTeamSession = ()=>{ const fa=this.state.lang==='fa';
    this.openModal({ title:fa?'افزودن جلسه‌ی تمرین تیمی':'Add team session', submitLabel:fa?'افزودن جلسه':'Add session', icon:'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
      fields:[
        { key:'name', label:fa?'نام جلسه':'Session name', type:'text', placeholder:fa?'مثلاً تمرین گذار':'e.g. Transition drill' },
        { key:'focus', label:fa?'تمرکز جلسه':'Session focus', type:'text', value:fa?'گذار حمله به دفاع':'Attack-to-defense transition' },
        { key:'inten', label:fa?'شدت (۰ تا ۱۰۰)':'Intensity (0-100)', type:'number', value:'70' },
      ],
      onSubmit:(v)=>{ const name=(v.name||'').trim(); if(!name)return;
        const focus=(v.focus||'').trim(); const inten=parseInt(v.inten,10);
        const sessions=[...(this.state.teamSessions??this.trainDefaults())];
        sessions.push({ name, nameEn:name, focus, focusEn:focus,
          intensity:isNaN(inten)?70:Math.max(0,Math.min(100,inten)), dur:60,
          stations:[ {x:50,y:20,l:'۱',t:'drill',d:focus||'ایستگاه ۱',dEn:focus||'Station 1'},
            {x:32,y:50,l:'۲',t:'tac',d:'ایستگاه ۲',dEn:'Station 2'},
            {x:68,y:50,l:'۳',t:'press',d:'ایستگاه ۳',dEn:'Station 3'},
            {x:50,y:78,l:'۴',t:'fin',d:'ایستگاه ۴',dEn:'Station 4'} ] });
        this.setState({ teamSessions:sessions, teamSessionSel:sessions.length-1 }); } }); };
  editTeamSession = ()=>{ const fa=this.state.lang==='fa';
    const sessions=(this.state.teamSessions??this.trainDefaults()); const i=this.state.teamSessionSel; const s=sessions[i]; if(!s)return;
    this.openModal({ title:fa?'ویرایش جلسه':'Edit session', submitLabel:fa?'ذخیره':'Save', icon:'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
      fields:[
        { key:'name', label:fa?'نام جلسه':'Session name', type:'text', value:fa?s.name:s.nameEn },
        { key:'focus', label:fa?'تمرکز جلسه':'Focus', type:'text', value:fa?s.focus:s.focusEn },
        { key:'inten', label:fa?'شدت (۰ تا ۱۰۰)':'Intensity (0-100)', type:'number', value:String(s.intensity) },
      ],
      onSubmit:(v)=>{ const ss=[...(this.state.teamSessions??this.trainDefaults())]; const sv=ss[i]; if(!sv)return;
        const inten=parseInt(v.inten,10);
        ss[i]={ ...sv, name:(v.name||'').trim()||sv.name, nameEn:(v.name||'').trim()||sv.nameEn, focus:(v.focus||'').trim()||sv.focus, focusEn:(v.focus||'').trim()||sv.focusEn,
          intensity:isNaN(inten)?sv.intensity:Math.max(0,Math.min(100,inten)) };
        this.setState({ teamSessions:ss }); } }); };
  removeTeamSession = ()=>{ const sessions=[...(this.state.teamSessions??this.trainDefaults())]; if(sessions.length<=1)return;
    sessions.splice(this.state.teamSessionSel,1); this.setState({ teamSessions:sessions, teamSessionSel:0 }); };
  startStationDrag = (i,e)=>{
    if(!['senior','analyst','coach'].includes(this.state.role)) return;
    e.preventDefault(); e.stopPropagation();
    const pitch=e.currentTarget.offsetParent||e.currentTarget.parentElement;
    const rect=pitch.getBoundingClientRect();
    const move=(ev)=>{
      const cx=ev.touches?ev.touches[0].clientX:ev.clientX, cy=ev.touches?ev.touches[0].clientY:ev.clientY;
      let px=Math.max(4,Math.min(96,((cx-rect.left)/rect.width)*100));
      let py=Math.max(7,Math.min(93,((cy-rect.top)/rect.height)*100));
      const sessions=[...(this.state.teamSessions??this.trainDefaults())];
      const sel=Math.min(this.state.teamSessionSel,sessions.length-1);
      const sts=sessions[sel].stations.map((s,j)=> j===i?{...s,x:Math.round(px),y:Math.round(py)}:s);
      sessions[sel]={...sessions[sel],stations:sts};
      this.setState({ teamSessions:sessions, draggingStation:i });
    };
    const up=()=>{ window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); this.setState({ draggingStation:null }); };
    window.addEventListener('pointermove',move); window.addEventListener('pointerup',up); };

  vm_schedule(){
    const fa=this.state.lang==='fa';
    const D=this.schedDefaults();
    const compsRaw=this.state.schedComps??D.comps;
    const raw=this.state.schedFix??D.fix;
    const comps=compsRaw.map((c,i)=>({ name:fa?c.name:c.nameEn, c:c.c,
      n:this.faN(raw.filter(f=>f.comp===i).length) }));
    const stMap={ done:{l:fa?'انجام‌شده':'Played', c:this.C.sub}, next:{l:fa?'بازی بعدی':'Next', c:this.C.ac}, up:{l:fa?'پیش‌رو':'Upcoming', c:this.C.ai} };
    const cc=(i)=> compsRaw[i]?compsRaw[i].c:this.C.sub;
    const cn=(i)=> compsRaw[i]?(fa?compsRaw[i].name:compsRaw[i].nameEn):'';
    const fixtures=raw.map((f,idx)=>({ d:f.d, wd:fa?f.wd:(f.wdEn||f.wd), ha:f.ha, opp:fa?f.opp:(f.oppEn||f.opp),
      haL: f.ha==='home'?(fa?'خانه':'H'):(fa?'خارج':'A'), haC: f.ha==='home'?this.C.ac:this.C.warn,
      compName:cn(f.comp), compC:cc(f.comp), stL:stMap[f.st]?stMap[f.st].l:'', stC:stMap[f.st]?stMap[f.st].c:this.C.sub,
      score:f.score, isNext:f.st==='next'?'rgba(163,230,53,.4)':'var(--bd)', edit:()=>this.editMatch(idx) }));
    // calendar — آبان ۱۴۰۴, 30 days, day1 weekday offset
    const wdHead=fa?['ش','ی','د','س','چ','پ','ج']:['Sa','Su','Mo','Tu','We','Th','Fr'];
    const matchDays={2:0,9:0,13:1,16:0,23:0,30:0}; const trainDays=[1,4,5,7,8,11,12,14,18,19,21,22,25,26,28,29];
    const offset=2; const cells=[];
    for(let i=0;i<offset;i++) cells.push({ blank:true });
    for(let day=1; day<=30; day++){ const m=matchDays[day], tr=trainDays.includes(day);
      cells.push({ blank:false, num:this.faN(day),
        type: m!=null?'match':(tr?'train':''),
        bg: m!=null?'var(--acd)':(tr?'rgba(56,189,248,.1)':'transparent'),
        dot: m!=null?cc(m):(tr?this.C.ai:'transparent'),
        bd: m!=null?'rgba(163,230,53,.4)':(tr?'rgba(56,189,248,.25)':'var(--bd)') }); }
    const monthName=fa?'آبان ۱۴۰۴':'Aban 1404';
    return { comps, fixtures, wdHead, cells, monthName,
      addMatch:this.addMatch, addLeague:this.addSchedLeague, prevMonth:()=>{}, nextMonth:()=>{} };
  }

  vm_training(){
    const fa=this.state.lang==='fa';
    const week=[
      { day:fa?'شنبه':'Sat', tag:'MD+1', type:fa?'ریکاوری':'Recovery', load:30, c:this.C.good },
      { day:fa?'یک‌شنبه':'Sun', tag:'MD-4', type:fa?'قدرت':'Strength', load:75, c:this.C.warn },
      { day:fa?'دوشنبه':'Mon', tag:'MD-3', type:fa?'تاکتیکی شدید':'Tactical hi', load:90, c:this.C.dng },
      { day:fa?'سه‌شنبه':'Tue', tag:'MD-2', type:fa?'سرعت':'Speed', load:65, c:this.C.ai },
      { day:fa?'چهارشنبه':'Wed', tag:'MD-1', type:fa?'فعال‌سازی':'Activation', load:40, c:this.C.good },
      { day:fa?'پنج‌شنبه':'Thu', tag:'MD', type:fa?'مسابقه':'Match', load:100, c:this.C.ac },
    ].map(d=>({ ...d, h:(20+d.load*0.8)+'%' }));
    const ax=fa?['پاس','شوت','دریبل','دفاع','سرعت','قدرت']:['Pass','Shot','Dribble','Defend','Pace','Power'];
    const drillMap=fa?{0:'رondo و الگوهای پاس',1:'فینیشینگ هدفمند',2:'یک‌به‌یک و دریبل در فضای تنگ',3:'پوزیشن دفاعی و رهگیری',4:'دوی تناوبی سرعتی (RSA)',5:'قدرت پایین‌تنه و core'}
      :{0:'Rondo & passing patterns',1:'Targeted finishing',2:'1v1 dribbling small space',3:'Defensive positioning',4:'Repeated sprint ability',5:'Lower-body & core strength'};
    const focus=this.roster.filter(p=>p.pe!=='GK').slice(0,6).map(p=>{ const r=this.genRadar(p.pe);
      const wi=[...r.keys()].sort((a,b)=>r[a]-r[b])[0]; const load=Math.min(95,Math.round(p.dist*7+ (p.sp||20)));
      const risk= load>92?{l:fa?'بار بالا':'High load',c:this.C.dng}: load>80?{l:fa?'متوسط':'Moderate',c:this.C.warn}:{l:fa?'ایمن':'Safe',c:this.C.good};
      return { n:fa?p.n:p.en, pos:fa?p.pos:p.pe, area:ax[wi], drill:drillMap[wi],
        load:this.faN(load), loadPct:load+'%', loadC: load>92?this.C.dng:load>80?this.C.warn:this.C.good,
        riskL:risk.l, riskC:risk.c }; });
    const why=this.mkAI('trainwhy', fa?'برنامه از ضعف‌ترین شاخص هر بازیکن در رادار مهارت، بار کاری GPS هفته‌ی اخیر و فاصله تا بازی بعدی (MD) ساخته می‌شود؛ شدت برای بازیکنان با ACWR بالا کاهش می‌یابد.'
      :'The plan is built from each player\'s weakest skill-radar metric, last week\'s GPS workload and days-to-match (MD); intensity is reduced for players with high ACWR.',
      fa?'منبع: رادار مهارت + GPS + تقویم بازی':'Source: skill radar + GPS + fixture calendar');
    return { week, focus, why, conf:this.faN(88), team:this.vmTeamSession(fa) };
  }

  vmTeamSession(fa){
    const sessions=this.state.teamSessions??this.trainDefaults();
    const sel=Math.min(this.state.teamSessionSel, sessions.length-1);
    const tc={ drill:this.C.ac, tac:this.C.ai, press:this.C.warn, fin:this.C.dng };
    const s=sessions[sel];
    const inC= s.intensity>85?this.C.dng: s.intensity>60?this.C.warn:this.C.good;
    const canEdit=['senior','analyst','coach'].includes(this.state.role);
    return {
      list: sessions.map((x,i)=>({ name:fa?x.name:x.nameEn, sel:i,
        bg: i===sel?'var(--acd)':'var(--bg2)', fg: i===sel?this.C.ac:'var(--sub)',
        bd: i===sel?this.C.ac:'var(--bd)', onSel:()=>this.selectTeamSession(i) })),
      name:fa?s.name:s.nameEn, focus:fa?s.focus:s.focusEn,
      intensity:this.faN(s.intensity)+'٪', intC:inC, intW:s.intensity+'%',
      dur:this.faN(s.dur)+(fa?' دقیقه':' min'),
      stations: s.stations.map((st,i)=>({ l:st.l, d:fa?st.d:st.dEn,
        left:st.x+'%', top:st.y+'%', c:tc[st.t]||this.C.ac,
        cursor: canEdit?'grab':'default', onDown: canEdit?(e=>this.startStationDrag(i,e)):null })),
      dragHint: canEdit?(fa?'برای جابه‌جایی، ایستگاه‌ها را روی زمین بکشید':'Drag stations on the pitch to reposition'):'',
      legend: [ {c:tc.drill,l:fa?'تمرین پایه':'Base drill'},{c:tc.tac,l:fa?'تاکتیکی':'Tactical'},
        {c:tc.press,l:fa?'پرس':'Press'},{c:tc.fin,l:fa?'فینیشینگ':'Finishing'} ],
      canEdit,
      addS:this.addTeamSession, editS:this.editTeamSession, removeS:this.removeTeamSession,
      addLabel:fa?'+ جلسه‌ی جدید':'+ New session', editLabel:fa?'ویرایش':'Edit', removeLabel:fa?'حذف':'Remove',
      boardTitle:fa?'برنامه تمرین تیمی روی زمین':'Team Session on Pitch',
      focusLabel:fa?'تمرکز':'Focus', intLabel:fa?'شدت':'Intensity', durLabel:fa?'مدت':'Duration',
      sessionsLabel:fa?'جلسه‌ها':'Sessions', stationsLabel:fa?'ایستگاه‌های تمرین':'Drill stations',
      lockNote: canEdit?'':(fa?'فقط آنالیزور/مربی می‌تواند ویرایش کند':'Only analyst/coach can edit') };
  }

  vm_nutrition(){
    const fa=this.state.lang==='fa';
    const ap=this.state.nutritionAppr;
    const base=[
      { i:0, n:fa?'امیر حسینی':'A. Hosseini', pos:fa?'وینگر راست':'RW', kcal:'۳٬۲۰۰', goal:fa?'حفظ وزن':'Maintain', p:30, cb:50, f:20, drill:fa?'پلایومتریک + شتاب':'Plyometrics + accel' },
      { i:1, n:fa?'مهدی شریفی':'M. Sharifi', pos:fa?'مدافع میانی':'CB', kcal:'۳٬۴۰۰', goal:fa?'افزایش توده':'Bulk', p:35, cb:45, f:20, drill:fa?'قدرت بالاتنه':'Upper-body strength' },
      { i:2, n:fa?'کاوه احمدی':'K. Ahmadi', pos:fa?'مهاجم':'ST', kcal:'۳٬۱۰۰', goal:fa?'کاهش چربی':'Cut fat', p:33, cb:47, f:20, drill:fa?'استقامت هوازی':'Aerobic endurance' },
      { i:3, n:fa?'سامان یوسفی':'S. Yousefi', pos:fa?'هافبک هجومی':'AM', kcal:'۳٬۰۰۰', goal:fa?'ریکاوری':'Recovery', p:30, cb:52, f:18, drill:fa?'تحرک و انعطاف':'Mobility & flexibility' },
    ];
    const rows=base.map(r=>{ const approved=!!ap[r.i];
      return { ...r, p:this.faN(r.p)+'٪', cb:this.faN(r.cb)+'٪', f:this.faN(r.f)+'٪',
        pPct:r.p+'%', cbPct:r.cb+'%', fPct:r.f+'%', approved, notApproved:!approved,
        stL: approved?(fa?'تأییدشده':'Approved'):(fa?'در انتظار تأیید':'Pending approval'),
        stC: approved?this.C.good:this.C.warn, stBg: approved?'rgba(74,222,128,.12)':'rgba(245,158,11,.12)',
        approver: approved?(fa?'کاوه مرادی (آنالیزور ارشد)':'K. Moradi (Senior)'):'',
        canApproveRow: (!approved) && ['senior','analyst','coach'].includes(this.state.role),
        approve:()=>this.approveNutrition(r.i) }; });
    const why=this.mkAI('nutwhy', fa?'برنامه‌ی غذایی و تمرین اختصاصی را مدل بر اساس پوزیشن، ترکیب بدنی، بار کاری و هدف فصلی هر بازیکن پیشنهاد می‌دهد؛ اجرای آن منوط به تأیید آنالیزور، آنالیزور ارشد یا مربی است.'
      :'The AI proposes meal & custom-drill plans from each player\'s position, body composition, workload and seasonal goal; execution requires sign-off from an analyst, senior analyst or coach.',
      fa?'منبع: پارامتر فیزیکی + GPS + هدف فصل':'Source: physical params + GPS + season goal');
    const canApprove = ['senior','analyst','coach'].includes(this.state.role);
    return { rows, why, conf:this.faN(90), canApprove };
  }

  pageMeta(lang,page){
    const M={
      dashboard:['داشبورد','نمای کلی عملکرد تیم','Dashboard','Team performance overview'],
      library:['کتابخانه ویدیو','آپلود از پخش، پهپاد، موبایل و فید زنده','Video Library','Upload from broadcast, drone, mobile & live feed'],
      gamecloud:['فضای ابری و اعتبار','ذخیره‌سازی، اعتبار پردازش و خروجی مختصات','GameCloud','Storage, processing credits & coordinate export'],
      coding:['کدگذاری','تگ‌گذاری هوشمند و پد کد سفارشی','Coding Pad','Smart tagging & custom code pad'],
      matrix:['تایم‌لاین و ماتریس','ماتریس پاس و نمودارهای متصل به ویدیو','Timeline & Matrix','Passing matrix & video-linked charts'],
      dataint:['ادغام داده','Opta، XML، API و کتابخانه Python/R','Data Integration','Opta, XML, API & Python/R'],
      sharing:['اشتراک و فیدبک','اشتراک کلیپ، کامنت و همکاری زنده','Sharing & Feedback','Share clips, comments & live collaboration'],
      player:['پخش و تگ‌گذاری','تایم‌لاین رویدادهای سینک‌شده','Player & Tagging','Synced event timeline'],
      telestration:['رسم روی ویدیو','ابزار تله‌استریشن تاکتیکی','Telestration','Tactical drawing tools'],
      tactical:['آنالیز تاکتیکی','هیت‌مپ، شبکه پاس و کنترل فضا','Tactical Analysis','Heatmap, passing & space'],
      physical:['آنالیز فیزیکی','بار کاری و ریسک مصدومیت','Physical Analysis','Workload & injury risk'],
      profile:['پروفایل بازیکن','عملکرد فنی و فیزیکی','Player Profile','Technical & physical profile'],
      scouting:['اسکاوتینگ','پایگاه داده و مقایسه بازیکنان','Scouting','Player database & comparison'],
      leaguedb:['بازیکنان و تیم‌های لیگ','پایگاه داده‌ی کامل با فیلتر و مرتب‌سازی','Players & League Teams','Full database with filter & sort'],
      transfer:['آنالیز خرید','ارزیابی هوش مصنوعی اهداف نقل‌وانتقالاتی','Transfer Analysis','AI evaluation of transfer targets'],
      schedule:['برنامه بازی‌ها','تقویم مسابقات به‌تفکیک لیگ و ثبت برنامه فصل','Match Schedule','Season fixtures by competition + calendar'],
      training:['برنامه تمرینی','برنامه تمرین تیمی و فردی مبتنی بر تحلیل AI','Training Plan','Team & per-player AI-driven training'],
      nutrition:['تغذیه و تمرین اختصاصی','برنامه غذایی و تمرین فردی مدل با تأیید کادر','Nutrition & Custom','AI meal & custom drills with staff approval'],
      clips:['کلیپ و پلی‌لیست','بریدن و اشتراک کلیپ','Clips & Playlists','Cut & share clips'],
      reports:['گزارش و مقایسه','خلاصه و مقایسه بازی‌ها','Reports','Match summary & comparison'],
      assistant:['دستیار هوشمند','گفتگو و شخصی‌سازی','AI Assistant','Chat & personalization'],
      model:['وضعیت مدل','یادگیری ماشین و دقت','Model Status','Machine learning & accuracy'],
      settings:['مدیریت و تنظیمات','تیم‌ها، کاربران و دسترسی','Settings','Teams, users & access'],
      sysadmin:['سوپر ادمین و سیستم','تنظیمات هسته، API، پیامک و صورت‌حساب','Super Admin','Core, API, SMS & billing settings'],
    };
    const m=M[page]||M.dashboard; return lang==='fa'?[m[0],m[1]]:[m[2],m[3]];
  }
}

export const eng = new Engine()
export default eng
