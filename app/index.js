'use strict';
var util = require('util');
var path = require('path');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var yeoman = require('yeoman-generator');
var DRUPAL = 'Drupal';
var WORDPRESS = 'Wordpress';
var fs = require('fs');
var STATIC = 'Static';
var themeFolder;
var promptData = {
  templateType: null,
  publisherName: null,
  publicationName: null
};
var appDir;
var _ = require('lodash');

var writeBuildXML = function writeBuildXML( template ) {
  fs.writeFile('build.xml', template({
    publisher: promptData.publisherName,
    publication: promptData.publicationName
  }), function (err) {
    if ( err !== null ) {
      console.log( 'Write file error: ' + err );
    }
    console.log('build.xml created');
  });
};

var generateBuildXML = function generateBuildXML() {

  var templateType = promptData.templateType,
    buildTemplateFile;

  if (templateType === DRUPAL) {
    buildTemplateFile = 'buildutils/template-build-drupal_and_static.xml';
  } else if (templateType === WORDPRESS) {
    buildTemplateFile = 'buildutils/template-build-wordpress_and_static.xml';
  } else if (templateType === STATIC) {
    buildTemplateFile = 'buildutils/template-build-static.xml';
  }

  fs.readFile(buildTemplateFile, {
    encoding: 'utf8',
  }, function(err, data) {
    if (err !== null) {
      console.log( 'Read file error: ' + err );
    } else {

      var buildTemplate = _.template( data );

      writeBuildXML( buildTemplate );

    }
  });

};

var addGitSubmodules = function addGitSubmodules() {
  exec('git submodule add git@bitbucket.org:kaldorgroup/kaldor-build-utils.git buildutils', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    if (stderr) {
      console.log('stderr: ' + stderr);
    }
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      generateBuildXML();
    }
  });
};

var initGit = function initGit() {
  var init = spawn('git', ['init']);

  init.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  init.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  init.on('close', function () {
    addGitSubmodules();
  });
};

var PugpigGenerator = module.exports = function PugpigGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    process.chdir(themeFolder);
    this.installDependencies({ skipInstall: options['skip-install'] });
    process.chdir('../../');
    initGit.call( this );
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

};

util.inherits(PugpigGenerator, yeoman.generators.Base);

PugpigGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.pugpig);

  var prompts = [{
    type: 'list',
    name: 'templateType',
    choices: ['Static', 'Drupal', 'Wordpress'],
    message: 'What type of Pugpig template would you like to create?'
  },
  {
    type: 'input',
    name: 'publisherName',
    message: 'What is the name of the publisher?'
  },
  {
    type: 'input',
    name: 'publicationName',
    message: 'What is the name of the publication?'
  }];

  this.prompt(prompts, function (props) {

    promptData.templateType = props.templateType;
    promptData.publisherName = props.publisherName;
    promptData.publicationName = props.publicationName;

    cb();
  }.bind(this));
};

PugpigGenerator.prototype.appStructure = function appStructure() {

  var projectName = promptData.publisherName + '-' + promptData.publicationName + '-Server',
    projectData = {
      projectName: projectName
    },
    templateType = promptData.templateType,
    modulesFolder;

  themeFolder = 'themes/' + promptData.publicationName.toLowerCase() + '/';
  appDir = themeFolder + 'app/';

  this.mkdir('themes');
  this.mkdir(themeFolder);

  if (templateType === DRUPAL) {
    modulesFolder = 'modules';
  } else if (templateType === WORDPRESS) {
    modulesFolder = 'plugins';
  }

  if ( modulesFolder ) {
    this.mkdir(modulesFolder);
    this.mkdir(modulesFolder + '/pugpig-' + promptData.publicationName.toLowerCase());
  }

  if (templateType === DRUPAL) {
    modulesFolder = 'modules';
  } else if (templateType === WORDPRESS) {
    this.template('wordpress/plugins.php', modulesFolder + '/pugpig-' + promptData.publicationName.toLowerCase() + '/pugpig_' + promptData.publicationName.toLowerCase() + '.php', {
      publicationCapitalized: promptData.publicationName,
      publicationLowercase: promptData.publicationName.toLowerCase()
    });
  }

  this.mkdir(appDir);

  this.directory('static', appDir + 'static');
  this.directory('styles', appDir + 'styles');

  this.mkdir(appDir + 'static/images');
  this.mkdir(appDir + 'styles/components');

  this.template('index.html', appDir + 'static/index.html', projectData);

  this.template('Gruntfile.js', themeFolder + 'Gruntfile.js');

  this.template('_package.json', themeFolder + 'package.json', projectData);

  this.template('_bower.json', themeFolder + 'bower.json', projectData);

};

PugpigGenerator.prototype.createImagesDir = function createImagesDir() {
  this.mkdir(appDir + 'images');
};

PugpigGenerator.prototype.createScriptsDir = function createScriptsDir() {
  this.mkdir(appDir + 'scripts');
};

PugpigGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', themeFolder + '.editorconfig');
  this.copy('jshintrc', themeFolder + '.jshintrc');
};

PugpigGenerator.prototype.gitFiles = function gitFiles() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitmodules', '.gitmodules');
};

PugpigGenerator.prototype.karmaFiles = function karmaFiles() {
  this.copy('karma.conf.js', themeFolder + 'karma.conf.js');
};

PugpigGenerator.prototype.compassFiles = function compassFiles() {
  this.copy('compass.rb', themeFolder + '.compass.rb');
};
