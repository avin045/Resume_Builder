type NewResumeCardProps = {
  currentCount: number;
  maxResumes: number;
  onCreate: () => void;
};

function NewResumeCard({ currentCount, maxResumes, onCreate }: NewResumeCardProps) {
  const isAtLimit = currentCount >= maxResumes;

  return (
    <article className="new-resume-card">
      <div className="new-resume-card__icon" aria-hidden="true">+</div>
      <p className="eyebrow">New draft</p>
      <h3>Create a resume</h3>
      <p>
        {isAtLimit
          ? `You have reached the ${maxResumes} resume limit. Delete an existing resume to create another.`
          : 'Start with a clean, editable resume using the default modern template.'}
      </p>
      <button disabled={isAtLimit} onClick={onCreate} type="button">
        {isAtLimit ? 'Resume limit reached' : 'Create resume'}
      </button>
      <span>{currentCount}/{maxResumes} saved</span>
    </article>
  );
}

export default NewResumeCard;
