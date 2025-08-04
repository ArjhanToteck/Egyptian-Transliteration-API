"use client";

import CodeBlock from "@/src/components/CodeBlock";
import { useState } from "react";

export default function Page() {
	const [english, setEnglish] = useState("");
	const [egyptian, setEgyptian] = useState("");

	return <main>
		<section>
			<h1>Egyptian Hieroglyph Transliteration</h1>

			<p>My most recent interest has been linguistics. For fun, I decided to try to write a script to write English text in Egyptian hieroglyphs. See what your name would be, I don't know.</p>

			<p>Note that this project uses IPA-based transliteration, meaning the Egyptian hieroglyphs represent actual sounds rather than just English letters. That's also why it only works one-way.</p>

			<br></br>

			<h2>{egyptian}</h2 >

			<br></br>

			<textarea
				id="english"
				placeholder="English goes here"
				style={{ height: "200px", width: "25%" }}
				value={english}
				onChange={(event) => {
					// set english
					const newEnglish = event.target.value;
					setEnglish(newEnglish);

					// fetch egyptian
					fetch(`${process.env.NEXT_PUBLIC_PROCESSING_SERVER}/api/projects/egyptianHieroglyphTransliteration?english=` + encodeURIComponent(newEnglish))
						.then((response) => response.json())
						.then((data) => setEgyptian(data.egyptian));
				}}
			/>

			<br></br>
			<hr />

		</section>

		<br></br>

		<section>

			<p>I can't really think of why anyone would need this, but if you really want, I made a simple API so you could use this transliteration in your own projects. </p>

			<p>As an example, if you run this:</p>

			<CodeBlock code={
				`fetch("${process.env.NEXT_PUBLIC_PROCESSING_SERVER}/api/projects/egyptianHieroglyphTransliteration?english=" + encodeURIComponent("hi how are you"))` + "\n" +
				`	.then((response) => response.json())` + "\n" +
				`	.then(console.log);`
			} />

			<p>It will print this to the console:</p>

			<CodeBlock showCopyButton={false} code={
				`{\n` +
				`	"egyptian": "𓉔𓂝𓇋𓉔𓂝𓅱𓂝𓂋𓇋𓅱",\n` +
				`	"english": "hi how are you",\n` +
				`	"ipa": "haɪ haʊ ɑːɹ juː"\n` +
				`}`
			} />

			<br></br>

			<p>Or, like all other projects on here, you could also just grab the <a href="https://github.com/ArjhanToteck/Egyptian-Transliteration">source code</a> instead. </p>

			<br></br>

		</section>
	</main>
}