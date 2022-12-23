// module.exports = async function (name,options){
//   // 验证是否正常获取到值
//   console.log('from create.js',name,options)
// }
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import Generator from './Generator.js'

const create = async (name,options) => {
  // 执行创建项目
  // 当前命令执行的文件夹
  const cwd = process.cwd()
  // 需要创建的目录地址
  const targetDir = path.join(cwd,name)
  // 判断目录是否存在
  if(fs.existsSync(targetDir)){
    console.log('目录已存在')
    // 是否强制创建
    if(options.force){
      await fs.remove(targetDir)
    } else {
      // todo 是否需要覆盖
      console.log('目录已存在')
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '目标目录已存在，请选择一个操作',
          choices: [
            { name: '覆盖', value: 'overwrite' },
            { name: '取消', value: false }
          ]
        }
      ])
      if(!action){
        return
      } else if(action === 'overwrite'){
        console.log(`\r\nRemoving...`)
        await fs.remove(targetDir)
        // 创建项目
        const generator = new Generator(name,targetDir)
        // console.log("测试", generator)
        // 开始创建项目
        generator.create()
      }
    }
  } else {
    console.log('目录不存在')
    // 创建项目
    const generator = new Generator(name,targetDir)
    // console.log("测试", generator)
    // 开始创建项目
    generator.create()
  }
  // 验证是否正常获取到值
  // console.log('from create.js',name,options,targetDir)
}
// 导出模块
export { create }