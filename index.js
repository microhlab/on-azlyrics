const request = require('async-request')

const pattern = /<a href="http:\/\/azlyrics.com\/lyrics\/(.*).html" target="_blank"><b>(.*)<\/b><\/a>  by <b>(.*)<\/b><br>/g

console.log(pattern)

async function Request(song, page) {
	try {
		let url = 'http://search.azlyrics.com/search.php?q=' + song + '&w=songs&p=' + page
		let html = await request(url)
		return html.body
	}
	catch (e) {
		console.log(e)
		process.exit(1)
	}
}

async function GetSongList(song, page) {
	try {
		html = await Request(song, page)
		const songs = pattern.exec(html)
		console.log(songs)
		return songs
	}
	catch (e) {
		console.log(e)
		process.exit(1)
	}
}

const songs = GetSongList('Sugar', 1)
