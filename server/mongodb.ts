import mongoose from 'mongoose'
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config()

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@root-z2j8z.mongodb.net/chatDB?retryWrites=true&w=majority`

export async function connectToDatabase() {
  await mongoose
    .connect(uri)
    .then(() => console.log(chalk.green('connected to MongoDB')))
    .catch(err => console.error(chalk.red('error connecting to MongoDB', err)))
}
