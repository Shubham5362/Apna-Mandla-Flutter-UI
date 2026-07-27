/**
 * Plus Code (Open Location Code) Utility
 * Validates Google Maps Plus Codes (e.g., "7J4V+3M", "7J4V+3M Mandla", "8FVC+7W")
 */

export interface PlusCodeValidationResult {
  isValid: boolean;
  message?: string;
}

export const validatePlusCode = (code: string): PlusCodeValidationResult => {
  if (!code || code.trim() === '') {
    return { isValid: true }; // Plus Code is optional
  }

  const trimmed = code.trim();
  
  // Standard Plus Code format: 4 to 8 alphanumerics, plus sign '+', 2 to 3 alphanumerics, optional locality
  // Plus code characters: 23456789CFGHJMPQRVWX (case insensitive)
  const plusCodeRegex = /^[2-9CFGHJMPQRVWX]{4,8}\+[2-9CFGHJMPQRVWX]{2,3}(\s+.+)?$/i;

  if (plusCodeRegex.test(trimmed)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: 'Invalid Plus Code format. Example: "7J4V+3M Mandla" or "8FVC+7W"'
  };
};

export const formatPlusCode = (code: string): string => {
  return code ? code.trim().toUpperCase() : '';
};
