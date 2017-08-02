// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import Express from 'express'
import { expect } from 'chai'

import Routes from '../../src/config/Routes'

/**
 * @test {Routes}
 * @flow
 */
describe('Routes', () => {
  /** @test {Routes._AnimeController} */
  it('should test if Routes has an _AnimeController', () => {
    expect(Routes._AnimeController).to.exist
  })

  /** @test {Routes._ExportController} */
  it('should check if Routes has an _ExportController', () => {
    expect(Routes._ExportController).to.exist
  })

  /** @test {Routes._IndexController} */
  it('should check if Routes has an _IndexController', () => {
    expect(Routes._IndexController).to.exist
  })

  /** @test {Routes._MovieController} */
  it('should test if Routes has an _MovieController', () => {
    expect(Routes._MovieController).to.exist
  })

  /** @test {Routes._ShowController} */
  it('should test if Routes has an _ShowController', () => {
    expect(Routes._ShowController).to.exist
  })

  /** @test {Routes.setupRoutes} */
  it('should test the setupRoutes method', () => {
    const express = new Express()
    Routes.setupRoutes(express)
    expect(express).to.not.equal(new Express())
  })
})
