'use strict';
(() => {
  const splash = document.getElementById('auditSplash');
  const legal = document.getElementById('auditLegal');
  const consent = document.getElementById('auditConsent');
  const enter = document.getElementById('auditEnter');
  let started = false;
  window.setTimeout(() => {
    splash.hidden = true;
    legal.hidden = false;
    document.getElementById('legalTitle').focus();
  }, 4000);
  consent.addEventListener('change', () => { enter.disabled = !consent.checked; });
  enter.addEventListener('click', () => {
    if (!consent.checked || started || legal.hidden) return;
    started = true;
    legal.hidden = true;
    document.body.classList.remove('awaiting-consent');
    window.scrollTo(0, 0);
    boot();
  });
})();
