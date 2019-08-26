const cron = require('node-cron');
const request = require('request');
const User = require('../user/user.model');
const config = require('../../config/config'); // get config file
const moment = require('moment');

let insertion = true;
let updation = true;

function insertionProcessApiRequests() {
  return false                     
}
function updationProcessApiRequests() {
    return
                 
}
// console.log('cron systems initiated, looking forward to scheduled tasks at: ', moment().format("DD MMMM YYYY hh:mm:ss a"));
// cron.schedule('* * * * *', function () {
//     // console.log('cron job started at: ', moment().format("DD MMMM YYYY hh:mm:ss a"));

//     if (insertion) {
//         insertionProcessApiRequests()
//             .then(data => {
//                 // console.log(data);
//                 insertion = true;
//             })
//             .catch(err => console.log(err));
//     } else {
//         console.log("insertionProcessApiRequests running");
//     }
//     if (updation) {
//         updationProcessApiRequests()
//             .then(data => {
//                 // console.log(data);
//                 updation = true;
//             })
//             .catch(err => console.log(err));
//     } else {
//         console.log("updationProcessApiRequests running");
//     }
// })
