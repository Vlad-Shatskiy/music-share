import { useQuery } from "@apollo/client";
import { Pause, PlayArrow, SkipNext, SkipPrevious } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  createTheme,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import { SongContext } from "../App";
import { GET_QUEUED_SONGS } from "../graphql/queries";
import QueuedSongList from "./QueuedSongList";

const theme = createTheme();
const SongPlayer = () => {
  const reactPlayerRef = React.useRef();
  const [played, setPlayed] = React.useState(0);
  const [playedSeconds, setPlayedSeconds] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  const [positionInQueue, setPositionInQueue] = React.useState(0);
  const { data } = useQuery(GET_QUEUED_SONGS);
  const { state, dispatch } = React.useContext(SongContext);
  React.useEffect(() => {
    const songIndex = data.queue.findIndex((song) => song.id === state.song.id);
    setPositionInQueue(songIndex);
  }, [data.queue, state.song.id]);
  React.useEffect(() => {
    const nextSong = data.queue[positionInQueue + 1];
    if (played > 0.99 && nextSong) {
      setPlayed(0);
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }, [data.queue, played, dispatch, positionInQueue]);
  const handleTogglePlay = () => {
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  };
  const handleProgressChange = (event, newValue) => {
    setPlayed(newValue);
  };
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };
  const handleSeekMouseUp = () => {
    setSeeking(false);
    reactPlayerRef.current.seekTo(played);
  };
  const formatDuration = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };
  const handlePlayNextSong = () => {
    const nextSong = data.queue[positionInQueue + 1];
    if (nextSong) {
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  };

  const handlePlayPrevSong = () => {
    const prevSong = data.queue[positionInQueue - 1];
    if (prevSong) {
      dispatch({ type: "SET_SONG", payload: { song: prevSong } });
    }
  };
  return (
    <>
      <Card
        variant="outlined"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0px 15px",
          }}
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography variant="h5" component="h3">
              {state.song.title}
            </Typography>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {state.song.artist}
            </Typography>
          </CardContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1),
            }}
          >
            <IconButton onClick={handlePlayPrevSong}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={handleTogglePlay}>
              {state.isPlaying ? (
                <Pause sx={{ height: 38, width: 38 }} />
              ) : (
                <PlayArrow sx={{ height: 38, width: 38 }} />
              )}
            </IconButton>
            <IconButton onClick={handlePlayNextSong}>
              <SkipNext />
            </IconButton>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {formatDuration(playedSeconds)}
            </Typography>
          </div>
          <Slider
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
            onChange={handleProgressChange}
            value={played}
            type="range"
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <ReactPlayer
          ref={reactPlayerRef}
          onProgress={({ played, playedSeconds }) => {
            if (!seeking) {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
            }
          }}
          url={state.song.url}
          playing={state.isPlaying}
          hidden
        />
        <CardMedia sx={{ width: 150 }} image={state.song.thumbnail} />
      </Card>
      <QueuedSongList queue={data.queue} />
    </>
  );
};

export default SongPlayer;
