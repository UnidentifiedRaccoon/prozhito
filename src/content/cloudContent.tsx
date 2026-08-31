import { createContext, useContext } from "react";
import type { ContentDocument } from "../../server/content";
import { getSectionVisuals } from "../visuals/sectionVisuals";
import { getEditorialV2Visual, getEditorialV2SolutionVisual, type EditorialV2ArtworkAsset } from "../apps/editorial-v2/model/editorialV2Visuals";
import type { EditorialV2SectionId } from "../apps/editorial-v2/routing";
import type { EditorialExerciseLink } from "../apps/editorial-v2/model/editorialExercise";
import { getEditorialExerciseLinks } from "../apps/editorial-v2/model/editorialExercises";

export const CloudContentContext = createContext<ReadonlyMap<string,ContentDocument>|null>(null);
function useDocument(id:string) {
  const documents=useContext(CloudContentContext);
  const document=documents?.get(id);
  if(documents && !document)throw new Error("Опубликованная Section не найдена");
  return document;
}
export function useSectionVisuals(id:string) {
  const document=useDocument(id);
  return document ? document.visuals : getSectionVisuals(id);
}
export function useEditorialContent(id:EditorialV2SectionId) {
  const document=useDocument(id);
  if(!document)return null;
  if(!document.editorial)throw new Error("Редакционный материал не найден");
  const convert=(asset:ContentDocument["visuals"]["story"]):EditorialV2ArtworkAsset=>{
    if(!asset.focal || !asset.solutionFocal)throw new Error("Отсутствует кадрирование редакционной иллюстрации");
    return {...asset,focal:asset.focal,solutionFocal:asset.solutionFocal};
  };
  return {...document.editorial,story:convert(document.editorial.story),analysis:convert(document.editorial.analysis)};
}
export function useEditorialArtwork(id:EditorialV2SectionId,solution=false) {
  const content=useEditorialContent(id);
  return content ? (solution?content.analysis:content.story) : (solution?getEditorialV2SolutionVisual(id):getEditorialV2Visual(id));
}
export function useEditorialLinks(id:string) {
  const document=useDocument(id);
  return document ? document.editorial?.exercise as unknown as readonly EditorialExerciseLink[]|undefined : getEditorialExerciseLinks(id);
}
