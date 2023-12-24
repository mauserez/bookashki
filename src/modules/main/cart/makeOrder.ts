import API from "../../axios";
import { fromHtml } from "../../elem";
import { clearCart, getCart } from "./cart";
import { updateHeaderOrderBtn } from "../orders/order";

import { OrderItem } from "../../types/orderTypes";
import { drawOrderList } from "../orders/orderList";

export const createMakeOrderBtn = () => {
	const btn = fromHtml(`<button class="btn-success">Оформить</button>`);

	btn.onclick = () => {
		if (confirm("Оформить заказ ?") === true) {
			makeOrder.bind({ btn: btn })();
		}
	};

	return btn;
};

export async function makeOrder() {
	const cartItems = await getCart();
	const curTs = Math.floor(Date.now() / 1000);
	let orderPrice: number = 0;

	cartItems.forEach((e) => {
		orderPrice += parseFloat(e.price);
	});

	let order: OrderItem = {
		items: cartItems,
		dateTimeStamp: curTs,
		statusId: "1",
		date: "",
		price: orderPrice,
	};

	const cartItemListElement = document.querySelector(".cart-list");

	await API.post(`/orders/`, order)
		.then((response) => {
			clearCart().then(() => {
				updateHeaderOrderBtn();
				drawOrderList();
			});

			return response.data;
		})
		.catch((error) => {
			return [];
		});
}
