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
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'delivery_problems' }
);

problemSchema.index({ created_at: -1 })
problemSchema.index({ _id: 1, created_at: -1 })

problemSchema.virtual('id').get(function() {
  return this._id;
});
problemSchema.virtual('delivery');

problemSchema.set('toJSON', { virtuals: true });



export default mongo.model('Problem', problemSchema);
