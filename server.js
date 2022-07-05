/* taking from package.json the express what we installed */
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');



const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');


const routes = require('./routes');

/* simple assignment to app variable */
const app = express();

/* speifying port */
const port = 3000;

app.set('trust proxy', 1);

app.use(cookieSession({
	name: 'session',
	keys: ['Gabor', 'test'],
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));


app.locals.siteName = 'ROUX Meetups';


/* pointing to the whole static folder, if there is a match will send to the browser, so now the images will load */
app.use(express.static(path.join(__dirname, './static')));


app.use(async (request, response, next) => {
	try {
		const names = await speakersService.getNames();
		response.locals.speakerNames = names;
		return next();
	}
	catch(err) {
		return next(err);
	}
});
/* here with get the webserver not load the images thats why we need the use method above */
/* specifying the content what we gonna se on the server */
/* creating path reference to show that on the server */
/* app.get('/', (request, response) => {
	response.render('pages/index', { pageTitle: 'Welcome' });
}); */

app.use('/', routes({
	feedbackService,
	speakersService,
}));

app.use((request, response, next) => {
	return next(createError(404, 'File not found'));
});

app.use((err, request, response, next) => {
	response.locals.message = err. message;
	console.error(err);
	const status = err.status || 500;
	response.locals.status = status;
	response.status(status);
	response.render('error');
});

/* text ging to console on the browser */
app.listen(port, () => {
	console.log(`Express server listening on port ${port}!`);
});



/* executing the server

	node server.js

	localhost:3000 on the browser

*/