import { createServices } from "./client";
import { HttpUiCatalog } from "../modules/localization/infrastructure/http-ui-catalog";
export async function initializeServices() {
  return createServices(await new HttpUiCatalog().load());
}
