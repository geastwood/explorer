import { htmlEntities } from '../utils'
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

  protected getDisplayable() {
    const fields = Object.keys(this.defaultData)
    const data = this.getData()

    return fields.reduce((carry, field) => {
      const [defaultValue, formatter, display] = this.defaultData[field]
      const value = formatter(data[field] || defaultValue)

      return {
        ...carry,
        [field]: { display, value },
      }
    }, {})
  }

  getMarkup() {
    const data: {
      [key: string]: { value: string; display: string }
    } = this.getDisplayable()
    const fields = Object.keys(data)

    const rtn = fields.reduce((carry, current, i) => {
      const { value, display }: { value: string; display: string } = data[
        current
      ]

      let markup = carry
      if (Array.isArray(value) && value.length > 0) {
        markup = markup.concat(
          `<li><b>${display}</b>: ${value.map(htmlEntities).join('、')}</li>`
        )
      } else if (value != null && !Array.isArray(value)) {
        markup = markup.concat(
          `<li><b>${display}</b>: ${htmlEntities(value)}</li>`
        )
      }

      if (i === fields.length - 1) {
        markup = `<ul>${markup}</ul>`
      }
      return markup
    }, '')

    return { ...data, markup: rtn }
  }
}

export default VctcInfo
