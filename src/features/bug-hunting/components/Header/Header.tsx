"use client";

import { useRouter } from "next/navigation";

import Timer from "./Timer";
import type { BugScenario } from "../../types/Scenario";

interface Props {
  scenario: BugScenario;
}

export default function Header({
  scenario,
}: Props) {
  const router = useRouter();

  return (
    <header className="head">
      <div className="crumb">
        <button
          type="button"
          className="back"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <div className="crumb-text">
          Bug hunting&nbsp;/&nbsp;
          <b>{scenario.title}</b>
        </div>
      </div>

      <div className="head-right">
        <Timer />

        <button
          type="button"
          className="submit-btn"
        >
          Submit fix
        </button>
      </div>
    </header>
  );
}