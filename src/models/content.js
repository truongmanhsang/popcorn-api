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
  year: String,
  slug: String,
  synopsis: String,
  runtime: String,
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
  genres: [String]
};
