// dd.MM.yyyy
function makeDate(string) {
    return new Date(string.split(".")[2], string.split(".")[1] - 1, string.split(".")[0])
}

try {
    module.exports.makeDate = makeDate;
} catch (error) {}