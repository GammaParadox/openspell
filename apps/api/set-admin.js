/**
 * Script to set a user as admin
 * Usage: node set-admin.js <username>
 * 
 * This script requires direct database access and should only be run
 * by someone with database write permissions (system administrator).
 */

const { PrismaClient } = require('@openspell/db');
const prisma = new PrismaClient();

async function setAdmin(username, isAdmin = true) {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      console.error(`Error: User "${username}" not found`);
      process.exit(1);
    }
    
    await prisma.user.update({
      where: { username },
      data: { isAdmin }
    });
    
    console.log(`Successfully ${isAdmin ? 'granted' : 'revoked'} admin privileges for user: ${username}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get username from command line arguments
const username = process.argv[2];
const isAdmin = process.argv[3] !== 'false'; // Default to true unless explicitly 'false'

if (!username) {
  console.error('Usage: node set-admin.js <username> [true|false]');
  console.error('Example: node set-admin.js admin true');
  console.error('Example: node set-admin.js user123 false');
  process.exit(1);
}

setAdmin(username, isAdmin);

