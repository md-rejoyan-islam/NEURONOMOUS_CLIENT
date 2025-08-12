"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputField = ({
  label,
  type,
  error,
  props,
  isOptional,
  name,
  disabled = false,
  placeholder,
}: {
  label: string;
  type?: string;
  error?: string;
  props?: React.ComponentProps<typeof Input>;
  isOptional?: boolean;
  placeholder: string;
  name: string;
  disabled?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {!isOptional && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
