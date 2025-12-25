export interface IErrorMessageState {
  success: boolean;
  errors: {
    field: string;
    message: string;
  }[];
  formData: any;
}

export const showFieldErrorMessage = (field: string, state: IErrorMessageState) => {
  if (state && !state.success && state.errors) {
    const error = state.errors.find((err: any) => err.field === field);
    if (error && error.message) {
      return error.message;
    } else {
      return null;
    }
  } else {
    return null;
  }
};
