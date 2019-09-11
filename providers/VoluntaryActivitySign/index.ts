import * as fs from 'fs'
import hogan from 'hogan.js'
import * as path from 'path'

type Opts = {
  domain: string
  signInTrx: string
  signOutTrx: string
  decryptFn: (payload: string) => string
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
          name: '扫大街',
          description: 'some really long description',
        },
      },
      signIn: {
        id: 'va.AzE5.ey5A6LNvvMt:vai.AzE5.F60vgQGraeT',
        name: 'F60vgQGraeT',
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
        id: 'va.AzE5.ey5A6LNvvMt:vao.AzE5.rDFwOWFjtdE',
        name: 'rDFwOWFjtdE',
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
    const everitokenLogo = fs.readFileSync(
      path.join(__dirname, '../../templates/helpers/everitoken.mustache'),
      'utf8'
    )
    const blockLink = fs.readFileSync(
      path.join(__dirname, '../../templates/helpers/blockLink.mustache'),
      'utf8'
    )
    const domain = fs.readFileSync(
      path.join(__dirname, '../../templates/helpers/domain.mustache'),
      'utf8'
    )

    const compiled = hogan.compile(template)

    return compiled.render(data, {
      blockLink: hogan.compile(blockLink),
      everitoken: hogan.compile(everitokenLogo),
      domain: hogan.compile(domain),
    })
  }
}

export default VoluntaryActivitySign
