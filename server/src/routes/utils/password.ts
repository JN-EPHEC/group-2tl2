export const validatePassword = (pwd: string, userAge: number): boolean => {
  if (!pwd) return false;
  if (pwd.length < 8) return false;
  if (pwd.length > 20) return false;

  const hasUpperCase = /[A-Z]/.test(pwd);
  const hasLowerCase = /[a-z]/.test(pwd);
  const hasNumbers = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  if (userAge < 12) {
    if (!hasLowerCase) return false;
    return true;
  } 
  
  if (userAge >= 12 && userAge < 65) {
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) return false;
    if (!hasSpecial) return false;
    return true;
  }

  // Section Senior : Une seule règle simple
  // Si on n'a ni chiffre NI majuscule, on rejette.
  const isInvalidSenior = !hasNumbers && !hasUpperCase;
  if (isInvalidSenior) return false;

  return true;
};