#! /usr/bin/env node
//    _____                  _________ .__  .__ 
//   /     \ ___.__.         \_   ___ \|  | |__|
//  /  \ /  <   |  |  ______ /    \  \/|  | |  |
// /    Y    \___  | /_____/ \     \___|  |_|  |
// \____|__  / ____|          \______  /____/__|
//         \/\/                      \/         

import { program } from "commander";
import chalk from "chalk";
import pac from './package.json' assert { type: 'json' };
import { create } from "./lib/create.js";
import figlet from "figlet";

program
  .command('create <app-name>')
  .version(`version: ${pac.version}`)
  .description('create a new project powered by my-cli-service')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name,options) => {
    console.log('name:' + name,'options:'+ options)
    create(name,options)
  })

program
  // .command('create <app-name>')
  // .version(`version: ${pac.version}`)
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((name,options) => {
    let str = ''
    for (const key in options) {
      if (Object.hasOwnProperty.call(options, key)) {
        str = str+key+'='+options[key]
      }
    }
    // 打印结果
    // console.log('name:' + name,'options:'+ str)
    create(name,options)
  })

program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option)
  })

program
  .on('--help',()=>{
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('my-cli', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    console.log(`\r\nRun ${chalk.cyan(`my-cli <command> --help`)} for detailed usage of given command\r\n`)
  })

// 解析用户执行命令传入参数

program.parse(process.argv)