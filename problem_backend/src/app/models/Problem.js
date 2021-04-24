import mongo from '../../mongo';

const problemSchema = new mongo.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    delivery_id: {
      type: mongo.ObjectId,
      required: true,
    },
  },
  { collection: 'delivery_problems' }
);

problemSchema.virtual('id').get(function() {
  return this._id;
});
problemSchema.virtual('delivery');

problemSchema.set('toJSON', { virtuals: true });



export default mongo.model('Problem', problemSchema);
