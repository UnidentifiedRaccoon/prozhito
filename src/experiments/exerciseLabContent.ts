export const EXERCISE_LAB_VARIANT_IDS = [
  "path",
  "sheets",
  "editorial",
] as const;

export type ExerciseLabVariantId =
  (typeof EXERCISE_LAB_VARIANT_IDS)[number];

export interface ExerciseLabVariant {
  id: ExerciseLabVariantId;
  number: string;
  title: string;
  summary: string;
  councilNote: string;
}

export const DEFAULT_EXERCISE_LAB_VARIANT: ExerciseLabVariantId = "path";

export const EXERCISE_LAB_VARIANTS: readonly ExerciseLabVariant[] = [
  {
    id: "path",
    number: "01",
    title: "Путь",
    summary: "Ромбы, линия и открытая бумага экрана «Решение».",
    councilNote:
      "Ближайшая рифма с экраном цепочки: та же ось, те же маркеры и спокойное поле чтения.",
  },
  {
    id: "sheets",
    number: "02",
    title: "Листы",
    summary: "Шаги и ответы собраны как архивные листы.",
    councilNote:
      "Бумажные поверхности делают текущий шаг материальнее, не меняя последовательность упражнения.",
  },
  {
    id: "editorial",
    number: "03",
    title: "Полоса",
    summary: "Типографика, нумерация и редакционные линейки.",
    councilNote:
      "Самая сдержанная версия: связь с цепочкой сохраняют цветные метки, остальное держит типографика.",
  },
];

export function isExerciseLabVariantId(
  value: string,
): value is ExerciseLabVariantId {
  return EXERCISE_LAB_VARIANT_IDS.includes(
    value.toLowerCase() as ExerciseLabVariantId,
  );
}

export const EXERCISE_LAB_SECTION = {
  id: "L01-S01",
  title: "Деньги к нужной дате",
} as const;

export const CHAIN_LINK_IDS = [
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

export type ChainLinkId = (typeof CHAIN_LINK_IDS)[number];

export type ChainAnswers = Partial<Record<ChainLinkId, string>>;

export interface ChainOption {
  id: string;
  text: string | null;
}

export interface ChainLink {
  id: ChainLinkId;
  number: string;
  label: string;
  question: string;
  canonicalOptionId: string;
  options: readonly [ChainOption, ChainOption, ChainOption];
  review: string;
  methodNote?: string;
}

export const CHAIN_LINKS: readonly ChainLink[] = [
  {
    id: "situation",
    number: "01",
    label: "Ситуация",
    question: "Какая ситуация зафиксирована в каноническом разборе?",
    canonicalOptionId: "situation-canonical",
    options: [
      {
        id: "situation-same-day",
        text: "Саше нужно внести плату за комнату в день первой полной зарплаты. Все видимые ресурсы уже доступны, но находятся в разных местах.",
      },
      {
        id: "situation-canonical",
        text: null,
      },
      {
        id: "situation-after-salary",
        text: "Саше нужно внести плату за комнату после первой полной зарплаты. Неясно только, когда придёт компенсация.",
      },
    ],
    review:
      "В истории плата нужна на два дня раньше зарплаты; компенсация не успевает, а транспортный баланс не подходит для этого платежа.",
  },
  {
    id: "emotion",
    number: "02",
    label: "Эмоция",
    question: "Какую эмоциональную линзу задаёт канонический разбор?",
    canonicalOptionId: "emotion-canonical",
    options: [
      {
        id: "emotion-irritation",
        text: "Раздражение: Тамара неожиданно переносит дату оплаты на более ранний срок.",
      },
      {
        id: "emotion-relief",
        text: "Облегчение: ожидаемая компенсация снимает конфликт между датами.",
      },
      {
        id: "emotion-canonical",
        text: null,
      },
    ],
    review:
      "Канон выбирает растерянность из-за наложения сроков и ресурсов. Тамара не меняла исходную дату, а компенсация не успевала к ней.",
    methodNote:
      "Это методическая линза разбора, а не дословно названная Сашей эмоция.",
  },
  {
    id: "impulse",
    number: "03",
    label: "Импульс",
    question: "Какой импульс выбран для канонического разбора?",
    canonicalOptionId: "impulse-canonical",
    options: [
      {
        id: "impulse-canonical",
        text: null,
      },
      {
        id: "impulse-account-only",
        text: "Учитывать только деньги на счёте и полностью исключить наличные.",
      },
      {
        id: "impulse-give-up",
        text: "Сразу решить, что заплатить к сроку невозможно, и не обсуждать дату с Тамарой.",
      },
    ],
    review:
      "Разбор фиксирует импульс переоценить общую видимую сумму. Исключение наличных и вывод о невозможности платежа в истории не показаны.",
    methodNote:
      "Это причинная гипотеза канонического разбора, а не дословно показанная мысль Саши.",
  },
  {
    id: "risk",
    number: "04",
    label: "Риск",
    question: "Какой риск прямо следует из этого импульса?",
    canonicalOptionId: "risk-canonical",
    options: [
      {
        id: "risk-opposite",
        text: "Решить, что заплатить к сроку невозможно, не сопоставив доступные ресурсы.",
      },
      {
        id: "risk-canonical",
        text: null,
      },
      {
        id: "risk-next-section",
        text: "Пропустить окончание пробной подписки, пока сравниваются ресурсы для платы за комнату.",
      },
    ],
    review:
      "Здесь проверяется переоценка доступности ресурса. Первый дистрактор описывает противоположную ошибку, второй относится к следующей Section.",
  },
  {
    id: "pause",
    number: "05",
    label: "Пауза",
    question: "Что является паузой в этой истории?",
    canonicalOptionId: "pause-canonical",
    options: [
      {
        id: "pause-wait-salary",
        text: "Саша ждёт дня зарплаты и только затем сопоставляет даты и обращается к Тамаре.",
      },
      {
        id: "pause-assume-change",
        text: "После отправки просьбы Саша сразу заменяет исходную дату в календаре на новую.",
      },
      {
        id: "pause-canonical",
        text: null,
      },
    ],
    review:
      "Саша сравнивает даты заранее и ждёт ответа. Она не откладывает обращение до зарплаты и не подменяет просьбу согласием.",
  },
  {
    id: "awareness",
    number: "06",
    label: "Осознание",
    question: "Какое различие формулирует канонический разбор?",
    canonicalOptionId: "awareness-canonical",
    options: [
      {
        id: "awareness-canonical",
        text: null,
      },
      {
        id: "awareness-total-only",
        text: "Если общей суммы достаточно, дата доступности и способ оплаты уже не имеют значения.",
      },
      {
        id: "awareness-date-only",
        text: "Для платы за комнату важна только дата; форму и пригодность ресурса можно не учитывать.",
      },
    ],
    review:
      "Канон удерживает сразу три признака: дату, форму и пригодность. Оба дистрактора убирают часть этой причинности.",
  },
  {
    id: "tool",
    number: "07",
    label: "Инструмент",
    question: "Какие инструменты Саша действительно использует?",
    canonicalOptionId: "tool-canonical",
    options: [
      {
        id: "tool-self-change",
        text: "Календарь для самостоятельного переноса срока и день зарплаты для подтверждения новой даты.",
      },
      {
        id: "tool-canonical",
        text: null,
      },
      {
        id: "tool-transport-card",
        text: "Транспортная карта для оплаты комнаты и устная просьба Тамаре при следующей встрече.",
      },
    ],
    review:
      "Календарь помогает сравнить даты, а ответ Тамары фиксируется в переписке. Личная отметка не заменяет ответ, а транспортной картой заплатить за комнату нельзя.",
  },
  {
    id: "mature-action",
    number: "08",
    label: "Зрелое действие",
    question: "Какое действие обосновано причинностью этой истории?",
    canonicalOptionId: "mature-action-canonical",
    options: [
      {
        id: "mature-action-assume",
        text: "До срока Саша просит о переносе и сразу считает новую дату установленной, не дожидаясь ответа.",
      },
      {
        id: "mature-action-after",
        text: "Саша ждёт дня зарплаты, затем просит перенести оплату и фиксирует дату после согласия.",
      },
      {
        id: "mature-action-canonical",
        text: null,
      },
    ],
    review:
      "Канонический ход удерживает обе границы: обращение происходит до исходного срока, новая дата фиксируется после согласия Тамары.",
  },
  {
    id: "observed-result",
    number: "09",
    label: "Наблюдаемый результат",
    question: "Что прямо показано после действия Саши?",
    canonicalOptionId: "observed-result-canonical",
    options: [
      {
        id: "observed-result-canonical",
        text: null,
      },
      {
        id: "observed-result-payment",
        text: "Саша внесла плату за комнату в согласованную новую дату.",
      },
      {
        id: "observed-result-compensation",
        text: "Саша получила компенсацию до оплаты комнаты и использовала её для платежа.",
      },
    ],
    review:
      "История заканчивается на согласовании и фиксации даты. Ни платёж, ни получение и использование компенсации не показаны.",
  },
] as const;
