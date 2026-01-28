/**
 * Power of Attorney Templates for Child Custody
 * State-specific variants for top 5 immigrant population states
 * DISCLAIMER: These are templates only and should be reviewed by an attorney
 */

export interface POATemplate {
  state: string;
  stateName: string;
  legalCitation: string;
  maxDuration: string;
  notarizationRequired: boolean;
  witnessesRequired: number;
  template: {
    en: string;
    es: string;
  };
  instructions: {
    en: string[];
    es: string[];
  };
  warnings: {
    en: string[];
    es: string[];
  };
}

export const poaTemplates: Record<string, POATemplate> = {
  CA: {
    state: 'CA',
    stateName: 'California',
    legalCitation: 'California Family Code Section 6550',
    maxDuration: '6 months (renewable)',
    notarizationRequired: false,
    witnessesRequired: 0,
    template: {
      en: `CAREGIVER'S AUTHORIZATION AFFIDAVIT
(California Family Code Section 6550)

PART A: TO BE COMPLETED BY PARENT/LEGAL GUARDIAN

I, [PARENT_NAME], am the parent / legal guardian having legal custody of the minor child(ren) listed below. I hereby authorize [CAREGIVER_NAME] to:

1. Enroll the minor in school and school-related activities
2. Consent to school-related medical care
3. Consent to medical, dental, and mental health care

Minor Child(ren) Information:
Name: [CHILD_NAME]
Date of Birth: [CHILD_DOB]
Current Address: [CHILD_ADDRESS]

This authorization is effective from [START_DATE] and shall remain in effect until [END_DATE], or until revoked in writing.

Parent/Guardian Signature: _______________________
Print Name: [PARENT_NAME]
Date: [SIGN_DATE]
Address: [PARENT_ADDRESS]
Phone: [PARENT_PHONE]

PART B: TO BE COMPLETED BY CAREGIVER

I, [CAREGIVER_NAME], declare:

1. My date of birth is [CAREGIVER_DOB]
2. My California driver's license or state ID number is [CAREGIVER_ID]
3. I am a resident of California
4. I am providing care and supervision of the minor child(ren) listed above
5. I understand this affidavit does not transfer legal custody

I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.

Caregiver Signature: _______________________
Print Name: [CAREGIVER_NAME]
Date: [SIGN_DATE]
Address: [CAREGIVER_ADDRESS]
Phone: [CAREGIVER_PHONE]`,
      es: `DECLARACIÓN JURADA DE AUTORIZACIÓN DE CUIDADOR
(Código de Familia de California Sección 6550)

PARTE A: COMPLETAR POR EL PADRE/TUTOR LEGAL

Yo, [PARENT_NAME], soy el padre / tutor legal con custodia legal del/los menor(es) listado(s) abajo. Por la presente autorizo a [CAREGIVER_NAME] a:

1. Inscribir al menor en la escuela y actividades escolares
2. Consentir atención médica relacionada con la escuela
3. Consentir atención médica, dental y de salud mental

Información del/los Menor(es):
Nombre: [CHILD_NAME]
Fecha de Nacimiento: [CHILD_DOB]
Dirección Actual: [CHILD_ADDRESS]

Esta autorización es efectiva desde [START_DATE] y permanecerá en efecto hasta [END_DATE], o hasta que sea revocada por escrito.

Firma del Padre/Tutor: _______________________
Nombre Impreso: [PARENT_NAME]
Fecha: [SIGN_DATE]
Dirección: [PARENT_ADDRESS]
Teléfono: [PARENT_PHONE]

PARTE B: COMPLETAR POR EL CUIDADOR

Yo, [CAREGIVER_NAME], declaro:

1. Mi fecha de nacimiento es [CAREGIVER_DOB]
2. Mi licencia de conducir o ID estatal de California es [CAREGIVER_ID]
3. Soy residente de California
4. Estoy proporcionando cuidado y supervisión del/los menor(es) listado(s) arriba
5. Entiendo que esta declaración no transfiere custodia legal

Declaro bajo pena de perjurio bajo las leyes del Estado de California que lo anterior es verdadero y correcto.

Firma del Cuidador: _______________________
Nombre Impreso: [CAREGIVER_NAME]
Fecha: [SIGN_DATE]
Dirección: [CAREGIVER_ADDRESS]
Teléfono: [CAREGIVER_PHONE]`
    },
    instructions: {
      en: [
        'Both the parent/guardian and caregiver must sign the form',
        'No notarization is required under California law',
        'Keep the original form with the caregiver',
        'Give copies to the school and healthcare providers',
        'The form is valid for up to 6 months and can be renewed'
      ],
      es: [
        'Tanto el padre/tutor como el cuidador deben firmar el formulario',
        'No se requiere notarización bajo la ley de California',
        'Mantenga el formulario original con el cuidador',
        'Dé copias a la escuela y proveedores de salud',
        'El formulario es válido por hasta 6 meses y puede renovarse'
      ]
    },
    warnings: {
      en: [
        'This form does NOT transfer legal custody of your child',
        'You can revoke this authorization at any time in writing',
        'This form is for temporary care situations only',
        'Consult an attorney for long-term custody arrangements'
      ],
      es: [
        'Este formulario NO transfiere la custodia legal de su hijo',
        'Puede revocar esta autorización en cualquier momento por escrito',
        'Este formulario es solo para situaciones de cuidado temporal',
        'Consulte a un abogado para arreglos de custodia a largo plazo'
      ]
    }
  },
  TX: {
    state: 'TX',
    stateName: 'Texas',
    legalCitation: 'Texas Family Code Section 34.0015',
    maxDuration: '1 year',
    notarizationRequired: true,
    witnessesRequired: 0,
    template: {
      en: `AUTHORIZATION AGREEMENT FOR NONPARENT RELATIVE
(Texas Family Code Section 34.0015)

I, [PARENT_NAME], as parent/legal guardian of [CHILD_NAME], born on [CHILD_DOB], hereby authorize [CAREGIVER_NAME] to:

1. Authorize medical, dental, psychiatric, psychological, or surgical treatment
2. Authorize educational decisions including enrollment, discipline, and activities
3. Authorize participation in extracurricular activities
4. Obtain copies of educational and medical records

This authorization does not include the right to consent to marriage or adoption of the child.

Child's Information:
Full Name: [CHILD_NAME]
Date of Birth: [CHILD_DOB]
Current Address: [CHILD_ADDRESS]

Duration: This authorization shall be effective from [START_DATE] until [END_DATE], not to exceed one year.

Parent/Guardian Information:
Name: [PARENT_NAME]
Address: [PARENT_ADDRESS]
Phone: [PARENT_PHONE]

Authorized Caregiver Information:
Name: [CAREGIVER_NAME]
Address: [CAREGIVER_ADDRESS]
Phone: [CAREGIVER_PHONE]
Relationship to Child: [RELATIONSHIP]

_______________________
Parent/Guardian Signature

_______________________
Date

STATE OF TEXAS
COUNTY OF _______________

This instrument was acknowledged before me on [NOTARY_DATE] by [PARENT_NAME].

_______________________
Notary Public, State of Texas
My Commission Expires: _______________`,
      es: `ACUERDO DE AUTORIZACIÓN PARA PARIENTE NO PADRE
(Código de Familia de Texas Sección 34.0015)

Yo, [PARENT_NAME], como padre/tutor legal de [CHILD_NAME], nacido(a) el [CHILD_DOB], por la presente autorizo a [CAREGIVER_NAME] a:

1. Autorizar tratamiento médico, dental, psiquiátrico, psicológico o quirúrgico
2. Autorizar decisiones educativas incluyendo inscripción, disciplina y actividades
3. Autorizar participación en actividades extracurriculares
4. Obtener copias de registros educativos y médicos

Esta autorización no incluye el derecho a consentir el matrimonio o adopción del niño.

Información del Niño:
Nombre Completo: [CHILD_NAME]
Fecha de Nacimiento: [CHILD_DOB]
Dirección Actual: [CHILD_ADDRESS]

Duración: Esta autorización será efectiva desde [START_DATE] hasta [END_DATE], sin exceder un año.

Información del Padre/Tutor:
Nombre: [PARENT_NAME]
Dirección: [PARENT_ADDRESS]
Teléfono: [PARENT_PHONE]

Información del Cuidador Autorizado:
Nombre: [CAREGIVER_NAME]
Dirección: [CAREGIVER_ADDRESS]
Teléfono: [CAREGIVER_PHONE]
Relación con el Niño: [RELATIONSHIP]

_______________________
Firma del Padre/Tutor

_______________________
Fecha

ESTADO DE TEXAS
CONDADO DE _______________

Este instrumento fue reconocido ante mí el [NOTARY_DATE] por [PARENT_NAME].

_______________________
Notario Público, Estado de Texas
Mi Comisión Expira: _______________`
    },
    instructions: {
      en: [
        'This form MUST be notarized in Texas',
        'Take the unsigned form to a notary and sign in their presence',
        'Many banks, UPS stores, and shipping centers offer notary services',
        'The authorization is valid for up to 1 year',
        'Keep the original with the caregiver, provide copies to schools and doctors'
      ],
      es: [
        'Este formulario DEBE ser notarizado en Texas',
        'Lleve el formulario sin firmar a un notario y firme en su presencia',
        'Muchos bancos, tiendas UPS y centros de envío ofrecen servicios de notario',
        'La autorización es válida por hasta 1 año',
        'Mantenga el original con el cuidador, proporcione copias a escuelas y médicos'
      ]
    },
    warnings: {
      en: [
        'This form requires notarization to be valid',
        'The caregiver should be a relative (grandparent, aunt, uncle, adult sibling)',
        'This does NOT transfer legal custody',
        'Consult an attorney if you need permanent custody arrangements'
      ],
      es: [
        'Este formulario requiere notarización para ser válido',
        'El cuidador debe ser un pariente (abuelo, tía, tío, hermano adulto)',
        'Esto NO transfiere la custodia legal',
        'Consulte a un abogado si necesita arreglos de custodia permanentes'
      ]
    }
  },
  FL: {
    state: 'FL',
    stateName: 'Florida',
    legalCitation: 'Florida Statutes Section 709.2104',
    maxDuration: 'Until revoked',
    notarizationRequired: true,
    witnessesRequired: 2,
    template: {
      en: `POWER OF ATTORNEY FOR CARE OF MINOR CHILD
(Florida Statutes Section 709.2104)

I, [PARENT_NAME], residing at [PARENT_ADDRESS], being the parent / legal guardian of [CHILD_NAME], born on [CHILD_DOB], do hereby appoint [CAREGIVER_NAME], residing at [CAREGIVER_ADDRESS], as my attorney-in-fact for the following purposes:

POWERS GRANTED:
1. To enroll the child in school and make educational decisions
2. To consent to medical, dental, and mental health treatment
3. To consent to participation in activities and travel
4. To obtain copies of school and medical records
5. To make day-to-day decisions regarding the child's welfare

LIMITATIONS:
This power of attorney does NOT authorize the attorney-in-fact to:
- Consent to marriage or adoption of the child
- Change the child's legal name
- Consent to military enlistment

EFFECTIVE DATE: This power of attorney is effective immediately and shall remain in effect until revoked in writing.

IN WITNESS WHEREOF, I have signed this Power of Attorney on [SIGN_DATE].

_______________________
Principal (Parent/Guardian)
Print Name: [PARENT_NAME]

WITNESSES:

_______________________
Witness 1 Signature
Print Name: _______________
Address: _______________

_______________________
Witness 2 Signature
Print Name: _______________
Address: _______________

STATE OF FLORIDA
COUNTY OF _______________

Sworn to and subscribed before me on [NOTARY_DATE] by [PARENT_NAME], who is personally known to me or produced _______________ as identification.

_______________________
Notary Public, State of Florida
My Commission Expires: _______________`,
      es: `PODER NOTARIAL PARA CUIDADO DE MENOR
(Estatutos de Florida Sección 709.2104)

Yo, [PARENT_NAME], residente en [PARENT_ADDRESS], siendo el padre / tutor legal de [CHILD_NAME], nacido(a) el [CHILD_DOB], por la presente designo a [CAREGIVER_NAME], residente en [CAREGIVER_ADDRESS], como mi apoderado para los siguientes propósitos:

PODERES OTORGADOS:
1. Inscribir al niño en la escuela y tomar decisiones educativas
2. Consentir tratamiento médico, dental y de salud mental
3. Consentir participación en actividades y viajes
4. Obtener copias de registros escolares y médicos
5. Tomar decisiones diarias sobre el bienestar del niño

LIMITACIONES:
Este poder notarial NO autoriza al apoderado a:
- Consentir el matrimonio o adopción del niño
- Cambiar el nombre legal del niño
- Consentir alistamiento militar

FECHA EFECTIVA: Este poder notarial es efectivo inmediatamente y permanecerá en efecto hasta ser revocado por escrito.

EN FE DE LO CUAL, he firmado este Poder Notarial el [SIGN_DATE].

_______________________
Principal (Padre/Tutor)
Nombre Impreso: [PARENT_NAME]

TESTIGOS:

_______________________
Firma Testigo 1
Nombre Impreso: _______________
Dirección: _______________

_______________________
Firma Testigo 2
Nombre Impreso: _______________
Dirección: _______________

ESTADO DE FLORIDA
CONDADO DE _______________

Jurado y suscrito ante mí el [NOTARY_DATE] por [PARENT_NAME], quien es personalmente conocido por mí o presentó _______________ como identificación.

_______________________
Notario Público, Estado de Florida
Mi Comisión Expira: _______________`
    },
    instructions: {
      en: [
        'This form requires TWO witnesses AND notarization',
        'Witnesses must be 18+ and cannot be the caregiver',
        'Sign in front of both witnesses and the notary',
        'Florida does not set a time limit - valid until revoked',
        'Keep original with caregiver, copies with schools and doctors'
      ],
      es: [
        'Este formulario requiere DOS testigos Y notarización',
        'Los testigos deben ser mayores de 18 y no pueden ser el cuidador',
        'Firme frente a ambos testigos y el notario',
        'Florida no establece límite de tiempo - válido hasta ser revocado',
        'Mantenga el original con el cuidador, copias con escuelas y médicos'
      ]
    },
    warnings: {
      en: [
        'Both witnesses AND notarization are required',
        'Witnesses cannot be the appointed caregiver',
        'This does NOT transfer legal custody',
        'You can revoke this at any time in writing'
      ],
      es: [
        'Se requieren AMBOS testigos Y notarización',
        'Los testigos no pueden ser el cuidador designado',
        'Esto NO transfiere la custodia legal',
        'Puede revocar esto en cualquier momento por escrito'
      ]
    }
  },
  NY: {
    state: 'NY',
    stateName: 'New York',
    legalCitation: 'New York General Obligations Law Section 5-1551',
    maxDuration: '6 months (renewable)',
    notarizationRequired: true,
    witnessesRequired: 2,
    template: {
      en: `DESIGNATION OF PERSON IN PARENTAL RELATION
(New York General Obligations Law Section 5-1551)

I, [PARENT_NAME], am the parent/guardian of [CHILD_NAME], born on [CHILD_DOB].

I hereby designate [CAREGIVER_NAME] as a person in parental relation to my child for the following purposes:
• Educational matters including enrollment, records, and disciplinary conferences
• Medical, dental, and mental health care decisions
• Emergency medical treatment

Duration: This designation is effective from [START_DATE] and expires on [END_DATE], not to exceed six months.

Child's Information:
Name: [CHILD_NAME]
Date of Birth: [CHILD_DOB]
School: [SCHOOL_NAME]
Grade: [GRADE]

Parent/Guardian Information:
Name: [PARENT_NAME]
Address: [PARENT_ADDRESS]
Phone: [PARENT_PHONE]

Designated Person Information:
Name: [CAREGIVER_NAME]
Address: [CAREGIVER_ADDRESS]
Phone: [CAREGIVER_PHONE]
Relationship: [RELATIONSHIP]

_______________________
Parent/Guardian Signature
Date: [SIGN_DATE]

_______________________
Designated Person Signature (Acceptance)
Date: [SIGN_DATE]

Witness 1: _______________________ Date: _______________
Print Name: _______________

Witness 2: _______________________ Date: _______________
Print Name: _______________

STATE OF NEW YORK
COUNTY OF _______________

On [NOTARY_DATE], before me personally appeared [PARENT_NAME], known to me to be the person who executed this instrument.

_______________________
Notary Public`,
      es: `DESIGNACIÓN DE PERSONA EN RELACIÓN PARENTAL
(Ley de Obligaciones Generales de Nueva York Sección 5-1551)

Yo, [PARENT_NAME], soy el padre/tutor de [CHILD_NAME], nacido(a) el [CHILD_DOB].

Por la presente designo a [CAREGIVER_NAME] como persona en relación parental con mi hijo(a) para los siguientes propósitos:
• Asuntos educativos incluyendo inscripción, registros y conferencias disciplinarias
• Decisiones de atención médica, dental y salud mental
• Tratamiento médico de emergencia

Duración: Esta designación es efectiva desde [START_DATE] y expira el [END_DATE], sin exceder seis meses.

Información del Niño:
Nombre: [CHILD_NAME]
Fecha de Nacimiento: [CHILD_DOB]
Escuela: [SCHOOL_NAME]
Grado: [GRADE]

Información del Padre/Tutor:
Nombre: [PARENT_NAME]
Dirección: [PARENT_ADDRESS]
Teléfono: [PARENT_PHONE]

Información de la Persona Designada:
Nombre: [CAREGIVER_NAME]
Dirección: [CAREGIVER_ADDRESS]
Teléfono: [CAREGIVER_PHONE]
Relación: [RELATIONSHIP]

_______________________
Firma del Padre/Tutor
Fecha: [SIGN_DATE]

_______________________
Firma de la Persona Designada (Aceptación)
Fecha: [SIGN_DATE]

Testigo 1: _______________________ Fecha: _______________
Nombre Impreso: _______________

Testigo 2: _______________________ Fecha: _______________
Nombre Impreso: _______________

ESTADO DE NUEVA YORK
CONDADO DE _______________

El [NOTARY_DATE], ante mí compareció personalmente [PARENT_NAME], conocido(a) por mí como la persona que ejecutó este instrumento.

_______________________
Notario Público`
    },
    instructions: {
      en: [
        'Requires TWO witnesses and notarization',
        'The designated person must also sign to accept',
        'Valid for up to 6 months, can be renewed',
        'New York schools must honor this designation',
        'Keep original with designated person, copies with school'
      ],
      es: [
        'Requiere DOS testigos y notarización',
        'La persona designada también debe firmar para aceptar',
        'Válido por hasta 6 meses, puede renovarse',
        'Las escuelas de Nueva York deben honrar esta designación',
        'Mantenga el original con la persona designada, copias con la escuela'
      ]
    },
    warnings: {
      en: [
        'Both parent AND designated person must sign',
        'Two witnesses and notarization required',
        'Does NOT transfer legal custody',
        'Schools must accept this form by law'
      ],
      es: [
        'AMBOS el padre Y la persona designada deben firmar',
        'Se requieren dos testigos y notarización',
        'NO transfiere la custodia legal',
        'Las escuelas deben aceptar este formulario por ley'
      ]
    }
  },
  IL: {
    state: 'IL',
    stateName: 'Illinois',
    legalCitation: 'Illinois Power of Attorney Act (755 ILCS 45)',
    maxDuration: '1 year',
    notarizationRequired: true,
    witnessesRequired: 1,
    template: {
      en: `ILLINOIS STATUTORY SHORT FORM POWER OF ATTORNEY FOR HEALTH CARE AND PROPERTY
(Adapted for Minor Child Care)

I, [PARENT_NAME], of [PARENT_ADDRESS], being a parent/guardian of [CHILD_NAME], born [CHILD_DOB], hereby appoint:

[CAREGIVER_NAME]
[CAREGIVER_ADDRESS]
[CAREGIVER_PHONE]

as my agent (attorney-in-fact) for my minor child for the following purposes:

HEALTH CARE DECISIONS:
To consent to medical, dental, and mental health treatment for my child.

EDUCATIONAL DECISIONS:
To enroll my child in school, attend conferences, and make educational decisions.

PROPERTY/FINANCIAL:
To access funds I designate for my child's care and pay for necessities.

LIMITATIONS:
This power does NOT include authority to consent to marriage, adoption, or name change.

EFFECTIVE DATE: [START_DATE]
TERMINATION DATE: [END_DATE] (or upon written revocation)

Signature: _______________________
Print Name: [PARENT_NAME]
Date: [SIGN_DATE]

WITNESS CERTIFICATION:
I, _______________, witnessed the above signature.
Witness Signature: _______________________
Date: _______________
Address: _______________

NOTARIZATION:
STATE OF ILLINOIS, COUNTY OF _______________

This Power of Attorney was acknowledged before me on [NOTARY_DATE] by [PARENT_NAME].

_______________________
Notary Public
My Commission Expires: _______________`,
      es: `FORMA CORTA ESTATUTARIA DE PODER NOTARIAL DE ILLINOIS PARA ATENCIÓN MÉDICA Y PROPIEDAD
(Adaptado para Cuidado de Menor)

Yo, [PARENT_NAME], de [PARENT_ADDRESS], siendo padre/tutor de [CHILD_NAME], nacido(a) el [CHILD_DOB], por la presente designo:

[CAREGIVER_NAME]
[CAREGIVER_ADDRESS]
[CAREGIVER_PHONE]

como mi agente (apoderado) para mi hijo(a) menor para los siguientes propósitos:

DECISIONES DE SALUD:
Consentir tratamiento médico, dental y de salud mental para mi hijo(a).

DECISIONES EDUCATIVAS:
Inscribir a mi hijo(a) en la escuela, asistir a conferencias y tomar decisiones educativas.

PROPIEDAD/FINANZAS:
Acceder a fondos que designo para el cuidado de mi hijo(a) y pagar necesidades.

LIMITACIONES:
Este poder NO incluye autoridad para consentir matrimonio, adopción o cambio de nombre.

FECHA EFECTIVA: [START_DATE]
FECHA DE TERMINACIÓN: [END_DATE] (o tras revocación por escrito)

Firma: _______________________
Nombre Impreso: [PARENT_NAME]
Fecha: [SIGN_DATE]

CERTIFICACIÓN DE TESTIGO:
Yo, _______________, presencié la firma anterior.
Firma del Testigo: _______________________
Fecha: _______________
Dirección: _______________

NOTARIZACIÓN:
ESTADO DE ILLINOIS, CONDADO DE _______________

Este Poder Notarial fue reconocido ante mí el [NOTARY_DATE] por [PARENT_NAME].

_______________________
Notario Público
Mi Comisión Expira: _______________`
    },
    instructions: {
      en: [
        'Requires ONE witness and notarization',
        'The witness cannot be the appointed agent',
        'Valid for up to 1 year',
        'Illinois follows the Uniform Power of Attorney Act',
        'Keep original with agent, copies with school and healthcare providers'
      ],
      es: [
        'Requiere UN testigo y notarización',
        'El testigo no puede ser el agente designado',
        'Válido por hasta 1 año',
        'Illinois sigue la Ley Uniforme de Poder Notarial',
        'Mantenga el original con el agente, copias con la escuela y proveedores de salud'
      ]
    },
    warnings: {
      en: [
        'One witness and notarization are required',
        'The witness cannot be the caregiver',
        'This does NOT transfer legal custody',
        'Can be revoked at any time in writing'
      ],
      es: [
        'Se requiere un testigo y notarización',
        'El testigo no puede ser el cuidador',
        'Esto NO transfiere la custodia legal',
        'Puede revocarse en cualquier momento por escrito'
      ]
    }
  }
};

// Get all available states
export function getAvailableStates(): string[] {
  return Object.keys(poaTemplates);
}

// Get template by state
export function getPOATemplate(state: string): POATemplate | null {
  return poaTemplates[state] || null;
}
