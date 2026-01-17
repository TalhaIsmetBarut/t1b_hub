// ====================
// SECURITY PROTECTIONS
// ====================
(function () {
    'use strict';

    // 1. Disable right-click context menu (optional obscurity)
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // 2. Disable common keyboard shortcuts for viewing source
    document.addEventListener('keydown', function (e) {
        // Disable F12 (Dev Tools)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Disable Ctrl+Shift+I (Dev Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        // Disable Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        // Disable Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
    });

    // 3. Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    // 4. Disable drag and drop
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });

    // 5. Console warning message
    console.log('%c⚠️ UYARI!', 'color: red; font-size: 40px; font-weight: bold;');
    console.log('%cBu tarayıcı özelliği geliştiriciler içindir.', 'font-size: 16px;');
    console.log('%cBiri size buraya bir şey yapıştırmanızı söylediyse, bu bir dolandırıcılık girişimi olabilir.', 'font-size: 14px; color: red;');

    // 6. Detect DevTools opening (basic detection)
    let devToolsOpen = false;
    const threshold = 160;

    setInterval(function () {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                console.clear();
                console.log('%c🔒 Güvenlik Uyarısı', 'color: red; font-size: 24px;');
            }
        } else {
            devToolsOpen = false;
        }
    }, 1000);

    // 7. Sanitize any dynamic content (XSS Prevention helper)
    window.sanitizeHTML = function (str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    // 8. Prevent clickjacking with frame busting
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }

    // 9. Disable copy (optional)
    // document.addEventListener('copy', function(e) {
    //     e.preventDefault();
    //     return false;
    // });

    // 10. External links security - add rel attributes
    document.addEventListener('DOMContentLoaded', function () {
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(function (link) {
            link.setAttribute('rel', 'noopener noreferrer nofollow');
        });
    });

})();
