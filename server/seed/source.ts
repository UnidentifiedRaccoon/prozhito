import { readFileSync } from "node:fs";
import { SECTION_SOURCES, PROGRAM_LEVELS } from "../../src/content/program.ts";
import { parseSectionMarkdown } from "../../src/content/sectionContract.ts";
import { getSectionVisuals } from "../../src/visuals/sectionVisuals.ts";
import { getEditorialExerciseLinks } from "../../src/apps/editorial-v2/model/editorialExercises.ts";
import { getEditorialV2SolutionVisual } from "../../src/apps/editorial-v2/model/editorialV2Visuals.ts";
import { buildEditorialV2Program } from "../../src/apps/editorial-v2/model/editorialV2Program.ts";
import { validatePublication } from "../content.ts";
const parsed=SECTION_SOURCES.map(({id,sourcePath})=>parseSectionMarkdown(readFileSync(sourcePath,"utf8"),sourcePath,id));
const editorial=buildEditorialV2Program(new Map(parsed.map(s=>[s.id,s])));
export const seed={
  levels:PROGRAM_LEVELS.map(({id,number,title})=>({id,number,title})),
  documents:validatePublication(parsed.map(section=>{
    const entry=editorial.find(e=>e.id===section.id);
    const {sourcePath:_,...document}=section;
    return {...document,visuals:getSectionVisuals(section.id),...(entry?{editorial:{summary:entry.summary,story:entry.artwork,analysis:getEditorialV2SolutionVisual(entry.id),exercise:getEditorialExerciseLinks(entry.id)}}:{})};
  })),
};
