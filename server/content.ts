import { z } from "zod";

export const LABELS = ["Ситуация", "Эмоция", "Импульс", "Пауза", "Риск", "Осознание", "Инструмент", "Действие", "Результат"] as const;
export const LINK_IDS = ["situation", "emotion", "impulse", "pause", "risk", "awareness", "tool", "action", "result"] as const;
export const SECTION_IDS = [3, 4, 4, 4, 4, 3].flatMap((count, level) =>
  Array.from({ length: count }, (_, section) => `L${String(level + 1).padStart(2,"0")}-S${String(section + 1).padStart(2,"0")}`));
const text = (max: number) => z.string().trim().min(1).max(max);
const point = z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) }).strict();
const artwork = z.object({
  src: z.string().regex(/^\/media\/[a-zA-Z0-9/_.-]+\.(jpg|jpeg|png|webp)$/).refine(value => !value.includes("..")),
  alt: z.string().max(500), width: z.number().int().positive().max(10000), height: z.number().int().positive().max(10000),
  focal: z.object({ mobile: point, desktop: point }).strict().optional(),
  solutionFocal: z.object({ mobile: point, desktop: point }).strict().optional(),
  coverFocal: z.object({ mobile: point, desktop: point }).strict().optional(),
}).strict();
const editorialArtwork=artwork.extend({
  focal:z.object({mobile:point,desktop:point}).strict(),
  solutionFocal:z.object({mobile:point,desktop:point}).strict(),
});
const option = z.object({ id: text(100), text: text(4000).nullable(), feedback: text(4000).optional() }).strict();
const link = z.object({ id: z.enum(LINK_IDS), label: z.enum(LABELS), question: text(2000), canonicalOptionId: text(100), options: z.array(option).length(3) }).strict();
export const documentSchema = z.object({
  id: z.enum(SECTION_IDS as [string, ...string[]]), number: z.number().int().min(1).max(4),
  title: text(300), storyMarkdown: text(120000),
  analysisItems: z.array(z.object({ label: z.enum(LABELS), description: text(12000) }).strict()).length(9),
  visuals: z.object({ story: artwork, analysis: artwork, catalog: artwork }).strict(),
  editorial: z.object({ summary: text(2000), story: editorialArtwork, analysis: editorialArtwork, exercise: z.array(link).length(9) }).strict().optional(),
}).strict().superRefine((doc, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: "custom", message });
  if (Number(doc.id.slice(-2)) !== doc.number) fail("Номер Section не совпадает с ID");
  if (doc.analysisItems.some((item, i) => item.label !== LABELS[i])) fail("Порядок девяти звеньев изменён");
  const editorialRequired = ["L01-S01", "L01-S02", "L01-S03"].includes(doc.id);
  if (Boolean(doc.editorial) !== editorialRequired) fail("Упражнение допустимо и обязательно только в редакционной тройке");
  doc.editorial?.exercise.forEach((item, i) => {
    if (item.id !== LINK_IDS[i] || item.label !== LABELS[i]) fail("Порядок вопросов не совпадает с разбором");
    if (new Set(item.options.map(o => o.id)).size !== 3) fail("ID вариантов должны различаться");
    const canonical = item.options.filter(o => o.id === item.canonicalOptionId);
    if (canonical.length !== 1 || canonical[0].text !== null || canonical[0].feedback !== undefined) fail("Канонический вариант должен ссылаться на полный абзац разбора");
    if (item.options.filter(o => o.id !== item.canonicalOptionId).some(o => !o.text || !o.feedback)) fail("У каждого расхождения нужны текст и пояснение");
  });
});
export type ContentDocument = z.infer<typeof documentSchema>;
export function validatePublication(documents: unknown[]) {
  const parsed = documents.map(value => documentSchema.parse(value));
  if (parsed.length !== 22 || SECTION_IDS.some(id => parsed.filter(d => d.id === id).length !== 1)) throw new Error("Ожидались все 22 разные Section");
  return SECTION_IDS.map(id => parsed.find(d => d.id === id)!);
}
