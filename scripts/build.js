#!/usr/bin/env node
const cmd = require('commander')
const sh = require('shelljs')
const fs = require('fs')
const path = require('path')
const packageJson = require('../package.json')
const ora = require('ora')
const loading = ora()
const plist = require('plist')

cmd
  .version('0.0.1')
  .description('A cli for RN build')
  .option('-i, --ios', 'build ios')
  .option('-a, --android', 'build android')
  .option('-d, --dev', 'build dev')
  .option('-t, --test', 'build test')
  .option('-p, --prod', 'build production')
  .parse(process.argv)

if (!cmd.ios && !cmd.android) {
  console.log('你需要指定打包平台 eg：build --ios or --android')
  return
}

if (!cmd.dev && !cmd.test && !cmd.prod) {
  console.log('你需要指定环境参数 eg：build --dev or --test or --prod')
  return
}
/**
 * def bundle_android():
    print "Android 打包 开始>>>>"
    os.system("cd .."
            "&&mkdir -p android/app/build/outputs/apk/release"
            "&&rm -r android/app/build/outputs/apk/release/*"
            "&&echo 'android/app/build/outputs/apk/release 清除完成'")

    os.system("cd .. && react-native run-android --variant=release && echo '打包完成'")

 * */

const config = {
  storeFile: 'release.keystore',
  storePassword: 'stpwd1234',
  keyAlias: 'ktest',
}

const NewFileName = getNewFileName()
const ApkReleaseDir = path.resolve(__dirname, '../android/app/build/outputs/apk/release')
const NewApkFullPath = path.resolve(ApkReleaseDir, NewFileName)

if (cmd.android) {
  buildAndroid()
} else if (cmd.ios) {
  buildIos()
}

async function buildAndroid() {
  console.log('>>> 安卓打包开始')
  await genKeystore()
  cleanApkRelease()

  console.log('>>> 生成离线 bundle 包')
  {
    const bundlePath = path.resolve(__dirname, '../android/app/src/main/assets/index.android.bundle')
    const assetsDest = path.resolve(__dirname, './android/app/src/main/res')
    sh.mkdir('-p', path.dirname(bundlePath))

    sh.exec(
      `react-native bundle --entry-file index.js --platform android --dev false --bundle-output ${bundlePath} --assets-dest ${assetsDest}`,
    )
  }
  console.log('<<< 生成离线 bundle 完成')

  console.log('>>> 打包开始')
  {
    await bundleRelease()
  }
  console.log('<<< 打包成功')

  console.log('>>> 上传文件')
  {
    upload(NewApkFullPath)
  }
  console.log('<<< 上传文件结束')
}

function buildIos() {
  console.log('>>> iOS打包开始')
  const infoPlistPath = path.resolve(__dirname, '../ios/testbuild/Info.plist')
  // const serviceInfoPath = path.resolve(__dirname, '../ios/NotificationService/Info.plist')
  var info = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'))
  obj['CFBundleShortVersionString'] = packageJson.version
  obj['CFBundleVersion'] = parseInt(obj['CFBundleVersion']) + 1
  const xml = plist.build(info)
  fs.writeFileSync(infoPlistPath, xml)
}

function genKeystore() {
  const filePath = path.resolve(__dirname, `../android/app/${config.storeFile}`)
  const exists = fs.existsSync(filePath)
  if (exists) {
    console.log('keystore 已经存在跳过')
    Promise.resolve()
    return
  }

  return new Promise((resolve, reject) => {
    console.log('>>> 生成 keystore')
    //keystore
    const child = sh.exec(
      `keytool -genkeypair -v -keystore ${config.storeFile} -alias ${config.keyAlias} -keyalg RSA -keysize 2048 -validity 10000`,
      { async: true },
    )
    child.stdin.write(config.storePassword + '\n') // 输入密钥库口令:
    child.stdin.write(config.storePassword + '\n') // 再次输入新口令:
    setTimeout(() => {
      child.stdin.write('\n') // 您的名字与姓氏是什么?
      child.stdin.write('\n') // 您的组织单位名称是什么?
      child.stdin.write('\n') // 您的组织名称是什么?
      child.stdin.write('\n') // 您所在的城市或区域名称是什么?
      child.stdin.write('\n') // 您所在的省/市/自治区名称是什么?
      child.stdin.write('\n') // 该单位的双字母国家/地区代码是什么?
      child.stdin.write('y\n') // CN=yuliang peng, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown是否正确?
      setTimeout(() => {
        child.stdin.write('\n') // 输入 <my-key-alias> 的密钥口令 (如果和密钥库口令相同, 按回车):

        const wt = fs.watch(path.resolve(__dirname, '..'), (event, filename) => {
          if (filename && filename === config.storeFile) {
            sh.mv('./' + config.storeFile, path.dirname(filePath))
            wt.close()
            console.log('<<< 生成成功')
            resolve()
          }
        })
      }, 100)
    }, 100)
  })
}

function cleanApkRelease() {
  console.log('>>> 清理 apk release', ApkReleaseDir)

  sh.mkdir('-p', ApkReleaseDir)
  sh.rm('-r', ApkReleaseDir)
  sh.mkdir('-p', ApkReleaseDir)
  console.log('<<< 清理完成')
}

function getNewFileName() {
  const platform = cmd.android ? 'android' : 'ios'
  const env = cmd.dev ? 'dev' : cmd.test ? 'test' : 'prod'
  const commitCount = sh.exec('git rev-list HEAD --count', { silent: true }).stdout.trim()
  const hash = sh.exec('git describe --always', { silent: true }).stdout.trim()
  const ext = cmd.android ? 'apk' : 'ipa'
  return `${platform}_${env}_v${packageJson.version}_${commitCount}_${getDate()}_${hash}.${ext}`
}

function getDate() {
  const now = new Date()
  function pad(num) {
    return String(num).padStart(2, '0')
  }
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`
}

function bundleRelease() {
  return new Promise(resolve => {
    // 将文件名生成到临时文件 给 build.gradle 读取共享
    sh.exec(`echo 'fileName=${NewFileName}' > ${path.resolve(ApkReleaseDir, 'buildinfo')}`)
    const wt = fs.watch(ApkReleaseDir, (event, filename) => {
      if (filename && filename === NewFileName) {
        wt.close()
        resolve()
      }
    })
    sh.cd(path.resolve(__dirname, '..'))
    sh.exec('react-native run-android --variant=release')
  })
}

function upload(path) {
  loading.start()
  sh.exec(`scp ${path} wuser@101.132.40.237:/opt/static/download/shoukuanla`)
  loading.stop()
}
