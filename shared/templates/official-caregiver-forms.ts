// Government-issued caregiver forms; instructions do not replace the issuing authority’s document.
export interface OfficialCaregiverForm { stateName: string; title: string; url: string; source: string; format: "PDF" | "DOCX"; en: string[]; es: string[]; }
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
    ],
    "format": "PDF"
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
    ],
    "format": "PDF"
  },
  "FL": {
    "stateName": "Florida",
    "title": "Temporary Power of Attorney for the Care of Children",
    "format": "PDF",
    "url": "https://www.15thcircuit.com/sites/default/files/court-admin/law-library/forms-download/Power-of-Attorney-Temporary-for-the-Care-of-Children-fillable.pdf",
    "source": "https://www.15thcircuit.com/services/law-library/legal-forms",
    "en": [
      "Use the child-care power of attorney published by Florida’s Fifteenth Judicial Circuit law library. This is a court-provided resource, not a promise that it fits every family or will be accepted everywhere.",
      "The form provides two witness signatures and a notarial acknowledgment, consistent with the execution requirements in Florida Statutes § 709.2105. It includes spaces for both parents, the children, the caregiver and the effective dates.",
      "Check any existing custody order and ask an attorney which parents must sign and what authority can be delegated. A power of attorney is not a court order granting temporary custody or guardianship. Medical-consent rules, including § 743.0645, may also matter.",
      "The court form contains both start and end dates. Follow that form’s instructions and confirm duration, revocation and scope with an attorney rather than assuming a universal one-year limit. OpenDefender does not alter the court’s document."
    ],
    "es": [
      "Use el poder para el cuidado de menores publicado por la biblioteca jurídica del Decimoquinto Circuito Judicial de Florida. Es un recurso del tribunal, no una garantía de que sea adecuado para todas las familias ni aceptado en todos los lugares.",
      "El formulario incluye las firmas de dos testigos y un reconocimiento notarial, de acuerdo con los requisitos de firma del § 709.2105 de los Estatutos de Florida. Tiene espacios para ambos progenitores, los menores, el cuidador y las fechas de vigencia.",
      "Revise cualquier orden de custodia existente y consulte con un abogado qué progenitores deben firmar y qué autoridad pueden delegar. Un poder no es una orden judicial de custodia temporal o tutela. También pueden ser pertinentes las reglas de consentimiento médico, incluido el § 743.0645.",
      "El formulario del tribunal contiene fechas de inicio y finalización. Siga sus instrucciones y confirme duración, revocación y alcance con un abogado, sin suponer un límite universal de un año. OpenDefender no modifica el documento del tribunal."
    ]
  },
  "NY": {
    "stateName": "New York",
    "title": "OCFS-4940: Designation of Person in Parental Relationship",
    "url": "https://ocfs.ny.gov/forms/ocfs/ocfs-4940/OCFS-4940.docx",
    "source": "https://www.nysenate.gov/legislation/laws/GOB/5-1552",
    "en": [
      "Use OCFS-4940 directly from the New York State Office of Children and Family Services. The agency form includes the declarations, consent and signature sections.",
      "A designation may last up to 12 months, not six. The statute does not require witnesses. For a period longer than 30 days, notarization and the designee’s written consent are required.",
      "For more than 30 days, include both parties’ addresses and phone numbers, each child’s birth date, a start date or triggering event, and a statement that no court order prohibits the designation.",
      "If a court order requires both parents to agree on education or health decisions, both must consent. Follow the second-parent and notary sections in the official form.",
      "A parent may revoke under § 5-1554 by oral or written notice or another act showing a specific intent to revoke. Notify the designee and relevant schools and health providers. This designation does not transfer legal custody."
    ],
    "es": [
      "Use OCFS-4940 directamente de la Oficina de Servicios para Niños y Familias del Estado de Nueva York. El formulario de la agencia incluye las declaraciones, el consentimiento y las secciones de firmas.",
      "La designación puede durar hasta 12 meses, no seis. La ley no exige testigos. Para un plazo de más de 30 días se requieren notarización y consentimiento escrito de la persona designada.",
      "Para más de 30 días, incluya direcciones y teléfonos de ambas partes, fecha de nacimiento de cada menor, fecha o evento de inicio y declaración de que ninguna orden judicial prohíbe la designación.",
      "Si una orden exige el acuerdo de ambos progenitores sobre educación o salud, ambos deben consentir. Siga las secciones del segundo progenitor y del notario en el formulario oficial.",
      "El § 5-1554 permite revocar mediante aviso oral o escrito u otro acto que muestre intención específica de revocar. Avise a la persona designada y a las escuelas y proveedores de salud pertinentes. La designación no transfiere la custodia legal."
    ],
    "format": "DOCX"
  },
  "IL": {
    "stateName": "Illinois",
    "title": "CFS 444-2: Appointment of Short-Term Guardian",
    "format": "PDF",
    "url": "https://dcfs.illinois.gov/content/dam/soi/en/web/dcfs/documents/about-us/policy-rules-and-forms/documents/cfs-400/cfs-444-2-appointment-of-short-term-guardian-fillable.pdf",
    "source": "https://www.ilga.gov/documents/legislation/ilcs/documents/075500050K11-5.4.htm",
    "en": [
      "Use DCFS Form CFS 444-2 under 755 ILCS 5/11-5.4, not a power of attorney for the parent’s own affairs. Complete a separate form for each child.",
      "The appointing parent signs before two credible witnesses age 18 or older; neither may be the appointed guardian. The guardian also signs, but may sign at a different time. This statute does not require notarization.",
      "The other living parent must sign consent when their parental rights remain intact, their whereabouts are known, and they are willing and able to make day-to-day child-care decisions.",
      "The ordinary term is up to 365 days. Earlier termination, military-service extensions and renewal during a continuing administrative separation have specific statutory rules. A parent may terminate the appointment; parental rights remain intact.",
      "An existing guardian or juvenile-court case requires particular care. Follow the form’s existing-guardian restriction and obtain legal advice about court orders. A juvenile court may vacate an appointment under subsection (e-5); the form cannot override a court order.",
      "Authority under § 11-13.2 concerns the child’s care and has limited property powers. This is not a general financial power of attorney. Read the form’s witness certification, acceptance and other-parent consent sections."
    ],
    "es": [
      "Use el Formulario CFS 444-2 de DCFS conforme a 755 ILCS 5/11-5.4, no un poder para los asuntos propios del progenitor. Complete un formulario por cada menor.",
      "El progenitor que designa firma ante dos testigos dignos de crédito de al menos 18 años; ninguno puede ser el tutor designado. El tutor también firma, pero puede hacerlo en otro momento. Esta ley no exige notarización.",
      "El otro progenitor vivo debe firmar su consentimiento si conserva sus derechos parentales, se conoce su paradero y está dispuesto y capacitado para tomar decisiones cotidianas sobre el cuidado del menor.",
      "El plazo ordinario es de hasta 365 días. La terminación anticipada, las extensiones por servicio militar y la renovación durante una separación administrativa continua tienen reglas legales específicas. Un progenitor puede terminar la designación; conserva sus derechos parentales.",
      "Un tutor existente o un caso ante el tribunal de menores requiere especial cuidado. Siga la restricción del formulario sobre tutores existentes y obtenga asesoría sobre las órdenes judiciales. El tribunal de menores puede dejar sin efecto la designación conforme al inciso (e-5); el formulario no anula una orden judicial.",
      "La autoridad del § 11-13.2 se refiere al cuidado del menor y tiene facultades patrimoniales limitadas. No es un poder financiero general. Lea las secciones de certificación de testigos, aceptación y consentimiento del otro progenitor."
    ]
  }
};
