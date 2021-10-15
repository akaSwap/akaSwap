export const getDeltaSecond = (target_time) => {
    let currentTime = new Date()
    let targetTime = new Date(target_time * 1000)
    return ((targetTime - currentTime) / 1000)
  }

export const getISOString = (timestamp_second, format) => {
    let date = new Date(timestamp_second * 1000)
    let str = date.toISOString().substr(0, 10)
    if(format === "yyyy-mm-dd")
        return str
    else if(format === "yyyy-mm-dd hh:mm")
        return str + " " + date.toTimeString().substr(0, 5)
    else
        return str + " " + date.toTimeString().substr(0, 8)
  }