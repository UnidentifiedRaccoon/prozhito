import type { AnalysisLabel } from "../../../content/sectionContract";

// L01-S01 only. Adapted from experiments/exerciseLabContent.ts and the accepted
// stepper in ExerciseLabScreen.tsx; decision/provenance: harness/tasks/
// 2026-08-30-editorial-v2-l01-s01-exercise.md. No runtime dependency on lab UI.
// Option-specific feedback: harness/tasks/2026-08-30-editorial-option-feedback.md.
export const EDITORIAL_EXERCISE_LINK_IDS = [
  "situation",
  "emotion",
  "impulse",
  "risk",
  "pause",
  "awareness",
  "tool",
  "mature-action",
  "observed-result",
] as const;

export type EditorialExerciseLinkId =
  (typeof EDITORIAL_EXERCISE_LINK_IDS)[number];

export interface EditorialExerciseState {
  answers: Partial<Record<EditorialExerciseLinkId, string>>;
  currentIndex: number;
  view: "exercise" | "review" | "read";
}

export function createEditorialExerciseState(): EditorialExerciseState {
  return { answers: {}, currentIndex: 0, view: "exercise" };
}

type EditorialExerciseOption =
  | {
    id: string;
    // The correct paragraph is supplied unchanged by the Markdown content source.
    text: null;
    feedback?: never;
  }
  | {
    id: string;
    text: string;
    feedback: string;
  };

export interface EditorialExerciseLink {
  id: EditorialExerciseLinkId;
  label: AnalysisLabel;
  question: string;
  canonicalOptionId: string;
  options: readonly [
    EditorialExerciseOption,
    EditorialExerciseOption,
    EditorialExerciseOption,
  ];
}

export const EDITORIAL_EXERCISE_LINKS: readonly EditorialExerciseLink[] = [
  {
    id: "situation",
    label: "Ситуация",
    question: "Какая ситуация сложилась у Саши?",
    canonicalOptionId: "situation-canonical",
    options: [
      {
        id: "situation-same-day",
        text: "Саше нужно внести плату за комнату в день первой полной зарплаты. Все видимые ресурсы уже доступны, но находятся в разных местах.",
        feedback:
          "В исходной ситуации срок оплаты на два дня раньше зарплаты. Ожидаемая компенсация ещё недоступна, а транспортный баланс не подходит для платы за комнату.",
      },
      { id: "situation-canonical", text: null },
      {
        id: "situation-after-salary",
        text: "Саше нужно внести плату за комнату после первой полной зарплаты. Неясно только, когда придёт компенсация.",
        feedback:
          "Плата за комнату нужна за два дня до зарплаты, а не после неё. Компенсация тоже не успевает к исходному сроку оплаты.",
      },
    ],
  },
  {
    id: "emotion",
    label: "Эмоция",
    question: "Через какую эмоцию разбор рассматривает ситуацию Саши?",
    canonicalOptionId: "emotion-canonical",
    options: [
      {
        id: "emotion-irritation",
        text: "Раздражение: Тамара неожиданно переносит дату оплаты на более ранний срок.",
        feedback:
          "Тамара напоминает исходный срок, а не переносит его на более ранний. Разбор рассматривает ситуацию через растерянность из-за нескольких сроков и форм денег.",
      },
      {
        id: "emotion-relief",
        text: "Облегчение: ожидаемая компенсация снимает конфликт между датами.",
        feedback:
          "Компенсация не успевает к исходному сроку оплаты комнаты, поэтому не снимает конфликт дат. Разбор связывает растерянность именно с наложением сроков и ресурсов.",
      },
      { id: "emotion-canonical", text: null },
    ],
  },
  {
    id: "impulse",
    label: "Импульс",
    question: "Какой возможный импульс выделяет разбор?",
    canonicalOptionId: "impulse-canonical",
    options: [
      { id: "impulse-canonical", text: null },
      {
        id: "impulse-account-only",
        text: "Учитывать только деньги на счёте и полностью исключить наличные.",
        feedback:
          "Наличные в истории названы среди ресурсов Саши. Возможный импульс в разборе — переоценить общую видимую сумму, а не исключить из неё наличные.",
      },
      {
        id: "impulse-give-up",
        text: "Сразу решить, что заплатить к сроку невозможно, и не обсуждать дату с Тамарой.",
        feedback:
          "В истории Саша обращается к Тамаре, а не отказывается обсуждать дату. Возможный импульс в разборе связан с переоценкой ресурсов, а не с выводом, что заплатить невозможно.",
      },
    ],
  },
  {
    id: "risk",
    label: "Риск",
    question: "Какой риск выделен в разборе этой истории?",
    canonicalOptionId: "risk-canonical",
    options: [
      {
        id: "risk-opposite",
        text: "Решить, что заплатить к сроку невозможно, не сопоставив доступные ресурсы.",
        feedback:
          "В этом варианте сделан вывод о невозможности платежа до сравнения ресурсов. Разбор рассматривает обратную ошибку — считать недоступный или неподходящий ресурс уже пригодным для оплаты.",
      },
      { id: "risk-canonical", text: null },
      {
        id: "risk-next-section",
        text: "Пропустить окончание пробной подписки, пока сравниваются ресурсы для платы за комнату.",
        feedback:
          "Подписка упомянута среди напоминаний, но не входит в причинную цепочку этого платежа. Здесь разбирается доступность ресурсов для платы за комнату к нужной дате.",
      },
    ],
  },
  {
    id: "pause",
    label: "Пауза",
    question: "Что является паузой в этой истории?",
    canonicalOptionId: "pause-canonical",
    options: [
      {
        id: "pause-wait-salary",
        text: "Саша ждёт дня зарплаты и только затем сопоставляет даты и обращается к Тамаре.",
        feedback:
          "Саша сопоставляет даты и обращается к Тамаре в тот же вечер, до дня зарплаты. Пауза в разборе — проверка сроков, а не ожидание поступления денег.",
      },
      {
        id: "pause-assume-change",
        text: "После отправки просьбы Саша сразу заменяет исходную дату в календаре на новую.",
        feedback:
          "Саша фиксирует новую дату после согласия Тамары. В этом эпизоде отправленная просьба ещё не означает согласованного переноса.",
      },
      { id: "pause-canonical", text: null },
    ],
  },
  {
    id: "awareness",
    label: "Осознание",
    question: "Какое различие помогает разобрать эту ситуацию?",
    canonicalOptionId: "awareness-canonical",
    options: [
      { id: "awareness-canonical", text: null },
      {
        id: "awareness-total-only",
        text: "Если общей суммы достаточно, дата доступности и способ оплаты уже не имеют значения.",
        feedback:
          "В этой истории компенсация не успевает к сроку, а транспортным балансом нельзя оплатить комнату. Поэтому одна общая сумма не показывает, какими ресурсами можно выполнить этот платёж.",
      },
      {
        id: "awareness-date-only",
        text: "Для платы за комнату важна только дата; форму и пригодность ресурса можно не учитывать.",
        feedback:
          "На транспортной карте у Саши остаются деньги, которыми в этой истории нельзя оплатить комнату. Одной даты недостаточно: разбор учитывает и форму, и пригодность ресурса для этого платежа.",
      },
    ],
  },
  {
    id: "tool",
    label: "Инструмент",
    question: "Какие инструменты Саша действительно использует?",
    canonicalOptionId: "tool-canonical",
    options: [
      {
        id: "tool-self-change",
        text: "Календарь для самостоятельного переноса срока и день зарплаты для подтверждения новой даты.",
        feedback:
          "В истории календарь нужен для сопоставления дат, а новая дата подтверждена ответом Тамары в переписке. Самостоятельная отметка или наступление дня зарплаты не показаны как подтверждение переноса.",
      },
      { id: "tool-canonical", text: null },
      {
        id: "tool-transport-card",
        text: "Транспортная карта для оплаты комнаты и устная просьба Тамаре при следующей встрече.",
        feedback:
          "В этом кейсе деньгами на транспортной карте нельзя оплатить комнату. Новая дата зафиксирована в переписке; следующая личная встреча в этом фрагменте не показана.",
      },
    ],
  },
  {
    id: "mature-action",
    label: "Зрелое действие",
    question: "Какое действие показано в истории Саши?",
    canonicalOptionId: "mature-action-canonical",
    options: [
      {
        id: "mature-action-assume",
        text: "До срока Саша просит о переносе и сразу считает новую дату установленной, не дожидаясь ответа.",
        feedback:
          "Саша фиксирует новую дату только после явного согласия Тамары, а не сразу после отправки просьбы.",
      },
      {
        id: "mature-action-after",
        text: "Саша ждёт дня зарплаты, затем просит перенести оплату и фиксирует дату после согласия.",
        feedback:
          "Саша просит о переносе в тот же вечер, до исходного срока оплаты. Она не ждёт дня зарплаты, чтобы обратиться к Тамаре.",
      },
      { id: "mature-action-canonical", text: null },
    ],
  },
  {
    id: "observed-result",
    label: "Наблюдаемый результат",
    question: "Что прямо показано после действия Саши?",
    canonicalOptionId: "observed-result-canonical",
    options: [
      { id: "observed-result-canonical", text: null },
      {
        id: "observed-result-payment",
        text: "Саша внесла плату за комнату в согласованную новую дату.",
        feedback:
          "История заканчивается на согласовании и фиксации даты. Внесение платы за комнату в этом фрагменте не показано.",
      },
      {
        id: "observed-result-compensation",
        text: "Саша получила компенсацию до оплаты комнаты и использовала её для платежа.",
        feedback:
          "В истории сказано, что компенсация не успевает к исходному сроку оплаты. Её получение и использование для платежа в этом фрагменте не показаны.",
      },
    ],
  },
];
