const { PrismaClient } = require("@prisma/client");

let prismaSingleton = null;

function getPrisma() {
  if (!prismaSingleton) prismaSingleton = new PrismaClient();
  return prismaSingleton;
}

async function connectDb() {
  await getPrisma().$connect();
}

async function disconnectDb() {
  if (!prismaSingleton) return;
  await prismaSingleton.$disconnect();
  prismaSingleton = null;
}

module.exports = {
  PrismaClient,
  getPrisma,
  connectDb,
  disconnectDb,
};

