import * as fs from 'fs'
import hogan from 'hogan.js'
import * as path from 'path'

type Opts = {
  appId: string
  signInOnChainId: string
  signOutOnChainId: string
}

class VoluntaryActivitySign {
  private opts: Opts

  constructor(opts: Opts) {
    this.opts = opts
  }

  async get(): Promise<any> {
    return {
      domain: {
        id: 'va.AzE5.ey5A6LNvvMt',
        detail: {
          name: 'whatnot',
          description: 'description',
        },
      },
      signIn: {
        id: 'F60vgQGraeT',
        trx: {
          blockNum: 68721488,
          id:
            'a281fa0f5484fe49e5bc28291e4436d7dbfdaf956fbef0fb1685b0ea93756825',
        },
        detail: {
          createdTime: Date.now(),
        },
      },
      signOut: {
        id: 'rDFwOWFjtdE',
        trx: {
          blockNum: 68721489,
          id:
            'e88e29f9931292fd19a12a5efde071404761f5dc5fcaf294a53bb9985cd64c4e',
        },
        detail: {
          createdTime: Date.now(),
        },
      },
    }
  }

  async render() {
    const data = await this.get()
    const template = fs.readFileSync(
      path.join(__dirname, 'template.mustache'),
      'utf8'
    )
    const blockLink = fs.readFileSync(
      path.join(__dirname, '../../templates/helpers/blockLink.mustache'),
      'utf8'
    )

    const compiled = hogan.compile(template)

    return compiled.render(data, {
      blockLink: hogan.compile(blockLink),
    })
  }
}

export default VoluntaryActivitySign
