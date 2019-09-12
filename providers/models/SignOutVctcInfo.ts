import VctcInfo, { Data } from './VctcInfo'
import { identity, formatTime } from '../utils'

class SignOutVctcInfo extends VctcInfo {
  defaultData: {
    [key: string]: [any, Function, string]
  } = {
    id: [null, identity, 'id'],
    createTime: [null, formatTime, '创建时间'],
    durationInMinutes: [null, identity, '活动时长'],
    userId: [null, identity, '名称'],
    memo: [null, identity, '备注'],
  }

  constructor(data: Data, creator: string) {
    super(data, creator)
  }
}

export default SignOutVctcInfo
