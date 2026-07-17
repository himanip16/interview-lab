// src/features/bug-hunting/components/Sidebar/HypothesisForm.tsx
"use client";

import { useState } from "react";
import { useSubmitHypothesis } from "../../hooks/useSubmitHypothesis";

export default function HypothesisForm({ scenarioId }: { scenarioId: string }) {
  const [hypothesis, setHypothesis] = useState("");
  const { submit, status } = useSubmitHypothesis(scenarioId);

  return (
    <>
      <div className="bh-hyp-label">Your hypothesis</div>
      <textarea
        className="bh-hyp-box"
        placeholder="What do you think is going on so far?"
        value={hypothesis}
        onChange={(e) => setHypothesis(e.target.value)}
      />
      <button className="bh-hyp-submit" onClick={() => submit(hypothesis)} disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Log hypothesis"}
      </button>
      {status === "error" && <p className="text-xs text-red-500 mt-1">Couldn't save — try again.</p>}
    </>
  );
}