import type { Route } from "./+types/update";
import { UpdatePage } from "../pages/update/update";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Update() {
  return <UpdatePage />;
}
