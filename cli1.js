#! /usr/bin/env node
// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// #! /usr/bin/env node 指定用 node 来解释这个脚本
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

// 打印数据测试入口文件是否正常执行
console.log('cli working')
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

inquirer.prompt([
  {
    type: 'input', //type： input, number, confirm, list, checkbox ... 
    name: 'name', // key 名
    message: 'Your name', // 提示信息
    default: 'my-node-cli' // 默认值
  }
]).then(answers => {
  // 打印互用输入结果
  console.log(answers)
  // 模板文件目录
  const templateDir = path.join(__dirname, "templates")
  // 生成文件目录,在命令行执行目录
  const cwdUrl = process.cwd()
  // 从模板目录拉取文件
  fs.readdir(templateDir,(err,files) => {
    if(err){
      throw err
    }
    files.forEach((file) => {
      // 使用ejs渲染对应的模板
      // renderFile(模板文件地址，传入渲染数据)
      ejs.renderFile(path.join(templateDir,file),answers).then(data => {
        // 生成ejs处理后的模板文件
        fs.writeFileSync(path.join(cwdUrl,file),data)
      })
    })
  })
})