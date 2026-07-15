import CodeBlock from "../shared/CodeBlock";
import type { CodeFile } from "../../types/Scenario";

type Props = {
  active: boolean;
  files: CodeFile[];
  activeFileKey: string;
  onFileChange: (key: string) => void;
};

export default function CodePanel({ active, files, activeFileKey, onFileChange }: Props) {
  const activeFile = files.find((f) => f.key === activeFileKey) ?? files[0];
  return (
    <div className={`panel${active ? " active" : ""}`}>
      <div className="code-stage">
        <div className="filetree">
          {files.map((f) => (
            <div
              key={f.key}
              className={`ftitem${f.key === activeFileKey ? " active" : ""}`}
              onClick={() => onFileChange(f.key)}
            >
              {f.label}
            </div>
          ))}
        </div>
        <div className="code-view">
          {activeFile && <CodeBlock html={activeFile.contentHtml} />}
        </div>
      </div>
    </div>
  );
}