$(document).ready(function () {

    $table = $('#table');
    $API = 'http://dummy.restapiexample.com/api/v1'; // URL de l'API

    // Création de la table généré par BootstrapTable
    $table.bootstrapTable({
        classes: 'table table-hover table-bordered table-sm',
        theadClasses: 'thead-light',
        pagination: true,
        pageSize: 15,
        pageList: ['15', '25'],
        idField: 'id',
        sortName: 'id',
        selectItemName: 'selectItemName',
        filterControl: true,
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
            printIgnore: true,
            formatter: 'fieldFormatter'
        }, {
            field: 'id',
            title: 'Identifiant',
            titleTooltip: 'Colonne des identifiants des employés',
            width: '50',
            align: 'center',
            sortable: true,
            formatter: 'fieldFormatter',
        }, {
            field: 'employee_name',
            title: 'Name',
            titleTooltip: 'Colonne des noms des employés',
            // width: '50',
            align: 'center',
            sortable: true,
            filterControl: 'input',
            formatter: 'fieldFormatter'
        }, {
            field: 'employee_salary',
            title: 'Salary',
            titleTooltip: 'Colonne des salaires des employés',
            // width: '50',
            align: 'center',
            filterControl: 'input',
            sortable: true,
            formatter: 'fieldFormatter',
        }, {
            field: 'employee_age',
            title: 'Age',
            titleTooltip: "Colonne de l'age des employés",
            width: '50',
            align: 'center',
            filterControl: 'input',
            sortable: true,
            formatter: 'fieldFormatter',
        }, {
            field: 'profile_image',
            title: 'Profile image',
            titleTooltip: 'Colonne des images du profile des employés',
            // width: '50',
            align: 'center',
            sortable: true,
            formatter: 'fieldFormatter',
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
            formatter: 'actionFormatter'
        }]
    });

    getEmployee();

<<<<<<< HEAD
});

// Fonction d'accès à la liste des donées des employés
=======
// Récupération des données de l'API chargée à l'intérieur de l'API
>>>>>>> 4ed75122882e5adb7d4db5ae2d928b39b3d9fbed
function getEmployee() {

    $.get(
        $API + '/employees',
        function (data) {
            $table.bootstrapTable('load', data.data);
        },
        'json'
    );

}

<<<<<<< HEAD
// Fonction permettant lors d'un clique sur le texte l'affichage des détails de l'employé
=======
// Fonction permettant au clique sur les <span> d'ouvrir la modal des détails d'un employé
>>>>>>> 4ed75122882e5adb7d4db5ae2d928b39b3d9fbed
function fieldFormatter(value, row, index) {
    var txt = '<span class="field" data-toggle="modal" data-target="#detailsEmployee" onclick="getDetailEmployee(' + row.id + ')">' + (((value != 0) && (value != null)) ? value : '') + '</span>';
    return txt;
}

<<<<<<< HEAD
// Fonction permettant l'affichage des boutons dans la colonne "Action"
function actionFormatter(value, row, index) {
=======

// Fonction permettant l'affichage des boutons dans la colonne "Action" pour chaque ligne d'un employé
function actionFormatter(value, row, index) { 
>>>>>>> 4ed75122882e5adb7d4db5ae2d928b39b3d9fbed

    var str = `
        <div class="action">
          <button class="btn btn-edit btn-dark" type="button" data-toggle="modal" data-target="#detailsEmployee" onclick="` + 'getDetailEmployee(' + row.id + ')' + `" title="Afficher les information de cet employee"><i class="fas fa-pencil-alt"></i></button>
<!--          <button class="btn btn-tags btn-dark" type="button" onclick="` + 'addTagsEmployee(' + row.id + ')' + `" title="Ajouter des étiquettes à cet employee"><i class="fas fa-tag"></i></button>-->
          <button class="btn btn-delete btn-danger" type="button" onclick="` + 'removeEmployee(' + row.id + ')' + `" title="Supprimer cet employee"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;
    return str;

}

function tagsFormatter(value, row, index) {
    var tags = '<div class="content-tags">'+ (((value != 0) && (value != null)) ? value : '')  +'</div>';
    return tags;
}

// Création des boutons de la barre d'outils
function buttons () {
    return {
        btnAdd: {
            icon: 'fa-plus',
            attributes: {
                title: 'Créer un nouvel employé',
                'data-toggle': 'modal',
                'data-target': '#createEmployee'
            }
        }
    }
}

// Création d'un employé
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

// Barre de recherche des tags
function searchTag() {
    var searchbar, filter, tagList, div, a, i, txtValue;
    searchbar = document.getElementById("searchbar");
    filter = searchbar.value.toUpperCase();
    tagList = document.getElementById("searchTagList");
    div = tagList.getElementsByTagName("div");
    for (i = 0; i < div.length; i++) {
        a = div[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none";
        }
    }
}

// Création de tags
function createTag() {
    var newTag = $("#newTag").val();
    var newTagColor = $("#newTagColor").val();
    if (newTag === "") return ''; else {
        $("#searchTagList").append(`
            <div class="tag p-1" onclick="addTag()"><a class="dropdown-item badge m-0" style="background-color: ${newTagColor}; color: white;">${newTag} <i class="fas fa-times" onclick="removeTag()"></i></a></li>
        `);
        $("#modalTagList").append(`
            <div class="tag p-1" onclick="addTag()"><a class="dropdown-item badge m-0" style="background-color: ${newTagColor}; color: white;">${newTag} <i class="fas fa-times" onclick="removeTag()"></i></a></div>
        `);
        $("#newTag").val("");
    };
}

// Suppression des tags
function removeTag(){
    $(".badge").parent(".tag").remove();
}

function addTag() {
    for (var i = 0; i < $table.bootstrapTable('getSelections').length; i++){
        $table.bootstrapTable('updateRow', {
            index: $table.bootstrapTable('getSelections')[i].id - 1,
            row: {
                tags: $(".tag").html(),
            }
        });
    }
}

