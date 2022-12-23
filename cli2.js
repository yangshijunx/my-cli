#! /usr/bin/env node

// 编写代码来描述你的命令行界面。
// Commander 负责将参数解析为选项和命令参数，
// 为问题显示使用错误，并实现一个有帮助的系统。
// Commander 是严格的，并且会针对无法识别的选项显示错误。
// 两种最常用的选项类型是布尔选项，和从参数中获取值的选项。
import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora'


// 自定义文本信息
const message = "loding...."
// 初始化
const spinner = ora(message)

// 开始动画
spinner.start()

// program
//   .version("0.1.0")
//   .command("create <name>")
//   .description("create a new project")
//   .action(name => {
//     // 打印命令行的输入值,并使用chalk进行样式美化
//     console.log("name is"+chalk.bold(name))
//     console.log("name is"+chalk.green(name))
//     console.log("name is"+chalk.rgb(4,155,120).underline(name))
//     console.log("project name is " + chalk.hex('#049CDB').bold(name));
//     console.log("project name is " + chalk.bgHex('#049CDB').bold(name))
//   })

// program.parse()
setTimeout(() => {
  // 修改动画样式
  spinner.color = "green"
  spinner.text = "ok"
  setTimeout(() => {
    // 加载状态修改
    spinner.stop() // 停止
    spinner.succeed("success")
    // spinner.fail("fail");  //失败 ✖
    // spinner.warn(text?);  提示 ⚠
    // spinner.info(text?);  信息 ℹ
  },2000)
},2000)