import Provider from 'butter-provider';

const typeEnum = Object.keys(Provider.ItemType).map(key => Provider.ItemType[key]);

/**
 * Base structure of the database content.
 * @type {Object}
 */
export default {
  _id: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  title: String,
  year: Number,
  slug: String,
  synopsis: String,
  runtime: Number,
  rating: {
    percentage: Number,
    watching: Number,
    votes: Number
  },
  images: {
    banner: String,
    fanart: String,
    poster: String
  },
  genres: [String],
  type: {
    type: String,
    enum: typeEnum
  }
};
