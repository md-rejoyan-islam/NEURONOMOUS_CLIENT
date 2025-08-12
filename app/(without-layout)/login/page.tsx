import LoginForm from "@/components/form/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your IoT Control Hub account",
};

export default function LoginPage() {
  return (
    <Card className="w-full my-10 max-w-md">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-primary p-3 rounded-full">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">IoT Control Hub</CardTitle>
        <p className="text-muted-foreground mt-2">Sign in to your account</p>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
