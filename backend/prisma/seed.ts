import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create SuperAdmin user
  const hashedPassword = await bcrypt.hash('superadmin123', 10);

  // Check if superadmin exists by username
  let superAdmin = await prisma.usersMaster.findFirst({ where: { username: 'superadmin' } });
  if (!superAdmin) {
    superAdmin = await prisma.usersMaster.create({
      data: {
        username: 'superadmin',
        password: hashedPassword,
        mobileNumber: '1234567890',
        isActive: true,
      },
    });
  }

  console.log('SuperAdmin created:', superAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 