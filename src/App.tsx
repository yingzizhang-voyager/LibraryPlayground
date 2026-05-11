import { useState } from "react";
import { PenLine, Diamond, ListTodo } from "lucide-react";
import { Button } from "./components/Button";
import { ESignPanel } from "./playground/ESignPanel";
import { DecisionPanel } from "./playground/DecisionPanel";
import { TodoPanel } from "./playground/TodoPanel";

export default function App() {
  const [esignOpen, setEsignOpen]       = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [todoOpen, setTodoOpen]         = useState(false);

  return (
    <div className="min-h-screen bg-background px-10 py-12">
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
  );
}
