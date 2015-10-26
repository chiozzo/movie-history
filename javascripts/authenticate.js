define(["firebase", "dataControl", "domControl", "nouislider", "q"], function(firebase, dataControl, domControl, noUiSlider, q) {

	var firebaseRef = new firebase("https://nss-movie-history.firebaseio.com");

	return {
		loginUser: function(emailArg, passwordArg) {
			firebaseRef.authWithPassword({
					email 	 : emailArg,
					password : passwordArg
			}, function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					$('#loginRegister').remove();
					$('#myNav').show();
					dataControl.getUsersMovies()
					.then(function(moviesReturnedByPromise){
							domControl.loadProfileHbs(moviesReturnedByPromise);
					});
				}
			});
		},
		registerNewUser: function(){
			var deferred = q.defer();
			var newUserEmail = $('#registerEmailInput').val();
			firebaseRef.createUser({
					email    : newUserEmail,
					password : $('#registerPasswordInput').val()
			}, function(error, userData) {
					if (error) {
						console.log("Error creating user:", error);
					} else {
						var newUser = {
							userEmail: newUserEmail
						};
						firebaseRef.child('users').child(userData.uid).set(newUser);
						var promiseArray = [newUserEmail, $('#registerPasswordInput').val()];
						deferred.resolve(promiseArray);
					}
			});
			return deferred.promise;
		}
	};
});


