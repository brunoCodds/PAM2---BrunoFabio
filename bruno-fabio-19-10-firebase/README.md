# FeedbackHub

Mural simples de sugestões e opiniões sobre projetos. React Native Web (Expo SDK 57) + Firebase Authentication + Cloud Firestore.

## Executar localmente

Requisitos: Node.js 20.19.4 ou mais novo.

```bash
npm install
npm run web        # abre em http://localhost:8081
```

As credenciais do Firebase ficam no arquivo `.env` (já preenchido com o projeto `login-pag-462fe`).
Para usar outro projeto, copie `.env.example` para `.env` e preencha os valores.
Depois de mudar o `.env`, reinicie o `npm run web`.

Para gerar a versão de produção: `npm run build:web` (saída na pasta `dist/`, hospedável em qualquer servidor estático com fallback para `index.html`).

## Configurar o Firebase (faça uma vez)

Sem estes três passos o app abre, mas não cadastra, não loga e não publica.

1. **Ativar login por e-mail e senha**
   Console do Firebase > projeto `login-pag-462fe` > **Authentication** > **Começar** > aba **Método de login** > **E-mail/senha** > ativar > **Salvar**.

2. **Criar o banco Cloud Firestore**
   **Firestore Database** > **Criar banco de dados** > escolha a região (por exemplo `southamerica-east1`, São Paulo) > inicie em **modo de produção**.

3. **Publicar as regras de segurança**
   **Firestore Database** > aba **Regras** > apague o conteúdo, cole o conteúdo do arquivo `firestore.rules` deste projeto > **Publicar**.

   Alternativa pela linha de comando: `npx firebase-tools login` e depois `npx firebase-tools deploy --only firestore:rules` (os arquivos `firebase.json` e `.firebaserc` já estão prontos).

Em **Authentication > Configurações > Domínios autorizados**, `localhost` já vem liberado. Ao hospedar o site, adicione o domínio dele ali.

## Estrutura de dados

**users/{uid}**: `uid`, `name`, `email`, `bio`, `createdAt`
**posts/{id}**: `title`, `description`, `authorId`, `authorName`, `createdAt`, `updatedAt` (o `id` é o ID do documento)

## O que as regras garantem

| Ação | Quem pode |
| --- | --- |
| Ver publicações | Qualquer visitante |
| Publicar | Usuário logado, com o próprio `authorId` e o nome do próprio perfil |
| Editar ou excluir publicação | Somente o autor (`authorId` e `createdAt` não mudam) |
| Ler ou editar perfil | Somente o dono (e-mail, uid e data de criação não mudam) |
| Apagar perfil | Ninguém |

Também há validação de tamanho e de campos permitidos, para que ninguém grave dados fora do formato mesmo chamando o Firestore direto.

## Estrutura do código

```
App.js                      navegação e rotas (/, /entrar, /cadastro, /perfil)
src/firebase/config.js      inicialização do Firebase (lê o .env)
src/services/               acesso ao Firebase: authService, usersService, postsService
src/context/AuthContext.js  usuário logado + perfil, sessão mantida ao atualizar
src/screens/                Home (mural), Login, Cadastro, Perfil
src/components/             Button, TextField, Card, Navbar, PostCard, PostForm, Toast...
src/utils/                  validação, mensagens de erro, formatação de datas
firestore.rules             regras de segurança
```

## Decisões de projeto

- **Nome do autor nas publicações:** o nome fica gravado em cada publicação (`authorName`). Ao salvar o perfil, o app atualiza as publicações antigas da pessoa. Se essa segunda etapa falhar, o perfil é salvo e o app avisa; salvar de novo repete a sincronização.
- **Cadastro com falha parcial:** se a conta é criada mas o perfil não é gravado no Firestore, a conta é desfeita para que a pessoa possa tentar de novo. Contas sem perfil (casos antigos) ganham o perfil automaticamente no próximo login.
- **Mural:** mostra as 100 publicações mais recentes, atualizadas em tempo real.
- **Analytics:** o `getAnalytics` do trecho de configuração original não foi incluído, porque o escopo não pede e ele não é necessário para autenticação ou Firestore.
- **Plataforma:** o foco é a web (`npm run web`). A chave `apiKey` do Firebase Web não é secreta; quem protege os dados são as regras do Firestore. Se quiser, restrinja a chave por domínio no Google Cloud Console (APIs e serviços > Credenciais).
