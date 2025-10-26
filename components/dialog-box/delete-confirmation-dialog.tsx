"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CircleAlert } from "lucide-react";

const DeleteConfirmationDialog = ({
  open,
  setOpen,
  deleteTitle,
  deleteMessage,
  handleDelete,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  deleteMessage: string;
  deleteTitle: string;
  handleDelete: () => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CircleAlert className="h-10 w-10 text-yellow-500" />
            {deleteTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>{deleteMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Yes Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
