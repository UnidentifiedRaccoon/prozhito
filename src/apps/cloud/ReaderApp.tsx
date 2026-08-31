import {lazy,Suspense} from "react";
import type {SectionCollection} from "../../content/sections";
import {useHashRoute} from "../../router";
import {CatalogScreen} from "../../screens/CatalogScreen";
import {StoryScreen} from "../../screens/StoryScreen";
import {AnalysisScreen} from "../../screens/AnalysisScreen";
import {NotFoundScreen} from "../../screens/NotFoundScreen";
const EditorialV2App=lazy(()=>import("../editorial-v2/EditorialV2App"));
const VersionHubScreen=lazy(()=>import("../version-hub/VersionHubScreen"));
// Cloud entry deliberately has no build-time Markdown collection or lab routes.
export function ReaderApp({collection}:{collection:SectionCollection}){
  const route=useHashRoute();
  if(!collection.ok)return <NotFoundScreen/>;
  const {sections,sectionsById,levels}=collection;
  if(route.name==="catalog")return <CatalogScreen levels={levels}/>;
  if(route.name==="version-hub")return <Suspense fallback={<p role="status">Открываем «Прожито»…</p>}><VersionHubScreen/></Suspense>;
  if(route.name==="editorial-v2-catalog"||route.name==="editorial-v2-story"||route.name==="editorial-v2-analysis")return <Suspense fallback={<p role="status">Открываем «Прожито»…</p>}><EditorialV2App route={route} sectionsById={sectionsById}/></Suspense>;
  if(route.name!=="story"&&route.name!=="analysis")return <NotFoundScreen/>;
  const section=sectionsById.get(route.sectionId);
  if(!section)return <NotFoundScreen/>;
  return route.name==="story"?<StoryScreen section={section}/>:<AnalysisScreen section={section} nextSection={sections[sections.findIndex(s=>s.id===section.id)+1]}/>;
}
