import mongo from '../../mongo';

const deliverymenSchema = new mongo.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: mongo.ObjectId,
      ref: 'File',
    },
  },
  { collection: 'deliverymen' }
);

deliverymenSchema.virtual('id').get(function() { return this._id; });
deliverymenSchema.set('toJSON', { virtuals: true });

export default mongo.model('Deliveryman', deliverymenSchema);