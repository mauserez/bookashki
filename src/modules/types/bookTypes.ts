export type BookId = number;

export interface BookItem {
	id: BookId;
	book_name: string;
	author_name: string;
	source: string;
	price: string;
	category_id: number;
}

export type BookItems = BookItem[];
