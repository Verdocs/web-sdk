import { VerdocsEndpoint, createProfile, convertToE164 } from "@verdocs/js-sdk";

export interface CreateProfileInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  org_name: string;
  phone?: string;
}

export interface CreateProfileFieldErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  org_name?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  form?: string;
}

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordComplex = (password: string): boolean => {
  const isUppercase = (ch: string) => /[A-Z]/.test(ch);
  const isLowercase = (ch: string) => /[a-z]/.test(ch);
  const isSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(ch);
  let countOfUpperCase = 0;
  let countOfLowerCase = 0;
  let countOfSpecialChar = 0;
  for (let i = 0; i < password.length; i++) {
    const ch = password.charAt(i);
    if (isUppercase(ch)) {
      countOfUpperCase++;
    } else if (isLowercase(ch)) {
      countOfLowerCase++;
    } else if (isSpecialChar(ch)) {
      countOfSpecialChar++;
    }
  }
  return password.length >= 8 && countOfLowerCase > 0 && countOfUpperCase > 0 && countOfSpecialChar > 0;
};

export const validateCreateProfileInput = (
  input: CreateProfileInput,
  confirmPassword: string,
): CreateProfileFieldErrors => {
  const errors: CreateProfileFieldErrors = {};
  const firstName = input.first_name.trim();
  const lastName = input.last_name.trim();
  const email = input.email.trim().toLowerCase();
  const orgName = input.org_name.trim();
  const password = input.password;

  if (!firstName) {
    errors.first_name = "First name is required.";
  }
  if (!lastName) {
    errors.last_name = "Last name is required.";
  }
  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!orgName) {
    errors.org_name = "Organization name is required.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (!isPasswordComplex(password)) {
    errors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, and a special character.";
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export const hasFieldErrors = (errors: CreateProfileFieldErrors): boolean => Object.keys(errors).length > 0;

export const submitCreateProfile = async (input: CreateProfileInput): Promise<void> => {
  const endpoint = new VerdocsEndpoint();
  endpoint.clearSession();

  const email = input.email.trim().toLowerCase();
  const phoneRaw = input.phone?.trim() ?? "";

  await createProfile(endpoint, {
    email,
    password: input.password,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    org_name: input.org_name.trim(),
    phone: phoneRaw ? convertToE164(phoneRaw) : "",
  });
};

export const getCreateProfileErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: { error?: string } }; message?: string };
  return err.response?.data?.error ?? err.message ?? "Something went wrong. Please try again.";
};
