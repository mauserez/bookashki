import API from "../axios";
import { fromHtml } from "../elem";
import { BookId } from "../types/bookTypes";
import { getBooks } from "./books";
import { refreshContent, refreshSubHeader } from "./util";

type FavBook = {
	id: number;
	book_id: number;
};

const isFav = async (bookId: BookId) => {
	return await API.get(`/favourite?book_id=${bookId}`).then((response) => {
		return response.data.length ? true : false;
	});
};

function toggleFav(bookId: BookId) {
	if (this !== undefined && this.toggler) {
		const toggler: null | HTMLElement = this.toggler;
		if (toggler !== null) {
			toggler.classList.toggle("active");
		}
	}

	API.get(`/favourite?book_id=${bookId}`)
		.then((response) => {
			const res = response.data;
			if (res.length > 0) {
				API.delete(`/favourite/${res[0].id}`);
			} else {
				API.post(`/favourite/`, { book_id: bookId });
			}
		})
		.catch((error) => {
			console.log(error);
		})
		.finally(() => {
			updateFavBtnCounter();
		});
}

export const createFavBtn = async (bookId: BookId) => {
	const favClass: string = (await isFav(bookId)) === true ? "active" : "";
	const btn = fromHtml(
		`<div class="book-buttons__favourite bi bi-heart-fill action-btn ${favClass}"></div>`
	);

	btn.onclick = () => toggleFav.bind({ toggler: btn })(bookId);

	return btn;
};

export const getFavBooks = async () => {
	return await API.get(`/favourite`)
		.then((response) => {
			const res = response.data;
			const bookIds = res.map((a: FavBook) => a.book_id);
			return bookIds;
		})
		.catch((error) => {
			return [];
		});
};

export const drawFavBooks = async () => {
	await getFavBooks().then((bookIds) => {
		if (bookIds.length > 0) {
			getBooks({ id: bookIds });
		} else {
			refreshContent("Здесь пока что ничего нет");
		}

		refreshSubHeader("Избранные");
	});
};

const updateFavBtnCounter = () => {
	setTimeout(() => {
		getFavBooks().then((favBooks) => {
			const headerFavBtnCounter = document.querySelector(
				".header__action-btn.fav-btn .action-btn__circle"
			);
			if (headerFavBtnCounter) {
				headerFavBtnCounter.innerHTML = favBooks.length;
			}
		});
	}, 200);
};
