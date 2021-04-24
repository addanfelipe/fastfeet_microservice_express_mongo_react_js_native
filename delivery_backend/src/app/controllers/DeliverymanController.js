import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { q, page = 1, limit = 5 } = req.query;
    const filter = {};

    if (q) {
      //      filter.name = { [Op.iLike]: `%${q}%` };
    }

    const total = await Deliveryman.countDocuments({ filter });

    const deliverymen = await Deliveryman.find(
      filter,
      ['id', 'name', 'email'],
      {
        skip: (page - 1) * Number(limit),
        sort: { id: 'desc' },
        limit: Number(limit),
      }
    )
      .populate('avatar');

    return res.json({
      limit,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
      items: deliverymen,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findById(id)
      .populate('avatar');

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const DeliverymanExists = await Deliveryman.findOne({
      email: req.body.email,
    });

    if (DeliverymanExists) {
      return res
        .status(400)
        .json({ error: 'A deliveryman with this email already exists' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const deliveryman = await Deliveryman.findById(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not exists' });
    }

    const { id, name, email } = await deliveryman.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findById(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not exists' });
    }

    await deliveryman.remove();

    return res.status(200).json({});
  }
}

export default new DeliverymanController();
