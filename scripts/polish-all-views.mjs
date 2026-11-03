import fs from 'fs';
import path from 'path';

// 1. Polish LeaderboardView
{
  const p = path.resolve('src/views/LeaderboardView.jsx');
  let code = fs.readFileSync(p, 'utf8');

  // Replace dark selector wrapper in header
  code = code.replace(
    /background:\s*'rgba\(15,\s*23,\s*42,\s*0\.65\)',\s*backdropFilter:\s*'blur\(10px\)',\s*padding:\s*'0\.35rem 0\.75rem',\s*borderRadius:\s*'14px',\s*border:\s*'1px solid rgba\(255,\s*255,\s*255,\s*0\.15\)'/g,
    "background: '#f8fafc', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0'"
  );
  code = code.replace(
    /color:\s*'#fde68a'/g,
    "color: '#475569'"
  );
  code = code.replace(
    /background:\s*'#0f172a',\s*color:\s*'#ffffff'/g,
    "background: '#ffffff', color: '#1e293b'"
  );

  // Clean podium card borders
  code = code.replace(/border:\s*'2px solid #cbd5e1'/g, "border: '1.5px solid #cbd5e1'");
  code = code.replace(/border:\s*'2\.5px solid #f59e0b'/g, "border: '1.5px solid #f59e0b'");
  code = code.replace(/border:\s*'2px solid #d97706'/g, "border: '1.5px solid #d97706'");
  code = code.replace(/boxShadow:\s*'0 6px 16px rgba\(0,0,0,0\.1\)'/g, "boxShadow: 'none'");

  fs.writeFileSync(p, code, 'utf8');
  console.log('LeaderboardView polished');
}

// 2. Polish AdminUsersView
{
  const p = path.resolve('src/views/AdminUsersView.jsx');
  let code = fs.readFileSync(p, 'utf8');

  // Sub-nav switcher
  code = code.replace(
    /borderRadius:\s*'16px',\s*border:\s*'1px solid var\(--border\)',\s*width:\s*'fit-content'/g,
    "borderRadius: '10px', border: '1px solid var(--border)', width: 'fit-content'"
  );
  code = code.replace(/borderRadius:\s*'12px',\s*border:\s*'none'/g, "borderRadius: '8px', border: 'none'");
  code = code.replace(/padding:\s*'0\.65rem 1\.25rem'/g, "padding: '0.55rem 1.15rem'");

  // Table card
  code = code.replace(/borderRadius:\s*'14px',\s*overflowX:\s*'auto'/g, "borderRadius: '12px', overflowX: 'auto'");

  fs.writeFileSync(p, code, 'utf8');
  console.log('AdminUsersView polished');
}

// 3. Polish TeacherGradingView
{
  const p = path.resolve('src/views/TeacherGradingView.jsx');
  let code = fs.readFileSync(p, 'utf8');

  // Active tabs
  code = code.replace(/padding:\s*'0\.65rem 1\.4rem',\s*borderRadius:\s*'12px'/g, "padding: '0.55rem 1.25rem', borderRadius: '8px'");
  code = code.replace(/background:\s*activeTab === 'queue' \? '#b91c1c' : '#f8fafc'/g, "background: activeTab === 'queue' ? '#b91c1c' : '#ffffff'");
  code = code.replace(/background:\s*activeTab === 'unsubmitted' \? '#b91c1c' : '#f8fafc'/g, "background: activeTab === 'unsubmitted' ? '#b91c1c' : '#ffffff'");
  code = code.replace(/borderRadius:\s*'14px',\s*padding:\s*'2rem'/g, "borderRadius: '12px', padding: '1.5rem'");

  fs.writeFileSync(p, code, 'utf8');
  console.log('TeacherGradingView polished');
}

// 4. Polish PracticeView
{
  const p = path.resolve('src/views/PracticeView.jsx');
  let code = fs.readFileSync(p, 'utf8');

  // Skill tabs
  code = code.replace(/padding:\s*'0\.5rem 1rem',\s*borderRadius:\s*'12px'/g, "padding: '0.45rem 0.9rem', borderRadius: '8px'");
  code = code.replace(/borderRadius:\s*'12px',\s*padding:\s*'1\.5rem'/g, "borderRadius: '12px', padding: '1.25rem'");

  // Replace Start Practice button with clean flat dark button
  code = code.replace(
    /background:\s*'linear-gradient\(135deg,\s*#b91c1c\s*0%,\s*#7f1d1d\s*100%\)',\s*color:\s*'#fff',\s*border:\s*'none',\s*padding:\s*'0\.55rem 1\.25rem',\s*borderRadius:\s*'10px'/g,
    "background: 'var(--text)', color: '#fff', border: 'none', padding: '0.55rem 1.15rem', borderRadius: '8px'"
  );

  fs.writeFileSync(p, code, 'utf8');
  console.log('PracticeView polished');
}

// 5. Polish EntertainmentView
{
  const p = path.resolve('src/views/EntertainmentView.jsx');
  let code = fs.readFileSync(p, 'utf8');

  // Category filter tabs
  code = code.replace(/padding:\s*'0\.5rem 1rem',\s*borderRadius:\s*'12px'/g, "padding: '0.45rem 0.9rem', borderRadius: '8px'");
  code = code.replace(/borderRadius:\s*'14px',\s*padding:\s*'1\.5rem'/g, "borderRadius: '12px', padding: '1.25rem'");

  // Memory card back
  code = code.replace(
    /background:\s*'#b91c1c',\s*borderRadius:\s*'16px'/g,
    "background: '#1e293b', borderRadius: '12px'"
  );
  code = code.replace(/borderRadius:\s*'16px'/g, "borderRadius: '12px'");

  fs.writeFileSync(p, code, 'utf8');
  console.log('EntertainmentView polished');
}

// 6. Polish CourseDetailView
{
  const p = path.resolve('src/views/CourseDetailView.jsx');
  let code = fs.readFileSync(p, 'utf8');

  code = code.replace(/color:\s*'#A11D24'/g, "color: '#b91c1c'");
  code = code.replace(/borderRadius:\s*'10px'/g, "borderRadius: '8px'");
  code = code.replace(/borderRadius:\s*'12px'/g, "borderRadius: '8px'");

  fs.writeFileSync(p, code, 'utf8');
  console.log('CourseDetailView polished');
}

console.log('All views successfully polished!');

