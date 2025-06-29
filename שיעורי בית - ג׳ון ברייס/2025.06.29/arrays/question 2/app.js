const songs = [];

for (let i = 0; i < 3; i++) {
    songs.push(prompt(`please enter a name of a song`))
}
console.log(songs)

songs.splice(1, 1);
console.log(songs);