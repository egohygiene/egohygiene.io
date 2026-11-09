import { intelligenceData } from "../data";
import type { EndpointData } from "./types";

export function endpointData(id: string): EndpointData {
  return intelligenceData.endpoints?.[id] ?? { id, state: "unavailable", groups: [] };
}
