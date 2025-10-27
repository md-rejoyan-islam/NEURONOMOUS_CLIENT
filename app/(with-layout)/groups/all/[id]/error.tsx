"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const GroupError = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6">
      <div className="py-12 text-center">
        <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-medium">Group not found</h3>
        <p className="text-muted-foreground mb-4">
          The requested group could not be found. It may have been deleted or
          does not exist.
        </p>
        <Link href={"/groups/all"}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GroupError;
