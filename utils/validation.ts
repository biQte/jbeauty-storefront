import { validate as validateEmailValidator } from "email-validator";

export const validateEmail = (value: string | undefined): boolean => {
  return value ? validateEmailValidator(value) : false;
};
