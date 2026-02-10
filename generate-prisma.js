// Workaround to generate Prisma client
const { execSync } = require('child_process');
const path = require('path');

// Set environment variables
process.env.PRISMA_HIDE_UPDATE_MESSAGE = 'true';
process.env.PRISMA_SKIP_POSTINSTALL_GENERATE = 'false';

const prismaPath = path.join(__dirname, 'node_modules', 'prisma', 'build', 'index.js');

try {
  console.log('Generating Prisma Client...');
  
  // Use the @prisma/cli package directly
  const { PrismaClient } = require('@prisma/client');
  console.log('PrismaClient available:', typeof PrismaClient);
  
  // If it already exists, we're done
  if (PrismaClient && typeof PrismaClient === 'function') {
    console.log('✓ Prisma Client already generated!');
    process.exit(0);
  }
} catch (error) {
  console.log('Prisma Client not found, generating...');
  
  try {
    // Try running the generator directly
    execSync('npx --yes prisma@5.20.0 generate --schema=./prisma/schema.prisma', {
      stdio: 'inherit',
      cwd: __dirname
    });
    console.log('✓ Generated Prisma Client successfully!');
  } catch (genError) {
    console.error('Failed to generate:', genError.message);
    process.exit(1);
  }
}
