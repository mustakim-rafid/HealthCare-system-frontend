import { ZodError } from "zod";
import { IErrorMessageState } from "./fieldErrorMessage";

interface IZodErrorResponse {
  success: false;
  error: ZodError;
}

export const getZodErrorResponse = (zodResponse: IZodErrorResponse, formData?: any): IErrorMessageState => {
  return {
    success: false,
    errors: zodResponse.error.issues.map((issue) => ({
      field: issue.path[0] as string,
      message: issue.message,
    })),
    formData
  };
};
