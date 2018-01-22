const script = document.createElement('script');
script.type ='text/javascript';
script.src = window.chrome.extension.getURL('/scripts/analytics.js');
script.async = false;
document.querySelector('head').appendChild(script);