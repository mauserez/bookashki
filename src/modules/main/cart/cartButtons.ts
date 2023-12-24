import { fromHtml } from "../../elem";
import { BookId, BookItem } from "../../types/bookTypes";
import {
	addToCart,
	deleteFromCart,
	clearCart,
	getBookInCart,
	removeFromCart,
} from "./cart";

export const createCartBtns = async (bookItem: BookItem) => {
	const bookCartCounter = await createBookInCartCounter(bookItem.id);
	const btnsCartWrapActive = bookCartCounter.count === 0 ? "" : "active";
	const btnsCartWrap = fromHtml(
		`<div class="book-buttons__cart ${btnsCartWrapActive}"></div>`
	);

	const addCartBtn = createAddCartBtn(bookItem, bookCartCounter.el);
	const removeCartBtn = createRemoveCartBtn(bookItem.id, bookCartCounter.el);

	btnsCartWrap.append(addCartBtn);
	btnsCartWrap.append(bookCartCounter.el);
	btnsCartWrap.append(removeCartBtn);

	return btnsCartWrap;
};

export const createAddCartBtn = (
	bookItem: BookItem,
	counter: null | HTMLElement = null
) => {
	const btn = fromHtml(
		`<div class="book-buttons__cart-add bi bi-plus action-btn"></div>`
	);

	btn.onclick = () =>
		addToCart.bind({ clicked: btn, counter: counter })(bookItem);

	return btn;
};

export const createRemoveCartBtn = (
	bookId: BookId,
	counter: null | HTMLElement = null
) => {
	const btn = fromHtml(
		`<div class="book-buttons__cart-remove bi bi-dash action-btn"></div>`
	);

	btn.onclick = () =>
		removeFromCart.bind({ clicked: btn, counter: counter })(bookId);

	return btn;
};

export const createDeleteFromCartBtn = (
	bookId: BookId,
	elToRemove: HTMLElement | null = null
) => {
	const btn = fromHtml(
		`<div class="book-buttons__cart-delete bi bi-x action-btn"></div>`
	);

	btn.onclick = () => {
		if (confirm("Удалить товар ?") === true) {
			deleteFromCart.bind({ elToRemove: elToRemove })(bookId);
		}
	};

	return btn;
};

export const createBookInCartCounter = async (bookId: BookId) => {
	const bookInCartCounter = await getBookInCart(bookId);

	return {
		el: fromHtml(
			`<div class="book-cart-counter">${bookInCartCounter.length}</div>`
		),
		count: bookInCartCounter.length,
	};
};

export const createClearCartBtn = (
	cartListToRemove: HTMLElement | null = null
) => {
	const btn = fromHtml(`<button class="btn-danger">Удалить все</button>`);
	btn.onclick = () => {
		if (confirm("Удалить все товары ?") === true) {
			clearCart.bind({ elToRemove: cartListToRemove })();
		}
	};

	return btn;
};
