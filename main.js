
const startBtn = document.getElementById('startBtn');
const results = document.getElementById('results');
const valueElements = Array.from(document.querySelectorAll('.value'));
let progress = 0;
const TOTAL_TESTS = 4;
let completedTests = 0;
startBtn.addEventListener('click', startSpeedTest);
async function startSpeedTest() {
    startBtn.classList.add('disabled');
    await sleep(0.5);
    startBtn.style.display = 'none';
    results.style.display = 'flex';
    await sleep(0.1);
    results.style.opacity = '1';
    completedTests = 0;
    updateProgress();
    const testServer = 'https://1.1.1.1/cdn-cgi/trace';
    const downloadFile = 'https://speedtest.tele2.net/100MB.zip';
    const pingTimes = await measurePing(testServer, 10);
    const ping = average(pingTimes);
    const jitter = calculateJitter(pingTimes);
    completeTest();
    const downloadSpeed = await measureDownload(downloadFile, 100_000_000);
    completeTest();
    const uploadSpeed = await measureUpload('https://httpbin.org/post', 10);
    completeTest();
    updateResults(downloadSpeed, uploadSpeed, ping, jitter, ping);
}

function completeTest() {
    completedTests++;
    updateProgress();
}

function updateProgress() {
    progress = Math.floor((completedTests / TOTAL_TESTS) * 100);
}

function updateResults(downloadSpeed, uploadSpeed, ping, jitter, latency) {
    const values = [downloadSpeed, uploadSpeed, ping, jitter, latency];
    valueElements.forEach((el, i) => {
        el.innerText = values[i];
        el.classList.remove('show');
        void el.offsetWidth;
        el.classList.add('show');
    });
    startBtn.classList.remove('disabled');
}

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
