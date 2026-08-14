"use client";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { useEffect, useMemo, useState } from "react";
import { categories, categoryOf, shows, tiers, type Show } from "./data/shows";
import { posterByShowId } from "./data/posters";

type View = "探索" | "時間之選" | "為我推薦" | "我的片單" | "我們怎麼選";
type Profile = { tastes: string[]; category: string; name: string };

const quiz = [
  { q:"一部作品最先抓住你的，通常是什麼？", a:[["一個人的內心與關係","人物親密感"],["一整個制度或世界如何運作","制度與世界"]] },
  { q:"你更願意相信哪一種敘事？", a:[["貼近生活、保留現實重量","寫實"],["用寓言或超現實照見現實","寓言／超現實"]] },
  { q:"你喜歡故事怎麼帶你進去？", a:[["讓我慢慢住進它的世界","緩慢沉浸"],["很快建立目標與張力","強情節推進"]] },
  { q:"看完之後，你更想帶走什麼？", a:[["一點安慰與陪伴","情緒安慰"],["一個讓我坐立難安的問題","挑戰與不安"]] },
  { q:"你偏好的結束方式？", a:[["完整承擔故事許下的承諾","封閉完整"],["留下足夠空間讓我繼續想","留白曖昧"]] },
  { q:"面對影集形式，你通常更靠近哪邊？", a:[["熟悉的類型，只要做到最好","熟悉類型"],["願意跟著作品冒險與實驗","形式實驗"]] },
];

const profileName = (answers:string[]) => {
  if (answers.includes("制度與世界") && answers.includes("挑戰與不安")) return "世界深潛者";
  if (answers.includes("人物親密感") && answers.includes("情緒安慰")) return "關係收藏家";
  if (answers.includes("形式實驗")) return "敘事探險者";
  if (answers.includes("強情節推進")) return "情節追光者";
  return "安靜觀察者";
};

export default function Home() {
  const [view,setView]=useState<View>("探索");
  const [active,setActive]=useState<Show|null>(null);
  const [saved,setSaved]=useState<string[]>([]);
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [profile,setProfile]=useState<Profile|null>(null);
  const [quizOpen,setQuizOpen]=useState(false);
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<string[]>([]);
  const [genre,setGenre]=useState("全部");
  const [query,setQuery]=useState("");
  const [toast,setToast]=useState("");

  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      try {
        setSaved(JSON.parse(localStorage.getItem("remain-v2-list")||"[]"));
        setNotes(JSON.parse(localStorage.getItem("remain-v2-notes")||"{}"));
        const storedProfile=JSON.parse(localStorage.getItem("remain-v2-profile")||"null");
        setProfile(storedProfile?.category?storedProfile:null);
      } catch {
        localStorage.removeItem("remain-v2-list");
        localStorage.removeItem("remain-v2-notes");
        localStorage.removeItem("remain-v2-profile");
      }
    },0);
    return()=>window.clearTimeout(timer);
  },[]);

  const save=(show:Show)=>{
    const next=saved.includes(show.id)?saved.filter(id=>id!==show.id):[...saved,show.id];
    setSaved(next); localStorage.setItem("remain-v2-list",JSON.stringify(next));
    setToast(next.includes(show.id)?"已留到你的片單":"已從片單移除"); setTimeout(()=>setToast(""),1800);
  };
  const updateNote=(id:string,value:string)=>{const next={...notes,[id]:value};setNotes(next);localStorage.setItem("remain-v2-notes",JSON.stringify(next))};
  const finishQuiz=(category:string)=>{const next={tastes:answers,category,name:profileName(answers)};setProfile(next);localStorage.setItem("remain-v2-profile",JSON.stringify(next));setQuizOpen(false);setStep(0);setAnswers([]);setView("為我推薦")};
  const answer=(value:string)=>{const next=[...answers,value];setAnswers(next);setStep(step+1)};
  const fit=(show:Show)=>!profile?0:show.taste.filter(x=>profile.tastes.includes(x)).length*2+(categoryOf(show)===profile.category?3:0);
  const personal=useMemo(()=>[...shows].sort((a,b)=>fit(b)-fit(a)),[profile]); // eslint-disable-line react-hooks/exhaustive-deps
  const genres=["全部",...categories];
  const filtered=shows.filter(s=>(genre==="全部"||categoryOf(s)===genre)&&(!query||`${s.title}${s.titleZh}${categoryOf(s)}`.toLowerCase().includes(query.toLowerCase())));

  const Card=({show,personalMode=false}:{show:Show;personalMode?:boolean})=>
<div className="show-card" role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setActive(show)}} onClick={()=>setActive(show)}>
    <div className="card-image" style={{backgroundImage:`linear-gradient(180deg,transparent 35%,rgba(14,25,22,.86)),url(${posterByShowId[show.id]})`}}>
      <span>{show.tier}</span>
<small>{show.years}</small>
    </div>
    <div className="card-body">
<p className="eyebrow">{categoryOf(show)} · {show.network}</p>
<h3>{show.title}</h3>
<h4>{show.titleZh}</h4>
      {personalMode&&profile?<p className="match-line">今晚想看{profile.category}，而你平常也在意{show.taste.filter(x=>profile.tastes.includes(x)).slice(0,2).join("、")||show.strengths[0]}。這部可以先看。</p>:<p className="reason-line">
<b>{show.strengths[0]}</b>{show.reason}</p>}
      <div className="card-actions">
<button onClick={e=>{e.stopPropagation();save(show)}}>{saved.includes(show.id)?"✓ 已收藏":"＋ 留到片單"}</button>
<span>閱讀作品觀點 →</span>
</div>
    </div>
  </div>;

  return <main>
    <header className="site-head">
<button className="brand" onClick={()=>setView("探索")}>
<strong>時間留下的影集</strong>
<span>THE SERIES THAT REMAIN</span>
<i>EDITORIAL BETA</i>
</button>
      <nav>{(["探索","時間之選","為我推薦","我的片單","我們怎麼選"] as View[]).map(v=>
<button key={v} className={view===v?"active":""} onClick={()=>setView(v)}>{v}{v==="我的片單"&&saved.length>0?<b>{saved.length}</b>:null}</button>)}</nav>
      <button className="profile-chip" onClick={()=>setQuizOpen(true)}>{profile?<>
<small>你的觀看方式</small>
<strong>{profile.name}</strong>
</>:<>認識我的品味 →</>}</button>
    </header>

    {view==="探索"&&<>
      <section className="hero">
<div>
<p className="eyebrow">百部規模的完結影集選庫</p>
<h1>不是下一部熱門，<br/>而是值得你留下時間的一部。</h1>
<p>給看膩熱門排行榜的人。我們只談已經完結、也經得起回頭看的作品，並說清楚它好在哪裡，又可能勸退誰。</p>
<div className="hero-actions">
<button className="solid" onClick={()=>setQuizOpen(true)}>{profile?"重新認識我的品味":"開始認識我的品味"}</button>
<button onClick={()=>setView("時間之選")}>先看看時間之選</button>
</div>
</div>
        <aside>
<span>目前收錄</span>
<strong>{shows.length}</strong>
<p>部作品完成編輯複核</p>
<dl>
<div>
<dt>沒有</dt>
<dd>分數與名次</dd>
</div>
<div>
<dt>保留</dt>
<dd>理由與觀看門檻</dd>
</div>
</dl>
</aside>
</section>
      <section className="manifesto">
<p>「多年後再看，仍能從人物、時代，也從自己身上讀出新的東西。這樣的影集，才留得下來。」</p>
</section>
      <section className="section">
<div className="section-head">
<div>
<p className="eyebrow">START HERE</p>
<h2>先從這六部開始</h2>
</div>
<button onClick={()=>setView("時間之選")}>查看全部時間之選 →</button>
</div>
<div className="card-grid">{shows.slice(0,6).map(s=>
<Card key={s.id} show={s}/>)}</div>
</section>
    </>}

    {view==="時間之選"&&<section className="catalog">
<div className="page-intro">
<p className="eyebrow">THE EDITORIAL SELECTION</p>
<h1>時間之選</h1>
<p>這裡不排第一名。作品依照影響與特色分成三層，讓你知道本站怎麼看它，也更容易找到想看的方向。</p>
<div className="review-progress">
<span style={{width:"100%"}}/>
<b>目前 {shows.length} 部已複核 · 選庫持續增加中</b>
</div>
</div>
      <div className="catalog-tools">
<input aria-label="搜尋作品" placeholder="搜尋英文片名、中文片名或類型" value={query} onChange={e=>setQuery(e.target.value)}/>
<div>{genres.map(g=>
<button className={genre===g?"active":""} key={g} onClick={()=>setGenre(g)}>{g}</button>)}</div>
</div>
      {tiers.map(tier=>{const items=filtered.filter(s=>s.tier===tier);return items.length?<section className="tier" key={tier}>
<div className="tier-title">
<p className="eyebrow">{tier==="經典核心"?"THE CORE":tier==="重要作品"?"ESSENTIAL WORKS":"SINGULAR VOICES"}</p>
<h2>{tier}</h2>
<p>{tier==="經典核心"?"多年後仍被反覆觀看，也改變了後來的影集。":tier==="重要作品"?"在自己的類型或年代裡，留下了清楚的位置。":"不求面面俱到，但有一項特色做得難以取代。"}</p>
</div>
<div className="card-grid">{items.map(s=>
<Card key={s.id} show={s}/>)}</div>
</section>:null})}
    </section>}

    {view==="為我推薦"&&<section className="personal-page">{!profile?<div className="empty-state">
<p className="eyebrow">FOR YOU</p>
<h1>先讓我們認識你的觀看方式。</h1>
<p>先用六題整理你平常在意的事，再選今晚想看的類型。結果只是這次找片的起點，不會替你貼標籤。</p>
<button className="solid" onClick={()=>setQuizOpen(true)}>開始觀看問答</button>
</div>:<>
<div className="page-intro personal-intro">
<p className="eyebrow">FOR {profile.name.toUpperCase()}</p>
<h1>今晚想看「{profile.category}」</h1>
<p>以下作品同時符合你平常在意的事和今晚選的類型。沒有百分比，只有可以核對的推薦理由。</p>
<button onClick={()=>setQuizOpen(true)}>重新探索</button>
</div>
      <section className="section flush">
<div className="section-head">
<div>
<p className="eyebrow">CLOSEST TONIGHT</p>
<h2>今晚，可以從這裡開始</h2>
</div>
</div>
<div className="card-grid">{personal.slice(0,6).map(s=>
<Card key={s.id} show={s} personalMode/>)}</div>
</section>
</>}</section>}

    {view==="我的片單"&&<section className="list-page">
<div className="page-intro">
<p className="eyebrow">MY LIST · LOCAL FIRST</p>
<h1>留給下一個晚上的故事</h1>
<p>片單和筆記目前只存在這台裝置，不會上傳。之後網站改版，你留下的內容也不會被拿去公開。</p>
</div>{saved.length?<div className="saved-list">{shows.filter(s=>saved.includes(s.id)).map(s=>
<div key={s.id}>
<Card show={s}/>
<textarea value={notes[s.id]||""} onChange={e=>updateNote(s.id,e.target.value)} placeholder="留一句話給自己：為什麼想看，或看完留下了什麼？" maxLength={300}/>
</div>)}</div>:<div className="empty-inline">
<h2>片單還是空的。</h2>
<p>從時間之選留下一部真正想看的作品。</p>
<button onClick={()=>setView("時間之選")}>前往時間之選 →</button>
</div>}</section>}

    {view==="我們怎麼選"&&<section className="method-page">
<div className="method-hero">
<p className="eyebrow">HOW WE READ</p>
<h1>我們不替作品製造一個<br/>看似客觀的答案。</h1>
<p>收不收、放在哪一層、哪三項最突出，最後都由本站判斷。AI 只協助整理 IMDb、Reddit、專業影評、官方獎項和主創資料。這些資料用來查證，不會換算成分數。</p>
</div>
<div className="principles">
<article>
<b>01</b>
<h3>三年只是審查資格</h3>
<p>作品完結滿三年，才會進入正式選庫。但年資只是門檻，不代表一定收錄。</p>
</article>
<article>
<b>02</b>
<h3>缺點不會被平均掉</h3>
<p>每部作品都要說清楚可能勸退你的地方。少浪費幾個晚上，也是一種推薦。</p>
</article>
<article>
<b>03</b>
<h3>資料與判斷分開</h3>
<p>年份、獎項和評論都有來源。作品是否重要，則是本站的看法。我們會把兩者分開寫清楚。</p>
</article>
</div>
<div className="review-check">
<div>
<p className="eyebrow">EDITORIAL REVIEW</p>
<h2>一部作品何時算複核完成？</h2>
</div>
<ul>{["收錄資格與完結方式","創作單位與策展身分","三項強項與留下理由","觀看門檻與無暴雷摘要","觀眾、影評與重大獎項","來源、年份與查核日期"].map(x=>
<li key={x}>✓ {x}</li>)}</ul>
</div>
</section>}

    {active&&<div className="modal" role="dialog" aria-modal="true" tabIndex={-1} onKeyDown={e=>{if(e.key==="Escape")setActive(null)}} onMouseDown={e=>{if(e.target===e.currentTarget)setActive(null)}}>
<article className="detail">
<button className="close" onClick={()=>setActive(null)} aria-label="關閉">×</button>
<div className="detail-poster" style={{backgroundImage:`linear-gradient(0deg,rgba(13,25,21,.8),transparent 60%),url(${posterByShowId[active.id]})`}}>
<span>{active.tier}</span>
</div>
<div className="detail-copy">
<p className="eyebrow">{categoryOf(active)} · {active.network} · {active.seasons}</p>
<h2>{active.title}</h2>
<h3>{active.titleZh} <small>{active.years}</small>
</h3>
<div className="strengths">{active.strengths.map(x=>
<span key={x}>{x}</span>)}</div>
<section>
<h4>它為什麼值得留下？</h4>
<p>{active.reason}</p>
</section>
<section className="barrier">
<h4>先知道這些，再決定要不要看</h4>
<p>{active.barrier}</p>
</section>
<section className="voices">
<article>
<h4>觀眾反應</h4>
<p>{active.audience}</p>
</article>
<article>
<h4>影評共識</h4>
<p>{active.critics}</p>
</article></section>
<details>
<summary>這些資料從哪裡來？</summary>
<div className="sources">{active.sources.map(group=>
<div key={group.label}>
<b>{group.label}</b>{group.sources.map(source=>
<a href={source.url} target="_blank" rel="noreferrer" key={source.name}>{source.name} ↗</a>)}</div>)}</div>
<small>最近複核：{active.reviewedAt}</small>
</details>
<button className="save-large" onClick={()=>save(active)}>{saved.includes(active.id)?"✓ 已留在我的片單":"＋ 留到我的片單"}</button>
</div>
</article>
</div>}

    {quizOpen&&<div className="quiz">
<article>
<button className="close" onClick={()=>{setQuizOpen(false);setStep(0);setAnswers([])}}>×</button>{step<quiz.length?<>
<p className="eyebrow">LONG-TERM TASTE · {step+1}/{quiz.length}</p>
<div className="progress">
<span style={{width:`${(step/quiz.length)*100}%`}}/>
</div>
<h2>{quiz[step].q}</h2>
<div className="quiz-answers">{quiz[step].a.map(([label,value])=>
<button key={value} onClick={()=>answer(value)}>
<span>{label}</span>→</button>)}</div>
</>:<>
<p className="eyebrow">TONIGHT</p>
<h2>今晚想看哪一類？</h2>
<p>只選一個類型。前面的回答仍會決定作品如何排序。</p>
<div className="feelings">{categories.map(category=>
<button key={category} onClick={()=>finishQuiz(category)}>{category}</button>)}</div>
</>}</article>
</div>}
    {toast&&<div className="toast">{toast}</div>}
  </main>;
}
