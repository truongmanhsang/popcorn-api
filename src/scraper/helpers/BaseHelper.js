export default class BaseHelper {

  /**
   * Create an helper object for movie content.
   * @param {String} name - The name of the content provider.
   * @param {Object} model - The model to help fill.
   */
  constructor(name, model) {
    /**
     * The name of the torrent provider.
     * @type {String}
     */
    this._name = name;

    /**
     * The model to create or alter.
     * @type {Model}
     * @see http://mongoosejs.com/docs/models.html
     */
    this._model = model;
  }

  /**
   * Check that all images are fetched from the provider.
   * @param {Object} images - The images.
   * @param {String} holder - The image holder.
   * @throws {Error} - 'An image could not be found'.
   * @returns {void}
   */
  checkImages(images, holder) {
    for (const image of images) {
      if (image === holder) {
        throw new Error('An image could not be found');
      }
    }
  }

}
