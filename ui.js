function updateResults(download, upload, ping, jitter, latency) {
    const valueEls = [
        document.getElementById('downloadSpeed'),
        document.getElementById('uploadSpeed'),
        document.getElementById('ping'),
        document.getElementById('jitter'),
        document.getElementById('latency')
    ];
    const vals = [download, upload, ping, jitter, latency];
    valueEls.forEach((el, i) => {
        if (
            vals[i] !== undefined &&
            vals[i] !== '--' &&
            vals[i] !== null &&
            !(typeof vals[i] === 'string' && vals[i].trim() === '')
        ) {
            el.innerText = vals[i];
            el.style.opacity = 1;
            el.style.display = 'inline-block';
            if (i >= 2) {
                el.classList.remove('muted');
                el.classList.add('active');
            }
        } else {
            el.innerText = '';
            el.style.opacity = 0.6;
            el.style.display = 'inline-block';
            if (i >= 2) {
                el.classList.remove('active');
                el.classList.add('muted');
            }
        }
    });
}

function showResults() {
    const results = document.getElementById('results');
    if (results) {
        results.style.display = 'flex';
        setTimeout(function () { results.style.opacity = '1'; }, 10);
    }
}

function hideResults() {
    const results = document.getElementById('results');
    if (results) {
        results.style.opacity = '0';
        setTimeout(function () { results.style.display = 'none'; }, 400);
    }
}
