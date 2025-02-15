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
	console.log(result)
}

async function getIncome(user) {
	return prismaDb.income.findMany({
		select: {
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

export { postNewIncome, getIncome }
