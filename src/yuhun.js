/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-09-26 23:14:26
 * @LastEditTime: 2020-11-08 12:16:49
 */
const CONFIG = require('./config')
const robot = require("robotjs");
const cv = require('opencv4nodejs');
const {delay} = require('./utils')
let startFlag = false

const YUHUN_TYPE = {
  SINGLE:1,
  GROUP_CAP:2,
  GROUP_MEN:3
}
function yuhun(params) {
  const MATCH_VALUE_LIMIT = 0.9
  const targetMat = cv.imread('./zhounnian_start.png');
  const screen = robot.screen.capture(0, 0, CONFIG.CLIENT_WIDTH, CONFIG.CLIENT_HEIGHT);
  const {val,x,y} = matchInScreen(screen,targetMat)
  console.log(targetMat.rows,targetMat.cols)
  if (val>MATCH_VALUE_LIMIT) {
    robot.moveMouse(x+Math.random()*60, y+Math.random()*60);
    robot.mouseClick();
  }
  checkEnd()
}

function funcLoop(ops) {
  const {targetMat,MATCH_VALUE_LIMIT=0.9} = ops
  // const targetMat = cv.imread('./zhounnian_start.png');
  const screen = robot.screen.capture(0, 0, CONFIG.CLIENT_WIDTH, CONFIG.CLIENT_HEIGHT);
  const {val,x,y} = matchInScreen(screen,targetMat)
  if (val>MATCH_VALUE_LIMIT) {
    robot.setMouseDelay(100);
    robot.moveMouse(x+Math.random()*targetMat.cols, y+Math.random()*targetMat.rows);
    robot.mouseClick();
    checkEnd()
    console.log('结算完毕')
  }
}

function matchInScreen(screen,targetMat,ops={}) {
  const MATCH_LEVEL = 5
  const screenMat = new cv.Mat(screen.image, screen.height, screen.width, cv.CV_8UC4);
  const result = screenMat.cvtColor(cv.COLOR_BGRA2BGR).matchTemplate(targetMat, MATCH_LEVEL);
  const minMax = result.minMaxLoc();
  const { maxLoc: { x, y },maxVal } = minMax;
  // console.log(`${(new Date()).getSeconds()}  匹配度：${maxVal},X:${x},Y:${y}`)
  return {val:maxVal,x,y}
}

function checkEnd(){
  const MATCH_VALUE_LIMIT = 0.8
  const matArr = [cv.imread('./end_0.png'),cv.imread('./end_1.png'),cv.imread('./end_2.png')]
  let step = 0
  let isFirst = true
  let preTime = Date.now()
  while (step<3) {
    robot.setMouseDelay(100);
    if (!isFirst&&(Date.now()-preTime<500)) continue
    preTime = Date.now()
    isFirst = false
    const screen = robot.screen.capture(0, 0, CONFIG.CLIENT_WIDTH, CONFIG.CLIENT_HEIGHT);
    const {val,x,y} = matchInScreen(screen,matArr[step])
    console.log(`步骤${step},结束相似度${val}`)
    const MATCH_VALUE_LIMIT = step===1?0.8:0.96
    if (val>MATCH_VALUE_LIMIT) {
      if (step===2) {
        robot.setMouseDelay(1200);
      }
      robot.moveMouse(x+Math.random()*matArr[step].cols, y+Math.random()*matArr[step].rows);
      robot.mouseClick();
      step++
    }
  }
}

function start(type){
  startFlag = true
  const yuhun_single_start_mat = cv.imread('./yuhun_single_start.png');
  const yuhun_captain_start_mat = cv.imread('./yuhun_captain_start.png');
  while(startFlag){
    if (type===YUHUN_TYPE.SINGLE) {
      funcLoop({
        targetMat:yuhun_single_start_mat
      })
    }else if (type===YUHUN_TYPE.GROUP_CAP) {
      funcLoop({
        targetMat:yuhun_captain_start_mat,
        MATCH_VALUE_LIMIT:0.98
      })
    }else if (type===YUHUN_TYPE.GROUP_MEN) {
      checkEnd()
    }
  }
}

function stop(){
  startFlag = false
}


// yuhun()
// checkEnd()

module.exports={
  start:start,
  stop:stop,
  checkend:checkEnd,
  yuhun_captain:yuhun,
  YUHUN_TYPE:YUHUN_TYPE
}
// throttle(checkEnd,2000)()
// screenshot(260,180,60,60)


