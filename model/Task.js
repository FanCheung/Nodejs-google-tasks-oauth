//Only needed method are expose for public access
var google = require('googleapis');
var calendar = google.calendar('v3');
var https = require('https');
var Tasks={};

/**
 * Get all the tasks
 * @returns {promise} resolve to events from google
 */
Tasks.getAll = function () {
    return Q.Promise(function (resolve, reject) {
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime'
        }, function (err, response) {
            if (err) {
                return reject(err);
            }
            var events = response.items;
            return resolve(events);

        });
    });
};
/**
 * Delete tasks
 * @param(id) taskId
 * returns {promise} resolve to deleted item object
 */
Tasks.delete = function (id) {
    return Q.Promise(function (resolve, reject) {
        calendar.events.delete({calendarId: 'primary', eventId: id}, function (err, response) {
            if (err)
                return reject(err);
            return resolve(response);
        });

    });

};
/**
 * Add task to calendar via googleapi
 * @param param object, object contains task properties
 * @returns {promise} resolve to newly add calendar object, reject if error
 */
Tasks.add = function (param) {
    return Q.Promise(function (resolve, reject) {
        //assume start time is 12 noon
        startTime = param.date;
        var tempTime = new Date(param.date);
        tempTime.setHours(12);
        //assume the task last for one hour
        var endTime = new Date(tempTime.setTime(tempTime.getTime() + (1 * 60 * 60 * 1000)));

        calendar.events.insert({
            calendarId: "primary",
            resource: {
                start: {
                    dateTime: startTime,
                    timeZone: "Asia/Hong_Kong"
                },
                end: {
                    dateTime: endTime,
                    timeZone: "Asia/Hong_Kong"
                },
                summary: param.summary,
                description: param.description
            }
        }, function (err, response) {
            if (err)
                return reject(err);
            else
                return resolve(response);
        });
    });
};

module.exports = Tasks;