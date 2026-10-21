// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { QuestionStep } from "@/lib/content/types";
import { STORAGE_KEY } from "@/lib/progress/repository";

// The board library needs layout APIs jsdom lacks; it is not under test here.
vi.mock("@/components/board/ChessBoard", () => ({ ChessBoard: () => null }));

const step: QuestionStep = {
  id: "q1",
  kind: "question",
  title: "Comprueba",
  prompt: "¿Quién tiene la oposición?",
  themes: ["oposicion"],
  choices: [
    { id: "a", text: "Las negras", correct: true, feedback: "Bien." },
    { id: "b", text: "Las blancas", correct: false, feedback: "No." },
  ],
};

const slots = { board: (n: ReactNode) => n, panel: (n: ReactNode) => n };

describe("QuestionStepView", () => {
  beforeEach(() => localStorage.clear());

  it("records one attempt, shows feedback and locks the answer", async () => {
    const { QuestionStepView } = await import("../QuestionStepView");
    const onOutcome = vi.fn();
    render(
      <QuestionStepView step={step} fallbackFen="8/8/8/8/8/8/8/K6k w - - 0 1" lessonId="c/l" area="finales" slots={slots} onOutcome={onOutcome} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Las blancas/ }));
    expect(onOutcome).toHaveBeenCalledWith({ solved: false, clean: false });
    expect(screen.getByText("No.")).toBeTruthy();
    expect(screen.getByText("Bien.")).toBeTruthy(); // correct answer revealed after answering
    await userEvent.click(screen.getByRole("button", { name: /Las negras/ }));
    expect(onOutcome).toHaveBeenCalledTimes(1);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.attempts).toHaveLength(1);
    expect(stored.attempts[0]).toMatchObject({ lessonId: "c/l", stepId: "q1", kind: "question", solved: false, clean: false });
  });
});
