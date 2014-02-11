'use strict';

var editions = require('./<%= yeoman.app %>/static/edition-vars.js');
var moment = require('moment');
var Hogan = require ('hogan.js');
var xmlStringTemp = '';
var updateDate;

var feed = function(){

  var editionObj = new editions();

  var constructOPDSEntry = function(element, index, array) {

    var data = {
      name: element.name,
      fsName: element.id,
      desc: element.description,
      date: element.date,
      cover: element.coverURL,
      atom: element.atomURL,
      atomAlt: element.atomURLAlt
    };

    var template = Hogan.compile('  <entry>\n  <title>{{name}}</title>\n    <id>{{fsName}}</id>\n    <updated>{{date}}</updated>\n    <dcterms:issued>2013-09-13</dcterms:issued>\n    <author>\n      <name>Pugpig</name>\n    </author>\n    <summary>{{desc}}</summary>\n    <link rel="http://opds-spec.org/image" type="image/jpg" href="{{cover}}"/>\n    <link rel="http://opds-spec.org/acquisition" type="application/atom+xml" href="{{atom}}"/>\n    <link rel="alternate" type="application/atom+xml" href="{{atomAlt}}"/>\n  </entry>\n\n');

    var output = template.render(data);

    xmlStringTemp = xmlStringTemp + output;

  };

  editionObj.editionArray.forEach(constructOPDSEntry);

  updateDate = moment(editionObj.buildDate).format();

  this.xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:opds="http://opds-spec.org/2010/catalog">\n\n  <id>1234</id>\n  <title>Edition 1234</title>\n  <updated>' + updateDate + '</updated>\n  <author>\n    <name>Pugpig</name>\n  </author>\n\n' + xmlStringTemp + '</feed>';

  // this.xmlStr = this.xmlstr + xmlStringTemp;

};

module.exports = feed;