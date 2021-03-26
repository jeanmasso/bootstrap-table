var $table = $('#table');
var $API = 'http://dummy.restapiexample.com/api/v1'; // URL de l'API

$(document).ready(function () {
    // Création de la table généré par BootstrapTable
    $table.bootstrapTable({
        classes: 'table table-hover table-bordered table-sm',
        theadClasses: 'thead-light',
        // pagination: true,
        // pageSize: 15,
        // pageList: ['15', '25'],
        idField: 'id',
        sortName: 'id',
        selectItemName: 'selectItemName',
        filterControl: true,
        showFooter: true,
        showExport: true,
        exportTypes: ['txt', 'sql', 'excel', 'pdf'],
        exportOptions: {
            ignoreColumn: ['action'],
        },
        buttons: 'buttons',
        showPrint: true,
        columns: [{
            field: 'state',
            titleTooltip: 'Selectionner un/plusieurs employé(s)',
            width: '50',
            align: 'center',
            checkbox: true,
            printIgnore: true
        },
            //     {
            //     field: 'id',
            //     title: 'Identifiant',
            //     titleTooltip: 'Colonne des identifiants des employés',
            //     width: '50',
            //     align: 'center',
            //     sortable: true,
            //     formatter: 'fieldFormatter',
            // },
            {
                field: 'employee_name',
                title: 'Name',
                titleTooltip: 'Colonne des noms des employés',
                // width: '50',
                align: 'center',
                sortable: true,
                filterControl: 'input',
                formatter: 'fieldFormatter',
                footerFormatter: 'totalTextFormatter'
            }, {
                field: 'employee_salary',
                title: 'Salary',
                titleTooltip: 'Colonne des salaires des employés',
                // width: '50',
                align: 'center',
                filterControl: 'input',
                sortable: true,
                formatter: 'fieldFormatter',
                footerFormatter: 'totalFormatter'
            }, {
                field: 'employee_age',
                title: 'Age',
                titleTooltip: "Colonne de l'age des employés",
                width: '50',
                align: 'center',
                filterControl: 'input',
                sortable: true,
                formatter: 'fieldFormatter',
                footerFormatter: 'totalFormatter'
            }, {
                field: 'profile_image',
                title: 'Profile image',
                titleTooltip: 'Colonne des images du profile des employés',
                // width: '50',
                align: 'center',
                sortable: true,
                formatter: 'testFormatter',
            }, {
                field: 'tags',
                title: 'Tags',
                titleTooltip: 'Colonne des tags associés aux employés',
                // width: '50',
                align: 'center',
                sortable: true,
                formatter: "tagsFormatter",
            }, {
                field: 'action',
                title: 'Action',
                titleTooltip: 'Colonne des différents actions possibles',
                // width: '50',
                align: 'center',
                printIgnore: true,
                sortable: true,
                formatter: 'actionFormatter',
                footerFormatter: 'sumFormatter'
            }]
    });

    getEmployee();
});

// Récupération des données de l'API chargée à l'intérieur de la table
function getEmployee() {

    $.get(
        $API + '/employees',
        function (data) {
            $table.bootstrapTable('load', data.data);
        },
        'json'
    );

}

// Fonction permettant au clique sur les <span> d'ouvrir la modal des détails d'un employé
function fieldFormatter(value, row, index) {
    var txt = '<span class="field" data-toggle="modal" data-target="#detailsEmployee" onclick="getDetailEmployee(' + row.id + ')">' + (((value != 0) && (value != null)) ? value : '') + '</span>';
    return txt;
}

// Fonction permettant l'affichage des boutons dans la colonne "Action" pour chaque ligne d'un employé
function actionFormatter(value, row, index) {

    var str = `
        <div class="action">
          <button class="btn btn-edit btn-dark" type="button" data-toggle="modal" data-target="#detailsEmployee" onclick="` + 'getDetailEmployee(' + row.id + ')' + `" title="Afficher les information de cet employee"><i class="fas fa-pencil-alt"></i></button>
<!--          <button class="btn btn-tags btn-dark" type="button" onclick="` + 'addTagsEmployee(' + row.id + ')' + `" title="Ajouter des étiquettes à cet employee"><i class="fas fa-tag"></i></button>-->
          <button class="btn btn-delete btn-danger" type="button" onclick="` + 'removeEmployee(' + row.id + ')' + `" title="Supprimer cet employee"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;
    return str;

}

// Création des boutons de la barre d'outils
function buttons() {
    return {
        btnAdd: {
            icon: 'fa-plus',
            attributes: {
                title: 'Créer un nouvel employé',
                onclick: 'addRow()',
            }
        }
    }
}

// Suppression d'un employé
function removeEmployee(idEmployee) {

    // Suppression de l'employé dans l'API
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
    $age = $('#employee-age');
    $image = $('#profile-image');

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
            $age.val(employee.employee_age);
            $image.val(employee.profile_image);
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
                            employee_salary: $salary.val(),
                            employee_age: $age.val(),
                            profile_image: $image.val()
                        }
                    }
                );
            }
        });

    });

}

/* // GESTION DE L'AJOUT D'UNE LIGNE AU TABLEAU //  */

// Création d'un employé et d'une ligne du tableau
$('#btn-create').click(function () {
    $name = $('#crt-employee-name').val();
    $salary = $('#crt-employee-salary').val();
    $age = $('#crt-employee-age').val();
    $image = $('#crt-profile-image').val();

    $.post(
        $API + '/create',
        {
            employee_name: $name,
            employee_salary: $salary,
            employee_age: $age,
            profile_image: $image
        },
        function (data) {
            $data = data.data;
            $newEmployee = '\nId: ' + $data.id + '\nName: ' + $data.employee_name + '\nSalary: ' + $data.employee_salary + '\nAge: ' + $data.employee_age + '\nProfile image: ' + $data.profile_image;
            alert(data.message + $newEmployee);
            // Insertion de la ligne de l'employé dans la table
            $table.bootstrapTable('insertRow',
                {
                    index: $data.id,
                    row: {
                        id: $data.id,
                        employee_name: $data.employee_name,
                        employee_salary: $data.employee_salary,
                        employee_age: $data.employee_age,
                        profile_image: $data.profile_image
                    }
                }
            );

        }, 'json'
    );

})

function addRow() {
    var name, salary, age, image;
    $('#createEmployee').modal('show');
    $table.bootstrapTable('insertRow', {
        index: 0,
        row: {
            employee_name: `<span class="text-center" id="newEmployeeName"></span>`,
            employee_salary: `<span class="text-center" id="newEmployeeSalary"></span>`,
            employee_age: `<span class="text-center" id="newEmployeeAge"></span>`,
            profile_image: `<span class="text-center" id="newEmployeeImage"></span>`
        }
    })

    $('#btn-create').click(function () {
        name = $('#crt-employee-name').val();
        salary = $('#crt-employee-salary').val();
        age = $('#crt-employee-age').val();
        image = $('#crt-profile-image').val();
        $("#newEmployeeName").html(name);
        $("#newEmployeeSalary").html(salary);
        $("#newEmployeeAge").html(age);
        $("#newEmployeeImage").html(image);
    })
}

/* ================ TOTAUX DES LIGNES =============== */

function totalTextFormatter(data) {
    return 'Total';
}

function totalFormatter(data) {
    let field = this.field;
    return data.map(function (row) {
        return row[field];
    }).reduce(function (sum, i) {
        return sum + i
    }, 0);
}

function sumFormatter(data) {
    var field = this.field;

    var total_sum = data.reduce(function(sum, row) {
        //console.log(sum);
        return sum + (parseInt(row[field]) || 0);
    }, 0);
    return total_sum;
}

function testFormatter(value, row, index, field) {
    console.log("\nvalue:" + value + "\nrow:" + JSON.stringify(row) + "\nindex:" + index + "\nfield:" + field)

}

