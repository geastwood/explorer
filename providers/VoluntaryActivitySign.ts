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
  async get(): any {}
  async render(): string {
    return 'template'
  }
}
