import mongo from '../../mongo';

const deliverySchema = new mongo.Schema(
  {
    product: {
      type: String,
      required: true,
    },
    canceled_at: {
      type: Date,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    recipient: {
      type: mongo.ObjectId,
      ref: 'Recipient',
    },
    deliveryman: {
      type: mongo.ObjectId,
      ref: 'Deliveryman',
    },
    signature: {
      type: mongo.ObjectId,
      ref: 'File',
    },
  },
  { collection: 'deliveries' }
);

deliverySchema.virtual('problems').get(() => []);

export default mongo.model('Delivery', deliverySchema);
