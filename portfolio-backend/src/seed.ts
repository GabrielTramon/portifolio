import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

async function main() {
  const email = "gabrieljoaquim080706@gmail.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "Aranha300445";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Usuário admin criado: ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect() as Promise<void>);
