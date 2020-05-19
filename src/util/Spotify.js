import { clientID, redirectURI } from './constants';
let accessToken = '';
let expiresIn = '';
const url = 'https://api.spotify.com/v1/search?type=track&q=';

const Spotify = {
  getAccessToken() {
    // console.log('Access token: ' + accessToken)
    if (accessToken === '') {
      if (window.location.href.match(/access_token=([^&]*)/) === null) {
        //there is nothing in accessToken and there is not one in the URL, so send them off to get authorized
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1] //returns an array with the access token in the second slot, grabbing just that
        expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1]
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {
        // the URL had an access token
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1] //returns an array with the access token in the second slot, grabbing just that
        expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1]
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      }
    } else {
      return accessToken;
    }
  },

  search(term) {
    // console.log('Starting search procedure inside Spotify.js')
    // console.log(accessToken)
    // return [{
    //       id: 'test-track-id',
    //       name: 'test-track-name',
    //       artist: 'test-track-artist',
    //       album: 'test-track-album',
    //       uri: 'test-track-uri'
    //     }]
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
    if (playlistName && trackURIs.length) {
      //there are values in both playlistName and trackURIs
      accessToken = Spotify.getAccessToken();
      let userID = '';
      // get current user's profile; {id} is their s/n GET https://api.spotify.com/v1/me

      userID = fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {

        if (jsonResponse.id) {
          return jsonResponse.id;
        }
      });

      // POST https://api.spotify.com/v1/users/{user_id}/playlists
      // returns a newly created playlist object, id is playlistID
      let playlistID = ''
      playlistID = fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        body: {
          "name": playlistName
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": 'application/json'
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {

        if (jsonResponse.id) {
          return jsonResponse.id;
        }
      });

      // add the tracks to the playlist
      // POST https://api.spotify.com/v1/playlists/{playlist_id}/tracks

      return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        method: 'POST',
        body: {
          "uris": trackURIs
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": 'application/json'
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {

        if (jsonResponse.snapshot_id) {
          return jsonResponse.snapshot_id;
        }
      });

    } else {
      //the variables are empty, gtfo
      return
    }
  }
}

export default Spotify;
