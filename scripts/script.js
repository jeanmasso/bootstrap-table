$(document).ready(function () {

    $table = $('#table');
    $API = 'http://dummy.restapiexample.com/api/v1';

    $table.bootstrapTable({
        classes: 'table table-hover table-bordered table-sm',
        pagination: true,
        pageSize: 15,
        pageList: '[25, 50, 100, 200, Tous]',
        idField: 'id',
        sortName: 'id',
        search: '2',
        searchOnEnterKey: true,
        theadClasses: 'thead-light',
        filterControl: true,
        clickToSelect: true,
        columns: [{
            field: '',
            title: '',
            titleTooltip: '',
            width: '50',
            align: 'center',
            checkbox: true,
            formatter: 'fieldFormatter'
        }, {
            field: 'id',
            title: 'Identifiant',
            titleTooltip: '',
            width: '50',
            align: 'center',
            sortable: true,
            formatter: 'fieldFormatter',
            filterControl: 'input'
        }, {
            field: 'employee_name',
            title: 'Name',
            titleTooltip: '',
            // width: '50',
            // align: 'center',
            sortable: true,
            formatter: 'fieldFormatter',
            filterControl: 'input'
        }, {
            field: 'employee_salary',
            title: 'Salary',
            titleTooltip: '',
            // width: '50',
            // align: 'center',
            searchSelector: '#salary',
            sortable: true,
            formatter: 'fieldFormatter',
        }, {
            field: '',
            title: 'Action',
            titleTooltip: '',
            width: '50',
            align: 'center',
            // sortable: true,
            formatter: 'actionFormatter'
        }]
    });

    getEmployee();
})

function getEmployee() {

    $.get(
        $API + '/employees',
        function (data) {
            $table.bootstrapTable('load', data.data);
        },
        'json'
    );

}

function fieldFormatter(value, row, index) { //compte/tierscompte?compte=411000

    var txt = '<span class="field" data-toggle="modal" data-target="#detailsEmployee" onclick="getDetailEmployee(' + row.id + ')">' + (((value != 0) && (value != null)) ? value : '') + '</span>';
    return txt;

}

function actionFormatter(value, row, index) { // Fonction permettant l'affichage des boutons dans la colonne "Action"

    var str = `
        <div class="action">
          <button class="btn btn-edit" type="button" data-toggle="modal" data-target="#detailsEmployee" onclick="getDetailEmployee(' + row.id + ')" title="Afficher les information de cet employee"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn btn-tags" type="button" onclick="addTagsEmployee(' + row.id + ')" title="Ajouter des étiquettes à cet employee"><i class="fas fa-tag"></i></button>
          <button class="btn btn-export" type="button" onclick="exportEmployee(' + row.id + ')" title="Exporter cet employee"><i class="fas fa-upload"></i></button>
          <button class="btn btn-delete" type="button" onclick="removeEmployee(' + row.id + ')" title="Supprimer cet employee"><i class="fas fa-trash-alt"></i></button>
        </div>    
    `;
    return str;

}

// Création d'un employé
$('#btn-create').click(function () {
    $id = $('#crt-employee-id').val();
    $name = $('#crt-employee-name').val();
    $salary = $('#crt-employee-salary').val();
    $.post(
        $API + '/create',
        {
            employee_name: $name,
            employee_salary: $salary,
        },
        function (data) {
            $data = data.data;
            $newEmployee = '\nId: ' + $data.id + '\nName: ' + $data.employee_name + '\nSalary: ' + $data.employee_salary;
            alert(data.message + $newEmployee);

            $table.bootstrapTable('insertRow',
                {
                    index: $data.id,
                    row: {
                        id: $data.id,
                        employee_name: $data.employee_name,
                        employee_salary: $data.employee_salary
                    }
                }
            );

        }, 'json'
    );

})

// Suppression d'un employé
function removeEmployee(idEmployee) {

    // Suppression de l'emplyé dans l'API
    $.ajax({
        url: $API + '/delete/' + idEmployee,
        type: 'DELETE',
        success: function (data) {
            alert(data.message);
            // Suppression de la ligne de l'employé dans la table
            $table.bootstrapTable('remove', {
                field: 'id',
                values: [idEmployee]
            });
        }
    })

}

// Affichage des détails d'un employé de l'API et modifications de ses informations
function getDetailEmployee(idEmployee) {
    $id = $('#employee-id');
    $name = $('#employee-name');
    $salary = $('#employee-salary');

    if (!idEmployee) return false;

    $.ajax({
        url: $API + '/employee/' + idEmployee,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var employee = data.data;
            $id.val(employee.id);
            $name.val(employee.employee_name);
            $salary.val(employee.employee_salary);
        }
    });

    // Evenement au click du bouton "Enregistrer" de la modal
    $('#btn-register').click(function () {
        // Update de l'employeé
        $.ajax({
            url: $API + '/update/' + idEmployee,
            type: 'PUT',
            dataType: 'json',
            success: function (data) {
                $updateEmployee = '\nId: ' + idEmployee + '\nName: ' + $name.val() + '\nSalary: ' + $salary.val();
                alert(data.message + $updateEmployee);
                $table.bootstrapTable(
                    'updateRow',
                    {
                        index: idEmployee - 1,
                        row: {
                            id: idEmployee,
                            employee_name: $name.val(),
                            employee_salary: $salary.val()
                        }
                    }
                );
            }
        });

    });

}