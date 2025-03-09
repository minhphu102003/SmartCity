import mongoose from "mongoose";
import { Route } from "../../shared/models/index.js";

const routeV2Schema = new mongoose.Schema(Route.schema.obj);

routeV2Schema.path("segments").options.ref = "RoadSegmentV2";

export default mongoose.model("RouteV2", routeV2Schema);