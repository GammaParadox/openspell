import { PrismaClient as PrismaClientClass } from "@prisma/client";
import type { Json } from "@prisma/client";

export const PrismaClient: typeof PrismaClientClass;
export function getPrisma(): PrismaClientClass;
export function connectDb(): Promise<void>;
export function disconnectDb(): Promise<void>;
export type Json = Json;
