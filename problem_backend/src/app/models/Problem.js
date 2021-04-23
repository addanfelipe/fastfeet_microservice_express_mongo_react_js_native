import mongo from '../../mongo';

const problemSchema = new mongo.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    delivery: {
      type: mongo.ObjectId,
      required: true,
      ref: 'Delivery',
    },
  },
  { collection: 'delivery_problems' }
);

export default mongo.model('Problem', problemSchema);
