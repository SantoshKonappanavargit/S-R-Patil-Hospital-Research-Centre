/* ═══════════════════════════════════════════
   NAV — Sidebar navigation builder
   ═══════════════════════════════════════════ */

const NAV_STRUCTURE = [
  {
    label: "Overview",
    items: [
      { id:"dashboard",     icon:"ti-layout-dashboard", label:"Dashboard"         },
      { id:"daily-updates", icon:"ti-calendar-event",   label:"Daily Updates",   badge:"3",  badgeColor:"red" },
      { id:"announcements", icon:"ti-speakerphone",     label:"Announcements"    },
      { id:"notifications", icon:"ti-bell",             label:"Notifications",   badge:"5",  badgeColor:"red" },
    ]
  },
  {
    label: "Staff & HR",
    items: [
      { id:"staff",       icon:"ti-users",     label:"All Staff"              },
      { id:"hiring",      icon:"ti-user-plus", label:"Hiring & Recruitment",  badge:"5",  badgeColor:"green" },
      { id:"dgroup",      icon:"ti-tool",      label:"D Group Staff"          },
      { id:"attendance",  icon:"ti-clock",     label:"Attendance"             },
      { id:"payroll",     icon:"ti-cash",      label:"Payroll"                },
    ]
  },
  {
    label: "Administration",
    items: [
      { id:"chairman",  icon:"ti-crown",            label:"Chairman's Office"  },
      { id:"purchase",  icon:"ti-file-invoice",     label:"Purchase Orders",  badge:"8",  badgeColor:"amber" },
      { id:"nmc",       icon:"ti-certificate",      label:"NMC & Licenses",   badge:"1",  badgeColor:"red"   },
      { id:"tenders",   icon:"ti-file-text",        label:"Tenders"           },
      { id:"departments",icon:"ti-building-hospital",label:"Departments"      },
    ]
  },
  {
    label: "Patient Services",
    items: [
      { id:"patients",      icon:"ti-user-heart",       label:"Patients"       },
      { id:"opd",           icon:"ti-stethoscope",      label:"OPD"            },
      { id:"ipd",           icon:"ti-bed",              label:"IPD / Wards"    },
      { id:"appointments",  icon:"ti-calendar-check",   label:"Appointments"   },
      { id:"lab",           icon:"ti-microscope",       label:"Laboratory"     },
      { id:"pharmacy",      icon:"ti-pill",             label:"Pharmacy"       },
    ]
  },
  {
    label: "Finance",
    items: [
      { id:"billing",   icon:"ti-receipt",   label:"Billing"        },
      { id:"finance",   icon:"ti-chart-bar", label:"Finance Reports" },
    ]
  },
  {
    label: "Compliance & Docs",
    items: [
      { id:"audit",     icon:"ti-clipboard-check", label:"Audit Logs"  },
      { id:"documents", icon:"ti-folder",          label:"Documents"   },
    ]
  },
  {
    label: "System",
    items: [
      { id:"settings", icon:"ti-settings", label:"Settings"     },
      { id:"roles",    icon:"ti-lock",     label:"Roles & Access"},
    ]
  },
];

function buildNav(role) {
  const allowed = DB.roles[role]?.pages || [];
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';

  NAV_STRUCTURE.forEach(section => {
    const visibleItems = section.items.filter(i => allowed.includes(i.id));
    if(!visibleItems.length) return;

    const sec = document.createElement('div');
    sec.className = 'nav-section';
    sec.innerHTML = `<div class="nav-label">${section.label}</div>`;

    visibleItems.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'nav-item';
      btn.dataset.page = item.id;
      btn.innerHTML = `
        <i class="ti ${item.icon}"></i>
        ${item.label}
        ${item.badge ? `<span class="nav-badge ${item.badgeColor}">${item.badge}</span>` : ''}
      `;
      btn.addEventListener('click', () => {
        closeSidebar();
        App.showPage(item.id, btn);
      });
      sec.appendChild(btn);
    });
    nav.appendChild(sec);
  });
}

function setActiveNav(pageId) {
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === pageId);
  });
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
