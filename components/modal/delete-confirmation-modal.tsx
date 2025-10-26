import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

const DeleteConfirmationModal = ({
  isOpen,
  setIsOpen,
  label,
  description,
  onConfirm,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  label: string;
  description: string;
  onConfirm: () => Promise<void>;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            {label}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
