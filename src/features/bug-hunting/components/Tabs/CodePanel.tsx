import CodeBlock from "../shared/CodeBlock";
import type { CodeFile } from "@/features/bug-hunting/domain/types/CodeFile";

type Props = {
  active: boolean;
  files: CodeFile[];
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
    files.find((file) => file.key === activeFileKey) ?? files[0];

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
              {file.path}
            </div>
          ))}
        </div>

        <div className="code-view">
          {activeFile && (
            <CodeBlock
              content={
                activeFile.highlightedHtml ??
                activeFile.content
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}