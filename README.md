# What is this?
My most recent interest has been linguistics. For fun, I decided to try to write a script to write English text in Egyptian hierohlyphs. This is that program.

# Usage
I can't really think of why anyone would need this, but if you really want, this repository uses the MIT license, so you can clone this repository and make your own server. Here is an example usage from the front-end. Of course, replace my url with your server url (or use mine, I really don't care) and enter your own input:

```javascript
fetch("https://arjhan-toteck-site-next.vercel.app/api/projects/egyptianHieroglyphTransliteration?english=" + encodeURIComponent("hi how are you"))
	.then((response) => response.json())
	.then(console.log);
```

# Sources
I literally just used a random Wikipedia article on the Ancient Egyptian writing system. If you want to see, [here it is](https://en.wikipedia.org/wiki/Transliteration_of_Ancient_Egyptian).
