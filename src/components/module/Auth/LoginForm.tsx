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
import { loginUser } from "@/services/auth/loginUser";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

const LoginForm = ({ redirect }: { redirect: string }) => {
  const [state, formAction, pending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (state && state.error && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="redirect" value={redirect} />
      <FieldGroup>
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
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
          <Button type="submit" disabled={pending} className="cursor-pointer">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link href="/register">Sign up</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
