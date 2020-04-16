interface Draggable{
    dragStartHandler(event: DragEvent):void
    dragEndHandler(event: DragEvent): void
}

interface DragTarget{
    dragOverHandler(event: DragEvent):void
    dropHandler(event: DragEvent):void
    dragLeaveHandler(event: DragEvent):void
}

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
type Listeners<T> = (items: T[])=>void
class State<T>{
    protected listeners: Listeners<T>[]=[]
    addListeners(listFn: Listeners<T>){
        this.listeners.push(listFn)
    }
}
class ProjectState extends State<Project>{
   
    private projects: Project[]=[]
    private static instance: ProjectState
    private constructor(){
        super()
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
        this.updateListeners()
    }

    moveProject=(id: string, newStatus: ProjectStatus)=>{
        const prj= this.projects.find(el=>el.id===id)
        if(prj){
            prj.status=newStatus
            this.updateListeners()
        }
    }

    private updateListeners=()=>{
        for(let listFn of this.listeners){
            listFn(this.projects.slice())
        }
    }
}
const prjState = ProjectState.getInstance()

abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    public templateEl: HTMLTemplateElement;
    public hostEl: T
    public element: U
    constructor(
        public templateId: string,
        public hostId:string,
        public elementId:string,
        public insertAtStart: boolean
        ){
        this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement
        this.hostEl = document.getElementById(hostId)! as T

        const impNode = document.importNode(this.templateEl.content, true)
        this.element = impNode.firstElementChild as U
        if(elementId){
            this.element.id=elementId
        }
        this.attach(insertAtStart)
    }

    private attach(insertAtBeginning:boolean){
        this.hostEl.insertAdjacentElement(insertAtBeginning?'afterbegin':'beforeend', this.element)
    }

    abstract configure():void
    abstract renderContent():void
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    public project: Project

    get persons(){
        if(this.project.people===1){
            return '1 Person'
        } else{
            return `${this.project.people} Persons`
        }
    }

    constructor(hostId: string, project: Project){
        super('single-project', hostId, project.id, false)
        this.project=project
        this.configure()
        this.renderContent()
    }
    dragStartHandler=(event: DragEvent)=>{
        event.dataTransfer!.setData('text/plain', this.project.id)
        event.dataTransfer!.effectAllowed="move"
    }
    dragEndHandler=(event: DragEvent)=>{
        console.log(event)
    }
    configure(){
        this.element.addEventListener('dragstart',this.dragStartHandler.bind(this))
        this.element.addEventListener('dragend',this.dragEndHandler.bind(this))
    }
    renderContent(){
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.persons+' assigned'
        this.element.querySelector('p')!.textContent = this.project.description
    }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
    public assignedProject: Project[]=[]

    constructor(public type: 'active'|'finished'){
        super('project-list','app', `${type}-projects`, false)
        
        this.configure()
        this.renderContent()
    }

    dragOverHandler=(event:DragEvent)=>{
        if(event.dataTransfer&&event.dataTransfer.types[0]==='text/plain'){
            event.preventDefault()
            const listEl = this.element.querySelector('ul')!
            listEl.classList.add('droppable')
        }
    }
    dragLeaveHandler=(event:DragEvent)=>{
        const listEl = this.element.querySelector('ul')!
        listEl.classList.remove('droppable')
    }
    dropHandler=(event:DragEvent)=>{
        const prjId = event.dataTransfer!.getData('text/plain')
        prjState.moveProject(prjId, this.type==="active"?ProjectStatus.Active:ProjectStatus.Finished)
    }

    configure(){
        this.element.addEventListener('dragover', this.dragOverHandler.bind(this))
        this.element.addEventListener('dragleave', this.dragLeaveHandler.bind(this))
        this.element.addEventListener('drop', this.dropHandler.bind(this))
        prjState.addListeners((projects)=>{
            const raleventPrj = projects.filter(prj=>{
                if(this.type==='active'){
                    return prj.status===ProjectStatus.Active
                }
                return prj.status===ProjectStatus.Finished
            })
            this.assignedProject=raleventPrj
            this.renderList()
        })
    }

    private renderList(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML=''
        for(let prj of this.assignedProject){
            new ProjectItem(this.element.querySelector('ul')!.id, prj)
        }
    }

    renderContent(){
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent=this.type.toUpperCase()+'PROJECTS'
    }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    public titleInputEl: HTMLInputElement
    public descriptionInputEl: HTMLInputElement
    public peopleInputEl: HTMLInputElement
    constructor(){
        super('project-input', 'app',"user-input", true)

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

    configure=()=>{
        this.element.addEventListener('submit', this.submitHandler)
    }

    renderContent=()=>{}
}

const prjInput = new ProjectInput();
const activePrj=new ProjectList('active')
const finishedPrj=new ProjectList('finished')