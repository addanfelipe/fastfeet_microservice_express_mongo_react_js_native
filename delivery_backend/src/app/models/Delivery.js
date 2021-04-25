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

deliverySchema.index({ deliveryman: 1 })
deliverySchema.index({ created_at: -1 })
deliverySchema.index({ _id: 1, created_at: -1 })

deliverySchema.virtual('problems').get(() => []);
deliverySchema.virtual('id').get(function() {
  return this._id;
});
deliverySchema.set('toJSON', { virtuals: true });

export default mongo.model('Delivery', deliverySchema);
