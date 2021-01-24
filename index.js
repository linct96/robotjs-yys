/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-09-26 18:22:07
 * @LastEditTime: 2021-01-24 14:16:18
 */
// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");
const cv = require('opencv4nodejs');
const fs = require('fs')
const inquirer = require('inquirer');
const { findWindow, setWindowPos, setWindowTitle, findWindowEx } = require('./src/win32')
const { CLIENT_HEIGHT } = require('./src/config');
const OpencvLoop = require("./src/opencv")

let hwnd_1, hwnd_2
let isDouble
hwnd_1 = findWindow('阴阳师-网易游戏')
hwnd_2 = findWindowEx(null, hwnd_1, null, '阴阳师-网易游戏')
// setWindowPos(hwnd,0,0,0,0)
setWindowPos(hwnd_1, 0, 0, 0, CLIENT_HEIGHT, 4)
setTimeout(() => {
  setWindowPos(hwnd_1, 0, 0, 0, CLIENT_HEIGHT, 1)
}, 1000);
setWindowPos(hwnd_2, 0, 360, 0, CLIENT_HEIGHT, 4)


// setWindowPos(hwnd,0,0,0,CLIENT_HEIGHT,1)
// click(findWindow('阴阳师-网易游戏'),20.112232121321321,20.113213213213123)
// setForegroundWindow(hwnd)
// Speed up the mouse.
inquirer
  .prompt([{
    type: 'rawlist',
    name: 'inquirer_1',
    message: '请选择功能?',
    choices: [
      '御魂-单人',
      '御魂-队长',
      '御魂-队员',
      '御灵',
      '业原火',
      '活动'
    ]
  }])
  .then(({ inquirer_1 }) => {
    const loop = new OpencvLoop(hwnd_1, hwnd_2)
    const checkEndArr = [{
      target: cv.imread('./end_0.png'),
    }, {
      target: cv.imread('./end_1.png'),
    }, {
      target: cv.imread('./end_2.png'),
      matchedLimit:0.95,
      mouseDelay: 1400
    }]

    switch (inquirer_1) {
      case '御魂-单人':
        console.log('开始单人模式')
        loop.add([{
          target: cv.imread('./yuhun_single_start.png')
        }].concat(checkEndArr))
        break;
      case '御魂-队长':
        console.log('开始队长御魂模式')
        loop.add([{
          target: cv.imread('./yuhun_captain_start.png'),
          matchedLimit: 0.96,
          title: '匹配开始'
        }].concat(checkEndArr))
        break;
      case '御魂-队员':
        console.log('开始队友御魂模式')
        loop.add(checkEndArr)
        break;
      case '业原火':
        console.log('开始单人模式')
        loop.add([{
          target: cv.imread('./yeyuanhuo_start.png')
        }].concat(checkEndArr))
        break;
      case '活动':
        console.log('周年庆')
        break;
      default:
        break;
    }
    loop.start()
    // Use user feedback for... whatever!!
  })
  .catch(error => {
    console.log(error)
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });

