var j = 0;

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

// Fonction permettant l'affichage des tags dans la colonne "Tags" pour chaque ligne d'un employé
function tagsFormatter(value, row, index) {
    var tags = '<div class="content-tags">' + (((value != 0) && (value != null)) ? value : '') + '</div>';
    return tags;
}

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