import { useState } from "react";
import { PenLine, Diamond, ListTodo } from "lucide-react";
import { Button } from "./components/Button";
import { ESignPanel } from "./playground/ESignPanel";
import { DecisionPanel } from "./playground/DecisionPanel";
import { TodoPanel } from "./playground/TodoPanel";
import { BuilderPlayground } from "./playground/BuilderPlayground";

type View = "actions" | "builder";

export default function App() {
  const [view, setView] = useState<View>("actions");
  const [esignOpen, setEsignOpen]       = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [todoOpen, setTodoOpen]         = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center gap-1 border-b border-border-secondary bg-white px-6 py-2">
        <TabButton active={view === "actions"} onClick={() => setView("actions")}>
          Action Configuration
        </TabButton>
        <TabButton active={view === "builder"} onClick={() => setView("builder")}>
          Form Builder
        </TabButton>
      </nav>

      {view === "actions" ? (
        <div className="px-10 py-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <header>
              <h1 className="text-page-title text-label-heading">
                Action Configuration · Playground
              </h1>
              <p className="mt-1 text-body text-label-tertiary">
                Click any button below to open its action configuration panel.
              </p>
            </header>

            <div className="flex flex-wrap gap-3">
              <Button
                leftIcon={<PenLine size={16} strokeWidth={1.6} />}
                onClick={() => setEsignOpen(true)}
              >
                Configure E-Sign
              </Button>

              <Button
                leftIcon={<Diamond size={16} strokeWidth={1.6} />}
                onClick={() => setDecisionOpen(true)}
                style={{ background: "var(--color-flow-decision)" }}
              >
                Configure Decision
              </Button>

              <Button
                leftIcon={<ListTodo size={16} strokeWidth={1.6} />}
                onClick={() => setTodoOpen(true)}
                style={{ background: "var(--color-flow-todo)" }}
              >
                Configure To-Do
              </Button>
            </div>

            <ESignPanel    open={esignOpen}    onOpenChange={setEsignOpen}    />
            <DecisionPanel open={decisionOpen} onOpenChange={setDecisionOpen} />
            <TodoPanel     open={todoOpen}     onOpenChange={setTodoOpen}     />
          </div>
        </div>
      ) : (
        <BuilderPlayground />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-md px-3 py-1.5 text-body transition-colors " +
        (active
          ? "bg-background text-foreground"
          : "text-label-tertiary hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
