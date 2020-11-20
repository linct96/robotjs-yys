/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-10-13 19:38:13
 * @LastEditTime: 2020-10-13 20:32:20
 */

const robot = require("robotjs");
const cv = require('opencv4nodejs');

function screenshot(x,y,width,height) {
  const screen = robot.screen.capture(x, y, width, height);
  const screenMat = new cv.Mat(screen.image, screen.height, screen.width, cv.CV_8UC4);
  cv.imwrite('./temp.png', screenMat);
}

screenshot(250,230,80,80)