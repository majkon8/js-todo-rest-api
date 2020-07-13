module.exports = {
  validateNewUserData: (data) => {
    const errors = [];
    const { email, password, confirmPassword } = data;
    const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegEx.test(email)) errors.push("Invalid email adddress");
    // minimum 8 characters, at least 1 lowercase letter, at least 1 uppercase letter, at least one number and at least 1 special character
    const passwordRegEx = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*.,])[\w!@#$%^&*.,]{8,}$/;
    if (!passwordRegEx.test(password)) errors.push("Password too weak");
    if (password !== confirmPassword) errors.push("Passwords must match");
    return errors;
  },
};
