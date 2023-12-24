import API from "../../axios";

import { fromHtml } from "../../elem";
import { AssocArray } from "../../types/mainTypes";
import { OrderItems } from "../../types/orderTypes";
import { CartItems } from "../cart/cart";

export const getOrder = async (params: AssocArray) => {
	params["_sort"] = "dateTimeStamp";
	params["_order"] = "desc";

	return await API.get(`/orders`, { params: params })
		.then((response) => {
			const orders: OrderItems = response.data;
			return orders;
		})
		.catch((error) => {
			return [];
		});
};

export const createOrderItemCollection = (items: CartItems) => {
	const collection = fromHtml(`<div class="order-ticket__items"></div>`);

	items.forEach((e) => {
		const collectionItem = fromHtml(
			`<a href="/book/${e.book_id}" class="order-ticket__item"></div>`
		);

		collectionItem.style.backgroundImage = `url(${e.source})`;
		collection.append(collectionItem);
	});

	return { collection: collection, objCollection: items };
};

export const updateHeaderOrderBtn = () => {
	setTimeout(() => {
		getOrder({ statusId: 1 }).then((orders) => {
			const headerOrdersBtnCounter = document.querySelector(
				".header__action-btn.orders-btn .action-btn__circle"
			);

			if (headerOrdersBtnCounter) {
				headerOrdersBtnCounter.innerHTML = orders.length.toString();
			}
		});
	}, 200);
};

export const createOrderStatusBtn = (statusId: string) => {
	const orderStatusList = orderStatuses();
	const orderStatusBtns = orderStatusesBtn();

	const orderStatus = fromHtml(
		`<button type="button" class="order-ticket__status align-self-start cursor-default
		${orderStatusBtns[statusId]}">
			${orderStatusList[statusId]}
		</button>`
	);

	return orderStatus;
};

export const orderStatuses = () => {
	return <AssocArray>{ "1": "В доставке", "2": "Получен" };
};

export const orderStatusesBtn = () => {
	return <AssocArray>{ "1": "btn-primary", "2": "btn-success" };
};
