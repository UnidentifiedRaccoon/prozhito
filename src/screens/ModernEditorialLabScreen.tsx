import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import editorialStoryArtwork from "../assets/modern-editorial-lab/l01-s01-story-editorial-v1.jpg";
import { AppShell } from "../components/AppShell";
import { MarkdownContent } from "../components/MarkdownContent";
import type { ParsedSection } from "../content/sectionContract";
import {
  CHAIN_LINKS,
  type ChainAnswers,
  type ChainLink,
  type ChainLinkId,
} from "../experiments/exerciseLabContent";
import {
  catalogHref,
  modernEditorialLabHref,
  type ModernEditorialLabViewId,
} from "../router";
import styles from "./ModernEditorialLabScreen.module.css";

interface ModernEditorialLabScreenProps {
  section: ParsedSection;
  view: ModernEditorialLabViewId;
}

interface SpecimenProps {
  section: ParsedSection;
}

const VIEW_ITEMS: ReadonlyArray<{
  id: ModernEditorialLabViewId;
  label: string;
  description: string;
}> = [
  { id: "story", label: "История", description: "Непрерывное чтение" },
  { id: "analysis", label: "Решение", description: "Девять звеньев" },
  { id: "exercise", label: "Упражнение", description: "Собрать цепочку" },
];

type ExerciseStage = "exercise" | "review";

function getAnsweredCount(answers: ChainAnswers) {
  return CHAIN_LINKS.filter(({ id }) => Boolean(answers[id])).length;
}

function getCanonicalDescription(
  link: ChainLink,
  canonicalDescriptions: readonly string[],
) {
  const linkIndex = CHAIN_LINKS.findIndex(({ id }) => id === link.id);
  return canonicalDescriptions[linkIndex] ?? "";
}

function getOptionText(
  link: ChainLink,
  optionId: string,
  canonicalDescriptions: readonly string[],
) {
  const option = link.options.find(({ id }) => id === optionId);
  return option?.text ?? getCanonicalDescription(link, canonicalDescriptions);
}

function Arrow({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg aria-hidden="true" className={styles.arrow} viewBox="0 0 20 20">
      <path
        d={direction === "back" ? "m12.5 4.5-5 5 5 5" : "m7.5 4.5 5 5-5 5"}
      />
    </svg>
  );
}

function LabHeader({ view }: { view: ModernEditorialLabViewId }) {
  return (
    <>
      <header className={styles.masthead}>
        <a className={styles.wordmark} href={catalogHref}>
          Прожито
        </a>
        <span className={styles.labLabel}>Лаборатория интерфейса</span>
      </header>
      <nav aria-label="Режим лаборатории" className={styles.viewNavigation}>
        <div className={styles.viewNavigationInner}>
          {VIEW_ITEMS.map((item) => (
            <a
              aria-current={item.id === view ? "page" : undefined}
              href={modernEditorialLabHref(item.id)}
              key={item.id}
            >
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

function SpecimenHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className={styles.specimenHeader}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </header>
  );
}

function StorySpecimen({ section }: SpecimenProps) {
  return (
    <article className={styles.storySpecimen}>
      <SpecimenHeader
        eyebrow="Уровень 1 · Первый месяц · История"
        title={section.title}
      />

      <figure className={styles.storyArtwork}>
        <img
          alt="Саша среди коробок в съёмной комнате держит телефон."
          height="1024"
          src={editorialStoryArtwork}
          width="1536"
        />
        <figcaption>
          Редакционная иллюстрация · экспериментальный визуальный язык
        </figcaption>
      </figure>

      <div className={styles.storyReadingGrid}>
        <aside aria-label="Сведения о материале" className={styles.storyMeta}>
          <dl>
            <div>
              <dt>Материал</dt>
              <dd>{section.id}</dd>
            </div>
            <div>
              <dt>Режим</dt>
              <dd>Непрерывное чтение</dd>
            </div>
            <div>
              <dt>Фокус</dt>
              <dd>Дата доступности денег</dd>
            </div>
          </dl>
        </aside>
        <div className={styles.storyCopy}>
          <MarkdownContent>{section.storyMarkdown}</MarkdownContent>
        </div>
      </div>

      <a
        className={styles.textTransition}
        href={modernEditorialLabHref("analysis")}
      >
        Перейти к решению
        <Arrow direction="forward" />
      </a>
    </article>
  );
}

function AnalysisSpecimen({ section }: SpecimenProps) {
  return (
    <article className={styles.analysisSpecimen}>
      <SpecimenHeader
        eyebrow="Уровень 1 · Первый месяц · Решение"
        lead="Девять звеньев — от ситуации до показанного результата."
        title={section.title}
      />

      <ol aria-label="Цепочка решения" className={styles.analysisList}>
        {section.analysisItems.map((item, index) => (
          <li key={item.label}>
            <span className={styles.analysisNumber}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className={styles.analysisMarker} />
            <h2>{item.label}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>

      <a
        className={styles.textTransition}
        href={modernEditorialLabHref("exercise")}
      >
        Перейти к упражнению
        <Arrow direction="forward" />
      </a>
    </article>
  );
}

function ExerciseReview({
  answers,
  canonicalDescriptions,
  onEdit,
  onReset,
}: {
  answers: ChainAnswers;
  canonicalDescriptions: readonly string[];
  onEdit: () => void;
  onReset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mismatches = CHAIN_LINKS.filter(
    (link) => answers[link.id] !== link.canonicalOptionId,
  );

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section aria-labelledby="modern-lab-review-title" className={styles.review}>
      <div className={styles.reviewHeader}>
        <p className={styles.eyebrow}>Сверка · все девять звеньев</p>
        <h2 id="modern-lab-review-title" ref={headingRef} tabIndex={-1}>
          Сверка с разбором истории
        </h2>
        <p>
          {mismatches.length === 0
            ? "Все выбранные формулировки совпадают с разбором истории."
            : `С разбором отличаются ${mismatches.length} из 9 звеньев. Сравните формулировки ниже.`}
        </p>
        <small>
          Сверяются формулировки о действиях Саши — решения читателя здесь не
          оцениваются.
        </small>
      </div>

      <ol className={styles.reviewList}>
        {CHAIN_LINKS.map((link) => {
          const selectedOptionId = answers[link.id] ?? "";
          const matches = selectedOptionId === link.canonicalOptionId;

          return (
            <li data-state={matches ? "match" : "different"} key={link.id}>
              <div className={styles.reviewTitle}>
                <span>{link.number}</span>
                <h3>{link.label}</h3>
                <strong>
                  {matches
                    ? "Совпадает с разбором"
                    : "Отличается от разбора"}
                </strong>
              </div>
              <div className={styles.reviewComparison}>
                <div>
                  <span>Ваш выбор</span>
                  <p>
                    {getOptionText(
                      link,
                      selectedOptionId,
                      canonicalDescriptions,
                    )}
                  </p>
                </div>
                <div>
                  <span>В разборе истории</span>
                  <p>{getCanonicalDescription(link, canonicalDescriptions)}</p>
                </div>
              </div>
              <p className={styles.reviewNote}>{link.review}</p>
              {link.methodNote ? (
                <p className={styles.reviewMethodNote}>{link.methodNote}</p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className={styles.reviewActions}>
        <button className={styles.primaryButton} onClick={onEdit} type="button">
          Изменить ответы
        </button>
        <button className={styles.secondaryButton} onClick={onReset} type="button">
          Очистить и начать заново
        </button>
      </div>
    </section>
  );
}

function ExerciseSpecimen({
  answers,
  currentIndex,
  section,
  stage,
  onAnswerChange,
  onCurrentIndexChange,
  onEdit,
  onReset,
  onSubmit,
}: SpecimenProps & {
  answers: ChainAnswers;
  currentIndex: number;
  stage: ExerciseStage;
  onAnswerChange: (linkId: ChainLinkId, optionId: string) => void;
  onCurrentIndexChange: (index: number) => void;
  onEdit: () => void;
  onReset: () => void;
  onSubmit: () => void;
}) {
  const questionRef = useRef<HTMLLegendElement>(null);
  const currentStepButtonRef = useRef<HTMLButtonElement>(null);
  const exerciseRailRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLFormElement>(null);
  const currentLink = CHAIN_LINKS[currentIndex];
  const selectedOptionId = answers[currentLink.id] ?? "";
  const answeredCount = getAnsweredCount(answers);
  const complete = answeredCount === CHAIN_LINKS.length;
  const isLast = currentIndex === CHAIN_LINKS.length - 1;
  const canonicalDescriptions = section.analysisItems.map(
    ({ description }) => description,
  );

  useEffect(() => {
    if (stage === "exercise") {
      const rail = exerciseRailRef.current;

      if (rail && rail.scrollWidth > rail.clientWidth + 1) {
        currentStepButtonRef.current?.scrollIntoView({
          behavior: "auto",
          block: "nearest",
          inline: "center",
        });
      }

      questionRef.current?.focus({ preventScroll: true });
    }
  }, [currentIndex, stage]);

  useEffect(() => {
    if (stage !== "exercise") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      workspaceRef.current?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [stage]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (complete) {
      onSubmit();
    }
  }

  if (stage === "review") {
    return (
      <article className={styles.exerciseSpecimen}>
        <SpecimenHeader
          eyebrow="Упражнение · лаборатория"
          lead="Результат упражнения не сохраняется и относится только к случаю Саши."
          title="Восстановите цепочку решения"
        />
        <ExerciseReview
          answers={answers}
          canonicalDescriptions={canonicalDescriptions}
          onEdit={onEdit}
          onReset={onReset}
        />
      </article>
    );
  }

  return (
    <article className={styles.exerciseSpecimen}>
      <SpecimenHeader
        eyebrow="Упражнение · лаборатория"
        lead="Выберите формулировку для каждого из девяти звеньев. Сверка откроется после заполнения всей цепочки."
        title="Восстановите цепочку решения"
      />

      <p className={styles.exerciseScope}>
        {section.id} · {section.title}. Ответы не сохраняются; это не
        персональная рекомендация и не часть текущей программы.
      </p>

      <form
        className={styles.exerciseWorkspace}
        onSubmit={submit}
        ref={workspaceRef}
      >
        <nav
          aria-label="Звенья цепочки"
          className={styles.exerciseRail}
          ref={exerciseRailRef}
        >
          <ol>
            {CHAIN_LINKS.map((link, index) => {
              const isCurrent = index === currentIndex;
              const isFilled = Boolean(answers[link.id]);

              return (
                <li
                  data-current={isCurrent || undefined}
                  data-filled={isFilled || undefined}
                  key={link.id}
                >
                  <button
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`${link.number}. ${link.label}. ${isFilled ? "Ответ выбран" : "Ответ не выбран"}.`}
                    onClick={() => onCurrentIndexChange(index)}
                    ref={isCurrent ? currentStepButtonRef : undefined}
                    type="button"
                  >
                    <span>{link.number}</span>
                    <i aria-hidden="true" />
                    <strong>{link.label}</strong>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <section
          aria-labelledby={`modern-lab-question-${currentLink.id}`}
          className={styles.exercisePanel}
        >
          <div className={styles.exerciseProgress}>
            <span aria-live="polite">
              Заполнено {answeredCount} из {CHAIN_LINKS.length}
            </span>
            <span>{currentLink.number} / 09</span>
          </div>

          <fieldset className={styles.exerciseFieldset}>
            <legend
              id={`modern-lab-question-${currentLink.id}`}
              ref={questionRef}
              tabIndex={-1}
            >
              <span className={styles.currentLinkLabel}>
                <span>{currentLink.number}</span>
                {currentLink.label}
              </span>
              <span className={styles.questionText}>
                {currentLink.question}
              </span>
            </legend>
            {currentLink.methodNote ? (
              <p className={styles.methodNote}>{currentLink.methodNote}</p>
            ) : null}

            <div className={styles.answerList}>
              {currentLink.options.map((option) => {
                const isSelected = selectedOptionId === option.id;

                return (
                  <label data-selected={isSelected || undefined} key={option.id}>
                    <input
                      checked={isSelected}
                      name={`modern-lab-${currentLink.id}`}
                      onChange={() =>
                        onAnswerChange(currentLink.id, option.id)
                      }
                      type="radio"
                      value={option.id}
                    />
                    <span>
                      {option.text ??
                        getCanonicalDescription(
                          currentLink,
                          canonicalDescriptions,
                        )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className={styles.exerciseFooter}>
            <p>
              {!selectedOptionId
                ? "Выберите вариант, чтобы перейти дальше."
                : complete
                  ? "Все девять звеньев заполнены. Можно перейти к сверке."
                  : `До сверки осталось заполнить: ${CHAIN_LINKS.length - answeredCount}.`}
            </p>
            <div className={styles.exerciseActions}>
              <button
                className={styles.secondaryButton}
                disabled={currentIndex === 0}
                onClick={() => onCurrentIndexChange(currentIndex - 1)}
                type="button"
              >
                <Arrow direction="back" />
                Предыдущее
              </button>
              {isLast ? (
                <button
                  className={styles.primaryButton}
                  disabled={!complete}
                  type="submit"
                >
                  Перейти к сверке
                </button>
              ) : (
                <button
                  className={styles.primaryButton}
                  disabled={!selectedOptionId}
                  onClick={() => onCurrentIndexChange(currentIndex + 1)}
                  type="button"
                >
                  Следующее
                  <Arrow direction="forward" />
                </button>
              )}
            </div>
          </div>
        </section>
      </form>
    </article>
  );
}

export function ModernEditorialLabScreen({
  section,
  view,
}: ModernEditorialLabScreenProps) {
  const [answers, setAnswers] = useState<ChainAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exerciseStage, setExerciseStage] =
    useState<ExerciseStage>("exercise");

  function changeAnswer(linkId: ChainLinkId, optionId: string) {
    setAnswers((current) => ({ ...current, [linkId]: optionId }));
  }

  function resetExercise() {
    setAnswers({});
    setCurrentIndex(0);
    setExerciseStage("exercise");
  }

  return (
    <AppShell
      className={styles.labPage}
      masthead="hidden"
      pageTitle={`Лаборатория: ${VIEW_ITEMS.find(({ id }) => id === view)?.label ?? "Прожито"}`}
      routeKey={`modern-editorial-lab-${view}`}
    >
      <LabHeader view={view} />
      <div className={styles.specimen}>
        {view === "story" ? <StorySpecimen section={section} /> : null}
        {view === "analysis" ? <AnalysisSpecimen section={section} /> : null}
        {view === "exercise" ? (
          <ExerciseSpecimen
            answers={answers}
            currentIndex={currentIndex}
            onAnswerChange={changeAnswer}
            onCurrentIndexChange={setCurrentIndex}
            onEdit={() => setExerciseStage("exercise")}
            onReset={resetExercise}
            onSubmit={() => setExerciseStage("review")}
            section={section}
            stage={exerciseStage}
          />
        ) : null}
      </div>
      <footer className={styles.labFooter}>
        <span>Современный живой архив · дизайн-эксперимент</span>
        <span>Канонический текст L01-S01 не изменён</span>
      </footer>
    </AppShell>
  );
}
