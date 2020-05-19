import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [{name: 'Track 4', artist: 'Artist 4', album: 'Album 4', id: 'track-four'}, {name: 'Track 5', artist: 'Artist 5', album: 'Album 5', id: 'track-five'}, {name: 'Track 6', artist: 'Artist 6', album: 'Album 6', id: 'track-six'}],
      playlistName: 'Hard-coded Playlist Name',
      playlistTracks: [{name: 'Track 1', artist: 'Artist 1', album: 'Album 1', id: 'track-one'}, {name: 'Track 2', artist: 'Artist 2', album: 'Album 2', id: 'track-two'}, {name: 'Track 3', artist: 'Artist 3', album: 'Album 3', id: 'track-three'}]
    };


    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      console.log('track already in list')
      return;
    } else {
      this.setState({
       playlistTracks: [ ...this.state.playlistTracks, track],
      }, () => {
       console.log(this.state.playlistTracks);
      });

    }
  }

  removeTrack(track) {
    this.setState({playlistTracks: this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id)});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist(tracks) {

  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
        </div>
      </div>
    </div>
    );
  }
}

export default App;
