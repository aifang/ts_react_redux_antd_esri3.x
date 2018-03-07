
class Utils {
    static postMessage(data, targetOrigin: string = "*") {
        console.log('sss')
        debugger
        parent.postMessage(data, targetOrigin)
    }
}
export default Utils