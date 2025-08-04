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

export default async function transliterateToEgyptian(req, res) {
	try {
		// CORS allow all to make this a public API
		res.setHeader("Access-Control-Allow-Origin", "*");

		const { searchParams } = new URL(process.env.NEXT_PUBLIC_PROCESSING_SERVER + req.url);

		// get english from url search param
		const english = decodeURIComponent(searchParams.get("english"));

		// gets the ipa transcription of the english query
		const response = await fetch("https://api2.unalengua.com/ipav3", {
			"referrer": "https://unalengua.com/",
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": `{\"text\":\"${english}\",\"lang\":\"en-US\",\"mode\":true}`,
			"method": "POST",
			"mode": "cors",
			"credentials": "omit"
		});
		const data = await response.json();

		// get raw ipa
		let ipa = data.ipa;

		// we don't need stress
		ipa = ipa.replaceAll("ˈ", "");

		// remove ties in dipthongs
		ipa = ipa.replaceAll(/͡/g, "");

		let egyptian = ipa;

		// map sounds to egyptian characters

		// loops through egyptian symbols
		for (let i = 0; i < Object.keys(egyptianKey).length; i++) {
			// get symbol and letters to replace
			const egyptianSymbol = Object.keys(egyptianKey)[i];
			const symbolsToReplace = egyptianKey[egyptianSymbol];

			// replaces symbols that can be replaced by current hieroglyph
			for (let j = 0; j < symbolsToReplace.length; j++) {
				egyptian = egyptian.replaceAll(symbolsToReplace[j], egyptianSymbol);
			}
		}

		// remove anything not in the key
		egyptian = removeNonEgyptianCharacters(egyptian);

		// send output
		res.setHeader("Content-Type", "application/json; charset=utf-8");
		res.status(200).send(JSON.stringify({ egyptian, english, ipa }));
	} catch (error) {
		console.log(error);
		// send output
		res.setHeader("Content-Type", "text/plain;");
		res.status(500).send(error.message);
	}


}

function removeNonEgyptianCharacters(inputString) {
	const allowedChars = Object.keys(egyptianKey).join("");
	let filteredString = "";

	for (let i = 0; i < inputString.length; i++) {
		const char = inputString.charAt(i);

		if (allowedChars.includes(char)) {
			filteredString += char;
		}
	}

	return filteredString;
}
