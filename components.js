/* ═══════════════════════════════════════════
   COMPONENTS — Reusable UI builders
   ═══════════════════════════════════════════ */

const UI = {

  // ── Toast ──────────────────────────────────
  toast(message, type = 'default', duration = 3000) {
    const icons = { success:'ti-check', error:'ti-x', warning:'ti-alert-triangle', default:'ti-info-circle' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="ti ${icons[type] || icons.default}"></i> ${message}`;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.remove(), duration);
  },

  // ── Modal ──────────────────────────────────
  modal({ id, title, body, size = '', onClose }) {
    const existing = document.getElementById(id);
    if(existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal ${size}" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">${body}</div>
      </div>`;

    overlay.querySelector('.modal-close').onclick = () => this.closeModal(id, onClose);
    overlay.addEventListener('click', e => { if(e.target === overlay) this.closeModal(id, onClose); });
    document.getElementById('modal-container').appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));
    return overlay;
  },

  closeModal(id, onClose) {
    const el = document.getElementById(id);
    if(el) el.remove();
    if(onClose) onClose();
  },

  // ── Status Badge ────────────────────────────
  status(s) {
    const map = {
      active:'status-active',   present:'status-active',   paid:'status-approved',
      approved:'status-approved', delivered:'status-approved', open:'status-active',
      pending:'status-pending',  review:'status-pending',   shortlisted:'status-pending',
      partial:'status-pending',  leave:'status-pending',
      inactive:'status-inactive', absent:'status-inactive', rejected:'status-inactive',
      expired:'status-inactive', out:'status-inactive',     critical:'status-inactive',
      discharged:'status-info',  opd:'status-info',         interview:'status-active',
      awarded:'status-approved', evaluation:'status-pending',
    };
    const label = { active:'Active', present:'Present', paid:'Paid', approved:'Approved',
      delivered:'Delivered', open:'Open', pending:'Pending', review:'Under Review',
      shortlisted:'Shortlisted', partial:'Partial', leave:'On Leave',
      inactive:'Inactive', absent:'Absent', rejected:'Rejected', expired:'Expired',
      out:'Out of Stock', critical:'Critical', discharged:'Discharged', opd:'OPD',
      interview:'Interview', awarded:'Awarded', evaluation:'Evaluation',
    };
    return `<span class="status ${map[s] || 'status-pending'}">${label[s] || s}</span>`;
  },

  // ── Avatar ──────────────────────────────────
  avatar(name, size = 'md') {
    const color = DB.avatarColor(name);
    const initials = DB.initials(name);
    return `<div class="avatar avatar-${size} ${color}">${initials}</div>`;
  },

  // ── Profile Chip ────────────────────────────
  profileChip(name, sub = '') {
    return `<div class="profile-chip">
      ${this.avatar(name,'sm')}
      <div>
        <div class="profile-chip-name">${name}</div>
        ${sub ? `<div class="profile-chip-sub">${sub}</div>` : ''}
      </div>
    </div>`;
  },

  // ── Metric Card ─────────────────────────────
  metric({ label, value, sub = '', type = '', trend = '' }) {
    const trendClass = trend === 'up' ? 'up' : trend === 'down' ? 'down' : '';
    return `<div class="metric-card ${type}">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
      ${sub ? `<div class="metric-sub ${trendClass}">${sub}</div>` : ''}
    </div>`;
  },

  // ── Table ───────────────────────────────────
  table({ headers, rows, emptyMsg = 'No records found' }) {
    if(!rows.length) return `<div class="empty-state"><i class="ti ti-database-off"></i><h4>${emptyMsg}</h4></div>`;
    return `<div class="table-wrap"><table>
      <thead><tr>${headers.map(h => `<th${h.hide ? ' class="hide-xs"':''}>` + h.label + '</th>').join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map((c,i) => `<td${headers[i]?.hide?' class="hide-xs"':''}>` + c + '</td>').join('')}</tr>`).join('')}</tbody>
    </table></div>`;
  },

  // ── Progress Row ────────────────────────────
  progressRow(label, value, max, color = 'primary') {
    const pct = Math.round((value/max)*100);
    return `<div>
      <div class="flex-between mb-8">
        <span class="text-small">${label}</span>
        <span class="text-small fw-600">${value}/${max}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill ${color}" style="width:${pct}%"></div></div>
    </div>`;
  },

  // ── Form Field ──────────────────────────────
  field(label, input) {
    return `<div class="form-group"><label>${label}</label>${input}</div>`;
  },
  input(name, type = 'text', placeholder = '', value = '') {
    return `<input type="${type}" name="${name}" placeholder="${placeholder}" value="${value}" />`;
  },
  select(name, options, selected = '') {
    const opts = options.map(o => {
      const v = typeof o === 'string' ? o : o.value;
      const l = typeof o === 'string' ? o : o.label;
      return `<option value="${v}"${v===selected?' selected':''}>${l}</option>`;
    }).join('');
    return `<select name="${name}">${opts}</select>`;
  },
  textarea(name, placeholder = '', rows = 3) {
    return `<textarea name="${name}" rows="${rows}" placeholder="${placeholder}"></textarea>`;
  },

  // ── Section divider ─────────────────────────
  divider() { return '<hr class="divider">'; },

  // ── Page Header ─────────────────────────────
  pageHeader(title, subtitle, actions = '') {
    document.getElementById('topbar-title').textContent = title;
    return `<div class="page-header">
      <div class="page-header-left">
        <h2>${title}</h2>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>
      ${actions ? `<div class="page-header-right">${actions}</div>` : ''}
    </div>`;
  },

  // ── Card ────────────────────────────────────
  card(title, content, icon = '') {
    return `<div class="card">
      ${title ? `<div class="card-title">${icon?`<i class="ti ${icon}"></i>`:''}${title}</div>` : ''}
      ${content}
    </div>`;
  },

  // ── Announce Card ───────────────────────────
  announceCard({ title, type, author, date, body }) {
    const typeTag = { urgent:`<span class="tag tag-red">Urgent</span>`, success:`<span class="tag tag-green">Update</span>`,
                      info:`<span class="tag tag-blue">Info</span>`,    warning:`<span class="tag tag-amber">Alert</span>` };
    const emoji   = { urgent:'🔴', success:'✅', info:'📋', warning:'⚠️' };
    return `<div class="announce-card ${type}">
      <div class="announce-title">${emoji[type]||''} ${title}</div>
      <div class="announce-meta">
        <span>By: ${author}</span><span>${date}</span>${typeTag[type]||''}
      </div>
      <div class="announce-body">${body}</div>
    </div>`;
  },

  // ── Activity Item ───────────────────────────
  activityItem({ icon, color, title, sub, action = '' }) {
    return `<div class="activity-item">
      <div class="activity-icon ${color}"><i class="ti ${icon}"></i></div>
      <div class="activity-body"><p>${title}</p><span>${sub}</span></div>
      ${action}
    </div>`;
  },

  // ── Timeline Item ───────────────────────────
  timelineItem({ date, text }) {
    return `<div class="timeline-item">
      <div class="timeline-date">${date}</div>
      <div class="timeline-text">${text}</div>
    </div>`;
  },

  // ── Tabs Builder ────────────────────────────
  tabs(tabs, activeId) {
    const tabBtns  = tabs.map(t => `<button class="tab${t.id===activeId?' active':''}" data-tab="${t.id}">${t.label}${t.badge?` (${t.badge})`:''}</button>`).join('');
    return `<div class="tabs">${tabBtns}</div>`;
  },

  initTabs(container) {
    container.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.tab;
        container.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b===btn));
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id===`panel-${id}`));
      });
    });
  },
};
