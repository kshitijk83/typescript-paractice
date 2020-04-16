"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var State = (function () {
    function State() {
        this.listeners = [];
    }
    State.prototype.addListeners = function (listFn) {
        this.listeners.push(listFn);
    };
    return State;
}());
var ProjectState = (function (_super) {
    __extends(ProjectState, _super);
    function ProjectState() {
        var _this = _super.call(this) || this;
        _this.projects = [];
        _this.moveProject = function (id, newStatus) {
            var prj = _this.projects.find(function (el) { return el.id === id; });
            if (prj) {
                prj.status = newStatus;
                _this.updateListeners();
            }
        };
        _this.updateListeners = function () {
            for (var _i = 0, _a = _this.listeners; _i < _a.length; _i++) {
                var listFn = _a[_i];
                listFn(_this.projects.slice());
            }
        };
        return _this;
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
        this.updateListeners();
    };
    return ProjectState;
}(State));
var prjState = ProjectState.getInstance();
var Component = (function () {
    function Component(templateId, hostId, elementId, insertAtStart) {
        this.templateId = templateId;
        this.hostId = hostId;
        this.elementId = elementId;
        this.insertAtStart = insertAtStart;
        this.templateEl = document.getElementById(templateId);
        this.hostEl = document.getElementById(hostId);
        var impNode = document.importNode(this.templateEl.content, true);
        this.element = impNode.firstElementChild;
        if (elementId) {
            this.element.id = elementId;
        }
        this.attach(insertAtStart);
    }
    Component.prototype.attach = function (insertAtBeginning) {
        this.hostEl.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    };
    return Component;
}());
var ProjectItem = (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(hostId, project) {
        var _this = _super.call(this, 'single-project', hostId, project.id, false) || this;
        _this.dragStartHandler = function (event) {
            event.dataTransfer.setData('text/plain', _this.project.id);
            event.dataTransfer.effectAllowed = "move";
        };
        _this.dragEndHandler = function (event) {
            console.log(event);
        };
        _this.project = project;
        _this.configure();
        _this.renderContent();
        return _this;
    }
    Object.defineProperty(ProjectItem.prototype, "persons", {
        get: function () {
            if (this.project.people === 1) {
                return '1 Person';
            }
            else {
                return this.project.people + " Persons";
            }
        },
        enumerable: true,
        configurable: true
    });
    ProjectItem.prototype.configure = function () {
        this.element.addEventListener('dragstart', this.dragStartHandler.bind(this));
        this.element.addEventListener('dragend', this.dragEndHandler.bind(this));
    };
    ProjectItem.prototype.renderContent = function () {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.persons + ' assigned';
        this.element.querySelector('p').textContent = this.project.description;
    };
    return ProjectItem;
}(Component));
var ProjectList = (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(type) {
        var _this = _super.call(this, 'project-list', 'app', type + "-projects", false) || this;
        _this.type = type;
        _this.assignedProject = [];
        _this.dragOverHandler = function (event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                var listEl = _this.element.querySelector('ul');
                listEl.classList.add('droppable');
            }
        };
        _this.dragLeaveHandler = function (event) {
            var listEl = _this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        };
        _this.dropHandler = function (event) {
            var prjId = event.dataTransfer.getData('text/plain');
            prjState.moveProject(prjId, _this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
        };
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectList.prototype.configure = function () {
        var _this = this;
        this.element.addEventListener('dragover', this.dragOverHandler.bind(this));
        this.element.addEventListener('dragleave', this.dragLeaveHandler.bind(this));
        this.element.addEventListener('drop', this.dropHandler.bind(this));
        prjState.addListeners(function (projects) {
            var raleventPrj = projects.filter(function (prj) {
                if (_this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            _this.assignedProject = raleventPrj;
            _this.renderList();
        });
    };
    ProjectList.prototype.renderList = function () {
        var listEl = document.getElementById(this.type + "-projects-list");
        listEl.innerHTML = '';
        for (var _i = 0, _a = this.assignedProject; _i < _a.length; _i++) {
            var prj = _a[_i];
            new ProjectItem(this.element.querySelector('ul').id, prj);
        }
    };
    ProjectList.prototype.renderContent = function () {
        var listId = this.type + "-projects-list";
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + 'PROJECTS';
    };
    return ProjectList;
}(Component));
var ProjectInput = (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, 'project-input', 'app', "user-input", true) || this;
        _this.gatherUserInput = function () {
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
        _this.submitHandler = function (event) {
            event.preventDefault();
            var userInput = _this.gatherUserInput();
            if (Array.isArray(userInput)) {
                var title = userInput[0], desc = userInput[1], people = userInput[2];
                prjState.addProject(title, desc, people);
            }
        };
        _this.configure = function () {
            _this.element.addEventListener('submit', _this.submitHandler);
        };
        _this.renderContent = function () { };
        _this.titleInputEl = document.getElementById('title');
        _this.descriptionInputEl = document.getElementById('description');
        _this.peopleInputEl = document.getElementById('people');
        _this.configure();
        return _this;
    }
    return ProjectInput;
}(Component));
var prjInput = new ProjectInput();
var activePrj = new ProjectList('active');
var finishedPrj = new ProjectList('finished');
//# sourceMappingURL=app.js.map