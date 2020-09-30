/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-09-26 21:57:05
 * @LastEditTime: 2020-09-27 00:01:53
 */
const ffi = require('ffi');
const ref = require('ref');
const Struct = require('ref-struct');


// Import user32
const rectStruct =  Struct({
  left: ffi.types.ulong,
  top: ffi.types.ulong,
  right: ffi.types.ulong,
  bottom: ffi.types.ulong
})

const user32 = new ffi.Library("user32", {
  FindWindowW: ["int32", ["string", "string"]],
  ShowWindow: ['bool', ['long', 'int']],
  SetWindowPos: ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
  MessageBoxW: ["int32", ["int32", "string", "string", "int32"]],
  SetCursorPos: ["bool", ["int32", "int32"]],
  mouse_event: ['void', ['int', 'int', 'int', 'int', 'int']],
  GetWindowDC: ['int32', ['long']],
  GetWindowRect: ["bool", ["int32", "pointer"]],
});
const mouseClick = (x,y,str='left') => {
  const MOUSE_EVENT_LEFT_DOWN = 2;
  const MOUSE_EVENT_LEFT_UP = 4;
  user32.SetCursorPos(x, y);
  if (str==='left') {
    user32.mouse_event(MOUSE_EVENT_LEFT_DOWN, 0 ,0 ,0 ,0);
    user32.mouse_event(MOUSE_EVENT_LEFT_UP, 0 ,0 ,0 ,0);
  }
}

// user32.ShowWindow(hwnd, 9)
// user32.SetWindowPos(hwnd, -1, 0, 0, 960, 540, 4)


function findWindow(text) {
  return user32.FindWindowW(null,Buffer.from(`${text}\0`, "ucs2"))
}

function setWindowPos(hwnd,x,y,width,height){
  user32.SetWindowPos(hwnd, -1, x, y, width, height, 4)
}

function getWindowRect(hwnd){
  const rectPointer = Buffer.alloc(4 * 4);
  const success = user32.GetWindowRect(hwnd, rectPointer);
  if (!success) return null;
  const rect = {}
  rect.left = rectPointer.readUInt32LE(0);
  rect.top = rectPointer.readUInt32LE(4);
  rect.right = rectPointer.readUInt32LE(8);
  rect.bottom = rectPointer.readUInt32LE(12);
  return rect
}

module.exports={
  findWindow:findWindow,
  setWindowPos:setWindowPos
}

const hwnd = findWindow('阴阳师-网易游戏')
setWindowPos(hwnd,0,0,0,0)
setTimeout(() => {
  setWindowPos(hwnd,0,0,720,360)
  console.log(getWindowRect(hwnd))
}, 100);



// const OK_or_Cancel = user32.MessageBoxW(
//   0, // 要创建的消息框的所有者窗口的句柄。如果此参数为NULL，则消息框没有所有者窗口
//   TEXT("Hello from Node.js!"), // 要显示的消息。如果字符串包含多行，则可以在每行之间使用回车符和/或换行符来分隔行
//   TEXT("Hello, World!"), // 对话框标题。如果此参数为NULL，则默认标题为Error。
//   1 // 对话框的内容和行为。此参数可以是来自以下标志组的标志的组合。
// );

// console.log(OK_or_Cancel);