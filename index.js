process.stdin.resume()
process.stdin.setEncoding('utf8')
const util = require('util')

const request = require('async-request')

const pattern = /<a href="http:\/\/azlyrics.com\/lyrics\/(.*).html" target="_blank"><b>(.*)<\/b><\/a>  by <b>(.*)<\/b><br>/g

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
		console.log(songs[1])
		return songs
	}
	catch (e) {
		console.log(e)
		process.exit(1)
	}
}

function clear() {
	console.log('\033[2J')
}

let page = 1
let song = ''
