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
  FL: {
    state: 'FL',
    stateName: 'Florida',
    legalCitation: 'Florida Statutes §§ 709.2105 and 743.0645',
    maxDuration: 'Until revoked, or an earlier stated expiration date',
    notarizationRequired: true,
    witnessesRequired: 2,
    template: {
      en: `POWER OF ATTORNEY FOR CARE OF MINOR CHILD
(Florida Statutes §§ 709.2105 and 743.0645)

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

EFFECTIVE DATE: [START_DATE]
OPTIONAL EXPIRATION DATE: [END_DATE]
If no expiration date is entered, this authorization continues until revoked in writing. It ends earlier if revoked.

SECOND PARENT (if sharing legal custody):
Name: _______________________
Address / phone: _______________________
Signature: _______________________ Date: _______________________
If both parents share legal custody, consider having both sign. Check any custody order and confirm the required authority with an attorney.

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

The foregoing instrument was acknowledged before me by means of [ ] physical presence or [ ] online notarization on [NOTARY_DATE] by [PARENT_NAME], who is personally known to me or produced _______________ as identification.

Notary signature and seal: _______________________
My Commission Expires: _______________

If a second parent signs, complete a separate acknowledgment for that signer.
SECOND PARENT ACKNOWLEDGMENT (if applicable):
State of Florida, County of _______________
The foregoing instrument was acknowledged before me by means of [ ] physical presence or [ ] online notarization on __________ by __________, who is personally known to me or produced __________ as identification.
Notary signature and seal: _______________________
My Commission Expires: _______________`,
      es: `PODER NOTARIAL PARA CUIDADO DE MENOR
(Estatutos de Florida §§ 709.2105 y 743.0645)

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

FECHA EFECTIVA: [START_DATE]
FECHA DE VENCIMIENTO OPCIONAL: [END_DATE]
Si no se indica una fecha de vencimiento, esta autorización continúa hasta su revocación por escrito. Termina antes si se revoca.

SEGUNDO PROGENITOR (si comparte la custodia legal):
Nombre: _______________________
Dirección / teléfono: _______________________
Firma: _______________________ Fecha: _______________________
Si ambos progenitores comparten la custodia legal, consideren firmar ambos. Revise cualquier orden de custodia y confirme la autoridad necesaria con un abogado.

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

El instrumento anterior fue reconocido ante mí mediante [ ] presencia física o [ ] notarización en línea el [NOTARY_DATE] por [PARENT_NAME], a quien conozco personalmente o quien presentó _______________ como identificación.

Firma y sello del notario: _______________________
Mi comisión vence: _______________

Si firma un segundo progenitor, complete un reconocimiento separado para esa persona.
RECONOCIMIENTO DEL SEGUNDO PROGENITOR (si corresponde):
Estado de Florida, Condado de _______________
El instrumento anterior fue reconocido ante mí mediante [ ] presencia física o [ ] notarización en línea el __________ por __________, a quien conozco personalmente o quien presentó __________ como identificación.
Firma y sello del notario: _______________________
Mi comisión vence: _______________`
    },
    instructions: {
      en: [
        'This form requires TWO witnesses AND notarization',
        'Witnesses must be 18+ and cannot be the caregiver',
        'Sign in front of both witnesses and the notary',
        'An optional expiration date can be entered; otherwise the document continues until revoked. Institutions may request a defined period.',
        'Keep original with caregiver, copies with schools and doctors'
      ],
      es: [
        'Este formulario requiere DOS testigos Y notarización',
        'Los testigos deben ser mayores de 18 y no pueden ser el cuidador',
        'Firme frente a ambos testigos y el notario',
        'Puede indicar una fecha de vencimiento opcional; de lo contrario continúa hasta su revocación. Las instituciones pueden pedir un plazo definido.',
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
  return ['CA', 'TX', 'FL', 'NY', 'IL'];
}

// Get template by state
export function getPOATemplate(state: string): POATemplate | null {
  return poaTemplates[state] || null;
}
