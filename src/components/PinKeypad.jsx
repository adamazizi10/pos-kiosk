import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

const ALPHA_KEYS = [
  ["A", "B", "C", "D", "E", "F"],
  ["G", "H", "I", "J", "K", "L"],
  ["M", "N", "O", "P", "Q", "R"],
  ["S", "T", "U", "V", "W", "X"],
  ["Y", "Z", "BACK", "CLEAR", "TOGGLE", "EMPTY"],
];

const NUMERIC_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["TOGGLE", "0", "BACK"],
];

const PinKeypad = ({
  value,
  onChange,
  maxLength = 32,
  large = false,
  onEnter,
  enableKeyboard = true,
}) => {
  const [mode, setMode] = useState("numeric");

  const handleInput = useCallback(
    (next) => {
      if (!next) return;
      if (value.length >= maxLength) return;
      onChange(value + next);
    },
    [value, maxLength, onChange]
  );

  const handleBackspace = useCallback(() => {
    onChange(value.slice(0, -1));
  }, [value, onChange]);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  const handleToggle = useCallback(() => {
    setMode((prev) => (prev === "numeric" ? "alpha" : "numeric"));
  }, []);

  const keys = useMemo(() => {
    if (mode === "alpha") return ALPHA_KEYS;
    return NUMERIC_KEYS;
  }, [mode]);

  useEffect(() => {
    if (!enableKeyboard) return;
    const handleKeyDown = (event) => {
      const target = event.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        handleBackspace();
        return;
      }

      if (event.key === "Enter") {
        if (value.length > 0 && onEnter) {
          event.preventDefault();
          onEnter();
        }
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        handleInput(event.key);
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        handleInput(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, handleBackspace, handleInput, onEnter, value.length]);

  const gridClasses = mode === "alpha" ? "grid-cols-6" : "grid-cols-3";
  const gapClasses = large ? "gap-4" : "gap-3";
  const maxWidth = large ? "max-w-[520px]" : "max-w-[340px]";

  return (
    <div className={`grid w-full ${gridClasses} ${gapClasses} ${maxWidth}`}>
      {keys.flat().map((key, index) => {
        if (key === "EMPTY") {
          return <div key={`empty-${index}`} className="opacity-0" />;
        }
        if (key === "CLEAR") {
          return (
            <Button
              key="clear"
              variant="outline"
              className={large ? "h-16 text-base font-medium" : "h-12 text-sm font-medium"}
              onClick={handleClear}
            >
              Clear
            </Button>
          );
        }
        if (key === "BACK") {
          return (
            <Button
              key="back"
              variant="outline"
              className={large ? "h-16" : "h-12"}
              onClick={handleBackspace}
            >
              <Delete className={large ? "!h-8 !w-8" : "!h-6 !w-6"} />
            </Button>
          );
        }
        if (key === "TOGGLE") {
          return (
            <Button
              key="toggle"
              variant="outline"
              className={large ? "h-16 text-base font-semibold" : "h-12 text-sm font-semibold"}
              onClick={handleToggle}
            >
              {mode === "numeric" ? "ABC" : "123"}
            </Button>
          );
        }

        return (
          <Button
            key={key}
            variant="secondary"
            className={large ? "h-16 text-xl font-semibold" : "h-12 text-base font-semibold"}
            onClick={() => handleInput(key)}
          >
            {key}
          </Button>
        );
      })}
    </div>
  );
};

export default PinKeypad;
