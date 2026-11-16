import { useTranslation } from "react-i18next";

export interface DiversionProgramCardProps {
  program: {
    name: string;
    state: string;
    county?: string;
    cities?: string[];
    jurisdictionType: string;
    programTypes: string[];
    eligibilityNotes?: string;
    contact?: {
      phone?: string;
      email?: string;
      url?: string;
    };
  };
}

export function DiversionProgramCard({ program }: DiversionProgramCardProps) {
  const { t } = useTranslation();

  const { contact } = program;
  return (
    <article className="diversion-result">
      <div lang="en">{program.state}<small>{[program.county, program.jurisdictionType].filter(Boolean).join(" · ")}</small></div>
      <div>
        <h2 lang="en">{program.name}</h2>
        <p lang="en">{program.programTypes.join(" · ")}</p>
        <details>
          <summary>{t("diversionPrograms.directory.details")}</summary>
          <div className="diversion-details">
            <h3>{t("diversionPrograms.programCard.location")}</h3>
            <p lang="en">{program.cities?.join(", ") || program.county || program.state}</p>
            {program.eligibilityNotes && <>
              <h3>{t("diversionPrograms.programCard.eligibility")}</h3>
              <p lang="en">{program.eligibilityNotes}</p>
            </>}
            <div className="diversion-contacts">
              {contact?.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}
              {contact?.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
              {contact?.url && <a href={contact.url} target="_blank" rel="noopener noreferrer">{t("diversionPrograms.programCard.visitWebsite")}</a>}
            </div>
          </div>
        </details>
      </div>
    </article>
  );
}
