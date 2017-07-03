const request = require('async-request')
const prompt = require('prompt')

var pattern = /<a href="(.*)" target="_blank"><b>(.*)<\/b><\/a>  by <b>(.*)<\/b><br>/g
var lpattern = /Sorry about that. -->([\s\S]*)<!-- MxM banner -->/g

async function Request(song, page) {
	try {
		var url = 'http://search.azlyrics.com/search.php?q=' + song + '&w=songs&p=' + page
		var html = await request(url)
		return html.body
	}
	catch (e) {
		console.log(e)
		process.exit(1)
	}
}

async function GetLyric(url) {
	try {
		var html = await request(url)
		var raw = lpattern.exec(html.body)
		var res = raw[1].replace(/\<br\>/g," ");
                res = res.replace(/\<i\>\[Hook(.*)\]<\/i\>/g, " ");
                res = res.replace(/\<i\>\[Intro(.*)\]<\/i\>/g, " ");
                res = res.replace(/\<i\>\[Pre-Chorus:\]\<\/i\>/g," ");
		res = res.replace(/\<i\>\[Chorus:\]\<\/i\>/g," ");
		res = res.replace(/\<i\>\[Verse(.*)\]<\/i\>/g, " ");
		console.log(res)
	}
	catch (e) {
		console.log(e)
		process.exit(1)
	}
}

async function GetSongList(song, page) {
	try {
		var html = await Request(song, page)
		var songs = []
		var song
		while (song = pattern.exec(html))
			songs.push({url : song[1], name : song[2], singer : song[3]})
		for (var i=0; i < songs.length; i++)
			console.log((i+1).toString() + ' - ' + songs[i].name + ' - ' + songs[i].singer)

		prompt.get(['number'], (err, result) => {
			result.number--
			GetLyric(songs[result.number].url)
		})
	}
	catch (e) {
		console.log(e)
		process.exit(1)
	}
}

function clear() {
	console.log('\033[2J')
}

var song, page

prompt.start()

prompt.get(['song', 'page'], (err, result) => {
	GetSongList(result.song, result.page)
})
