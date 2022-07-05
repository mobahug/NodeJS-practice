const express = require('express');

const router = express.Router();

module.exports = params => {

	const { speakersService } = params;

	router.get('/', async (request, response, next) => {
		try {
			const speakers = await speakersService.getList();
			const artwork = await speakersService.getAllArtwork();

			/* visit counter for page */
			/* if (!request.session.visitcount)
				request.session.visitcount = 0;
			request.session.visitcount += 1;
			console.log(`Number of visits: ${request.session.visitcount}`);
	*/
			/* creating path reference to show that on the server */
			return response.render('layout', { pageTitle: 'Welcome', template: 'speakers', speakers, artwork });
		}
		catch(err)
		{
			return next(err);
		}
	});

	router.get('/:shortname', async (request, response) => {
		const speaker = await speakersService.getSpeaker(request.params.shortname);
		const artwork = await speakersService.getArtworkForSpeaker(request.params.shortname);
		/* creating path reference to show that on the server */
		response.render('layout', { pageTitle: 'Welcome', template: 'speakers-detail', speaker, artwork });
	});

	return router;
};
