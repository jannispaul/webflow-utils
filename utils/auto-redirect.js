// Script for visitor routing
// Script to redirect users based on browser language and rel="alternate" hreflang attributes
//
// When the language switch is used the user preference is stored in a cookie
// The script will check the user preference and the browser language to redirect to the correct language version

// This script should be placed in the <head> of the document before any other scripts

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

// Function to get browser language, fallback to English
const getBrowserLang = () => {
  const fullLang = navigator.language.toLowerCase();
  return fullLang.split("-")[0]; // Extract primary language (e.g., "en" from "en-US")
};

// Function to get the alternate URL for a specific language, preserving URL parameters and hashes
const getAlternateUrlWithParams = (lang) => {
  const alternateLink = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
  if (!alternateLink) return null;

  const url = new URL(alternateLink.href);
  const currentUrl = new URL(window.location.href);

  // Append search parameters and hash from the current URL to the alternate URL
  url.search = currentUrl.search;
  url.hash = currentUrl.hash;

  return url.toString();
};

// Only run the script if the URL does not contain "webflow.io"
if (!window.location.href.includes("webflow.io")) {
  // Retrieve the current document language and preferred language
  const currentLang = document.documentElement.lang.toLowerCase();
  const preferredLang = getCookie("preferredLang");
  const browserLang = getBrowserLang();
  const activeLang = preferredLang || browserLang;

  // Redirect to the alternate URL if the active language doesn't match the current language
  if (activeLang !== currentLang) {
    const targetUrl = getAlternateUrlWithParams(activeLang) || getAlternateUrlWithParams("en"); // Default to English if no URL for activeLang
    if (targetUrl && targetUrl !== window.location.href) {
      window.location.href = targetUrl;
    }
  }

  // When using lang switch links, set the preferred language
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[hreflang]").forEach((link) => {
      link.addEventListener("click", () => {
        const langPrefix = link.getAttribute("hreflang");
        document.cookie = `preferredLang=${langPrefix};path=/;max-age=31536000;SameSite=Strict`;
      });
    });
  });
}
