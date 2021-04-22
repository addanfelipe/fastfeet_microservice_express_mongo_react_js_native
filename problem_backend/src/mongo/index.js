import 'dotenv/config'
import mongoose from 'mongoose'


const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, } = process.env


mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`, {
  useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true,
})

mongoose.Promise = global.Promise


export default mongoose
