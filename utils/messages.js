const moment = require("moment");

function formatMessage(username, message) {
    return {
        username,
        message,
        time: moment().format('h:mm a') //de la librelira moment retorna hora, minutos y am o pm
    }
}

module.exports = formatMessage