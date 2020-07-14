// Init
M.AutoInit();

// Type Select
$("#type-label").css("opacity", 0);
$("#type-select").change(function() {
    $("#type-label").css("opacity", $("#type-select").val().length == 0 ? 1 : 0);
});

// AJAX
$("#search-form").change(function() {
    let query = "?";
    query += "name=" + $("[name=name]").val();
    query += "&range=" + $("[name=range]").val();
    query += "&types=" + $("[name=types]").val();
    query += "&future=" + $("[name=future]").prop("checked");

    ajax(query);
});

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
ajax("?");