import * as Yup from 'yup';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';
import problemasService from '../services/problemasService';

class DeliveryController {
  async index(req, res) {
    // eslint-disable-next-line prefer-const
    const { q, page = 1, limit = 5, id_in } = req.query;

    let { fk_exclude } = req.query;
    fk_exclude = fk_exclude ? JSON.parse(fk_exclude) : [];

    const filter = {};

    if (id_in) {
      filter._id = { $in: JSON.parse(id_in) };
    }

    if (q) {
//      filter.product = { [Op.iLike]: `%${q}%` };
    }

    const total = await Delivery.countDocuments({ filter });
    let deliveries = await Delivery.find(
      filter,
      null,
      {
        sort: { created_at: 'desc' },
        limit,
        skip: (page - 1) * limit,
      }
    )
      .populate('recipient')
      .populate('deliveryman')
      .populate('signature');

    if (!fk_exclude.includes('problems')) {
      // ids unicos de delivery
      const delivery_id_in = [
        ...deliveries.reduce(
          (current, item) => current.add(item.id),
          new Set()
        ),
      ];

      let { items: problems } = (
        await problemasService.request(req.auth).get('/problems', {
          params: {
            limit: 1000,
            delivery_id_in: JSON.stringify(delivery_id_in),
            fk_exclude: JSON.stringify(['delivery']),
          },
        })
      ).data;

      problems = problems.reduce((current, item) => {
        current[item.delivery_id] = current[item.delivery_id] || [];
        current[item.delivery_id].push(item);
        return current;
      }, {});

      if (Object.keys(problems).length > 0) {
        deliveries = deliveries.map(delivery => {
          delivery.dataValues.problems = problems[delivery.id];
          return delivery;
        });
      }
    }

    return res.json({
      limit,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items: deliveries,
    });
  }

  async show(req, res) {
    const delivery = await Delivery.find({ _id: req.params.id }, [
      'id',
      'product',
      'canceled_at',
      'start_date',
      'end_date',
    ])
      .populate('recipient')
      .populate('deliveryman');

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    return res.json(delivery);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipient = await Recipient.findById(recipient_id);
    const deliveryman = await Deliveryman.findById(deliveryman_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const { _id } = await Delivery.create({
      recipient: recipient_id,
      deliveryman: deliveryman_id,
      product,
    });

    await Queue.add(NewDeliveryMail.key, {
      deliveryman,
      product,
      recipient,
    });

    return res.json({ id: _id, recipient_id, deliveryman_id, product });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    // check if delivery exists
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    // check if recipient exists
    if (recipient_id && !(await Recipient.findById(recipient_id))) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    // check if deliveryman exissts
    if (deliveryman_id && !(await Deliveryman.findById(deliveryman_id))) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const deliveryUpdated = await delivery.update(req.body);

    return res.json(deliveryUpdated);
  }

  async delete(req, res) {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Can not find this delivery' });
    }

    return res.status(200).json();
  }

  async cancel(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findById(id)
      .populate('delivery')
      .populate('recipient');

    if (!delivery) {
      return res.status(500).json({
        error: 'The delivery that reference this problem has been not found',
      });
    }

    const { canceled_at } = await delivery.update({
      canceled_at: new Date(),
    });

    delivery.canceled_at = canceled_at;

    return res.json();
  }
}

export default new DeliveryController();
