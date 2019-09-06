import hogan from 'hogan.js'
import * as fs from 'fs'

const run = async () => {
  const base = fs.readFileSync('./templates/base.mustache', 'utf8')
  const voluntaryActivitySign = fs.readFileSync(
    './templates/voluntaryActivitySign.mustache',
    'utf8'
  )
  const partner = fs.readFileSync('./templates/partner.mustache', 'utf8')
  const template = hogan.compile(base)

  const rtn = template.render(
    {
      document: { title: '区块链数据信息查证' },
      showPartner: true,
      partner: {
        name: '志愿汇',
        logoUrl: 'assets/partner-logo.png',
        link: 'https://www.zyh365.com',
      },
      content: {
        name: 'fei',
        age: 1,
        signInRaw: {
          token: 'va.AzE5.ey5A6LNvvMt:vai.AzE5.F60vgQGraeT',
          display: '签到',
        },
        signOutRaw: {
          token: 'va.AzE5.ey5A6LNvvMt:vai.AzE5.F60vgQGraeT',
          display: '签退',
        },
      },
    },
    {
      template: hogan.compile(voluntaryActivitySign),
      partner: hogan.compile(partner),
    }
  )
  console.log(rtn)
}

run()
