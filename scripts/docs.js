const fs = require("fs");
const path = require("path");

const markdownit = require("markdown-it");

const _util = require("./_util");


const MD = markdownit({
	html: true,
	highlight: (str, lang) => {
		return `<source-code${lang ? ` language="${lang}"`: ""}>${
			MD.utils.escapeHtml(str)
		}</source-code>`;
	}
});


function scan(dirpath, fileCb, dirCb = (() => {})) {
	fs.readdirSync(dirpath, {
		withFileTypes: true
	})
	.forEach(dirent => {
		const name = dirent.name
		.replace(/^\d+\. */, "")
		.replace(/\.md$/, "")

		dirent.isDirectory()
		? dirCb({
			name,
			path: path.join(dirent.parentPath, dirent.name)
		})
		: fileCb({
			name,
			isIntro: /^0\./.test(dirent.name),
			html: MD.render(
				fs.readFileSync(`${path.join(dirent.parentPath, dirent.name)}`).toString()
			)
		});
	});
}

function replaceTemplate(markup, name, replacement) {
	return markup
	.replace(new RegExp(`<!-- *T:${name} *-->`), replacement);
}


const rawHTML = fs.readFileSync(_util.resolvePath(path.join("./docs/raw/index.html"))).toString();
const toc = [];
const content = [];
_util.logCaption("Render Docs");
scan(_util.resolvePath("./documentation/"), data => {
	toc.push([ data.name ]);
	content.push(data.html);
}, data => {
	const subcontent = [];
	const subsection = [];
	scan(data.path, subdata => {
		!subdata.isIntro
		&& subsection.push(subdata.name);
		subcontent.push(subdata.html);
	});
	content.push(subcontent.join("\n"));
	toc.push([ data.name, subsection ]);
});

_util.logStepDescription("Render table of contents to docs/index.html");
let renderedHTML = replaceTemplate(
	rawHTML,
	"toc",
	toc.map(section => [
		"<li>",
			`<a>${section[0]}</a>`,
			...section[1]
			? [
				"<ol>",
					...section[1]
					.map(subsection => [
						"<li>",
							`<a>${
								subsection
								.replace(/`([^]+)`/, "<code>$1</code>")
							}</a>`,
						"</li>"
					]),
				"</ol>"
			]
			: [],
		"</li>"
	])
	.flat(2)
	.join("\n")
);

_util.logStepDescription("Render contents to docs/index.html");
renderedHTML = replaceTemplate(
	renderedHTML,
	"content",
	content
	.map(section => `<section class="card">${
		section
	}</section>`)
	.join("\n")
	.replace(/<pre>\s*<code[^>]*>\s*(<source-code)/gi, "$1")
	.replace(/(<\/source-code>)\s*<\/code>\s*<\/pre>/gi, "$1")
);

_util.logStepDescription("Render dist size (kB) to docs/index.html");
renderedHTML = replaceTemplate(
	renderedHTML,
	"size",
	`${
		Math.round(fs.statSync(_util.resolvePath("./dist/flecss.min.css")).size / 1024)
	}kB`
);

fs.writeFileSync(_util.resolvePath(path.join("./docs/index.html")), renderedHTML);