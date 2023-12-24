import { fromHtml } from "../../elem";
import { generateHash, refreshContent, refreshSubHeader } from "../util";

import {
	createOrderItemCollection,
	createOrderStatusBtn,
	getOrder,
	orderStatuses,
	orderStatusesBtn,
} from "./order";

import { OrderItem, OrderParams } from "../../types/orderTypes";
import { drawOrder } from "./orderCard";

export const drawOrderList = async (params: OrderParams = {}) => {
	const orders = await getOrder(params);

	const orderList = fromHtml(`<div class="order-list"></div>`);

	orders.forEach((order) => {
		orderList.append(drawOrderTicketForList(order));
	});

	refreshSubHeader("Заказы");
	refreshContent(orderList);
};

const drawOrderTicketForList = (order: OrderItem) => {
	const orderTicket = fromHtml(`<div class="order-ticket"></div>`);

	const orderTicketTitle = createTicketTitle(order);
	const orderTicketBody = createTicketBody(order);

	orderTicket.append(orderTicketTitle, orderTicketBody);

	return orderTicket;
};

const createOrderLink = (id: number | undefined) => {
	const orderHash = generateHash(id);
	const orderLink = fromHtml(`<a href="/order?id=${id}">${orderHash}</a>`);

	orderLink.onclick = (e) => {
		e.preventDefault();
		drawOrder(id);
	};

	return orderLink;
};

const createTicketTitle = (order: OrderItem) => {
	const orderTicketTitle = fromHtml(`<div class="order-ticket__title"></div>`);

	const orderLink = createOrderLink(order.id);
	const orderTitle = fromHtml(`<div class="order-ticket__title__id"></div>`);
	orderTitle.append(orderLink);

	const orderName = fromHtml(
		`<div class="order-ticket__title__name">
			<div class="order-ticket__title__dt">Заказ от ${order.dateTimeStamp}</div>
		</div>`
	);
	orderName.append(orderTitle);

	const orderPrice = fromHtml(
		`<div class="order-ticket__title__price">
			<span>Оплачено</span> ${order.price} Р
		</div>`
	);

	orderTicketTitle.append(orderName, orderPrice);

	return orderTicketTitle;
};

const createTicketBody = (order: OrderItem) => {
	const orderTicketBody = fromHtml(`<div class="order-ticket__body"></div>`);

	const orderStatus = createOrderStatusBtn(order.statusId);

	const orderItemCollection = createOrderItemCollection(order.items);

	orderTicketBody.append(orderStatus, orderItemCollection.collection);

	return orderTicketBody;
};
