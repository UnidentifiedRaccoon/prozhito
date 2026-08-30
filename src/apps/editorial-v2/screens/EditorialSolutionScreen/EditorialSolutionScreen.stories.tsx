import { type MouseEvent, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ANALYSIS_LABELS } from "../../../../content/sectionContract";
import { EditorialV2Shell } from "../../components/EditorialV2Shell/EditorialV2Shell";
import EditorialV2App from "../../EditorialV2App";
import {
  editorialV2StorybookEntries,
  getEditorialV2StorybookEntry,
} from "../../storybook/fixtures";
import {
  editorialV2CatalogHref,
  editorialV2AnalysisHref,
  editorialV2StoryHref,
  parseEditorialV2Path,
  type EditorialV2Route,
  type EditorialV2SectionId,
} from "../../routing";
import { EditorialSolutionScreen, type EditorialSolutionScreenProps } from "./EditorialSolutionScreen";
import {
  createEditorialExerciseState,
  EDITORIAL_EXERCISE_LINKS,
} from "../../model/editorialExercise";
import { getEditorialV2SolutionVisual } from "../../model/editorialV2Visuals";
import { EDITORIAL_EXERCISES, getEditorialExerciseLinks } from "../../model/editorialExercises";

function solutionArgs(sectionId: EditorialV2SectionId) {
  const entry = getEditorialV2StorybookEntry(sectionId);
  const entryIndex = editorialV2StorybookEntries.findIndex(
    ({ id }) => id === sectionId,
  );
  const nextEntry = editorialV2StorybookEntries[
    (entryIndex + 1) % editorialV2StorybookEntries.length
  ];

  return {
    artwork: getEditorialV2SolutionVisual(entry.id),
    navigation: {
      secondary: {
        href: editorialV2StoryHref(entry.id),
        label: "Вернуться к истории",
      },
      primary: {
        href: editorialV2StoryHref(nextEntry.id),
        label: "Следующая история",
      },
    },
    section: entry.section,
  } as const;
}

const defaultArgs = solutionArgs("L01-S01");

function SolutionExample(args: EditorialSolutionScreenProps) {
  const [state, onStateChange] = useState(createEditorialExerciseState);

  return (
    <EditorialV2Shell
      compensateLegacyRootPadding={false}
      pageTitle={`${args.section.title} · Решение`}
      routeKey={`storybook-solution-${args.section.id}`}
      showMasthead={false}
    >
      <EditorialSolutionScreen
        {...args}
        exercise={{ state, onStateChange }}
      />
    </EditorialV2Shell>
  );
}

const meta = {
  title: "Editorial V2/Screens/Solution",
  component: EditorialSolutionScreen,
  parameters: { layout: "fullscreen" },
  args: defaultArgs,
  render: (args) => <SolutionExample key={args.section.id} {...args} />,
} satisfies Meta<typeof EditorialSolutionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

async function verifySolution(
  canvasElement: HTMLElement,
  sectionTitle: string,
  imageAlt: string,
  exerciseRead = false,
) {
  const canvas = within(canvasElement);
  const chain = canvas.getByRole("list", { name: exerciseRead ? "Полная цепочка решения" : "Цепочка решения" });
  const scopedChain = within(chain);

  await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  await expect(canvas.getByRole("link", { name: "К маршруту историй" })).toHaveAttribute("href", editorialV2CatalogHref);
  await expect(canvas.queryByRole("link", { name: "Прожито" })).toBeNull();
  await expect(canvasElement.querySelector("[data-editorial-cover='analysis']")).toBeTruthy();
  await expect(
    canvas.getByRole("heading", { level: 1, name: sectionTitle }),
  ).toBeTruthy();
  await expect(canvas.getByRole("img", { name: imageAlt })).toBeTruthy();
  await expect(scopedChain.getAllByRole("listitem")).toHaveLength(9);
  await expect(
    scopedChain.getAllByRole("heading", { level: exerciseRead ? 3 : 2 }).map((item) => item.textContent),
  ).toEqual([...ANALYSIS_LABELS]);
  await expect(canvasElement.querySelector("figcaption")).toBeNull();
  await expect(
    canvas.queryByRole("navigation", { name: "Экраны истории" }),
  ).toBeNull();
  await expect(canvas.queryAllByRole("tablist")).toHaveLength(0);
  await expect(
    canvas.queryAllByRole("link", { name: /^(История|Решение)$/ }),
  ).toHaveLength(0);

  for (const label of [
    "Материал",
    "Режим",
    "Фокус",
    "Редакционная версия",
    "Архивная версия",
  ]) {
    await expect(canvas.queryAllByText(label, { exact: true })).toHaveLength(0);
  }
}

async function verifyExerciseSolution(
  canvasElement: HTMLElement,
  args: EditorialSolutionScreenProps,
) {
  const canvas = within(canvasElement);
  const links = getEditorialExerciseLinks(args.section.id);
  if (!links) throw new Error(`Нет набора упражнения для ${args.section.id}.`);

  await expect(canvasElement.querySelector("[data-exercise='true']")).toBeTruthy();
  await expect(canvas.getAllByRole("radio")).toHaveLength(3);
  await expect(canvas.getByRole("group")).toHaveAccessibleName(links[0].question);
  await expect(canvas.getByRole("button", { name: "Следующее" })).toBeDisabled();
  const steps = within(canvas.getByRole("navigation", { name: "Звенья цепочки" })).getAllByRole("button");
  await expect(steps).toHaveLength(9);
  await expect(steps[0]).toBeEnabled();
  for (const future of steps.slice(1)) await expect(future).toBeDisabled();
  await expect(canvas.getByRole("link", { name: args.navigation.primary.label })).toHaveAttribute("href", args.navigation.primary.href);
  await expect(canvas.getByRole("link", { name: "Вернуться к истории" })).toHaveAttribute("href", args.navigation.secondary!.href);

  await userEvent.click(canvas.getByRole("button", { name: "Прочитать разбор без упражнения" }));
  await verifySolution(canvasElement, args.section.title, args.artwork.alt, true);
  for (const item of args.section.analysisItems) {
    await expect(canvas.getByText(item.description, { exact: true })).toBeVisible();
  }
  for (const link of links) {
    for (const option of link.options) {
      if (option.text !== null) await expect(canvas.queryByText(option.feedback, { exact: true })).not.toBeInTheDocument();
    }
  }
  await userEvent.click(canvas.getAllByRole("button", { name: "Вернуться к упражнению" })[0]);
  await expect(canvas.getByRole("group")).toHaveAccessibleName(links[0].question);
  for (const radio of canvas.getAllByRole("radio")) await expect(radio).not.toBeChecked();
}

export const L01S01: Story = {
  play: async ({ canvasElement, args }) => verifyExerciseSolution(canvasElement, args),
};

function drawsVisibleOutline(element: HTMLElement) {
  const style = element.ownerDocument.defaultView!.getComputedStyle(element);
  return Number.parseFloat(style.outlineWidth) > 0
    && style.outlineStyle !== "none"
    && style.outlineStyle !== "hidden"
    && style.outlineColor !== "transparent"
    && style.outlineColor !== "rgba(0, 0, 0, 0)";
}

export const ReadingFocus: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const reading = canvasElement.querySelector<HTMLElement>("[data-editorial-reading]");
    if (!reading) throw new Error("Экран решения не содержит цель перехода к чтению.");
    const skipLink = canvas.getByRole("link", { name: "К содержанию" });
    const firstStep = canvas.getByRole("button", { name: "1. Ситуация. Ответ не выбран." });

    await step("Skip-link фокусирует чтение без обводки всего экрана; Tab выделяет первый пункт навигации", async () => {
      // Wait for the shell's route-entry effect before beginning keyboard
      // navigation, so it cannot steal focus back from the activated skip-link.
      await waitFor(async () => {
        await expect(canvas.getByRole("main")).toHaveFocus();
      });
      skipLink.focus();
      await expect(skipLink).toHaveFocus();
      await userEvent.keyboard("[Enter]");
      await expect(reading).toHaveFocus();
      await expect(drawsVisibleOutline(reading)).toBe(false);
      await userEvent.tab();
      await expect(firstStep).toHaveFocus();
      await expect(firstStep).toBeVisible();
      await expect(drawsVisibleOutline(firstStep)).toBe(true);
    });

    await step("Клик по пассивному тексту не обводит весь контейнер", async () => {
      await userEvent.click(canvas.getByText(EDITORIAL_EXERCISE_LINKS[0].question, { exact: true }));
      // Pointer focus differs across browser drivers; the visible result must
      // remain the same whether the container or the main region keeps focus.
      await expect(drawsVisibleOutline(reading)).toBe(false);
    });

    await step("Клавиатурный фокус виден на строке ответа и кнопке перехода", async () => {
      skipLink.focus();
      await expect(skipLink).toHaveFocus();
      await userEvent.keyboard("[Enter]");
      await userEvent.tab();
      await userEvent.tab();
      const radio = canvas.getAllByRole("radio")[0];
      const label = radio.closest<HTMLLabelElement>("label");
      if (!label) throw new Error("Вариант ответа не имеет связанной строки label.");
      await expect(radio).toHaveFocus();
      await expect(label).toBeVisible();
      await expect(drawsVisibleOutline(label)).toBe(true);
      await userEvent.keyboard("[Space]");
      await expect(radio).toBeChecked();
      await userEvent.tab();
      const next = canvas.getByRole("button", { name: "Следующее" });
      await expect(next).toHaveFocus();
      await expect(drawsVisibleOutline(next)).toBe(true);
      await userEvent.keyboard("[Enter]");
      await expect(canvas.getByRole("group")).toHaveAccessibleName(EDITORIAL_EXERCISE_LINKS[1].question);
      await expect(drawsVisibleOutline(reading)).toBe(false);
    });
  },
};

export const L01S02: Story = {
  args: solutionArgs("L01-S02"),
  play: async ({ canvasElement, args }) =>
    verifyExerciseSolution(canvasElement, args),
};

export const L01S03: Story = {
  args: solutionArgs("L01-S03"),
  play: async ({ canvasElement, args }) =>
    verifyExerciseSolution(canvasElement, args),
};

const sectionFixtures = new Map(editorialV2StorybookEntries.map((entry) => [entry.id, entry.section]));

// Keep route changes inside this story while using the real app's Section owner.
// No test-only state container replaces the production exercise controller.
function SectionRouteExample() {
  const [route, setRoute] = useState<EditorialV2Route>({
    name: "editorial-v2-analysis",
    sectionId: "L01-S01",
  });

  function followRoute(event: MouseEvent<HTMLDivElement>) {
    const href = event.target instanceof Element
      ? event.target.closest("a")?.getAttribute("href")
      : null;
    const nextRoute = href?.startsWith("#/") ? parseEditorialV2Path(href.slice(1)) : null;
    if (!nextRoute) return;
    event.preventDefault();
    setRoute(nextRoute);
  }

  return (
    <div onClickCapture={followRoute}>
      <EditorialV2App route={route} sectionsById={sectionFixtures} />
    </div>
  );
}

export const SectionTransitions: Story = {
  render: () => <SectionRouteExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    async function follow(href: string) {
      const link = canvas.getAllByRole("link").find((item) => item.getAttribute("href") === href);
      if (!link) throw new Error(`Не найдена ссылка ${href}.`);
      await userEvent.click(link);
    }
    async function expectFresh(sectionId: EditorialV2SectionId) {
      await expect(canvas.getByRole("group")).toHaveAccessibleName(EDITORIAL_EXERCISES[sectionId][0].question);
      for (const radio of canvas.getAllByRole("radio")) await expect(radio).not.toBeChecked();
      await expect(canvas.getByRole("button", { name: "Следующее" })).toBeDisabled();
    }
    async function followNextStory(sectionId: EditorialV2SectionId) {
      const link = canvas.getByRole("link", { name: "Следующая история" });
      await expect(link).toHaveAttribute("href", editorialV2StoryHref(sectionId));
      await userEvent.click(link);
      await expect(canvas.getByRole("heading", {
        level: 1,
        name: getEditorialV2StorybookEntry(sectionId).section.title,
      })).toBeVisible();
      await expect(canvasElement.querySelector("[data-editorial-cover='story']")).toBeTruthy();
      await expect(canvas.queryByRole("group")).toBeNull();
    }

    await step("Ответ предыдущей Section не появляется в новой", async () => {
      const firstAnswer = canvas.getAllByRole("radio")[0];
      await userEvent.click(firstAnswer);
      await expect(firstAnswer).toBeChecked();
      await followNextStory("L01-S02");
      await follow(editorialV2AnalysisHref("L01-S02"));
      await expectFresh("L01-S02");
    });

    await step("Возврат к своей истории сохраняет ответы и текущий вопрос", async () => {
      const items = getEditorialV2StorybookEntry("L01-S02").section.analysisItems;
      await userEvent.click(canvas.getByRole("radio", { name: items[0].description }));
      await userEvent.click(canvas.getByRole("button", { name: "Следующее" }));
      await follow(editorialV2StoryHref("L01-S02"));
      await expect(canvas.queryByRole("group")).toBeNull();
      await follow(editorialV2AnalysisHref("L01-S02"));
      await expect(canvas.getByRole("group")).toHaveAccessibleName(EDITORIAL_EXERCISES["L01-S02"][1].question);
      await userEvent.click(canvas.getByRole("button", { name: "Предыдущее" }));
      await expect(canvas.getByRole("radio", { name: items[0].description })).toBeChecked();
    });

    await step("Неполное упражнение не мешает пройти третью Section и начать новый круг без старого ответа", async () => {
      await followNextStory("L01-S03");
      await follow(editorialV2AnalysisHref("L01-S03"));
      await expectFresh("L01-S03");
      await followNextStory("L01-S01");
      await follow(editorialV2AnalysisHref("L01-S01"));
      await expectFresh("L01-S01");
    });

    await step("Новый круг продолжается ко второй Section с чистыми ответами", async () => {
      await followNextStory("L01-S02");
      await follow(editorialV2AnalysisHref("L01-S02"));
      await expectFresh("L01-S02");
    });

    await step("Выход в каталог через обложку очищает ответы и текущий вопрос", async () => {
      await userEvent.click(canvas.getAllByRole("radio")[0]);
      await userEvent.click(canvas.getByRole("button", { name: "Следующее" }));
      await expect(canvas.getByRole("group")).toHaveAccessibleName(EDITORIAL_EXERCISES["L01-S02"][1].question);
      const catalogLink = canvas.getByRole("link", { name: "К маршруту историй" });
      await expect(catalogLink).toHaveAttribute("href", editorialV2CatalogHref);
      await userEvent.click(catalogLink);
      await expect(canvas.getByRole("list", { name: "Истории первого уровня" })).toBeVisible();
      await follow(editorialV2StoryHref("L01-S02"));
      await follow(editorialV2AnalysisHref("L01-S02"));
      await expectFresh("L01-S02");
    });
  },
};
