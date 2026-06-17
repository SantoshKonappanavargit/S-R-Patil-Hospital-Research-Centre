/* ═══════════════════════════════════════════
   DATA STORE — S R Patil Hospital
   In production replace with REST API calls
   ═══════════════════════════════════════════ */

const DB = {

  hospital: {
    name: "S R Patil Hospital & Research Centre",
    location: "Badgandi, Karnataka – 591 302",
    reg_no: "KAR/HOS/2014/4421",
    phone: "+91-0000-000000",
    email: "info@srpatilhospital.in",
    website: "www.srpatilhospital.in",
    estd: 2014,
    beds: 150,
    chairman: "Shri S R Patil",
  },

  roles: {
    chairman: { label: "Chairman",           color: "accent",  pages: ["dashboard","daily-updates","chairman","purchase","nmc","announcements","departments","staff","hiring","dgroup","attendance","payroll","patients","opd","ipd","appointments","lab","pharmacy","billing","finance","tenders","audit","documents","settings","roles","notifications"] },
    ceo:      { label: "CEO / Director",     color: "primary", pages: ["dashboard","daily-updates","chairman","purchase","nmc","announcements","departments","staff","hiring","dgroup","attendance","payroll","patients","opd","ipd","appointments","lab","pharmacy","billing","finance","tenders","audit","documents","settings","roles","notifications"] },
    admin:    { label: "Administrator",      color: "primary", pages: ["dashboard","daily-updates","purchase","nmc","announcements","departments","staff","hiring","dgroup","attendance","payroll","patients","opd","ipd","appointments","lab","pharmacy","billing","finance","tenders","audit","documents","settings","notifications"] },
    doctor:   { label: "Doctor",             color: "success", pages: ["dashboard","daily-updates","patients","opd","ipd","appointments","lab","announcements","notifications"] },
    nurse:    { label: "Nurse",              color: "info",    pages: ["dashboard","daily-updates","patients","opd","ipd","lab","pharmacy","announcements","notifications"] },
    hr:       { label: "HR Manager",         color: "warning", pages: ["dashboard","staff","hiring","dgroup","attendance","payroll","announcements","notifications"] },
    finance:  { label: "Finance Officer",    color: "danger",  pages: ["dashboard","billing","finance","purchase","announcements","notifications"] },
    reception:{ label: "Receptionist",       color: "teal",    pages: ["dashboard","patients","opd","appointments","billing","announcements","notifications"] },
  },

  staff: [
    { id:"EMP-001", name:"Dr. Arvind Patel",   role:"Doctor",     dept:"Cardiology",    qual:"MD, DM Cardio",  join:"2018-01-12", grade:"A1", phone:"9876543201", status:"active" },
    { id:"EMP-002", name:"Dr. Sneha Mehta",    role:"Doctor",     dept:"Gynecology",    qual:"MS, DNB OBG",    join:"2019-03-04", grade:"A1", phone:"9876543202", status:"active" },
    { id:"EMP-003", name:"Dr. Rajan Kumar",    role:"Doctor",     dept:"General Surgery",qual:"MS Surgery",    join:"2020-07-01", grade:"A1", phone:"9876543203", status:"active" },
    { id:"EMP-004", name:"Dr. Priya Nair",     role:"Doctor",     dept:"Pediatrics",    qual:"MD Pediatrics",  join:"2021-02-15", grade:"A2", phone:"9876543204", status:"active" },
    { id:"EMP-005", name:"Dr. Amit Joshi",     role:"Doctor",     dept:"Orthopedics",   qual:"MS Ortho",       join:"2022-06-10", grade:"A1", phone:"9876543205", status:"active" },
    { id:"EMP-006", name:"Nirmala Kamble",     role:"Nurse",      dept:"ICU",           qual:"BSc Nursing",    join:"2020-06-06", grade:"B2", phone:"9876543206", status:"active" },
    { id:"EMP-007", name:"Sunita Patil",       role:"Nurse",      dept:"General Ward",  qual:"GNM",            join:"2021-09-01", grade:"B2", phone:"9876543207", status:"active" },
    { id:"EMP-008", name:"Ramesh Shirke",      role:"Technician", dept:"Radiology",     qual:"DMRT",           join:"2021-09-10", grade:"C1", phone:"9876543208", status:"active" },
    { id:"EMP-009", name:"Priya Kulkarni",     role:"Admin",      dept:"Finance",       qual:"BBA",            join:"2022-12-15", grade:"C2", phone:"9876543209", status:"active" },
    { id:"EMP-010", name:"Vikram Rao",         role:"Pharmacist", dept:"Pharmacy",      qual:"B.Pharm",        join:"2023-06-01", grade:"C1", phone:"9876543210", status:"active" },
    { id:"EMP-011", name:"Anita Desai",        role:"Nurse",      dept:"Maternity",     qual:"GNM",            join:"2024-06-10", grade:"B2", phone:"9876543211", status:"active" },
    { id:"EMP-012", name:"Kavita Sharma",      role:"Admin",      dept:"HR",            qual:"MBA HR",         join:"2019-04-15", grade:"C1", phone:"9876543212", status:"active" },
  ],

  dgroup: [
    { id:"DG-001", name:"Ramkumar Salve",  cat:"Ward Boy",      zone:"General Ward", shift:"Morning", join:"2022-03-12", status:"present", phone:"8765432101" },
    { id:"DG-002", name:"Laxmi Bai",       cat:"Housekeeping",  zone:"OPD Block",    shift:"Morning", join:"2021-01-05", status:"present", phone:"8765432102" },
    { id:"DG-003", name:"Shyam Jadhav",    cat:"Security",      zone:"Main Gate",    shift:"Night",   join:"2020-06-08", status:"present", phone:"8765432103" },
    { id:"DG-004", name:"Rekha More",      cat:"Housekeeping",  zone:"ICU Block",    shift:"Morning", join:"2023-09-03", status:"absent",  phone:"8765432104" },
    { id:"DG-005", name:"Ganesh Pawar",    cat:"Sweeper",       zone:"Surgical Ward",shift:"Morning", join:"2019-02-14", status:"present", phone:"8765432105" },
    { id:"DG-006", name:"Sunanda Kamble",  cat:"Kitchen",       zone:"Canteen",      shift:"Morning", join:"2022-07-20", status:"present", phone:"8765432106" },
    { id:"DG-007", name:"Dilip Wagh",      cat:"Ward Boy",      zone:"Pediatrics",   shift:"Evening", join:"2023-01-10", status:"present", phone:"8765432107" },
    { id:"DG-008", name:"Meena Jadhav",    cat:"Laundry",       zone:"Laundry Dept", shift:"Morning", join:"2021-08-15", status:"leave",   phone:"8765432108" },
    { id:"DG-009", name:"Ravi Kale",       cat:"Security",      zone:"Emergency",    shift:"Night",   join:"2022-11-22", status:"present", phone:"8765432109" },
    { id:"DG-010", name:"Suman Dhole",     cat:"Housekeeping",  zone:"Lab Block",    shift:"Morning", join:"2020-04-18", status:"present", phone:"8765432110" },
  ],

  patients: [
    { uhid:"UH-10241", name:"Ramabai Jadhav", age:58, gender:"F", phone:"9876543210", ward:"General Ward",  doctor:"Dr. Patel",  admit:"2025-06-10", status:"admitted",    blood:"O+" },
    { uhid:"UH-10242", name:"Suresh Nikam",   age:42, gender:"M", phone:"9123456780", ward:"ICU",           doctor:"Dr. Mehta",  admit:"2025-06-11", status:"critical",    blood:"B+" },
    { uhid:"UH-10243", name:"Priya Sharma",   age:26, gender:"F", phone:"9988776655", ward:"Maternity",     doctor:"Dr. Kumar",  admit:"2025-06-12", status:"admitted",    blood:"A+" },
    { uhid:"UH-10244", name:"Mohan Desai",    age:65, gender:"M", phone:"8877665544", ward:"—",             doctor:"Dr. Patel",  admit:"—",          status:"opd",         blood:"AB+" },
    { uhid:"UH-10245", name:"Kavita Shinde",  age:34, gender:"F", phone:"9765432100", ward:"Orthopedics",   doctor:"Dr. Joshi",  admit:"2025-06-09", status:"admitted",    blood:"O-" },
    { uhid:"UH-10246", name:"Ajay Kulkarni",  age:7,  gender:"M", phone:"9654321098", ward:"Pediatrics",    doctor:"Dr. Nair",   admit:"2025-06-11", status:"admitted",    blood:"B-" },
    { uhid:"UH-10247", name:"Deepa Rao",      age:45, gender:"F", phone:"9543210987", ward:"—",             doctor:"Dr. Kumar",  admit:"—",          status:"discharged",  blood:"A-" },
  ],

  purchase_orders: [
    { id:"PO-1045", date:"2025-06-10", vendor:"Meditech Supplies",    dept:"Lab",         items:5,  amount:124000, status:"pending",   approved_by:"—" },
    { id:"PO-1044", date:"2025-06-08", vendor:"PharmaDist Ltd",       dept:"Pharmacy",    items:12, amount:68500,  status:"approved",  approved_by:"Chairman" },
    { id:"PO-1043", date:"2025-06-05", vendor:"LifeCare Equipment",   dept:"OT",          items:3,  amount:342000, status:"approved",  approved_by:"Chairman" },
    { id:"PO-1042", date:"2025-06-04", vendor:"SurgMed India",        dept:"Surgery",     items:8,  amount:89750,  status:"delivered", approved_by:"Admin" },
    { id:"PO-1041", date:"2025-06-02", vendor:"CleanChem Corp",       dept:"Housekeeping",items:6,  amount:22400,  status:"rejected",  approved_by:"Finance" },
    { id:"PO-1040", date:"2025-05-30", vendor:"Alpha Medical",        dept:"ICU",         items:4,  amount:185000, status:"delivered", approved_by:"Chairman" },
    { id:"PO-1039", date:"2025-05-28", vendor:"LabEquip Solutions",   dept:"Lab",         items:2,  amount:76000,  status:"delivered", approved_by:"Admin" },
    { id:"PO-1038", date:"2025-05-25", vendor:"SafeMed Devices",      dept:"ICU",         items:7,  amount:215000, status:"approved",  approved_by:"Chairman" },
  ],

  licenses: [
    { name:"Hospital Registration",   authority:"State Health Dept.",  no:"KAR/HOS/2014/4421", issue:"2023-04-01", expiry:"2026-03-31", responsible:"CEO",                    status:"active"  },
    { name:"NMC Accreditation",        authority:"NMC India",           no:"NMC/2022/8931",      issue:"2022-01-15", expiry:"2026-01-14", responsible:"Medical Superintendent", status:"pending" },
    { name:"Fire NOC",                 authority:"Fire Department",     no:"FIRE/KAR/0892",      issue:"2022-12-01", expiry:"2024-11-30", responsible:"Admin Officer",          status:"expired" },
    { name:"Blood Bank License",       authority:"DCGI",                no:"BB/KAR/214",         issue:"2023-09-01", expiry:"2026-08-31", responsible:"Blood Bank Officer",     status:"active"  },
    { name:"Pharmacy License",         authority:"State Pharmacy Dept.",no:"PH/KAR/8821",        issue:"2023-06-01", expiry:"2026-05-31", responsible:"Chief Pharmacist",       status:"active"  },
    { name:"Bio-Medical Waste",        authority:"KSPCB",               no:"BMW/2022/441",        issue:"2022-08-15", expiry:"2025-08-14", responsible:"Infection Control",      status:"pending" },
    { name:"CT Scan Registration",     authority:"AERB",                no:"AERB/CT/1124",        issue:"2024-02-01", expiry:"2027-01-31", responsible:"Radiology Head",         status:"active"  },
    { name:"Clinical Lab License",     authority:"NABL",                no:"NABL/MC/2248",        issue:"2023-11-01", expiry:"2026-10-31", responsible:"Lab Head",               status:"active"  },
    { name:"Ambulance Registration",   authority:"Transport Dept.",     no:"KA/AMB/2021/88",      issue:"2021-06-01", expiry:"2026-05-31", responsible:"Admin",                  status:"active"  },
    { name:"Nursing Home License",     authority:"DHO Karnataka",       no:"DHO/NH/2014/112",     issue:"2023-07-01", expiry:"2026-06-30", responsible:"CEO",                    status:"active"  },
  ],

  hiring: [
    { id:"JO-001", post:"Lab Technician",   dept:"Pathology",    type:"Full Time", vacancies:1, applications:7, posted:"2025-06-08", status:"open"   },
    { id:"JO-002", post:"Staff Nurse",       dept:"General Ward", type:"Full Time", vacancies:3, applications:4, posted:"2025-06-06", status:"open"   },
    { id:"JO-003", post:"Housekeeping",      dept:"D Group",      type:"Contract",  vacancies:2, applications:3, posted:"2025-06-01", status:"open"   },
    { id:"JO-004", post:"Radiologist",       dept:"Radiology",    type:"Full Time", vacancies:1, applications:2, posted:"2025-05-24", status:"review" },
    { id:"JO-005", post:"Billing Executive", dept:"Finance",      type:"Full Time", vacancies:1, applications:2, posted:"2025-05-17", status:"review" },
  ],

  applications: [
    { id:"APP-001", name:"Mahesh Kumar",  post:"Lab Technician",  exp:"3 yrs", applied:"2025-06-09", stage:"shortlisted" },
    { id:"APP-002", name:"Sunita Patil",  post:"Staff Nurse",     exp:"5 yrs", applied:"2025-06-07", stage:"interview"   },
    { id:"APP-003", name:"Rajesh Nair",   post:"Radiologist",     exp:"8 yrs", applied:"2025-06-01", stage:"review"      },
    { id:"APP-004", name:"Pooja Joshi",   post:"Staff Nurse",     exp:"2 yrs", applied:"2025-06-01", stage:"rejected"    },
    { id:"APP-005", name:"Amol Sawant",   post:"Lab Technician",  exp:"2 yrs", applied:"2025-06-10", stage:"review"      },
    { id:"APP-006", name:"Rekha Singh",   post:"Billing Exec",    exp:"4 yrs", applied:"2025-05-28", stage:"review"      },
  ],

  announcements: [
    { id:1, title:"ICU Maintenance Alert",            type:"urgent",  author:"Admin",        date:"2025-06-12", body:"Bed no. 7 in ICU is under maintenance. All new ICU admissions to be routed to beds 1–6 and 8–10 until further notice. Engineering team on-site." },
    { id:2, title:"New Lab Equipment Installed",       type:"success", author:"Lab Head",     date:"2025-06-12", body:"Hematology analyzer (BC-6900 series) has been successfully installed in the main lab. Training session scheduled for tomorrow 9 AM." },
    { id:3, title:"Monthly Staff Meeting — Reminder",  type:"info",    author:"HR Department",date:"2025-06-11", body:"Monthly all-hands staff meeting scheduled for 15th at 10:00 AM in Conference Hall. Heads of all departments to prepare unit reports." },
    { id:4, title:"Pharmacy Stock Alert",              type:"warning", author:"Pharmacy",     date:"2025-06-11", body:"Amoxicillin 500mg stock critically low (28 strips remaining). PO raised — expected delivery in 3 days. Use approved alternatives per protocol." },
    { id:5, title:"OPD Renovation Notice",             type:"info",    author:"Admin",        date:"2025-06-10", body:"OPD block B renovation work will begin from Monday. OPD patients to use block A temporarily. Duration: 2 weeks." },
    { id:6, title:"Foundation Day Celebration",        type:"success", author:"Chairman",     date:"2025-06-10", body:"S R Patil Hospital Foundation Day celebrated on 20 June. All staff invited. Cultural program at 4 PM in main auditorium." },
    { id:7, title:"HR Policy Update — Leave Mgmt",    type:"info",    author:"HR",           date:"2025-06-08", body:"Updated leave management policy effective July 1, 2025. Casual leave enhanced to 12 days/year. Refer HR Circular No. HR/2025/04." },
  ],

  chairman_directives: [
    { date:"2025-06-12", text:"All HODs to submit monthly performance report by 20th of each month. Non-compliance will be noted in annual appraisal.", to:"All HODs" },
    { date:"2025-06-05", text:"NMC accreditation renewal to be prioritised as top agenda. CEO to personally supervise and report weekly status.", to:"CEO" },
    { date:"2025-05-28", text:"New OPD expansion wing construction tender to be floated by 15 June 2025. Finance & Admin to coordinate.", to:"Admin, Finance" },
    { date:"2025-05-15", text:"Salary revision for D Group staff effective 1 July 2025. HR to prepare revised pay breakup for Chairman approval.", to:"HR Manager" },
    { date:"2025-05-02", text:"CCTV coverage to be extended to all wards and parking area. Admin to get 3 quotations by 20 May.", to:"Admin" },
  ],

  billing: [
    { id:"B-5421", patient:"Ramabai Jadhav", uhid:"UH-10241", date:"2025-06-12", services:"Admission + Lab + Meds",   amount:24800, paid:20000, status:"partial"  },
    { id:"B-5420", patient:"Mohan Desai",    uhid:"UH-10244", date:"2025-06-12", services:"OPD + Medicines",           amount:1200,  paid:1200,  status:"paid"     },
    { id:"B-5419", patient:"Deepa Rao",      uhid:"UH-10247", date:"2025-06-11", services:"Surgery + Anesthesia",      amount:78000, paid:78000, status:"paid"     },
    { id:"B-5418", patient:"Suresh Nikam",   uhid:"UH-10242", date:"2025-06-11", services:"ICU Charges + Labs",        amount:42500, paid:0,     status:"unpaid"   },
    { id:"B-5417", patient:"Kavita Shinde",  uhid:"UH-10245", date:"2025-06-10", services:"Ortho Surgery + Implant",   amount:95000, paid:95000, status:"paid"     },
    { id:"B-5416", patient:"Priya Sharma",   uhid:"UH-10243", date:"2025-06-12", services:"Maternity + Delivery",      amount:18500, paid:10000, status:"partial"  },
  ],

  inventory: [
    { id:"INV-001", name:"Amoxicillin 500mg",        cat:"Pharmacy",    stock:28,   unit:"Strips",  min:100,  status:"critical" },
    { id:"INV-002", name:"Surgical Gloves (M)",       cat:"OT Supplies", stock:12,   unit:"Boxes",   min:50,   status:"low"      },
    { id:"INV-003", name:"IV Cannula 18G",            cat:"ICU Supplies", stock:0,   unit:"Pcs",     min:200,  status:"out"      },
    { id:"INV-004", name:"Paracetamol 500mg",         cat:"Pharmacy",    stock:450,  unit:"Strips",  min:100,  status:"ok"       },
    { id:"INV-005", name:"BP Monitor (Omron)",        cat:"Equipment",   stock:8,    unit:"Units",   min:4,    status:"ok"       },
    { id:"INV-006", name:"Oxygen Cylinder",           cat:"ICU Supplies", stock:14,  unit:"Cylinders",min:10,  status:"ok"       },
    { id:"INV-007", name:"Disposable Syringes 5ml",   cat:"OT Supplies", stock:200,  unit:"Pcs",     min:500,  status:"low"      },
    { id:"INV-008", name:"Betadine Solution 500ml",   cat:"OT Supplies", stock:45,   unit:"Bottles", min:20,   status:"ok"       },
  ],

  departments: [
    { name:"Cardiology",       icon:"ti-heart-rate-monitor", color:"#dce8f8", textColor:"#1a3a5c", doctors:3, nurses:6,  patients_month:18  },
    { name:"General Surgery",  icon:"ti-scalpel",            color:"#d6f0e4", textColor:"#1a7a4a", doctors:5, nurses:8,  patients_month:24  },
    { name:"Gynecology & OBG", icon:"ti-baby-carriage",      color:"#fcefd6", textColor:"#c87a00", doctors:4, nurses:7,  patients_month:31  },
    { name:"ICU / ICCU",       icon:"ti-activity",           color:"#fce0e0", textColor:"#b83232", doctors:4, nurses:10, patients_month:8   },
    { name:"Pathology / Lab",  icon:"ti-microscope",         color:"#dce8f8", textColor:"#1a3a5c", doctors:2, nurses:0,  patients_month:284 },
    { name:"Radiology",        icon:"ti-scan",               color:"#ede9f6", textColor:"#6b3fa0", doctors:2, nurses:0,  patients_month:92  },
    { name:"Pediatrics",       icon:"ti-baby",               color:"#d6f0e4", textColor:"#1a7a4a", doctors:2, nurses:4,  patients_month:40  },
    { name:"Orthopedics",      icon:"ti-bone",               color:"#fcefd6", textColor:"#c87a00", doctors:2, nurses:4,  patients_month:15  },
    { name:"Pharmacy",         icon:"ti-pill",               color:"#dce8f8", textColor:"#1a3a5c", doctors:0, nurses:0,  patients_month:1240},
  ],

  finance_monthly: {
    revenue: { opd:840000, ipd:1820000, lab:560000, pharmacy:640000, radiology:300000, ambulance:40000 },
    expenses: { salaries:1400000, medicines:420000, equipment:300000, utilities:80000, maintenance:140000 }
  },

  salary_grades: [
    { grade:"A1", role:"Senior Doctor / Specialist",  basic:90000,  hra:18000, allow:12000 },
    { grade:"A2", role:"Junior Doctor / MO",          basic:60000,  hra:12000, allow:8000  },
    { grade:"B1", role:"Senior Nurse / HOD Nurse",    basic:35000,  hra:7000,  allow:5000  },
    { grade:"B2", role:"Staff Nurse",                 basic:22000,  hra:4400,  allow:3000  },
    { grade:"C1", role:"Senior Technician",           basic:25000,  hra:5000,  allow:3500  },
    { grade:"C2", role:"Admin / Billing Staff",       basic:18000,  hra:3600,  allow:2500  },
    { grade:"D1", role:"D Group — Ward Boy / Sec",    basic:12000,  hra:2400,  allow:1500  },
    { grade:"D2", role:"D Group — Housekeeping",      basic:10000,  hra:2000,  allow:1200  },
  ],

  audit_log: [
    { time:"12 Jun 2025, 11:47 AM", user:"Admin",       action:"PO #PO-1044 status updated to Approved" },
    { time:"12 Jun 2025, 10:30 AM", user:"HR Manager",  action:"Job offer issued to applicant (Lab Technician)" },
    { time:"12 Jun 2025, 09:05 AM", user:"Finance",     action:"Monthly payroll batch initiated — 213 employees" },
    { time:"11 Jun 2025, 06:15 PM", user:"Reception",   action:"New patient registered (UHID: UH-10243)" },
    { time:"11 Jun 2025, 04:00 PM", user:"Pharmacy",    action:"Stock alert raised — Amoxicillin 500mg" },
    { time:"11 Jun 2025, 02:30 PM", user:"Admin",       action:"License record updated — Fire NOC marked Expired" },
    { time:"10 Jun 2025, 11:00 AM", user:"Chairman",    action:"Directive added: HOD monthly report submission" },
    { time:"10 Jun 2025, 09:45 AM", user:"Lab Head",    action:"New equipment registered — BC-6900 Hematology Analyzer" },
  ],

  tenders: [
    { id:"TND-001", title:"Housekeeping Services Contract",    floated:"2025-05-01", deadline:"2025-06-15", bids:4, status:"evaluation", value:600000  },
    { id:"TND-002", title:"Annual Drug & Pharma Supply",       floated:"2025-04-15", deadline:"2025-05-30", bids:6, status:"awarded",    value:4800000 },
    { id:"TND-003", title:"CCTV Installation & Maintenance",   floated:"2025-06-01", deadline:"2025-06-30", bids:2, status:"open",       value:350000  },
    { id:"TND-004", title:"OPD Wing Renovation",               floated:"2025-06-10", deadline:"2025-07-10", bids:0, status:"open",       value:2500000 },
    { id:"TND-005", title:"Ambulance Service Contract",        floated:"2025-03-01", deadline:"2025-04-01", bids:3, status:"awarded",    value:1200000 },
  ],

  // Helper to get color for avatar based on name
  avatarColor(name) {
    const colors = ["primary","accent","success","info","teal","purple","warning","danger"];
    let sum = 0;
    for(let c of name) sum += c.charCodeAt(0);
    return colors[sum % colors.length];
  },

  // Helper to get initials
  initials(name) {
    return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  },

  // Helper to format amount
  formatINR(n) {
    if(n >= 100000) return "₹" + (n/100000).toFixed(1) + "L";
    if(n >= 1000)   return "₹" + (n/1000).toFixed(1) + "K";
    return "₹" + n.toLocaleString('en-IN');
  }
};
