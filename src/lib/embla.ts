import { type EmblaCarouselType } from "embla-carousel";

const addButtonActiveToggle = (
    embla: EmblaCarouselType,
    previous: HTMLElement,
    next: HTMLElement,
): (() => void) => {
    const togglePrevNextBtnsState = (): void => {
        if (embla.canScrollPrev()) previous.removeAttribute("disabled");
        else previous.setAttribute("disabled", "disabled");

        if (embla.canScrollNext()) next.removeAttribute("disabled");
        else next.setAttribute("disabled", "disabled");
    };

    embla
        .on("select", togglePrevNextBtnsState)
        .on("init", togglePrevNextBtnsState)
        .on("reInit", togglePrevNextBtnsState);

    return (): void => {
        previous.removeAttribute("disabled");
        next.removeAttribute("disabled");
    };
};

export const addButtonClickHandlers = (
    embla: EmblaCarouselType,
    previous: HTMLElement,
    next: HTMLElement,
): (() => void) => {
    const scrollPrev = (): void => { embla.scrollPrev() };
    const scrollNext = (): void => { embla.scrollNext() };
    const keyboard = (event: KeyboardEvent) => {
        if (event.code == "ArrowLeft") { scrollPrev() }
        if (event.code == "ArrowRight") { scrollNext() }
    };

    previous.addEventListener("click", scrollPrev, false);
    next.addEventListener("click", scrollNext, false);
    document.addEventListener("keydown", keyboard);

    const removeTogglePrevNextBtnsActive = addButtonActiveToggle(
        embla,
        previous,
        next,
    );

    return (): void => {
        removeTogglePrevNextBtnsActive();
        previous.removeEventListener("click", scrollPrev, false);
        next.removeEventListener("click", scrollNext, false);
        document.removeEventListener("keydown", keyboard);
    };
};
