# Receita Fácil

Buscador de receitas feito com Expo (React Native Web) e a API gratuita [TheMealDB](https://www.themealdb.com/api.php).

## Como rodar

```bash
npm install
npm run web          # servidor de desenvolvimento no navegador
npx expo export --platform web   # build estático em dist/
```

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| `screens/` | Início, Busca, Categorias, Categoria, Receita e Favoritos |
| `components/` | Cards, grade responsiva, barra de busca, cabeçalho, estados de carregamento/erro/vazio |
| `services/mealdb.js` | Todas as chamadas à API (fetch), com cache em memória |
| `utils/` | Navegação por hash, favoritos (localStorage), tradução de termos PT→EN, helpers |
| `styles/theme.js` | Cores, fontes, raios e sombras |

## Observações

- A TheMealDB é em inglês. A busca converte termos comuns em português (ex.: *frango* → *chicken*) e avisa quando isso acontece.
- Favoritos ficam no `localStorage` (`receita-facil:favorites:v1`) e funcionam sem rede.
- A navegação usa o hash da URL (`#/receita/52772`), então o botão voltar, F5 e links compartilháveis funcionam.
