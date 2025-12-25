"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import MultiSelect from "@/components/shared/MultiSelect";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDoctor, updateDoctor } from "@/services/admin/doctorManagement";
import { IDoctor } from "@/types/doctor.interface";
import { ISpeciality } from "@/types/speciality.interface";
import { IErrorMessageState } from "@/utils/fieldErrorMessage";
import { EyeIcon, EyeOffIcon, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface DoctorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  doctor?: Partial<IDoctor>;
  specialities: ISpeciality[];
}

const DoctorFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
  doctor,
  specialities,
}: DoctorFormDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const isEdit = !!doctor;

  const [gender, setGender] = useState<string>(
    isEdit ? (doctor.gender as string) : "MALE"
  );
  const [selected, setSelected] = useState<string[]>(
    isEdit
      ? (doctor.doctorSpeciality?.map(
          (eachSpeciality) => eachSpeciality.speciality.id
        ) as string[])
      : []
  );
  const [updatedSpecialities, setUpdatedSpecialities] = useState<
    { specialityId: string; deleteFlag?: boolean }[]
  >([]);

  const [state, formAction, pending] = useActionState(
    isEdit ? updateDoctor.bind(null, doctor.id!) : createDoctor,
    null
  );

  useEffect(() => {
    if (state) {
      if (!state?.success && state.errors) {
        if (profilePhoto && profilePhotoInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(profilePhoto);
          profilePhotoInputRef.current.files = dataTransfer.files;
        }
      }

      if (!state.success && state.error) {
        toast.error(state.message);
      }
      if (state.success && state.data) {
        toast.success(state.message);
        onOpenChange(false);
        onSuccess();
      }
    }
  }, [state, profilePhoto]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="dark:hover:bg-primary cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {
            isEdit ? (<DialogTitle>Edit Doctor</DialogTitle>) : (<DialogTitle>Add Doctor</DialogTitle>)
          }
        </DialogHeader>
        <form id="doctorForm" action={formAction} className="space-y-5">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              placeholder="Full name"
              defaultValue={
                (state as IErrorMessageState)?.formData?.name ||
                (isEdit ? doctor.name : "")
              }
            />
            <InputFieldError field="name" state={state as IErrorMessageState} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              defaultValue={
                (state as IErrorMessageState)?.formData?.email ||
                (isEdit ? doctor.email : "")
              }
              disabled={isEdit}
            />
            <InputFieldError
              field="email"
              state={state as IErrorMessageState}
            />
          </Field>

          {!isEdit && (
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? (
                    <EyeIcon size={18} />
                  ) : (
                    <EyeOffIcon size={18} />
                  )}
                </button>
              </div>
              <InputFieldError
                field="password"
                state={state as IErrorMessageState}
              />
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
            <Input
              id="contactNumber"
              name="contactNumber"
              placeholder="Number (optional)"
              defaultValue={
                (state as IErrorMessageState)?.formData?.contactNumber ||
                (isEdit ? doctor.contactNumber : "")
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Input
              id="address"
              name="address"
              placeholder="Address (optional)"
              defaultValue={
                (state as IErrorMessageState)?.formData?.address ||
                (isEdit ? doctor.address : "")
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="registrationNumber">
              Registration Number
            </FieldLabel>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              placeholder="Medical registration number"
              defaultValue={
                (state as IErrorMessageState)?.formData?.registrationNumber ||
                (isEdit ? doctor.registrationNumber : "")
              }
            />
            <InputFieldError
              field="registrationNumber"
              state={state as IErrorMessageState}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="experience">Experience</FieldLabel>
            <Input
              type="number"
              id="experience"
              name="experience"
              placeholder="experience"
              defaultValue={
                (state as IErrorMessageState)?.formData?.experience ||
                (isEdit ? doctor.experience : "")
              }
            />
            <InputFieldError
              field="experience"
              state={state as IErrorMessageState}
            />
          </Field>

          <Field>
            <FieldLabel>Gender</FieldLabel>
            <Select
              name="gender"
              defaultValue={
                (state as IErrorMessageState)?.formData?.gender ||
                (isEdit ? doctor.gender : "MALE")
              }
              onValueChange={setGender}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
            <Input type="hidden" id="gender" name="gender" value={gender} />
            <InputFieldError
              field="gender"
              state={state as IErrorMessageState}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="appointmentFee">Appointment Fee</FieldLabel>
            <Input
              id="appointmentFee"
              name="appointmentFee"
              type="number"
              placeholder="e.g. 500"
              defaultValue={
                (state as IErrorMessageState)?.formData?.appointmentFee ||
                (isEdit ? doctor.appointmentFee : 0)
              }
            />
            <InputFieldError
              field="appointmentFee"
              state={state as IErrorMessageState}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="qualification">Qualification</FieldLabel>
            <Input
              id="qualification"
              name="qualification"
              placeholder="e.g. MBBS, MD"
              defaultValue={
                (state as IErrorMessageState)?.formData?.qualification ||
                (isEdit ? doctor.qualification : "")
              }
            />
            <InputFieldError
              field="qualification"
              state={state as IErrorMessageState}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="currentWorkingPlace">
              Current Working Place
            </FieldLabel>
            <Input
              id="currentWorkingPlace"
              name="currentWorkingPlace"
              placeholder="e.g. City Hospital"
              defaultValue={
                (state as IErrorMessageState)?.formData?.currentWorkingPlace ||
                (isEdit ? doctor.currentWorkingPlace : "")
              }
            />
            <InputFieldError
              field="currentWorkingPlace"
              state={state as IErrorMessageState}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="designation">Designation</FieldLabel>
            <Input
              id="designation"
              name="designation"
              placeholder="e.g. Consultant Cardiologist"
              defaultValue={
                (state as IErrorMessageState)?.formData?.designation ||
                (isEdit ? doctor.designation : "")
              }
            />
            <InputFieldError
              field="designation"
              state={state as IErrorMessageState}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="specialities">Specialities</FieldLabel>
            <Input
              type="hidden"
              id="specialities"
              name="specialities"
              value={isEdit ? JSON.stringify(updatedSpecialities) : selected}
            />
            <MultiSelect
              selected={selected}
              setSelected={setSelected}
              options={specialities}
              isEdit={isEdit ? isEdit : false}
              initialSpecialities={
                isEdit
                  ? doctor.doctorSpeciality?.map(
                      (speciality) => speciality.specialityId
                    )
                  : []
              }
              setPayload={setUpdatedSpecialities}
            />
            <InputFieldError
              field="specialities"
              state={state as IErrorMessageState}
            />
          </Field>

          <Field style={{ display: isEdit ? "none" : "block" }}>
            <FieldLabel htmlFor="profilePhoto">Profile photo</FieldLabel>
            <Input
              ref={profilePhotoInputRef}
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfilePhoto(file);
                }
                profilePhotoInputRef.current?.setAttribute;
              }}
            />
            {profilePhoto && (
              <div className="mt-2">
                <Image
                  src={URL.createObjectURL(profilePhoto)}
                  alt="Preview"
                  height={100}
                  width={100}
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <InputFieldError
              field="profilePhoto"
              state={state as IErrorMessageState}
            />
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            form="doctorForm"
            type="submit"
            disabled={pending}
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorFormDialog;
