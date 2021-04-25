import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';

class RecipientController {
  async index(req, res) {
    const { q, page = 1, limit = 5 } = req.query;
    const filter = {};

    if (q) {
//      filter.name = { [Op.iLike]: `%${q}%` };
    }

    const total = await Recipient.countDocuments(filter);
    const recipients = await Recipient.find(
      filter,
      null,
    {
      sort: { id: 'desc' },
      limit: Number(limit),
      skip: (page - 1) * Number(limit),
    });

    return res.json({
      limit,
      page: Number(page),
      pages: Math.ceil(total / Number(limit) + total <= limit ? 1 : 0),
      total,
      items: recipients,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findById(id);

    if (!recipient) return res.status(400).json({});

    return res.json(recipient);
  }

  async update(req, res) {
    const recipientId = req.params.id;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const recipient = await Recipient.findByPk(recipientId);
    if (!recipient)
      return res.status(400).json({ error: 'Recipient not found' });

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not exists' });
    }

    await recipient.destroy();

    return res.status(200).json({});
  }
}

export default new RecipientController();
