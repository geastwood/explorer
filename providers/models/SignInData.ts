import VctcInfo from './VctcInfo'
import SignInVctcInfo from './SignInVctcInfo'
import get from 'lodash.get'

class SignInData {
  private actions: string[]
  private domain: string
  private nftNames: string[]
  private meta: SignInVctcInfo

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

  static createFromTrx = (trx: any) => {
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

    return new SignInData(
      ['issuetoken', 'addmeta'],
      issueToken.domain,
      get(issueToken, 'data.names', []),
      new SignInVctcInfo(
        JSON.parse(get(addmeta, 'data.value', {})),
        get(addmeta, 'data.creator')
      )
    )
  }
}
export default SignInData
