import VctcInfo from './VctcInfo'
import SignInVctcInfo from './SignInVctcInfo'
import SignOutVctcInfo from './SignOutVctcInfo'

import get from 'lodash.get'

class SignData {
  private actions: string[]
  private domain: string
  private nftNames: string[]
  private meta: SignInVctcInfo | SignOutVctcInfo

  constructor(
    actions: string[],
    domain: string,
    nftNames: string[],
    meta: VctcInfo
  ) {
    this.actions = actions
    this.domain = domain
    this.nftNames = nftNames
    this.meta = meta
  }

  getNames = () => this.nftNames

  getFullNames = () => this.nftNames.map(name => `${this.domain}:${name}`)

  getMeta = () => this.meta

  getMetaData() {
    const meta = this.getMeta()
    if (!meta) {
      return null
    }

    return meta.getData()
  }

  static createSignIn = (trx: any) => SignData.createFromTrx(trx, true)
  static createSignOut = (trx: any) => SignData.createFromTrx(trx, false)
  static createFromTrx = (trx: any, isSignIn: boolean = true) => {
    const actions = get(trx, 'transaction.actions', [])

    if (actions.length !== 2) {
      throw new Error('SignIn transaction expects to have 2 actions')
    }

    const issueToken = actions.find(
      ({ name }: { name: string }) => name === 'issuetoken'
    )
    const addmeta = actions.find(
      ({ name }: { name: string }) => name === 'addmeta'
    )

    if (!issueToken || !addmeta) {
      throw new Error(
        'Failed to find action of either "issuetoken" or "addmeta"'
      )
    }

    const Ctor = isSignIn ? SignInVctcInfo : SignOutVctcInfo

    return new SignData(
      ['issuetoken', 'addmeta'],
      issueToken.domain,
      get(issueToken, 'data.names', []),
      new Ctor(
        JSON.parse(get(addmeta, 'data.value', {})),
        get(addmeta, 'data.creator')
      )
    )
  }
}

export default SignData
