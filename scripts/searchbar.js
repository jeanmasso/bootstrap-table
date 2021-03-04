const searchBlock = document.querySelector(".search-block");
const inputBox = searchBlock.querySelector("input");
const autocompBlock = searchBlock.querySelector(".autocomp-block");
const iconSearch = searchBlock.querySelector(".search-icon");
const iconReset = searchBlock.querySelector(".search-reset");

inputBox.addEventListener('keyup', debounce(search, 800));

function search(e) {

    let userData = e.target.value; // userData prend la valeur du champs de saisie
    let emptyArray = [];

    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        type: 'GET',
        dataType: 'json',
        success: searchProcessing
    });

    function searchProcessing(response) {
        let suggestions = response;

        if (!userData) { // Si le champs de saisie est vide
            autocompBlock.setAttribute('hidden', true) // Ne pas afficher la liste déroulante
            iconReset.style.display = "none";
        } else {
            iconReset.style.display = "block";
            autocompBlock.removeAttribute('hidden') // Afficher la liste déroulante en supprimant l'attribut "hidden"
            for (let i = 0; i < suggestions.length; i++) { // On parcours tout le tableau
                let data = suggestions[i].title; // On affecte a data un titre à la fois
                emptyArray.push(data);
            };

            // On parcours le tableau afin que chaque élément soit dans un li de la liste déroulante
            emptyArray = emptyArray.map((data) => {
                let stateData = data.toLocaleLowerCase().includes(userData.toLocaleLowerCase()); // On check si ce qui la valeur saisie, est inclut dans data
                if (stateData) {
                    let regExp = userData;
                    let newData = data.replace(regExp, '<span style="color: blue">' + userData + '</span>');
                    return '<li class="list-group-item d-flex"><i class="fas fa-plus-circle pr-2 my-auto"></i><p class="m-0">' + newData + '</p></li>';
                } else {
                    return "";
                }
            });
            searchBlock.classList.add("active"); //show autocomplete box
            showSuggestions(emptyArray);
            let allList = autocompBlock.querySelectorAll("li");
            for (let i = 0; i < allList.length; i++) {
                //adding onclick attribute in all li tag
                allList[i].setAttribute("onclick", "selectSuggestions(this)");
            }
        }
    }
}

// Fonction permettant de sélectionner un élement de la liste
function selectSuggestions(element) {
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
    inputBox.focus();
    autocompBlock.setAttribute('hidden', true)
}

// Fonction permettant de gérer l'affiche des suggestions
function showSuggestions(list) {
    let listData;
    if (list.length) {
        listData = list.join('');
    }
    autocompBlock.innerHTML = listData;
}

function debounce(callback, delay){
    var timer;
    return function(){
        var args = arguments;
        var context = this;
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback.apply(context, args);
        }, delay)
    }
}

function resetSearch() {
    // $("#formSearchbar")[0].reset();
    $(".searchbar").val("");
}