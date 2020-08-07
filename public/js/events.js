// Init
M.AutoInit();

// Sorting
const sort_fields = [ "name", "start", "duration", "country" ]; // Fields To Sort By
const reverse_fields = [ "name", "country" ]; // Fields To Sort Alphabetically

let sort_criteria = sort_fields[0];
let sort_direction = "up";

function updateSortDisplay() {
    for(const field of sort_fields) $(`#${field}-sort`).html(`<i class="tiny material-icons">drag_handle</i>`);

    $(`#${sort_criteria}-sort`).html(`<i class="tiny material-icons">expand_${sort_direction == "down" ? "more" : "less"}</i>`);
}

for(const field of sort_fields)
    $(`#${field}-tag`).click(function() {
        if(reverse_fields.includes(field)) sort_direction = sort_criteria == field && sort_direction == "up" ? "down" : "up";
        else sort_direction = sort_criteria == field && sort_direction == "down" ? "up" : "down";

        sort_criteria = field;

        updateSortDisplay();
        runQuery();
    });

updateSortDisplay();

// Type Select
$("#type-label").css("opacity", 0);
$("#type-select").change(function() {
    $("#type-label").css("opacity", $("#type-select").val().length == 0 ? 1 : 0);
});

// AJAX
$("#search-form").change(function() {
    runQuery();
});

function runQuery() {
    let query = "?";
    query += "name=" + $("[name=name]").val();
    query += "&range=" + $("[name=range]").val();
    query += "&types=" + $("[name=types]").val();
    query += "&future=" + $("[name=future]").prop("checked");
    query += "&sort=" + sort_criteria;
    query += "&order=" + sort_direction;

    ajax(query);
}

function ajax(query) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);

            $(".event").remove();
            if(data.length == 0) $("#content-table").append("<tr class=\"event\"><td class=\"center\" colspan=\"4\">No Events Found.</td></tr>");

            for(const event of data) {
                $("#content-table").append(`
                    <tr class="event">
                        <td><a href=\"view?id=${event.id}\">${event.name}</a></td>
                        <td>${event.start}</td>
                        <td>${event.duration}</td>
                        <td><span class="flag-icon flag-icon-${event.country}"></span> ${event.country.toUpperCase()}</td>
                    </tr>
                `);
            }
        }
    };

    xhr.open("GET", "/query" + query, true);
    xhr.send();
}

// First AJAX
runQuery();