import {
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
  StickyNote,
} from "lucide-react";
import { type CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import { deck } from "./deck/content";
import { expandDeck, type RenderedSlide } from "./deck/expand";
import { validateDeck, type Block, type Section } from "./deck/schema";
import { theme, toneColor } from "./deck/theme";

const validatedDeck = validateDeck(deck);
const renderedSlides = expandDeck(validatedDeck);

export function App() {
  const [slideIndex, setSlideIndex] = useState(() => getInitialSlideIndex(renderedSlides.length));
  const [notesOpen, setNotesOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const slide = renderedSlides[slideIndex];
  const activeSection = validatedDeck.sections.find((section) => section.id === slide.sectionId);

  const goToSlide = useCallback((index: number) => {
    setSlideIndex(clamp(index, 0, renderedSlides.length - 1));
  }, []);

  const next = useCallback(() => goToSlide(slideIndex + 1), [goToSlide, slideIndex]);
  const previous = useCallback(() => goToSlide(slideIndex - 1), [goToSlide, slideIndex]);

  useEffect(() => {
    window.history.replaceState(null, "", `#slide-${slideIndex + 1}`);
  }, [slideIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goToSlide(slideIndex + 1);
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goToSlide(slideIndex - 1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        goToSlide(renderedSlides.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToSlide, slideIndex]);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  const notes = useMemo(() => slide.notes.filter(Boolean), [slide.notes]);

  return (
    <div className="appShell">
      <main className="previewPane">
        <SlideCanvas
          activeSectionId={slide.sectionId}
          sections={validatedDeck.sections}
          slide={slide}
        />
      </main>

      <aside className={`presenterRail ${notesOpen ? "isOpen" : ""}`} aria-label="Presenter controls">
        <div className="railControls">
          <button
            aria-label="First slide"
            className="iconButton"
            onClick={() => goToSlide(0)}
            title="First slide"
            type="button"
          >
            <Home size={18} />
          </button>
          <button
            aria-label="Previous slide"
            className="iconButton"
            disabled={slideIndex === 0}
            onClick={previous}
            title="Previous slide"
            type="button"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Next slide"
            className="iconButton"
            disabled={slideIndex === renderedSlides.length - 1}
            onClick={next}
            title="Next slide"
            type="button"
          >
            <ChevronRight size={20} />
          </button>
          <button
            aria-label="Toggle notes"
            aria-pressed={notesOpen}
            className={`iconButton ${notesOpen ? "isActive" : ""}`}
            onClick={() => setNotesOpen((current) => !current)}
            title="Toggle notes"
            type="button"
          >
            <StickyNote size={18} />
          </button>
          <button
            aria-label="Toggle fullscreen"
            className="iconButton"
            onClick={toggleFullscreen}
            title="Toggle fullscreen"
            type="button"
          >
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        <div className="railMeta">
          <span>{String(slide.sequenceNumber).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(slide.totalSlides).padStart(2, "0")}</span>
        </div>

        <div className="railSection">{activeSection?.title}</div>

        {notesOpen ? (
          <div className="notesPanel">
            {notes.length > 0 ? (
              notes.map((note) => <p key={note}>{note}</p>)
            ) : (
              <p>No notes for this step.</p>
            )}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function SlideCanvas({
  activeSectionId,
  sections,
  slide,
}: {
  activeSectionId: string;
  sections: Section[];
  slide: RenderedSlide;
}) {
  return (
    <section className={`slideCanvas layout-${slide.layout}`} aria-label={`Slide ${slide.sequenceNumber}`}>
      <ProgressHeader activeSectionId={activeSectionId} sections={sections} />

      <div className="slideTitle">
        <p className="slideKicker">{slide.step?.label ?? "Neros Technical Interview"}</p>
        <h1>{slide.title}</h1>
        {slide.subtitle ? <p className="slideSubtitle">{slide.subtitle}</p> : null}
      </div>

      <div className="slideBlocks">
        {slide.blocks.map((block, index) => (
          <BlockView block={block} key={`${block.type}-${index}`} />
        ))}
      </div>

      <footer className="slideFooter">
        <span>{validatedDeck.meta.durationMinutes} min technical interview</span>
        <span>{`${slide.sequenceNumber}/${slide.totalSlides}`}</span>
      </footer>
    </section>
  );
}

function ProgressHeader({ activeSectionId, sections }: { activeSectionId: string; sections: Section[] }) {
  const activeIndex = sections.findIndex((section) => section.id === activeSectionId);

  return (
    <div className="progressHeader" aria-label="Talk progress">
      {sections.map((section, index) => {
        const state = index === activeIndex ? "active" : index < activeIndex ? "complete" : "pending";
        const color = getSectionColor(section.id);

        return (
          <div
            className={`progressTopic is-${state}`}
            key={section.id}
            style={{ "--section-color": color } as CSSProperties}
          >
            <span className="progressNumber">{String(index + 1).padStart(2, "0")}</span>
            <span className="progressLabel">{section.shortTitle}</span>
          </div>
        );
      })}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "headline":
      return (
        <div className="headlineBlock">
          {block.eyebrow ? <p>{block.eyebrow}</p> : null}
          <h2>{block.text}</h2>
          {block.subtext ? <span>{block.subtext}</span> : null}
        </div>
      );
    case "bullets":
      return (
        <div className="bulletBlock" style={{ "--tone-color": toneColor(block.tone) } as CSSProperties}>
          {block.title ? <h2>{block.title}</h2> : null}
          <div className="bulletList">
            {block.items.map((item) => (
              <div className="bulletItem" key={item.id}>
                <span className="bulletMark" />
                <div>
                  <strong>{item.text}</strong>
                  {item.detail ? <p>{item.detail}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "twoColumn":
      return (
        <div className="twoColumnBlock">
          {block.columns.map((column) => (
            <div className="columnPanel" key={column.title}>
              <h2>{column.title}</h2>
              {column.items.map((item) => (
                <div className="columnItem" key={item.id}>
                  <strong>{item.text}</strong>
                  {item.detail ? <p>{item.detail}</p> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    case "metricRow":
      return (
        <div className="metricRow">
          {block.metrics.map((metric) => (
            <div
              className="metric"
              key={metric.id}
              style={{ "--tone-color": toneColor(metric.tone) } as CSSProperties}
            >
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              {metric.note ? <p>{metric.note}</p> : null}
            </div>
          ))}
        </div>
      );
    case "timeline":
      return (
        <div className="timelineBlock">
          {block.title ? <h2>{block.title}</h2> : null}
          <div className="timelineItems">
            {block.items.map((item) => (
              <div className="timelineItem" key={item.id}>
                <span>{item.label}</span>
                <div>
                  <strong>{item.title}</strong>
                  {item.description ? <p>{item.description}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "callout":
      return (
        <div className="calloutBlock" style={{ "--tone-color": toneColor(block.tone) } as CSSProperties}>
          <span>{block.label}</span>
          <p>{block.text}</p>
        </div>
      );
    case "quote":
      return (
        <blockquote className="quoteBlock">
          <p>{block.quote}</p>
          {block.attribution ? <cite>{block.attribution}</cite> : null}
        </blockquote>
      );
    case "image":
      return (
        <figure className="imageBlock">
          {block.title ? <h2>{block.title}</h2> : null}
          {block.labels ? (
            <div className="imagePanelLabels">
              {block.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          ) : null}
          <img
            alt={block.alt}
            src={block.src}
            style={{ "--image-aspect": block.aspectRatio ?? 16 / 9 } as CSSProperties}
          />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
  }
}

function getInitialSlideIndex(totalSlides: number) {
  const match = window.location.hash.match(/slide-(\d+)/);
  const parsed = match ? Number.parseInt(match[1], 10) : 1;
  return clamp(Number.isFinite(parsed) ? parsed - 1 : 0, 0, totalSlides - 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSectionColor(sectionId: string) {
  switch (sectionId) {
    case "context":
      return theme.sections.context;
    case "architecture":
      return theme.sections.architecture;
    case "deep-dive":
      return theme.sections.deepDive;
    case "execution":
      return theme.sections.execution;
    case "discussion":
      return theme.sections.discussion;
    default:
      return theme.colors.accent;
  }
}
