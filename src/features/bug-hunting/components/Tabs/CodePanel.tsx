import CodeBlock from "../shared/CodeBlock";
import type { SourceFile } from "../../types/Scenario";

type Props = {
  active: boolean;
  files: SourceFile[];
  activeFileKey: string;
  onFileChange: (key: string) => void;
};

export default function CodePanel({
  active,
  files,
  activeFileKey,
  onFileChange,
}: Props) {
  const activeFile =
    files.find((f) => f.key === activeFileKey) ?? files[0];

  return (
    <div className={`panel${active ? " active" : ""}`}>
      <div className="code-stage">
        <div className="filetree">
          {files.map((file) => (
            <div
              key={file.key}
              className={`ftitem${
                file.key === activeFileKey ? " active" : ""
              }`}
              onClick={() => onFileChange(file.key)}
            >
              {file.name}
            </div>
          ))}
        </div>

        <div className="code-view">
          {activeFile && (
            <CodeBlock content={activeFile.contentHtml} />
          )}
        </div>
      </div>
    </div>
  );
}