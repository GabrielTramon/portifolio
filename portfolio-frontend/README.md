# portfolio-frontend

Frontend do portfólio pessoal, construído com **Next.js 16**, **React 19** e **Tailwind CSS 4**.

---

## Requisitos

- Node.js 18+
- npm ou yarn

---

## Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (porta 5000)
npm run dev

# Build de produção
npm run build
npm run start
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base do backend. Disponível no cliente e no servidor. |

---

## Estrutura de pastas

```
src/
├── app/                    # Rotas (Next.js App Router)
│   ├── layout.tsx          # Layout raiz (fonts, metadados globais)
│   ├── globals.css         # Estilos globais + Tailwind
│   ├── page.tsx            # Rota /
│   ├── portfolio/
│   │   └── page.tsx        # Rota /portfolio (Server Component)
│   ├── login/
│   │   └── page.tsx        # Rota /login (Client Component)
│   └── dashboard/
│       └── page.tsx        # Rota /dashboard (Client Component)
└── lib/
    └── api.ts              # Tipos compartilhados e API_URL
```

---

## Como criar uma nova página

### 1. Criar o arquivo da rota

Cada pasta dentro de `src/app/` representa uma rota. Crie a pasta e o arquivo `page.tsx`:

```
src/app/sobre/page.tsx  →  rota /sobre
```

### 2. Server Component (padrão — sem interatividade)

Use quando a página busca dados no servidor ou não precisa de estado/eventos:

```tsx
// src/app/sobre/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre — Gabriel Tramontin",
  description: "Página sobre mim.",
};

export default async function SobrePage() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/alguma-rota`, {
    cache: "no-store",
  }).then((r) => r.json());

  return (
    <main>
      <h1>{data.titulo}</h1>
    </main>
  );
}
```

**Quando usar:** páginas públicas, SEO importante, dados que não mudam por usuário.

### 3. Client Component (com interatividade)

Adicione `"use client"` no topo quando precisar de `useState`, `useEffect`, eventos do browser ou `localStorage`:

```tsx
// src/app/contato/page.tsx
"use client";

import { useState, FormEvent } from "react";

export default function ContatoPage() {
  const [nome, setNome] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // chamada à API com fetch
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={nome} onChange={(e) => setNome(e.target.value)} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

**Quando usar:** formulários, modais, dashboards, páginas que dependem de autenticação no browser.

---

## Como estruturar uma página complexa

Para páginas maiores, separe componentes dentro da própria pasta da rota:

```
src/app/dashboard/
├── page.tsx              # Componente principal (ponto de entrada)
├── ProjectCard.tsx       # Componente de card do projeto
├── ProjectModal.tsx      # Modal de criação/edição
└── useProjects.ts        # Hook com lógica de fetch e estado
```

**Regra:** `page.tsx` apenas compõe os componentes. A lógica fica nos hooks, os componentes ficam separados.

Exemplo de `page.tsx` enxuto:

```tsx
"use client";

import { useProjects } from "./useProjects";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

export default function DashboardPage() {
  const { projects, createProject, deleteProject } = useProjects();

  return (
    <main>
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} onDelete={deleteProject} />
      ))}
    </main>
  );
}
```

---

## Padrões adotados

| Decisão | Motivo |
|---|---|
| Server Components por padrão | Melhor performance e SEO. Só adiciona `"use client"` quando necessário. |
| `cache: "no-store"` nos fetches do portfólio | Dados sempre atualizados sem necessidade de revalidação manual. |
| Tipos compartilhados em `src/lib/api.ts` | Evita duplicação de interfaces entre páginas. |
| JWT no `localStorage` | Simples para MVP. Em produção, considerar `httpOnly cookies`. |
