import { fromHtml } from "../../elem";
import { BookItem } from "../../types/bookTypes";
import { createCartBtns } from "../cart/cartButtons";
import { createFavBtn } from "../fav";
import {
	generateHash,
	refreshContent,
	refreshSubHeader,
	returnUniqueArrayOfObjects,
	plural,
} from "../util";

import {
	createOrderItemCollection,
	createOrderStatusBtn,
	getOrder,
} from "./order";

interface OrderTicketItem extends BookItem {
	book_id: number;
}

export const drawOrder = async (orderId: number | undefined) => {
	if (orderId === undefined) {
		console.log("Not found");
	}

	history.pushState({}, "order", `order?id=${orderId}`);

	const hash = generateHash(orderId);
	const res = await getOrder({ id: orderId });
	const orderResult = res[0];

	console.log(orderResult);

	const itemCollection = createOrderItemCollection(
		orderResult.items
	).objCollection;

	itemCollection.forEach((item) => {
		delete item.id;
	});

	const itemUniqueCollection = <OrderTicketItem[]>(
		returnUniqueArrayOfObjects(itemCollection)
	);

	const orderCard = fromHtml(`<div class="order-card"></div>`);

	const orderCardTitleHash = fromHtml(`Заказ № ${hash} `);
	const orderCardStatusBtn = createOrderStatusBtn(orderResult.statusId);
	const orderCardTitle = fromHtml(`<div class="order-card__title"></div>`);
	orderCardTitle.append(orderCardTitleHash, orderCardStatusBtn);

	const itemCount = createCardItemCount(itemCollection.length);

	const itemInfo = fromHtml(`<div class="order-card__item-info"></div>`);

	const itemList = fromHtml(`<div class="order-item-list"></div>`);

	for (let i = 0; i < itemUniqueCollection.length; i++) {
		const item = itemUniqueCollection[i];

		const count = itemCollection.filter(
			(obj) => obj.book_id === item.book_id
		).length;

		const itemTicket = await createItemTicket(item, count);
		itemList.append(itemTicket);
	}

	itemInfo.append(itemCount, itemList);

	orderCard.append(itemInfo);

	refreshSubHeader(orderCardTitle);
	refreshContent(orderCard);
};

const createCardItemCount = (n: number) => {
	const pluralItemTextForms = ["товар", "товара", "товаров"];
	const itemCount = fromHtml(
		`<div class="order-card__item-count">
			${n}
			${plural(pluralItemTextForms, n)}
		</div>`
	);

	return itemCount;
};

const createItemTicket = async (item: OrderTicketItem, count: number) => {
	const totalPrice = count * parseFloat(item.price);
	const countPrice =
		count > 1
			? `<div class="order-item__detail-price">${count} шт. по ${item.price} Р</div>`
			: "";
	item.id = item.book_id;

	const cartBtns = await createCartBtns(item);
	const favtBtn = await createFavBtn(item.book_id);

	const btns = fromHtml(`<div class="order-item__btns"></div>`);
	btns.append(cartBtns, favtBtn);

	const itemImg = fromHtml(`<div class="order-item__img"></div>`);
	itemImg.style.backgroundImage = `url(${item.source})`;

	const itemInfo = fromHtml(`
		<div class="order-item__info">
			<div>${item.book_name}</div>
			<div>${item.author_name}</div>
		</div>
	`);

	const itemPrice = fromHtml(`
		<div class="order-item__price">
			<div class="order-item__total-price">${totalPrice} Р</div>
			${countPrice}
		</div>
	`);

	const orderItemTicket = fromHtml(`<div class="order-item"></div>`);

	orderItemTicket.append(itemImg, itemInfo, itemPrice, btns);

	return orderItemTicket;
};
