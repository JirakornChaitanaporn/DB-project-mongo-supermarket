import type { Route } from "./+types/delmove";
import { DelmovePage } from "../pages/delmove/delmove";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Delmove() {
  return <DelmovePage />;
}
