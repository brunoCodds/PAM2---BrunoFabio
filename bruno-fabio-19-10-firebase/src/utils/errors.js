const AUTH_MESSAGES = {
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/invalid-email': 'O e-mail informado não é válido.',
  'auth/email-already-in-use': 'Já existe uma conta com este e-mail. Tente entrar.',
  'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique sua rede e tente novamente.',
  'auth/operation-not-allowed':
    'O login por e-mail e senha não está ativado no Firebase. Ative em Authentication > Método de login.',
};

const DATA_MESSAGES = {
  'permission-denied':
    'Permissão negada pelo Firestore. Confirme se as regras de segurança foram publicadas e se você está logado.',
  unavailable: 'Sem conexão com o servidor. Verifique sua internet e tente novamente.',
  unauthenticated: 'Sua sessão expirou. Entre novamente.',
  'not-found': 'Este item não existe mais.',
  'failed-precondition': 'O Firestore ainda não está pronto. Confirme se o banco de dados foi criado.',
};

const FALLBACK = 'Algo deu errado. Tente novamente em instantes.';

export const authErrorMessage = (error) => AUTH_MESSAGES[error?.code] ?? FALLBACK;

export const dataErrorMessage = (error) => DATA_MESSAGES[error?.code] ?? FALLBACK;
