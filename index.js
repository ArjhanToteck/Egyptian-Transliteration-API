const http = require("http");
const fetch = require("node-fetch");

// opens http server
let server = http.createServer(function(req, res) {
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "text/plain"
	};

	// client errors
	if (req.url.length <= 1) {
		res.writeHead(400, headers);
		res.end("There was a problem with your input.");
	}

	// gets the english text from the url to be transliterated	
	let english = req.url.substring(1, req.url.length);
	english = decodeURIComponent(english);

	// gets the ipa transcription of the english query
	fetch("https://api2.unalengua.com/ipav3", {
		"referrer": "https://unalengua.com/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": `{\"text\":\"${english}\",\"lang\":\"en-US\",\"mode\":true}`,
		"method": "POST",
		"mode": "cors",
		"credentials": "omit"
	})
		.then(data => data.text())
		.then(ipa => {
			console.log(ipa);
			res.writeHead(200, headers);
			res.end(ipa);
		})
		.catch(error => {
			if (error instanceof TypeError && error.message.includes('API key')) {
				res.writeHead(500, headers);
				res.end("There was an error retrieving the IPA from your input.");
			}
		});
});
	server.listen(8443);
	console.log("Server running on port 8443");