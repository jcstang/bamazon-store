console.log('DB credentials loaded');

// what is the difference between:
// this (in instructions)
// exports.spotify = {
//   id: process.env.SPOTIFY_ID,
//   secret: process.env.SPOTIFY_SECRET
// }


// and this? 
// const mySpotifyCredentials = {
//   id: process.env.SPOTIFY_ID,
//   secret: process.env.SPOTIFY_SECRET
// }
// module.exports = {
//   mySpotifyCredentials: mySpotifyCredentials
// }

exports.creds = {
  hostName: process.env.DB_HOST,
  userName: process.env.DB_USER,
  password: process.env.DB_PASS
}