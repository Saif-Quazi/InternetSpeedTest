

var DOWNLOAD_URL = 'http://localhost:8787';
var UPLOAD_URL = 'https://upload-test.quazisaif09.workers.dev';

function measurePing(url, samples) {
    url = url || DOWNLOAD_URL;
    samples = samples || 8;
    var times = [];
    var promise = Promise.resolve();
    function doPing(i) {
        if (i >= samples) {
            var filtered = times.filter(function(t) { return t !== null; });
            if (!filtered.length) return Promise.resolve({ error: 'Ping failed' });
            return Promise.resolve(filtered);
        }
        var start = performance.now();
        return fetch(url + '?t=' + Date.now() + '_' + Math.random(), { method: 'HEAD', cache: 'no-store' })
            .then(function() { times.push(performance.now() - start); })
            .catch(function() { times.push(null); })
            .then(function() { return doPing(i + 1); });
    }
    return doPing(0);
}

function measureDownload(url, onEstimate) {
    url = url || DOWNLOAD_URL;
    var results = [], stable = false, rounds = 0;
    function runRound() {
        if ((stable && results.length >= 6) || rounds >= 50) return Promise.resolve(average(results).toFixed(1));
        var totalBytes = 0;
        var start = performance.now();
        return fetch(url + '?t=' + Date.now() + '_' + Math.random(), { cache: 'no-store' })
            .then(function(resp) {
                if (!resp.body) return { error: 'No response body' };
                var reader = resp.body.getReader();
                function readAll() {
                    return new Promise(function(resolve, reject) {
                        function readNext() {
                            reader.read().then(function(result) {
                                if (result.done) {
                                    resolve();
                                    return;
                                }
                                if (result.value) totalBytes += result.value.length;
                                readNext();
                            }).catch(reject);
                        }
                        readNext();
                    });
                }
                return readAll();
            })
            .then(function() {
                var duration = (performance.now() - start) / 1000;
                var mbps = duration > 0 ? (totalBytes * 8 / duration) / 1e6 : 0;
                results.push(mbps);
                if (typeof onEstimate === 'function') onEstimate(average(results));
                rounds++;
                if (results.length >= 3) {
                    var last3 = results.slice(-3);
                    var max = Math.max.apply(null, last3), min = Math.min.apply(null, last3);
                    if (min > 0 && (max - min) / min < 0.05) stable = true;
                }
                return runRound();
            });
    }
    return runRound();
}

function measureUpload(url, sizeMB, onEstimate) {
    url = url || UPLOAD_URL;
    sizeMB = sizeMB || 10;
    var data = new Blob([new Uint8Array(sizeMB * 1024 * 1024)]);
    var results = [], stable = false, rounds = 0;
    function runRound() {
        if ((stable && results.length >= 6) || rounds >= 50) return Promise.resolve(average(results).toFixed(1));
        var start = performance.now();
        return fetch(url + '?t=' + Date.now() + '_' + Math.random(), {
            method: 'POST',
            body: data,
            cache: 'no-store'
        })
            .then(function(resp) {
                if (!resp.ok) return { error: 'Upload failed' };
                var duration = (performance.now() - start) / 1000;
                var mbps = duration > 0 ? (data.size * 8 / duration) / 1e6 : 0;
                results.push(mbps);
                if (typeof onEstimate === 'function') onEstimate(average(results));
                rounds++;
                if (results.length >= 3) {
                    var last3 = results.slice(-3);
                    var max = Math.max.apply(null, last3), min = Math.min.apply(null, last3);
                    if (min > 0 && (max - min) / min < 0.05) stable = true;
                }
                return runRound();
            });
    }
    return runRound();
}

function average(arr) {
    if (!arr.length) return 0;
    return Math.round(arr.reduce(function(a, b) { return a + b; }, 0) / arr.length);
}

function calculateJitter(times) {
    var diffs = [];
    for (var i = 1; i < times.length; i++) diffs.push(Math.abs(times[i] - times[i - 1]));
    return diffs.length ? Math.round(diffs.reduce(function(a, b) { return a + b; }, 0) / diffs.length) : 0;
}
