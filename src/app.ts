enum ProjectStatus{Active, Finished}
class Project{
    constructor(public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
        ){

        }
}
type Listeners = (items: Project[])=>void
class ProjectState{
    private listeners: Listeners[]=[]
    private projects: Project[]=[]
    private static instance: ProjectState
    private constructor(){

    }
    static getInstance(){
        if(this.instance){
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
    }

    addProject(title: string, description: string, people: number){
        const newProject: Project=new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
            )
        this.projects.push(newProject)
        for(let listFn of this.listeners){
            listFn(this.projects.slice())
        }
    }

    addListeners(listFn: Listeners){
        this.listeners.push(listFn)
    }
}
const prjState = ProjectState.getInstance()


class ProjectList{
    public templateEl: HTMLTemplateElement;
    public hostEl: HTMLDivElement
    public element: HTMLElement
    public assignedProject: any[]=[]
    constructor(public type: 'active'|'finished'){
        this.templateEl = document.getElementById('project-list')! as HTMLTemplateElement
        this.hostEl = document.getElementById('app')! as HTMLDivElement
    
        const impNode = document.importNode(this.templateEl.content, true)
        this.element = impNode.firstElementChild as HTMLFormElement
        this.element.id=`${type}-projects`
        this.attach()
        prjState.addListeners((projects)=>{
            const raleventPrj = projects.filter(prj=>{
                if(type==='active'){
                    return prj.status===ProjectStatus.Active
                }
                return prj.status===ProjectStatus.Finished
            })
            this.assignedProject=raleventPrj
            this.renderList()
        })
        this.renderContent()
    }

    private renderList(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML=''
        for(let prj of this.assignedProject){
            const listItem = document.createElement('li')
            listItem.textContent=prj.title
            listEl.appendChild(listItem)
        }
    }

    private renderContent(){
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent=this.type.toUpperCase()+'PROJECTS'
    }

    private attach(){
        this.hostEl.insertAdjacentElement('beforeend', this.element)
    }
}

class ProjectInput {
    public templateEl: HTMLTemplateElement;
    public hostEl: HTMLDivElement
    public element: HTMLFormElement
    public titleInputEl: HTMLInputElement
    public descriptionInputEl: HTMLInputElement
    public peopleInputEl: HTMLInputElement
    constructor(){
        this.templateEl = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostEl = document.getElementById('app')! as HTMLDivElement
        
        const impNode = document.importNode(this.templateEl.content, true)
        this.element = impNode.firstElementChild as HTMLFormElement
        this.element.id="user-input"
        this.attach()

        this.titleInputEl = document.getElementById('title') as HTMLInputElement
        this.descriptionInputEl = document.getElementById('description') as HTMLInputElement
        this.peopleInputEl = document.getElementById('people') as HTMLInputElement
        this.configure()
    }

    private gatherUserInput =():[string, string, number]|void=>{
        const title = this.titleInputEl.value
        const desc = this.descriptionInputEl.value
        const people = this.peopleInputEl.value

        if(title.trim().length===0||desc.trim().length===0||people.trim().length===0){
            alert("empty inputs")
            return;
        } else{
            return [title, desc, +people]
        }
    }

    private submitHandler=(event: Event)=>{
        event.preventDefault();
        const userInput = this.gatherUserInput()
        if(Array.isArray(userInput)){
            const [title, desc, people] = userInput
            prjState.addProject(title, desc, people)
        }
    }

    private configure=()=>{
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach(){
        this.hostEl.insertAdjacentElement('afterbegin', this.element)
    }
}

const prjInput = new ProjectInput();
const activePrj=new ProjectList('active')
const finishedPrj=new ProjectList('finished')