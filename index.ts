import hogan from 'hogan.js'
import * as fs from 'fs'
import { join } from 'path'
import VoluntaryActivitySign from './providers/VoluntaryActivitySign'

const decryptFn = (raw: string) => 'decrypted'

const run = async () => {
  const base = fs.readFileSync(
    join(__dirname, './templates/base.mustache'),
    'utf8'
  )

  const voluntaryActivitySign = new VoluntaryActivitySign({
    domain: 'va.AzE5.ey5A6LNvvMt',
    signInTrx:
      'a281fa0f5484fe49e5bc28291e4436d7dbfdaf956fbef0fb1685b0ea93756825',
    signOutTrx:
      'e88e29f9931292fd19a12a5efde071404761f5dc5fcaf294a53bb9985cd64c4e',
    decryptFn,
  })

  // get the custom html from provider and render them directly unescaped
  const html = await voluntaryActivitySign.render()

  const partner = fs.readFileSync(
    join(__dirname, './templates/partner.mustache'),
    'utf8'
  )

  // compile the base tempalte
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
