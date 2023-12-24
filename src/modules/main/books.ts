import API from "../axios";
import { fromHtml } from "../elem";
import { createFavBtn } from "./fav";

import {
	numberWithSpaces,
	refreshContent,
	createUrlParts,
	splitSearchUrl,
	refreshSubHeader,
} from "./util";

import { BookId, BookItem, BookItems } from "../types/bookTypes";
import { createCartBtns } from "./cart/cartButtons";

type UnknownType = string | number | boolean | [];
type UnknownObject = {
	[key: string]: UnknownType;
};

const createBookCard = async (bookItem: BookItem) => {
	const buttons = fromHtml(`<div class="book-buttons"></div>`);
	const cartButtons = await createCartBtns(bookItem);
	const favoriteButton = await createFavBtn(bookItem.id);

	buttons.append(cartButtons);
	buttons.append(favoriteButton);

	const bookElement = fromHtml(
		`<div class="book-list__item">
			<div class="book-info">
				<div>
					<div class="book-info__name">${bookItem.book_name}</div>
					<div class="book-info__author">
						${bookItem.author_name}
						<i class="bi bi-feather"></i>
					</div>
				</div>
				<div class="book-price">
					${numberWithSpaces(bookItem.price)} р.
				</div>
			</div>
			<div class="book-img" style="background-image: url(${bookItem.source})"></div>
		</div>`
	);

	bookElement.append(buttons);

	return bookElement;
};

export const drawBooks = async (books: BookItems) => {
	const bookListElement = fromHtml(`<section class="book-list"></section>`);

	if (books.length > 0) {
		for (let i = 0; i < books.length; i++) {
			const bookCard = await createBookCard(books[i]);
			bookListElement.append(bookCard);
		}
	}

	refreshContent(bookListElement);
};

export const getBooks = (searchParams: UnknownObject) => {
	let urlParts = "";

	if (searchParams.search) {
		refreshSubHeader("");
		const search = searchParams.search;
		urlParts = `q=${search}`;
	} else {
		refreshSubHeader("");
		const urlSearch = splitSearchUrl();
		const searchParamsCombine: {
			[key: number | string]: string | number;
		} = {
			...searchParams,
			...urlSearch,
		};

		if (
			searchParamsCombine.category_id &&
			[1, "1"].includes(searchParamsCombine.category_id)
		) {
			delete searchParamsCombine.category_id;
		}

		urlParts = createUrlParts(searchParamsCombine);
	}

	if (searchParams.id) {
		urlParts = "";
		for (const p in searchParams) {
			const val = searchParams[p];
			const key: number | string = p;

			if (Array.isArray(val)) {
				val.forEach((v) => {
					urlParts += `&${key}=${v}`;
				});
			} else {
				urlParts += `&${key}=${val}`;
			}
		}
	}

	API.get(`/books?${urlParts}`)
		.then((response) => {
			const books: BookItems = response.data;
			drawBooks(books);
		})
		.catch((error) => {
			console.log(error);
		});
};

export const getBook = (bookId: BookId) => {
	API.get(`/books?id=${bookId}`)
		.then((response) => {
			const book: BookItem = response.data;
		})
		.catch((error) => {
			console.log(error);
		});
};
