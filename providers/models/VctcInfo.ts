export type Data = {
  args: { [key: string]: string }
  type: string
}

export type VctcMeta = {
  key: string
  value: string
  creator: string
}

class VctcInfo {
  private data: Data
  private creator: string

  static createFromMeta = (metas: VctcMeta[]) => {
    const info = metas.find(v => v.key === 'vctc.info')

    if (!info) {
      return null
    }

    return new VctcInfo(JSON.parse(info.value), info.creator)
  }

  defaultData: {
    [key: string]: [any, Function, string]
  } = {}

  constructor(data: Data, creator: string) {
    this.data = data
    this.creator = creator
  }

  getData() {
    return this.data.args
  }

  getType() {
    return this.data.type
  }

  getCreator() {
    return this.creator
  }

  getDisplayable() {
    throw new Error('Can not be called from here.')
  }
}

export default VctcInfo
