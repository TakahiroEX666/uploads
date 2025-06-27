console.log("✅ app.js loaded");

const CLIENT_ID = '1033109091843-agiajoi1bjo0sf3kd190t6m7b04uslp8.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCtDTqUBRiJleHqQT8TDeu7qWn3USJopZA';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const playlistList = document.getElementById('playlist-list');

// เรียกโดย Google API script
function onGapiLoad() {
  console.log("✅ GAPI script loaded");
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
    console.log("✅ GAPI client initialized");

    authorizeButton.style.display = 'block';
    authorizeButton.onclick = () => {
      console.log("🔘 Authorize clicked");
      gapi.auth2.getAuthInstance().signIn().then(() => {
        console.log("✅ Signed in!");
        listMyPlaylists();
      }).catch(err => {
        console.error("❌ Sign-in error", err);
      });
    };
  });
}

function listMyPlaylists() {
  gapi.client.youtube.playlists.list({
    part: 'snippet,contentDetails',
    mine: true,
    maxResults: 10
  }).then(response => {
    playlistList.innerHTML = '';
    response.result.items.forEach(pl => {
      const li = document.createElement('li');
      li.textContent = pl.snippet.title + ` (${pl.contentDetails.itemCount} videos)`;
      playlistList.appendChild(li);
    });
  }).catch(err => {
    console.error("❌ Playlist error", err);
  });
}
