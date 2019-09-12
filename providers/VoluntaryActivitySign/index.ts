import * as fs from 'fs'

import hogan from 'hogan.js'

import * as path from 'path'

import { getDomainDetail, getTrxDetail } from '../utils'
import SignInData from '../models/SignInData'
import get from 'lodash.get'

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
    const { domain, signInTrx } = this.opts

    const { detail, vctcInfo } = await getDomainDetail(domain)
    const signInTrxDetail = await getTrxDetail(signInTrx)
    const signInData = SignInData.createFromTrx(signInTrxDetail)

    let domainDisplayable = {}

    if (vctcInfo) {
      domainDisplayable = vctcInfo.getMarkup()
    }

    return {
      domain: {
        id: domain,
        detail: domainDisplayable,
      },
      signIn: {
        id: get(signInData.getFullNames(), 0, ''),
        name: signInData.getNames().join(', '),
        trx: {
          blockNum: get(signInTrxDetail, 'block_num', 0),
          id: signInTrx,
        },
        detail: {
          createdTime: Date.now(),
        },
      },
      signOut: {
        id: 'va.AzE5.ey5A6LNvvMt:vao.AzE5.rDFwOWFjtdE',
        name: signInData.getNames().join(', '),
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
