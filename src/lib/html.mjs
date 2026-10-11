// Mini template tag: everything interpolated is HTML-escaped unless wrapped in raw().
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
export const raw = (s) => new Raw(String(s));
export const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ESC[c]);
const val = (v) => (v == null || v === false ? '' : v instanceof Raw ? v.s : Array.isArray(v) ? v.map(val).join('') : esc(v));
export const html = (strings, ...vals) =>
  new Raw(strings.reduce((out, s, i) => out + s + (i < vals.length ? val(vals[i]) : ''), ''));
