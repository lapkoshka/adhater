const TRACKS = {};
const INFOBLOCK_CLASSNAME = 'audio-ext-button-download-info';

function handleAudioRow(mutation) {
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

    button.onmouseover = evt => {
        const trackId = evt.target.attributes['data-full-id'].nodeValue;
        const dataAudio = evt.target.attributes['data-audio'].nodeValue;
        const trackInfoElement = document.querySelector(`.${INFOBLOCK_CLASSNAME}`);

        const info = TRACKS[trackId] && TRACKS[trackId].info;
        if (info) {
            const isInfoBlockExist = Boolean(trackInfoElement);
            if (!isInfoBlockExist) {
                createRemovableInfoBlock(info, evt.target);
            }
            return;
        }

        extension.runtime.getTrackInfo({
            trackId, 
            dataAudio
        }).then(info => {
            TRACKS[trackId] = {
                info,
                element: evt.target
            };
           createRemovableInfoBlock(info, evt.target);
        });
    };

    button.onclick = evt => {
        evt.stopPropagation();
        const trackId = evt.target.attributes['data-full-id'].nodeValue;
        const dataAudio = evt.target.attributes['data-audio'].nodeValue;
        
        const info = TRACKS[trackId] && TRACKS[trackId].info;
        if (info) {
            extension.runtime.tryLoad(info.src, info.filename);
            return;
        }

        extension.runtime.download({
            trackId, 
            dataAudio
        });
    }
    actionsEl.insertBefore(button, actionsEl.firstChild);
};

function createRemovableInfoBlock(info, parent) {
    const trackInfo = document.createElement('div');
    const trackId = parent.attributes['data-full-id'].nodeValue;
    const dataAudio = parent.attributes['data-audio'].nodeValue;

    trackInfo.innerText = `${info.bitrate}kbps ~ ${info.size}mb`;
    trackInfo.classList.add(INFOBLOCK_CLASSNAME);
    trackInfo.setAttribute('data-full-id', trackId);
    trackInfo.setAttribute('data-audio', dataAudio);

    parent.appendChild(trackInfo);
    parent.onmouseleave = evt => delete parent.removeChild(trackInfo);
}

const observer = new MutationObserver(evt => {
    const mutation = evt[0].target;
    renderPromotePost();
    handleAudioRow(mutation);
});

const config = { childList: true, subtree: true };
observer.observe(document.body, config);
