import { useMemo, useState } from 'react';
import type { CSSProperties, Dispatch, SetStateAction } from 'react';

type ViewKey = 'dashboard' | 'editor' | 'templates' | 'export';

type Resume = {
  name: string;
  role: string;
  summary: string;
  skills: string[];
  updatedAt: string;
};

const views: Array<{ key: ViewKey; label: string; eyebrow: string }> = [
  { key: 'dashboard', label: 'Dashboard', eyebrow: 'Plan' },
  { key: 'editor', label: 'Editor', eyebrow: 'Write' },
  { key: 'templates', label: 'Templates', eyebrow: 'Polish' },
  { key: 'export', label: 'Export', eyebrow: 'Share' },
];

const starterResume: Resume = {
  name: 'Alex Morgan',
  role: 'Product Designer',
  summary:
    'Creative problem-solver who turns customer research into polished product experiences and measurable business outcomes.',
  skills: ['UX strategy', 'Design systems', 'Prototyping', 'User research'],
  updatedAt: 'Today',
};

function App() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [resume, setResume] = useState<Resume>(starterResume);
  const [accentColor, setAccentColor] = useState('#4f46e5');

  const completion = useMemo(() => {
    const completeFields = [resume.name, resume.role, resume.summary, resume.skills.join('')].filter(Boolean).length;
    return Math.round((completeFields / 4) * 100);
  }, [resume]);

  const updateSkill = (index: number, value: string) => {
    setResume((current) => ({
      ...current,
      skills: current.skills.map((skill, skillIndex) => (skillIndex === index ? value : skill)),
      updatedAt: 'Just now',
    }));
  };

  return (
    <main className="app-shell" style={{ '--accent-color': accentColor } as CSSProperties}>
      <section className="hero-card">
        <div>
          <p className="eyebrow">Resume Builder</p>
          <h1>Build, customize, and export your next resume.</h1>
          <p className="hero-copy">
            A focused static React app scaffold for managing drafts, editing resume content, choosing a style,
            and preparing download-ready exports.
          </p>
        </div>
        <div className="progress-card" aria-label="Resume completion">
          <span>{completion}%</span>
          <p>profile complete</p>
        </div>
      </section>

      <nav className="view-tabs" aria-label="Resume builder views">
        {views.map((view) => (
          <button
            className={activeView === view.key ? 'active' : ''}
            key={view.key}
            onClick={() => setActiveView(view.key)}
            type="button"
          >
            <small>{view.eyebrow}</small>
            {view.label}
          </button>
        ))}
      </nav>

      <section className="workspace">
        <div className="panel">{activeView === 'dashboard' && <Dashboard resume={resume} completion={completion} />}</div>
        <div className="panel featured-panel">
          {activeView === 'dashboard' && <ResumePreview accentColor={accentColor} resume={resume} />}
          {activeView === 'editor' && <Editor resume={resume} setResume={setResume} updateSkill={updateSkill} />}
          {activeView === 'templates' && <Templates accentColor={accentColor} setAccentColor={setAccentColor} />}
          {activeView === 'export' && <ExportView resume={resume} />}
        </div>
      </section>
    </main>
  );
}

function Dashboard({ completion, resume }: { completion: number; resume: Resume }) {
  const stats = [
    { label: 'Drafts', value: '3' },
    { label: 'Completion', value: `${completion}%` },
    { label: 'Last update', value: resume.updatedAt },
  ];

  return (
    <section>
      <p className="eyebrow">Resume dashboard</p>
      <h2>Keep every application organized.</h2>
      <div className="stat-grid">
        {stats.map((stat) => (
          <article key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>
      <ul className="checklist">
        <li>Review target role keywords</li>
        <li>Tailor achievements to each job</li>
        <li>Export PDF before applying</li>
      </ul>
    </section>
  );
}

function Editor({
  resume,
  setResume,
  updateSkill,
}: {
  resume: Resume;
  setResume: Dispatch<SetStateAction<Resume>>;
  updateSkill: (index: number, value: string) => void;
}) {
  return (
    <section>
      <p className="eyebrow">Resume editor</p>
      <h2>Edit your headline and core profile.</h2>
      <div className="form-grid">
        <label>
          Name
          <input value={resume.name} onChange={(event) => setResume({ ...resume, name: event.target.value, updatedAt: 'Just now' })} />
        </label>
        <label>
          Target role
          <input value={resume.role} onChange={(event) => setResume({ ...resume, role: event.target.value, updatedAt: 'Just now' })} />
        </label>
        <label className="full-width">
          Professional summary
          <textarea
            rows={5}
            value={resume.summary}
            onChange={(event) => setResume({ ...resume, summary: event.target.value, updatedAt: 'Just now' })}
          />
        </label>
        {resume.skills.map((skill, index) => (
          <label key={index}>
            Skill {index + 1}
            <input value={skill} onChange={(event) => updateSkill(index, event.target.value)} />
          </label>
        ))}
      </div>
    </section>
  );
}

function Templates({
  accentColor,
  setAccentColor,
}: {
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
}) {
  const colors = ['#4f46e5', '#0f766e', '#be123c', '#a16207'];

  return (
    <section>
      <p className="eyebrow">Template customization</p>
      <h2>Choose a polished visual direction.</h2>
      <div className="template-grid">
        {['Modern', 'Classic', 'Compact'].map((template) => (
          <article key={template}>
            <div className="template-lines" />
            <h3>{template}</h3>
            <p>{template === 'Modern' ? 'Bold accent bar and roomy sections.' : 'Clean typography for recruiter scanning.'}</p>
          </article>
        ))}
      </div>
      <div className="color-picker" aria-label="Accent color picker">
        {colors.map((color) => (
          <button
            aria-label={`Use ${color} accent`}
            className={accentColor === color ? 'selected' : ''}
            key={color}
            onClick={() => setAccentColor(color)}
            style={{ backgroundColor: color }}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

function ExportView({ resume }: { resume: Resume }) {
  return (
    <section>
      <p className="eyebrow">Export and download</p>
      <h2>Package your resume for applications.</h2>
      <div className="export-card">
        <h3>{resume.name || 'Untitled resume'}</h3>
        <p>{resume.role}</p>
        <button type="button">Download PDF</button>
        <button className="secondary" type="button">
          Copy share link
        </button>
      </div>
      <p className="helper-text">Static export controls are ready for future PDF generation or browser print wiring.</p>
    </section>
  );
}

function ResumePreview({ accentColor, resume }: { accentColor: string; resume: Resume }) {
  return (
    <article className="resume-preview">
      <div className="preview-accent" style={{ backgroundColor: accentColor }} />
      <h2>{resume.name}</h2>
      <p className="role">{resume.role}</p>
      <p>{resume.summary}</p>
      <div className="skill-list">
        {resume.skills.map((skill, index) => (
          <span key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>
    </article>
  );
}

export default App;
