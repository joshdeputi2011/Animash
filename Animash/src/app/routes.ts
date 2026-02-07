import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Arena } from "./components/Arena";
import { Leaderboard } from "./components/Leaderboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Arena },
      { path: "leaderboard", Component: Leaderboard },
    ],
  },
]);
