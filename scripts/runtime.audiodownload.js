class MusicDownloader {
    download(audioData) {
        // document.querySelectorAll('._audio_row_12591728_456239418')
        const data = JSON.parse(audioData);
        this._load(this._getTrackId(data));
    }

    _getTrackId(data) {
        const fragments = JSON.parse(data.dataAudio)[13].split('/');
        return [data.trackId, fragments[2], fragments[5]].join('_');
    }
    
    _load(trackId) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://vk.com/al_audio.php');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = evt => this._vkArmResponseHandler(xhr.responseText);
        xhr.send(`act=reload_audio&al=1&ids=${trackId}`);
    };

    _vkArmResponseHandler(body) {
        const data = this._vkArmParse(body);
        //TODO: forEach for many ids
        const trackData = data[0];
        if (!trackData) {
            console.log('trackData error, arm response:', body);
            return;
        }
        const vkid = trackData[15] && trackData[15]['vk_id'];
        if (!vkid) {
            console.log('vk id error', vkid);
            return;
        }
    
        const url = trackData[2];
    
        if (!url) {
            console.log('url error', url);
            return;
        }
        const unmaskedSrc = this._unmaskSrc(url, vkid);
        if (!unmaskedSrc) {
            console.log('unmaskedSrc error', unmaskedSrc);
        }

        const duration = trackData[5];

        this._getAudioInfoByUrl(unmaskedSrc, duration).
            then(info => console.log(info));
        const artist = this._formatString(trackData[4]);
        const song = this._formatString(trackData[3]);
        const ext = this._getAudioExt(unmaskedSrc);
        const filename = `${artist} - ${song}.${ext}`;
        this._tryLoad(unmaskedSrc, filename);
    };

    _tryLoad(url, filename) {
        chrome.downloads.download({
            url: url,
            filename: filename,
            conflictAction: "overwrite",
            saveAs: false
        })
    };

    _vkArmParse(body) {
        let n = body.split("<!>")[5];
        n = n.replace("<!json>", "");
        return JSON.parse(n)
    }

    _formatString(str) {
        return str = str.replace(/&amp;/g, "&"), str = str.replace(/&quot;/g, '"'), str.replace(/[\\\/\:\*\?\"\<\>\|]/g, "_");
    };

    _getAudioExt(src){
        const path = src.split('?')[0].split('.');
        return path[path.length -1];
    };

    _getSizeOfRangedHttpRequest(xhr) {
        const b = xhr.getResponseHeader("Content-Range");
        const c = b.split(/[ -\/]/);
        return parseInt(c[3])
    };

    _getAudioInfoByUrl(url, duration) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', url);
            xhr.setRequestHeader('Range', 'bytes=0-0');
            xhr.onload = evt => {
                const size = this._getSizeOfRangedHttpRequest(xhr);
                const h = 8 * size / 1024 / duration;
                const j = Math.round(h / 32);
                resolve({
                    bitrate: Math.min(32 * j, 320),
                    size: (size / 1024 / 1024).toFixed(0)
                });
            }
            xhr.send();
        });
        
    }

    /**
     * @param {string} e url 
     * @param {number} n vkid
     */
    _unmaskSrc(e, n) {
        function t(e) {
            if (!e || e.length % 4 == 1) return !1;
            for (var n, t, o = 0, a = 0, s = ""; t = e.charAt(a++);) ~(t = r.indexOf(t)) && (n = o % 4 ? 64 * n + t : t, o++ % 4) && (s += String.fromCharCode(255 & n >> (-2 * o & 6)));
            return s
        }
        var r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=",
            o = {
                v: function(e) {
                    return e.split("").reverse().join("")
                },
                r: function(e, n) {
                    e = e.split("");
                    for (var t, o = r + r, a = e.length; a--;) ~(t = o.indexOf(e[a])) && (e[a] = o.substr(t - n, 1));
                    return e.join("")
                },
                s: function(e, n) {
                    var t = e.length;
                    if (t) {
                        var r = function(e, n) {
                                var t = e.length,
                                    r = [];
                                if (t) {
                                    var o = t;
                                    for (n = Math.abs(n); o--;) n = (t * (o + 1) ^ n + o) % t, r[o] = n
                                }
                                return r
                            }(e, n),
                            o = 0;
                        for (e = e.split(""); ++o < t;) e[o] = e.splice(r[t - 1 - o], 1, e[o])[0];
                        e = e.join("")
                    }
                    return e
                },
                i: function(e, t) {
                    return o.s(e, t ^ n)
                },
                x: function(e, n) {
                    var t = [];
                    return n = n.charCodeAt(0),
                        function() {
                            for (var r = e.split(""), o = 0; o < r.length; o++) t.push(String.fromCharCode(r[o].charCodeAt(0) ^ n))
                        }(), t.join("")
                }
            };
        if (~e.indexOf("audio_api_unavailable")) {
            var a = e.split("?extra=")[1].split("#"),
                s = "" === a[1] ? "" : t(a[1]);
            if (a = t(a[0]), "string" != typeof s || !a) return e;
            for (var i, u, l = (s = s ? s.split(String.fromCharCode(9)) : []).length; l--;) {
                if (u = s[l].split(String.fromCharCode(11)), i = u.splice(0, 1, a)[0], !o[i]) return e;
                a = o[i].apply(null, u)
            }
            if (a && "http" === a.substr(0, 4)) return a
        }
        return e
    };
};

window.extension || (window.extension = {}), extension.runtime = new MusicDownloader();