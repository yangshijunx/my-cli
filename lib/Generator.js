import { getRepoList,getTagList } from "./http.js"
import ora from "ora"
import inquirer from "inquirer"
import util from "util"
import downloadGitRepo from "download-git-repo" // 不支持promise化
import chalk from "chalk"
import path from "path"
import gitRepo from "../config/repo_config.js"
import fs from "fs"

async function wrapLoading(fn, message, ...args){
  // 使用ora初始化，传入message
  const spinner = ora(message)
  // 开始加载动画
  spinner.start()
  try {
    // 执行传入的fn
    const result = await fn(...args)
    // 修改状态
    spinner.succeed()
    return result
  } catch (err) {
    // 修改状态为失败
    spinner.fail('Request failed, refetch ...')
  }
}


// 创建一个generator来处理项目创建逻辑
class Generator {
  constructor (name, targetDir){
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  // 获取用户选择的模板
  // 1.从远程拉去模板
  // 2.用户选择下载的模板名称 
  // 3.return 用户选择的名称

  // async getRepo() {
  //   // 1.从远程拉去模板数据
  //   const result = await wrapLoading(getRepoList, 'waiting fetch template')
  //   if (!result) return
  //   // 选择我们需要的模板名称
  //   const repos = result.map(item => item.name)
  //   // 用户选择自己新下载的模板名称
  //   const { repo } = await inquirer.prompt({
  //     name: 'repo',
  //     type: 'list',
  //     choices: repos,
  //     message: 'Please choose a template to create project'
  //   })
  //   return repo
  // }
  async getRepo() {
    // 1.从远程拉去模板数据
    // const result = await wrapLoading(getRepoList, 'waiting fetch template')
    // if (!result) return
    // 选择我们需要的模板名称
    // const repos = result.map(item => item.name)
    // 用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: [
        { name: 'vue3基础模板', value: 'vue3-normal' }
      ],
      message: 'Please choose a template to create project'
    })
    return repo
  }
  // 获取用户选择的版本
  // 1.基于repo结果,远程拉取对应的tag列表
  // 2.用户选择自己需要下载的tag
  // 3.return用户选择的tag

  async getTag(repo) {
    // 基于repo的结果获取对应的tag列表
    const tags = await wrapLoading(getTagList,"waiting fetch tag",repo)
    if(!tags) return
    // 选择需要的tag名称
    const tagList = tags.map(item => item.name)
    // 用户选择自己需要下载的tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: "list",
      choices: tagList,
      message: 'Place choose a tag to create project'
    })
    return tag
  }

  // 下载远程模板
  // 1.拼接下载地址
  // 2.调用下载方法,修改一下只选择一次
  // async download(repo, tag) {
  //   // 1.拼接下载地址
  //   const requestUrl = `my-cli/${repo}${tag?'#'+tag:''}`
  //   // 调用下载方法
  //   await wrapLoading(
  //     this.downloadGitRepo, // 远程下载方法
  //     'waiting download template', // 加载提示信息
  //     requestUrl, // 参数1：下载地址
  //     path.resolve(process.cwd(), this.targetDir) // 参数2：创建位置
  //   )
  // }
    async download(repo) {
      // console.log(gitRepo)
    // 1.拼接下载地址
    // const requestUrl = `my-cli/${repo}${tag?'#'+tag:''}`
    const requestUrl = gitRepo[repo]
    console.log(requestUrl)
    // 调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      requestUrl, // 参数1：下载地址
      path.resolve(process.cwd(), this.targetDir), // 参数2：创建位置
      { clone: true }
    )
  }

  // 获取
  // 核心逻辑
  async create(){
    // 获取模板名称
    const repo = await this.getRepo()
    // 获取tag名称
    // const tag = await this.getTag(repo)
    // 下载模板到模板目录
    await this.download(repo)
    // console.log("ok?",mm)
    // 当前命令执行的文件夹
    const cwd = process.cwd()
    // package.json目录
    const packDir = path.join(cwd,this.name,"package.json")
    const packLockDir = path.join(cwd,this.name,"package-lock.json")
    console.log(packDir,packLockDir)
    if(fs.existsSync(packDir)){
      // const package = require(packDir)
      const packageJsonData = JSON.parse(fs.readFileSync(packDir, 'utf8'))
      packageJsonData.name = this.name
      fs.writeFileSync(packDir,JSON.stringify(packageJsonData), 'utf8')
      const packageJsonData1 = JSON.parse(fs.readFileSync(packDir, 'utf8'))
      console.log("package",packageJsonData1.name)
    }
    if(fs.existsSync(packLockDir)){
      // const package = require(packLockDir)
      const packageJsonData = JSON.parse(fs.readFileSync(packLockDir, 'utf8'))
      console.log("mei", packageJsonData.packages.name)
      packageJsonData.name = this.name
      Object.values(packageJsonData.packages)[0].name = this.name
      fs.writeFileSync(packLockDir,JSON.stringify(packageJsonData), 'utf8')
      const packageJsonData1 = JSON.parse(fs.readFileSync(packLockDir, 'utf8'))
      console.log("packageL",Object.values(packageJsonData1.packages)[0].name)
    }
    // 模板使用提示
    console.log(`\r\nSuccessfully create project ${chalk.cyan(this.name)}`)
    console.log(`\r\n cd ${chalk.cyan(this.name)}`)
    console.log(`\r\n npm install\r\n`)
    console.log("用户选择了,repo:" + repo)
  }
}

export { Generator as default }
// export { Generator } // 不行
// export default { // 不行
//   Generator
// }