'use strict';
(() => {
 const form = document.getElementById('service-enquiry-form');
 if (!form) return;
 const el = id => document.getElementById(id);
 const make = () => {
  const subject = 'Micro Tools Studio scope enquiry — ' + el('enquiry-service').value;
  const body = 'Service: ' + el('enquiry-service').value + '\nBusiness / website: ' + el('enquiry-business').value.trim() + '\n\nDesired result:\n' + el('enquiry-goal').value.trim() + '\n\nVolume, sources and permissions:\n' + el('enquiry-inputs').value.trim() + '\n\nPreferred deadline / timezone: ' + el('enquiry-deadline').value.trim() + '\n\nPlease confirm suitability, availability and a written scope before quoting.';
  return { subject, body, text: 'To: sean@microtoolsstudio.com\nSubject: ' + subject + '\n\n' + body };
 };
 const show = draft => { el('enquiry-copy-panel').hidden = false; el('enquiry-copy').value = draft.text; };
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const draft = make(); show(draft);
  location.href = 'mailto:sean@microtoolsstudio.com?subject=' + encodeURIComponent(draft.subject) + '&body=' + encodeURIComponent(draft.body);
  el('enquiry-status').textContent = 'Your email app should open with a draft. Nothing has been sent. If it does not open, copy the enquiry below into your email service.';
 });
 el('copy-enquiry').addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  const draft = make(); show(draft);
  try {
   await navigator.clipboard.writeText(draft.text);
   el('enquiry-status').textContent = 'Copied. Paste into your email service and send to sean@microtoolsstudio.com.';
  } catch {
   el('enquiry-copy').focus(); el('enquiry-copy').select();
   el('enquiry-status').textContent = 'Automatic copying is unavailable. Copy the selected enquiry below and paste it into your email service.';
  }
 });
 for (const event of ['input', 'change']) form.addEventListener(event, () => {
  if (!el('enquiry-copy-panel').hidden) show(make());
  el('enquiry-status').textContent = '';
 });
})();
