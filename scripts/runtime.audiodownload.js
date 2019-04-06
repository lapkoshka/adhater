class MusicDownloader {
    download(data) {
        this._load(this._getTrackId(data))
            .then(this._vkArmResponseHandler.bind(this))
            .then(info => this.tryLoad(info.src, info.filename))
            .catch(err => console.log(err));
    }

    getTrackInfo(data) {
        return this._load(this._getTrackId(data))
            .then(this._vkArmResponseHandler.bind(this))
            .catch(err => console.log(err));
    }

    _getTrackId(data) {
        const fragments = JSON.parse(data.dataAudio)[13].split('/');
        return [data.trackId, fragments[2], fragments[5]].join('_');
    }
    
    _load(trackId) {
        return new Promise((onResolve, onReject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://vk.com/al_audio.php');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = evt => onResolve(xhr.responseText);
            xhr.send(`act=reload_audio&al=1&ids=${trackId}`);
        })
    };

    _vkArmResponseHandler(body) {
        return new Promise((onResolve, onReject) => {
            const data = this._vkArmParse(body);

            //TODO: forEach for many ids
            const trackData = data[0];
            if (!trackData) {
                onReject('Отсутствует trackData, ответ сервера:' + body);
                return;
            }
            const vkid = trackData[15] && trackData[15]['vk_id'];
            if (!vkid) {
                onReject('Отсутсвует vk id');
                return;
            }
        
            const url = trackData[2];
        
            if (!url) {
                onReject('Отсутствует url');
                return;
            }
            const unmaskedSrc = this._unmaskSrc(url, vkid);
            if (!unmaskedSrc) {
                onReject('Отсутствует unmaskedSrc');
            }
            const src = this._normalizeSrc(unmaskedSrc);
    
            const duration = trackData[5];
            const artist = this._formatString(trackData[4]);
            const song = this._formatString(trackData[3]);
            const ext = this._getAudioExt(src);
            const filename = `${artist} - ${song}.${ext}`;

            this._getAudioInfoByUrl(src, duration)
                .then(fileInfo => onResolve({
                        vkid,
                        src,
                        duration,
                        filename,
                        bitrate: fileInfo.bitrate,
                        size: fileInfo.size
                    })
                ).catch(err => console.log(err));
        });
    };

    tryLoad(url, filename) {
        chrome.runtime.sendMessage({
            name: 'download',
            value: ({
                url, 
                filename
            })
        });
    };

    _vkArmParse(body) {
        let n = body.split("<!>")[5];
        n = n.replace("<!json>", "");
        return JSON.parse(n || "{}");
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
        if (!b) {
            return null;
        }
        const c = b.split(/[ -\/]/);
        return parseInt(c[3])
    };

    _getAudioInfoByUrl(url, duration) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', url);
            xhr.setRequestHeader('Range', 'bytes=0-0');
            xhr.onload = evt => {
                const info = {
                    bitrate: void 0,
                    size: void 0
                }
                const size = this._getSizeOfRangedHttpRequest(xhr);
                if (size) {
                    const h = 8 * size / 1024 / duration;
                    const j = Math.round(h / 32);
                    info.bitrate = Math.min(32 * j, 320);
                    info.size = (size / 1024 / 1024).toFixed(0);
                }
                resolve(info);
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

    _normalizeSrc(value) {
        const fragments = value.split('?extra')[0].replace('/index.m3u8', '.mp3').split('/');
        fragments.splice(fragments.length - 2, 1);
        if (/psv4/.test(fragments[2])) {
            fragments[fragments.length - 2] = 'audios';
        }
        return fragments.join('/');
    }
};

window.extension || (window.extension = {}), extension.runtime = new MusicDownloader();