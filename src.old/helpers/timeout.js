export default function (delay) {
    return new Promise(resovle => {
        setTimeout(resovle, delay)
    })
}