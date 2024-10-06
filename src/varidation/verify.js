"use strict";

class UserVerify {
  
  // Method to validate email format
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Method to verify that password is strong enough (at least 4 characters)
  static verifyStrongPassword(password) {
    const minLength = 4;  // Minimum password length
    return password.length >= minLength;
  }

}

// Exporting the class for use in other parts of the application
export default UserVerify;
