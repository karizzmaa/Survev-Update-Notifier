// ==UserScript==
// @name         Survev.io Update Notifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Notifies when Survev.io updates
// @author       You
// @match        https://survev.io/*
// @icon         https://raw.githubusercontent.com/karizzmaa/Survev-Update-Notifier/main/icon.png
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentVersion() {
        const versionElement = document.querySelector('a.footer-after');
        return versionElement ? versionElement.textContent.replace('ver ', '').trim() : null;
    }

    function createPopup(previousVersion, currentVersion) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        overlay.style.backdropFilter = 'blur(3px)';
        overlay.style.zIndex = '9998';
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = 'rgba(0, 0, 0, 0.7)';
        popup.style.padding = '20px';
        popup.style.borderRadius = '8px';
        popup.style.color = 'white';
        popup.style.zIndex = '9999';
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s ease-in-out';

        popup.innerHTML = `
            <div style="text-align: center;">
                <h2 style="margin: 0 0 15px 0;">Survev.io Has Updated!</h2>
                <div style="font-size: 24px; margin-bottom: 20px;">${previousVersion} ► ${currentVersion}</div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="changelogBtn" style="padding: 8px 16px; cursor: pointer; background: #ffffff; border: none; border-radius: 4px; color: black;">View Changelog</button>
                    <button id="closeBtn" style="padding: 8px 16px; cursor: pointer; background: #ffffff; border: none; border-radius: 4px; color: black;">Okay</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        setTimeout(() => {
            overlay.style.opacity = '1';
            popup.style.opacity = '1';
        }, 10);

        popup.querySelector('#closeBtn').addEventListener('click', () => {
            popup.style.opacity = '0';
            overlay.style.opacity = '0';
            setTimeout(() => {
                popup.remove();
                overlay.remove();
            }, 300);
        });

        popup.querySelector('#changelogBtn').addEventListener('click', () => {
            window.open('changelogRec.html', '_blank');
            popup.style.opacity = '0';
            overlay.style.opacity = '0';
            setTimeout(() => {
                popup.remove();
                overlay.remove();
            }, 300);
        });

        return popup;
    }

    unsafeWindow.testPopup = function() {
        createPopup('0.0.21', '0.0.22');
    };

    window.addEventListener('load', () => {
        setTimeout(() => {
            const currentVersion = getCurrentVersion();
            const previousVersion = GM_getValue('lastVersion', null);

            if (currentVersion) {
                if (previousVersion === null) {
                    GM_setValue('lastVersion', currentVersion);
                } else {
                    if (previousVersion === currentVersion) {
                        console.log(`${previousVersion} ► ${currentVersion} - No Update`);
                    } else {
                        console.log(`${previousVersion} ► ${currentVersion} Updated!`);
                        createPopup(previousVersion, currentVersion);
                    }
                }
                GM_setValue('lastVersion', currentVersion);
            }
        }, 1000);
    });
})();
