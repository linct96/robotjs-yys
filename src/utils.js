/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-10-13 16:56:11
 * @LastEditTime: 2020-11-23 01:09:35
 */
function sleep(millis){
  const date = new Date();
  let curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}

module.exports={
  sleep
}