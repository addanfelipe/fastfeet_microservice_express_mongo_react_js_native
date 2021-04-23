import { ObjectId } from 'mongoose';
import Problem from '../models/Problem';
import entregasService from '../services/entregasService';

class ProblemController {
  async index(req, res) {
    const { page = 1, id_in, delivery_id_in } = req.query;

    let { fk_exclude, limit } = req.query;
    fk_exclude = fk_exclude ? JSON.parse(fk_exclude) : [];
    limit = limit ? JSON.parse(limit) : 5;

    const filter = {};

    if (id_in) {
      filter._id = { $in: JSON.parse(id_in).map(id => ObjectId(id)) };
    }

    if (delivery_id_in) {
      filter.delivery = {
        $in: JSON.parse(delivery_id_in).map(id => ObjectId(id)),
      };
    }

    const total = await Problem.countDocuments(filter);

    let problems = await Problem.find(
      filter,
      ['id', 'description', 'created_at'],
      {
        sort: { created_at: 'desc' },
        limit,
        skip: (page - 1) * limit,
      }
    ).populate('delivery');

    if (!fk_exclude.includes('delivery')) {
      // ids unicos de delivery
      const delivery_in = [
        ...problems.reduce(
          (current, item) => current.add(item.delivery._id),
          new Set()
        ),
      ];

      let { items: deliverys } = (
        await entregasService.request(req.auth).get('/delivery', {
          params: {
            id_in: JSON.stringify(delivery_in),
            fk_exclude: JSON.stringify(['problems']),
          },
        })
      ).data;

      deliverys = deliverys.reduce((current, item) => {
        current[item.id] = item;
        return current;
      }, {});

      problems = problems.map(problem => {
        problem.dataValues.delivery = deliverys[problem.delivery_id];
        return problem;
      });

      problems = problems.filter(problem => problem.dataValues.delivery);
    }

    return res.json({
      limit,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items: problems,
    });
  }

  async store(req, res) {
    const { delivery_id } = req.body;

    const delivery = (
      await entregasService.request(req.auth).get(`/delivery/${delivery_id}`)
    ).data;

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const problem = await Problem.create({
      delivery_id,
      ...req.body,
    });

    return res.json(problem);
  }
}

export default new ProblemController();
