"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createSpeciality } from "@/services/admin/specialityManagement";
import { Loader2, Plus } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

interface SpecialityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const SpecialityFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: SpecialityFormDialogProps) => {
  const [state, formAction, pending] = useActionState(createSpeciality, null);

  useEffect(() => {
    if (state) {
      if (!state.success && state.error) {
        toast.error(state.message);
      }
      if (state.success && state.data) {
        toast.success(state.message);
        onOpenChange(false);
        onSuccess();
      }
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="dark:hover:bg-primary cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add speciality</DialogTitle>
        </DialogHeader>
        <form id="specialityForm" action={formAction} className="space-y-5">
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="title" name="title" placeholder="e.g. cardiology" />
            <InputFieldError field="title" state={state} />
          </Field>
          <Field>
            <FieldLabel htmlFor="icon">Icon</FieldLabel>
            <Input type="file" id="icon" name="icon" />
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button className="cursor-pointer" form="specialityForm" type="submit" disabled={pending}>
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialityFormDialog;
