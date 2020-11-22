/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-09-26 18:22:07
 * @LastEditTime: 2020-11-22 18:29:24
 */
// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");
const cv = require('opencv4nodejs');
const fs = require('fs')
const inquirer = require('inquirer');
const {findWindow,setWindowPos} = require('./src/win32')
const { CLIENT_HEIGHT } = require('./src/config');
const OpencvLoop = require("./src/opencv")

const hwnd = findWindow('阴阳师-网易游戏')
setWindowPos(hwnd,0,0,0,0)
setWindowPos(hwnd,0,0,0,CLIENT_HEIGHT)
// Speed up the mouse.
robot.setMouseDelay(2);

inquirer
  .prompt([{
    type: 'rawlist',
    name: 'inquirer_1',
    message: '请选择功能?',
    choices:[
      '御魂-单人',
      '御魂-队长',
      '御魂-队员',
      '御灵',
      '业原火',
      '活动'
    ]
  }])
  .then(({inquirer_1}) => {
    console.log(inquirer_1)
    const loop = new OpencvLoop()
    const checkEndArr = [{
      target:cv.imread('./end_0.png'),
    },{
      target:cv.imread('./end_1.png'),
    },{
      target:cv.imread('./end_2.png'),
      mouseDelay:1200
    }]
    switch (inquirer_1) {
      case '御魂-单人':
        console.log('开始单人模式')
        loop.add([{
          target:cv.imread('./yuhun_single_start.png')
        }].concat(checkEndArr))
        
        break;
      case '御魂-队长':
        console.log('开始队长御魂模式')
        loop.add([{
          target:cv.imread('./yuhun_captain_start.png')
        }].concat(checkEndArr))
        break;
      case '御魂-队员':
        console.log('开始队友御魂模式')
        loop.add(checkEndArr)
        break;
      case '业原火':
        console.log('业原火')
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
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });

