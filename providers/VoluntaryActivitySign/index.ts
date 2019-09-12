import * as fs from 'fs'

import hogan from 'hogan.js'

import * as path from 'path'

import { getDomainDetail, getTrxDetail } from '../utils'
import SignData from '../models/SignInData'
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
    const { domain, signInTrx, signOutTrx } = this.opts

    const { vctcInfo } = await getDomainDetail(domain)
    const signInTrxDetail = await getTrxDetail(signInTrx)
    const signInData = SignData.createSignIn(signInTrxDetail)
    const signOutTrxDetail = await getTrxDetail(signOutTrx)
    const signOutData = SignData.createSignOut(signOutTrxDetail)

    const signInMetaData = signInData.getMeta()
    const signOutMetaData = signOutData.getMeta()
    let domainDisplayable = {}
    let signInDisplayable = {}
    let signOutDisplayable = {}

    if (vctcInfo) {
      domainDisplayable = vctcInfo.getMarkup()
    }

    if (signInMetaData) {
      signInDisplayable = signInMetaData.getMarkup()
    }

    if (signOutMetaData) {
      signOutDisplayable = signOutMetaData.getMarkup()
    }

    return {
      domain: {
        title: '所属域',
        id: domain,
        detail: domainDisplayable,
      },
      signIn: {
        title: '签到编号',
        id: get(signInData.getFullNames(), 0, ''),
        name: signInData.getNames().join(', '),
        trx: {
          blockNum: get(signInTrxDetail, 'block_num', 0),
          id: signInTrx,
        },
        detail: signInDisplayable,
      },
      signOut: {
        title: '签退编号',
        id: get(signOutData.getFullNames(), 0, ''),
        name: signOutData.getNames().join(', '),
        trx: {
          blockNum: get(signOutTrxDetail, 'block_num', 0),
          id: signOutTrx,
        },
        detail: signOutDisplayable,
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
    const sign = fs.readFileSync(
      path.join(__dirname, '../../templates/helpers/sign.mustache'),
      'utf8'
    )

    const compiled = hogan.compile(template)

    return compiled.render(data, {
      blockLink: hogan.compile(blockLink),
      everitoken: hogan.compile(everitokenLogo),
      domain: hogan.compile(domain),
      sign: hogan.compile(sign),
    })
  }
}

export default VoluntaryActivitySign
