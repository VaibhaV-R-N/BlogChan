module.exports.getDate = ()=>{
    const currentDate  = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()+1
    const date = currentDate.getDate()
    return `${date}/${month}/${year}`
}
