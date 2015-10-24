define(["jquery", "q", "firebase"],
	function($, q, firebase) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com/");

	return {
		OMDbSearch: function(searchString) {
			var deferred = q.defer();
			searchString = searchString.split(' ').join('+');
			$.ajax("http://www.omdbapi.com/?s=" + searchString + "&type=movie&r=json")
			.done(function(potentialMatches) {
				var searchResultsArray = potentialMatches.Search;
				var mappedSearchResultsArray = searchResultsArray.map(function(currValue, index, array) {
					if(currValue.Poster === "N/A") {
						currValue.Poster = "../images/defaultPoster.jpg";
					} else {
						currValue.Poster = "http://img.omdbapi.com/?i=" + currValue.imdbID + "&apikey=8513e0a1";
					}
					return currValue;
				});
				deferred.resolve(mappedSearchResultsArray);
			}).fail(function() {
				console.log("OMDb search failed");
			});
			return deferred.promise;
		},
		OMDbIDSearch: function(imdbID) {
			var deferred = q.defer();
			$.ajax("http://www.omdbapi.com/?i=" + imdbID + "&r=json")
			.done(function(exactMatch) {
				deferred.resolve(exactMatch);
			})
			.fail(function() {
				console.log("OMDb exact match failed");
			});
			return deferred.promise;
		},
		addUserMovie: function(movieObject) {
			var newMovie;
			if (movieObject.Poster == "N/A") {
				newMovie = {
					Title: movieObject.Title,
					Year: movieObject.Year,
					Actors: movieObject.Actors.replace(/(, )/g, "|").split('|'),
					watched: false,
					Poster: "../images/defaultPoster.jpg",
					rating: 0,
					imdbID: movieObject.imdbID,
					savedToFirebase: true
				};
			} else {
				newMovie = {
					Title: movieObject.Title,
					Year: movieObject.Year,
					Actors: movieObject.Actors.replace(/(, )/g, "|").split('|'),
					watched: false,
					Poster: "http://img.omdbapi.com/?i=" + movieObject.imdbID + "&apikey=8513e0a1",
					rating: 0,
					imdbID: movieObject.imdbID,
					savedToFirebase: true
				};
			}
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(movieObject.imdbID).set(newMovie);
		},
		getUsersMovies: function() {
			var uid = firebaseRef.getAuth().uid;
			var deferred = q.defer();
			$.ajax("https://nss-movie-history.firebaseio.com/users/" + uid + "/movies/.json")
			.done(function(userMovies) {
				var firebaseMoviesArray = _.values(userMovies).sort(function(a, b) {
          if (a.Title[0] < b.Title[0]) {
            return -1;
          }
          if (a.Title[0] > b.Title[0]) {
            return 1;
          }
          return 0;
        });
				deferred.resolve(firebaseMoviesArray);
			})
			.fail(function() {
				console.log("getUsersMovies was a fail");
			});
			return deferred.promise;
		},
		deleteUsersMovies: function(imdbid) {
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbid).remove(function(error) {
				if (error) {
					console.log("there was an error", error);
				}
			});
		},
		markWatched: function(imdbID, thisButton) {
			$(thisButton).attr("watched", true);
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({watched: true});
			$(thisButton).removeClass("btn-default");
			$(thisButton).addClass("btn-success");
			$(thisButton).text("Watched");
		},
		markUnwatched: function(imdbID, thisButton) {
			$(thisButton).attr("watched", false);
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({watched: false});
			$(thisButton).removeClass("btn-success");
			$(thisButton).addClass("btn-default");
			$(thisButton).text("Not Watched");
		},
		changeRating: function(imdbID, thisButton, ratingValue) {
			firebaseRef.child('users').child(firebaseRef.getAuth().uid).child('movies').child(imdbID).update({rating: ratingValue});

		},

		setFilterWatched: function(allMovies) {
			var filteredWatchedMovies = allMovies.filter(function(movie){
				console.log(movie.watched);
				if ( movie.watched == true) {
					return movie;
				// console.log("success of filter");
				}
			});
			console.log("filteredWatchedMovies", filteredWatchedMovies);
			return filteredWatchedMovies;
		},

		setFilterNotWatched:  function(allMovies) {
			var filteredNotWatchedMovies = allMovies.filter(function(movie){
				console.log(movie.notWatched);
				if ( movie.watched == false ) {
					return movie;
				}
			});
			console.log("filteredNotWatchedMovies", filteredNotWatchedMovies);
			return filteredNotWatchedMovies;
		},

		setFilter5stars:  function(allMovies) {
			var filtered5stars = allMovies.filter(function(movie){
				console.log(movie.rating);
				if (movie.rating == "5") {
					return movie;
				}
			});
			console.log("filtered5stars", filtered5stars);
			return filtered5stars;
		}
	};
});


