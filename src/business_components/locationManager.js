'use strict';

/**
 * Get the current location from the GPS sensor
 * Return promise with the gps data
 */
function getLocation() {
    
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(function success(position) {
            // console.log("Current position: ", position);
            resolve(position.coords);
        }, function error(err) {
            console.log(err);
            reject(err);
        });
    })
}

function watchLocation() {

    return new Promise(function(resolve, reject) {
        navigator.geolocation.watchPosition(function success(position) {
            // console.log("watched position: "); //, position);
            // console.log(position.coords);
            resolve(position.coords);
        }, function error(err) {
            console.log("err watched position");
            console.log(err);
            reject(err);
        });
    })
}

module.exports = {
    getLocation: getLocation,
    watchLocation: watchLocation
}