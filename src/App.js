import React from "react";
import AddSong from "./components/AddSong";
import Header from "./components/Header";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import { Grid, useMediaQuery, Hidden } from "@mui/material";
import songReducer from "./reducer";

export const SongContext = React.createContext({
  song: {
    id: "7a559339-87bb-4b68-abfe-4233123c78a6",
    title: "Traffic!",
    artists: "Dj Tiesto",
    thumbnail: "https://i3.ytimg.com/vi/-qgzNwdkV4s/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=-qgzNwdkV4s",
    duration: 417,
  },
  isPlaying: false,
});

function App() {
  const initialSongState = React.useContext(SongContext);
  const [state, dispatch] = React.useReducer(songReducer, initialSongState);
  const greaterThanSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <Hidden only="xs">
        <Header />
      </Hidden>

      <Grid container spacing={3}>
        <Grid
          style={{ paddingTop: greaterThanSm ? 100 : 10 }}
          item
          xs={12}
          md={7}
        >
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          style={
            greaterThanMd
              ? {
                  posiition: "fixed",
                  width: "100%",
                  right: 0,
                  top: 70,
                  paddingTop: 100,
                }
              : {
                  position: "fixed",
                  width: "100%",
                  left: 0,
                  bottom: 0,
                }
          }
          item
          xs={12}
          md={5}
        >
          <SongPlayer />
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;
