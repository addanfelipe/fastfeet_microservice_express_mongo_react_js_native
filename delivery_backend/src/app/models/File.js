import mongo from '../../mongo';

const fileSchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

fileSchema.virtual('url').get(() => `${process.env.APP_URL}/files/${this.path}`);

fileSchema.virtual('id').get(function() { return this._id; });
fileSchema.set('toJSON', { virtuals: true });

export default mongo.model('File', fileSchema);
