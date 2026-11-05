// Public official-form destinations and accompanying reference guidance.
export interface OfficialCaregiverForm { stateName: string; title: string; url: string; source: string; en: string[]; es: string[]; }
export const officialCaregiverForms: Record<string, OfficialCaregiverForm> = {
  "CA": {
    "stateName": "California",
    "title": "Caregiver’s Authorization Affidavit",
    "url": "https://selfhelp.courts.ca.gov/sites/default/files/2026-01/Caregiver%20Authorization%20Affidavit-Jan2026%201.pdf",
    "source": "https://selfhelp.courts.ca.gov/guardianship/other-options",
    "en": [
      "Use the California Courts affidavit. The caregiver completes and signs it; a parent signature and notarization are not required.",
      "The caregiver must be at least 18 and the child must live in the caregiver’s home. The official form includes this declaration.",
      "Items 1–4 cover school enrollment and school-related medical care. A qualifying relative completing items 5–8 may also consent to broader medical, dental and mental health care, subject to the form’s conditions. A non-relative does not receive that broader authority from this affidavit.",
      "The 2026 form defines qualifying relatives by blood, adoption or affinity within the fifth degree, including the relationships specified on the form. Read its parent-notification and objection declarations before signing.",
      "There is no fixed six-month expiration. If the child stops living with the caregiver, the caregiver must notify the school and health care providers. This affidavit does not transfer legal custody."
    ],
    "es": [
      "Use la declaración de los Tribunales de California. La completa y firma el cuidador; no requiere la firma de un progenitor ni notarización.",
      "El cuidador debe tener al menos 18 años y el menor debe vivir en su hogar. El formulario oficial incluye esta declaración.",
      "Los puntos 1–4 cubren la inscripción escolar y la atención médica relacionada con la escuela. Un familiar que reúna los requisitos y complete los puntos 5–8 puede consentir atención médica, dental y de salud mental más amplia, según las condiciones del formulario. Un cuidador sin parentesco no recibe esa autoridad adicional mediante esta declaración.",
      "El formulario de 2026 define el parentesco por consanguinidad, adopción o afinidad hasta el quinto grado, incluidas las relaciones indicadas en el formulario. Lea las declaraciones sobre aviso a los progenitores y sus objeciones antes de firmar.",
      "No hay un vencimiento fijo de seis meses. Si el menor deja de vivir con el cuidador, este debe avisar a la escuela y a los proveedores de salud. La declaración no transfiere la custodia legal."
    ]
  },
  "TX": {
    "stateName": "Texas",
    "title": "DFPS Form 2638",
    "url": "https://www.dfps.texas.gov/Application/Forms/showFile.aspx?NAME=2638.pdf",
    "source": "https://tcss.legis.texas.gov/resources/FA/htm/FA.34.htm",
    "en": [
      "Use DFPS Form 2638 for an authorization agreement with a nonparent adult caregiver. The caregiver need not be a relative. Read all disclosures in the official form.",
      "The parent and adult caregiver must both sign and swear to the agreement before a notary. Arrange notarization for both signatures.",
      "Written court approval is required if there is an order or pending suit affecting the parent-child relationship, relevant custody/access litigation, or continuing exclusive court jurisdiction. An agreement executed without required approval is void.",
      "If a living parent whose rights have not been terminated does not sign, copies generally must be sent within 10 days by certified mail with return receipt AND first-class mail (or the specified international equivalents). Section 34.005(a-2) provides a limited documented family-violence exception.",
      "The statutory term is six months with automatic six-month renewals unless an earlier expiration, termination or court-authorized continuation applies. It is not capped at one year.",
      "The agreement does not transfer custody or guardianship and cannot authorize abortion or emergency contraception. A parent may demand the child’s return; follow § 34.008 for formal termination and notices."
    ],
    "es": [
      "Use el Formulario 2638 de DFPS para un acuerdo con un cuidador adulto que no sea progenitor. No tiene que ser familiar. Lea todas las advertencias del formulario oficial.",
      "El progenitor y el cuidador adulto deben firmar y prestar juramento ante notario. Organice la notarización de ambas firmas.",
      "Se requiere aprobación judicial escrita si existe una orden o demanda pendiente sobre la relación paterno-filial, un litigio pertinente sobre custodia o visitas, o jurisdicción judicial exclusiva continua. Sin la aprobación requerida, el acuerdo es nulo.",
      "Si un progenitor vivo cuyos derechos no se han extinguido no firma, generalmente deben enviarse copias dentro de 10 días por correo certificado con acuse de recibo Y correo de primera clase (o equivalentes internacionales indicados). El § 34.005(a-2) establece una excepción limitada por violencia familiar documentada.",
      "El plazo legal es de seis meses y se renueva automáticamente por períodos de seis meses, salvo vencimiento anticipado, terminación o continuación autorizada por el tribunal. No existe un límite fijo de un año.",
      "El acuerdo no transfiere la custodia ni tutela y no autoriza aborto ni anticoncepción de emergencia. Un progenitor puede exigir el regreso del menor; el § 34.008 regula la terminación formal y los avisos."
    ]
  },
  "NY": {
    "stateName": "New York",
    "title": "OCFS-4940: Designation of Person in Parental Relationship",
    "url": "https://dental.buffalo.edu/content/dam/dental/Pictures/Patients/patient-forms---documents/OCFS-4940-uae.pdf",
    "source": "https://www.nysenate.gov/legislation/laws/GOB/5-1552",
    "en": [
      "Use the official OCFS-4940 form (May 2025 revision), hosted here by the University at Buffalo. It includes the required declarations, consent and signature sections.",
      "A designation may last up to 12 months, not six. The statute does not require witnesses. For a period longer than 30 days, notarization and the designee’s written consent are required.",
      "For more than 30 days, include both parties’ addresses and phone numbers, each child’s birth date, a start date or triggering event, and a statement that no court order prohibits the designation.",
      "If a court order requires both parents to agree on education or health decisions, both must consent. Follow the second-parent and notary sections in the official form.",
      "A parent may revoke under § 5-1554 by oral or written notice or another act showing a specific intent to revoke. Notify the designee and relevant schools and health providers. This designation does not transfer legal custody."
    ],
    "es": [
      "Use el formulario oficial OCFS-4940 (revisión de mayo de 2025), alojado por la Universidad de Buffalo. Incluye las declaraciones, el consentimiento y las secciones de firmas requeridas.",
      "La designación puede durar hasta 12 meses, no seis. La ley no exige testigos. Para un plazo de más de 30 días se requieren notarización y consentimiento escrito de la persona designada.",
      "Para más de 30 días, incluya direcciones y teléfonos de ambas partes, fecha de nacimiento de cada menor, fecha o evento de inicio y declaración de que ninguna orden judicial prohíbe la designación.",
      "Si una orden exige el acuerdo de ambos progenitores sobre educación o salud, ambos deben consentir. Siga las secciones del segundo progenitor y del notario en el formulario oficial.",
      "El § 5-1554 permite revocar mediante aviso oral o escrito u otro acto que muestre intención específica de revocar. Avise a la persona designada y a las escuelas y proveedores de salud pertinentes. La designación no transfiere la custodia legal."
    ]
  }
};
