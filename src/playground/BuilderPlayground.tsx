import { useMemo, useState } from "react";
import { TextInput } from "../components/TextInput";
import { ESignPanel } from "./ESignPanel";
import { TodoPanel } from "./TodoPanel";
import { DecisionPanel } from "./DecisionPanel";

type ActionType = "esign" | "todo" | "decision" | null;

function detectType(desc: string): ActionType {
  const d = desc.toLowerCase();
  if (/(e[-\s]?sign|signature|签字|签名)/.test(d)) return "esign";
  if (/(to[-\s]?do|task|todo|待办|任务)/.test(d)) return "todo";
  if (/(decision|approve|choice|approval|决策|审批|选择)/.test(d)) return "decision";
  return null;
}

function figmaEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("figma.com")) return null;
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
  } catch {
    return null;
  }
}

const TYPE_LABEL: Record<Exclude<ActionType, null>, string> = {
  esign: "E-Sign",
  todo: "To-Do",
  decision: "Decision",
};

const QUICK_PHRASES = ["e-sign", "to-do", "decision"];

export function BuilderPlayground() {
  const [description, setDescription] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");

  const type = useMemo(() => detectType(description), [description]);
  const embed = useMemo(() => figmaEmbedUrl(figmaUrl), [figmaUrl]);

  return (
    <div className="grid h-screen grid-cols-[minmax(360px,38%)_1fr] bg-background">
      {/* ── Left: describe + Figma link ──────────────────────── */}
      <aside className="flex h-full flex-col gap-6 overflow-y-auto border-r border-border-secondary px-8 py-10">
        <header>
          <h1 className="text-page-title text-label-heading">Form Builder</h1>
          <p className="mt-1 text-body text-label-tertiary">
            Describe an action type and (optionally) paste a Figma link. The form on the right is generated from the description.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <label className="text-body text-label-secondary" htmlFor="bp-desc">
            Action type description
          </label>
          <textarea
            id="bp-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. e-sign action for a lease agreement, or a to-do for client onboarding"
            className="min-h-28 resize-y rounded-lg border border-border-secondary bg-white px-3 py-2 text-body text-foreground placeholder:text-label-tertiary outline-none focus:border-foreground"
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-tiny text-label-tertiary">Quick add:</span>
            {QUICK_PHRASES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() =>
                  setDescription((d) => (d ? `${d.trim()} ${p}` : p))
                }
                className="rounded-full border border-border-secondary bg-white px-3 py-0.5 text-tiny text-label-secondary hover:bg-background"
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-tiny text-label-tertiary">
            Detected:{" "}
            <span className="font-regular text-foreground">
              {type ? TYPE_LABEL[type] : "—"}
            </span>
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <TextInput.Root value={figmaUrl} onValueChange={setFigmaUrl}>
            <TextInput.Label>Figma link</TextInput.Label>
            <TextInput.Field>
              <TextInput.Input placeholder="https://www.figma.com/file/..." />
            </TextInput.Field>
          </TextInput.Root>
          {figmaUrl && !embed && (
            <p className="text-tiny text-label-tertiary">
              Not a recognised Figma URL.
            </p>
          )}
          {embed && (
            <div className="overflow-hidden rounded-lg border border-border-secondary bg-white">
              <iframe
                src={embed}
                title="Figma preview"
                className="block h-80 w-full"
                allowFullScreen
              />
            </div>
          )}
        </section>
      </aside>

      {/* ── Right: generated form ───────────────────────────── */}
      <main className="flex h-full overflow-hidden">
        {type === "esign" && (
          <ESignPanel inline open onOpenChange={() => {}} />
        )}
        {type === "todo" && (
          <TodoPanel inline open onOpenChange={() => {}} />
        )}
        {type === "decision" && (
          <DecisionPanel inline open onOpenChange={() => {}} />
        )}
        {!type && (
          <div className="flex h-full w-full items-center justify-center px-8">
            <div className="max-w-md text-center">
              <p className="text-larger-body text-label-tertiary">
                Describe an action on the left to generate a form here.
              </p>
              <p className="mt-2 text-tiny text-label-tertiary">
                Recognised types: e-sign · to-do · decision
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
