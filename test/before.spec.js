// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import dotenv from 'dotenv'
import { expect } from 'chai'
import { join } from 'path'

/**
 * Small setup to ensure the environment variables are set.
 * @ignore
 * @flow
 */
describe('dotenv', () => {
  /**
   * Hook for setting up the dotenv tests.
   * @type {Function}
   */
  before(() => {
    dotenv.config()

    // Set the TEMP_DIR environment variable if it is not set in the .env file.
    process.env.TEMP_DIR = process.env.TEMP_DIR
      ? process.env.TEMP_DIR
      : join(process.cwd(), 'tmp')
  })

  /** Dummy test to execute this module. */
  it('Dummy test to execute this module', () => {
    expect(true).to.be.true
  })
})
