"use server"

import prismaDb from './prisma'

/// POST ROUTES ///

async function postNewIncome({ amount, description, tag, date, userId, deductFromInventory, inventoryItemId, inventoryQuantity }) {
	const resolvedDate = new Date(date)
	if (isNaN(resolvedDate.getDate())) {
		throw new Error("Date string is not properly formatted.")
	}
	const result = await prismaDb.income.create({
		data: {
			amount,
			description,
			tag,
			date: resolvedDate,
			userId,
			deduct_from_inventory: deductFromInventory,
			inventory_skuId: inventoryItemId,
			inventory_qty: inventoryQuantity
		}
	})
}

async function postNewExpense({ amount, description, tag, date, userId }) {
	const resolvedDate = new Date(date)
	if (isNaN(resolvedDate.getDate())) {
		throw new Error("Date string is not properly formatted.")
	}
	const result = await prismaDb.expense.create({
		data: {
			amount,
			description,
			tag,
			date: resolvedDate,
			userId
		}
	})
}

async function postNewTagIfNotExists(tagName, userId, expense = 0) {
	return prismaDb.tag.upsert({
		where: {
			name_userId: {
				userId,
				name: tagName
			}
		},
		update: {},
		create: {
			userId,
			name: tagName,
			expenseTag: expense
		}
	})
}

async function postNewInventoryItem(skuId, userId, name, description, amount, unitPrice, category) {
	return prismaDb.inventory.create({
		data: {
			skuId,
			userId,
			name,
			description,
			amount,
			unitPrice,
			category
		}
	})
}

/// GET ROUTES ///

async function getIncome(user) {
	return prismaDb.income.findMany({
		select: {
			id: true,
			date: true,
			description: true,
			amount: true,
			tag: true
		},
		where: {
			userId: user
		}
	})
}

async function getExpenses(user) {
	return prismaDb.expense.findMany({
		select: {
			id: true,
			date: true,
			description: true,
			amount: true,
			tag: true
		},
		where: {
			userId: user
		}
	})
}

async function getValidTags(userId) {
	return prismaDb.tag.findMany({
		where: {
			OR: [
				{ userId: userId },
				{ userId: "global" }
			]
		}
	});
}

async function getValidExpenseTags(userId) {
	return prismaDb.tag.findMany({
		where: {
			OR: [
				{ userId: userId },
				{ userId: "global" }
			],
			expenseTag: 1
		}
	});
}

async function getInventoryItemBySkuId(skuId, userId) {
	return prismaDb.inventory.findFirst({
		where: {
			skuId
		}
	})
}

/// PATCH ROUTES ///

async function patchExpenses(user, id, { amount, description, tag, date }) {
	console.log(id)
	console.log(user)
	const result = await prismaDb.expense.findFirst({
		where: {
			AND: {
				id,
				userId: user
			}
		}
	})
	if (!result) throw new Error("Could not locate expense entry.")
	const resolvedDate = new Date(date)
	if (isNaN(resolvedDate.getDate())) {
		throw new Error("Date string is not properly formatted.")
	}
	else await prismaDb.expense.update({
		where: {
			id,
			userId: user
		},
		data: {
			amount,
			description,
			tag,
			date: resolvedDate
		}
	})
}

async function patchIncome(user, id, { amount, description, tag, date }) {
	console.log(id)
	console.log(user)
	const result = await prismaDb.income.findFirst({
		where: {
			AND: {
				id,
				userId: user
			}
		}
	})
	if (!result) throw new Error("Could not locate income entry.")
	const resolvedDate = new Date(date)
	if (isNaN(resolvedDate.getDate())) {
		throw new Error("Date string is not properly formatted.")
	}
	else await prismaDb.income.update({
		where: {
			id,
			userId: user
		},
		data: {
			amount,
			description,
			tag,
			date: resolvedDate
		}
	})
}

async function patchInventoryAmountSell(skuId, userId, amount) {
	return prismaDb.inventory.update({
		where: {
			skuId,
			userId
		},
		data: {
			amount: {
				increment: -(amount)
			}
		}
	})
}

async function patchInventoryAmountBuy(skuId, userId, amount) {
	return prismaDb.inventory.update({
		where: {
			skuId,
			userId
		},
		data: {
			amount: {
				increment: amount
			}
		}
	})
}

/// DELETE ROUTES ///

async function deleteExpenses(user, id) {
	return prismaDb.expense.delete({
		where: {
			id,
			userId: user
		}
	})
}

async function deleteIncome(user, id) {
	return prismaDb.income.delete({
		where: {
			id,
			userId: user
		}
	})
}

/// FILE EXPORTS ///

export { postNewIncome, getIncome, postNewExpense, getExpenses, patchExpenses, deleteExpenses, patchIncome, deleteIncome, postNewTagIfNotExists, getInventoryItemBySkuId, getValidTags, getValidExpenseTags, postNewInventoryItem, patchInventoryAmountBuy, patchInventoryAmountSell }
