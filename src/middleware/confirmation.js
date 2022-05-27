const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox528f4cf02228406c8216f1f90775b4b3.mailgun.org';
const api_key = '031d0fe03ad064af75895c9b84c0b354-8d821f0c-e905973a'
const mg = mailgun({apiKey: api_key, domain: DOMAIN});
const data = {
	from: 'kirito <hishamsayed444@gmail.com>',
	to: 'hishamsayed444@gmail.com',
	subject: 'confirmation',
	text: 'please confirm your Email Adress!'
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});








