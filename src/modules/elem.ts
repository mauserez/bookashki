export const fromHtml = (htmlString: string) => {
	var div = document.createElement("div");
	div.innerHTML = htmlString.trim();
	const elem = div.firstChild;

	// Change this to div.childNodes to support multiple top-level nodes.
	return <HTMLElement>elem;
};
