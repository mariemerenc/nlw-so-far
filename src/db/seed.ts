import { client, db } from "."
import { goalCompletions, goals } from "./schema"
import dayjs from 'dayjs'

async function seed(){
    await db.delete(goalCompletions)
    await db.delete(goals)

    const result = await db
        .insert(goals)
        .values([
            { title: 'Ler 30min por dia', desiredWeeklyFrequency: 7 },
            { title: 'Ir ao kung-fu', desiredWeeklyFrequency: 3 },
            { title: 'Estudar teoria musical', desiredWeeklyFrequency: 1 },
        ])
        .returning()

    const startOfWeek = dayjs().startOf('week')

    await db.insert(goalCompletions).values([
        { goalId: result[0].id, createdAt: startOfWeek.toDate() },
        { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
    ])
}

seed().finally(() => {
    client.end()
})