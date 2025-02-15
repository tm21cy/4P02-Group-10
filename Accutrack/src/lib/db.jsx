"use server"

import prismaDb from './prisma'

async function postNewIncome({amount, description, tag, date, userId}) {
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
			userId
		}
	})
}

async function postNewExpense({amount, description, tag, date, userId}) {
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

async function patchExpenses(user, id, {amount, description, tag, date}) {
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

async function deleteExpenses(user, id) {
	return prismaDb.expense.delete({
		where: {
			id,
			userId: user
		}
	})
}

export { postNewIncome, getIncome, postNewExpense, getExpenses, patchExpenses, deleteExpenses }
