'use strict';

var Pages = require('./app/static/page-vars.js'),
  Editions = require('./app/static/edition-vars.js'),
  Hogan = require ('hogan.js'),
  moment = require('moment'),
  xmlStringTemp = '';

var feed = function(){

  var pageObj = new Pages();

  var constructAtomEntry = function(element, index, array) {

    var entry, template, edition, editionDate, dateString;
    edition = new Editions();
    editionDate = moment(edition.buildDate);
    dateString = editionDate.format();

    var data = {
      name: element.name,
      fsName: element.fsName,
      desc: element.description,
      section: 'News',
      date: dateString,
    };

    template = Hogan.compile('  <entry>\n  <title>{{name}}</title>\n    <id>{{fsName}}</id>\n    <updated>2013-09-12T00:12:00+00:00</updated>\n    <published>2013-09-12T00:12:00+00:00</published>\n    <summary>{{desc}}</summary>\n    <category scheme="http://schema.pugpig.com/section" term="{{section}}"/>\n    <link rel="alternate" type="text/html" href="{{fsName}}.html"/>\n    <link rel="related" type="text/cache-manifest" href="{{fsName}}.manifest"/>\n  </entry>\n\n');

    entry = template.render(data);

    xmlStringTemp = xmlStringTemp + entry;

  };

  pageObj.pageArray.forEach(constructAtomEntry);

  this.xmlStr = '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">\n\n  <id>1234</id>\n  <title>Edition 1234</title>\n  <updated>' + dateString + '</updated>\n\n  <author>\n    <name>Kaldor Group</name>\n  </author>\n' + xmlStringTemp + '</feed>';

  // this.xmlStr = this.xmlstr + xmlStringTemp;

};

module.exports = feed;