import { useMutation, useSubscription } from "@apollo/client";
import { Delete, Pause, PlayArrow, Save } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
  createTheme,
} from "@mui/material";
import React from "react";
import { SongContext } from "../App";
import {
  ADD_OR_REMOVE_FROM_QUEUE,
  DELETE_SONG_FROM_SONGLIST,
} from "../graphql/mutations";
import { GET_SONGS } from "../graphql/subscriptions";
const SongList = () => {
  const { data, loading, error } = useSubscription(GET_SONGS);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  if (error) return <div>Error fetching songs</div>;
  return (
    <div>
      {data.songs.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  );
};
const theme = createTheme();
const Song = ({ song }) => {
  const { id } = song;
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });
  const { state, dispatch } = React.useContext(SongContext);
  const [currentSongPlaying, setCurrentSongPlaying] = React.useState(false);
  const { thumbnail, artist, title } = song;
  const variables = { songId: id };
  const [deleteSong] = useMutation(DELETE_SONG_FROM_SONGLIST);
  React.useEffect(() => {
    const isSongPlaying = state.isPlaying && id === state.song.id;
    setCurrentSongPlaying(isSongPlaying);
  }, [id, state.song.id, state.isPlaying]);
  const handleTogglePlay = () => {
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  };
  const handleAddOrRemoveFromQueue = () => {
    addOrRemoveFromQueue({
      variables: { input: { ...song, __typename: "Song" } },
    });
  };
  const handleDeleteSong = () => {
    deleteSong({ variables });
  };
  return (
    <Card sx={{ margin: theme.spacing(3) }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <CardMedia
          image={thumbnail}
          sx={{ objectFit: "cover", width: 140, height: 140 }}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body1" component="p" color="textSecondary">
              {artist}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={handleTogglePlay} size="small" color="primary">
              {currentSongPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={handleAddOrRemoveFromQueue}
              size="small"
              color="secondary"
            >
              <Save />
            </IconButton>
            <IconButton onClick={handleDeleteSong}>
              <Delete color="error" />
            </IconButton>
          </CardActions>
        </div>
      </div>
    </Card>
  );
};
export default SongList;
