import "./index.html";
import "./index.scss";
import { initRouter } from "./modules/router/router";
import { drawMenu } from "./modules/main/menu";
import { drawHeader } from "./modules/main/header";

//window.history.pushState([], "", "");

const routeParams = initRouter();
const category = routeParams.category_id ? routeParams.category_id : 1;
drawMenu(category);
drawHeader();
