const observer = new MutationObserver(evt => {
    const mutation = evt[0].target;
    if (!mutation.classList.contains('audio_row__info')) {
        return;
    }

    const mainParent = mutation.parentNode.parentNode.parentNode;
    const trackId = mainParent.attributes['data-full-id'].nodeValue;
    const dataAudio = mainParent.attributes['data-audio'].nodeValue;
    const actionsEl = mutation.childNodes[1];
    if (!actionsEl) {
        return;
    }

    const button = document.createElement('button');
    button.classList.add('audio-ext-button-download');
    button.setAttribute('data-full-id', trackId);
    button.setAttribute('data-audio', dataAudio);
    button.innerText = 'Download';
    button.onclick = evt => {
        evt.stopPropagation();
        const trackId = evt.target.attributes['data-full-id'].nodeValue;
        const dataAudio = evt.target.attributes['data-audio'].nodeValue;

        chrome.runtime.sendMessage({
            name: "data.audio",
            value: JSON.stringify({
                trackId, 
                dataAudio
            })
        })
        
    }
    actionsEl.insertBefore(button, actionsEl.firstChild);
});
const config = { childList: true, subtree: true };
observer.observe(document.body, config);