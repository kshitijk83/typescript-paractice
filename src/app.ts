class Department{
    private emp: string[]=[];
    constructor(private readonly id: string, public name: String){

    }

    describe(this: Department){
        console.log("Department: "+this.name)
    }
    addEmp(emp: string){
        this.emp.push(emp)
    }
    printEmp(){
        console.log(this.emp)
    }
}

class IT extends Department{
    constructor(id: string, public reports:string[]){
        super(id, 'IT')
    }

    addRep(rep: string){
        this.reports.push(rep)
    }
}

let x=new IT("sad",["asdf"])