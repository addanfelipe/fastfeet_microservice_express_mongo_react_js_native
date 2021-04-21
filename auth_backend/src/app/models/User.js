import bcrypt from 'bcryptjs'
import mongo from '../../mongo'


const UserSchema = new mongo.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
})

UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 8)
  next()
})

UserSchema.static('checkPassword', async function(password, password_hash) {
  return await bcrypt.compare(password, password_hash)
})


UserSchema.static('initialDatabase', function() {
  this.create({ email: 'admin@fastfeet.com', name: 'Distribuidora FastFeet', password: '123456' }).then(() => {}).catch(() => {})
})


export default mongo.model('User', UserSchema)
