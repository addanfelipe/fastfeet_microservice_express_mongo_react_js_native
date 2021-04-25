import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      name: Yup.string().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({ error: 'User exist.' });
    }

    const userResponse = await User.create(req.body)

    const { id, name } = userResponse;

    return res.json({
      user: {
        id,
        name,
      }
    });
  }
}

export default new UserController();
