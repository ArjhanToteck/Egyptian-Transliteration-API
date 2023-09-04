const http = require("http");
const fetch = require("node-fetch");

const egyptianKey = {
  "𓂝": ["ɑː", "ä", "a", "æ", "ɐ"],
  "𓄿": ["ɑ"],
  "𓇌": ["iː"],
  "𓇋": ["i", "j", "ɪ"],
  "𓅱": ["w", "uː", "u", "oʊ", "ʊ", "ɔ", "ᵻ"],
  "𓃀": ["b", "b̪", "v"],
  "𓊪": ["p", "p̪"],
  "𓆑": ["f"],
  "𓅓": ["m", "m̥", "ɱ"],
  "𓈖": ["n", "ɳ̊"],
	"𓈖𓇋": ["ɲ", "ɲ̊"],
	"𓈖𓎼": ["ŋ", "ŋ̊", "ɴ"],
  "𓂋": ["ɾ", "r", "ɹ", "l", "ɚ"],
  "𓉔": ["h"],
  "𓎛": ["ħ"],
  "𓐍": ["x"],
  "𓄡": ["ç"],
  "𓊃": ["z"],
  "𓋴": ["s"],
  "𓈎": ["q"],
  "𓎡": ["k"],
  "𓎼": ["ɡ"],
  "𓍿": ["tʃ", "ṯ"],
  "𓏏": ["t"],
  "𓈙": ["ʃ"],
  "𓆓": ["dʒ", "ʒ"]
};

function removeNonEgyptianCharacters(inputString) {
  const allowedChars = Object.keys(egyptianKey).join('');
  let filteredString = '';

  for (let i = 0; i < inputString.length; i++) {
    const char = inputString.charAt(i);

    if (allowedChars.includes(char)) {
      filteredString += char;
    }
  }

  return filteredString;
}

// opens http server
let server = http.createServer(function(req, res) {
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "text/plain; charset=UTF-8"
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
		.then(data => data.json())
		.then(rawIpa => {

			output = rawIpa.ipa;

			// we don't need stress
			output = output.replaceAll("ˈ", "");

			// remove ties in dipthongs
			output = output.replaceAll(/͡/g, "");

			// map sounds to egyptian characters
			
			// loops through egyptian symbols
			for(let i = 0; i < Object.keys(egyptianKey).length; i++){
				// get symbol and letters to replace
				egyptianSymbol = Object.keys(egyptianKey)[i];
				symbolsToReplace = egyptianKey[egyptianSymbol];
				
				// replaces symbols that can be replaced by current hieroglyph
				for(let j = 0; j < symbolsToReplace.length; j++){
					output = output.replaceAll(symbolsToReplace[j], egyptianSymbol);
				}
			}
			
			// remove anything not in the key
			output = removeNonEgyptianCharacters(output);
			
			res.writeHead(200, headers);
			console.log(output);
			res.end(output);
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
