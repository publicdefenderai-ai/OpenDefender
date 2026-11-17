// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import i18n from "i18next";
import { ErrorBoundary } from "../client/src/components/error-boundary";
import en from "../client/src/locales/en";
import es from "../client/src/locales/es";
import zh from "../client/src/locales/zh";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network unavailable")));
});

afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function BrokenPage(): never {
  throw new Error("Page failed");
}

for (const language of ["en", "es", "zh"] as const) {
  it(`recovers from a render failure without the app providers in ${language}`, async () => {
    await i18n.init({ lng: language, resources: { en, es, zh }, initImmediate: false });
    await act(() => root.render(createElement(ErrorBoundary, null, createElement(BrokenPage))));
    const copy = { en, es, zh }[language].translation.errorRecovery;
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(container.querySelector("h1")?.textContent).toBe(copy.title);
    expect(container.textContent).toContain(copy.warning);
    expect(container.querySelector("button")?.textContent).toBe(copy.reload);
    expect(Array.from(container.querySelectorAll("a")).map(link => link.getAttribute("href")))
      .toEqual(["/", "/privacy-policy"]);
    expect(fetch).toHaveBeenCalledWith("/api/client-error", expect.objectContaining({ method: "POST", keepalive: true }));
  });
}
