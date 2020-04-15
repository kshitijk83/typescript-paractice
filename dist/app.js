"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function Logger(val) {
    return function (target) {
        console.log(val);
        console.log(target);
    };
}
var Person = (function () {
    function Person() {
        this.name = "max";
        console.log("creating person...");
    }
    Person = __decorate([
        Logger("Contructor-person")
    ], Person);
    return Person;
}());
//# sourceMappingURL=app.js.map