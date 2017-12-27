// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import inquirer from 'inquirer'
import mkdirp from 'mkdirp'
import sinon from 'sinon'
import { expect } from 'chai'
import { join } from 'path'
import { PopApi } from 'pop-api'

import { Cli } from '../../src/middleware'
import {
  name,
  version
} from '../../package.json'

/** @test {Cli} */
describe('Cli', () => {
  /**
   * The Cli object to test
   * @type {Cli}
   */
  let cli: Cli

  /**
   * Stub for `console.error'
   * @type {Object}
   */
  let error: Object

  /**
   * Stub for `console.info'
   * @type {Object}
   */
  let info: Object

  /**
   * Stub for `process.exit'
   * @type {Object}
   */
  let exit: Object

  /**
   * The temporary directory to test with.
   * @type {string}
   */
  let tempDir: string

  /**
   * Hook for setting up the CLI tests.
   * @type {Function}
   */
  before(() => {
    exit = sinon.stub(process, 'exit')
    error = sinon.stub(console, 'error')
    info = sinon.stub(console, 'info')

    if (!global.logger) {
      global.logger = {
        info() {},
        error() {},
        debug() {},
        warn() {},
        log() {}
      }
    }

    process.env.TEMP_DIR = process.env.TEMP_DIR = join(...[
      __dirname,
      '..',
      '..',
      'tmp'
    ])
    tempDir = process.env.TEMP_DIR
    mkdirp.sync(tempDir)

    cli = new Cli(PopApi, {
      argv: ['', '', '-m', 'pretty'],
      name,
      version
    })
  })

  /** @test {Cli._Name} */
  it('should check the static attributes of the Cli', () => {
    expect(Cli._Name).to.exist
    expect(Cli._Name).to.be.a('string')
  })

  /** @test {Cli#constructor} */
  it('should create a new Cli instance without arguments to parse', () => {
    const cli = new Cli(PopApi, {
      name,
      version
    })
    expect(cli).to.be.an('object')
  })

  /** @test {Cli#constructor} */
  it('should check the attributes of the Cli', () => {
    expect(cli.program).to.exist
    expect(cli.program).to.be.an('object')
    expect(cli.name).to.exist
    expect(cli.name).to.be.a('string')
    expect(cli.database).to.exist
    expect(cli.database).to.be.an('object')
  })

  /** @test {Cli#initOptions} */
  it('should initiate the options for the Cli', () => {
    const val = cli.initOptions(version)
    expect(val).to.be.an('object')
  })

  /** @test {Cli#getHelp} */
  it('should get the help message', () => {
    const val = cli.getHelp()
    expect(val).to.be.an('array')
  })

  /** @test {Cli#_movieTorrent} */
  it('should construct a movie torrent object', () => {
    const torrent = cli._movieTorrent('magnet', {
      seeds: 1,
      peers: 1
    }, {})
    expect(torrent).to.be.an('object')
  })

  /** @test {Cli#_showTorrent} */
  it('should construct a show torrent object', () => {
    const torrent = cli._showTorrent('magnet', {
      seeds: 1,
      peers: 1
    })
    expect(torrent).to.be.an('object')
  })

  /**
   * A helper function to test the '_'getTorrent' method.
   * @param {!string} type - The type to test.
   * @returns {undefined}
   */
  function testGetTorrent(type: string): void {
    /** @test {Cli#_getTorrent} */
    it('should get a torrent from a link', done => {
      const link = 'magnet:?xt=urn:btih:9228628504cc40efa57bf38e85c9e3bd2c572b5b&dn=archlinux-2017.10.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce'
      cli._getTorrent(link, type).then(res => {
        expect(res).to.be.an('object')
        done()
      }).catch(done)
    })
  }

  // Execute the tests.
  ['movie', 'tvshow'].map(testGetTorrent)

  /** @test {Cli#_getTorrent} */
  it('should fail to get a torrent from a number', done => {
    cli._getTorrent('', 'movie')
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /**
   * Helper function to test the '_moviePrompt' method.
   * @param {!boolean} isAnime - Use the anime model.
   * @returns {undefined}
   */
  function testMoviePrompt(isAnime: boolean): void {
    /** @test {Cli#_moviePrompt} */
    it('should run the movie content prompt', done => {
      const stub = sinon.stub(inquirer, 'prompt')
      stub.resolves({
        imdb: 'tt1234567',
        torrent: 'magnet:?xt=urn:btih:9228628504cc40efa57bf38e85c9e3bd2c572b5b&dn=archlinux-2017.10.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce',
        quality: '720p',
        language: 'en'
      })

      cli._moviePrompt('movie', isAnime).then(res => {
        expect(res).to.be.undefined
        stub.restore()

        done()
      }).catch(done)
    })
  }

  // Execute the tests.
  [false, true].map(testMoviePrompt)

  /** @test {Cli#_moviePrompt} */
  it('should catch an error when running the movie content prompt', done => {
    const stub = sinon.stub(inquirer, 'prompt')
    stub.resolves({})

    cli._moviePrompt('movie').then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /**
   * Helper function to test the '_showPrompt' method.
   * @param {!boolean} isAnime - Use the anime model.
   * @returns {undefined}
   */
  function testShowPrompt(isAnime: boolean): void {
    /** @test {Cli#_showPrompt} */
    it('should run the show content prompt', done => {
      const stub = sinon.stub(inquirer, 'prompt')
      stub.resolves({
        imdb: 'tt1234567',
        torrent: 'magnet:?xt=urn:btih:9228628504cc40efa57bf38e85c9e3bd2c572b5b&dn=archlinux-2017.10.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce',
        quality: '720p',
        season: 1,
        episode: 1
      })

      cli._showPrompt('show', isAnime).then(res => {
        expect(res).to.be.undefined
        stub.restore()

        done()
      }).catch(done)
    })
  }

  // Execute the tests.
  [false, true].map(testShowPrompt)

  /** @test {Cli#_showPrompt} */
  it('should catch an error when running the show content prompt', done => {
    const stub = sinon.stub(inquirer, 'prompt')
    stub.resolves({})

    cli._showPrompt('show').then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /**
   * Helper function to test the `_content` method.
   * @param {!string} t - The type of content to test.
   * @returns {undefined}
   */
  function testContent(t: string): void {
    /** @test {Cli#_content} */
    it(`should run the --content option with the '${t}'`, done => {
      const stub = sinon.stub(inquirer, 'prompt')
      stub.resolves({
        torrent: 'magnet:?xt=urn:btih:9228628504cc40efa57bf38e85c9e3bd2c572b5b&dn=archlinux-2017.10.01-x86_64.iso&tr=udp://tracker.archlinux.org:6969&tr=http://tracker.archlinux.org:6969/announce'
      })

      cli._content(t).then(() => {
        stub.restore()
        done()
      }).catch(done)
    })
  }

  [
    'animemovie',
    'animeshow',
    'movie',
    'show'
  ].map(testContent)

  /** @test {Cli#_content} */
  it('should run the --content option with the \'null\'', done => {
    cli._content('').then(res => {
      expect(res).to.be.undefined
      done()
    }).catch(done)
  })

  /** @test {Cli#_export} */
  it('should run the --export option with the \'show\' option', done => {
    delete process.env.TEMP_DIR
    cli._export('show').then(res => {
      expect(res).to.be.undefined
      done()
    }).catch(done)
  })

  /** @test {CLI#_export} */
  it('should run the --export option and reject the result', done => {
    const stub = sinon.stub(cli.database, 'exportFile')
    stub.rejects()

    const e = join(...[
      __dirname,
      '..',
      '..',
      'package.json'
    ])
    cli._export(e).then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {Cli#_import} */
  it('should run the --import option with a non-existing file as input', done => {
    cli._import('/path/to/faulty/file.json').then(res => {
      expect(res).to.be.undefined
      done()
    }).catch(done)
  })

  /**
   * Helper method to test the `_import` method.
   * @param {!boolean} confirm - The user input.
   * @returns {void}
   */
  function testImport(confirm: boolean): void {
    const msg = confirm ? 'confirms' : 'cancels'

    /** @test {Cli#_import} */
    it(`should run the --import option with a file as input and the user ${msg}`, done => {
      const stub = sinon.stub(inquirer, 'prompt')
      stub.resolves({ confirm })

      const i = join(...[
        tempDir,
        'shows.json'
      ])
      cli._import(i).then(res => {
        expect(res).to.be.undefined

        stub.restore()
        done()
      }).catch(done)
    })
  }

  // Execute the tests.
  [true, false].map(testImport)

  /** @test {CLI#_import} */
  it('should run the --import option and reject the result', done => {
    const stub = sinon.stub(inquirer, 'prompt')
    stub.rejects()

    const i = join(...[
      __dirname,
      '..',
      '..',
      'package.json'
    ])
    cli._import(i).then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {Cli#_run} */
  it('should invoke the --content option', done => {
    const stub = sinon.stub(inquirer, 'prompt')
    stub.resolves()

    cli.run({}, [
      '',
      '',
      '--content',
      'show'
    ]).then(res => {
      expect(res).to.be.undefined
      cli.program.content = false
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {Cli#_run} */
  it('should invoke the --export', done => {
    const stub = sinon.stub(cli.database, 'exportFile')
    stub.resolves()

    cli.run({}, [
      '',
      '',
      '--export',
      'show'
    ]).then(res => {
      expect(res).to.be.undefined
      cli.program.export = false
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {Cli#_run} */
  it('should invoke the --import option', done => {
    const stub = sinon.stub(inquirer, 'prompt')
    stub.resolves()

    cli.run({}, [
      '',
      '',
      '--import',
      join(...[
        tempDir,
        'shows.json'
      ])
    ]).then(res => {
      expect(res).to.be.undefined
      cli.program.import = false
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {Cli#_run} */
  it('should invoke the --start option', () => {
    const res = cli.run({}, [
      '',
      '',
      '--start'
    ])

    expect(res).to.be.undefined
    cli.program.start = false
  })

  /** @test {Cli#_run} */
  it('should not parse the arguments since there are none', () => {
    const stub = sinon.stub(cli.program, 'outputHelp')

    const res = cli.run({})
    expect(res).to.be.undefined

    stub.restore()
  })

  /**
   * Hook for tearing down the Cli tests.
   * @type {Function}
   */
  after(() => {
    error.restore()
    info.restore()
    exit.restore()
  })
})
