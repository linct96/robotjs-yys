/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-10-13 16:56:11
 * @LastEditTime: 2020-10-13 16:58:11
 */
function delay(time){
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  })
}

module.exports={
  delay
}