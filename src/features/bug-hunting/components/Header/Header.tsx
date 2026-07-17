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
    <header className="bh-header">
      <div className="head-left">
        <button
          type="button"
          className="back"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          ←
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