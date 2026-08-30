import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  createEditorialExerciseState,
  EDITORIAL_EXERCISE_LINKS,
  type EditorialExerciseState,
} from "../../model/editorialExercise";
import { getEditorialV2StorybookEntry } from "../../storybook/fixtures";
import { EDITORIAL_EXERCISES } from "../../model/editorialExercises";
import type { EditorialV2SectionId } from "../../routing";
import { withEditorialV2 } from "../../storybook/withEditorialV2";
import { EditorialExercise, type EditorialExerciseProps } from "./EditorialExercise";

const items = getEditorialV2StorybookEntry("L01-S01").section.analysisItems;

function exerciseArgs(sectionId: EditorialV2SectionId) {
  return {
    items: getEditorialV2StorybookEntry(sectionId).section.analysisItems,
    links: EDITORIAL_EXERCISES[sectionId],
  };
}

function getWrongOption(link: (typeof EDITORIAL_EXERCISE_LINKS)[number], index: 0 | 1) {
  const option = link.options.filter((candidate) => candidate.text !== null)[index];
  if (!option || option.text === null) throw new Error(`Нет неверного варианта ${index + 1} у ${link.id}.`);
  return option;
}

const canonicalAnswers: EditorialExerciseState["answers"] = Object.fromEntries(
  EDITORIAL_EXERCISE_LINKS.map((link) => [link.id, link.canonicalOptionId]),
);

function InteractiveExercise({ state: initialState, ...props }: EditorialExerciseProps) {
  const [state, setState] = useState(initialState);
  return <EditorialExercise {...props} state={state} onStateChange={setState} />;
}

async function expectAnsweredStepCount(canvasElement: HTMLElement, expectedCount: number) {
  const rail = within(within(canvasElement).getByRole("navigation", { name: "Звенья цепочки" }));
  await expect(rail.getAllByRole("button")).toHaveLength(9);
  await expect(rail.queryAllByRole("button", { name: /\. Ответ выбран\.$/ })).toHaveLength(expectedCount);
  await expect(rail.queryAllByRole("button", { name: /\. Ответ не выбран\.$/ })).toHaveLength(9 - expectedCount);
}

async function expectUnlockedSteps(canvasElement: HTMLElement, availableCount: number) {
  const rail = within(within(canvasElement).getByRole("navigation", { name: "Звенья цепочки" }));
  const steps = rail.getAllByRole("button");
  await expect(steps).toHaveLength(9);
  for (const [index, button] of steps.entries()) {
    if (index < availableCount) await expect(button).toBeEnabled();
    else await expect(button).toBeDisabled();
  }
}

async function expectNoFeedback(canvasElement: HTMLElement, links = EDITORIAL_EXERCISE_LINKS) {
  const canvas = within(canvasElement);
  for (const link of links) {
    for (const option of link.options) {
      if (option.text !== null) {
        await expect(canvas.queryByText(option.feedback, { exact: true })).not.toBeInTheDocument();
      }
    }
  }
}

async function expectReviewContent(
  canvasElement: HTMLElement,
  expectedAnswers: EditorialExerciseState["answers"],
  links = EDITORIAL_EXERCISE_LINKS,
  analysisItems = items,
) {
  const canvas = within(canvasElement);
  const review = within(canvas.getByRole("list", { name: "Сверка девяти звеньев" }));
  const rows = review.getAllByRole("listitem");
  const differenceCount = links.filter((link) => expectedAnswers[link.id] !== link.canonicalOptionId).length;
  await expect(canvas.queryByRole("heading", { name: "Сверка всей цепочки" })).not.toBeInTheDocument();
  await expect(canvas.queryByText("Сопоставьте свой выбор с разбором истории. Здесь оцениваются формулировки о Саше, а не ваши финансовые решения.", { exact: true })).not.toBeInTheDocument();
  await expect(canvas.queryByText("Отличается от разбора", { exact: true })).not.toBeInTheDocument();
  await expect(canvas.queryByText("Совпадает с разбором", { exact: true })).not.toBeInTheDocument();
  await expect(canvas.getByRole("button", { name: "Изменить ответы" })).toBeVisible();
  await expect(rows).toHaveLength(9);
  await expect(review.queryAllByRole("heading", { level: 4, name: "Ваш выбор" })).toHaveLength(differenceCount);
  await expect(review.queryAllByRole("heading", { level: 4, name: "В разборе" })).toHaveLength(differenceCount);

  for (const [index, link] of links.entries()) {
    const row = within(rows[index]);
    const selected = link.options.find((option) => option.id === expectedAnswers[link.id]);
    if (!selected) throw new Error(`В проверяемой цепочке нет ответа на ${link.id}.`);
    await expect(review.getAllByText(analysisItems[index].description, { exact: true })).toHaveLength(1);
    await expect(row.getByText(analysisItems[index].description, { exact: true })).toBeVisible();

    if (selected.text !== null) {
      await expect(row.getByRole("heading", { level: 4, name: "Ваш выбор" })).toBeVisible();
      await expect(row.getByRole("heading", { level: 4, name: "В разборе" })).toBeVisible();
      await expect(row.getByText(selected.text, { exact: true })).toBeVisible();
    } else {
      await expect(row.queryByRole("heading", { level: 4, name: "Ваш выбор" })).not.toBeInTheDocument();
      await expect(row.queryByRole("heading", { level: 4, name: "В разборе" })).not.toBeInTheDocument();
    }

    for (const option of link.options) {
      if (option.text === null) continue;
      if (option.id === selected.id) {
        await expect(review.getAllByText(option.feedback, { exact: true })).toHaveLength(1);
        await expect(row.getByText(option.feedback, { exact: true })).toBeVisible();
      } else {
        await expect(canvas.queryByText(option.feedback, { exact: true })).not.toBeInTheDocument();
      }
    }
  }
}

function drawsVisibleOutline(element: HTMLElement) {
  const style = element.ownerDocument.defaultView!.getComputedStyle(element);
  return Number.parseFloat(style.outlineWidth) > 0
    && style.outlineStyle !== "none"
    && style.outlineStyle !== "hidden"
    && style.outlineColor !== "transparent"
    && style.outlineColor !== "rgba(0, 0, 0, 0)";
}

const meta = {
  title: "Editorial V2/Patterns/Exercise",
  component: EditorialExercise,
  decorators: [withEditorialV2],
  render: (args) => <InteractiveExercise {...args} />,
  args: {
    ...exerciseArgs("L01-S01"),
    state: createEditorialExerciseState(),
    onStateChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Формат «Шаг за шагом» для вторых экранов editorial_v2 L01-S01–L01-S03. Каждый ответ открывает следующее звено без автоматического перехода и оценки. Общая сверка доступна после любых девяти ответов; пояснение относится только к выбранному неверному варианту. Полный исходный разбор можно свободно читать без упражнения. Набор вопросов и временное состояние передаёт владелец экрана; компонент не использует хранилище или сеть.",
      },
    },
  },
} satisfies Meta<typeof EditorialExercise>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ThreeStepStates: Story = {
  args: {
    state: {
      answers: { situation: "situation-same-day" },
      currentIndex: 1,
      view: "exercise",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Первое звено отвечено, второе открыто, остальные пока недоступны. Первый ответ намеренно отличается от разбора: оформление показывает наличие выбора, а не его правильность.",
      },
    },
  },
};

export const KeyboardControls: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The first rail item now starts keyboard navigation; the reading action
    // follows the form. Native radio navigation still needs no app handlers.
    const exercise = within(canvas.getByRole("region", { name: "Упражнение: цепочка решения" }));
    const firstStep = exercise.getByRole("button", { name: "1. Ситуация. Ответ не выбран." });
    await expect(exercise.getAllByRole("button")[0]).toBe(firstStep);
    firstStep.focus();
    await expect(firstStep).toHaveFocus();
    await userEvent.tab();
    const radios = canvas.getAllByRole("radio");
    await expect(radios[0]).toHaveFocus();
    await userEvent.keyboard("[Space]");
    await expect(radios[0]).toBeChecked();
    await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[0].question);
    await userEvent.keyboard("[ArrowDown]");
    await expect(radios[1]).toHaveFocus();
    await expect(radios[1]).toBeChecked();
    await expect(radios[0]).not.toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Следующее" })).toHaveFocus();
    await userEvent.keyboard("[Enter]");
    await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[1].question);
    await expect(canvas.getByRole("group")).toHaveAccessibleName(EDITORIAL_EXERCISE_LINKS[1].question);
    await expect(canvas.getByRole("group")).not.toHaveAccessibleDescription();
  },
};

export const SequentialAccess: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Будущие звенья нельзя открыть ни через ленту, ни кнопкой вперёд", async () => {
      await expectUnlockedSteps(canvasElement, 1);
      await expect(canvas.queryByRole("button", { name: "Начать заново" })).not.toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: "Следующее" })).toBeDisabled();
      await userEvent.click(canvas.getByRole("button", { name: "9. Наблюдаемый результат. Ответ не выбран." }));
      await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[0].question);
      await expectAnsweredStepCount(canvasElement, 0);
    });

    await step("Любой ответ открывает ровно следующее звено без оценки и автоперехода", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: EDITORIAL_EXERCISE_LINKS[0].options[0].text! }));
      await expectUnlockedSteps(canvasElement, 2);
      await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[0].question);
      await expect(canvas.queryByText("Отличается от разбора", { exact: true })).not.toBeInTheDocument();
      await expect(canvas.queryByText("Совпадает с разбором", { exact: true })).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole("button", { name: "3. Импульс. Ответ не выбран." }));
      await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[0].question);
      await userEvent.click(canvas.getByRole("button", { name: "2. Эмоция. Ответ не выбран." }));
      await expect(canvas.getByRole("button", { name: "Следующее" })).toBeDisabled();
      await userEvent.click(canvas.getByRole("radio", { name: EDITORIAL_EXERCISE_LINKS[1].options[0].text! }));
      await expectUnlockedSteps(canvasElement, 3);
      await userEvent.click(canvas.getByRole("button", { name: "3. Импульс. Ответ не выбран." }));
      await userEvent.click(canvas.getByRole("radio", { name: items[2].description }));
      await expectUnlockedSteps(canvasElement, 4);
      await expect(canvas.queryByRole("button", { name: "Начать заново" })).not.toBeInTheDocument();
    });

    await step("Возврат и перевыбор не стирают поздние ответы и не закрывают доступные звенья", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "1. Ситуация. Ответ выбран." }));
      await userEvent.click(canvas.getByRole("radio", { name: items[0].description }));
      await expectUnlockedSteps(canvasElement, 4);
      await expectAnsweredStepCount(canvasElement, 3);
      await userEvent.click(canvas.getByRole("button", { name: "3. Импульс. Ответ выбран." }));
      await expect(canvas.getByRole("radio", { name: items[2].description })).toBeChecked();
      await userEvent.click(canvas.getByRole("button", { name: "2. Эмоция. Ответ выбран." }));
      await expect(canvas.getByRole("radio", { name: EDITORIAL_EXERCISE_LINKS[1].options[0].text! })).toBeChecked();
    });

  },
};

export const FullWrongChain: Story = {
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const { links, items: sectionItems } = args;
    const firstWrongAnswers: EditorialExerciseState["answers"] = Object.fromEntries(
      links.map((link) => [link.id, getWrongOption(link, 0).id]),
    );
    const secondWrongAnswers: EditorialExerciseState["answers"] = Object.fromEntries(
      links.map((link) => [link.id, getWrongOption(link, 1).id]),
    );

    await step("Без ответа нельзя идти вперёд; выбор не оценивается и не переводит дальше", async () => {
      await expect(canvas.getByRole("button", { name: "Следующее" })).toBeDisabled();
      await expect(canvas.getAllByRole("radio")).toHaveLength(3);
      await expectNoFeedback(canvasElement, links);
    });

    await step("Полностью ошибочная цепочка принимается; полные абзацы доступны в каждом вопросе", async () => {
      for (const [index, link] of links.entries()) {
        const wrongOption = getWrongOption(link, 0);
        await expect(canvas.getByRole("radio", { name: sectionItems[index].description })).toBeVisible();
        await userEvent.click(canvas.getByRole("radio", { name: wrongOption.text! }));
        await expect(canvas.getByRole("radio", { name: wrongOption.text! })).toBeChecked();
        await expect(canvas.getByRole("group")).toHaveTextContent(link.question);
        await expect(canvas.queryByText("Отличается от разбора", { exact: true })).not.toBeInTheDocument();
        await expect(canvas.queryByText("Совпадает с разбором", { exact: true })).not.toBeInTheDocument();
        await expectNoFeedback(canvasElement, [link]);
        if (index < 8) await userEvent.click(canvas.getByRole("button", { name: "Следующее" }));
      }
      await userEvent.click(canvas.getByRole("button", { name: "Перейти к сверке" }));
      const review = within(canvas.getByRole("list", { name: "Сверка девяти звеньев" }));
      await expect(review.getAllByRole("listitem")).toHaveLength(9);
      await expect(review.getAllByRole("heading", { level: 4, name: "Ваш выбор" })).toHaveLength(9);
      await expect(canvas.queryByRole("button", { name: "Начать заново" })).not.toBeInTheDocument();
      await expectReviewContent(canvasElement, firstWrongAnswers, links, sectionItems);
    });

    await step("Второй неверный вариант каждого звена получает другое пояснение только после сверки", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Изменить ответы" }));
      for (const [index, link] of links.entries()) {
        await expect(canvas.getByRole("radio", { name: getWrongOption(link, 0).text })).toBeChecked();
        const alternative = getWrongOption(link, 1);
        await userEvent.click(canvas.getByRole("radio", { name: alternative.text }));
        await expect(canvas.getByRole("radio", { name: alternative.text })).toBeChecked();
        await expectNoFeedback(canvasElement, [link]);
        if (index < 8) await userEvent.click(canvas.getByRole("button", { name: "Следующее" }));
      }
      await userEvent.click(canvas.getByRole("button", { name: "Перейти к сверке" }));
      await expectReviewContent(canvasElement, secondWrongAnswers, links, sectionItems);
    });

    await step("Исправление возвращает к первому расхождению и сохраняет остальные ответы", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Изменить ответы" }));
      await expect(canvas.getByRole("group")).toHaveTextContent(links[0].question);
      await expect(canvas.getByRole("radio", { name: getWrongOption(links[0], 1).text })).toBeChecked();
      await expectAnsweredStepCount(canvasElement, 9);
      await userEvent.click(canvas.getByRole("radio", { name: sectionItems[0].description }));
      await userEvent.click(canvas.getByRole("button", { name: "Перейти к сверке" }));
      await expect(canvas.getAllByRole("heading", { level: 4, name: "Ваш выбор" })).toHaveLength(8);
      await expectReviewContent(canvasElement, {
        ...secondWrongAnswers,
        situation: links[0].canonicalOptionId,
      }, links, sectionItems);
      await userEvent.click(canvas.getByRole("button", { name: "Изменить ответы" }));
      await expect(canvas.getByRole("group")).toHaveTextContent(links[1].question);
      await expectAnsweredStepCount(canvasElement, 9);
      await expect(canvas.queryByRole("button", { name: "Начать заново" })).not.toBeInTheDocument();
    });
  },
};

export const L01S02: Story = {
  args: exerciseArgs("L01-S02"),
  play: FullWrongChain.play,
};

export const L01S03: Story = {
  args: exerciseArgs("L01-S03"),
  play: FullWrongChain.play,
};

export const ReadWithoutAnswers: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Все девять абзацев доступны без заполнения и без оценки", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Прочитать разбор без упражнения" }));
      const full = within(canvas.getByRole("list", { name: "Полная цепочка решения" }));
      await expect(full.getAllByRole("listitem")).toHaveLength(9);
      for (const [index, item] of items.entries()) {
        const row = within(full.getAllByRole("listitem")[index]);
        await expect(row.getByRole("heading", { level: 3 })).toHaveTextContent(item.label);
        await expect(row.getByText(item.description, { exact: true })).toBeVisible();
      }
      await expect(canvas.queryByText("Ваш выбор", { exact: true })).not.toBeInTheDocument();
      await expect(canvas.queryByText("Отличается от разбора", { exact: true })).not.toBeInTheDocument();
      await expectNoFeedback(canvasElement);
      await userEvent.click(canvas.getAllByRole("button", { name: "Вернуться к упражнению" })[0]);
      await expectAnsweredStepCount(canvasElement, 0);
      for (const radio of canvas.getAllByRole("radio")) await expect(radio).not.toBeChecked();
    });

    await step("Чтение не теряет уже выбранный ответ и открытый вопрос", async () => {
      const wrongOption = getWrongOption(EDITORIAL_EXERCISE_LINKS[0], 0);
      await userEvent.click(canvas.getByRole("radio", { name: wrongOption.text }));
      await userEvent.click(canvas.getByRole("button", { name: "2. Эмоция. Ответ не выбран." }));
      await userEvent.click(canvas.getByRole("button", { name: "Прочитать разбор без упражнения" }));
      await expectNoFeedback(canvasElement);
      await userEvent.click(canvas.getAllByRole("button", { name: "Вернуться к упражнению" })[0]);
      await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[1].question);
      await expectAnsweredStepCount(canvasElement, 1);
      await expectUnlockedSteps(canvasElement, 2);
      await userEvent.click(canvas.getByRole("button", { name: "1. Ситуация. Ответ выбран." }));
      await expect(canvas.getByRole("radio", { name: wrongOption.text })).toBeChecked();
    });
  },
};

const almostCompleteState: EditorialExerciseState = {
  answers: Object.fromEntries(EDITORIAL_EXERCISE_LINKS
    .filter((link) => link.id !== "risk")
    .map((link) => [link.id, link.canonicalOptionId])),
  currentIndex: 8,
  view: "exercise",
};

export const CompleteFromMiddle: Story = {
  args: { state: almostCompleteState },
  parameters: {
    docs: {
      description: {
        story:
          "Защитная проверка состояния старой вкладки: выбран поздний шаг при пропуске четвёртого вопроса. Показывается первый пропуск; поздние ответы сохранены. После ответа текущий вопрос не меняется автоматически, а сверка становится доступна. Такой разрыв не создаётся обычным последовательным прохождением.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expectUnlockedSteps(canvasElement, 4);
    await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[3].question);
    await expect(canvas.queryByRole("button", { name: "Перейти к сверке" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("radio", { name: items[3].description }));
    await expectUnlockedSteps(canvasElement, 9);
    await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[3].question);
    await expect(canvas.getByRole("radio", { name: items[3].description })).toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Перейти к сверке" })).toHaveFocus();
    await userEvent.keyboard("[Enter]");
    const reviewList = canvas.getByRole("list", { name: "Сверка девяти звеньев" });
    await expect(reviewList).toHaveFocus();
    await expect(drawsVisibleOutline(reviewList)).toBe(false);
    await expect(canvas.queryAllByRole("heading", { level: 4, name: "Ваш выбор" })).toHaveLength(0);
    await expectReviewContent(canvasElement, canonicalAnswers);
    await expectNoFeedback(canvasElement);
    await userEvent.tab();
    const editButton = canvas.getByRole("button", { name: "Изменить ответы" });
    await expect(editButton).toHaveFocus();
    await expect(drawsVisibleOutline(editButton)).toBe(true);
    await userEvent.keyboard("[Enter]");
    await expect(canvas.getByRole("group")).toHaveTextContent(EDITORIAL_EXERCISE_LINKS[0].question);
    await expectAnsweredStepCount(canvasElement, 9);
    await expectUnlockedSteps(canvasElement, 9);
    await expect(canvas.getByRole("radio", { name: items[0].description })).toBeChecked();
    await expect(canvas.queryByRole("button", { name: "Начать заново" })).not.toBeInTheDocument();
  },
};

const mixedReviewState: EditorialExerciseState = {
  answers: Object.fromEntries(EDITORIAL_EXERCISE_LINKS.map((link, index) => [
    link.id,
    [1, 5, 8].includes(index)
      ? link.options.find((option) => option.id !== link.canonicalOptionId)!.id
      : link.canonicalOptionId,
  ])),
  currentIndex: 8,
  view: "review",
};

export const MixedReview: Story = {
  args: { state: mixedReviewState },
  parameters: {
    docs: {
      description: {
        story:
          "Шесть совпадений показаны одним полным абзацем, три расхождения — парой «Ваш выбор / В разборе». Пояснение есть только у выбранного неверного варианта.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expectReviewContent(canvasElement, mixedReviewState.answers);
    await userEvent.click(canvas.getByRole("button", { name: "Изменить ответы" }));
    await expect(canvas.getByRole("group")).toHaveAccessibleName(EDITORIAL_EXERCISE_LINKS[1].question);
    await expect(canvas.getByRole("radio", { name: EDITORIAL_EXERCISE_LINKS[1].options[0].text! })).toBeChecked();
    await expectAnsweredStepCount(canvasElement, 9);
    await userEvent.click(canvas.getByRole("button", { name: "Перейти к сверке" }));
    await expectReviewContent(canvasElement, mixedReviewState.answers);
  },
};
