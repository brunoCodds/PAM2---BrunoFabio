export const LIMITS = {
  nameMin: 2,
  nameMax: 60,
  passwordMin: 6,
  bioMax: 300,
  titleMin: 3,
  titleMax: 100,
  descriptionMin: 10,
  descriptionMax: 1000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Cada validador devolve a mensagem de erro, ou undefined quando o valor é válido.
function checkName(name) {
  if (!name) return 'Informe seu nome.';
  if (name.length < LIMITS.nameMin) return `O nome precisa ter pelo menos ${LIMITS.nameMin} caracteres.`;
  if (name.length > LIMITS.nameMax) return `O nome pode ter no máximo ${LIMITS.nameMax} caracteres.`;
}

function checkEmail(email) {
  if (!email) return 'Informe seu e-mail.';
  if (!EMAIL_PATTERN.test(email)) return 'Digite um e-mail válido, como nome@exemplo.com.';
}

function checkPassword(password) {
  if (!password) return 'Informe sua senha.';
  if (password.length < LIMITS.passwordMin) {
    return `A senha precisa ter pelo menos ${LIMITS.passwordMin} caracteres.`;
  }
}

function checkBio(bio) {
  if (bio.length > LIMITS.bioMax) return `A biografia pode ter no máximo ${LIMITS.bioMax} caracteres.`;
}

function checkTitle(title) {
  if (!title) return 'Dê um título à sua publicação.';
  if (title.length < LIMITS.titleMin) return `O título precisa ter pelo menos ${LIMITS.titleMin} caracteres.`;
  if (title.length > LIMITS.titleMax) return `O título pode ter no máximo ${LIMITS.titleMax} caracteres.`;
}

function checkDescription(description) {
  if (!description) return 'Escreva a descrição da sua publicação.';
  if (description.length < LIMITS.descriptionMin) {
    return `A descrição precisa ter pelo menos ${LIMITS.descriptionMin} caracteres.`;
  }
  if (description.length > LIMITS.descriptionMax) {
    return `A descrição pode ter no máximo ${LIMITS.descriptionMax} caracteres.`;
  }
}

function collect(checks) {
  const errors = {};
  for (const [field, message] of Object.entries(checks)) {
    if (message) errors[field] = message;
  }
  return errors;
}

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export const validateLogin = ({ email, password }) =>
  collect({ email: checkEmail(email), password: password ? undefined : 'Informe sua senha.' });

export const validateRegister = ({ name, email, password }) =>
  collect({ name: checkName(name), email: checkEmail(email), password: checkPassword(password) });

export const validateProfile = ({ name, bio }) =>
  collect({ name: checkName(name), bio: checkBio(bio) });

export const validatePost = ({ title, description }) =>
  collect({ title: checkTitle(title), description: checkDescription(description) });
