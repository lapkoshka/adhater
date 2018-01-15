// const blockList = ['ad.mail.ru'];

// function addXMLRequestCallback(callback){
//     if (XMLHttpRequest.callbacks) {
//         XMLHttpRequest.callbacks.push(callback);
//     } else {
//         XMLHttpRequest.callbacks = [callback];
//         const nativeOpen = XMLHttpRequest.prototype.open;
//         const nativeSend = XMLHttpRequest.prototype.send;
//         // override
//         XMLHttpRequest.prototype.open = function(){
//             XMLHttpRequest.callbacks.forEach((callback, index) => {
//                 callback(this);
//             });
//             nativeOpen.apply(this, arguments);
//         }

//         // override
//         // XMLHttpRequest.prototype.send = function(){
//         //     XMLHttpRequest.callbacks.forEach((callback, index) => {
//         //         callback(this);
//         //     });
//         //     nativeSend.apply(this, arguments);
//         // }
//     }
// }
// addXMLRequestCallback(xhr => {
//     // console.log(xhr.responseURL);
//     // xhr.abort();
//     // console.log(/vk/g.test(xhr.responseURL));
//     xhr.addEventListener('progress', evt => {
//         const isAdURL = blockList.some(url => {
//             const regExp = new RegExp(url, 'g');
//             return regExp.test(evt.currentTarget.responseURL);
//         });
//         console.log(evt.currentTarget.responseURL)
//         console.log(isAdURL)
//         // if (isAdURL) {
//         //     evt.currentTarget.abort();
//         // }
//     });
// });
