(async () => {
    const domReady = () =>
        new Promise(resolve => {
            if (document.readyState !== "loading") return resolve();
            document.addEventListener("DOMContentLoaded", resolve, {once: true});
            setTimeout(resolve, 5000);
        });

    await domReady();

    const panels = document.querySelectorAll('.rel-info-panel');
    let best = null;

    for (const panel of panels) {
        const headerText = panel.querySelector('.panel-heading-rel')?.innerText || '';
        const bodyTexts = Array.from(panel.querySelectorAll('.panel-body .medium-font-text')).map(div => div.innerText);
        const mockLine = bodyTexts.find(text => text.includes("Mock is enabled"));
        if (!mockLine) continue;

        const versionMatch = headerText.match(/R?(\d+(?:\.\d+)?)/i);
        const idMatch = mockLine.match(/lx(\d+):S(\d+)/i);
        if (!versionMatch || !idMatch) continue;

        const versionNum = parseFloat(versionMatch[1]);
        if (!best || versionNum > best.version) {
            best = {
                version: versionNum,
                versionStr: versionMatch[0],
                hostInfo: `lx${idMatch[1]}:S${idMatch[2]}`,
                url: `https://ib${idMatch[1]}.s${idMatch[2]}.tde.swedbank.net/app/ib/logga-in`
            };
        }
    }

    chrome.runtime.sendMessage(
        best
            ? {redirectTo: best.url, version: best.versionStr, host: best.hostInfo}
            : {error: "No Mock enabled env found"}
    );
})();
