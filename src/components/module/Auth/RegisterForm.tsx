"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { registerPatient } from "@/services/auth/registerPatient";
import InputFieldError from "@/components/shared/InputFieldError";

const RegisterForm = () => {
  const [state, formAction, pending] = useActionState(registerPatient, null);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (state && state.error && !state.success) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={formAction}>
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="Your name" />
            <InputFieldError field="name" state={state} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
            />
            <InputFieldError field="email" state={state} />
          </Field>
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
                {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
              </button>
            </div>
            <InputFieldError field="password" state={state} />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="******"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
              >
                {showConfirmPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
              </button>
            </div>
            <InputFieldError field="confirmPassword" state={state} />
          </Field>
          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Your present address"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
            <Input
              id="contactNumber"
              name="contactNumber"
              type="text"
              placeholder="Your number"
            />
          </Field>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="file">Profile photo</FieldLabel>
            <Input id="file" name="file" type="file" />
          </Field>
          <Field>
            <Button type="submit" disabled={pending} className="cursor-pointer">
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/login">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
