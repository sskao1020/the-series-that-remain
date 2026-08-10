"use client";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { useEffect, useMemo, useState } from "react";
import { shows, tiers, tonightFeelings, type Show } from "./data/shows";

type View = "探索" | "時間之選" | "為我推薦" | "我的片單" | "我們怎麼選";
type Profile = { tastes: string[]; feeling: string; name: string };

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
  const [posters,setPosters]=useState<Record<string,string>>({});
  const [toast,setToast]=useState("");

  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      try {
        setSaved(JSON.parse(localStorage.getItem("remain-v2-list")||"[]"));
        setNotes(JSON.parse(localStorage.getItem("remain-v2-notes")||"{}"));
        setProfile(JSON.parse(localStorage.getItem("remain-v2-profile")||"null"));
      } catch {
        localStorage.removeItem("remain-v2-list");
        localStorage.removeItem("remain-v2-notes");
        localStorage.removeItem("remain-v2-profile");
      }
    },0);
    return()=>window.clearTimeout(timer);
  },[]);

  useEffect(()=>{
    let alive=true;
    Promise.all(shows.map(async show=>{
      try { const r=await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(show.title)}`); const d=await r.json(); return [show.id,d.image?.original||d.image?.medium||""] as const; }
      catch { return [show.id,""] as const; }
    })).then(rows=>{if(alive)setPosters(Object.fromEntries(rows))});
    return()=>{alive=false};
  },[]);

  const save=(show:Show)=>{
    const next=saved.includes(show.id)?saved.filter(id=>id!==show.id):[...saved,show.id];
    setSaved(next); localStorage.setItem("remain-v2-list",JSON.stringify(next));
    setToast(next.includes(show.id)?"已留到你的片單":"已從片單移除"); setTimeout(()=>setToast(""),1800);
  };
  const updateNote=(id:string,value:string)=>{const next={...notes,[id]:value};setNotes(next);localStorage.setItem("remain-v2-notes",JSON.stringify(next))};
  const finishQuiz=(feeling:string)=>{const next={tastes:answers,feeling,name:profileName(answers)};setProfile(next);localStorage.setItem("remain-v2-profile",JSON.stringify(next));setQuizOpen(false);setStep(0);setAnswers([]);setView("為我推薦")};
  const answer=(value:string)=>{const next=[...answers,value];setAnswers(next);setStep(step+1)};
  const fit=(show:Show)=>!profile?0:show.taste.filter(x=>profile.tastes.includes(x)).length*2+show.feelings.filter(x=>x===profile.feeling).length*3;
  const personal=useMemo(()=>[...shows].sort((a,b)=>fit(b)-fit(a)),[profile]); // eslint-disable-line react-hooks/exhaustive-deps
  const genres=["全部",...new Set(shows.map(s=>s.genre.split("／")[0]))];
  const filtered=shows.filter(s=>(genre==="全部"||s.genre.startsWith(genre))&&(!query||`${s.title}${s.titleZh}${s.genre}`.toLowerCase().includes(query.toLowerCase())));

  const Card=({show,personalMode=false}:{show:Show;personalMode?:boolean})=>
<div className="show-card" role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setActive(show)}} onClick={()=>setActive(show)}>
    <div className="card-image" style={posters[show.id]?{backgroundImage:`linear-gradient(180deg,transparent 35%,rgba(14,25,22,.86)),url(${posters[show.id]})`}:{}}>
      <span>{show.tier}</span>
<small>{show.years}</small>
    </div>
    <div className="card-body">
<p className="eyebrow">{show.genre} · {show.network}</p>
<h3>{show.title}</h3>
<h4>{show.titleZh}</h4>
      {personalMode&&profile?<p className="match-line">適合你，因為你今晚想要「{profile.feeling}」，也偏愛{show.taste.filter(x=>profile.tastes.includes(x)).slice(0,2).join("與")||show.strengths[0]}的作品。</p>:<p className="reason-line">
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
<p>給已經對熱門排行榜疲乏的觀眾。我們從通過時間考驗的完結作品裡，保留觀點、門檻與真正值得投入的理由。</p>
<div className="hero-actions">
<button className="solid" onClick={()=>setQuizOpen(true)}>{profile?"重新認識我的品味":"開始認識我的品味"}</button>
<button onClick={()=>setView("時間之選")}>先看看時間之選</button>
</div>
</div>
        <aside>
<span>本次私人預覽</span>
<strong>22</strong>
<p>部作品完成首輪人工複核</p>
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
<p>「真正留下來的作品，往往不是毫無缺點；而是在多年之後，仍能讓人重新理解角色、時代，甚至自己。」</p>
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
<p>不把作品排成一條假裝客觀的直線。這裡只有三種留下方式：成為共同語言、改變一個領域，或保有無可取代的獨特。</p>
<div className="review-progress">
<span style={{width:"22%"}}/>
<b>首批 22 部已複核 · 完整選庫持續建立中</b>
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
<p>{tier==="經典核心"?"跨越類型與年代，仍構成我們談論影集時的共同語言。":tier==="重要作品"?"在特定類型、時代或創作面向，無法被忽略。":"未必面面俱到，卻有其他作品難以取代的觀看價值。"}</p>
</div>
<div className="card-grid">{items.map(s=>
<Card key={s.id} show={s}/>)}</div>
</section>:null})}
    </section>}

    {view==="為我推薦"&&<section className="personal-page">{!profile?<div className="empty-state">
<p className="eyebrow">FOR YOU</p>
<h1>先讓我們認識你的觀看方式。</h1>
<p>六個選擇認識長期品味，再告訴我們今晚想得到什麼。沒有權重，也不會把你關進一種人格。</p>
<button className="solid" onClick={()=>setQuizOpen(true)}>開始觀看問答</button>
</div>:<>
<div className="page-intro personal-intro">
<p className="eyebrow">FOR {profile.name.toUpperCase()}</p>
<h1>今晚想要「{profile.feeling}」</h1>
<p>我們先找長期品味與今晚感受的交集；沒有完美答案時，也不會捏造一個契合度百分比。</p>
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
<p>這份片單與你的話目前只保存在這台裝置。策展身分會改變，但你的觀看歷史不會因此消失。</p>
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
<p>本站作者決定收錄資格、策展層級、三項強項與最後文字；AI 協助整理 IMDb、Reddit、專業影評、官方獎項與主創資料。外部資料是佐證，不會偷偷變成分數。</p>
</div>
<div className="principles">
<article>
<b>01</b>
<h3>三年只是審查資格</h3>
<p>作品按完結年份滿三年後，才有資格被重新審視；時間經過本身不保證它會留下。</p>
</article>
<article>
<b>02</b>
<h3>缺點不會被平均掉</h3>
<p>每部作品都必須說明觀看門檻。幫你放棄一部不適合的作品，也是有效的推薦。</p>
</article>
<article>
<b>03</b>
<h3>資料與判斷分開</h3>
<p>年份、獎項與評論可以查核；作品是否仍重要則是編輯判斷，兩者不假裝成同一件事。</p>
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
<div className="detail-poster" style={posters[active.id]?{backgroundImage:`linear-gradient(0deg,rgba(13,25,21,.8),transparent 60%),url(${posters[active.id]})`}:{}}>
<span>{active.tier}</span>
</div>
<div className="detail-copy">
<p className="eyebrow">{active.genre} · {active.network} · {active.seasons}</p>
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
<h4>你可能會停下來的原因</h4>
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
</article>{active.awards.length>0&&<article>
<h4>重大獎項</h4>{active.awards.map(a=>
<p className="award" key={a.year+a.name}>
<time>{a.year}</time>
<b>{a.organization}</b>{a.name}</p>)}</article>}</section>
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
<h2>今晚，你想從一部影集裡得到什麼？</h2>
<p>只選此刻的感受；它不會改寫你的長期品味。</p>
<div className="feelings">{tonightFeelings.map(f=>
<button key={f} onClick={()=>finishQuiz(f)}>{f}</button>)}</div>
</>}</article>
</div>}
    {toast&&<div className="toast">{toast}</div>}
  </main>;
}
