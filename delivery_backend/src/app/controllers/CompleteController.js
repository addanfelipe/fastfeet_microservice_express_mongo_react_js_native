import mongo from '../../mongo';
import File from '../models/File';
import Delivery from '../models/Delivery';

class CompleteController {
  async update(req, res) {
    if (!mongo.Types.ObjectId.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const delivery = await Delivery.findOne({
      _id: req.params.delivery_id,
      deliveryman: req.params.deliveryman_id,
    });

    if (!delivery) {
      return res
        .status(400)
        .json({ error: "There's no delivery with this id" });
    }

    if (!delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'This delivery must been taken out before.' });
    }

    const { signature_id } = req.body;
    const signature = await File.findById(signature_id);

    if (!signature) {
      return res
        .status(400)
        .json({ error: "There's no signature with this id" });
    }

    const {
      id,
      recipient,
      deliveryman,
      product,
      start_date,
      end_date,
    } = await delivery.updateOne({ signature_id }, { end_date: new Date() });

    return res.json({
      id,
      recipient_id: recipient._id,
      deliveryman_id: deliveryman._id,
      product,
      start_date,
      end_date,
    });
  }
}

export default new CompleteController();
