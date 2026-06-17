/* ═══════════════════════════════════════════
   ROUTER — All page renderers
   ═══════════════════════════════════════════ */

const Pages = {

  // ── DASHBOARD ──────────────────────────────
  dashboard() {
    const today = new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    const rev = DB.finance_monthly.revenue;
    const totalRev = Object.values(rev).reduce((a,b)=>a+b,0);

    const expiredLicenses = DB.licenses.filter(l=>l.status==='expired').length;
    const pendingLicenses = DB.licenses.filter(l=>l.status==='pending').length;
    const pendingPOs = DB.purchase_orders.filter(p=>p.status==='pending').length;

    return `
    ${UI.pageHeader('Dashboard', today,
      `<button class="btn btn-outline" onclick="App.showPage('daily-updates')"><i class="ti ti-plus"></i> Daily Update</button>
       <button class="btn btn-primary" onclick="App.showPage('patients')"><i class="ti ti-user-plus"></i> New Patient</button>`)}

    <div class="metrics-grid">
      ${UI.metric({label:'Today OPD',       value:'148',            sub:'↑ 12 from yesterday', trend:'up'})}
      ${UI.metric({label:'Beds Occupied',    value:'74/90',          sub:'82% occupancy',       type:'accent'})}
      ${UI.metric({label:'Staff Present',    value:'198/213',        sub:'93% attendance',      type:'success', trend:'up'})}
      ${UI.metric({label:'Pending POs',      value:pendingPOs,       sub:'Awaiting approval',   type:'danger'})}
      ${UI.metric({label:'Monthly Revenue',  value:DB.formatINR(totalRev), sub:'↑ 11.8% vs last month', type:'warning', trend:'up'})}
    </div>

    <div class="grid-2">
      ${UI.card('Today\'s Activity', `
        ${UI.activityItem({icon:'ti-user-check', color:'blue',  title:'Dr. Patel marked attendance — Cardiology', sub:'8:02 AM'})}
        ${UI.activityItem({icon:'ti-file-invoice', color:'green', title:'PO #PO-1042 approved by Chairman', sub:'9:14 AM'})}
        ${UI.activityItem({icon:'ti-user-plus', color:'amber', title:'New hire offer sent — Lab Technician', sub:'10:30 AM'})}
        ${UI.activityItem({icon:'ti-alert-circle', color:'red', title:'ICU bed 7 flagged — maintenance required', sub:'11:05 AM'})}
        ${UI.activityItem({icon:'ti-microscope', color:'blue', title:'Lab report batch processed — 24 samples', sub:'11:45 AM'})}
      `, 'ti-activity')}

      ${UI.card('NMC & License Quick View', `
        ${UI.table({
          headers:[{label:'License'},{label:'Expiry'},{label:'Status'}],
          rows: DB.licenses.slice(0,6).map(l=>[l.name, l.expiry, UI.status(l.status)])
        })}
        <div class="mt-12"><button class="btn btn-outline btn-full" onclick="App.showPage('nmc')"><i class="ti ti-external-link"></i> Manage All Licenses</button></div>
      `, 'ti-certificate')}
    </div>

    <div class="grid-2 mt-16">
      ${UI.card('Ward Occupancy', `
        <div style="display:flex;flex-direction:column;gap:14px">
          ${UI.progressRow('General Ward', 34, 40, 'primary')}
          ${UI.progressRow('ICU / ICCU',   8,  10, 'danger')}
          ${UI.progressRow('Maternity',    12, 20, 'accent')}
          ${UI.progressRow('Pediatrics',   10, 15, 'success')}
          ${UI.progressRow('Orthopedics',  10, 15, 'warning')}
        </div>
      `, 'ti-building-hospital')}

      ${UI.card('Recent Purchase Orders', `
        ${UI.table({
          headers:[{label:'PO No.'},{label:'Vendor'},{label:'Amount'},{label:'Status'}],
          rows: DB.purchase_orders.slice(0,5).map(p=>[
            `<strong>${p.id}</strong>`, p.vendor, DB.formatINR(p.amount), UI.status(p.status)
          ])
        })}
        <div class="mt-12"><button class="btn btn-outline btn-full" onclick="App.showPage('purchase')"><i class="ti ti-external-link"></i> View All POs</button></div>
      `, 'ti-file-invoice')}
    </div>

    ${expiredLicenses > 0 ? `
    <div class="announce-card urgent mt-16">
      <div class="announce-title">🔴 ${expiredLicenses} License(s) Expired — Immediate Action Required</div>
      <div class="announce-body">
        ${DB.licenses.filter(l=>l.status==='expired').map(l=>`<strong>${l.name}</strong> expired ${l.expiry}`).join(', ')}.
        <button class="btn btn-danger btn-sm" onclick="App.showPage('nmc')" style="margin-left:12px">View Licenses</button>
      </div>
    </div>` : ''}`;
  },

  // ── DAILY UPDATES ──────────────────────────
  ['daily-updates']() {
    return `
    ${UI.pageHeader('Daily Updates', 'Hospital-wide operational updates and notices',
      `<button class="btn btn-primary" onclick="Pages.openPostUpdate()"><i class="ti ti-plus"></i> Post Update</button>`)}
    ${DB.announcements.map(a => UI.announceCard(a)).join('')}`;
  },

  // ── ANNOUNCEMENTS ──────────────────────────
  announcements() {
    return `
    ${UI.pageHeader('Announcements', 'Official hospital announcements and circulars',
      `<button class="btn btn-primary" onclick="Pages.openPostUpdate()"><i class="ti ti-plus"></i> Post Announcement</button>`)}
    ${DB.announcements.map(a => UI.announceCard(a)).join('')}`;
  },

  // ── NOTIFICATIONS ──────────────────────────
  notifications() {
    const notifs = [
      {icon:'ti-alert-triangle', color:'red',   title:'Fire NOC expired — urgent renewal needed',     sub:'2 days overdue',    action:`<button class="btn btn-sm btn-danger" onclick="App.showPage('nmc')">Fix Now</button>`},
      {icon:'ti-certificate',    color:'amber',  title:'NMC Accreditation renewal due in 30 days',    sub:'Expires Jan 2026',  action:`<button class="btn btn-sm btn-outline" onclick="App.showPage('nmc')">View</button>`},
      {icon:'ti-file-invoice',   color:'amber',  title:'8 Purchase Orders awaiting approval',         sub:'Oldest: 5 days ago',action:`<button class="btn btn-sm btn-outline" onclick="App.showPage('purchase')">View</button>`},
      {icon:'ti-user-plus',      color:'blue',   title:'5 new hiring applications received',          sub:'Today',             action:`<button class="btn btn-sm btn-outline" onclick="App.showPage('hiring')">View</button>`},
      {icon:'ti-package',        color:'red',    title:'IV Cannula 18G — Out of stock',               sub:'Raise urgent PO',   action:`<button class="btn btn-sm btn-danger" onclick="App.showPage('inventory')">PO</button>`},
    ];
    return `
    ${UI.pageHeader('Notifications', '5 unread notifications')}
    ${UI.card('', notifs.map(n => UI.activityItem(n)).join(''))}`;
  },

  // ── STAFF ──────────────────────────────────
  staff() {
    const doctors  = DB.staff.filter(s=>s.role==='Doctor').length;
    const nurses   = DB.staff.filter(s=>s.role==='Nurse').length;
    const techs    = DB.staff.filter(s=>s.role==='Technician' || s.role==='Pharmacist').length;
    return `
    ${UI.pageHeader('All Staff', 'Doctors, Nurses, Technicians, Admin & Support',
      `<button class="btn btn-outline"><i class="ti ti-download"></i> Export</button>
       <button class="btn btn-primary" onclick="Pages.openAddStaff()"><i class="ti ti-plus"></i> Add Staff</button>`)}

    <div class="metrics-grid">
      ${UI.metric({label:'Total Staff',    value:DB.staff.length+DB.dgroup.length, sub:'All categories'})}
      ${UI.metric({label:'Doctors',        value:doctors,   type:'success'})}
      ${UI.metric({label:'Nurses',         value:nurses,    type:'accent'})}
      ${UI.metric({label:'Technicians',    value:techs,     type:'warning'})}
      ${UI.metric({label:'D Group',        value:DB.dgroup.length, type:''})}
    </div>

    <div class="card">
      <div class="filter-row">
        <div class="search-bar" style="flex:1;max-width:320px"><i class="ti ti-search"></i><input placeholder="Search name, ID or dept..." oninput="Pages.filterStaff(this.value)"></div>
        <select onchange="Pages.filterStaff('')">
          <option>All Roles</option><option>Doctor</option><option>Nurse</option><option>Technician</option><option>Admin</option>
        </select>
      </div>
      <div id="staff-table">
        ${this._staffTable(DB.staff)}
      </div>
    </div>`;
  },
  _staffTable(data) {
    return UI.table({
      headers:[{label:'ID'},{label:'Name'},{label:'Role',hide:true},{label:'Department',hide:true},{label:'Qualification',hide:true},{label:'Join Date',hide:true},{label:'Grade'},{label:'Status'}],
      rows: data.map(s=>[
        `<span class="text-small fw-600">${s.id}</span>`,
        UI.profileChip(s.name),
        `<span class="tag tag-blue">${s.role}</span>`,
        s.dept, s.qual,
        s.join,
        `<span class="tag tag-gray">${s.grade}</span>`,
        UI.status(s.status),
      ]),
      emptyMsg:'No staff found'
    });
  },
  filterStaff(q) {
    const filtered = DB.staff.filter(s => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.id.toLowerCase().includes(q.toLowerCase()) || s.dept.toLowerCase().includes(q.toLowerCase()));
    const el = document.getElementById('staff-table');
    if(el) el.innerHTML = this._staffTable(filtered);
  },

  // ── D GROUP ────────────────────────────────
  dgroup() {
    const present = DB.dgroup.filter(d=>d.status==='present').length;
    const absent  = DB.dgroup.filter(d=>d.status==='absent').length;
    const leave   = DB.dgroup.filter(d=>d.status==='leave').length;
    return `
    ${UI.pageHeader('D Group Staff', 'Housekeeping, Security, Ward Boys, Sweepers & Support',
      `<button class="btn btn-primary" onclick="Pages.openAddDGroup()"><i class="ti ti-plus"></i> Add D Group Staff</button>`)}

    <div class="metrics-grid">
      ${UI.metric({label:'Total D Group', value:DB.dgroup.length, sub:'All categories'})}
      ${UI.metric({label:'Present Today', value:present, type:'success', sub:`${Math.round(present/DB.dgroup.length*100)}% attendance`})}
      ${UI.metric({label:'On Leave',      value:leave,   type:'warning'})}
      ${UI.metric({label:'Absent',        value:absent,  type:'danger'})}
    </div>

    ${UI.card('D Group Staff Register', `
      <div class="filter-row">
        <div class="search-bar" style="flex:1;max-width:300px"><i class="ti ti-search"></i><input placeholder="Search name or ID..."></div>
        <select>
          <option>All Categories</option><option>Ward Boy</option><option>Housekeeping</option>
          <option>Security</option><option>Sweeper</option><option>Kitchen</option><option>Laundry</option>
        </select>
        <select>
          <option>All Shifts</option><option>Morning</option><option>Evening</option><option>Night</option>
        </select>
      </div>
      ${UI.table({
        headers:[{label:'ID'},{label:'Name'},{label:'Category'},{label:'Zone'},{label:'Shift',hide:true},{label:'Join Date',hide:true},{label:'Status'},{label:'Action'}],
        rows: DB.dgroup.map(d=>[
          d.id,
          UI.profileChip(d.name),
          `<span class="tag tag-amber">${d.cat}</span>`,
          d.zone,
          d.shift,
          d.join,
          UI.status(d.status),
          `<button class="btn btn-outline btn-sm">View</button>`
        ])
      })}
    `, 'ti-users')}`;
  },

  // ── CHAIRMAN'S OFFICE ──────────────────────
  chairman() {
    const pendingApprovals = DB.purchase_orders.filter(p=>p.status==='pending').length;
    return `
    ${UI.pageHeader("Chairman's Office", 'Executive directives, approvals & correspondence',
      `<button class="btn btn-primary" onclick="Pages.openAddDirective()"><i class="ti ti-plus"></i> Add Directive</button>`)}

    <div class="grid-2">
      ${UI.card('', `
        <div class="flex-center gap-16 mb-16">
          <div class="avatar avatar-xl primary"><i class="ti ti-crown" style="font-size:28px"></i></div>
          <div>
            <div style="font-size:18px;font-weight:700">${DB.hospital.chairman}</div>
            <div class="text-muted">Chairman & Managing Trustee</div>
            <div style="font-size:12px;color:var(--text3)">${DB.hospital.name}</div>
          </div>
        </div>
        <hr class="divider">
        <div style="display:flex;flex-direction:column;gap:10px">
          <div class="flex-between"><span class="text-muted">Contact</span><span class="text-small">${DB.hospital.phone}</span></div>
          <div class="flex-between"><span class="text-muted">Office Hours</span><span class="text-small">Mon–Sat, 10 AM – 2 PM</span></div>
          <div class="flex-between"><span class="text-muted">Secretary</span><span class="text-small">Mrs. Kavita Desai</span></div>
          <div class="flex-between"><span class="text-muted">Established</span><span class="text-small">${DB.hospital.estd}</span></div>
        </div>
      `)}

      ${UI.card(`Pending Approvals (${pendingApprovals})`, `
        ${DB.purchase_orders.filter(p=>p.status==='pending').map(p=> UI.activityItem({
          icon:'ti-file-invoice', color:'amber',
          title:`${p.id} — ${DB.formatINR(p.amount)} (${p.vendor})`,
          sub:`${p.dept} • ${p.date}`,
          action:`<button class="btn btn-success btn-sm" onclick="Pages.approvePO('${p.id}')">Approve</button>`
        })).join('')}
        ${DB.hiring.filter(j=>j.status==='review').length > 0 ? DB.hiring.filter(j=>j.status==='review').map(j=> UI.activityItem({
          icon:'ti-user-plus', color:'blue',
          title:`Hire Approval — ${j.post} (${j.dept})`,
          sub:`${j.applications} application(s)`,
          action:`<button class="btn btn-success btn-sm">Approve</button>`
        })).join('') : ''}
      `, 'ti-clipboard-check')}
    </div>

    <div class="card mt-16">
      <div class="card-title"><i class="ti ti-message-circle"></i> Chairman Directives</div>
      <div class="timeline">
        ${DB.chairman_directives.map(d=>UI.timelineItem({
          date:`${d.date} — To: ${d.to}`,
          text:`<strong>Directive:</strong> ${d.text}`
        })).join('')}
      </div>
    </div>`;
  },

  approvePO(id) {
    const po = DB.purchase_orders.find(p=>p.id===id);
    if(po){ po.status='approved'; po.approved_by='Chairman'; }
    UI.toast(`${id} approved successfully!`, 'success');
    App.showPage('chairman');
  },

  // ── PURCHASE ORDERS ────────────────────────
  purchase() {
    const pending  = DB.purchase_orders.filter(p=>p.status==='pending').length;
    const approved = DB.purchase_orders.filter(p=>p.status==='approved').length;
    const delivered= DB.purchase_orders.filter(p=>p.status==='delivered').length;
    const rejected = DB.purchase_orders.filter(p=>p.status==='rejected').length;
    const total = DB.purchase_orders.reduce((a,b)=>a+b.amount,0);

    return `
    ${UI.pageHeader('Purchase Orders', 'Procurement, vendors & approval workflow',
      `<button class="btn btn-primary" onclick="Pages.openAddPO()"><i class="ti ti-plus"></i> Create PO</button>`)}

    <div class="metrics-grid">
      ${UI.metric({label:'Total POs',          value:DB.purchase_orders.length})}
      ${UI.metric({label:'Pending Approval',    value:pending,   type:'warning'})}
      ${UI.metric({label:'Approved',            value:approved,  type:'success'})}
      ${UI.metric({label:'Delivered',           value:delivered, type:'info'})}
      ${UI.metric({label:'Rejected',            value:rejected,  type:'danger'})}
    </div>

    ${UI.card('Purchase Order Register', `
      <div class="filter-row">
        <div class="search-bar" style="flex:1;max-width:300px"><i class="ti ti-search"></i><input placeholder="Search PO no. or vendor..."></div>
        <select><option>All Status</option><option>pending</option><option>approved</option><option>delivered</option><option>rejected</option></select>
        <select><option>All Departments</option><option>Lab</option><option>Pharmacy</option><option>OT</option><option>ICU</option><option>Surgery</option></select>
      </div>
      ${UI.table({
        headers:[{label:'PO No.'},{label:'Date'},{label:'Vendor'},{label:'Department',hide:true},{label:'Items',hide:true},{label:'Amount'},{label:'Status'},{label:'Approved By',hide:true},{label:'Actions'}],
        rows: DB.purchase_orders.map(p=>[
          `<strong>${p.id}</strong>`,
          p.date, p.vendor, p.dept,
          p.items,
          DB.formatINR(p.amount),
          UI.status(p.status),
          p.approved_by,
          `<div class="table-actions">
             <button class="btn btn-outline btn-sm">View</button>
             ${p.status==='pending'?`<button class="btn btn-success btn-sm" onclick="Pages.approvePO('${p.id}')">Approve</button>`:''}
           </div>`
        ])
      })}
    `, 'ti-file-invoice')}`;
  },

  // ── NMC & LICENSES ─────────────────────────
  nmc() {
    const active  = DB.licenses.filter(l=>l.status==='active').length;
    const pending = DB.licenses.filter(l=>l.status==='pending').length;
    const expired = DB.licenses.filter(l=>l.status==='expired').length;
    return `
    ${UI.pageHeader('NMC & Licenses', 'Regulatory compliance, certifications & renewal tracking',
      `<button class="btn btn-primary" onclick="Pages.openAddLicense()"><i class="ti ti-plus"></i> Add License</button>`)}

    <div class="metrics-grid">
      ${UI.metric({label:'Active Licenses',     value:active,    type:'success'})}
      ${UI.metric({label:'Renewal Due (90d)',   value:pending,   type:'warning'})}
      ${UI.metric({label:'Expired',             value:expired,   type:'danger'})}
      ${UI.metric({label:'NMC Score',           value:'82%',     sub:'Last audit: Mar 2025'})}
    </div>

    ${expired>0?`<div class="announce-card urgent mb-16">
      <div class="announce-title">🚨 ACTION REQUIRED: ${expired} License(s) Expired</div>
      <div class="announce-body">${DB.licenses.filter(l=>l.status==='expired').map(l=>`<strong>${l.name}</strong> (${l.no}) expired on ${l.expiry}.`).join(' ')}</div>
    </div>`:''}

    ${UI.card('License & Certificate Register', `
      ${UI.table({
        headers:[{label:'License / Certificate'},{label:'Authority',hide:true},{label:'Lic. No.',hide:true},{label:'Issue'},{label:'Expiry'},{label:'Responsible',hide:true},{label:'Status'},{label:'Action'}],
        rows: DB.licenses.map(l=>[
          `<strong>${l.name}</strong>`,
          l.authority, l.no, l.issue, l.expiry, l.responsible,
          UI.status(l.status),
          l.status==='expired' ? `<button class="btn btn-danger btn-sm">Urgent Renew</button>` :
          l.status==='pending' ? `<button class="btn btn-accent btn-sm">Renew</button>` :
          `<button class="btn btn-outline btn-sm">View</button>`
        ])
      })}
    `, 'ti-certificate')}`;
  },

  // ── HIRING & RECRUITMENT ───────────────────
  hiring() {
    const open = DB.hiring.filter(h=>h.status==='open').length;
    const totalApps = DB.applications.length;
    return `
    ${UI.pageHeader('Hiring & Recruitment', 'Job openings, applications & onboarding',
      `<button class="btn btn-primary" onclick="Pages.openAddJob()"><i class="ti ti-plus"></i> Post Job Opening</button>`)}

    <div class="metrics-grid">
      ${UI.metric({label:'Open Positions',    value:open,       type:'success'})}
      ${UI.metric({label:'Total Applications',value:totalApps})}
      ${UI.metric({label:'Interviews Scheduled',value:2,        type:'info'})}
      ${UI.metric({label:'Onboarding Active', value:2,          type:'warning'})}
    </div>

    <div class="card">
      <div class="tabs" id="hiring-tabs">
        <button class="tab active" data-tab="openings">Openings (${DB.hiring.length})</button>
        <button class="tab" data-tab="applications">Applications (${DB.applications.length})</button>
        <button class="tab" data-tab="interviews">Interviews</button>
        <button class="tab" data-tab="onboarding">Onboarding</button>
      </div>

      <div id="panel-openings" class="tab-panel active">
        ${UI.table({
          headers:[{label:'Post'},{label:'Department'},{label:'Type',hide:true},{label:'Vacancies'},{label:'Applications'},{label:'Posted',hide:true},{label:'Status'},{label:'Action'}],
          rows: DB.hiring.map(j=>[
            `<strong>${j.post}</strong>`,
            j.dept,
            `<span class="tag tag-blue">${j.type}</span>`,
            j.vacancies, j.applications, j.posted,
            UI.status(j.status),
            `<button class="btn btn-outline btn-sm">View</button>`
          ])
        })}
      </div>

      <div id="panel-applications" class="tab-panel">
        ${UI.table({
          headers:[{label:'Applicant'},{label:'Applied For'},{label:'Experience',hide:true},{label:'Applied On',hide:true},{label:'Stage'},{label:'Action'}],
          rows: DB.applications.map(a=>[
            UI.profileChip(a.name),
            a.post, a.exp, a.applied,
            UI.status(a.stage),
            `<button class="btn btn-outline btn-sm">View</button>`
          ])
        })}
      </div>

      <div id="panel-interviews" class="tab-panel">
        ${UI.table({
          headers:[{label:'Candidate'},{label:'Post'},{label:'Date & Time'},{label:'Interviewer'},{label:'Status'}],
          rows:[
            ['Sunita Patil','Staff Nurse','15 Jun, 10:00 AM','Dr. Sharma (HoD Nursing)',UI.status('interview')],
            ['Mahesh Kumar','Lab Technician','16 Jun, 11:30 AM','Mr. Desai (Lab Head)',UI.status('pending')],
          ]
        })}
      </div>

      <div id="panel-onboarding" class="tab-panel">
        ${UI.table({
          headers:[{label:'Employee'},{label:'Post'},{label:'Joining Date'},{label:'Documents'},{label:'Status'}],
          rows:[
            ['Vikram Rao','Pharmacist','01 Jun 2025',`<span class="tag tag-green">Complete</span>`,UI.status('active')],
            ['Anita Desai','Ward Nurse','10 Jun 2025',`<span class="tag tag-amber">Pending 2 docs</span>`,UI.status('pending')],
          ]
        })}
      </div>
    </div>`;
  },

  // ── ATTENDANCE ─────────────────────────────
  attendance() {
    const present = [...DB.staff,...DB.dgroup].filter(s=>s.status==='present'||s.status==='active').length;
    const total   = DB.staff.length + DB.dgroup.length;
    return `
    ${UI.pageHeader('Attendance', 'Daily attendance tracking for all staff',
      `<button class="btn btn-outline"><i class="ti ti-download"></i> Export</button>
       <button class="btn btn-primary"><i class="ti ti-plus"></i> Mark Attendance</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Total Staff',   value:total})}
      ${UI.metric({label:'Present Today', value:198, type:'success', sub:'93%'})}
      ${UI.metric({label:'On Leave',      value:9,   type:'warning'})}
      ${UI.metric({label:'Absent',        value:6,   type:'danger'})}
    </div>
    ${UI.card('Today\'s Attendance Log', `
      ${UI.table({
        headers:[{label:'ID'},{label:'Name'},{label:'Role'},{label:'In Time'},{label:'Out Time'},{label:'Status'}],
        rows:[
          ['EMP-001',UI.profileChip('Dr. Arvind Patel'),'Doctor','8:02 AM','—',UI.status('present')],
          ['EMP-002',UI.profileChip('Dr. Sneha Mehta'),'Doctor','8:45 AM','—',UI.status('present')],
          ['EMP-006',UI.profileChip('Nirmala Kamble'),'Nurse','7:30 AM','—',UI.status('present')],
          ['DG-004',UI.profileChip('Rekha More'),'Housekeeping','—','—',UI.status('absent')],
          ['DG-008',UI.profileChip('Meena Jadhav'),'Laundry','—','—',UI.status('leave')],
        ]
      })}
    `, 'ti-clock')}`;
  },

  // ── PAYROLL ────────────────────────────────
  payroll() {
    return `
    ${UI.pageHeader('Payroll', 'Salary processing, slips & payment records',
      `<button class="btn btn-primary" onclick="UI.toast('Payroll processed!','success')"><i class="ti ti-cash"></i> Process Payroll</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Monthly Payroll', value:'₹28.4L', sub:'Total outgo'})}
      ${UI.metric({label:'Paid',            value:196, type:'success'})}
      ${UI.metric({label:'Pending',         value:17,  type:'warning'})}
      ${UI.metric({label:'Employees',       value:DB.staff.length+DB.dgroup.length})}
    </div>
    ${UI.card('Salary Grade Structure', `
      ${UI.table({
        headers:[{label:'Grade'},{label:'Role'},{label:'Basic'},{label:'HRA'},{label:'Allowances',hide:true},{label:'Total CTC'}],
        rows: DB.salary_grades.map(g=>[
          `<span class="tag tag-gray">${g.grade}</span>`,
          g.role,
          `₹${g.basic.toLocaleString('en-IN')}`,
          `₹${g.hra.toLocaleString('en-IN')}`,
          `₹${g.allow.toLocaleString('en-IN')}`,
          `<strong>₹${(g.basic+g.hra+g.allow).toLocaleString('en-IN')}</strong>`,
        ])
      })}
    `, 'ti-cash')}`;
  },

  // ── DEPARTMENTS ────────────────────────────
  departments() {
    return `
    ${UI.pageHeader('Departments', 'Hospital department overview & management')}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px">
      ${DB.departments.map(d=>`
        <div class="dept-card" onclick="UI.toast('${d.name} details coming soon','default')">
          <div class="dept-icon" style="background:${d.color};color:${d.textColor}">
            <i class="ti ${d.icon}"></i>
          </div>
          <div class="dept-name">${d.name}</div>
          <div class="dept-info">${d.doctors>0?d.doctors+' Doctor'+(d.doctors>1?'s':''):''}${d.nurses>0?' · '+d.nurses+' Nurse'+(d.nurses>1?'s':''):''}</div>
          <div class="dept-stat">${d.patients_month.toLocaleString()}</div>
          <div class="dept-stat-label">Patients / tests this month</div>
        </div>`).join('')}
    </div>`;
  },

  // ── PATIENTS ───────────────────────────────
  patients() {
    const admitted   = DB.patients.filter(p=>p.status==='admitted'||p.status==='critical').length;
    const discharged = DB.patients.filter(p=>p.status==='discharged').length;
    return `
    ${UI.pageHeader('Patients', 'Registration, records & patient management',
      `<button class="btn btn-primary" onclick="Pages.openAddPatient()"><i class="ti ti-plus"></i> Register Patient</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Total Registered', value:'12,481'})}
      ${UI.metric({label:'This Month',       value:342, type:'accent'})}
      ${UI.metric({label:'Currently Admitted',value:admitted, type:'success'})}
      ${UI.metric({label:'Today OPD',        value:148, type:'warning'})}
      ${UI.metric({label:'Discharged Today', value:discharged, type:'info'})}
    </div>
    ${UI.card('Patient Register', `
      <div class="filter-row">
        <div class="search-bar" style="flex:1;max-width:320px"><i class="ti ti-search"></i><input placeholder="Search UHID, name or phone..."></div>
        <select><option>All Status</option><option>admitted</option><option>opd</option><option>critical</option><option>discharged</option></select>
      </div>
      ${UI.table({
        headers:[{label:'UHID'},{label:'Patient'},{label:'Age/Sex',hide:true},{label:'Ward'},{label:'Doctor',hide:true},{label:'Admit Date',hide:true},{label:'Status'},{label:'Action'}],
        rows: DB.patients.map(p=>[
          `<strong>${p.uhid}</strong>`,
          UI.profileChip(p.name, p.blood),
          `${p.age}${p.gender}`,
          p.ward, p.doctor, p.admit,
          UI.status(p.status),
          `<button class="btn btn-outline btn-sm">View</button>`
        ])
      })}
    `, 'ti-user-heart')}`;
  },

  // ── BILLING ────────────────────────────────
  billing() {
    const totalCollected = DB.billing.reduce((a,b)=>a+b.paid,0);
    const totalPending   = DB.billing.reduce((a,b)=>a+(b.amount-b.paid),0);
    return `
    ${UI.pageHeader('Billing', 'Patient billing, receipts & payment management',
      `<button class="btn btn-primary" onclick="Pages.openAddBill()"><i class="ti ti-plus"></i> Generate Bill</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Today Collections', value:'₹1.8L', type:'success'})}
      ${UI.metric({label:'Monthly Revenue',   value:DB.formatINR(totalCollected)})}
      ${UI.metric({label:'Pending',           value:DB.formatINR(totalPending), type:'warning'})}
      ${UI.metric({label:'Outstanding (30d)', value:'₹89K', type:'danger'})}
    </div>
    ${UI.card('Billing Register', `
      ${UI.table({
        headers:[{label:'Bill No.'},{label:'Patient'},{label:'Date',hide:true},{label:'Services',hide:true},{label:'Amount'},{label:'Paid'},{label:'Balance'},{label:'Status'}],
        rows: DB.billing.map(b=>[
          `<strong>#${b.id}</strong>`,
          `${b.patient} <span class="text-small" style="color:var(--text3)">${b.uhid}</span>`,
          b.date, b.services,
          `₹${b.amount.toLocaleString('en-IN')}`,
          `₹${b.paid.toLocaleString('en-IN')}`,
          b.amount>b.paid ? `₹${(b.amount-b.paid).toLocaleString('en-IN')}` : '—',
          UI.status(b.status),
        ])
      })}
    `, 'ti-receipt')}`;
  },

  // ── FINANCE REPORTS ────────────────────────
  finance() {
    const rev = DB.finance_monthly.revenue;
    const exp = DB.finance_monthly.expenses;
    const totalRev = Object.values(rev).reduce((a,b)=>a+b,0);
    const totalExp = Object.values(exp).reduce((a,b)=>a+b,0);
    const labels = {opd:'OPD Charges',ipd:'IPD / Admission',lab:'Laboratory',pharmacy:'Pharmacy',radiology:'Radiology',ambulance:'Ambulance'};
    const explabels = {salaries:'Salaries & Wages',medicines:'Medicines',equipment:'Equipment',utilities:'Utilities',maintenance:'Maintenance'};
    return `
    ${UI.pageHeader('Finance Reports', 'Revenue, expenses & financial analytics',
      `<button class="btn btn-outline"><i class="ti ti-download"></i> Download Report</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Monthly Revenue',  value:DB.formatINR(totalRev), type:'success', trend:'up', sub:'↑ 11.8% vs last month'})}
      ${UI.metric({label:'Monthly Expenses', value:DB.formatINR(totalExp), type:'danger'})}
      ${UI.metric({label:'Net Surplus',      value:DB.formatINR(totalRev-totalExp), type:'warning'})}
      ${UI.metric({label:'Pending Dues',     value:'₹3.4L', type:'accent'})}
    </div>
    <div class="grid-2">
      ${UI.card('Revenue Breakdown', `
        ${UI.table({
          headers:[{label:'Head'},{label:'This Month'},{label:'Last Month',hide:true},{label:'Change',hide:true}],
          rows: Object.entries(rev).map(([k,v])=>[
            labels[k]||k,
            `<strong>₹${v.toLocaleString('en-IN')}</strong>`,
            `₹${Math.round(v*0.92).toLocaleString('en-IN')}`,
            `<span style="color:var(--success)">↑ 8%</span>`
          ])
        })}
      `, 'ti-chart-bar')}
      ${UI.card('Expense Breakdown', `
        ${UI.table({
          headers:[{label:'Head'},{label:'Amount'},{label:'% of Total',hide:true}],
          rows: Object.entries(exp).map(([k,v])=>[
            explabels[k]||k,
            `₹${v.toLocaleString('en-IN')}`,
            `${Math.round(v/totalExp*100)}%`
          ])
        })}
      `, 'ti-chart-pie')}
    </div>`;
  },

  // ── INVENTORY ──────────────────────────────
  inventory() {
    const critical = DB.inventory.filter(i=>i.status==='critical').length;
    const low      = DB.inventory.filter(i=>i.status==='low').length;
    const out      = DB.inventory.filter(i=>i.status==='out').length;
    return `
    ${UI.pageHeader('Inventory', 'Medical supplies, equipment & stock management',
      `<button class="btn btn-primary"><i class="ti ti-plus"></i> Add Item</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Total Items',    value:DB.inventory.length + 830})}
      ${UI.metric({label:'Critical Low',   value:critical,  type:'danger'})}
      ${UI.metric({label:'Low Stock',      value:low,       type:'warning'})}
      ${UI.metric({label:'Out of Stock',   value:out,       type:'danger'})}
    </div>
    ${UI.card('Critical Stock Alerts', `
      ${UI.table({
        headers:[{label:'Item'},{label:'Category',hide:true},{label:'Stock'},{label:'Min Level',hide:true},{label:'Status'},{label:'Action'}],
        rows: DB.inventory.map(i=>[
          `<strong>${i.name}</strong>`,
          i.cat,
          `${i.stock} ${i.unit}`,
          `${i.min} ${i.unit}`,
          UI.status(i.status),
          i.status==='out' ? `<button class="btn btn-danger btn-sm" onclick="UI.toast('Urgent PO raised!','success')">URGENT PO</button>` :
          i.status==='critical'||i.status==='low' ? `<button class="btn btn-accent btn-sm" onclick="UI.toast('PO raised!','success')">Raise PO</button>` :
          `<span class="tag tag-green">OK</span>`
        ])
      })}
    `, 'ti-package')}`;
  },

  // ── TENDERS ────────────────────────────────
  tenders() {
    return `
    ${UI.pageHeader('Tenders', 'Hospital tender management & vendor selection',
      `<button class="btn btn-primary" onclick="UI.toast('Tender form coming soon','default')"><i class="ti ti-plus"></i> Float Tender</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Open Tenders',    value:DB.tenders.filter(t=>t.status==='open').length,      type:'success'})}
      ${UI.metric({label:'Under Evaluation',value:DB.tenders.filter(t=>t.status==='evaluation').length,type:'warning'})}
      ${UI.metric({label:'Awarded',         value:DB.tenders.filter(t=>t.status==='awarded').length,   type:'info'})}
    </div>
    ${UI.card('Tender Register', `
      ${UI.table({
        headers:[{label:'Tender ID'},{label:'Title'},{label:'Floated',hide:true},{label:'Deadline'},{label:'Bids',hide:true},{label:'Est. Value'},{label:'Status'}],
        rows: DB.tenders.map(t=>[
          t.id, `<strong>${t.title}</strong>`, t.floated, t.deadline,
          t.bids, DB.formatINR(t.value), UI.status(t.status)
        ])
      })}
    `, 'ti-file-text')}`;
  },

  // ── OPD ────────────────────────────────────
  opd() {
    return `
    ${UI.pageHeader('OPD', 'Outpatient consultation & management',
      `<button class="btn btn-primary" onclick="UI.toast('Token registered!','success')"><i class="ti ti-plus"></i> Register OPD</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Today OPD', value:148})}
      ${UI.metric({label:'In Queue',  value:12, type:'warning'})}
      ${UI.metric({label:'Consulting',value:8,  type:'success'})}
      ${UI.metric({label:'Done',      value:128,type:'info'})}
    </div>
    ${UI.card('OPD Queue', `
      ${UI.table({
        headers:[{label:'Token'},{label:'Patient'},{label:'Age/Sex'},{label:'Doctor'},{label:'Arrived'},{label:'Status'}],
        rows:[
          ['T-001',UI.profileChip('Mohan Desai'),'65M','Dr. Patel','9:00 AM',UI.status('approved')],
          ['T-002',UI.profileChip('Rima Shah'),'32F','Dr. Mehta','9:05 AM',UI.status('active')],
          ['T-003',UI.profileChip('Kiran Patil'),'45M','Dr. Kumar','9:10 AM',UI.status('pending')],
          ['T-004',UI.profileChip('Baby Ananya'),'3F','Dr. Nair','9:12 AM',UI.status('pending')],
        ]
      })}
    `, 'ti-stethoscope')}`;
  },

  // ── IPD ────────────────────────────────────
  ipd() {
    return `
    ${UI.pageHeader('IPD / Wards', 'Inpatient management & bed allocation',
      `<button class="btn btn-primary" onclick="UI.toast('Patient admitted!','success')"><i class="ti ti-plus"></i> Admit Patient</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Total Beds',    value:90})}
      ${UI.metric({label:'Occupied',      value:74, type:'danger', sub:'82%'})}
      ${UI.metric({label:'Available',     value:16, type:'success'})}
      ${UI.metric({label:'ICU Beds',      value:'8/10', type:'warning'})}
    </div>
    <div class="grid-2">
      ${UI.card('Current Inpatients', `
        ${UI.table({
          headers:[{label:'UHID'},{label:'Patient'},{label:'Ward'},{label:'Doctor'},{label:'Status'}],
          rows: DB.patients.filter(p=>p.status==='admitted'||p.status==='critical').map(p=>[
            p.uhid, UI.profileChip(p.name), p.ward, p.doctor, UI.status(p.status)
          ])
        })}
      `, 'ti-bed')}
      ${UI.card('Ward Occupancy', `
        <div style="display:flex;flex-direction:column;gap:14px">
          ${UI.progressRow('General Ward', 34, 40, 'primary')}
          ${UI.progressRow('ICU / ICCU',   8,  10, 'danger')}
          ${UI.progressRow('Maternity',    12, 20, 'accent')}
          ${UI.progressRow('Pediatrics',   10, 15, 'success')}
          ${UI.progressRow('Orthopedics',  10, 15, 'warning')}
        </div>
      `, 'ti-building-hospital')}
    </div>`;
  },

  // ── LAB ────────────────────────────────────
  lab() {
    return `
    ${UI.pageHeader('Laboratory', 'Test orders, results & sample tracking',
      `<button class="btn btn-primary" onclick="UI.toast('Test order created!','success')"><i class="ti ti-plus"></i> New Test Order</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Tests Today',   value:86})}
      ${UI.metric({label:'Pending',       value:14, type:'warning'})}
      ${UI.metric({label:'Results Ready', value:72, type:'success'})}
      ${UI.metric({label:'This Month',    value:284})}
    </div>
    ${UI.card('Recent Lab Orders', `
      ${UI.table({
        headers:[{label:'Order ID'},{label:'Patient'},{label:'Test'},{label:'Sample Time',hide:true},{label:'Status'}],
        rows:[
          ['LAB-2241',UI.profileChip('Ramabai Jadhav'),'CBC + LFT','9:30 AM',UI.status('approved')],
          ['LAB-2242',UI.profileChip('Suresh Nikam'),'ABG, Troponin, D-Dimer','10:00 AM',UI.status('pending')],
          ['LAB-2243',UI.profileChip('Priya Sharma'),'HbsAg, HIV, Blood Group','10:20 AM',UI.status('active')],
          ['LAB-2244',UI.profileChip('Ajay Kulkarni'),'CBC, MP, Widal','11:00 AM',UI.status('pending')],
        ]
      })}
    `, 'ti-microscope')}`;
  },

  // ── PHARMACY ───────────────────────────────
  pharmacy() {
    return `
    ${UI.pageHeader('Pharmacy', 'Prescription dispensing & stock management',
      `<button class="btn btn-primary" onclick="UI.toast('Dispensed!','success')"><i class="ti ti-plus"></i> Dispense</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Today Dispensed',value:124})}
      ${UI.metric({label:'Prescriptions',  value:148})}
      ${UI.metric({label:'Low Stock',      value:3,  type:'warning'})}
      ${UI.metric({label:'Out of Stock',   value:1,  type:'danger'})}
    </div>
    ${UI.card('Recent Dispensing', `
      ${UI.table({
        headers:[{label:'Rx ID'},{label:'Patient'},{label:'Doctor'},{label:'Drugs'},{label:'Status'}],
        rows:[
          ['RX-8821',UI.profileChip('Mohan Desai'),'Dr. Patel','Amoxicillin 500mg x 10, Paracetamol x 5',UI.status('active')],
          ['RX-8822',UI.profileChip('Ramabai Jadhav'),'Dr. Patel','Metformin 500mg x 30',UI.status('approved')],
          ['RX-8823',UI.profileChip('Priya Sharma'),'Dr. Mehta','Iron Folic x 30, Calcium x 30',UI.status('active')],
        ]
      })}
    `, 'ti-pill')}`;
  },

  // ── APPOINTMENTS ───────────────────────────
  appointments() {
    return `
    ${UI.pageHeader('Appointments', 'Doctor appointment scheduling',
      `<button class="btn btn-primary" onclick="UI.toast('Appointment booked!','success')"><i class="ti ti-plus"></i> New Appointment</button>`)}
    <div class="metrics-grid">
      ${UI.metric({label:'Today',    value:62})}
      ${UI.metric({label:'Pending',  value:18, type:'warning'})}
      ${UI.metric({label:'Confirmed',value:44, type:'success'})}
      ${UI.metric({label:'This Week',value:210})}
    </div>
    ${UI.card('Today\'s Appointments', `
      ${UI.table({
        headers:[{label:'Time'},{label:'Patient'},{label:'Doctor'},{label:'Department'},{label:'Status'},{label:'Action'}],
        rows:[
          ['9:00 AM',UI.profileChip('Mohan Desai'),'Dr. Patel','Cardiology',UI.status('approved'),`<button class="btn btn-outline btn-sm">Attend</button>`],
          ['10:00 AM',UI.profileChip('Rima Shah'),'Dr. Mehta','Gynecology',UI.status('pending'),`<button class="btn btn-outline btn-sm">Confirm</button>`],
          ['11:30 AM',UI.profileChip('Kiran Patil'),'Dr. Kumar','Surgery',UI.status('approved'),`<button class="btn btn-outline btn-sm">Attend</button>`],
          ['2:00 PM',UI.profileChip('Baby Ananya'),'Dr. Nair','Pediatrics',UI.status('pending'),`<button class="btn btn-outline btn-sm">Confirm</button>`],
        ]
      })}
    `, 'ti-calendar-check')}`;
  },

  // ── AUDIT LOG ──────────────────────────────
  audit() {
    return `
    ${UI.pageHeader('Audit Logs', 'System activity & compliance audit trail',
      `<button class="btn btn-outline"><i class="ti ti-download"></i> Export</button>`)}
    ${UI.card('Recent System Activity', `
      <div class="timeline">
        ${DB.audit_log.map(a=>UI.timelineItem({date:`${a.time} — by ${a.user}`, text:a.action})).join('')}
      </div>
    `, 'ti-clipboard-check')}`;
  },

  // ── DOCUMENTS ──────────────────────────────
  documents() {
    const docs = [
      {name:'Hospital Registration Certificate', type:'PDF', size:'1.2 MB', date:'Apr 2023'},
      {name:'NMC Accreditation Document',         type:'PDF', size:'3.4 MB', date:'Jan 2022'},
      {name:'NABL Lab Accreditation',             type:'PDF', size:'2.1 MB', date:'Nov 2023'},
      {name:'HR Policy Manual 2025',              type:'DOCX',size:'850 KB', date:'Jun 2025'},
      {name:'Bio-Medical Waste License',          type:'PDF', size:'620 KB', date:'Aug 2022'},
      {name:'Pharmacy License KAR',               type:'PDF', size:'490 KB', date:'Jun 2023'},
      {name:'Fire Safety Audit Report',           type:'PDF', size:'1.8 MB', date:'Dec 2022'},
    ];
    return `
    ${UI.pageHeader('Documents', 'Hospital policies, legal docs & certificates',
      `<button class="btn btn-primary" onclick="UI.toast('Upload ready','default')"><i class="ti ti-upload"></i> Upload</button>`)}
    ${UI.card('Document Vault', `
      <div class="filter-row">
        <div class="search-bar" style="flex:1;max-width:300px"><i class="ti ti-search"></i><input placeholder="Search documents..."></div>
        <select><option>All Types</option><option>PDF</option><option>DOCX</option><option>XLSX</option></select>
      </div>
      ${UI.table({
        headers:[{label:'Document Name'},{label:'Type'},{label:'Size',hide:true},{label:'Date',hide:true},{label:'Action'}],
        rows: docs.map(d=>[
          `<div class="flex-center gap-8"><i class="ti ${d.type==='PDF'?'ti-file-type-pdf':'ti-file-type-doc'}" style="font-size:20px;color:${d.type==='PDF'?'#e74c3c':'#2980b9'}"></i>${d.name}</div>`,
          `<span class="tag tag-gray">${d.type}</span>`,
          d.size, d.date,
          `<div class="table-actions"><button class="btn btn-outline btn-sm"><i class="ti ti-eye"></i></button><button class="btn btn-outline btn-sm"><i class="ti ti-download"></i></button></div>`
        ])
      })}
    `, 'ti-folder')}`;
  },

  // ── SETTINGS ───────────────────────────────
  settings() {
    return `
    ${UI.pageHeader('Settings', 'Hospital configuration & system preferences')}
    <div class="grid-2">
      ${UI.card('Hospital Information', `
        <div class="form-group"><label>Hospital Name</label><input type="text" value="${DB.hospital.name}"></div>
        <div class="form-group"><label>Location</label><input type="text" value="${DB.hospital.location}"></div>
        <div class="form-group"><label>Registration Number</label><input type="text" value="${DB.hospital.reg_no}"></div>
        <div class="form-group"><label>Contact Number</label><input type="text" value="${DB.hospital.phone}"></div>
        <div class="form-group"><label>Email</label><input type="email" value="${DB.hospital.email}"></div>
        <div class="form-group"><label>Total Beds</label><input type="number" value="${DB.hospital.beds}"></div>
        <button class="btn btn-primary" onclick="UI.toast('Settings saved!','success')"><i class="ti ti-device-floppy"></i> Save Changes</button>
      `)}
      ${UI.card('Access & Security', `
        <div class="form-group"><label>Session Timeout (minutes)</label><input type="number" value="30"></div>
        <div class="form-group"><label>Two-Factor Authentication</label>
          <select><option>Enabled (All Admins)</option><option>Enabled (Super Admin Only)</option><option>Disabled</option></select>
        </div>
        <div class="form-group"><label>Audit Log Retention (days)</label><input type="number" value="365"></div>
        <div class="form-group"><label>Max Login Attempts</label><input type="number" value="5"></div>
        <button class="btn btn-primary" onclick="UI.toast('Security updated!','success')"><i class="ti ti-lock"></i> Update Security</button>
      `)}
    </div>`;
  },

  // ── ROLES & ACCESS ─────────────────────────
  roles() {
    const ✓ = `<span style="color:var(--success);font-size:16px">✅</span>`;
    const ✗ = `<span style="color:var(--text3);font-size:16px">—</span>`;
    const ⚡ = (s) => `<span class="tag tag-amber">${s}</span>`;
    return `
    ${UI.pageHeader('Roles & Access Control', 'Manage permissions from D Group to Chairman',
      `<button class="btn btn-primary" onclick="UI.toast('Add user form coming soon','default')"><i class="ti ti-plus"></i> Add User</button>`)}
    ${UI.card('Permission Matrix', `
      ${UI.table({
        headers:[{label:'Role'},{label:'Users'},{label:'Dashboard'},{label:'PO Access',hide:true},{label:'Hiring'},{label:'Finance',hide:true},{label:'Chairman'},{label:'NMC'}],
        rows:[
          ['<strong>Chairman</strong>',          '1', ✓,       ✓,             ✓,              ✓,  ✓, ✓],
          ['<strong>CEO / Director</strong>',    '1', ✓,       ✓,             ✓,              ⚡('View'), ✓, ✓],
          ['<strong>Medical Superintendent</strong>','1', ✓,   ⚡('Dept Only'),⚡('Medical'),  ✗,  ✗, ✓],
          ['<strong>HOD</strong>',               '9', ✓,       ⚡('Raise'),   ⚡('Recommend'), ✗,  ✗, ⚡('View')],
          ['<strong>HR Manager</strong>',        '2', ✓,       ✗,             ✓,              ⚡('Salary'), ✗, ✗],
          ['<strong>Finance Officer</strong>',   '3', ✓,       ⚡('Process'), ✗,              ✓,  ✗, ✗],
          ['<strong>Reception / Clerk</strong>', '12',✓,       ✗,             ✗,              ✗,  ✗, ✗],
          ['<strong>D Group Staff</strong>',     '48',✗,       ✗,             ✗,              ✗,  ✗, ✗],
        ]
      })}
    `, 'ti-lock')}`;
  },

  // ── MODAL FORMS ─────────────────────────────
  openAddPO() {
    UI.modal({id:'modal-po', title:'Create Purchase Order', body:`
      <div class="form-row">
        ${UI.field('PO Date',      UI.input('po_date','date'))}
        ${UI.field('Department',   UI.select('dept',['Pharmacy','Lab','OT','ICU','Surgery','Housekeeping']))}
      </div>
      ${UI.field('Vendor Name',    UI.input('vendor','text','Vendor company name'))}
      <div class="form-row">
        ${UI.field('Vendor Contact',UI.input('contact','tel'))}
        ${UI.field('Expected Delivery',UI.input('delivery','date'))}
      </div>
      ${UI.field('Items (one per line)',UI.textarea('items','Item name — Qty — Unit Price',4))}
      <div class="form-row">
        ${UI.field('Total Amount (₹)',  UI.input('amount','number','0'))}
        ${UI.field('Priority',         UI.select('priority',['Normal','Urgent','Critical']))}
      </div>
      ${UI.field('Remarks / Justification', UI.textarea('remarks','Reason for purchase...',2))}
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-po')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('PO submitted for approval!','success');UI.closeModal('modal-po')"><i class="ti ti-send"></i> Submit for Approval</button>
      </div>
    `});
  },

  openAddJob() {
    UI.modal({id:'modal-job', title:'Post Job Opening', body:`
      ${UI.field('Post / Position',    UI.input('post','text','e.g. Staff Nurse'))}
      <div class="form-row">
        ${UI.field('Department',       UI.select('dept',['General Ward','ICU','Pharmacy','Lab','D Group','Admin']))}
        ${UI.field('Type',             UI.select('type',['Full Time','Part Time','Contract']))}
      </div>
      <div class="form-row">
        ${UI.field('Vacancies',        UI.input('vacancies','number','1','1'))}
        ${UI.field('Salary Range',     UI.input('salary','text','e.g. ₹25,000 – ₹35,000'))}
      </div>
      ${UI.field('Qualification Required', UI.input('qual','text','e.g. BSc Nursing, 2 yrs exp'))}
      ${UI.field('Job Description',        UI.textarea('jd','Duties, requirements...',3))}
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-job')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('Job posted successfully!','success');UI.closeModal('modal-job')">Post Opening</button>
      </div>
    `});
  },

  openAddLicense() {
    UI.modal({id:'modal-lic', title:'Add License / Certificate', body:`
      ${UI.field('License / Certificate Name', UI.input('lic_name','text'))}
      <div class="form-row">
        ${UI.field('Issuing Authority',         UI.input('authority','text'))}
        ${UI.field('License Number',            UI.input('lic_no','text'))}
      </div>
      <div class="form-row">
        ${UI.field('Issue Date',   UI.input('issue','date'))}
        ${UI.field('Expiry Date',  UI.input('expiry','date'))}
      </div>
      ${UI.field('Responsible Person', UI.input('responsible','text'))}
      ${UI.field('Upload Document (PDF)', `<input type="file" accept=".pdf,.jpg,.png">`)}
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-lic')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('License saved!','success');UI.closeModal('modal-lic')">Save License</button>
      </div>
    `});
  },

  openAddDirective() {
    UI.modal({id:'modal-dir', title:'Add Chairman Directive', body:`
      ${UI.field('Date',              UI.input('dir_date','date'))}
      ${UI.field('Directive / Note',  UI.textarea('dir_text','Write directive here...',4))}
      ${UI.field('Addressed To',      UI.select('dir_to',['All HODs','CEO','HR Manager','Finance','All Staff','Admin']))}
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-dir')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('Directive saved!','success');UI.closeModal('modal-dir')">Save Directive</button>
      </div>
    `});
  },

  openPostUpdate() {
    UI.modal({id:'modal-update', title:'Post Daily Update / Announcement', body:`
      ${UI.field('Title',      UI.input('update_title','text','Update heading...'))}
      <div class="form-row">
        ${UI.field('Category', UI.select('update_cat',['General','Urgent','HR','Inventory','Equipment','Facilities']))}
        ${UI.field('Visible To',UI.select('visible',['All Staff','Doctors Only','Nurses Only','Admin Only','D Group']))}
      </div>
      ${UI.field('Message',    UI.textarea('update_msg','Detailed update message...',4))}
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-update')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('Update posted!','success');UI.closeModal('modal-update')">Post Update</button>
      </div>
    `});
  },

  openAddStaff() {
    UI.modal({id:'modal-staff', title:'Add Staff Member', body:`
      <div class="form-row">
        ${UI.field('First Name',  UI.input('fname','text'))}
        ${UI.field('Last Name',   UI.input('lname','text'))}
      </div>
      <div class="form-row">
        ${UI.field('Role',        UI.select('role',['Doctor','Nurse','Technician','Admin','Pharmacist']))}
        ${UI.field('Department',  UI.select('dept',['General Ward','ICU','Cardiology','Surgery','Lab','Pharmacy','Admin']))}
      </div>
      <div class="form-row">
        ${UI.field('Phone',       UI.input('phone','tel'))}
        ${UI.field('Joining Date',UI.input('jdate','date'))}
      </div>
      ${UI.field('Qualification', UI.input('qual','text','e.g. MBBS, MD, BSc Nursing'))}
      ${UI.field('Salary Grade',  UI.select('grade',['A1','A2','B1','B2','C1','C2','D1','D2']))}
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-staff')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('Staff added!','success');UI.closeModal('modal-staff')">Add Staff</button>
      </div>
    `});
  },

  openAddDGroup() {
    UI.modal({id:'modal-dg', title:'Add D Group Staff', body:`
      <div class="form-row">
        ${UI.field('Full Name',   UI.input('dg_name','text'))}
        ${UI.field('Date of Birth',UI.input('dg_dob','date'))}
      </div>
      <div class="form-row">
        ${UI.field('Category',    UI.select('dg_cat',['Ward Boy','Housekeeping','Security','Sweeper','Kitchen','Laundry','Gardener']))}
        ${UI.field('Zone / Area', UI.input('dg_zone','text','e.g. OPD Block, ICU Wing'))}
      </div>
      <div class="form-row">
        ${UI.field('Shift',       UI.select('dg_shift',['Morning (6AM–2PM)','Afternoon (2PM–10PM)','Night (10PM–6AM)']))}
        ${UI.field('Joining Date',UI.input('dg_join','date'))}
      </div>
      <div class="form-row">
        ${UI.field('Phone',       UI.input('dg_phone','tel'))}
        ${UI.field('Aadhaar No.', UI.input('dg_aad','text'))}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-dg')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('D Group staff added!','success');UI.closeModal('modal-dg')">Add Staff</button>
      </div>
    `});
  },

  openAddPatient() {
    UI.modal({id:'modal-patient', title:'Register New Patient', body:`
      <div class="form-row">
        ${UI.field('Full Name',    UI.input('p_name','text'))}
        ${UI.field('Date of Birth',UI.input('p_dob','date'))}
      </div>
      <div class="form-row">
        ${UI.field('Gender',       UI.select('p_gender',['Male','Female','Other']))}
        ${UI.field('Blood Group',  UI.select('p_blood',['A+','A-','B+','B-','O+','O-','AB+','AB-']))}
      </div>
      <div class="form-row">
        ${UI.field('Phone',        UI.input('p_phone','tel'))}
        ${UI.field('Aadhaar No.',  UI.input('p_aad','text'))}
      </div>
      ${UI.field('Address',        UI.textarea('p_addr','Full address...',2))}
      <div class="form-row">
        ${UI.field('Visit Type',   UI.select('p_vtype',['OPD','IPD Admission','Emergency']))}
        ${UI.field('Doctor',       UI.select('p_doctor',['Dr. Arvind Patel','Dr. Sneha Mehta','Dr. Rajan Kumar','Dr. Priya Nair','Dr. Amit Joshi']))}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-patient')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('Patient registered!','success');UI.closeModal('modal-patient')">Register Patient</button>
      </div>
    `});
  },

  openAddBill() {
    UI.modal({id:'modal-bill', title:'Generate Bill', body:`
      ${UI.field('Patient UHID / Name', UI.input('b_patient','text','Search patient...'))}
      ${UI.field('Services',            UI.textarea('b_services','OPD, Lab tests, Medicines (one per line)',3))}
      <div class="form-row">
        ${UI.field('Total Amount (₹)',  UI.input('b_amount','number','0'))}
        ${UI.field('Amount Paid (₹)',   UI.input('b_paid','number','0'))}
      </div>
      ${UI.field('Payment Mode',        UI.select('b_mode',['Cash','UPI / QR','Card','Insurance','NEFT/RTGS']))}
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="UI.closeModal('modal-bill')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.toast('Bill generated!','success');UI.closeModal('modal-bill')">Generate Bill</button>
      </div>
    `});
  },
};
