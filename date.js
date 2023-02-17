
export function getDate() {

    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
}

return today.toLocaleDateString("en-US", options)
}


