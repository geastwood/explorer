import hogan from 'hogan.js'
import * as fs from 'fs'
import VoluntaryActivitySign from './providers/VoluntaryActivitySign'

const run = async () => {
  const base = fs.readFileSync('./templates/base.mustache', 'utf8')
  const voluntaryActivitySign = new VoluntaryActivitySign({
    appId: '1',
    signInOnChainId: '2',
    signOutOnChainId: '3',
  })

  const html = await voluntaryActivitySign.render()

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
        html,
      },
    },
    {
      partner: hogan.compile(partner),
    }
  )
  console.log(rtn)
}

run()
