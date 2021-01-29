var j = 0;
var $table = $('#table');
var $API = 'http://dummy.restapiexample.com/api/v1'; // URL de l'API

$(document).ready(function () {
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
});

// Récupération des données de l'API chargée à l'intérieur de la table
function getEmployee() {

    // $.get(
    //     $API + '/employees',
    //     function (data) {
    //         $table.bootstrapTable('load', data.data);
    //     },
    //     'json'
    // );

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
// $('#btn-create').click(function () {
//     $name = $('#crt-employee-name').val();
//     $salary = $('#crt-employee-salary').val();
//     $age = $('#crt-employee-age').val();
//     $image = $('#crt-profile-image').val();
//
//     $.post(
//         $API + '/create',
//         {
//             employee_name: $name,
//             employee_salary: $salary,
//             employee_age: $age,
//             profile_image: $image
//         },
//         function (data) {
//             $data = data.data;
//             $newEmployee = '\nId: ' + $data.id + '\nName: ' + $data.employee_name + '\nSalary: ' + $data.employee_salary + '\nAge: ' + $data.employee_age + '\nProfile image: ' + $data.profile_image;
//             alert(data.message + $newEmployee);
//             // Insertion de la ligne de l'employé dans la table
//             $table.bootstrapTable('insertRow',
//                 {
//                     index: $data.id,
//                     row: {
//                         id: $data.id,
//                         employee_name: $data.employee_name,
//                         employee_salary: $data.employee_salary,
//                         employee_age: $data.employee_age,
//                         profile_image: $data.profile_image
//                     }
//                 }
//             );
//
//         }, 'json'
//     );
//
// })

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

/* // GESTION DES TAGS //  */

// Fonction permettant l'affichage des tags dans la colonne "Tags" pour chaque ligne d'un employé
function tagsFormatter(value, row, index) {
    var tags = '<div class="content-tags">' + (((value != 0) && (value != null)) ? value : '') + '</div>';
    return tags;
}

/* Barre de Recherche des tags */
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

/* Création des tags */
$("#createTag").click(function () {
    var tagColor = $("#newTagColor").val();
    var tagValue = $("#newTag").val();
    var newTag = '<div class="tag' + j + ' p-1" onclick="addTagInTable(' + j + ',\'' + tagValue + '\',\'' + tagColor + '\')">'
        + '<a href="#" class="dropdown-item badge badge' + j + ' m-0" style="background-color: ' + tagColor + '; color: white;">'
        + tagValue + ' <i onclick="removeTag(' + j + ')" class="fas fa-times"></i>'
        + '</a></div>';

    if ($("#newTag").val() === "") return ''; else {
        j = j;
        $("#searchTagList").append(newTag);
        $("#modalTagList").append(newTag);
        $("#newTag").val("");
        j++;
    }
    ;

})

/* Fonction de suppression des tags de manière généralisé */
function removeTag(param) {
    $(".tag" + param).remove();
    $(".tag-table" + param).remove();
}

/* Fonction de suppression des tags uniquement sur la table */
function removeTagSingle(param) {
    if ($table.bootstrapTable('getSelections') == true) {
        $table.bootstrapTable('updateCell', {
            index: $table.bootstrapTable('getSelections'),
            field: 'tags',
            value: $(".tag-table" + param).remove(),
        })
    } else {
        return false
    }
    ;
}

/* Ajout de tags aux lignes sélectionnées dans la colonne "Tags" */
function addTagInTable(idTag, valTag, colorTag) {

    var newTagTable = '<div class="tag-table' + idTag + ' p-1">'
        + '<a onclick="removeTagSingle(' + idTag + ')" class="dropdown-item badge badge' + idTag + ' m-0" style="background-color: ' + colorTag + '; color: white;">'
        + valTag + '</a></div>';

    for (var i = 0; i < $table.bootstrapTable('getSelections').length; i++) {
        $table.bootstrapTable('updateCell', {
            index: $table.bootstrapTable('getSelections')[i].id - 1,
            field: 'tags',
            value: newTagTable,
        });
    }

}

/* ============================ SEARCHBAR ============================================== */
let suggestions;
$.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        suggestions = data;
        suggestions.slice(10);
    }
})

// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".search-icon");

if (!$(".searchbar").focusin) {
    $(".search-icon").css("left","18px");
} else {
    $(".search-icon").css("right","18px");
}


// if user press any key and release
inputBox.onkeyup = (e) => {
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if (!userData) {
        searchWrapper.classList.remove("active"); //hide autocomplete box
        suggBox.setAttribute('hidden', true)
    } else {
        suggBox.removeAttribute('hidden')
        var output = suggestions.filter(suggestions => suggestions.title);
        for (var i = 0; i < output.length; i++) {
            let data = output[i].title;
            emptyArray.push(data);
        };
        emptyArray = emptyArray.map((data) => {
            // passing return data inside li tag
            let stateData = data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
            console.log(stateData);
            if (stateData) {
                return '<li class="list-group-item d-flex"><i class="fas fa-plus-circle pr-2 my-auto"></i><p class="m-0">' + data + '</p></li>';
            } else {
                return "";
            }

        });
        searchWrapper.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    }
}

function select(element) {
    let selectData = element.textContent;
    inputBox.value = selectData;
    $table.bootstrapTable('insertRow', {
        index: 1,
        row: {
            employee_name: selectData,
            employee_salary: ``,
            employee_age: `<input class="form-control" id="quantity" value="1"/>`,
            profile_image: ``
        }
    })
    searchWrapper.classList.remove("active");
    suggBox.setAttribute('hidden', true)
}

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        userValue = inputBox.value;
        listData = '<li>' + userValue + '</li>';
    } else {
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}


