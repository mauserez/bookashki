import API from "../../axios";
import { fromHtml } from "../../elem";
import {
	refreshContent,
	returnUniqueArrayOfObjects,
	refreshSubHeader,
	numberWithSpaces,
	clickedAnimate,
} from "../util";

import { BookId, BookItem, BookItems } from "../../types/bookTypes";
import { createFavBtn } from "../fav";
import { createMakeOrderBtn } from "./makeOrder";
import {
	createCartBtns,
	createDeleteFromCartBtn,
	createClearCartBtn,
} from "./cartButtons";

export interface CartItem extends Omit<BookItem, "id"> {
	book_id: BookId;
	id?: number;
}

export type CartItems = CartItem[];

export async function addToCart(bookItem: BookItem) {
	const bookId = bookItem.id;
	const cartItem: CartItem = Object.assign({ book_id: bookId }, bookItem);
	delete cartItem.id;

	cartItem.book_id = bookItem.id;

	let counter: null | HTMLElement = null;

	if (this !== undefined && this.clicked) {
		clickedAnimate(this.clicked);

		if (this.counter) {
			counter = this.counter;
		}
	}

	API.post(`/cart`, cartItem)
		.then((response) => {
			Promise.resolve(getBookInCart(bookId)).then((resp) => {
				if (counter !== null) {
					counter.innerHTML = resp.length.toString();
					this.clicked.parentElement?.classList.add("active");
				}
			});
		})
		.catch((error) => {})
		.finally(() => {
			updateCartBtnCounter();
		});
}

export async function removeFromCart(bookId: BookId) {
	let counter: null | HTMLElement = null;

	if (this !== undefined) {
		if (this.clicked) {
			clickedAnimate(this.clicked);
		}

		if (this.counter) {
			counter = this.counter;
		}
	}

	const bookBasketItemsLeft = await API.get(`/cart?book_id=${bookId}`)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			return [];
		})
		.finally(() => {
			updateCartBtnCounter();
		});

	const basketItemIdToRemove =
		bookBasketItemsLeft[0] === undefined ? 0 : bookBasketItemsLeft[0].id;

	let bookInBasketLeft = bookBasketItemsLeft.length;

	if (bookInBasketLeft !== 0) {
		await API.delete(`/cart/${basketItemIdToRemove}`)
			.then((response) => {
				if (counter !== null) {
					counter.innerHTML = (--bookInBasketLeft).toString();
					if (bookInBasketLeft === 0) {
						this.clicked.parentElement?.classList.remove("active");
					}
				}
				return response.data;
			})
			.catch((error) => {
				return [];
			});
	}

	return bookInBasketLeft;
}

const deleteFromCartRequest = async (id: number) => {
	await API.delete(`/cart/${id}`)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			return [];
		})
		.finally(() => {
			updateCartBtnCounter();
		});
};

export async function deleteFromCart(bookId: BookId) {
	const booksInCart = await getBookInCart(bookId);

	if (booksInCart.length > 0) {
		for (let i = 0; i < booksInCart.length; i++) {
			deleteFromCartRequest(booksInCart[i].id);
		}

		if (this.elToRemove) {
			this.elToRemove.remove();
		}
	}
}

export async function clearCart() {
	const cartItems = await getCart();

	if (cartItems.length > 0) {
		for (let i = 0; i < cartItems.length; i++) {
			if (cartItems[i].id !== undefined) {
				deleteFromCartRequest(<number>cartItems[i].id);
			}
		}

		if (this !== undefined) {
			if (this.elToRemove) {
				this.elToRemove.remove();
				setTimeout(() => {
					cartIsEmptyText();
				}, 200);
			}
		}
	}
}

export const cartIsEmptyText = () => {
	refreshContent("Ждем новых заказов");
};

export const getBookInCart = async (bookId: BookId) => {
	const result =
		(await API.get(`/cart?book_id=${bookId}`)
			.then((response) => {
				const books: BookItems = response.data;
				return books;
			})
			.catch((error) => {
				console.log(error);
			})) ?? [];

	return result;
};

export const getCart = async () => {
	return await API.get(`/cart`)
		.then((response) => {
			const cartItems: CartItems = response.data;
			return cartItems;
		})
		.catch((error) => {
			return [];
		});
};

const createCartItem = async (bookItem: BookItem) => {
	const cartItem = fromHtml(`<div class="cart-list__item"></div>`);

	const cartItemPrice = fromHtml(
		`<div class="cart-item__price">${numberWithSpaces(bookItem.price)} Р</div>`
	);

	const cartItemName = fromHtml(
		`<div>
			<div class="cart-item__name">${bookItem.book_name}</div>
			<div class="cart-item__author">${bookItem.author_name}<i class="bi bi-feather"></i></div>
		</div>`
	);

	const cartImg = fromHtml(`<div class="cart-item__img"></div>`);
	cartImg.style.backgroundImage = `url(${bookItem.source})`;

	const btnsWrap = fromHtml(`<div class="cart-item__btn-wrap"></div>`);

	const cartBtns = await createCartBtns(bookItem);
	const favBtn = await createFavBtn(bookItem.id);
	const deleteBtn = createDeleteFromCartBtn(bookItem.id, cartItem);

	btnsWrap.append(cartBtns);
	btnsWrap.append(favBtn);
	btnsWrap.append(deleteBtn);

	cartItem.append(cartImg);
	cartItem.append(cartItemPrice);
	cartItem.append(cartItemName);
	cartItem.append(btnsWrap);

	return cartItem;
};

export const drawCart = async () => {
	const cartItems: CartItems = await getCart();
	let bookItems: BookItems = [];
	let cartPrice = 0;

	if (cartItems.length > 0) {
		for (let i = 0; i < cartItems.length; i++) {
			const cartItem = cartItems[i];

			const cartItemEdited: BookItem = {
				id: cartItem.book_id,
				book_name: cartItem.book_name,
				author_name: cartItem.author_name,
				source: cartItem.source,
				price: cartItem.price,
				category_id: cartItem.category_id,
			};

			cartPrice += parseFloat(cartItem.price);

			cartItemEdited.id = cartItems[i].book_id;

			bookItems.push(cartItemEdited);
		}
	}

	const bookItemsUnique = <BookItems>returnUniqueArrayOfObjects(bookItems);
	const cartWrap = fromHtml(`<div class="cart-list"></div>`);

	for (let i = 0; i < bookItemsUnique.length; i++) {
		const cartItem = await createCartItem(bookItemsUnique[i]);
		cartWrap.append(cartItem);
	}

	const makeOrderBtn = createMakeOrderBtn();
	const clearCartBtn = createClearCartBtn(cartWrap);
	const carBtns = fromHtml(`<div class="cart__main-buttons"></div>`);
	carBtns.append(makeOrderBtn, clearCartBtn);

	const totalCartPrice = fromHtml(`<div class="cart__total-price"></div>`);

	const cartSubHeader = fromHtml(`
		<div class="cart__sub-header">
			Корзина
		</div>`);

	cartSubHeader.append(carBtns);

	refreshSubHeader(cartSubHeader);

	if (cartItems.length > 0) {
		refreshContent(cartWrap);
	} else {
		cartIsEmptyText();
	}
};

const updateCartBtnCounter = () => {
	setTimeout(() => {
		getCart().then((favBooks) => {
			const headerFavBtnCounter = document.querySelector(
				".header__action-btn.cart-btn .action-btn__circle"
			);

			if (headerFavBtnCounter) {
				headerFavBtnCounter.innerHTML = favBooks.length.toString();
			}
		});
	}, 200);
};
