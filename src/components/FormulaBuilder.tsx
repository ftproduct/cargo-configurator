import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formulaVariables } from "@/data/mockData";

interface FormulaBuilderProps {
  value: string;
  onChange: (val: string) => void;
}

export function FormulaBuilder({ value, onChange }: FormulaBuilderProps) {
  const [mode, setMode] = useState<"builder" | "text">("builder");

  const insertText = (text: string) => {
    onChange(value + (value && !value.endsWith(" ") ? " " : "") + text);
  };

  const operators = ["+", "−", "×", "÷", "(", ")", ","];
  const functions = ["min", "max"];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setMode("builder")}
          className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
            mode === "builder" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Builder
        </button>
        <button
          onClick={() => setMode("text")}
          className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
            mode === "text" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Advanced
        </button>
      </div>

      {mode === "builder" && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground mr-1 self-center">Variables:</span>
            {formulaVariables.map((v) => (
              <Badge
                key={v.name}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                onClick={() => insertText(v.name)}
              >
                {v.label}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground mr-1 self-center">Operators:</span>
            {operators.map((op) => (
              <Button
                key={op}
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 font-mono text-sm"
                onClick={() => insertText(op === "×" ? "*" : op === "÷" ? "/" : op === "−" ? "-" : op)}
              >
                {op}
              </Button>
            ))}
            {functions.map((fn) => (
              <Button
                key={fn}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs font-mono"
                onClick={() => insertText(`${fn}(`)}
              >
                {fn}()
              </Button>
            ))}
          </div>
        </div>
      )}

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm min-h-[60px]"
        placeholder="e.g. base_freight * 0.1 + distance_km * 2.5"
      />
      <p className="text-xs text-muted-foreground">Must evaluate to a number. Use variables and operators above.</p>
    </div>
  );
}
