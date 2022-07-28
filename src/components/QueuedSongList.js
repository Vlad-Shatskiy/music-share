import { useMutation } from "@apollo/client";
import { Delete } from "@mui/icons-material";
import { Avatar, IconButton, Typography, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/system";
import React from "react";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";
const theme = createTheme();

const QueuedSongList = ({ queue }) => {
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  return (
    greaterThanMd && (
      <div style={{ margin: "10px 0" }}>
        <Typography color="textSecondary" variant="button">
          QUEUE ({queue.length})
        </Typography>
        {queue.map((song) => (
          <QueuedSong key={song.id} song={song} />
        ))}
      </div>
    )
  );
};
const QueuedSong = ({ song }) => {
  const { thumbnail, artist, title } = song;
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });
  const handleAddOrRemoveFromQueue = () => {
    addOrRemoveFromQueue({
      variables: { input: { ...song, __typename: "Song" } },
    });
  };
  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "50px auto 50px",
        gridGap: 12,
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <Avatar
        sx={{ width: 44, height: 44 }}
        src={thumbnail}
        alt="Song thumbnail"
      />
      <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
        <Typography
          sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
          variant="subtitle2"
        >
          {title}
        </Typography>
        <Typography
          sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
          color="textSecondary"
          variant="body2"
        >
          {artist}
        </Typography>
      </div>
      <IconButton onClick={handleAddOrRemoveFromQueue}>
        <Delete color="error" />
      </IconButton>
    </div>
  );
};
export default QueuedSongList;
