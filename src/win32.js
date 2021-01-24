/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-09-26 21:57:05
 * @LastEditTime: 2020-11-24 22:41:54
 */
const ffi = require('ffi-napi');
const path = require('path')
const {sleep} = require('./utils')
const user32 = new ffi.Library("user32", {
  FindWindowW: ['pointer', ['string', 'string']],
  FindWindowExW: ['pointer', ['pointer', 'pointer', 'string', 'string']],
  SetWindowTextA: ['bool', ['pointer', 'string']],
  // FindWindowW: ["int32", ["string", "string"]],
  ShowWindow: ['bool', ['long', 'int']],
  SetForegroundWindow: ['bool', ['pointer']],
  PrintWindow: ['bool', ['pointer', 'pointer', 'uint']],
  SetWindowPos: ['bool', ['pointer', 'long', 'int', 'int', 'int', 'int', 'uint']],
  SendMessageW: ['int32', ['pointer', 'int32', 'int32', 'pointer']],
  SendMessageA: ['int32', ['pointer', 'int32', 'int32', 'int32']],
  MessageBoxW: ["int32", ["int32", "string", "string", "int32"]],
  SetCursorPos: ["bool", ["int32", "int32"]],
  mouse_event: ['void', ['int', 'int', 'int', 'int', 'int']],
  GetWindowDC: ['pointer', ['pointer']],
  GetWindowRect: ["bool", ["pointer", "pointer"]],
  OpenClipboard: ['bool', ['pointer']], //打开剪切板
  EmptyClipboard: ['bool', []],
  SetClipboardData: ['pointer', ['int32', 'pointer']],
  GetClipboardData: ['pointer', ['int32']],
  CloseClipboard: ['bool', []],
  // MAKELPARAM:['vodi',['']]
});

const gdi32 = new ffi.Library('gdi32.dll', {
  CreateCompatibleBitmap: ['pointer', ['pointer', 'int32', 'int32']],
  CreateCompatibleDC: ['pointer', ['pointer']],
  SelectObject: ['pointer', ['pointer', 'pointer']],
  DeleteObject: ['bool', ['pointer']],
  DeleteDC: ['bool', ['pointer']]
})

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
  let hWnd = user32.FindWindowW(null,Buffer.from(`${text}\0`, "ucs2"))
  if (!hWnd || hWnd.isNull()) {
    return null
  }
  return hWnd
}
function findWindowEx(hParent = null, hChild = null, className = null, windowName = null) {
  let hWnd = user32.FindWindowExW(hParent, hChild, CString(className), CString(windowName))
  if (!hWnd || hWnd.isNull()) {
    return null
  }
  return hWnd
}
function setWindowTitle(hwnd,text) {
  return user32.SetWindowTextA(hwnd,text)
}

function setWindowPos(hwnd,x,y,width,height,z){
  user32.SetWindowPos(hwnd, -1, x, y, width, height, z)
}

function setForegroundWindow (hWnd) {
  user32.SetForegroundWindow(hWnd)
}




function sendMessage(hWnd, Msg, wParam, lParam) {
  return user32.SendMessageW(hWnd, Msg, wParam, LParam(lParam))
}

function MAKELPARAM(p, p_2) {
  return ((p_2 << 16) | (p & 0xFFFF));
}


function click(hwnd,x,y){
  const move = 0x0200
  const ldown = 0x0201
  const lup = 0x0202
  const point = MAKELPARAM(x,y)
  user32.SendMessageA(hwnd, move, 0, point);
  user32.SendMessageA(hwnd, ldown, 0, point);
  sleep(30+Math.random()*20)
  user32.SendMessageA(hwnd, lup, 0, point);
}


function CString (string) {
  return string && Buffer.from(`${string}\0`, 'ucs2') || null
}
function LParam (param) {
  return WParam(param)
}
function WParam (param) {
  if (param) {
    if (typeof param === 'string') {
      return CString(param)
    }
  }
  return param
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

// const ffihelperDllPath = path.join(__dirname, './dll/ffihelper.dll')
// let ffihelper = new ffi.Library(ffihelperDllPath, {
//   'HBitmapToBmpFile': ['void', ['pointer', 'pointer']],
//   'HWndToBmpFile': ['void', ['pointer', 'pointer']]
// })

// function HWndToBmpFile(hWnd) {
//   let buf = Buffer.alloc(255, 0)
//   ffihelper.HWndToBmpFile(hWnd, buf)
//   return buf.toString('ucs2').replace(new RegExp('\0', 'g'), '')
// }


// function HWnDToBmpClipboard (hWnd) {
//   // 生成hBitmap
//   let rect = getWindowRect(hWnd)
//   let width = rect.right - rect.left
//   let height = rect.bottom - rect.top
//   console.log(width,height)
//   let hdcSrc = user32.GetWindowDC(hWnd)
//   let hdcDest = gdi32.CreateCompatibleDC(hdcSrc)
//   let hBitmap = gdi32.CreateCompatibleBitmap(hdcSrc, width, height)
//   let hOld = gdi32.SelectObject(hdcDest, hBitmap)
//   let isSuccess = user32.PrintWindow(hWnd, hdcDest, 0)

//   // bmpinfo = hBitmap.GetHandle()
//   // bmpstr = hBitmap.GetBitmapBits(true)
//   // im = Image.frombuffer(
//   //     'RGB',
//   //     (bmpinfo['bmWidth'], bmpinfo['bmHeight']),
//   //     bmpstr, 'raw', 'BGRX', 0, 1)

//   // win32gui.DeleteObject(saveBitMap.GetHandle())
//   // saveDC.DeleteDC()
//   // mfcDC.DeleteDC()
//   // win32gui.ReleaseDC(hwnd, hwndDC)
//   if (isSuccess) {
//     user32.OpenClipboard(null)
//     user32.EmptyClipboard()
//     user32.SetClipboardData(2, hBitmap)
//     user32.CloseClipboard()
//   }
// }

module.exports={
  findWindow:findWindow,
  setWindowTitle:setWindowTitle,
  findWindowEx:findWindowEx,
  setWindowPos:setWindowPos,
  getWindowRect:getWindowRect,
  setForegroundWindow:setForegroundWindow,
  click:click
}

// const hwnd = findWindow('阴阳师-网易游戏')
// setWindowPos(hwnd,0,0,0,0)
// setTimeout(() => {
//   setWindowPos(hwnd,0,0,720,360)
//   console.log(getWindowRect(hwnd))
// }, 100);



// const OK_or_Cancel = user32.MessageBoxW(
//   0, // 要创建的消息框的所有者窗口的句柄。如果此参数为NULL，则消息框没有所有者窗口
//   TEXT("Hello from Node.js!"), // 要显示的消息。如果字符串包含多行，则可以在每行之间使用回车符和/或换行符来分隔行
//   TEXT("Hello, World!"), // 对话框标题。如果此参数为NULL，则默认标题为Error。
//   1 // 对话框的内容和行为。此参数可以是来自以下标志组的标志的组合。
// );

// console.log(OK_or_Cancel);
