/**
 * Client-Side Form Validation Helpers
 * Demonstrates input validation, regex sanitization, and password strength checks.
 * University Web Applications Assignment
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function getPasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  color: string;
} {
  if (!password) return { score: 0, label: 'Very Weak', color: '#c62828' };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 0:
    case 1:
      return { score: 1, label: 'Weak', color: '#e53935' };
    case 2:
      return { score: 2, label: 'Medium', color: '#fb8c00' };
    case 3:
      return { score: 3, label: 'Strong', color: '#43a047' };
    case 4:
    default:
      return { score: 4, label: 'Very Strong', color: '#2e7d32' };
  }
}

export function validateRegisterForm(values: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters long.';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please provide a properly formatted email (e.g., student@university.edu).';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (values.confirmPassword !== undefined && values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(values: { email: string; password: string }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!values.email || !values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please provide a valid email format.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateContentForm(values: {
  title: string;
  description: string;
  category: string;
  type: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!values.title || values.title.trim().length < 4) {
    errors.title = 'Title must be at least 4 characters long.';
  }
  if (!values.description || values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long.';
  }
  if (!values.category) {
    errors.category = 'Please select a content category.';
  }
  if (!values.type) {
    errors.type = 'Please select a media type (audio, video, or article).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
