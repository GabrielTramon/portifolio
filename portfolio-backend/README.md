# portfolio-backend

API REST do portfólio pessoal, construída com **Express 5**, **TypeScript**, **Prisma 7** e **PostgreSQL**.

Arquitetura baseada em **Clean Architecture** com separação em camadas: `domain`, `application`, `infra` e `presentation`.

---

## Requisitos

- Node.js 18+
- PostgreSQL rodando localmente ou via serviço (Railway, Render, etc.)

---

## Instalação e execução

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente (veja seção abaixo)
cp .env.example .env

# Criar tabelas no banco
npm run prisma:migrate

# Gerar cliente Prisma
npm run prisma:generate

# Criar usuário admin
npm run seed

# Rodar em desenvolvimento (porta 3003)
npm run dev
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/portfolio"
JWT_SECRET="troque_para_uma_string_longa_e_aleatoria"
PORT=3003
CORS_ORIGIN=http://localhost:5000
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL |
| `JWT_SECRET` | Segredo para assinar os tokens JWT |
| `PORT` | Porta do servidor (padrão: 3003) |
| `CORS_ORIGIN` | Origem permitida pelo CORS |

---

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia com ts-node em modo de desenvolvimento |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm run start` | Executa o build compilado |
| `npm run prisma:migrate` | Cria/atualiza tabelas no banco |
| `npm run prisma:generate` | Gera o cliente Prisma tipado |
| `npm run prisma:studio` | Abre o Prisma Studio (visualizador do banco) |
| `npm run seed` | Cria o usuário admin no banco |

---

## Rotas disponíveis

```
POST   /auth/login
GET    /projects
POST   /projects
GET    /projects/:id
PUT    /projects/:id
DELETE /projects/:id
```

---

## Estrutura de pastas

```
src/
├── generated/prisma/          # Cliente Prisma gerado (não editar)
├── lib/
│   └── prisma.ts              # Instância compartilhada do PrismaClient
├── modules/
│   └── projects/              # Módulo de projetos
│       ├── domain/            # Regras de negócio (sem framework)
│       │   ├── entities/
│       │   ├── enums/
│       │   └── repositories/  # Interfaces (contratos)
│       ├── application/       # Casos de uso + DTOs
│       │   ├── dtos/
│       │   └── use-cases/
│       ├── infra/             # Implementações concretas (Prisma)
│       │   └── repositories/
│       └── presentation/      # HTTP (Express)
│           ├── controllers/
│           ├── validators/
│           └── routes/
├── routes/
│   └── auth.ts                # Rotas de autenticação
├── shared/
│   └── errors/
│       ├── AppError.ts        # Erro de negócio com statusCode
│       └── errorHandler.ts    # Middleware global de erros
├── index.ts                   # Entry point do servidor
└── seed.ts                    # Seed do usuário admin
```

---

## Como adicionar um novo módulo

Siga o mesmo padrão do módulo `projects`. O exemplo abaixo cria um módulo `experiences`.

### 1. Adicionar o model no Prisma

Edite `prisma/schema.prisma`:

```prisma
model Experience {
  id          String   @id @default(cuid())
  company     String
  role        String
  startDate   DateTime
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Execute:

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 2. Criar a estrutura de pastas

```
src/modules/experiences/
├── domain/
│   ├── entities/
│   │   └── Experience.ts
│   └── repositories/
│       └── IExperienceRepository.ts
├── application/
│   ├── dtos/
│   │   ├── CreateExperienceDTO.ts
│   │   ├── UpdateExperienceDTO.ts
│   │   └── ExperienceResponseDTO.ts
│   └── use-cases/
│       ├── CreateExperienceUseCase.ts
│       ├── ListExperiencesUseCase.ts
│       ├── GetExperienceByIdUseCase.ts
│       ├── UpdateExperienceUseCase.ts
│       └── DeleteExperienceUseCase.ts
├── infra/
│   └── repositories/
│       └── PrismaExperienceRepository.ts
└── presentation/
    ├── controllers/
    │   └── ExperienceController.ts
    ├── validators/
    │   └── experienceValidators.ts
    └── routes/
        └── experienceRoutes.ts
```

### 3. Domain — Entidade

```typescript
// src/modules/experiences/domain/entities/Experience.ts
export class Experience {
  constructor(
    public readonly id: string,
    public readonly company: string,
    public readonly role: string,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
```

### 4. Domain — Interface do repositório

```typescript
// src/modules/experiences/domain/repositories/IExperienceRepository.ts
import { Experience } from "../entities/Experience";

export interface CreateExperienceData {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
}

export interface IExperienceRepository {
  create(data: CreateExperienceData): Promise<Experience>;
  findAll(): Promise<Experience[]>;
  findById(id: string): Promise<Experience | null>;
  delete(id: string): Promise<void>;
}
```

### 5. Application — DTOs

```typescript
// src/modules/experiences/application/dtos/CreateExperienceDTO.ts
export interface CreateExperienceDTO {
  company: string;
  role: string;
  startDate: string; // ISO date string vinda do request
  endDate?: string;
}
```

```typescript
// src/modules/experiences/application/dtos/ExperienceResponseDTO.ts
import { Experience } from "../../domain/entities/Experience";

export interface ExperienceResponseDTO {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toExperienceResponseDTO(e: Experience): ExperienceResponseDTO {
  return {
    id: e.id,
    company: e.company,
    role: e.role,
    startDate: e.startDate,
    endDate: e.endDate,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}
```

### 6. Application — Use Case (exemplo: criar)

```typescript
// src/modules/experiences/application/use-cases/CreateExperienceUseCase.ts
import { IExperienceRepository } from "../../domain/repositories/IExperienceRepository";
import { CreateExperienceDTO } from "../dtos/CreateExperienceDTO";
import { ExperienceResponseDTO, toExperienceResponseDTO } from "../dtos/ExperienceResponseDTO";

export class CreateExperienceUseCase {
  constructor(private readonly repository: IExperienceRepository) {}

  async execute(dto: CreateExperienceDTO): Promise<ExperienceResponseDTO> {
    const experience = await this.repository.create({
      company: dto.company,
      role: dto.role,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
    return toExperienceResponseDTO(experience);
  }
}
```

### 7. Infra — Implementação Prisma

```typescript
// src/modules/experiences/infra/repositories/PrismaExperienceRepository.ts
import { prisma } from "../../../../lib/prisma";
import { IExperienceRepository, CreateExperienceData } from "../../domain/repositories/IExperienceRepository";
import { Experience } from "../../domain/entities/Experience";

export class PrismaExperienceRepository implements IExperienceRepository {
  async create(data: CreateExperienceData): Promise<Experience> {
    const record = await prisma.experience.create({ data });
    return this.toDomain(record);
  }

  async findAll(): Promise<Experience[]> {
    const records = await prisma.experience.findMany({ orderBy: { startDate: "desc" } });
    return records.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Experience | null> {
    const record = await prisma.experience.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.experience.delete({ where: { id } });
  }

  private toDomain(record: {
    id: string;
    company: string;
    role: string;
    startDate: Date;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Experience {
    return new Experience(
      record.id,
      record.company,
      record.role,
      record.startDate,
      record.endDate,
      record.createdAt,
      record.updatedAt,
    );
  }
}
```

### 8. Presentation — Controller

```typescript
// src/modules/experiences/presentation/controllers/ExperienceController.ts
import { Request, Response, NextFunction } from "express";
import { CreateExperienceUseCase } from "../../application/use-cases/CreateExperienceUseCase";
import { ListExperiencesUseCase } from "../../application/use-cases/ListExperiencesUseCase";

export class ExperienceController {
  constructor(
    private readonly createExperienceUseCase: CreateExperienceUseCase,
    private readonly listExperiencesUseCase: ListExperiencesUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const experience = await this.createExperienceUseCase.execute(req.body);
      res.status(201).json({ data: experience });
    } catch (error) {
      next(error);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const experiences = await this.listExperiencesUseCase.execute();
      res.json({ data: experiences });
    } catch (error) {
      next(error);
    }
  }
}
```

### 9. Presentation — Rotas (composição + injeção de dependência)

```typescript
// src/modules/experiences/presentation/routes/experienceRoutes.ts
import { Router } from "express";
import { PrismaExperienceRepository } from "../../infra/repositories/PrismaExperienceRepository";
import { CreateExperienceUseCase } from "../../application/use-cases/CreateExperienceUseCase";
import { ListExperiencesUseCase } from "../../application/use-cases/ListExperiencesUseCase";
import { ExperienceController } from "../controllers/ExperienceController";

const router = Router();
const repository = new PrismaExperienceRepository();

const controller = new ExperienceController(
  new CreateExperienceUseCase(repository),
  new ListExperiencesUseCase(repository),
);

router.post("/", (req, res, next) => controller.create(req, res, next));
router.get("/", (req, res, next) => controller.list(req, res, next));

export default router;
```

### 10. Registrar no servidor

Em `src/index.ts`, adicione:

```typescript
import experienceRouter from "./modules/experiences/presentation/routes/experienceRoutes";

app.use("/experiences", experienceRouter);
```

---

## Responsabilidade de cada camada

| Camada | Conhece | Não conhece |
|---|---|---|
| `domain` | Entidades, enums, interfaces | Express, Prisma, DTOs |
| `application` | Domain, DTOs, AppError | Express, Prisma |
| `infra` | Domain, Prisma, lib/prisma | Express, DTOs |
| `presentation` | Application, validators, Express | Prisma, banco de dados |
| `shared` | Nada externo | — |

**Fluxo de uma requisição:**

```
Request → Route → Controller → Validator → UseCase → Repository (interface)
                                                           ↓
                                               PrismaRepository (implementação)
                                                           ↓
                                                      PostgreSQL
```

---

## Tratamento de erros

Todos os erros de negócio devem usar `AppError`:

```typescript
import { AppError } from "../../../../shared/errors/AppError";

throw new AppError("Recurso não encontrado", 404);
throw new AppError("Email já cadastrado", 409);
throw new AppError("Dados inválidos", 400);
```

O middleware `errorHandler` em `src/index.ts` captura tudo e retorna:

```json
{ "error": "mensagem do erro" }
```

Erros não tratados retornam `500 Internal server error`.
