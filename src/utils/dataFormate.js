//时间格式化

export function formatDate(time){
    if(!time) return ''
    let date = new Date(time)
    let Hours = date.getHours() < 10?"0"+date.getHours():date.getHours()
    let Minutes = date.getMinutes() <10?"0"+date.getMinutes():date.getMinutes()
    let Seconds = date.getSeconds() <10?"0"+ date.getSeconds(): date.getSeconds()
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+
    Hours+":"+Minutes+":"+Seconds
}