import { identity, formatTime, htmlEntities } from '../utils'

type Data = {
  args: { [key: string]: string }
  type: string
}

type VctcMeta = {
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
  } = {
    id: [null, identity, 'id'],
    createTime: [null, formatTime, '创建时间'],
    title: [null, identity, '名称'],
    desc: [null, identity, '介绍'],
    organization: [null, identity, '机构'],
    organizationId: [null, identity, '机构Id'],
    openTime: [null, formatTime, '开始时间'],
    closeTime: [null, formatTime, '结束时间'],
    district: [null, identity, '地区'],
    address: [null, identity, '地址'],
    memo: [null, identity, '备注'],
    categories: [['first', 'second'], identity, '类别'],
  }

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
    const fields = Object.keys(this.defaultData)
    const data = this.getData()

    return fields.reduce(
      (carry, field, i) => {
        const [defaultValue, formatter, display] = this.defaultData[field]

        const tmp = formatter(data[field] || defaultValue)

        let markup = carry.markup

        if (tmp != null) {
          if (Array.isArray(tmp) && tmp.length > 0) {
            markup = carry.markup.concat(
              `<li><b>${display}</b>: ${tmp.map(htmlEntities).join('、')}</li>`
            )
          } else {
            markup = carry.markup.concat(
              `<li><b>${display}</b>: ${htmlEntities(tmp)}</li>`
            )
          }
        }

        if (i === fields.length - 1) {
          markup = `<ul>${markup}</ul>`
        }

        return {
          ...carry,
          [field]: tmp,
          markup,
        }
      },
      { markup: '' }
    )
  }
}

export default VctcInfo
