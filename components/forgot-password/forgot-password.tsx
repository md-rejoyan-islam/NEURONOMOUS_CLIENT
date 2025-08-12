"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ForgotEmailForm from "../form/forgot-email-form";
import ResetPasswordForm from "../form/reset-password-form";

type Step = "email" | "code" | "success";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  return (
    <Card className="w-full my-10 max-w-md">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-primary p-3 rounded-full">
            {step === "success" ? (
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            ) : (
              <KeyRound className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          {step === "email" && "Forgot Password"}
          {step === "code" && "Enter Reset Code"}
          {step === "success" && "Password Reset Complete"}
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          {step === "email" && "Enter your email to receive a reset code"}
          {step === "code" && "Check your email for the 6-digit code"}
          {step === "success" && "Your password has been successfully reset"}
        </p>
      </CardHeader>

      <CardContent>
        {step === "email" && (
          <ForgotEmailForm setStep={setStep} setEmail={setEmail} />
        )}

        {step === "code" && (
          <ResetPasswordForm setStep={setStep} email={email} />
        )}

        {step === "success" && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your password has been successfully reset. You can now sign in
                with your new password.
              </AlertDescription>
            </Alert>

            <Link href={"/login"}>
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        )}

        {step !== "success" && (
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Remember your password? Sign in
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
