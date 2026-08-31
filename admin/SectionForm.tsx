import {useState} from "react";
import type {ContentDocument,Publication} from "../src/apps/cloud/api";
import {ReaderPreview} from "./ReaderPreview";
const tabs=["История","Решение","Упражнение","Изображения","Предпросмотр"] as const;
export function SectionForm({document:doc,publication,onChange}:{document:ContentDocument;publication:Publication|null;onChange:(document:ContentDocument)=>void}) {
  const [tab,setTab]=useState<(typeof tabs)[number]>("История");
  function updateExercise(index:number,field:"question",value:string) {
    if(!doc.editorial)return;
    const exercise=doc.editorial.exercise.map((item,i)=>i===index?{...item,[field]:value}:item);
    onChange({...doc,editorial:{...doc.editorial,exercise}});
  }
  function updateOption(index:number,optionIndex:number,field:"text"|"feedback",value:string) {
    if(!doc.editorial)return;
    const exercise=doc.editorial.exercise.map((item,i)=>i===index?{...item,options:item.options.map((option,j)=>j===optionIndex?{...option,[field]:value}:option)}:item);
    onChange({...doc,editorial:{...doc.editorial,exercise}});
  }
  return <>
    <nav className="tabs" aria-label="Части материала">{tabs.filter(t=>t!=="Упражнение"||doc.editorial).map(t=><button type="button" key={t} aria-pressed={t===tab} onClick={()=>setTab(t)}>{t}</button>)}</nav>
    {tab==="История"?<div className="fields">
      <label>Название<input value={doc.title} maxLength={300} onChange={e=>onChange({...doc,title:e.target.value})}/></label>
      <label>Текст истории<textarea className="story-text" value={doc.storyMarkdown} onChange={e=>onChange({...doc,storyMarkdown:e.target.value})}/></label>
      {doc.editorial?<details className="catalog-description"><summary>Описание для каталога</summary><label>Краткое описание в редакционном каталоге<textarea rows={2} value={doc.editorial.summary} onChange={e=>onChange({...doc,editorial:{...doc.editorial!,summary:e.target.value}})}/></label></details>:null}
    </div>:null}
    {tab==="Решение"?<div className="fields">{doc.analysisItems.map((item,i)=><label key={item.label}>{i+1}. {item.label}<textarea rows={5} value={item.description} onChange={e=>onChange({...doc,analysisItems:doc.analysisItems.map((other,j)=>j===i?{...other,description:e.target.value}:other)})}/></label>)}</div>:null}
    {tab==="Упражнение" && doc.editorial?<div className="fields"><p>Канонический вариант берётся из полного абзаца разбора. Ответы читателей не сохраняются.</p>{doc.editorial.exercise.map((item,i)=><section className="exercise-field" key={item.id}>
      <h2>{i+1}. {item.label}</h2><label>Вопрос<textarea rows={2} value={item.question} onChange={e=>updateExercise(i,"question",e.target.value)}/></label>
      {item.options.map((option,j)=>option.text===null?<p key={option.id} className="canonical">Канонический вариант: {doc.analysisItems[i].description}</p>:<div key={option.id}><label>Вариант {j+1}<textarea rows={3} value={option.text} onChange={e=>updateOption(i,j,"text",e.target.value)}/></label><label>Пояснение расхождения<textarea rows={3} value={option.feedback??""} onChange={e=>updateOption(i,j,"feedback",e.target.value)}/></label></div>)}
    </section>)}</div>:null}
    {tab==="Изображения"?<div className="fields"><p>Выбор опубликованного файла и описание. Исходные изображения сохранены; адрес должен начинаться с /media/.</p>
      {(["story","analysis","catalog"] as const).map(kind=><ImageField key={kind} title={{story:"Архив — история",analysis:"Архив — решение",catalog:"Архив — каталог"}[kind]} asset={doc.visuals[kind]} onChange={asset=>onChange({...doc,visuals:{...doc.visuals,[kind]:asset}})}/>)}
      {doc.editorial?(["story","analysis"] as const).map(kind=><ImageField key={kind} title={kind==="story"?"Редакционная версия — история":"Редакционная версия — решение"} asset={doc.editorial![kind]} onChange={asset=>onChange({...doc,editorial:{...doc.editorial!,[kind]:asset}})}/>):null}
    </div>:null}
    {tab==="Предпросмотр" && publication?<ReaderPreview publication={publication} document={doc}/>:null}
  </>;
}
function ImageField<T extends ContentDocument["visuals"]["story"]>({title,asset,onChange}:{title:string;asset:T;onChange:(asset:T)=>void}) {
  return <fieldset><legend>{title}</legend><img className="image-preview" src={asset.src} alt={asset.alt}/><label>Адрес изображения<input value={asset.src} onChange={e=>onChange({...asset,src:e.target.value})}/></label><label>Описание изображения<input value={asset.alt} onChange={e=>onChange({...asset,alt:e.target.value})}/></label></fieldset>;
}
