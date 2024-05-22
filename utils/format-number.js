// Script to format numbers to locale
// Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
// use data-element="number"
// data-locale="" to overwrite the locale

document.addEventListener("DOMContentLoaded", () => {
  // Function to format numbers to English
  function formatNumberToLocale(number, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(number);
  }

  // Function to process all elements with data-element="number"
  function formatElements() {
    // Select all elements with data-element="number"
    const elements = document.querySelectorAll('[data-element="number"]');

    elements.forEach((element) => {
      try {
        // Get the current content of the element
        const content = element.textContent.trim();

        // Parse the content to a float
        const number = parseFloat(content);

        // Check if the parsed number is a valid number
        if (isNaN(number)) {
          throw new Error(`Invalid number: ${content}`);
        }

        // Get the locale from the element's data-locale attribute
        const locale = element.getAttribute("data-locale");

        // Format the number to English
        const formattedNumber = formatNumberToLocale(number, locale);

        // Update the element's content with the formatted number
        element.textContent = formattedNumber;
      } catch (error) {
        console.error(`Error formatting number in element: ${error.message}`);
        // Leave the content unchanged if there's an error
      }
    });
  }

  formatElements();
});
