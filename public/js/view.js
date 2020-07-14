M.AutoInit();

let query = new URLSearchParams(document.location.search);

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(this.responseText);

        let event = data[0];

        $("#name-field").text(event.name);

        if(event.description) {
            $("#description-button").removeClass("hide");
            $("#description-field").text(event.description);
        }

        $("#start-field").text(event.start);
        $("#days-left-field").text(`
            ${
                parseInt(
                    Math.ceil(
                        Math.abs(new Date() - makeDate(event.start)) / 86400000
                    )
                )
            } days left!
        `);

        $("#duration-field").text(event.duration);

        $("#country-field").text(event.country.toUpperCase());

        if(event.classes) $("#classes-field").html(event.classes.map(i => `<div class="chip">${i}</div>`).join(""));

        if(event.logo) $("#logo-field").html(`
            <img class="logo" src="images/${event.logo}"></img>
        `);

        if(event.media) {
            $("#media-button").removeClass("hide");
            $("#media").html(event.media.map(i => `
                <img class="media" src="images/${i}"></img>
            `));
        }

        if(event.links) $("#links-field").html(`
            <ul>
                ${Object.keys(event.links).map(i => `
                    <li>
                        <a href="${event.links[i]}">
                            <h6>${i}</h6>
                        </a>
                    </li>
                `).join("")}
            </ul>
        `);
    }
};

xhr.open("GET", "/query?id=" + query.get("id"), true);
xhr.send();