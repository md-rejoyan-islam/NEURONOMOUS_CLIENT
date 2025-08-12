"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TextField = ({
  name,
  label,
  props,
  error,
  disabled = false,
  placeholder,
}: {
  name: string;
  label: string;
  props?: React.ComponentProps<typeof Textarea>;
  error?: string;
  disabled?: boolean;
  placeholder: string;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        {...props}
        rows={3}
        disabled={disabled}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextField;
