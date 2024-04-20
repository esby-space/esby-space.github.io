import { createRenderEffect } from "solid-js";

export function model(element: HTMLInputElement, value: () => any) {
    const [accessor, setter] = value();
    createRenderEffect(() => (element.value = accessor()));
    element.addEventListener("input", (event) => setter(parseInt((event.target as HTMLInputElement).value)));
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            model: [() => any, (v: any) => any]
        }
    }
}

