import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";

interface DeleteAlertDialogProps<T> {
  item: T;
  onDelete: (item: T) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const DeleteAlertDialog = <T,>({
  item,
  onDelete,
  title,
  description,
  children,
}: DeleteAlertDialogProps<T>) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="dark:hover:bg-primary">Cancel</AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={() => onDelete(item)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;
