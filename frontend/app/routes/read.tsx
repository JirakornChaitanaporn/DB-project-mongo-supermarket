import type { Route } from "./+types/read";
import { ReadPage } from "../pages/read/read";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Read() {
  return <ReadPage />;
}
