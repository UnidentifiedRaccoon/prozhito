import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/ui/Button/Button";
import { Heading } from "../components/ui/Heading/Heading";
import { Text } from "../components/ui/Text/Text";
import type { ParsedSection } from "../content/sectionContract";
import {
  CHAIN_LINKS,
  EXERCISE_LAB_SECTION,
  EXERCISE_LAB_VARIANTS,
  type ChainAnswers,
  type ChainLink,
  type ChainLinkId,
  type ExerciseLabVariantId,
} from "../experiments/exerciseLabContent";
import { exerciseLabHref, storyHref } from "../router";
import styles from "./ExerciseLabScreen.module.css";

interface ExerciseLabScreenProps {
  section: ParsedSection;
  variantId: ExerciseLabVariantId;
}

interface ExerciseProps {
  answers: ChainAnswers;
  canonicalDescriptions: readonly string[];
  onAnswerChange: (linkId: ChainLinkId, optionId?: string) => void;
  onSubmit: () => void;
}

interface StepperExerciseProps extends ExerciseProps {
  designId: ExerciseLabVariantId;
  focusOnMount?: boolean;
}

type LabStage = "exercise" | "review";

function getCanonicalDescription(
  link: ChainLink,
  canonicalDescriptions: readonly string[],
) {
  const linkIndex = CHAIN_LINKS.findIndex(({ id }) => id === link.id);
  return canonicalDescriptions[linkIndex] ?? "";
}

function getLinkOptionText(
  link: ChainLink,
  optionId: string,
  canonicalDescriptions: readonly string[],
) {
  const option = link.options.find(({ id }) => id === optionId);

  if (!option) {
    return "";
  }

  return option.text ?? getCanonicalDescription(link, canonicalDescriptions);
}

function getAnsweredCount(answers: ChainAnswers) {
  return CHAIN_LINKS.filter(({ id }) => Boolean(answers[id])).length;
}

function isChainComplete(answers: ChainAnswers) {
  return getAnsweredCount(answers) === CHAIN_LINKS.length;
}

function ArrowIcon({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg aria-hidden="true" className={styles.arrowIcon} viewBox="0 0 20 20">
      <path
        d={direction === "back" ? "m12.5 4.5-5 5 5 5" : "m7.5 4.5 5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function AnswerProgress({ answers }: { answers: ChainAnswers }) {
  return (
    <span
      aria-atomic="true"
      aria-live="polite"
      className={styles.answerProgress}
    >
      Заполнено {getAnsweredCount(answers)} из {CHAIN_LINKS.length}
    </span>
  );
}

function StepperExercise({
  answers,
  canonicalDescriptions,
  designId,
  focusOnMount = false,
  onAnswerChange,
  onSubmit,
}: StepperExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstUnanswered = CHAIN_LINKS.findIndex(({ id }) => !answers[id]);

    if (firstUnanswered >= 0) {
      return firstUnanswered;
    }

    const firstMismatch = CHAIN_LINKS.findIndex(
      (link) => answers[link.id] !== link.canonicalOptionId,
    );
    return firstMismatch >= 0 ? firstMismatch : 0;
  });
  const currentStepButtonRef = useRef<HTMLButtonElement>(null);
  const currentQuestionRef = useRef<HTMLLegendElement>(null);
  const pendingStepFocus = useRef(focusOnMount);
  const currentLink = CHAIN_LINKS[currentIndex];
  const selectedOptionId = answers[currentLink.id] ?? "";
  const isLastLink = currentIndex === CHAIN_LINKS.length - 1;
  const complete = isChainComplete(answers);
  const remainingCount = CHAIN_LINKS.length - getAnsweredCount(answers);

  useEffect(() => {
    if (!pendingStepFocus.current) {
      return;
    }

    pendingStepFocus.current = false;
    currentStepButtonRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
    currentQuestionRef.current?.focus({ preventScroll: true });
  }, [currentIndex]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (complete) {
      onSubmit();
    }
  }

  function openStep(index: number) {
    const nextIndex = Math.max(0, Math.min(index, CHAIN_LINKS.length - 1));

    if (nextIndex === currentIndex) {
      return;
    }

    pendingStepFocus.current = true;
    setCurrentIndex(nextIndex);
  }

  function goForward() {
    if (!selectedOptionId) {
      return;
    }

    openStep(currentIndex + 1);
  }

  const remainingLabel =
    remainingCount === 1
      ? "звено"
      : remainingCount > 1 && remainingCount < 5
        ? "звена"
        : "звеньев";
  const linkLabelId = `stepper-label-${currentLink.id}`;
  const questionId = `stepper-question-${currentLink.id}`;
  const methodNoteId = currentLink.methodNote
    ? `stepper-note-${currentLink.id}`
    : undefined;
  const navigationHintId = `stepper-hint-${currentLink.id}`;

  return (
    <form
      className={styles.stepperLayout}
      data-design={designId}
      onSubmit={submit}
    >
      <nav aria-label="Звенья цепочки" className={styles.stepperRail}>
        <ol role="list">
          {CHAIN_LINKS.map((link, index) => {
            const isCurrent = index === currentIndex;
            const isFilled = Boolean(answers[link.id]);
            const state = isCurrent ? "current" : isFilled ? "filled" : "empty";
            const accessibleState = isCurrent
              ? `Сейчас. Ответ ${isFilled ? "выбран" : "не выбран"}.`
              : `Ответ ${isFilled ? "выбран" : "не выбран"}.`;

            return (
              <li data-state={state} key={link.id}>
                <button
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Звено ${index + 1} из ${CHAIN_LINKS.length}: ${link.label}. ${accessibleState}`}
                  onClick={() => openStep(index)}
                  ref={isCurrent ? currentStepButtonRef : undefined}
                  type="button"
                >
                  <span aria-hidden="true" className={styles.railMarker} />
                  <span className={styles.railCopy}>
                    <span className={styles.railNumber}>{link.number}</span>
                    <strong>{link.label}</strong>
                    <small>
                      {isCurrent
                        ? "Сейчас"
                        : isFilled
                          ? "Выбрано"
                          : "Не заполнено"}
                    </small>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section
        aria-labelledby={`${linkLabelId} ${questionId}`}
        className={styles.stepperPanel}
      >
        <div className={styles.currentLinkHeader}>
          <p className={styles.currentLinkLabel} id={linkLabelId}>
            <span>{currentLink.number}</span>
            <strong>{currentLink.label}</strong>
          </p>
          <AnswerProgress answers={answers} />
        </div>

        <span aria-hidden="true" className={styles.currentFraction}>
          {currentLink.number} / 09
        </span>

        <fieldset
          aria-describedby={
            methodNoteId
              ? `${methodNoteId} ${navigationHintId}`
              : navigationHintId
          }
          className={styles.choiceFieldset}
        >
          <legend id={questionId} ref={currentQuestionRef} tabIndex={-1}>
            {currentLink.question}
          </legend>
          {currentLink.methodNote ? (
            <Text
              as="small"
              className={styles.methodNote}
              id={methodNoteId}
              tone="muted"
            >
              {currentLink.methodNote}
            </Text>
          ) : null}
          <div className={styles.choiceList}>
            {currentLink.options.map((option, optionIndex) => (
              <label className={styles.choiceRow} key={option.id}>
                <span aria-hidden="true" className={styles.optionLetter}>
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <input
                  checked={selectedOptionId === option.id}
                  name={`stepper-${currentLink.id}`}
                  onChange={() => onAnswerChange(currentLink.id, option.id)}
                  type="radio"
                  value={option.id}
                />
                <span className={styles.choiceText}>
                  {option.text ??
                    getCanonicalDescription(currentLink, canonicalDescriptions)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className={styles.completionHint} id={navigationHintId}>
          {!selectedOptionId
            ? "Выберите вариант, чтобы перейти дальше."
            : complete
              ? "Все 9 звеньев заполнены. Можно перейти к сверке."
              : `Для сверки осталось заполнить ${remainingCount} ${remainingLabel}.`}
        </p>

        <div className={styles.stepperActions}>
          <Button
            disabled={currentIndex === 0}
            onClick={() => openStep(currentIndex - 1)}
            type="button"
            variant="ghost"
          >
            <ArrowIcon direction="back" />
            Предыдущее
          </Button>
          {isLastLink ? (
            <Button disabled={!complete} type="submit">
              Перейти к сверке
            </Button>
          ) : (
            <Button
              disabled={!selectedOptionId}
              onClick={goForward}
              type="button"
              variant="outline"
            >
              Следующее
              <ArrowIcon direction="forward" />
            </Button>
          )}
        </div>
      </section>
    </form>
  );
}

function ChainReview({
  answers,
  canonicalDescriptions,
  nextVariantHref,
  onEdit,
  onReset,
  sectionRef,
}: {
  answers: ChainAnswers;
  canonicalDescriptions: readonly string[];
  nextVariantHref: string;
  onEdit: () => void;
  onReset: () => void;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const mismatches = CHAIN_LINKS.filter(
    (link) => answers[link.id] !== link.canonicalOptionId,
  );

  return (
    <section
      aria-labelledby="chain-review-title"
      className={styles.reviewStage}
      ref={sectionRef}
      tabIndex={-1}
    >
      <div className={styles.reviewHeader}>
        <Heading as="h2" id="chain-review-title" variant="page">
          Сверка с разбором истории
        </Heading>
        <Text className={styles.reviewLead} variant="lead">
          {mismatches.length === 0
            ? "Все девять звеньев совпадают с разбором истории."
            : `Некоторые звенья отличаются от разбора истории: ${mismatches
                .map(({ label }) => label.toLowerCase())
                .join(", ")}. Сравните формулировки ниже.`}
        </Text>
        <Text tone="muted">
          Сверяются формулировки о действиях Саши — решения читателя здесь не
          оцениваются.
        </Text>
      </div>

      <ol className={styles.reviewList}>
        {CHAIN_LINKS.map((link) => {
          const selectedOptionId = answers[link.id] ?? "";
          const selectedText = getLinkOptionText(
            link,
            selectedOptionId,
            canonicalDescriptions,
          );
          const canonicalText = getCanonicalDescription(
            link,
            canonicalDescriptions,
          );
          const matches = selectedOptionId === link.canonicalOptionId;

          return (
            <li data-state={matches ? "match" : "revise"} key={link.id}>
              <div className={styles.reviewLinkTitle}>
                <span>{link.number}</span>
                <h3>{link.label}</h3>
                <strong>
                  {matches
                    ? "Совпадает с разбором"
                    : "Отличается от разбора"}
                </strong>
              </div>
              <div className={styles.comparisonGrid}>
                <div>
                  <Text as="span" tone="muted" variant="caption">
                    Ваш выбор
                  </Text>
                  <p>{selectedText}</p>
                </div>
                <div>
                  <Text as="span" tone="muted" variant="caption">
                    В разборе истории
                  </Text>
                  <p>{canonicalText}</p>
                </div>
              </div>
              <p className={styles.reviewExplanation}>{link.review}</p>
              {link.methodNote ? (
                <p className={styles.reviewMethodNote}>{link.methodNote}</p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <aside className={styles.resultBoundary}>
        <Text as="span" tone="muted" variant="caption">
          Граница результата
        </Text>
        <p>{canonicalDescriptions[CHAIN_LINKS.length - 1]}</p>
        <small>
          Согласие Тамары — событие этого вымышленного случая, а не
          универсальное правило для любого договора или ситуации.
        </small>
      </aside>

      <div className={styles.reviewActions}>
        <Button onClick={onEdit} type="button">
          Изменить ответы
        </Button>
        <Button href={nextVariantHref} variant="outline">
          Посмотреть следующий дизайн
        </Button>
        <Button onClick={onReset} type="button" variant="ghost">
          Очистить ответы
        </Button>
      </div>
    </section>
  );
}

function ScreenPath({ stage }: { stage: LabStage }) {
  return (
    <nav aria-label="Три экрана сценария" className={styles.screenPath}>
      <ol>
        <li data-state="complete">
          <a href={storyHref(EXERCISE_LAB_SECTION.id)}>
            <span aria-hidden="true">01</span>
            История
          </a>
        </li>
        <li
          aria-current={stage === "exercise" ? "step" : undefined}
          data-state={stage === "exercise" ? "current" : "complete"}
        >
          <span>
            <span aria-hidden="true">02</span>
            Упражнение
          </span>
        </li>
        <li
          aria-current={stage === "review" ? "step" : undefined}
          data-state={stage === "review" ? "current" : "upcoming"}
        >
          <span>
            <span aria-hidden="true">03</span>
            Сверка
          </span>
        </li>
      </ol>
    </nav>
  );
}

export function ExerciseLabScreen({
  section,
  variantId,
}: ExerciseLabScreenProps) {
  const [stage, setStage] = useState<LabStage>("exercise");
  const [answers, setAnswers] = useState<ChainAnswers>({});
  const [focusStepperOnMount, setFocusStepperOnMount] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const previousStage = useRef<LabStage>(stage);
  const canonicalDescriptions = section.analysisItems.map(
    ({ description }) => description,
  );
  const variant =
    EXERCISE_LAB_VARIANTS.find(({ id }) => id === variantId) ??
    EXERCISE_LAB_VARIANTS[0];
  const variantIndex = EXERCISE_LAB_VARIANTS.findIndex(
    ({ id }) => id === variant.id,
  );
  const nextVariant =
    EXERCISE_LAB_VARIANTS[(variantIndex + 1) % EXERCISE_LAB_VARIANTS.length];

  useEffect(() => {
    if (previousStage.current === stage) {
      return;
    }

    previousStage.current = stage;

    if (stage === "exercise" && focusStepperOnMount) {
      setFocusStepperOnMount(false);
      return;
    }

    stageRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    stageRef.current?.focus({ preventScroll: true });
  }, [focusStepperOnMount, stage]);

  function changeAnswer(linkId: ChainLinkId, optionId?: string) {
    setAnswers((current) => {
      const next = { ...current };

      if (optionId) {
        next[linkId] = optionId;
      } else {
        delete next[linkId];
      }

      return next;
    });
  }

  function resetExercise() {
    setAnswers({});
    setFocusStepperOnMount(true);
    setStage("exercise");
  }

  return (
    <AppShell
      className={styles.labPage}
      pageTitle={`${variant.title}: восстановление цепочки`}
      routeKey={`exercise-lab-${variant.id}`}
    >
      <header className={styles.labHeader}>
        <Heading as="h1" variant="page">
          Восстановите цепочку решения
        </Heading>
        <Text className={styles.labIntro} variant="lead">
          Выберите формулировку для каждого из девяти звеньев. Сверка откроется
          после заполнения всей цепочки.
        </Text>
        <Text className={styles.scopeNote} tone="muted">
          Ответы относятся к Саше и не сохраняются. Это отдельная лаборатория,
          не персональная рекомендация и не часть текущей программы.
        </Text>
      </header>

      <nav aria-label="Визуальные варианты" className={styles.variantNav}>
        {EXERCISE_LAB_VARIANTS.map((item) => (
          <a
            aria-current={item.id === variant.id ? "page" : undefined}
            href={exerciseLabHref(item.id)}
            key={item.id}
          >
            <span className={styles.variantNumber}>{item.number}</span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.summary}</small>
            </span>
          </a>
        ))}
      </nav>

      <ScreenPath stage={stage} />

      {stage === "exercise" ? (
        <section
          aria-labelledby="exercise-title"
          className={styles.exerciseStage}
          ref={stageRef}
          tabIndex={-1}
        >
          <div className={styles.exerciseHeading}>
            <div>
              <Text as="span" tone="muted" variant="caption">
                {EXERCISE_LAB_SECTION.id} · {EXERCISE_LAB_SECTION.title}
              </Text>
              <Heading as="h2" id="exercise-title" variant="section">
                Шаг за шагом
              </Heading>
              <Text className={styles.variantLead} tone="muted">
                Визуальный вариант «{variant.title}». {variant.summary}
              </Text>
            </div>
            <Text as="small" className={styles.councilNote} tone="accent">
              {variant.councilNote}
            </Text>
          </div>

          <StepperExercise
            answers={answers}
            canonicalDescriptions={canonicalDescriptions}
            designId={variant.id}
            focusOnMount={focusStepperOnMount}
            onAnswerChange={changeAnswer}
            onSubmit={() => setStage("review")}
          />
        </section>
      ) : (
        <ChainReview
          answers={answers}
          canonicalDescriptions={canonicalDescriptions}
          nextVariantHref={exerciseLabHref(nextVariant.id)}
          onEdit={() => {
            setFocusStepperOnMount(true);
            setStage("exercise");
          }}
          onReset={resetExercise}
          sectionRef={stageRef}
        />
      )}
    </AppShell>
  );
}
