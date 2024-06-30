const processedTestElements = new WeakSet();
const total = {
    success: 0,
    failure: 0,
    errors: 0
};


window.addEventListener("error", (err) => {
    const errorElement = document.querySelector("#error").content.cloneNode(true);
    errorElement.querySelector(".error").textContent = err.message;

    const totalElement = document.querySelector(".total");
    totalElement.classList.add("failure");
    totalElement.insertBefore(errorElement, totalElement.firstChild);

    total.errors++;
});

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => document.querySelector(".scroll-to")?.scrollIntoView(), 0);
    setTimeout(() => console.log(total.failure + total.errors), 1000);
});


function test(styleProperty, expectedValue, subChildIndex) {
    const testElement = Array.from(document.querySelectorAll("*[test]")).pop();
    let testPivotElement = testElement.children[0];
    testPivotElement = !isNaN(subChildIndex) ? testPivotElement.children[subChildIndex] : testPivotElement;

    const resultElement = document.querySelector("#result").content.cloneNode(true);
    const actualValue = window.getComputedStyle(testPivotElement)[styleProperty];

    const isEvalExpect = (expectedValue instanceof Function);
    const wasSuccessful = (expectedValue instanceof Function)
    ? expectedValue(actualValue)
    : (actualValue == expectedValue);
    
    resultElement.querySelector(".result-property").textContent = styleProperty;
    resultElement.querySelector(".result-expected").textContent = !isEvalExpect ? expectedValue : "{ } ( )";
    resultElement.querySelector(".result-actual").textContent = !wasSuccessful ? (actualValue ?? "-") : "";
    resultElement.querySelector(".result-child").textContent = !isNaN(subChildIndex) ? `on child ${subChildIndex}` : "";

    testElement.parentNode.appendChild(resultElement);
    !wasSuccessful && testElement.classList.add("scroll-to");

    !wasSuccessful
    && Array.from(testElement.parentNode.querySelectorAll(".result")).pop().classList.add("failure");

    total[wasSuccessful ? "success" : "failure"]++;
    document.querySelector(".total-success").textContent = `${total.success}`;
    document.querySelector(".total-failure").textContent = `${total.success + total.failure}`;
    !wasSuccessful && document.querySelector(".total").classList.add("failure");
    
    if(processedTestElements.has(testElement)) return;

    const titleElement = document.querySelector("#title").content.cloneNode(true);
    titleElement.querySelector("h4").textContent = testElement.getAttribute("test") || "Untitled";
    testElement.parentNode.insertBefore(titleElement, testElement);

    processedTestElements.add(testElement);
}