# Library Front (Vite + React + TypeScript)

Frontend para o “Library System”. Este app consome a API FastAPI do backend e oferece páginas para Acervo, Leitores, Empréstimos e Reservas.

## Pré-requisitos
- Node.js 18+
- Backend em execução antes do front (por padrão em http://localhost:8000)

## Configuração de Ambiente
- O front usa a variável `VITE_API_URL` para apontar para a API.
- Opcional: crie um arquivo `.env.local` dentro de `library-front/` com:

```
VITE_API_URL=http://localhost:8000
```

Autenticação: o front utiliza Basic Auth (padrão dev) `admin:password123`. Se alterar no backend, ajuste em `src/services/api.ts`.

## Instalação e Execução (Dev)

```bash
cd library-front
npm install
npm run dev
# Abra http://localhost:5173
```

## Build e Preview

```bash
npm run build
npm run preview
# Preview padrão em http://localhost:4173
```

## Páginas Principais
- Acervo: `/books` — lista e cadastro de livros; status com tradução.
- Leitores: `/users` — lista e cadastro de usuários; status com tradução.
- Empréstimos: `/loans` — lista, paginação, registrar empréstimo, devolver.
- Reservas: `/reservations` — lista, paginação, criar reserva (para livros indisponíveis), completar.

Todas as listagens usam paginação simples com “Anterior / Página / Próxima”. Há um indicador de conexão no topo confirmando acesso ao backend.

## Scripts
- `npm run dev`: inicia o Vite em modo desenvolvimento.
- `npm run build`: gera a build de produção.
- `npm run preview`: serve a build para teste local.

## Solução de Problemas
- CORS: verifique se o backend habilita CORS para `http://localhost:5173`.
- 401/403: confira as credenciais (Basic Auth) e variáveis no backend.
- API URL: ajuste `VITE_API_URL` caso a API não esteja em `localhost:8000`.
