﻿var newCus = { Name: '', Age: '', Address: '' };
function Customer(data) {
    /* Observables bound to model properties */
    this.Id = ko.observable(data.Id);
    this.Name = ko.observable(data.Name).extend({
        required: true,
        minLength: 3,
        maxLength: 15,
        pattern: {
            message: 'underscore, hyphen, period and space characters are allowed',
            params: '^[A-Za-z.\\s_-]+$'
        }
    });
    this.Age = ko.observable(data.Age).extend({
        required: true,
        pattern: {
            message: "Please enter numbers only",
            params: /^(-*[0-9]+)$/
        }
    });
    this.Address = ko.observable(data.Address).extend({
        required: true
    });
    
    ModelErrors = ko.validation.group(this);
    IsValid = ko.computed(function () {
        ModelErrors.showAllMessages();
        return ModelErrors().length === 0;
    });
}

function CustomerViewModel() {
    Customers = ko.observableArray(); /*Array to contain the list of customers*/
    CustomerData = ko.observable(); /*Observable to bind customer data for add/edit operation*/
    
    GetAllCustomers();
    function GetAllCustomers() {        
        $.ajax({
            method: "GET",
            url: "/Customer/GetCustomerList",
            contentType: "application/json;charset=utf-8",
            success: function (result) {                
                Customers(result);
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }

    /*Reset Modal*/
    ResetModal = function () {
        CustomerData(new Customer(newCus));
        $('#modalTitle').html('Add Customer');
        $('#createBtn').show();
        $('#updateBtn').hide();
    };

    /*Add New Customer*/
    AddCustomer = function () {
        var data = ko.toJSON(CustomerData);
        $.ajax({
            type: "POST",
            url: "/Customer/AddCustomer",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (result) {                
                Customers.push(result);
                $('#myModal').modal('hide');
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    };

    /*Show data in modal for edit operation*/
    ShowEditModal = function (data) {
        /*mapped data using ko.mapping plugin*/
        var selected = ko.mapping.toJS(data);
        CustomerData(new Customer(selected));
        $('#myModal').modal('show');
        $('#modalTitle').html('Edit Customer');
        $('#createBtn').hide();
        $('#updateBtn').show();
    };

    /*Update Customer Record*/
    UpdateCustomer = function () {
        var data = ko.toJSON(CustomerData);
        $.ajax({
            method: 'POST',
            url: '/Customer/UpdateCustomer',
            contentType: 'application/json; charset=utf-8',
            data: data,
            dataType: 'json',
            success: function (result) {
                GetAllCustomers();                
                $('#myModal').modal('hide');
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    };

    /*Delete Customer Record*/
    DeleteCustomer = function (data) {
        if (confirm('Are you sure to delete this customer?')) {
            var id = data.Id;
            $.ajax({
                type: 'POST',
                url: '/Customer/DeleteCustomer/' + id,
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    Customers.remove(data);
                    GetAllCustomers();
                },
                error: function (errormessage) {
                    alert(errormessage.responseText);
                }
            });
        }
    };
}
$(document).ready(function () {    
    var CustomerVM = new CustomerViewModel();
    ko.applyBindings(CustomerVM);
});



