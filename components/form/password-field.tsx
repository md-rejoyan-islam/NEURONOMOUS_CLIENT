import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordField = ({
  label,
  error,
  props,
  disabled = false,
  placeholder,
}: {
  placeholder: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  props?: React.ComponentProps<typeof Input>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor="password">
        {label ? label : "Password"}
        <span className="text-red-500">*</span>
      </Label>
      <div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default PasswordField;
