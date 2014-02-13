'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');

var pagesPath = process.cwd() + '/page-vars.json';
var Pages = require(pagesPath);

// var editionsPath = process.cwd() + '/edition-vars.json';
// var Editions = require(editionPath);

var TemplateGenerator = module.exports = function TemplateGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(TemplateGenerator, yeoman.generators.NamedBase);

TemplateGenerator.prototype.askFor = function askFor() {

  var cb = this.async();

  var prompts = [{
    type: 'input',
    name: 'description',
    message: 'Please provide a description for your template'
  }];

  this.prompt(prompts, function (props) {
    this.description = props.description;
    this.fsTemplateName = this.name.toLowerCase().replace(/\s/g, '-');
    cb();
  }.bind(this));
};

TemplateGenerator.prototype.create = function create() {

  this.template('template.html', this.fsTemplateName + '.html', {
    templateName: this.name,
    templateCSSFile: this.fsTemplateName
  });

};

TemplateGenerator.prototype.createManifest = function create() {

  this.template('template.manifest', this.fsTemplateName + '.manifest', {
  });

};

TemplateGenerator.prototype.createSass = function create() {

  this.template('styles.sass', '../styles/' + this.fsTemplateName + '.sass', {
    templateName: this.name,
    templateDescription: this.description
  });

};

TemplateGenerator.prototype.updatePages = function updatePages() {

  var pages = Pages,
    templateObj;

  templateObj = {
    fsName: this.fsTemplateName,
    name: this.name,
    description: this.description
  };

  pages.push(templateObj);

  fs.writeFile(pagesPath, JSON.stringify(pages, null, 2), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Pages object saved to JSON file');
    }
  });

  console.log('Page Object updated');

};

TemplateGenerator.prototype.updateEditions = function updateEditions() {

  // var editions = Editions,
  //   outputFilename = jsonPath,
  //   templateObj;

  // templateObj = {
  //   fsName: this.fsTemplateName,
  //   name: this.name,
  //   description: this.description
  // };

  // pages.push(templateObj);

  // fs.writeFile(jsonPath, JSON.stringify(pages, null, 2), function(err) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     console.log('Pages object saved to JSON file');
  //   }
  // });

  // console.log('Page Object updated');

};

TemplateGenerator.prototype.updateTOC = function updateTOC() {

  this.appendToFile('index.html', 'ul', '  <li><a href="' + this.fsTemplateName + '.html">' + this.name + '</a></li>\n  ');
  console.log('Table of Contents updated');

};
