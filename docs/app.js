document.addEventListener("DOMContentLoaded", () => {
    const updateSidebarCollapse = () => {
        const collapseClassName = "collapse";
        const scrollClassName = "scroll";
        const sidebarEl = document.querySelector(".sidebar");
        if(window.scrollY > 0) {
            if(sidebarEl.classList.contains(collapseClassName)) return;
            sidebarEl.classList.add(collapseClassName);
            setTimeout(() => sidebarEl.classList.add(scrollClassName), 800);
        } else if(sidebarEl.classList.contains(collapseClassName)) {
            sidebarEl.classList.remove(collapseClassName);
            sidebarEl.classList.remove(scrollClassName);
        }
    };
    updateSidebarCollapse();

    document.addEventListener("scroll", updateSidebarCollapse);
});

document.addEventListener("DOMContentLoaded", () => {
    HTMLSourceCodeElement.on("highlight", (code, language) => {
        return language
            ? hljs.highlight(code, { language }).value
            : hljs.highlightAuto(code).value;
    });
    HTMLSourceCodeElement.globalAttrs({
        copy: true
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    const sectionEls = Array.from(document.querySelectorAll("section.card"));
    Array.from(document.querySelectorAll(".sidebar-toc > li"))
    .forEach((tocSectionEl, i) => {
        const handle = (liEl, hEl) => {
            const aEl = liEl.querySelector("a");
            const id = aEl.textContent.toLowerCase().match(/[a-z0-9 ]*/g).join("").replace(/ +/g, "-");
            
            aEl.href = `#${id}`;
            hEl.id = id;
            const hAEl = document.createElement("a");
            hAEl.innerHTML = hEl.innerHTML;
            hAEl.href = `#${id}`;
            hEl.innerHTML = null;
            hEl.appendChild(hAEl);
        };

        handle(tocSectionEl, sectionEls[i].querySelector("h2"));

        const h3Els = Array.from(sectionEls[i].querySelectorAll("h3"));
        Array.from(tocSectionEl.querySelectorAll("li"))
        .forEach((tocSubsectionEl, j) => handle(tocSubsectionEl, h3Els[j]));
    });

    setTimeout(() => {
        const anchor = document.location.hash
        ? document.querySelector(document.location.hash)
        : null;
        anchor && anchor.scrollIntoView();
    }, 0);
    setTimeout(() => {
        document.documentElement.classList.add("r");
    }, 400);
});