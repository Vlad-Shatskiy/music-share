import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "apollo-link-ws";
import { GET_QUEUED_SONGS } from "./queries";
// import { ResetTvRounded } from "@mui/icons-material";
const REACT_APP_HASURA_SECRET = process.env.REACT_APP_HASURA_SECRET;
//With WebsocketLink, enabling subscriptions.
const client = new ApolloClient({
  link: new WebSocketLink({
    uri: "wss://vladsh-share-music.hasura.app/v1/graphql",
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          "x-hasura-admin-secret": REACT_APP_HASURA_SECRET,
        },
      },
    },
  }),
  cache: new InMemoryCache(),
  typeDefs: gql`
    type Song {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }
    input SongInput {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }

    type Query {
      queue: [Song]!
    }
    type Mutation {
      addOrRemoveFromQueue(input: SongInput!): [Song]!
    }
  `,
  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({ query: GET_QUEUED_SONGS });
        if (queryResult) {
          const { queue } = queryResult;
          const isInQueue = queue.some((song) => song.id === input.id);
          const newQueue = isInQueue
            ? queue.filter((song) => song.id !== input.id)
            : [...queue, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queue: newQueue },
          });
          return newQueue;
        }
        return [];
      },
    },
  },
});
const hasQueue = Boolean(localStorage.getItem("queue"));
const data = {
  queue: [],
};

client.writeQuery({
  query: gql`
    query getQueuedSongs {
      queue
    }
  `,
  data: {
    queue: hasQueue ? JSON.parse(localStorage.getItem("queue")) : [],
  },
});
export default client;
// client.writeData({ data });

// Without WebSocketLink
// const client = new ApolloClient({

//     uri: "https://vladsh-share-music.hasura.app/v1/graphql",
//     headers: {
//       "content-type": "application/json",
//       "x-hasura-admin-secret": REACT_APP_HASURA_SECRET,
//     },
//     cache: new InMemoryCache(),
//   });
