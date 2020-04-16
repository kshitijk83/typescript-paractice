"use strict";
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
var Project = (function () {
    function Project(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
    return Project;
}());
var ProjectState = (function () {
    function ProjectState() {
        this.listeners = [];
        this.projects = [];
    }
    ProjectState.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    };
    ProjectState.prototype.addProject = function (title, description, people) {
        var newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listFn = _a[_i];
            listFn(this.projects.slice());
        }
    };
    ProjectState.prototype.addListeners = function (listFn) {
        this.listeners.push(listFn);
    };
    return ProjectState;
}());
var prjState = ProjectState.getInstance();
var ProjectList = (function () {
    function ProjectList(type) {
        var _this = this;
        this.type = type;
        this.assignedProject = [];
        this.templateEl = document.getElementById('project-list');
        this.hostEl = document.getElementById('app');
        var impNode = document.importNode(this.templateEl.content, true);
        this.element = impNode.firstElementChild;
        this.element.id = type + "-projects";
        this.attach();
        prjState.addListeners(function (projects) {
            var raleventPrj = projects.filter(function (prj) {
                if (type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            _this.assignedProject = raleventPrj;
            _this.renderList();
        });
        this.renderContent();
    }
    ProjectList.prototype.renderList = function () {
        var listEl = document.getElementById(this.type + "-projects-list");
        listEl.innerHTML = '';
        for (var _i = 0, _a = this.assignedProject; _i < _a.length; _i++) {
            var prj = _a[_i];
            var listItem = document.createElement('li');
            listItem.textContent = prj.title;
            listEl.appendChild(listItem);
        }
    };
    ProjectList.prototype.renderContent = function () {
        var listId = this.type + "-projects-list";
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + 'PROJECTS';
    };
    ProjectList.prototype.attach = function () {
        this.hostEl.insertAdjacentElement('beforeend', this.element);
    };
    return ProjectList;
}());
var ProjectInput = (function () {
    function ProjectInput() {
        var _this = this;
        this.gatherUserInput = function () {
            var title = _this.titleInputEl.value;
            var desc = _this.descriptionInputEl.value;
            var people = _this.peopleInputEl.value;
            if (title.trim().length === 0 || desc.trim().length === 0 || people.trim().length === 0) {
                alert("empty inputs");
                return;
            }
            else {
                return [title, desc, +people];
            }
        };
        this.submitHandler = function (event) {
            event.preventDefault();
            var userInput = _this.gatherUserInput();
            if (Array.isArray(userInput)) {
                var title = userInput[0], desc = userInput[1], people = userInput[2];
                prjState.addProject(title, desc, people);
            }
        };
        this.configure = function () {
            _this.element.addEventListener('submit', _this.submitHandler);
        };
        this.templateEl = document.getElementById('project-input');
        this.hostEl = document.getElementById('app');
        var impNode = document.importNode(this.templateEl.content, true);
        this.element = impNode.firstElementChild;
        this.element.id = "user-input";
        this.attach();
        this.titleInputEl = document.getElementById('title');
        this.descriptionInputEl = document.getElementById('description');
        this.peopleInputEl = document.getElementById('people');
        this.configure();
    }
    ProjectInput.prototype.attach = function () {
        this.hostEl.insertAdjacentElement('afterbegin', this.element);
    };
    return ProjectInput;
}());
var prjInput = new ProjectInput();
var activePrj = new ProjectList('active');
var finishedPrj = new ProjectList('finished');
//# sourceMappingURL=app.js.map