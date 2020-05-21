import { clientID, redirectURI } from './constants';
let accessToken;
const url = 'https://api.spotify.com/v1/search?type=track&q=';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
    }
  },

    search(term) {
      const accessToken = Spotify.getAccessToken();

      return fetch(`${url}${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {

        console.log(jsonResponse.tracks)

        if (jsonResponse.tracks) {

          console.log(jsonResponse.tracks.items)

          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        }
      });
    },

    savePlaylist(playlistName, trackURIs) {
      console.log('Starting save playlist procedure')
      const accessToken = Spotify.getAccessToken();
      if (playlistName && trackURIs.length) {
        //there are values in both playlistName and trackURIs

        let userID = '';
        let playlistID = ''
        // const accessToken = Spotify.getAccessToken();
        const headers = {
          Authorization: `Bearer ${accessToken}`
        };

        // 1. Get their user id
        return fetch('https://api.spotify.com/v1/me', {
          headers: headers
        }).then(response => response.json()).then(jsonResponse => {
            userID = jsonResponse.id;

            // 2. Create a playlist and get its ID
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({name: playlistName})
            }).then(response => response.json()).then(jsonResponse => {
                playlistID = jsonResponse.id;
                // 3. Post the track URIs to the playlist, get out
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                  headers: headers,
                  method: 'POST',
                  body: JSON.stringify({uris: trackURIs})
                })
              })
            })


        } else {
          console.log('the variables are empty, gtfo')
          return
        }
      }
    }

    export default Spotify;
