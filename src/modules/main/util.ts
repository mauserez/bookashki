const refreshHeader = (html: Node) => {
	const mainHeader = document.querySelector(".main-header");
	if (mainHeader) {
		mainHeader.innerHTML = "";
		mainHeader.append(html);
	}
};

export const refreshSubHeader = (html: Node | string) => {
	const subHeader = document.querySelector(".sub-header");
	if (subHeader) {
		subHeader.innerHTML = "";
		if (html) {
			subHeader.append(html);
			subHeader.classList.remove("hidden");
		} else {
			subHeader.classList.add("hidden");
		}
	}
};

const refreshContent = (html: Node | string) => {
	const mainContent = document.querySelector("main > .main-content");
	if (mainContent) {
		mainContent.innerHTML = "";
		mainContent.append(html);
	}
};

const createUrlParts = (obj: object) => {
	return Object.entries(obj)
		.map(([key, val]) => `${key}=${val}`)
		.join("&");
};

export const returnUniqueArrayOfObjects = (arr: {}[]) => {
	const uniqueArray = arr.filter((value, index) => {
		const _value = JSON.stringify(value);
		return (
			index ===
			arr.findIndex((obj) => {
				return JSON.stringify(obj) === _value;
			})
		);
	});

	return uniqueArray;
};

export const splitSearchUrl = (params = "") => {
	const urlQueryToObj = params === "" ? window.location.search : params;

	return urlQueryToObj
		.slice(1)
		.split("&")
		.map((p) => p.split("="))
		.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
};

export const numberWithSpaces = (x: number | string) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const clickedAnimate = (el: HTMLElement) => {
	const btn: HTMLElement = el;

	btn.classList.remove("animate__poof");
	btn.classList.add("animate__poof");

	setTimeout(() => {
		btn.classList.remove("animate__poof");
	}, 100);
};

export const generateHash = (id: number | undefined) => {
	if (id === undefined) {
		id = -1;
	}

	const firstPart = id * 124 + 300 * 10 * 10 * 15;
	const secondPart = id.toString().padStart(5, "0");

	return `${firstPart}-${secondPart}`;
};

export const plural = (forms: string[], n: number) => {
	let idx;

	if (n % 10 === 1 && n % 100 !== 11) {
		idx = 0; // one
	} else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
		idx = 1; // few
	} else {
		idx = 2; // many
	}
	return forms[idx] || "";
};

export { refreshContent, refreshHeader, createUrlParts };
