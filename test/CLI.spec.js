// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import inquirer from 'inquirer'
import pMap from 'p-map'
import sinon from 'sinon'
import { Command } from 'commander'
import { expect } from 'chai'

import CLI from '../src/CLI'
import ProviderConfig from '../src/models/ProviderConfig'
import providerConfigs from '../src/scraper/configs'
import Server from '../src/Server'
import Setup from '../src/config/Setup'

/**
 * @test {CLI}
 * @flow
 */
describe('CLI', () => {
  /**
   * The CLI object to test
   * @type {CLI}
   */
  let cli: CLI

  /**
    * Remove the currently existing configurations from the database.
    * @param {!Function} [done=() => {}] - Function called to indicate the
    * process is done.
    * @return {Promise<undefined, Error>} - The promise to delete all the
    * configurations from the database.
    */
  function removeProviderConfigs(
    done: Function = () => {}
  ): Promise<void, Error> {
    return Setup.connectMongoDb().then(() => {
      return pMap(providerConfigs, config => {
        return ProviderConfig.findOneAndRemove({
          name: config.name
        })
      }, {
        concurrency: 1
      })
    }).then(() => done())
      .catch(done)
  }

  /**
   * Hook for setting up the CLI tests.
   * @type {Function}
   */
  before(done => {
    Server._Workers = 0
    cli = new CLI(true)

    removeProviderConfigs(done)
  })

  /** @test {CLI#constructor} */
  it('should check the attributes of the CLI', () => {
    expect(cli._program).to.exist
    expect(cli._program).to.be.an('object')
  })

  /** @test {CLI._Name} */
  it('should check the static attributes of the CLI', () => {
    expect(CLI._Name).to.exist
    expect(CLI._Name).to.be.a('string')
  })

  /** @test {CLI#_movieTorrent} */
  it('should construct a movie torrent object', () => {
    const torrent = cli._movieTorrent(
      'magnet',
      {
        seeds: 1,
        peers: 1
      },
      ['remote']
    )
    expect(torrent).to.be.an('object')
  })

  /** @test {CLI#_tvshowTorrent} */
  it('should construct a show torrent object', () => {
    const torrent = cli._tvshowTorrent(
      'magnet',
      {
        seeds: 1,
        peers: 1
      }
    )
    expect(torrent).to.be.an('object')
  })

  /** @test {CLI#_getTorrent} */
  it.skip('should get a torrent from a link', done => {
    const link = 'magnet:?xt=urn:btih:9228628504cc40efa57bf38e85c9e3bd2c572b5b&dn=archlinux-2017.10.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce'
    cli._getTorrent(link, 'movie')
      .then(res => {
        expect(res).to.be.an('object')
        done()
      })
      .catch(done)
  })

  /** @test {CLI#_getTorrent} */
  it('should failt to get a torrent from a number', done => {
    cli._getTorrent(1, 'movie')
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /** @test {CLI#_moviePrompt} */
  it('should run the movie content prompt', done => {
    const promptStub = sinon.stub(inquirer, 'prompt')
    const exitStub = sinon.stub(process, 'exit')
    promptStub.resolves({
      imdb: 'tt1234567',
      torrent: 'magnet:?xt=urn:btih:9228628504cc40efa57bf38e85c9e3bd2c572b5b&dn=archlinux-2017.10.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce',
      quality: '720p',
      language: 'en'
    })
    exitStub.value(() => {})

    cli._moviePrompt('movie').then(res => {
      expect(res).to.be.undefined

      promptStub.restore()
      exitStub.restore()

      done()
    }).catch(done)
  })

  /** @test {CLI#_moviePrompt} */
  it('should catch an error when running the movie content prompt', done => {
    const promptStub = sinon.stub(inquirer, 'prompt')
    const exitStub = sinon.stub(process, 'exit')
    promptStub.resolves({})
    exitStub.value(() => {})

    cli._moviePrompt('movie').then(res => {
      expect(res).to.be.undefined

      promptStub.restore()
      exitStub.restore()

      done()
    }).catch(done)
  })

  /** @test {CLI#_showPrompt} */
  it('should run the show content prompt', done => {
    const promptStub = sinon.stub(inquirer, 'prompt')
    const exitStub = sinon.stub(process, 'exit')
    promptStub.resolves({
      imdb: 'tt1234567',
      torrent: 'magnet:?xt=urn:btih:9228628504cc40efa57bf38e85c9e3bd2c572b5b&dn=archlinux-2017.10.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce',
      quality: '720p',
      season: 1,
      episode: 1
    })
    exitStub.value(() => {})

    cli._showPrompt('show').then(res => {
      expect(res).to.be.undefined

      promptStub.restore()
      exitStub.restore()

      done()
    }).catch(done)
  })

  /** @test {CLI#_showPrompt} */
  it('should catch an error when running the show content prompt', done => {
    const promptStub = sinon.stub(inquirer, 'prompt')
    const exitStub = sinon.stub(process, 'exit')
    promptStub.resolves({})
    exitStub.value(() => {})

    cli._showPrompt('show').then(res => {
      expect(res).to.be.undefined

      promptStub.restore()
      exitStub.restore()

      done()
    }).catch(done)
  })

  /** @test {CLI#_content} */
  it.skip('should run the --content option with the \'animemovie\'', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {CLI#_content} */
  it.skip('should run the --content option with the \'animeshow\'', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {CLI#_content} */
  it.skip('should run the --content option with the \'movie\'', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {CLI#_content} */
  it.skip('should run the --content option with the \'show\'', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {CLI#_export} */
  it('should run the --export option with the \'show\' option', done => {
    const stub = sinon.stub(process, 'exit')
    stub.value(() => {})

    cli._export('show').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {CLI#_import} */
  it.skip('should run the --import option with a file as input', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {CLI._help} */
  it('should print the --help option', () => {
    const val = CLI._help()
    expect(val).to.be.undefined
  })

  /** @test {CLI#_mode} */
  it('should run the --mode option with the \'pretty\' option', done => {
    const val = cli._mode('pretty')
    expect(val).to.be.undefined

    Server.closeApi(done)
  })

  /** @test {CLI#_mode} */
  it('should run the --mode option with the \'quiet\' option', done => {
    const val = cli._mode('quiet')
    expect(val).to.be.undefined

    Server.closeApi(done)
  })

  /** @test {CLI#_mode} */
  it('should run the --mode option with the \'ugly\' option', done => {
    const val = cli._mode('ugly')
    expect(val).to.be.undefined

    Server.closeApi(done)
  })

  /** @test {CLI#_mode} */
  it('should run the --mode option with the \'null\' option', done => {
    const val = cli._mode(null)
    expect(val).to.be.undefined

    Server.closeApi(done)
  })

  /** @test {CLI#_providers} */
  it('should run the --providers option', done => {
    cli._providers(process.env.NODE_ENV).then(res => {
      expect(res).to.be.undefined
      done()
    }).catch(done)
  })

  /** @test {CLI#run} */
  it('should invoke the --mode option', done => {
    cli._program.mode = 'pretty'

    const val = cli.run()
    expect(val).to.be.undefined

    cli._program.mode = false
    Server.closeApi(done)
  })

  /** @test {CLI#run} */
  it.skip('should invoke the --content option', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {CLI#run} */
  it('should invoke the --providers option', done => {
    cli._program.providers = process.env.NODE_ENV

    cli.run().then(res => {
      expect(res).to.be.undefined
      cli._program.providers = false

      Server.closeApi(done)
    }).catch(done)
  })

  /** @test {CLI#run} */
  it.skip('should invoke the --export', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {CLI#run} */
  it.skip('should invoke the --import option', done => {
    expect(true).to.be.true
    done()
  })

  /** @test {CLI#run} */
  it('should invoke no options and print the --help option', () => {
    const stub = sinon.createStubInstance(Command)

    const original = cli._program
    cli._program = stub

    const val = cli.run()
    expect(val).to.be.undefined

    cli._program = original
  })

  /**
   * Hook for tearing down the CLI tests.
   * @type {Function}
   */
  after(done => {
    removeProviderConfigs()
      .then(() => Setup.disconnectMongoDb())
      .then(() => done())
      .catch(done)
  })
})
