function average(arr) {
    return Math.round(arr.reduce((a, b) => a + b) / arr.length);
}

function calculateJitter(times) {
    let diffs = [];
    for (let i = 1; i < times.length; i++) {
        diffs.push(Math.abs(times[i] - times[i - 1]));
    }
    return Math.round(diffs.reduce((a, b) => a + b) / diffs.length);
}

async function measurePing(url, samples = 10) {
    const times = [];
    for (let i = 0; i < samples; i++) {
        const start = performance.now();
        await fetch(url, { method: 'HEAD', cache: 'no-store' });
        times.push(performance.now() - start);
    }
    return times;
}

async function measureDownload(url, minDuration = 8) {
    let totalBytes = 0;
    let start = performance.now();
    let duration = 0;
    let firstChunkTime = null;
    let downloadCount = 0;
    while (duration < minDuration * 1000) {
        const response = await fetch(url, { cache: 'no-store' });
        const reader = response.body.getReader();
        let done = false;
        let thisDownloadBytes = 0;
        while (!done) {
            const { value, done: chunkDone } = await reader.read();
            if (value) {
                if (!firstChunkTime) firstChunkTime = performance.now();
                totalBytes += value.length;
                thisDownloadBytes += value.length;
            }
            done = chunkDone;
        }
        downloadCount++;
        console.log(`Download #${downloadCount}: ${thisDownloadBytes} bytes`);
        duration = performance.now() - start;
    }
    const effectiveDuration = Math.max(0, (duration - 1000) / 1000);
    const effectiveBytes = totalBytes * (effectiveDuration / (duration / 1000));
    const bits = effectiveBytes * 8;
    console.log(`Total bytes downloaded: ${totalBytes}`);
    console.log(`Total duration: ${(duration / 1000).toFixed(2)}s, Effective duration: ${effectiveDuration.toFixed(2)}s`);
    return ((bits / effectiveDuration) / 1_000_000).toFixed(1);
}

async function measureUpload(url, sizeMB = 20, minDuration = 8) {
    const data = new Blob([new Uint8Array(sizeMB * 1024 * 1024)]);
    let totalBytes = 0;
    let start = performance.now();
    let duration = 0;
    let firstChunkTime = null;
    let uploadCount = 0;
    while (duration < minDuration * 1000) {
        const uploadStart = performance.now();
        await fetch(url, {
            method: 'POST',
            body: data,
            cache: 'no-store'
        });
        if (!firstChunkTime) firstChunkTime = performance.now();
        totalBytes += data.size;
        uploadCount++;
        console.log(`Upload #${uploadCount}: ${data.size} bytes`);
        duration = performance.now() - start;
    }
    const effectiveDuration = Math.max(0, (duration - 1000) / 1000);
    const effectiveBytes = totalBytes * (effectiveDuration / (duration / 1000));
    const bits = effectiveBytes * 8;
    console.log(`Total bytes uploaded: ${totalBytes}`);
    console.log(`Total duration: ${(duration / 1000).toFixed(2)}s, Effective duration: ${effectiveDuration.toFixed(2)}s`);
    return ((bits / effectiveDuration) / 1_000_000).toFixed(1);
}
