import mongo from '../../mongo';

const problemSchema = new mongo.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    delivery_id: {
      type: Number,
      required: true,
    },
  },
  { collection: 'delivery_problems' }
);

export default mongo.model('Problem', problemSchema);
