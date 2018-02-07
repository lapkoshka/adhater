const script = document.createElement('script');
script.type ='text/javascript';
script.src = window.chrome.extension.getURL('/scripts/vkids.js');
script.async = false;
document.querySelector('head').appendChild(script);