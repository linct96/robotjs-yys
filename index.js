/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-09-26 18:22:07
 * @LastEditTime: 2020-11-08 12:14:16
 */
// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");
const cv = require('opencv4nodejs');
const fs = require('fs')
const inquirer = require('inquirer');
const {findWindow,setWindowPos} = require('./src/win32')
const { CLIENT_HEIGHT } = require('./src/config');
const yuhun = require("./src/yuhun");

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
    switch (inquirer_1) {
      case '御魂-单人':
        yuhun.start(1)
        break;
      case '御魂-队长':
        yuhun.start(2)
        break;
      case '御魂-队员':
        yuhun.start(3)
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
    // Use user feedback for... whatever!!
  })
  .catch(error => {
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });
// var twoPI = Math.PI * 2.0;
// var screenSize = robot.getScreenSize();
// var height = (screenSize.height / 2) - 10;
// var width = screenSize.width;

// for (var x = 0; x < 200; x++)
// {
// 	y = height * Math.sin((twoPI * x) / width) + height;
// 	robot.moveMouse(x, y);
// }

// var size = 100;
// var img = robot.screen.capture(0, 0, size, size);
// console.log(img)
// fs.writeFile('./myFile', img.image, function(err){ 
//   if(err){
//     console.log(err);
//   }
// })

const bgMat = cv.imread('./assets/bg.jpg');
const cutMat = cv.imread('./assets/cut.png');
const matched = bgMat.matchTemplate(cutMat, 5);
const minMax = matched.minMaxLoc();
const { maxLoc: { x, y } } = minMax;

  // Draw bounding rectangle
bgMat.drawRectangle(
  new cv.Rect(x, y, cutMat.cols, cutMat.rows),
  new cv.Vec3(0, 255, 0),
  2,
  cv.LINE_8
);

  // Open result in new window
// cv.imshow('We\'ve found Waldo!', bgMat);
// cv.waitKey();
// cv.imreadAsync('./assets/bg.jpg', function(err, mat){
//   cv.imshow('a window name', mat);
//   cv.waitKey();
// })
