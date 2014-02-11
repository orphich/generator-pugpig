'use strict';

var moment = require('moment');

var buildDate = moment('2014-01-30T00:12:00+00:00');      // Remove string if you want date to be now

var editions = function() {

  this.editionDate = buildDate;  

  // this.editionDate = Date.now();

  this.editionArray = [];

    // <ul>

    // </ul>
};

module.exports = buildDate;
module.exports = editions;