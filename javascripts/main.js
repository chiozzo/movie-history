requirejs.config({
  baseUrl: "./javascripts",
  paths:{
    "jquery": "../lib/bower_components/jquery/dist/jquery.min",
    "q": "../lib/bower_components/q/q",
    "lodash" : "../lib/bower_components/lodash/lodash.min",
    "bootstrap": "../lib/bower_components/bootstrap/dist/js/bootstrap.min",
    "hbs": "../lib/bower_components/require-handlebars-plugin/hbs",
    "firebase" : "../lib/bower_components/firebase/firebase",
    "scotch-panels": "../lib/bower_components/scotch-panels/dist/scotchPanels.min",
    "bootstrap-star-rating": "../lib/bower_components/bootstrap-star-rating/js/star-rating",
    "nouislider": "../lib/bower_components/nouislider/distribute/nouislider"
  },
  shim: {
    "bootstrap": ["jquery"],
    "scotch-panels": ["jquery"],
    "bootstrap-star-rating": ["bootstrap"],
    "nouislider": ["jquery"],
    "firebase": {exports: "Firebase"}
  }
});

require(
  ["jquery", "q", "lodash", "scotch-panels", "bootstrap-star-rating", "dataControl", "authenticate", "domControl", "filtering"],
  function($, q, _, scotchPanels, bootstrapStarRating, dataControl, authenticate, domControl, filtering) {

  var firebaseRef = new Firebase("https://nss-movie-history.firebaseio.com");

  var panelExample = $('#registerForm').scotchPanel({
    containerSelector: '#panelContainer', // Make this appear on the entire screen
    direction: 'left', // Make it toggle in from the left
    duration: 300, // Speed in ms how fast you want it to be
    transition: 'ease', // CSS3 transition type: linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier(P1x,P1y,P2x,P2y)
    distanceX: '100%', // Size of the toggle
    enableEscapeKey: true // Clicking Esc will close the panel
  });

  $(document).on('click', '#registerFormButton', function() {
    panelExample.open();
  });

  $("#loginUserButton").click(function(){
    authenticate.loginUser($('#loginEmailInput').val(), $('#loginPasswordInput').val());
  });

  $('#registerUserButton').click(function(){
    authenticate.registerNewUser().then(function(authArray){
      var email = authArray[0];
      var password = authArray[1];
      authenticate.loginUser(email, password);
    });
  });

  $(document).on('click', '#searchMoviesButton', function() {
    var searchResultsArray;
    var combinedMoviesArray;
    dataControl.OMDbSearch($('#searchText').val())
    .then(function(OMDbSearchResults) {
      searchResultsArray = OMDbSearchResults;
      dataControl.getUsersMovies()
      .then(function(firebaseMovies) {
        var firebaseMoviesArray = _.values(firebaseMovies).sort(function(a, b) {
          if (a.Title[0] < b.Title[0]) {
            return -1;
          }
          if (a.Title[0] > b.Title[0]) {
            return 1;
          }
          return 0;
        });
        var firebaseMoviesIMDbID = _.chain(firebaseMoviesArray).pluck('imdbID').uniq().value();
        var filteredSearchResultsArray = searchResultsArray.filter(function(value, index, array) {
          if ($.inArray(value.imdbID, firebaseMoviesIMDbID) === -1) {
            return true;
          } else{
            return false;
          }
        });
        combinedMoviesArray = filteredSearchResultsArray.concat(firebaseMoviesArray);
        domControl.loadProfileHbs(combinedMoviesArray);
      });
    });
  });

  // $(document).on('click', '#searchOMDbButton', function(){
  //   dataControl.OMDbSearch($('#searchText').val())
  //   .then(function(OMDbSearchResults) {
  //     require(['hbs!../templates/addMovie'], function(addMovie) {
  //       $('#OMDbSearchResults').html(addMovie({movies: OMDbSearchResults}));
  //     });
  //     $('#addMovieModal').modal();
  //   });
  // });

  $(document).on('click', '.addMovieButton', function() {
    var thisMovie = $(this).attr("imdbid");
      dataControl.OMDbIDSearch(thisMovie)
      .then(function(OMDbExactMatch) {
        var currentUser = firebaseRef.getAuth().uid;
        dataControl.addUserMovie(OMDbExactMatch);
      });
    $(this).remove();
  });

  $(document).on("click", ".deleteButton", function() {
    var imdbid = $(this).attr("imdbid");
    // dataControl.deleteUsersMovies(imdbid);
    dataControl.getUsersMovies()
    .then(function(movies) {
      domControl.loadProfileHbs(movies);
    });
  });

  $(document).on('click', '.watchedButton', function() {
    var thisMovie = $(this).attr("imdbid");
    var thisButton = $(this);
    if ($(this).attr("watched") == "true") {
      dataControl.markUnwatched(thisMovie, thisButton);
    } else {
      dataControl.markWatched(thisMovie, thisButton);
    }
  });

  $(document).on('rating.change', '.starRating', function(event, value, caption) {
    var thisButton = $(this);
    var thisMovie = $(this).attr("imdbid");
    dataControl.changeRating(thisMovie, thisButton, value);
  });

// filter for movies watched
  $(document).on("click", "#filterWatched", function(){
    dataControl.getUsersMovies()
     .then(function(allMovies) {
        domControl.loadProfileHbs(filtering.setFilterWatched(allMovies));
    });
  });

// filter for movies NOT watched

  $(document).on("click", "#filterToWatch", function(){
    dataControl.getUsersMovies()
      .then(function(allMovies) {
        domControl.loadProfileHbs(filtering.setFilterNotWatched(allMovies));
      });
  });

  // filter for 5 star movies
  $(document).on("click", "#filterRated5", function(){
    dataControl.getUsersMovies()
      .then(function(allMovies){
        domControl.loadProfileHbs(filtering.setFilter5stars(allMovies));
      });
  });

  // filter back to all
  $(document).on("click", "#filterAll", function (){
    dataControl.getUsersMovies()
    .then(function(allMovies){
      domControl.loadProfileHbs(allMovies);
    });
  });
});