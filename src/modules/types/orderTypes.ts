import { CartItem } from "../main/cart/cart";

export interface OrderItem {
	items: CartItem[];
	id?: number;
	dateTimeStamp: number;
	date: string;
	price: number;
	statusId: string;
}

export type OrderItems = OrderItem[];

export type OrderParams = {
	statusId?: string;
	date?: string;
	dateTimeStamp?: number;
};
