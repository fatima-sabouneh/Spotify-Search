import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';
import { BsSpotify, BsStarFill, BsStar } from 'react-icons/bs';
import { BiSearchAlt2 } from 'react-icons/bi';

function App() {
  const CLIENT_ID = "5ee3c9c43db84bd291846a15a11913c5"
  const REDIRECT_URI = "http://localhost:3000/"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const [showArtists, setShowArtists] = useState(true)
  const [albumShow, setAlbumShow] = useState(true);

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    setToken(token)
  }, [])

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
        <div className="card" key={artist.id} onClick={(e) => {Albums(e, artist.id); }}>
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
  return (
    <div>
      <header className='HeaderStyle'>
        <label className='title'>Spotify Artist Search</label>
      </header>
      <div>
        {!token ?
          <div className="CenterBox">
            <a className="LoginBox" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
              Login <BsSpotify className="SpotifyIcon" /></a>
          </div>
          : null}
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
