var bannerboy = bannerboy || {};
bannerboy.main = function() {

	var width = 500;
	var height = 500;
	var banner = bannerboy.createElement({id: "banner", width: width, height: height, overflow: "hidden", cursor: "pointer", parent: document.getElementById("hero-banner")});
	var main_tl;

	var images = [
		"sky_glow_white.png",
		"particle_glow_blue.png",
		"particle_glow_yellow.png",
	];

	bannerboy.preloadImages(images, function() {

		/* Create elements
		================================================= */
		var sunGlowContainer = bannerboy.createElement({width: 386, height: 386, top: -80, centerX: true, parent: banner})
			var sunGlow = bannerboy.createElement({backgroundImage: "sky_glow_white.png", opacity: 0.55, parent: sunGlowContainer})
		
		/*
		var particles_sky = new bannerboy.ParticleSystem({
			autoStart: true,
			preCalc: false,
			images: ["particle_glow_blue.png", "particle_glow_yellow.png",],
			lifespan: 1,
			opacity: 0.5,
			gravity: 0.015,
			wind: 0,
			turbulence: 0.15,
			maxParticles: 5,
			parent: banner,
			onEmittParticle: function(p) {
				p.x = bannerboy.utils.randomRange(0, 1500);
				p.y = bannerboy.utils.randomRange(0, 350);
		        p.vx = bannerboy.utils.randomRange(-1.5, 1.5);
		        p.vy = bannerboy.utils.randomRange(-0.4, -1.2);
		        p.scale = bannerboy.utils.randomRange(0.4, 0.6);
		        p.rotation = bannerboy.utils.randomRange(-90, 90);
		    },
		    onUpdateParticle: function(p) {
		        p.opacity = p.getLifeCurve();
		        p.scale += 0.002;
		        p.rotation += 0.05;
		    }
		});
		*/

		/* Element adjustments
		================================================= */

		/* Initiate
		================================================= */
		animations();
		timeline();
		interaction();

		/* Animations
		================================================= */
		function timeline() {
			
		}

		function animations() {
			sunGlowContainer.tl_in = new BBTimeline()
			.from(sunGlowContainer, 1.5, {scale: 0.5, opacity: 0, ease: Power2.easeInOut});

			TweenMax.to(sunGlow, 0.04, {scale: 0.93, opacity: 0.4, repeat: -1, yoyo: true});
		}

		/* Interactions
		================================================= */
		function interaction() {
			
		}

		/* Helpers
		================================================= */

	});
};