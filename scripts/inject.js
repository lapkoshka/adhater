const script = document.createElement('script');
script.type ='text/javascript';
script.src = chrome.extension.getURL("scripts/xhrsniffer.js");
script.async = false;
const head = document.querySelector('head');

// document.documentElement.appendChild(script);
console.log(head)
console.log(window)