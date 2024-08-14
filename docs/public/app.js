document.addEventListener("DOMContentLoaded", () => {
    HTMLSourceCodeElement.on("highlight", (code, language) => {
        return language
             ? hljs.highlight(code, { language }).value
             : hljs.highlightAuto(code).value;
    });

    HTMLSourceCodeElement.globalAttrs({
        copy: true
    });

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
    document.addEventListener("DOMContentLoaded", updateSidebarCollapse);
    document.addEventListener("scroll", updateSidebarCollapse);

    Array.from(document.querySelectorAll("h2, h3"))
    .forEach(heading => {
        const id = heading.textContent.toLowerCase().match(/[a-z0-9 ]*/g).join("").replace(/ +/g, "-");
        heading.id = id;
        const a = document.createElement("a");
        a.innerHTML = heading.innerHTML;
        a.href = `#${id}`;
        heading.innerHTML = null;
        heading.appendChild(a);
    });

    setTimeout(() => {
        const anchor = document.location.hash
        ? document.querySelector(document.location.hash)
        : null;
        anchor && anchor.scrollIntoView();
         
        document.documentElement.classList.add("r");
    }, 0);
});