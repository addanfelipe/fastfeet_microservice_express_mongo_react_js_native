import Delivery from '../models/Delivery';

class DeliveryStatusController {
  async index(req, res) {
    const completed = req.query.completed || false;
    const { page = 1 } = req.query;

    const deliveries = await Delivery.find(
      {
        deliveryman: req.params.id,
        canceled_at: null,
        signature: completed ? { $ne: null } : null,
      },
      ['id', 'product', 'start_date', 'end_date', 'created_at'],
      {
        limit: 6,
        skip: (page - 1) * 6,
        sort: { created_at: 'desc' },
      }
    ).populate('recipient');

    return res.status(200).json(deliveries);
  }
}

export default new DeliveryStatusController();
