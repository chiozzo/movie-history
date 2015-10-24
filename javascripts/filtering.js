define(["jquery", "lodash", "dataControl", "firebase", "domControl"],
	function($, _, dataControl, firebase, domControl) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com/");

	return {
		searchMyMovies: function() {
			console.log("searchMyMovies run");
			console.log("search field is", $('#searchText').val());
			dataControl.getUsersMovies()
			.then(function(userMovies) {
				console.log("userMovies", userMovies);
				var userMoviesArray = [];
				for (var currentkey in userMovies) {
					userMoviesArray.push(userMovies[currentkey]);
				}
				var filteredMovies = _.filter(userMoviesArray, function(movie) {
					return movie.title == $('#searchText').val();
				});
				console.log("filteredMovies", filteredMovies);
				domControl.loadProfileHbs(filteredMovies);
			});
		},
		setFilterWatched: function(allMovies) {
			var filteredWatchedMovies = allMovies.filter(function(movie){
				if ( movie.watched === true) {
					return movie;
				}
			});
			return filteredWatchedMovies;
		},
		setFilterNotWatched:  function(allMovies) {
			var filteredNotWatchedMovies = allMovies.filter(function(movie){
				if ( movie.watched === false ) {
					return movie;
				}
			});
			return filteredNotWatchedMovies;
		},
		setFilter5stars:  function(allMovies) {
			var filtered5stars = allMovies.filter(function(movie){
				if (movie.rating == "5") {
					return movie;
				}
			});
			return filtered5stars;
		}
	};
});