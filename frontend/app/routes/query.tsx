import type { Route } from "./+types/query";
import { QueryPage } from "../pages/query/query";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Query - DB Supermarket" },
        { name: "description", content: "Run database queries" },
    ];
}

export default function Query() {
    return <QueryPage />;
}
