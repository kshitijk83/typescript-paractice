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
var Department = (function () {
    function Department(id, name) {
        this.id = id;
        this.name = name;
        this.emp = [];
    }
    Department.prototype.describe = function () {
        console.log("Department: " + this.name);
    };
    Department.prototype.addEmp = function (emp) {
        this.emp.push(emp);
    };
    Department.prototype.printEmp = function () {
        console.log(this.emp);
    };
    return Department;
}());
var IT = (function (_super) {
    __extends(IT, _super);
    function IT(id, reports) {
        var _this = _super.call(this, id, 'IT') || this;
        _this.reports = reports;
        return _this;
    }
    IT.prototype.addRep = function (rep) {
        this.reports.push(rep);
    };
    return IT;
}(Department));
var x = new IT("sad", ["asdf"]);
//# sourceMappingURL=app.js.map