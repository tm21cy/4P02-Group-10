import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getInventory(userId) {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      where: { userId }
    });
    return inventoryItems;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
}