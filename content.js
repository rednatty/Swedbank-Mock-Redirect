(async () => {
    const waitForDomReady = () => new Promise(resolve => {
        if (document.readyState === "interactive" || document.readyState === "complete") return resolve();
        document.addEventListener("DOMContentLoaded", resolve);
        setTimeout(resolve, 5000);
    });

    await waitForDomReady();

    const panels = document.querySelectorAll('.rel-info-panel');
    let maxVersion = -Infinity;
    let targetUrl = "";
    let versionStr = "";
    let hostInfo = "";

    panels.forEach(panel => {
        const headerText = panel.querySelector('.panel-heading-rel')?.innerText || '';
        const bodyDivs = panel.querySelectorAll('.panel-body .medium-font-text');
        const bodyLines = Array.from(bodyDivs).map(div => div.innerText);
        const mockLine = bodyLines.find(line => line.includes("Mock is enabled"));

        if (mockLine) {
            const match = headerText.match(/R?(\d+(\.\d+)?)/i);
            if (match) {
                const num = parseFloat(match[1]);
                if (num > maxVersion) {
                    maxVersion = num;
                    versionStr = match[0]; // e.g. "R224"

                    const idMatch = mockLine.match(/lx(\d+):S(\d+)/i);
                    if (idMatch) {
                        const host = idMatch[1];
                        const slot = idMatch[2];
                        hostInfo = `lx${host}:S${slot}`;
                        targetUrl = `https://ib${host}.s${slot}.tde.swedbank.net/app/ib/logga-in`;
                    }
                }
            }
        }
    });

    if (targetUrl) {
        chrome.runtime.sendMessage({
            redirectTo: targetUrl,
            version: versionStr,
            host: hostInfo
        });
    } else {
        chrome.runtime.sendMessage({ error: "No Mock enabled env found" });
    }
})();