
requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../lib/bower_components/jquery/dist/jquery.min',
    'lodash': '../lib/bower_components/lodash/lodash.min',
    'hbs': '../lib/bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../lib/bower_components/bootstrap/dist/js/bootstrap.min',
    'q': '../lib/bower_components/q/q',
    'firebase' : '../lib/bower_components/firebase/firebase'
  },
  shim: {
    'bootstrap': ['jquery'],
    'firebase': {exports: 'Firebase'}
  }
});

requirejs(
  ["jquery", "hbs", "bootstrap", "lodash", "q", "getData", "loginRegister"],
  function($, Handlebars, bootstrap, _, q, getData, loginRegister) {

  $('#searchButton').click(function(){
    getData.OMDbSearch($('#searchText').val());
  });

  $("#submit").click(function(){
    console.log("YES");
  });

  $('#registerButton').click(function(){
    console.log("registerButton clicked");
    loginRegister.getRegister();
  });


});




