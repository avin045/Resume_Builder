export type ResumeData = {
  role: string;
  summary: string;
  skills: string[];
};

export type SavedResume = {
  id: string;
  name: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  pageSize: string;
  resumeData: ResumeData;
};

type ResumeCardProps = {
  resume: SavedResume;
  viewMode: 'grid' | 'list';
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExport: (id: string) => void;
  onRename: (id: string) => void;
};

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function ResumeCard({ resume, viewMode, onDelete, onDuplicate, onExport, onRename }: ResumeCardProps) {
  const role = resume.resumeData.role || 'Role not set';
  const summary = resume.resumeData.summary || 'Add a summary to make this resume easier to identify later.';
  const skills = resume.resumeData.skills.filter(Boolean).slice(0, 3);

  return (
    <article className={`resume-card resume-card--${viewMode}`}>
      <div className="resume-card__preview" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="resume-card__content">
        <div className="resume-card__header">
          <div>
            <p className="resume-card__template">{resume.templateId} • {resume.pageSize}</p>
            <h3>{resume.name}</h3>
          </div>
          <details className="resume-menu">
            <summary aria-label={`Open menu for ${resume.name}`}>•••</summary>
            <div className="resume-menu__items">
              <button onClick={() => onRename(resume.id)} type="button">Rename</button>
              <button onClick={() => onDuplicate(resume.id)} type="button">Duplicate</button>
              <button onClick={() => onExport(resume.id)} type="button">Export JSON</button>
              <button className="danger" onClick={() => onDelete(resume.id)} type="button">Delete</button>
            </div>
          </details>
        </div>

        <p className="resume-card__role">{role}</p>
        <p className="resume-card__summary">{summary}</p>

        <div className="resume-card__skills" aria-label="Resume skills">
          {skills.length > 0 ? skills.map((skill) => <span key={skill}>{skill}</span>) : <span>No skills yet</span>}
        </div>

        <dl className="resume-card__meta">
          <div>
            <dt>Created</dt>
            <dd>{formatDate(resume.createdAt)}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{formatDate(resume.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export default ResumeCard;
