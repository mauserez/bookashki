import API from "../axios";
import { fromHtml } from "../elem";
import { getBooks } from "./books";

type MenuItem = {
	id: number;
	category_name: string;
};

type MenuList = MenuItem[];

const activateMenuItem = (clicked: HTMLElement) => {
	const childs = clicked.parentNode?.querySelectorAll("li");
	childs?.forEach((childLi) => {
		childLi.classList.remove("nav__item-active");
	});
	clicked.classList.add("nav__item-active");
};

const clickMenuItem = (clicked: HTMLElement, categoryId: number) => {
	activateMenuItem(clicked);
	history.pushState(
		{ category_id: categoryId },
		"",
		`/books?category_id=${categoryId}`
	);
	getBooks({ category_id: categoryId });
};

const menuItemTemplate = (menuItem: MenuItem, menuActiveId = 1) => {
	const firstActive = menuItem.id === menuActiveId ? "nav__item-active" : "";
	const liMenu = fromHtml(
		`<li data-id="${menuItem.id}" class="nav__item ${firstActive}">${menuItem.category_name}</li>`
	);

	liMenu.onclick = () => {
		clickMenuItem(liMenu, menuItem.id);
	};

	return liMenu;
};

export const drawMenu = async (activeMenuIdRoute: string | number = 1) => {
	const menuItems = await getMenu();
	const menuActiveId = parseInt(activeMenuIdRoute.toString());

	const logo = fromHtml(
		`<div id="logo"><i class="bi bi-book"></i>Bookashki</div>`
	);

	logo.onclick = () => {
		window.location.href = "/books?category_id=1";
	};

	const nav = fromHtml(`<nav></nav>`);

	const ulMenu = fromHtml(`<ul class="nav"></ul>`);
	menuItems.forEach((e) => {
		ulMenu.append(menuItemTemplate(e, menuActiveId));
	});

	nav.append(ulMenu);

	const aside = document.querySelector("aside");

	if (aside !== null) {
		aside.innerHTML = "";

		aside.append(logo);
		aside.append(nav);
	}
};

export const getMenu = async () => {
	return await API.get("/menu")
		.then((response) => {
			const menuItems: MenuList = response.data;
			return menuItems;
		})
		.catch((error) => {
			return [];
		});
};
