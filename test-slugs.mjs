import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      invitations: true,
    }
  });

  for (const user of users) {
    console.log(`User: ${user.email} (ID: ${user.id})`);
    console.log(`  Username: ${user.username}`);
    if (user.invitations && user.invitations.length > 0) {
      for (const inv of user.invitations) {
        console.log(`  Invitation Slug: ${inv.slug} (ID: ${inv.id})`);
      }
    } else {
      console.log(`  No invitations found for user.`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
