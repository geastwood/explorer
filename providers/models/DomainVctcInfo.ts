import VctcInfo, { Data, VctcMeta } from './VctcInfo'
import { identity, formatTime  } from '../utils'

class DomainVctcInfo extends VctcInfo {
  static createFromMeta = (metas: VctcMeta[]) => {
    const info = metas.find(v => v.key === 'vctc.info')

    if (!info) {
      return null
    }

    return new DomainVctcInfo(JSON.parse(info.value), info.creator)
  }

  defaultData: {
    [key: string]: [any, Function, string]
  } = {
    id: [null, identity, 'id'],
    createTime: [null, formatTime, '创建时间'],
    title: ['title', identity, '名称'],
    desc: ['description', identity, '介绍'],
    organization: ['whato', identity, '机构'],
    organizationId: ['slkfe', identity, '机构Id'],
    openTime: [null, formatTime, '开始时间'],
    closeTime: [Date.now(), formatTime, '结束时间'],
    district: [null, identity, '地区'],
    address: [null, identity, '地址'],
    memo: [null, identity, '备注'],
    categories: [[], identity, '类别'],
  }

  constructor(data: Data, creator: string) {
    super(data, creator)
  }
}

export default DomainVctcInfo
