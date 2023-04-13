import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBook,
  faPlusSquare,
  faHeartCircleCheck,
  faRss,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node";

function Sidebar({spotifyApi}) {
  const { data: session, status } = useSession();
  const {accessToken} = session.accessToken;
  const [playlists, setPlaylist] = useState([]);
  const [search, setSearch] = useState("cloud");
  const [searchResults, setSearchResults] = useState([]);
  const [newReleases, setNewReleases] = useState([])
  // IMPORT AND VARIABLES
  
  // SETTING USER
  // spotify.getMe()
  // .then(function(data) {
  //   console.log('Some information about the authenticated user', data.body);
  // }, function(err) {
  //   console.log('Something went wrong!', err);
  // });

  // useEffect(() => {
  //   if (spotifyApi.getAccessToken()) {
  //     spotifyApi
  //       .getUserPlaylists()
  //       .then((data) => {
  //         setPlaylist(data.items);
  //       })
  //       .catch((error) => {
  //         console.log("Error:", error);
  //       });
  //     spotifyApi.searchTracks("cloud").then((res)=>{
  //       setPlaylist(res)
  //     }) 
  //   }

  // }, [spotifyApi]);
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
res
      );
    });

  }, [search, accessToken]);

  console.log(searchResults);

  useEffect(()=>{
    if(!accessToken) return;
    spotifyApi.setAccessToken(accessToken)
  },[accessToken])

  const navItems = [
    { icon: faHouse, name: "Home", position: "top" },
    { icon: faSearch, name: "Search", position: "top" },
    { icon: faBook, name: "Your Library", position: "top" },
    { icon: faPlusSquare, name: "Create your playlist", position: "center" },
    { icon: faRss, name: "Your Episode", position: "center" },
    { icon: faHeartCircleCheck, name: "Liked Song", position: "center" },
  ];
  const firstNavItems = [];
  const secondNavItems = [];

  for (let i = 0; i < navItems.length; i++) {
    if (navItems[i].position === "top") {
      firstNavItems.push(navItems[i]);
    } else if (navItems[i].position === "center") {
      secondNavItems.push(navItems[i]);
    }
  }

  return (
    <div className="text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white" onClick={() => signOut()}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Log Out</span>
        </button>
        {firstNavItems.map((navItem) => (
          <NavLink icon={navItem.icon} NavName={navItem.name} key={navItem.name} />
        ))}
        <hr className="border-t-[0.1px] border-gray-900" />
        {secondNavItems.map((navItem) => (
          <NavLink icon={navItem.icon} NavName={navItem.name} key={navItem.name} />
        ))}
        <hr className="border-t-[0.1px] border-gray-900" />
        {/* PlayLists  */}
        {playlists.map((playlist) => (
          <p key={playlist.id} className="cursor-pointer hover:text-white">
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;

const NavLink = ({ icon, NavName }) => {
  return (
    <button className="flex items-center space-x-2 hover:text-white">
      <FontAwesomeIcon icon={icon} />
      <span>{NavName}</span>
    </button>
  );
};
