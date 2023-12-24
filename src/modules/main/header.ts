import { fromHtml } from "../elem";
import { router } from "../router/router";
import { getBooks } from "./books";
import { getCart, drawCart } from "./cart/cart";
import { drawFavBooks, getFavBooks } from "./fav";
import { drawOrderList } from "./orders/orderList";
import { getOrder } from "./orders/order";
import { refreshHeader } from "./util";

const createSearch = () => {
	const searcherWrap = fromHtml(`<div class="header__search-wrap"></div>`);
	const searcher = <HTMLInputElement>(
		fromHtml(
			`<input placeholder="&#xF52A;&nbsp; Поиск" class="header__search"/>`
		)
	);
	searcher.dataset.hasClearSearch = "false";

	searcher.onkeyup = (e) => {
		const tg = <HTMLInputElement>e.target;
		if (tg.value) {
			if (searcher.dataset.hasClearSearch === "false") {
				searcher.dataset.hasClearSearch = "true";

				const clearSearchBtn = fromHtml(
					`<i class="header__search-clear bi bi-x"></i>`
				);

				clearSearchBtn.onclick = () => {
					searcher.dataset.hasClearSearch = "false";
					searcher.value = "";
					clearSearchBtn.remove();
					router();
				};

				searcherWrap.append(clearSearchBtn);
			}
			getBooks({ search: tg.value });
		} else {
			const clearSearch = searcherWrap.querySelector(".header__search-clear");

			if (clearSearch) {
				if (searcher.dataset.hasClearSearch === "true") {
					searcher.dataset.hasClearSearch = "false";
					clearSearch.remove();
				}
			}

			router();
		}
	};

	searcherWrap.append(searcher);

	return searcherWrap;
};

const createCartBtn = () => {
	const btn = fromHtml(
		`<div class="action-btn header__action-btn cart-btn">
			<i class="bi bi-cart">

			</i>
		</div>`
	);

	getCart().then((cartItems) => {
		const cartItemCounter = fromHtml(
			`<div class="action-btn__circle">${cartItems.length}</div>`
		);
		btn.append(cartItemCounter);
	});

	btn.onclick = () => {
		history.pushState({}, "cart", "/cart");
		drawCart();
	};

	return btn;
};

const createFavBtn = () => {
	const btn = fromHtml(
		`<div class="action-btn header__action-btn fav-btn"><i class="bi bi-heart"></i></div>`
	);

	getFavBooks().then((favBooks) => {
		const cartFavBookCounter = fromHtml(
			`<div class="action-btn__circle">${favBooks.length}</div>`
		);
		btn.append(cartFavBookCounter);
	});

	btn.onclick = () => {
		history.pushState({}, "favourite", "/favourite");
		drawFavBooks();
	};

	return btn;
};

const createOrdersBtn = () => {
	const btn = fromHtml(
		`<div class="action-btn header__action-btn orders-btn"><i class="bi bi-box"></i></div>`
	);

	getOrder({ statusId: "1" }).then((favBooks) => {
		const activeOrderCounter = fromHtml(
			`<div class="action-btn__circle">${favBooks.length}</div>`
		);

		btn.append(activeOrderCounter);
	});

	btn.onclick = () => {
		history.pushState({}, "orders", "/orders");
		drawOrderList({ statusId: "1" });
	};

	return btn;
};

export const drawHeader = () => {
	const headerWrap = fromHtml(`<header class="header"></header>`);
	const searcher = createSearch();

	const btns = fromHtml(`<div class="wrap-btn"></div>`);
	const cart = createCartBtn();
	const fav = createFavBtn();
	const orders = createOrdersBtn();

	btns.append(orders);
	btns.append(fav);
	btns.append(cart);

	headerWrap.append(searcher);
	headerWrap.append(btns);

	refreshHeader(headerWrap);
};
