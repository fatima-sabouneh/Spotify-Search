import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';
import { BsSpotify, BsStarFill, BsStar } from 'react-icons/bs';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useParams } from "react-router-dom";

function App() {
  const REDIRECT_URI = "http://localhost:3000/"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const [showArtists, setShowArtists] = useState(true)
  const [albumShow, setAlbumShow] = useState(true);
  const [loginBox, setLoginBox] = useState(false);
  const [CLIENT_ID, setCLIENT_ID] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const p = useParams();

  var access_token = null;
  var refresh_token = null;

  function requestAuthorization() {
    localStorage.setItem("client_id", CLIENT_ID);
    localStorage.setItem("client_secret", clientSecret); // In a real app you should not expose your client_secret to the user

    let url = AUTH_ENDPOINT;
    url += "?client_id=" + CLIENT_ID;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(REDIRECT_URI);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
  }





  const searchArtists = async (e) => {
    setShowArtists(false)
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })

    setArtists(data.artists.items)
  }
  const Albums = async (e, id) => {
    setShowArtists(true);
    setAlbumShow(false)
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/artists/" + id + "/albums", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    setAlbums(data.items)
    console.log(data.items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div className="card" key={artist.id} onClick={(e) => { Albums(e, artist.id); }}>
          {artist.images.length ? <img width={"100%"} class="card-img-top" src={artist.images[0].url} alt="Artist Image" /> : <div>No Image</div>}
          <div className="card-body">
            <h5 className="card-title">{artist.name}</h5>
            <p className="card-text text-secondary">{artist.followers["total"] + " followers"}</p>
            {0 < artist.popularity && artist.popularity < 20 && (
              <ul className="rates p-0">
                <li><BsStarFill /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
              </ul>
            )}
            {artist.popularity == 0 && (
              <ul className="rates p-0">
                <li><BsStar /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
              </ul>
            )}
            {20 < artist.popularity && artist.popularity < 40 && (
              <ul className="rates p-0">
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
              </ul>
            )}
            {40 < artist.popularity && artist.popularity < 60 && (
              <ul className="rates p-0">
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStar /></li>
                <li><BsStar /></li>
              </ul>
            )}
            {60 < artist.popularity && artist.popularity < 80 && (
              <ul className="rates p-0">
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStar /></li>
              </ul>
            )}
            {80 < artist.popularity && artist.popularity < 100 && (
              <ul className="rates p-0">
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
                <li><BsStarFill /></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    ))
  }

  const renderAlbums = () => {
    return albums.map(album => (
      <>
        <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3">
          <div className="card" key={album.id}>
            {album.images.length ? <img width={"100%"} class="card-img-top" src={album.images[0].url} alt="Artist Image" /> : <div>No Image</div>}
            <div className="card-body">
              <h5 className="card-title">{album.name}</h5>
              <p className="card-text text-secondary">
                {album.artists.map((u) => u.name)} <br /> <br />
                {album.release_date} <br />
                {album.total_tracks + " tracks"}
              </p>
            </div>
            <div class="card-footer text-center">
              <a href={album.external_urls["spotify"]} className="PreviewBtn">Preview on Spotify</a>
            </div>
          </div>
        </div>
      </>
    ))

  }

  function handleAuthorizationResponse() {
      console.log(this.status)

    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      setToken(data.access_token)
      console.log(data);
      var data = JSON.parse(this.responseText);
      if (data.access_token != undefined) {
        access_token = data.access_token;
        localStorage.setItem("access_token", access_token);
      }
      if (data.refresh_token != undefined) {
        refresh_token = data.refresh_token;
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("token", refresh_token);

      }
      onPageLoad();
    }
    else {
      console.log(this.responseText);
    }
  }
  function handleRedirect() {
    let cID = localStorage.getItem("client_id");
    let cSecret = localStorage.getItem("client_secret");
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code')
      let body = "grant_type=authorization_code";
      body += "&code=" + code;
      body += "&redirect_uri=" + encodeURI(REDIRECT_URI);
      body += "&client_id=" + cID;
      body += "&client_secret=" + cSecret;
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "https://accounts.spotify.com/api/token", true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(CLIENT_ID + ":" + clientSecret));
      xhr.send(body);
      xhr.onload = handleAuthorizationResponse;
    }
  }

  function onPageLoad() {
    if (window.location.search.length > 0) {
      handleRedirect();

    }
    else {
      access_token = localStorage.getItem("access_token");
    }
  }
  useEffect(() => {
    setCLIENT_ID(localStorage.getItem("client_id"));
    setClientSecret(localStorage.getItem("client_secret"))
    setToken(localStorage.getItem("token"))
    onPageLoad();
  }, [])
  return (
    <div>
      <header className='HeaderStyle'>
        <label className='title'>Spotify Artist Search</label>
      </header>
      <div>
        {!token && !loginBox ?
          <div className="CenterBox">
            <button className="LoginBox" onClick={() => { setLoginBox(true) }}>
              Login <BsSpotify className="SpotifyIcon" /></button>
          </div>
          : null}
        {!token && loginBox ? (
          <>
            <div className="CenterBox">
              <div className="row">
                <div className="col-6">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Client Id" onChange={(e) => setCLIENT_ID(e.target.value)} aria-label="Client Id" />
                  </div>
                </div>
                <div className="col-6">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Client Secret" onChange={(e) => setClientSecret(e.target.value)} aria-label="Client Secret" />
                  </div>
                </div>
              </div>
              <div className="row ms-3">
                <div className="col-12">
                  <button className="LoginBtn" type="button" onClick={requestAuthorization}>Login In</button>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {token && showArtists & albumShow ?
          <>
            <form onSubmit={searchArtists}>
              <div className="CenterBox">
                <div className="position-relative">
                  <input type="text" className="InputBox" placeholder="Search for an artist…" onChange={e => setSearchKey(e.target.value.toLowerCase())} />
                  <button type={"submit"} className="SearchIcon"><BiSearchAlt2 /></button>
                </div>
              </div>
            </form>

          </>
          : null
        }
        {!showArtists && albumShow ?
          <>
            <div className="row text-center afterHeader mb-4">
              <form onSubmit={searchArtists}>
                <div className="position-relative">
                  <input type="text" className="InputBox text-start" placeholder={searchKey} onChange={e => setSearchKey(e.target.value.toLowerCase())} />
                  <button type={"submit"} className="SearchIconAfter"><BiSearchAlt2 /></button>
                </div>
              </form>
            </div>
            <div className="container">
              <div className="row">
                {renderArtists()}
              </div>
            </div>
          </>
          : null}

        {!albumShow ?
          <div className="container afterHeader">
            <h3 className="ms-3">{searchKey}</h3>
            <h5 className="text-secondary ms-3">Albums</h5>
            <div className="row">{renderAlbums()}</div>
          </div>
          : null}
      </div>
    </div>
  );
}

export default App;
