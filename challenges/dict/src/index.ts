export type Dict<T> = {
    [k: string]: T
};
interface x<T,S>{
    (arg: T): S
}
// Array.prototype.map, but for Dict
export function mapDict<T, S>(dict: Dict<T>, callback: (arg:T)=>S): Dict<S> {
    const obj:Dict<S>={}
    for(let key in dict){
        const item = dict[key]
        obj[key]=callback(item)
    }
    return obj
}
mapDict({
    ts: [".ts"]
},(str)=>{
    return `*${str[0]}`
})
// Array.prototype.reduce, but for Dict
export function reduceDict<T,S>(dict: Dict<T[]>, callback:(acc: S, cur: T)=>S, init: S): Dict<S> {
    const obj:Dict<S>={}
    for(let key in dict){
        let acc = init
        if(Array.isArray(dict[key])){
            dict[key].forEach(cur=>{
                acc = callback(acc,cur)
            })
        }
        obj[key]=acc
    }
    return obj
}

reduceDict({
    ts: [".ts"]
}, (acc, cur)=>{
    return acc+cur
}, '')