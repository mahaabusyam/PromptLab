// @vitest-environment jsdom
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithQuery } from "@/test/renderWithQuery";
import { AiError } from "../errors";
import { improvePrompt } from "../services/aiClient";
import { ImprovePromptDialog } from "./ImprovePromptDialog";

// النص صار مقسوم على عناصر (<bdi> لأسماء المتغيّرات)، فنطابق على textContent الكامل للفقرة
const paragraphWith =
  (pattern: RegExp) => (_content: string, element: Element | null) =>
    element?.tagName === "P" && pattern.test(element.textContent ?? "");

vi.mock("../services/aiClient", () => ({
  improvePrompt: vi.fn(),
  runPrompt: vi.fn(),
  generateVariations: vi.fn(),
}));

const mockedImprove = vi.mocked(improvePrompt);
const ORIGINAL = "Write a blog post about {{topic}}";

function setup(prompt = ORIGINAL) {
  const onApply = vi.fn();
  const onClose = vi.fn();
  renderWithQuery(
    <ImprovePromptDialog prompt={prompt} onApply={onApply} onClose={onClose} />,
  );
  return { onApply, onClose, user: userEvent.setup() };
}

beforeEach(() => {
  mockedImprove.mockReset();
});

describe("ImprovePromptDialog", () => {
  it("opens as a modal dialog with the default options", () => {
    setup();
    expect(
      screen.getByRole("dialog", { name: "Improve with AI" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Task")).toHaveValue("general");
    expect(
      screen.queryByRole("button", { name: "Apply suggestion" }),
    ).not.toBeInTheDocument();
  });

  it("sends the prompt and the chosen options", async () => {
    mockedImprove.mockResolvedValue({ improved: "Better {{topic}}" });
    const { user } = setup();

    await user.selectOptions(screen.getByLabelText("Tone"), "Friendly");
    await user.click(screen.getByRole("button", { name: "Improve" }));

    await screen.findByRole("region", { name: "Suggested prompt" });
    expect(mockedImprove.mock.calls[0][0]).toEqual({
      prompt: ORIGINAL,
      task: "general",
      tone: "friendly",
      length: "medium",
    });
  });

  it("shows a loading state and disables the button while waiting", async () => {
    mockedImprove.mockReturnValue(new Promise(() => {})); // never resolves
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Improve" }));

    expect(
      await screen.findByText("Improving your prompt…"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Improve" })).toBeDisabled();
  });

  it("shows the original next to the suggestion and applies it on request", async () => {
    mockedImprove.mockResolvedValue({ improved: "Better {{topic}}" });
    const { user, onApply } = setup();

    await user.click(screen.getByRole("button", { name: "Improve" }));

    const suggested = await screen.findByRole("region", {
      name: "Suggested prompt",
    });
    expect(within(suggested).getByText("Better {{topic}}")).toBeInTheDocument();
    expect(
      within(screen.getByRole("region", { name: "Original prompt" })).getByText(
        ORIGINAL,
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Apply suggestion" }));
    expect(onApply).toHaveBeenCalledWith("Better {{topic}}");
  });

  it("warns when the AI removed a variable", async () => {
    mockedImprove.mockResolvedValue({ improved: "A blog post about cats" });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Improve" }));

    expect(
      await screen.findByText(
        paragraphWith(/Removed variables: \{\{topic\}\}/),
      ),
    ).toBeInTheDocument();
  });

  it("shows a friendly message when the request fails, and lets you retry", async () => {
    mockedImprove.mockRejectedValue(new AiError("rate_limited", "x", 30));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Improve" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Try again in 30 seconds",
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
  });

  it("explains that prompts still work offline when the AI service is unavailable", async () => {
    mockedImprove.mockRejectedValue(new AiError("unavailable", "x"));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Improve" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("offline");
  });

  it("blocks prompts that are over the length limit", () => {
    setup("a".repeat(8001));
    expect(screen.getByRole("alert")).toHaveTextContent("limit is 8,000");
    expect(screen.getByRole("button", { name: "Improve" })).toBeDisabled();
  });

  it("calls onClose when cancelled", async () => {
    const { user, onClose } = setup();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });
});
