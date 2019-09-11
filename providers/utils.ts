import Evt from 'evtjs'
import DomainVctcInfo from './models/DomainVctcInfo'
import moment from 'moment'

export const getDomainDetail = async (name: string) => {
  const apiCaller = Evt({
    // replace with vctc helper
    endpoint: {
      host: 'mainnet4.everitoken.io',
      port: 443,
      protocol: 'https',
    },
  })

  const detail = await apiCaller.getDomainDetail(name)
  const vctcInfo = DomainVctcInfo.createFromMeta(detail.metas || [])

  return {
    detail,
    vctcInfo,
  }
}

export const formatTime = (time: number | null) => {
  if (!time) {
    return null
  }

  return moment(time).toLocaleString()
}

export const identity = <T>(v: T): T => v

export const htmlEntities = (str: string) => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
