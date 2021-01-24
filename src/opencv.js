const robot = require("robotjs");
const cv = require('opencv4nodejs');
const CONFIG = require('./config')
const {sleep} = require('./utils')
const {findWindow,click,setWindowPos} = require('./win32')
class OpencvLoop{
  constructor(hWnd_1,hWnd_2){
    // super()
    this.hWnd_1 = hWnd_1
    this.hWnd_2 = hWnd_2
    this.workingFlag = false
    this.curStep = 0 //从第几个任务开始循环
    this.count = 0 //循环次数
    this.loopCallback = ()=>{}
    this.loopTaskArr = [] //循环队列
  }

  mouseClick(x,y){
    if (this.hWnd_1) {
      click(this.hWnd_1,x,y)
    }
    if (this.hWnd_2) {
      click(this.hWnd_2,x,y)
    }
  }


  add(task){
    const self = this
    const initialTask = (task) => {
      task.title = task.title || `匹配第${this.loopTaskArr.length+1}步`
      task.matchedLimit = task.matchedLimit || 0.9
      task.callback = task.callback || function({val,x,y}){
        const offsetX = 8
        const offsetY = 31
        const clickX = x + Math.random()*task.target.cols
        const clickY = y + Math.random()*task.target.rows
        sleep(task.mouseDelay || 400)
        self.mouseClick(clickX-offsetX,clickY-offsetY)
        // robot.setMouseDelay(task.mouseDelay || 400);
        // robot.moveMouse(clickX, clickY);
        // robot.mouseClick();
        console.log(`${(new Date()).getSeconds()}，${task.title}已完成,匹配度：${val.toFixed(2)},X:${clickX.toFixed(1)},Y:${clickY.toFixed(1)}`)
      }
    }
    
    if (Array.isArray(task)) {
      task.forEach(item=>{
        initialTask(item)
      })
      this.loopTaskArr.push(...task)
    }else{
      initialTask(task)
      this.loopTaskArr.push(task)
    }
    return this
  }

  start(){
    this.workingFlag = true
    this.loop()
  }

  pause(){
    this.workingFlag = false
  }

  loop(){
    while (this.workingFlag) {
      const {title,target,matchedLimit,callback} = this.loopTaskArr[this.curStep]
      const screen = robot.screen.capture(0, 0, CONFIG.CLIENT_WIDTH, CONFIG.CLIENT_HEIGHT);
      const result = this.matchInScreen(screen,target)
      if (result.val>matchedLimit) {
        callback(result)
        if ( this.curStep===this.loopTaskArr.length-1) {
          this.loopCallback()
          this.curStep=0
          this.count++
          console.log(`已刷次数:${this.count}`)
        }else{
          this.curStep++
        }
      }
    }
  }

  matchInScreen(screen,targetMat,ops={}) {
    const MATCH_LEVEL = 5
    const screenMat = new cv.Mat(screen.image, screen.height, screen.width, cv.CV_8UC4);
    const result = screenMat.cvtColor(cv.COLOR_BGRA2BGR).matchTemplate(targetMat, MATCH_LEVEL);
    const minMax = result.minMaxLoc();
    const { maxLoc: { x, y },maxVal } = minMax;
    return {val:maxVal,x,y}
  }
}

module.exports = OpencvLoop


const test = () => {
  const loop = new OpencvLoop()
  const yuhun_single_start_mat = cv.imread('../yuhun_single_start.png');
  const end0 = cv.imread('../end_0.png')
  const end1 = cv.imread('../end_1.png')
  const end2 = cv.imread('../end_2.png')

  const taskArr = [{
    target:yuhun_single_start_mat,
  },{
    target:end0,
  },{
    target:end1,
  },{
    target:end2,
    mouseDelay:1200
  }]
  loop.add(taskArr)

  loop.start()
}

// test()





