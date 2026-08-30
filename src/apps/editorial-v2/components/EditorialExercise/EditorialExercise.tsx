import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useId,
  useRef,
} from "react";
import {
  ANALYSIS_LABELS,
  type AnalysisItem,
} from "../../../../content/sectionContract";
import {
  EDITORIAL_EXERCISE_LINK_IDS,
  type EditorialExerciseLink,
  type EditorialExerciseState,
} from "../../model/editorialExercise";
import styles from "./EditorialExercise.module.css";

export interface EditorialExerciseController {
  state: EditorialExerciseState;
  onStateChange: Dispatch<SetStateAction<EditorialExerciseState>>;
}

export interface EditorialExerciseProps extends EditorialExerciseController {
  items: readonly AnalysisItem[];
  links: readonly EditorialExerciseLink[];
}

function assertAnalysisItems(
  items: readonly AnalysisItem[],
  links: readonly EditorialExerciseLink[],
) {
  if (
    items.length !== ANALYSIS_LABELS.length ||
    items.some((item, index) => item.label !== ANALYSIS_LABELS[index]) ||
    links.length !== ANALYSIS_LABELS.length ||
    links.some((link, index) =>
      link.label !== ANALYSIS_LABELS[index] || link.id !== EDITORIAL_EXERCISE_LINK_IDS[index],
    )
  ) {
    throw new Error(
      "EditorialExercise принимает ровно девять звеньев в каноническом порядке.",
    );
  }
}

function centerActiveStep(
  rail: HTMLElement | null,
  step: HTMLElement | null,
  behavior: ScrollBehavior,
) {
  if (!rail || !step || rail.scrollWidth <= rail.clientWidth + 1) return;
  const railBounds = rail.getBoundingClientRect();
  const stepBounds = step.getBoundingClientRect();
  const left = rail.scrollLeft + stepBounds.left - railBounds.left
    - (rail.clientWidth - stepBounds.width) / 2;
  rail.scrollTo({
    left: Math.max(0, Math.min(left, rail.scrollWidth - rail.clientWidth)),
    behavior,
  });
}

export function EditorialExercise({
  items,
  links,
  state,
  onStateChange,
}: EditorialExerciseProps) {
  assertAnalysisItems(items, links);

  const id = useId();
  const questionRef = useRef<HTMLLegendElement>(null);
  const viewHeadingRef = useRef<HTMLHeadingElement>(null);
  const reviewRef = useRef<HTMLOListElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const activeStepRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef(false);
  const answeredSteps = links.map((link) =>
    link.options.some((option) => option.id === state.answers[link.id]),
  );
  const answeredCount = answeredSteps.filter(Boolean).length;
  const complete = answeredCount === links.length;
  const firstUnanswered = answeredSteps.indexOf(false);
  const lastAccessibleIndex = complete ? links.length - 1 : firstUnanswered;
  // A tab left open before sequential navigation may contain a later question
  // with earlier gaps. Show the first gap without discarding existing answers.
  const currentIndex = Math.min(state.currentIndex, lastAccessibleIndex);
  const currentLink = links[currentIndex];
  const selectedOptionId = state.answers[currentLink.id];
  const isLast = currentIndex === links.length - 1;
  const questionId = `${id}-question`;
  const titleId = `${id}-title`;

  // The shell owns route-entry focus. Only explicit actions in this component
  // move focus, so returning from the story does not skip its accepted header.
  useEffect(() => {
    const shouldFocus = pendingFocus.current;
    pendingFocus.current = false;
    if (state.view === "exercise") {
      if (shouldFocus) focusCurrentQuestion();
      else centerActiveStep(railRef.current, activeStepRef.current, "auto");
    } else if (shouldFocus) {
      const viewStart = state.view === "review" ? reviewRef.current : viewHeadingRef.current;
      viewStart?.focus({ preventScroll: true });
      viewStart?.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }, [currentIndex, state.view]);

  useEffect(() => {
    const rail = railRef.current;
    if (state.view !== "exercise" || !rail) return;

    // Ignore the initial observer delivery: it must not interrupt a smooth
    // transition. Resizing only moves the rail, never the page or focus.
    let previousWidth = rail.clientWidth;
    const observer = new ResizeObserver(() => {
      if (rail.clientWidth === previousWidth) return;
      previousWidth = rail.clientWidth;
      centerActiveStep(rail, activeStepRef.current, "auto");
    });
    observer.observe(rail);
    return () => observer.disconnect();
  }, [state.view]);

  function focusCurrentQuestion() {
    const rail = railRef.current;
    const hasHorizontalRail = rail && rail.scrollWidth > rail.clientWidth + 1;
    const behavior = hasHorizontalRail
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "smooth" : "auto";
    questionRef.current?.focus({ preventScroll: true });
    (hasHorizontalRail ? rail : panelRef.current)?.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior,
    });
    centerActiveStep(rail, activeStepRef.current, behavior);
  }

  function openStep(index: number) {
    if (index < 0 || index > lastAccessibleIndex) return;
    if (index === currentIndex && state.view === "exercise") {
      focusCurrentQuestion();
      return;
    }
    pendingFocus.current = true;
    onStateChange((previous) => ({ ...previous, currentIndex: index, view: "exercise" }));
  }

  function openView(view: EditorialExerciseState["view"]) {
    pendingFocus.current = true;
    onStateChange((previous) => ({ ...previous, view }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (complete) openView("review");
  }

  function editAnswers() {
    const firstMismatch = links.findIndex(
      (link) => state.answers[link.id] !== link.canonicalOptionId,
    );
    openStep(firstMismatch < 0 ? 0 : firstMismatch);
  }

  if (state.view !== "exercise") {
    const isReview = state.view === "review";
    return (
      <section
        aria-label={isReview ? "Сверка цепочки решения" : undefined}
        aria-labelledby={isReview ? undefined : titleId}
        className={styles.root}
      >
        {!isReview ? (
          <header className={styles.intro}>
            <h2 id={titleId} ref={viewHeadingRef} tabIndex={-1}>Полный разбор</h2>
            <button
              className={styles.textButton}
              onClick={() => openView("exercise")}
              type="button"
            >
              Вернуться к упражнению
            </button>
          </header>
        ) : null}

        <ol
          aria-label={isReview ? "Сверка девяти звеньев" : "Полная цепочка решения"}
          className={styles.fullList}
          ref={isReview ? reviewRef : undefined}
          tabIndex={isReview ? -1 : undefined}
        >
          {links.map((link, index) => {
            const selected = link.options.find((option) => option.id === state.answers[link.id]);
            const matches = selected?.id === link.canonicalOptionId;
            return (
              <li key={link.id}>
                <div className={styles.linkHeading}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{link.label}</h3>
                </div>
                <div className={styles.linkBody}>
                  {isReview && !matches ? (
                    <div className={styles.comparison}>
                      <div>
                        <h4>Ваш выбор</h4>
                        <p>{selected?.text ?? items[index].description}</p>
                      </div>
                      <div>
                        <h4>В разборе</h4>
                        <p>{items[index].description}</p>
                      </div>
                    </div>
                  ) : <p className={styles.fullText}>{items[index].description}</p>}
                  {isReview && !matches && selected?.feedback ? (
                    <p className={styles.explanation}>{selected.feedback}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div className={styles.fullActions}>
          <button
            className={styles.primaryButton}
            onClick={isReview ? editAnswers : () => openView("exercise")}
            type="button"
          >
            {isReview ? "Изменить ответы" : "Вернуться к упражнению"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Упражнение: цепочка решения" className={styles.root}>
      <form className={styles.workspace} onSubmit={submit}>
        <nav aria-label="Звенья цепочки" className={styles.rail} ref={railRef}>
          <ol>
            {links.map((link, index) => {
              const isCurrent = index === currentIndex;
              const isFilled = answeredSteps[index];
              return (
                <li key={link.id}>
                  <button
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`${index + 1}. ${link.label}. Ответ ${isFilled ? "выбран" : "не выбран"}.`}
                    data-current={isCurrent || undefined}
                    data-filled={isFilled || undefined}
                    disabled={index > lastAccessibleIndex}
                    onClick={() => openStep(index)}
                    ref={isCurrent ? activeStepRef : undefined}
                    type="button"
                  >
                    <span aria-hidden="true" className={styles.railNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.railCopy}>
                      <strong>{link.label}</strong>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <section aria-labelledby={questionId} className={styles.panel} ref={panelRef}>
          <fieldset className={styles.fieldset}>
            <legend id={questionId} ref={questionRef} tabIndex={-1}>
              <span className={styles.question}>{currentLink.question}</span>
            </legend>
            <div className={styles.answers}>
              {currentLink.options.map((option) => (
                <label data-selected={selectedOptionId === option.id || undefined} key={option.id}>
                  <input
                    checked={selectedOptionId === option.id}
                    name={`${id}-${currentLink.id}`}
                    onChange={() => onStateChange((previous) => ({
                      ...previous,
                      currentIndex,
                      answers: { ...previous.answers, [currentLink.id]: option.id },
                    }))}
                    type="radio"
                    value={option.id}
                  />
                  <span>{option.text ?? items[currentIndex].description}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className={styles.stepActions}>
            {complete && !isLast ? (
              <button className={`${styles.primaryButton} ${styles.reviewAction}`} type="submit">
                Перейти к сверке
              </button>
            ) : null}
            <button
              className={styles.secondaryButton}
              disabled={currentIndex === 0}
              onClick={() => openStep(currentIndex - 1)}
              type="button"
            >Предыдущее</button>
            {!isLast ? (
              <button
                className={styles.primaryButton}
                disabled={currentIndex >= lastAccessibleIndex}
                onClick={() => openStep(currentIndex + 1)}
                type="button"
              >Следующее</button>
            ) : (
              <button className={styles.primaryButton} disabled={!complete} type="submit">
                Перейти к сверке
              </button>
            )}
          </div>
        </section>
      </form>
      <button
        className={`${styles.textButton} ${styles.readAction}`}
        onClick={() => openView("read")}
        type="button"
      >
        Прочитать разбор без упражнения
      </button>
    </section>
  );
}
