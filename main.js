var startBtn = document.getElementById('startBtn');

function runSpeedTest() {
    startBtn.classList.add('disabled');
    startBtn.style.display = 'none';
    showResults();
    updateResults();
    runPing();
}

function runPing() {
    measurePing().then(function (pingArr) {
        var ping = Array.isArray(pingArr) ? Math.round(pingArr.reduce(function (a, b) { return a + b; }, 0) / pingArr.length) : '--';
        var jitter = Array.isArray(pingArr) ? calculateJitter(pingArr) : '--';
        updateResults(undefined, undefined, ping, jitter, ping);
        setTimeout(function () { runDownload(ping, jitter); }, 100);
    });
}

function runDownload(ping, jitter) {
    let animFrame;
    let displayedDownload = 0;
    let lastEstimate = 0;
    const downloadEl = document.getElementById('downloadSpeed');
    downloadEl.classList.remove('active');
    downloadEl.classList.add('muted');
    function animateDownload(target) {
        if (typeof target !== 'number' || isNaN(target)) return;
        lastEstimate = target;
        if (Math.abs(displayedDownload - target) < 0.1) {
            displayedDownload = target;
            updateResults(Math.round(displayedDownload), undefined, ping, jitter, ping);
            return;
        }
        displayedDownload += (target - displayedDownload) * 0.2;
        updateResults(Math.round(displayedDownload), undefined, ping, jitter, ping);
        downloadEl.classList.remove('active');
        downloadEl.classList.add('muted');
        animFrame = requestAnimationFrame(function () { animateDownload(lastEstimate); });
    }
    measureDownload(undefined, function (est) {
        animateDownload(est);
    }).then(function (downloadResult) {
        if (animFrame) cancelAnimationFrame(animFrame);
        var download = downloadResult && !downloadResult.error ? Math.round(downloadResult) : '--';
        if (download !== '--') {
            downloadEl.className = 'value active';
            downloadEl.style.color = '#fff';
        }
        updateResults(download, undefined, ping, jitter, ping);
        setTimeout(function () { runUpload(download, ping, jitter); }, 100);
    });
}

function runUpload(download, ping, jitter) {
    const uploadEl = document.getElementById('uploadSpeed');
    uploadEl.classList.remove('active');
    uploadEl.classList.add('muted');
    measureUpload(undefined, 1, function (est) {
        updateResults(download, est, ping, jitter, ping);
        uploadEl.classList.remove('active');
        uploadEl.classList.add('muted');
    }).then(function (uploadResult) {
        var upload = uploadResult && !uploadResult.error ? Math.round(uploadResult) : '--';
        if (upload !== '--') {
            uploadEl.className = 'value active';
            uploadEl.style.color = '#fff';
        }
        updateResults(download, upload, ping, jitter, ping);
        setTimeout(function () {
            startBtn.classList.remove('disabled');
        }, 300);
    });
}

startBtn.addEventListener('click', runSpeedTest);
