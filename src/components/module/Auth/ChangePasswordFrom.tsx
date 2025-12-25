"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/services/auth/changePassword";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [state, formAction, pending] = useActionState(changePassword, null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state && state.error && !state.success) {
      toast.error(state.message);
    }
    if (state && state.success) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <FieldGroup>

        {/* Old Password */}
        <Field>
          <FieldLabel htmlFor="oldPassword">Old Password</FieldLabel>
          <div className="relative">
            <Input
              id="oldPassword"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              placeholder="******"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showOldPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
            </button>
          </div>
          <InputFieldError field="oldPassword" state={state} />
        </Field>

        {/* New Password */}
        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="******"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showNewPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
            </button>
          </div>
          <InputFieldError field="newPassword" state={state} />
        </Field>

        {/* Confirm New Password */}
        <Field>
          <FieldLabel htmlFor="confirmNewPassword">Confirm New Password</FieldLabel>
          <div className="relative">
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="******"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeIcon size={18} />
              ) : (
                <EyeOffIcon size={18} />
              )}
            </button>
          </div>
          <InputFieldError field="confirmNewPassword" state={state} />
        </Field>

        {/* Submit */}
        <Field>
          <Button type="submit" disabled={pending} className="cursor-pointer">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change Password"}
          </Button>
        </Field>

      </FieldGroup>
    </form>
  );
};

export default ChangePasswordForm;
