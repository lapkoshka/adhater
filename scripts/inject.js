const script = document.createElement('script');
script.type ='text/javascript';
script.src = window.chrome.extension.getURL('/scripts/xhrsniffer.js');
script.async = false;
document.querySelector('head').appendChild(script);

// (function() {
//     var createElement = function (tagName, type) {
//         var e = document['createElement'](tagName);
//         e.type = type;
//         return e;
//     }

//     var t = createElement('script', 'text/javascript');
//     t.onload = function() {
//         var s = createElement('style', 'text/css');
//         // s.innerHTML = '.lt-label{visibility:hidden!important;z-index:-1000!important;}';
//         var d = document['head']['appendChild'](s);
//     }
//     t.async = true;

//     t.src = window.chrome.extension.getURL('/scripts/xhrsniffer.js');
//     var c = document['getElementsByTagName']('script')[0];
//     if ( c ) c['parentNode']['insertBefore'](t, c);
//     else document.documentElement.firstChild.appendChild(t);
// })();


// document.documentElement.appendChild(script);