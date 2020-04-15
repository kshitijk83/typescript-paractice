interface Named{
    readonly name: string;

}

interface Greetable extends Named{
    greet(phrase: string): void;
}

// type add=(n1: number, n2: number)=>number
interface params{
    n1:number;
    n2:number;
}
function add(config: params):void{
    
}

class Person implements Greetable{
    constructor(public name: string, public id: string){

    }

    greet(phrase: string){
        // sdfs
    }
}
let x = new Person("asdf", "asd");

interface cat{
    type: 'cat';
    run: number;
}

interface fish{
    type: 'fish';
    float: number;
}
type Animal = cat|fish;
function blah(animal:Animal){
    switch (animal.type) {
        case 'cat':
            console.log(animal.run)
            break;
        case 'fish':
            console.log(animal.float)
        default:
            break;
    }
}

let userInput = document.getElementById("hehe") as HTMLInputElement;
userInput.value="asdf"