(function() {
    ArcadeForge.MediaQueryType = {
        TO_MOBILE: "(max-width: 768px)",
        TO_DESKTOP: "(min-width: 768px)"
    };

    ArcadeForge.MediaQueries = {
    	queries: [
            ArcadeForge.MediaQueryType.TO_MOBILE,
    		ArcadeForge.MediaQueryType.TO_DESKTOP
    	],

    	init: function() {
    		console.log('ArcadeForge::MediaQueries: Initialized');

    		this.checkMediaQuery();
    	},

    	checkMediaQuery: function() {
    		for (var i in this.queries) {
    			var mql = window.matchMedia(this.queries[i]);
    			mql.addListener(this.mediaQueryHandler);
                this.mediaQueryHandler(mql);
    		}
    	},

    	mediaQueryHandler: function(mql) {
    		if (mql.matches) {
    			ArcadeForge.Navigation.onMediaQueryChange(mql);
    		}
    	}
    };
}());