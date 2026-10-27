import "@/i18n";
import "@testing-library/jest-dom/vitest"; // adds matchers like toBeInTheDocument()
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Tests in the "node" environment have no usable localStorage, but zustand's `persist`
// needs one. Give them a tiny in-memory fake. jsdom tests (window exists) keep jsdom's real one.
if (typeof window === "undefined") {
  const data = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => [...data.keys()][index] ?? null,
    removeItem: (key: string) => {
      data.delete(key);
    },
    setItem: (key: string, value: string) => {
      data.set(key, String(value));
    },
  } satisfies Storage);
}

// Remove rendered components after every test so tests can't affect each other
afterEach(() => {
  cleanup();
});

if (typeof window !== "undefined") {
  // jsdom has no matchMedia. Report "reduced motion" so GSAP animations are skipped in tests.
  if (typeof window.matchMedia !== "function") {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }

  // jsdom doesn't implement the modal methods of <dialog>
  if (typeof HTMLDialogElement !== "undefined") {
    const proto = HTMLDialogElement.prototype;
    if (typeof proto.showModal !== "function") {
      proto.showModal = function showModal(this: HTMLDialogElement) {
        this.setAttribute("open", "");
      };
    }
    if (typeof proto.close !== "function") {
      proto.close = function close(this: HTMLDialogElement) {
        this.removeAttribute("open");
        this.dispatchEvent(new Event("close"));
      };
    }
  }
}
