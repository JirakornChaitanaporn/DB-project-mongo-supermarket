import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    
    index("routes/home.tsx"),
    route("/create", "routes/create.tsx"),
    route("/read/:tab?", "routes/read.tsx"),
    route("/update", "routes/update.tsx"),
    route("/delete", "routes/delmove.tsx"),

] satisfies RouteConfig;
