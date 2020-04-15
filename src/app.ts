// function merge<T extends object, U extends object>(a: T, b: U){
//     return Object.assign(a, b)
// }
// let x=merge({},{})
function Logger(val: string){
    return function(target: Function){
        console.log(val)
        console.log(target)
    }
}

@Logger("Contructor-person")
class Person{
    name="max"
    constructor(){
        console.log("creating person...")
    }
}