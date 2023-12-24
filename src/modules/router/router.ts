import { getBooks } from "../main/books";
import { drawCart } from "../main/cart/cart";
import { drawFavBooks } from "../main/fav";
import { drawMenu } from "../main/menu";
import { drawOrderList } from "../main/orders/orderList";
import { drawOrder } from "../main/orders/orderCard";
import { splitSearchUrl } from "../main/util";

export const initRouter = () => {
	window.onpopstate = () => {
		router();
	};

	return router();
};

export const router = () => {
	const route = window.location.pathname;

	const methodParams: {
		[key: number | string]: string | number;
	} = window.location.search === "" ? {} : splitSearchUrl();
	console.log(methodParams);

	switch (route) {
		case "/books":
			if (methodParams.category_id) {
				drawMenu(methodParams.category_id);
				getBooks(methodParams);
			}
			break;
		case "/orders":
			drawOrderList({ statusId: "1" });
			break;
		case "/order":
			const id = parseFloat(methodParams.id.toString());
			drawOrder(id);
			break;
		case "/cart":
			drawCart();
			break;
		case "/favourite":
			drawFavBooks();
			break;
		default:
			getBooks({});
			break;
	}

	return methodParams;
};
