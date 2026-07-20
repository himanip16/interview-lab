"use client";

import { useState } from "react";
import styles from "./PrReviewPage.module.css";

interface Comment {
  id: string;
  author: string;
  text: string;
}

interface DiffLine {
  line: number;
  type: "add" | "rm" | "ctx";
  content: string;
}

interface FileDiff {
  id: string;
  name: string;
  lines: DiffLine[];
  comments: Comment[];
}

const PEOPLE = ["R. Okafor", "M. Patel", "J. Lin", "A. Kim"];

const FILE_DIFFS: FileDiff[] = [
  {
    id: "summary",
    name: "OrderSummary.tsx",
    lines: [
      { line: 41, type: "ctx", content: 'export function OrderSummary({ items, discounts, tax }: Props) {' },
      { line: 42, type: "rm", content: '  return (<><ItemsBlock items={items} /><DiscountsBlock discounts={discounts} /><TaxBlock tax={tax} /></>);' },
      { line: 42, type: "add", content: '  return (<SummaryCard items={items} discounts={discounts} tax={tax} collapsible />);' },
      { line: 43, type: "ctx", content: "}" },
    ],
    comments: [
      {
        id: "c1",
        author: "M. Patel",
        text: 'Does @R. Okafor collapsible default to open or closed? That changes my earlier concern about the tax breakdown.',
      },
    ],
  },
  {
    id: "price",
    name: "PriceBreakdown.tsx",
    lines: [
      { line: 18, type: "rm", content: '  <div className="subtotal-row">Subtotal: {formatPrice(subtotal)}</div>' },
      { line: 19, type: "ctx", content: '  <div className="total-row">Total: {formatPrice(total)}</div>' },
    ],
    comments: [],
  },
  {
    id: "css",
    name: "checkout.module.css",
    lines: [
      { line: 7, type: "rm", content: "  .summary-block { margin-bottom: 24px; padding: 16px; }" },
      { line: 7, type: "add", content: "  .summary-card { margin-bottom: 12px; padding: 20px; border-radius: 16px; }" },
    ],
    comments: [],
  },
];

export default function PrReviewPage() {
  const [activePage, setActivePage] = useState<"info" | "evidence" | "code">("info");
  const [activeFile, setActiveFile] = useState("summary");
  const [decision, setDecision] = useState<"reject" | "wait" | "approve" | null>(null);
  const [composers, setComposers] = useState<Record<string, string>>({});
  const [tagDropdownOpen, setTagDropdownOpen] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({
    "summary-line-42": FILE_DIFFS[0].comments,
  });
  const [floatBtnVisible, setFloatBtnVisible] = useState(false);
  const [floatBtnPosition, setFloatBtnPosition] = useState({ top: 0, left: 0 });
  const [pendingSelection, setPendingSelection] = useState<{ text: string; lineKey: string } | null>(null);

  const handlePageChange = (page: "info" | "evidence" | "code") => {
    setActivePage(page);
  };

  const handleFileChange = (fileId: string) => {
    setActiveFile(fileId);
  };

  const handleDecision = (type: "reject" | "wait" | "approve") => {
    setDecision(type);
  };

  const toggleComposer = (lineKey: string) => {
    setComposers((prev) => ({
      ...prev,
      [lineKey]: prev[lineKey] ? "" : " ",
    }));
  };

  const toggleTagDropdown = (composerId: string) => {
    setTagDropdownOpen((prev) => ({
      ...prev,
      [composerId]: !prev[composerId],
    }));
  };

  const insertMention = (composerId: string, name: string) => {
    setComposers((prev) => {
      const current = prev[composerId] || "";
      const withSpace = current && !current.endsWith(" ") ? current + " " : current;
      return {
        ...prev,
        [composerId]: withSpace + "@" + name + " ",
      };
    });
    setTagDropdownOpen((prev) => ({
      ...prev,
      [composerId]: false,
    }));
  };

  const postComment = (lineKey: string) => {
    const text = composers[lineKey]?.trim();
    if (!text) return;

    const withMentions = text.replace(/@([A-Za-z. ]+?)(?=\s@|$)/g, '<span class="mention">@$1</span>');
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: "You",
      text: withMentions,
    };

    setComments((prev) => ({
      ...prev,
      [lineKey]: [...(prev[lineKey] || []), newComment],
    }));

    setComposers((prev) => ({
      ...prev,
      [lineKey]: "",
    }));
  };

  const handleTextSelection = () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && text.length > 1 && sel?.anchorNode) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const diffLine = sel.anchorNode.parentElement?.closest(".diff-line");
      if (diffLine) {
        const lineWrap = diffLine.closest(".diff-line-wrap");
        if (lineWrap) {
          const lineKey = lineWrap.getAttribute("data-line-key");
          if (lineKey) {
            setFloatBtnPosition({
              top: window.scrollY + rect.top - 38,
              left: window.scrollX + rect.left,
            });
            setFloatBtnVisible(true);
            setPendingSelection({ text, lineKey });
          }
        }
      }
    } else {
      setFloatBtnVisible(false);
    }
  };

  const handleFloatBtnClick = () => {
    if (pendingSelection) {
      const { lineKey, text } = pendingSelection;
      if (!composers[lineKey]) {
        setComposers((prev) => ({
          ...prev,
          [lineKey]: text,
        }));
      }
    }
    setFloatBtnVisible(false);
    window.getSelection()?.removeAllRanges();
  };

  const activeFileDiff = FILE_DIFFS.find((f) => f.id === activeFile);

  return (
    <div style={{ background: "#FAF9F6", color: "#15161C", fontFamily: "'Inter', sans-serif", padding: "32px 20px 0" }}>
      <div className={styles.app}>
        <div className={styles.head}>
          <div className={styles.crumb}>
            <button className={styles.back}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            Review a PR &nbsp;/&nbsp; #482
          </div>
          <div className={styles.prTop}>
            <div className={styles.prTitle}>
              <h1>Redesign order summary card for mobile checkout</h1>
              <div className={styles.prSub}>
                <span className={styles.branch}>feature/order-summary-consolidate</span> &rarr;{" "}
                <span className={styles.branch}>main</span>
                <span className={styles.statusPill}>Open</span>
                <span>
                  opened by <b style={{ color: "#15161C" }}>R. Okafor</b>
                </span>
              </div>
            </div>
            <div className={styles.timer}>
              <div className={styles.timerAura}></div>
              <div className={styles.timerRing}>
                <div className={styles.timerText}>18:32</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.pageTabs}>
          <div
            className={`${styles.pageTab} ${activePage === "info" ? styles.pageTabActive : ""}`}
            onClick={() => handlePageChange("info")}
          >
            Info
          </div>
          <div
            className={`${styles.pageTab} ${activePage === "evidence" ? styles.pageTabActive : ""}`}
            onClick={() => handlePageChange("evidence")}
          >
            Evidence
          </div>
          <div
            className={`${styles.pageTab} ${activePage === "code" ? styles.pageTabActive : ""}`}
            onClick={() => handlePageChange("code")}
          >
            Code changes<span className={styles.pageTabBadge}>3 files</span>
          </div>
        </div>

        {/* Info Page */}
        <div className={`${styles.page} ${activePage === "info" ? styles.pageActive : ""}`}>
          <div className={styles.secLabel}>Summary of changes</div>
          <p className={styles.summaryText}>
            Merges the three separate summary blocks (Items, Discounts, Tax) into a single collapsible card.
            Removes the standalone subtotal line since it's now redundant with the card total. No backend changes.
          </p>
          <div className={styles.intent}>
            <div className={styles.intentLabel}>Stated intention</div>
            <p className={styles.intentText}>
              "On mobile, the three separate blocks push the pay button below the fold. Consolidating into one
              card should cut vertical scroll by roughly 30% without losing any of the pricing detail."
            </p>
          </div>
          <div className={styles.statRow}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>3</div>
              <div className={styles.statKey}>Files changed</div>
            </div>
            <div className={`${styles.stat} ${styles.statAdd}`}>
              <div className={styles.statNumber}>+18</div>
              <div className={styles.statKey}>Additions</div>
            </div>
            <div className={`${styles.stat} ${styles.statRm}`}>
              <div className={styles.statNumber}>-24</div>
              <div className={styles.statKey}>Deletions</div>
            </div>
          </div>
        </div>

        {/* Evidence Page */}
        <div className={`${styles.page} ${activePage === "evidence" ? styles.pageActive : ""}`}>
          <div className={styles.secLabel}>Before &amp; after</div>
          <div className={styles.shotRow}>
            <div className={styles.shot}>
              <div className={styles.shotLabel}>Before</div>
              <div className={styles.shotFrame}>
                <svg viewBox="0 0 260 320" width="100%">
                  <rect width="260" height="320" fill="#FAF9F6" />
                  <rect x="14" y="14" width="232" height="64" rx="10" fill="#fff" stroke="#e6e3dc" />
                  <rect x="26" y="26" width="90" height="8" rx="4" fill="#5A5B66" />
                  <rect x="26" y="42" width="140" height="6" rx="3" fill="#c9c6be" />
                  <rect x="14" y="90" width="232" height="52" rx="10" fill="#fff" stroke="#e6e3dc" />
                  <rect x="26" y="102" width="70" height="8" rx="4" fill="#5A5B66" />
                  <rect x="26" y="118" width="120" height="6" rx="3" fill="#c9c6be" />
                  <rect x="14" y="154" width="232" height="52" rx="10" fill="#fff" stroke="#e6e3dc" />
                  <rect x="26" y="166" width="60" height="8" rx="4" fill="#5A5B66" />
                  <rect x="26" y="182" width="100" height="6" rx="3" fill="#c9c6be" />
                  <rect x="200" y="290" width="46" height="20" rx="6" fill="#e6e3dc" />
                </svg>
              </div>
            </div>
            <div className={styles.shot}>
              <div className={styles.shotLabel}>After</div>
              <div className={styles.shotFrame}>
                <svg viewBox="0 0 260 320" width="100%">
                  <rect width="260" height="320" fill="#FAF9F6" />
                  <rect x="14" y="14" width="232" height="150" rx="16" fill="#fff" stroke="#00A87E" strokeWidth="1.5" />
                  <rect x="28" y="30" width="90" height="8" rx="4" fill="#15161C" />
                  <rect x="28" y="48" width="140" height="6" rx="3" fill="#c9c6be" />
                  <rect x="28" y="66" width="70" height="6" rx="3" fill="#c9c6be" />
                  <rect x="28" y="84" width="100" height="6" rx="3" fill="#c9c6be" />
                  <rect x="28" y="106" width="204" height="1" fill="#eee" />
                  <rect x="28" y="120" width="60" height="9" rx="4" fill="#00A87E" />
                  <rect x="180" y="120" width="52" height="9" rx="4" fill="#00A87E" />
                  <rect x="200" y="290" width="46" height="20" rx="6" fill="#00D9A3" />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.secLabel} style={{ marginTop: "24px" }}>
            Links in this PR
          </div>
          <div className={styles.linkRow}>
            <div className={styles.linkMain}>
              <div className={styles.linkTitle}>Figma &mdash; Consolidated summary card</div>
              <div className={styles.linkUrl}>figma.com/file/8k2j.../order-summary-v2</div>
            </div>
            <div className={styles.chipRow}>
              <span className={`${styles.chip} ${styles.chipOk}`}>Accessible</span>
              <span className={`${styles.chip} ${styles.chipOk}`}>Public</span>
            </div>
          </div>
          <div className={styles.linkRow}>
            <div className={styles.linkMain}>
              <div className={styles.linkTitle}>Staging preview</div>
              <div className={styles.linkUrl}>pr-482.staging.internal.app</div>
            </div>
            <div className={styles.chipRow}>
              <span className={`${styles.chip} ${styles.chipBad}`}>Expired</span>
            </div>
          </div>
          <div className={styles.linkRow}>
            <div className={styles.linkMain}>
              <div className={styles.linkTitle}>Slack thread &mdash; design discussion</div>
              <div className={styles.linkUrl}>yourteam.slack.com/archives/C0.../p17...</div>
            </div>
            <div className={styles.chipRow}>
              <span className={`${styles.chip} ${styles.chipWarn}`}>Internal only</span>
            </div>
          </div>
        </div>

        {/* Code Page */}
        <div className={`${styles.page} ${activePage === "code" ? styles.pageActive : ""}`}>
          <div className={styles.selectHint}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
            </svg>
            Hover a line for the quick comment button, or select any text to comment on just that part.
          </div>

          <div className={styles.fileTabs}>
            {FILE_DIFFS.map((file) => (
              <div
                key={file.id}
                className={`${styles.fileTab} ${activeFile === file.id ? styles.fileTabActive : ""}`}
                onClick={() => handleFileChange(file.id)}
              >
                {file.name}
              </div>
            ))}
          </div>

          {activeFileDiff && (
            <div className={`${styles.filePane} ${styles.filePaneActive}`}>
              <div className={styles.diff}>
                {activeFileDiff.lines.map((line, idx) => {
                  const lineKey = `${activeFileDiff.id}-line-${line.line}-${idx}`;
                  const lineComments = comments[lineKey] || [];
                  const showComposer = composers[lineKey];

                  return (
                    <div key={lineKey} className={styles.diffLineWrap} data-line-key={lineKey}>
                      <div
                        className={`${styles.diffLine} ${
                          line.type === "add"
                            ? styles.diffLineAdd
                            : line.type === "rm"
                            ? styles.diffLineRm
                            : styles.diffLineCtx
                        }`}
                        onMouseUp={handleTextSelection}
                      >
                        <span className={styles.diffLineNumber}>{line.line}</span>
                        <span>{line.type === "rm" ? "-" : line.type === "add" ? "+" : " "}</span>
                        <span>{line.content}</span>
                        <div
                          className={styles.diffAddComment}
                          onClick={() => toggleComposer(lineKey)}
                        >
                          +
                        </div>
                      </div>

                      {lineComments.map((comment) => (
                        <div key={comment.id} className={styles.inlineThread}>
                          <div className={styles.threadHead}>
                            <span>{comment.author}</span>
                          </div>
                          <div
                            className={styles.threadText}
                            dangerouslySetInnerHTML={{ __html: comment.text }}
                          />
                        </div>
                      ))}

                      {showComposer && (
                        <div className={styles.inlineComposer}>
                          <textarea
                            className={styles.tinyTextarea}
                            placeholder="Leave a comment…"
                            value={showComposer}
                            onChange={(e) =>
                              setComposers((prev) => ({
                                ...prev,
                                [lineKey]: e.target.value,
                              }))
                            }
                          />
                          <div className={styles.composerActions}>
                            <div className={styles.tagWrap}>
                              <button
                                className={styles.tagBtn}
                                onClick={() => toggleTagDropdown(lineKey)}
                              >
                                @ Tag someone
                              </button>
                              <div
                                className={`${styles.tagDropdown} ${
                                  tagDropdownOpen[lineKey] ? styles.tagDropdownOpen : ""
                                }`}
                              >
                                {PEOPLE.map((person) => (
                                  <div
                                    key={person}
                                    className={styles.tagOpt}
                                    onClick={() => insertMention(lineKey, person)}
                                  >
                                    <span className={styles.tagAvatar}>
                                      {person
                                        .split(" ")
                                        .map((w) => w[0])
                                        .join("")}
                                    </span>
                                    {person}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              className={styles.postBtn}
                              onClick={() => postComment(lineKey)}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className={styles.decisionBar}>
          <div className={styles.decisionStatus}>
            {!decision ? (
              "No decision yet — leave any comments first."
            ) : (
              <span className={styles.decisionStatusBold}>
                {decision === "reject"
                  ? "You rejected this PR."
                  : decision === "wait"
                  ? "You requested changes — waiting on the author."
                  : "You approved this PR."}
              </span>
            )}
          </div>
          <div className={styles.decisionActions}>
            <button
              className={`${styles.decisionBtn} ${styles.decisionBtnReject} ${
                decision === "reject" ? styles.decisionBtnRejectSelected : ""
              }`}
              onClick={() => handleDecision("reject")}
            >
              Reject PR
            </button>
            <button
              className={`${styles.decisionBtn} ${styles.decisionBtnWait} ${
                decision === "wait" ? styles.decisionBtnWaitSelected : ""
              }`}
              onClick={() => handleDecision("wait")}
            >
              Request changes
            </button>
            <button
              className={`${styles.decisionBtn} ${styles.decisionBtnApprove} ${
                decision === "approve" ? styles.decisionBtnApproveSelected : ""
              }`}
              onClick={() => handleDecision("approve")}
            >
              Approve
            </button>
          </div>
        </div>
      </div>

      <button
        className={`${styles.floatBtn} ${floatBtnVisible ? styles.floatBtnVisible : ""}`}
        style={{
          top: floatBtnPosition.top,
          left: floatBtnPosition.left,
        }}
        onClick={handleFloatBtnClick}
      >
        Comment on selection
      </button>
    </div>
  );
}
