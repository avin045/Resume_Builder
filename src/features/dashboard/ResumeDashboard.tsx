import { useEffect, useMemo, useState } from 'react';
import NewResumeCard from './NewResumeCard';
import ResumeCard from './ResumeCard';
import type { SavedResume } from './ResumeCard';

const MAX_RESUMES = 10;
const RESUMES_STORAGE_KEY = 'resume-builder:saved-resumes';
const VIEW_MODE_STORAGE_KEY = 'resume-builder:dashboard-view-mode';

type ViewMode = 'grid' | 'list';

const starterResumes: SavedResume[] = [
  {
    id: 'resume-product-designer',
    name: 'Product Designer Resume',
    templateId: 'modern',
    createdAt: '2026-04-18T10:30:00.000Z',
    updatedAt: '2026-05-08T15:20:00.000Z',
    pageSize: 'A4',
    resumeData: {
      role: 'Senior Product Designer',
      summary: 'Turns customer research into polished product experiences and measurable business outcomes.',
      skills: ['UX strategy', 'Design systems', 'Prototyping', 'User research'],
    },
  },
  {
    id: 'resume-frontend-engineer',
    name: 'Frontend Engineer Resume',
    templateId: 'classic',
    createdAt: '2026-03-24T08:15:00.000Z',
    updatedAt: '2026-05-05T19:45:00.000Z',
    pageSize: 'Letter',
    resumeData: {
      role: 'Frontend Engineer',
      summary: 'Builds accessible React interfaces with a focus on performance, design fidelity, and maintainability.',
      skills: ['React', 'TypeScript', 'Accessibility', 'Testing'],
    },
  },
  {
    id: 'resume-product-manager',
    name: 'Product Manager Resume',
    templateId: 'compact',
    createdAt: '2026-02-12T14:05:00.000Z',
    updatedAt: '2026-04-29T11:10:00.000Z',
    pageSize: 'A4',
    resumeData: {
      role: 'Product Manager',
      summary: 'Connects market insights, roadmap priorities, and delivery teams to ship customer-centered products.',
      skills: ['Roadmapping', 'Analytics', 'Discovery', 'Stakeholders'],
    },
  },
];

function createResumeName(resumes: SavedResume[]) {
  const nextNumber = resumes.length + 1;
  return `Untitled Resume ${nextNumber}`;
}

function createResumeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `resume-${crypto.randomUUID()}`;
  }

  return `resume-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createEmptyResume(resumes: SavedResume[]): SavedResume {
  const timestamp = new Date().toISOString();

  return {
    id: createResumeId(),
    name: createResumeName(resumes),
    templateId: 'modern',
    createdAt: timestamp,
    updatedAt: timestamp,
    pageSize: 'A4',
    resumeData: {
      role: '',
      summary: '',
      skills: [],
    },
  };
}

function readPreference(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePreference(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Browser privacy settings or storage quotas can block persistence; keep the in-memory UI usable.
  }
}

function normalizeResume(resume: Partial<SavedResume>): SavedResume | null {
  if (!resume.id || !resume.name) {
    return null;
  }

  return {
    id: resume.id,
    name: resume.name,
    templateId: resume.templateId || 'modern',
    createdAt: resume.createdAt || new Date().toISOString(),
    updatedAt: resume.updatedAt || resume.createdAt || new Date().toISOString(),
    pageSize: resume.pageSize || 'A4',
    resumeData: {
      role: resume.resumeData?.role || '',
      summary: resume.resumeData?.summary || '',
      skills: Array.isArray(resume.resumeData?.skills) ? resume.resumeData.skills : [],
    },
  };
}

function getInitialResumes() {
  const storedResumes = readPreference(RESUMES_STORAGE_KEY);

  if (!storedResumes) {
    return starterResumes;
  }

  try {
    const parsedResumes = JSON.parse(storedResumes) as Partial<SavedResume>[];

    if (!Array.isArray(parsedResumes)) {
      return starterResumes;
    }

    const normalizedResumes = parsedResumes.map(normalizeResume).filter((resume): resume is SavedResume => resume !== null);
    return normalizedResumes.length > 0 ? normalizedResumes.slice(0, MAX_RESUMES) : starterResumes;
  } catch {
    return starterResumes;
  }
}

function getInitialViewMode(): ViewMode {
  const storedViewMode = readPreference(VIEW_MODE_STORAGE_KEY);
  return storedViewMode === 'list' ? 'list' : 'grid';
}

function downloadResumeJson(resume: SavedResume) {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${resume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'resume'}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ResumeDashboard() {
  const [resumes, setResumes] = useState<SavedResume[]>(getInitialResumes);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);

  useEffect(() => {
    writePreference(RESUMES_STORAGE_KEY, JSON.stringify(resumes));
  }, [resumes]);

  useEffect(() => {
    writePreference(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  const filteredResumes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return resumes;
    }

    return resumes.filter((resume) => resume.name.toLowerCase().includes(normalizedSearch));
  }, [resumes, searchTerm]);

  const createResume = () => {
    setResumes((currentResumes) => {
      if (currentResumes.length >= MAX_RESUMES) {
        return currentResumes;
      }

      return [createEmptyResume(currentResumes), ...currentResumes];
    });
  };

  const renameResume = (id: string) => {
    const resume = resumes.find((currentResume) => currentResume.id === id);
    const updatedName = window.prompt('Rename resume', resume?.name);

    if (!updatedName?.trim()) {
      return;
    }

    setResumes((currentResumes) =>
      currentResumes.map((currentResume) =>
        currentResume.id === id
          ? { ...currentResume, name: updatedName.trim(), updatedAt: new Date().toISOString() }
          : currentResume,
      ),
    );
  };

  const duplicateResume = (id: string) => {
    setResumes((currentResumes) => {
      if (currentResumes.length >= MAX_RESUMES) {
        window.alert(`You can save up to ${MAX_RESUMES} resumes. Delete one before duplicating another.`);
        return currentResumes;
      }

      const resume = currentResumes.find((currentResume) => currentResume.id === id);

      if (!resume) {
        return currentResumes;
      }

      const timestamp = new Date().toISOString();
      const duplicatedResume: SavedResume = {
        ...resume,
        id: createResumeId(),
        name: `${resume.name} Copy`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      return [duplicatedResume, ...currentResumes];
    });
  };

  const deleteResume = (id: string) => {
    const resume = resumes.find((currentResume) => currentResume.id === id);

    if (!window.confirm(`Delete ${resume?.name ?? 'this resume'}? This cannot be undone.`)) {
      return;
    }

    setResumes((currentResumes) => currentResumes.filter((currentResume) => currentResume.id !== id));
  };

  const exportResume = (id: string) => {
    const resume = resumes.find((currentResume) => currentResume.id === id);

    if (resume) {
      downloadResumeJson(resume);
    }
  };

  return (
    <section className="dashboard-view" aria-labelledby="resume-dashboard-title">
      <div className="dashboard-view__header">
        <div>
          <p className="eyebrow">Resume dashboard</p>
          <h2 id="resume-dashboard-title">Manage saved resumes.</h2>
          <p className="dashboard-view__intro">
            Search, organize, duplicate, export, and keep up to {MAX_RESUMES} tailored resumes ready for applications.
          </p>
        </div>
        <div className="dashboard-view__counter" aria-label={`${resumes.length} of ${MAX_RESUMES} resumes saved`}>
          <strong>{resumes.length}</strong>
          <span>/{MAX_RESUMES} saved</span>
        </div>
      </div>

      <div className="dashboard-toolbar">
        <label className="dashboard-search">
          Search resumes by name
          <input
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name..."
            type="search"
            value={searchTerm}
          />
        </label>
        <div className="view-toggle" aria-label="Dashboard layout">
          <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} type="button">
            Grid
          </button>
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} type="button">
            List
          </button>
        </div>
      </div>

      <div className={`resume-dashboard-grid resume-dashboard-grid--${viewMode}`}>
        <NewResumeCard currentCount={resumes.length} maxResumes={MAX_RESUMES} onCreate={createResume} />
        {filteredResumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            onDelete={deleteResume}
            onDuplicate={duplicateResume}
            onExport={exportResume}
            onRename={renameResume}
            resume={resume}
            viewMode={viewMode}
          />
        ))}
      </div>

      {filteredResumes.length === 0 && (
        <p className="dashboard-empty">No resumes match “{searchTerm}”. Try a different search term.</p>
      )}
    </section>
  );
}

export default ResumeDashboard;
