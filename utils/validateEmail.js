const validateEmail = (email) => {
  const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(String(email).toLowerCase());
};

module.exports = validateEmail;
