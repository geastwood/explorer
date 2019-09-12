import Evt from 'evtjs'
import DomainVctcInfo from './models/DomainVctcInfo'
import moment from 'moment'

const getApiCaller = () =>
  Evt({
    // TODO: replace with vctc helper
    endpoint: {
      host: 'mainnet4.everitoken.io',
      port: 443,
      protocol: 'https',
    },
  })
export const getDomainDetail = async (name: string) => {
  const apiCaller = getApiCaller()
  const detail = await apiCaller.getDomainDetail(name)
  const vctcInfo = DomainVctcInfo.createFromMeta(detail.metas || [])

  return {
    detail,
    vctcInfo,
  }
}

export const getTrxDetail = async (trxId: string) => {
  const apiCaller = getApiCaller()
  return apiCaller.getTransactionDetailById(trxId)
}

export const formatTime = (time: string | number | null) => {
  if (!time) {
    return null
  }

  return moment(Number(time)).toLocaleString()
}

export const identity = <T>(v: T): T => v

export const htmlEntities = (str: string) => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
