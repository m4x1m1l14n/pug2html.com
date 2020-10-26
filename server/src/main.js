const express = require('express')
const pug = require('pug');
const app = express();
const cors = require('cors');
const { type } = require('os');
const port = 3000;

app.use(cors());

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.post('/api/compile', (req, res) =>
{
	try
	{
		const template = req.body;

		const html = pug.render(template, {
			pretty: true
		});

		res.writeHead(200);
		res.write(html);
	}
	catch (error)
	{
		console.error(error.stack);

		res.writeHeader(500);
		res.write(error.toString());
	}

	res.end();
});

app.listen(port, () =>
{
	console.log(`Example app listening at http://localhost:${port}`)
});
