
console.log("888")


// แทนที่ด้วย Client ID ของคุณ
const CLIENT_ID = '1033109091843-agiajoi1bjo0sf3kd190t6m7b04uslp8.apps.googleusercontent.com'; 
const API_KEY = 'AIzaSyCtDTqUBRiJleHqQT8TDeu7qWn3USJopZA'; // API Key ไม่ได้ใช้โดยตรงสำหรับการเรียก API ที่ต้องยืนยันตัวตน แต่เป็นแนวปฏิบัติที่ดีที่จะมี

// Discovery docs สำหรับ YouTube Data API
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
];

// Authorization scopes ที่จำเป็นสำหรับการเข้าถึงเพลย์ลิสต์ของผู้ใช้
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const playlistList = document.getElementById('playlist-list');

/**
 * Initializes the API client library and sets up the authorization button.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
    });
}

/**
 * Called when the sign-in status changes.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        listMyPlaylists(); // เรียกฟังก์ชันดึงเพลย์ลิสต์เมื่อ Login สำเร็จ
    } else {
        authorizeButton.style.display = 'block';
    }
}

/**
 * Handles the authorization button click.
 */
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 * Loads and lists the user's YouTube playlists.
 */
function listMyPlaylists() {
    gapi.client.youtube.playlists.list({
        'part': 'snippet,contentDetails', // ดึงข้อมูลส่วนของ snippet (ชื่อ, คำอธิบาย) และ contentDetails (จำนวนวิดีโอ)
        'mine': true, // สำคัญ: ระบุว่าต้องการเพลย์ลิสต์ของฉัน (ผู้ใช้ที่ Login)
        'maxResults': 50 // จำนวนเพลย์ลิสต์สูงสุดที่จะดึงมา (ปรับได้ตามต้องการ)
    }).then(function(response) {
        playlistList.innerHTML = ''; // ล้างรายการเก่า
        const playlists = response.result.items;
        if (playlists && playlists.length > 0) {
            playlists.forEach(function(playlist) {
                const li = document.createElement('li');
                const playlistTitle = playlist.snippet.title;
                const videoCount = playlist.contentDetails.itemCount;
                const playlistUrl = `https://www.youtube.com/playlist?list=${playlist.id}`;

                li.innerHTML = `
                    <a href="${playlistUrl}" target="_blank">${playlistTitle}</a> 
                    (มี ${videoCount} วิดีโอ)
                `;
                playlistList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'ไม่พบเพลย์ลิสต์ของคุณ';
            playlistList.appendChild(li);
        }
    }).catch(function(error) {
        console.error('Error listing playlists:', error);
        const li = document.createElement('li');
        li.textContent = `เกิดข้อผิดพลาดในการดึงเพลย์ลิสต์: ${error.message}`;
        playlistList.appendChild(li);
    });
}

function onGapiLoad() {
    gapi.load('client:auth2', initClient);
}


// โหลดไลบรารี API client และเริ่มกระบวนการยืนยันตัวตน
gapi.load('client:auth2', initClient);
