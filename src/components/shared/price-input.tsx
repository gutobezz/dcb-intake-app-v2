"use client";

import { useCallback, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

function formatCurrency(raw: string): string {
  const digits = raw.replace(/[^0-9.]/g, "");
  if (!digits) return "";
  const num = parseFloat(digits);
  if (isNaN(num)) return digits;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function PriceInput({
  value,
  onChange,
  placeholder = "0",
  className,
  id,
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDisplayValue(raw);
      onChange(raw.replace(/[^0-9.]/g, ""));
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setDisplayValue(value);
  }, [value]);

  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroupAddon align="inline-start">
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        value={isFocused ? displayValue : (value ? formatCurrency(value) : "")}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        inputMode="decimal"
      />
    </InputGroup>
  );
}
