import type { Route } from "./+types/create";
import { CreatePage } from "../pages/create/create";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Create() {
  return <CreatePage />;
}
