import express from 'express';
import pug from 'pug';
import cors from 'cors';
import fsx from 'fs/promises';
import path from 'path';
import { writeFile } from 'fs';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.post('/api/share', async ( request, response ) =>
{
	const beg = process.hrtime();

	try
	{
		const body = request.body;

		const sessionID = parseInt(body.sessionID);
		if (isNaN(sessionID))
		{
			throw new Error('Invalid argument');
		}

		const content = body.content;

		const filePath = path.join(__dirname, '../snippets', sessionID.toString());
		
		await fsx.writeFile(filePath, content, 'utf8');

		response
			.writeHead(200);
	}
	catch ( error )
	{
		console.error(error);

		response
			.writeHead(500)
			.write(error.message);
	}

	const end = process.hrtime(beg);
	const dur = end[0] * 1000 + end[1] / 1000 / 1000;

	console.log(`Request saved in ${dur.toFixed(3)} ms`);

	response.end();
});

app.get('/api/share', async (request, response) =>
{
	try
	{
		const query = request.query;

		const sessionID = parseInt(query.sessionID as string);
		if (isNaN(sessionID))
		{
			throw new Error('Invalid argument');
		}

		const filePath = path.join(__dirname, '../snippets', sessionID.toString());
		
		const content = await fsx.readFile(filePath, 'utf8');

		response
			.writeHead(200)
			.write(content);
	}
	catch ( error )
	{
		console.error(error);

		response
			.writeHead(500)
			.write(error.message);
	}

	response.end();
});

// app.post('/api/compile', (req, res) =>
// {
// 	try
// 	{
// 		const template = req.body;

// 		const html = pug.render(template, {
// 			pretty: true
// 		});

// 		res.writeHead(200);
// 		res.write(html);
// 	}
// 	catch (error)
// 	{
// 		console.error(error.stack);

// 		res.writeHeader(500);
// 		res.write(error.toString());
// 	}

// 	res.end();
// });

app.listen(port, () =>
{
	console.log(`Example app listening at http://localhost:${port}`)
});
