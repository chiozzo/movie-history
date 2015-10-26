define(["jquery", "hbs", "bootstrap", "nouislider", "dataControl", "filtering"], function($, hbs, bootstrap, noUiSlider, dataControl, filtering) {

	return {
		loadProfileHbs: function(allMoviesArray) {
			require(['hbs!../templates/movie'], function(mainTpl) {
				$("#myMovies").html(mainTpl({movie: allMoviesArray}));
				$(".starRating").rating({
					min:0,
					max:10,
					step:1,
					size:'xs',
					showClear:true,
					starCaptions: {
						1: 'One Star',
						2: 'Two Stars',
						3: 'Three Stars',
						4: 'Four Stars',
						5: 'Five Stars',
						6: 'Six Stars',
						7: 'Seven Stars',
						8: 'Eight Stars',
						9: 'Nine Stars',
						10: 'Ten Stars'
					},
					starCaptionClasses: function(val) {
						if (val === 0) {
							return 'label label-default';
						} else if (val < 3) {
							return 'label label-danger';
						} else if (val < 5) {
							return 'label label-warning';
						} else if (val < 7) {
							return 'label label-info';
						} else if (val < 9) {
							return 'label label-primary';
						} else {
							return 'label label-success';
						}
					}
					// {
					// 	1: 'label label-danger',
					// 	2: 'label label-danger',
					// 	3: 'label label-warning',
					// 	4: 'label label-warning',
					// 	5: 'label label-info',
					// 	6: 'label label-info',
					// 	7: 'label label-primary',
					// 	8: 'label label-primary',
					// 	9: 'label label-success',
					// 	10: 'label label-success'
					// }
				});
			});
		}
	};
});


