'use strict';

var Hogan = require ('hogan.js'),
  moment = require('moment'),
  xmlStringTemp = '';

var Pages = require('./app/static/page-vars.json');
var Editions = require('./app/static/edition-vars.json');

var feed = function(){

  var pages = Pages;
  var editions = Editions;
  var dateString = editions.updatedDate;


  var constructAtomEntry = function(element, index, array) {

    var entry, template, dateString;

    var data = {
      name: element.name,
      fsName: element.fsName,
      desc: element.description,
      section: 'News',
      date: dateString
    };

    template = Hogan.compile('  <entry>\n    <title>{{name}}</title>\n    <id>{{fsName}}</id>\n    <updated>{{date}}</updated>\n    <published>2013-09-12T00:12:00+00:00</published>\n    <summary>{{desc}}</summary>\n    <category scheme="http://schema.pugpig.com/section" term="{{section}}"/>\n    <link rel="alternate" type="text/html" href="{{fsName}}.html"/>\n    <link rel="related" type="text/cache-manifest" href="{{fsName}}.manifest"/>\n  </entry>\n\n');

    entry = template.render(data);

    xmlStringTemp = xmlStringTemp + entry;

  };

  pages.forEach(constructAtomEntry);

  this.xmlStr = '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">\n\n  <id>' + editions.editionArray[0].id + '</id>\n  <title>' + editions.editionArray[0].title + '</title>\n  <updated>' + dateString + '</updated>\n\n  <author>\n    <name>Kaldor Group</name>\n  </author>\n' + xmlStringTemp + '</feed>';

  // this.xmlStr = this.xmlstr + xmlStringTemp;

};

module.exports = feed;