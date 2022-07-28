import { AddBoxOutlined, Link } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  createTheme,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import React from "react";
import ReactPlayer from "react-player";
import SoundCloudPlayer from "react-player/soundcloud";
import YouTubePlayer from "react-player/youtube";
import { useMutation } from "@apollo/client";
import { ADD_SONG } from "../graphql/mutations";
const DEFAULT_SONG = {
  duration: 0,
  title: "",
  artist: "",
  thumbnail: "",
};
const AddSong = () => {
  const [addSong, { error }] = useMutation(ADD_SONG);
  const [url, setUrl] = React.useState("");
  const [playable, setPlayable] = React.useState(false);
  const theme = createTheme();
  const [dialog, setDialog] = React.useState(false);
  const [song, setSong] = React.useState(DEFAULT_SONG);
  React.useEffect(() => {
    const isPlayable =
      SoundCloudPlayer.canPlay(url) || YouTubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  const handleChangeSong = (event) => {
    const { name, value } = event.target;
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  };
  const handleCloseDialog = () => {
    setDialog(false);
  };
  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYoutubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSoung) {
      songData = await getSoundcloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  }

  async function handleAddSong() {
    try {
      const { url, thumbnail, duration, title, artist } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          duration: duration > 0 ? duration : null,
          title: title.length > 0 ? title : null,
          artist: artist.length > 0 ? artist : null,
        },
      });
      handleCloseDialog();
      setSong(DEFAULT_SONG);
      setUrl("");
    } catch (error) {
      console.error("Error adding song", error);
    }
  }
  function getYoutubeInfo(player) {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    // const thumbnail = `http://img.youtube.com/vi/${video_id}0.jpg`;
    const thumbnail = `https://i3.ytimg.com/vi/${video_id}/hqdefault.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  }

  const getSoundcloudInfo = (player) => {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  };

  const handleError = (field) => {
    return error?.graphQLErrors[0]?.extensions?.path.includes(field);
  };

  const { thumbnail, title, artist } = song;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Dialog
        sx={{ textAlign: "center" }}
        open={dialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <img src={thumbnail} alt="Song thumbnail" style={{ width: "90%" }} />
          <TextField
            variant="standard"
            onChange={handleChangeSong}
            value={title}
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            error={handleError("title")}
            helperText={handleError("title") && "Fill out field"}
          />
          <TextField
            variant="standard"
            onChange={handleChangeSong}
            value={artist}
            margin="dense"
            name="artist"
            label="Artist"
            fullWidth
            error={handleError("artist")}
            helperText={handleError("artist") && "Fill out field"}
          />
          <TextField
            variant="standard"
            onChange={handleChangeSong}
            value={thumbnail}
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            fullWidth
            error={handleError("thumbnail")}
            helperText={handleError("thumbnail") && "Fill out field"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSong} variant="outlined" color="primary">
            Add Song
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        onChange={(event) => setUrl(event.target.value)}
        value={url}
        sx={{ margin: theme.spacing(1) }}
        placeholder="Add Youtube or Soundcloud Url"
        variant="standard"
        fullWidth
        margin="normal"
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button
        disabled={!playable}
        sx={{ margin: theme.spacing(1) }}
        onClick={() => setDialog(true)}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
      >
        Add
      </Button>
      <ReactPlayer url={url} hidden onReady={handleEditSong} />
    </div>
  );
};

export default AddSong;
