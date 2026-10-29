/**
 * Know Your Rights (KYR) Scripts and Materials
 * Bilingual EN/ES content for ICE encounter scenarios
 *
 * Sources, verified against the live pages 2026-08-27:
 * - kyrScripts (door, traffic, workplace, public, checkpoint scenarios):
 *   ILRC, "Know Your Rights When Confronted by ICE" flyer,
 *   https://www.ilrc.org/community-resources/know-your-rights/know-your-rights-when-confronted-ice-flyer
 *   and ACLU, "Immigrants' Rights" Know Your Rights hub (scenario accordions:
 *   "Police or ICE are at my home", "I was stopped by police, ICE, or Border
 *   Patrol while in transit", "ICE comes to my place of business with a
 *   search warrant or a subpoena seeking data or records", "I've been
 *   stopped by police or ICE"), https://www.aclu.org/know-your-rights/immigrants-rights
 * - warrantInfo (judicial vs. administrative warrant comparison, including
 *   the concealment-risk note and the I-200/I-205 form identifiers):
 *   NILC, "Know Your Rights: Warrants" (includes the Judicial /
 *   Administrative / Blackie's warrant comparison table),
 *   https://www.nilc.org/resources/know-your-rights-warrants/
 *   (site returns 403 to automated fetches; verified via user-provided page text)
 */

export interface KYRScript {
  id: string;
  scenario: {
    en: string;
    es: string;
  };
  whatToSay: {
    en: string[];
    es: string[];
  };
  whatNotToSay: {
    en: string[];
    es: string[];
  };
  tips: {
    en: string[];
    es: string[];
  };
  legalBasis: {
    en: string;
    es: string;
  };
}

export interface RedCardContent {
  id: string;
  type: 'wallet' | 'door' | 'window';
  title: {
    en: string;
    es: string;
    zh: string;
  };
  frontText: {
    en: string[];
    es: string[];
    zh: string[];
  };
  backText: {
    en: string[];
    es: string[];
    zh: string[];
  };
  instructions: {
    en: string;
    es: string;
    zh: string;
  };
}

export interface WarrantInfo {
  type: 'judicial' | 'administrative';
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  characteristics: {
    en: string[];
    es: string[];
  };
  whatToDo: {
    en: string[];
    es: string[];
  };
  lookFor: {
    en: string[];
    es: string[];
  };
}

// Encounter scripts for different scenarios
export const kyrScripts: KYRScript[] = [
  {
    id: 'door',
    scenario: {
      en: 'If ICE Comes to Your Door',
      es: 'Si ICE Viene a Su Puerta'
    },
    whatToSay: {
      en: [
        '"I do not consent to you entering my home."',
        'You can view a warrant without opening the door — for example: "Please slide any warrant under the door."',
        '"I am exercising my right to remain silent."',
        '"I want to speak to a lawyer before answering any questions."'
      ],
      es: [
        '"No doy mi consentimiento para que entren a mi casa."',
        'Puede ver una orden sin abrir la puerta — por ejemplo: "Por favor, deslice cualquier orden judicial por debajo de la puerta."',
        '"Estoy ejerciendo mi derecho a guardar silencio."',
        '"Quiero hablar con un abogado antes de contestar cualquier pregunta."'
      ]
    },
    whatNotToSay: {
      en: [
        'Sharing where you were born can help agents determine your removability',
        'Disclosing your immigration status can be used in enforcement proceedings',
        'Saying how long you have been in the US may affect your immigration case',
        'Providing foreign documents (passport, ID from another country) gives agents information they can use against you',
        'Providing false information or documents is a separate federal crime that creates additional charges'
      ],
      es: [
        'Decir dónde nació puede ayudar a los agentes a determinar su deportabilidad',
        'Revelar su estatus migratorio puede usarse en procedimientos de aplicación de ley',
        'Decir cuánto tiempo ha estado en EE.UU. puede afectar su caso migratorio',
        'Proporcionar documentos extranjeros (pasaporte, identificación de otro país) da a los agentes información que pueden usar en su contra',
        'Proporcionar información o documentos falsos es un crimen federal adicional que genera cargos separados'
      ]
    },
    tips: {
      en: [
        'Opening the door can be treated as consent to entry. Speak through the door or a window.',
        'Stay calm and be polite, but firm',
        'If you have children inside, ask a neighbor or friend to be ready to care for them',
        'Record the encounter if possible (video through window)',
        'Ask for the agent\'s name and badge number',
        'Remember: ICE cannot enter without a JUDICIAL warrant signed by a judge'
      ],
      es: [
        'Abrir la puerta puede interpretarse como consentimiento de entrada. Hable a través de la puerta o por una ventana.',
        'Mantenga la calma y sea cortés, pero firme',
        'Si tiene hijos adentro, pida a un vecino o amigo que esté listo para cuidarlos',
        'Grabe el encuentro si es posible (video a través de la ventana)',
        'Pida el nombre y número de placa del agente',
        'Recuerde: ICE no puede entrar sin una orden JUDICIAL firmada por un juez'
      ]
    },
    legalBasis: {
      en: 'Fourth Amendment: Protection against unreasonable searches. ICE cannot enter your home without consent or a valid judicial warrant signed by a judge.',
      es: 'Cuarta Enmienda: Protección contra registros irrazonables. ICE no puede entrar a su casa sin consentimiento o una orden judicial válida firmada por un juez.'
    }
  },
  {
    id: 'traffic',
    scenario: {
      en: 'If Stopped at a Traffic Stop',
      es: 'Si Lo Detienen en una Parada de Tráfico'
    },
    whatToSay: {
      en: [
        '"Am I free to go?"',
        '"I do not consent to a search of my vehicle."',
        '"I am exercising my right to remain silent."',
        '"I want to speak to a lawyer."'
      ],
      es: [
        '"¿Soy libre de irme?"',
        '"No doy mi consentimiento para que registren mi vehículo."',
        '"Estoy ejerciendo mi derecho a guardar silencio."',
        '"Quiero hablar con un abogado."'
      ]
    },
    whatNotToSay: {
      en: [
        'Volunteering your immigration status can be used in enforcement proceedings',
        'Answering questions about your birthplace can help agents determine removability',
        'Consenting to a search waives your Fourth Amendment right against unreasonable searches',
        'Arguing or resisting physically can result in additional criminal charges, even if the stop was unlawful'
      ],
      es: [
        'Ofrecer voluntariamente su estatus migratorio puede usarse en procedimientos de aplicación de ley',
        'Contestar preguntas sobre dónde nació puede ayudar a los agentes a determinar su deportabilidad',
        'Consentir un registro renuncia a su protección de la Cuarta Enmienda contra registros irrazonables',
        'Discutir o resistirse físicamente puede resultar en cargos criminales adicionales, aunque la detención haya sido ilegal'
      ]
    },
    tips: {
      en: [
        'Keep your hands visible on the steering wheel',
        'Drivers must provide license, registration, and proof of insurance as required by state law',
        'You do NOT have to answer questions about citizenship or immigration status',
        'Running can be used against you in immigration court and may result in additional criminal charges',
        'Passengers generally need not show ID solely because of a routine traffic stop. Separate lawful detention and identification laws may apply.',
        'During a lawful detention, some states require your name or limited identifying information. Noncitizens must show immigration papers they have with them when an immigration agent requests them; adults must carry issued registration documents.'
      ],
      es: [
        'Mantenga sus manos visibles en el volante',
        'Los conductores deben mostrar licencia, registro y comprobante de seguro según la ley estatal',
        'NO tiene que contestar preguntas sobre ciudadanía o estatus migratorio',
        'Correr puede ser usado en su contra en la corte de inmigración y puede resultar en cargos criminales adicionales',
        'Los pasajeros generalmente no tienen que mostrar identificación solo por una parada de tráfico rutinaria. Pueden aplicarse reglas distintas sobre detención legal e identificación.',
        'Durante una detención legal, algunos estados exigen el nombre u otros datos limitados. Los no ciudadanos deben mostrar los documentos migratorios que lleven si un agente de inmigración los pide; los adultos deben portar los documentos de registro emitidos.'
      ]
    },
    legalBasis: {
      en: 'Fourth Amendment: Protection against unreasonable stops and searches. Fifth Amendment: Protection against compelled self-incrimination. Identification and immigration-document duties can still apply.',
      es: 'Cuarta Enmienda: Protección contra detenciones y registros irrazonables. Quinta Enmienda: Protección contra la autoincriminación forzada. Pueden seguir aplicándose obligaciones de identificación y documentos migratorios.'
    }
  },
  {
    id: 'workplace',
    scenario: {
      en: 'If ICE Comes to Your Workplace',
      es: 'Si ICE Viene a Su Trabajo'
    },
    whatToSay: {
      en: [
        '"I am exercising my right to remain silent."',
        '"I do not consent to any searches."',
        '"I want to speak to a lawyer."',
        '"Am I free to leave?"'
      ],
      es: [
        '"Estoy ejerciendo mi derecho a guardar silencio."',
        '"No doy mi consentimiento para ningún registro."',
        '"Quiero hablar con un abogado."',
        '"¿Soy libre de irme?"'
      ]
    },
    whatNotToSay: {
      en: [
        'Answering questions about your immigration status can be used in enforcement proceedings',
        'Signing documents without a lawyer may waive important rights — some forms are voluntary departure agreements',
        'Providing false documents is a federal crime that creates additional charges',
        'Running or hiding can be used against you and may result in additional charges'
      ],
      es: [
        'Contestar preguntas sobre su estatus migratorio puede usarse en procedimientos de aplicación de ley',
        'Firmar documentos sin un abogado puede renunciar a derechos importantes — algunos formularios son acuerdos de salida voluntaria',
        'Proporcionar documentos falsos es un crimen federal que genera cargos adicionales',
        'Correr o esconderse puede ser usado en su contra y puede resultar en cargos adicionales'
      ]
    },
    tips: {
      en: [
        'Stay calm - running can be used against you',
        'You have the right to remain silent',
        'If you are in a public area of the workplace, agents may be able to question you',
        'For non-public workplace areas, ICE generally needs consent or a judicial warrant signed by a judge, unless another legal exception applies. An administrative ICE warrant alone does not authorize entry.',
        'Employees may decline voluntary requests for papers, but immigration-document duties still apply: noncitizens must show immigration papers they have when an immigration agent requests them.',
        'Have an emergency plan prepared with trusted contacts',
        'Know your A-Number if you have one'
      ],
      es: [
        'Mantenga la calma - correr puede ser usado en su contra',
        'Tiene el derecho de guardar silencio',
        'Si está en un área pública del trabajo, los agentes pueden interrogarlo',
        'Para áreas no públicas del trabajo, ICE generalmente necesita consentimiento u orden judicial firmada por un juez, salvo otra excepción legal. Una orden administrativa de ICE por sí sola no autoriza la entrada.',
        'Los empleados pueden rechazar solicitudes voluntarias de papeles, pero siguen aplicándose deberes migratorios: los no ciudadanos deben mostrar los documentos migratorios que lleven si un agente de inmigración los solicita.',
        'Tenga un plan de emergencia preparado con contactos de confianza',
        'Sepa su número A si tiene uno'
      ]
    },
    legalBasis: {
      en: 'Fourth and Fifth Amendments: You have the right to remain silent and to refuse searches. Employers cannot retaliate against you for exercising your rights.',
      es: 'Cuarta y Quinta Enmiendas: Tiene el derecho de guardar silencio y de rechazar registros. Los empleadores no pueden tomar represalias contra usted por ejercer sus derechos.'
    }
  },
  {
    id: 'public',
    scenario: {
      en: 'If Stopped in Public',
      es: 'Si Lo Detienen en Público'
    },
    whatToSay: {
      en: [
        '"Am I being detained or am I free to go?"',
        '"I am exercising my right to remain silent."',
        '"I do not consent to a search."',
        '"I want to speak to a lawyer."'
      ],
      es: [
        '"¿Estoy detenido o soy libre de irme?"',
        '"Estoy ejerciendo mi derecho a guardar silencio."',
        '"No doy mi consentimiento para un registro."',
        '"Quiero hablar con un abogado."'
      ]
    },
    whatNotToSay: {
      en: [
        'Answering questions about your birthplace can help agents determine your removability',
        'Discussing your immigration status can be used in enforcement proceedings',
        'Providing foreign documents or passports gives agents information they can use against you',
        'Lying to federal officers is a separate federal crime that creates additional charges'
      ],
      es: [
        'Contestar preguntas sobre dónde nació puede ayudar a los agentes a determinar su deportabilidad',
        'Discutir su estatus migratorio puede usarse en procedimientos de aplicación de ley',
        'Proporcionar documentos extranjeros o pasaportes da a los agentes información que pueden usar en su contra',
        'Mentirle a los oficiales federales es un crimen federal separado que genera cargos adicionales'
      ]
    },
    tips: {
      en: [
        'Stay calm and keep your hands visible',
        'If you are not being detained, you are free to walk away',
        'Officers need "reasonable suspicion" to detain you',
        'You have the right to ask why you are being stopped',
        'During a lawful detention, state law may require your name or limited identifying information. Immigration-document duties also apply to noncitizens.',
        'Physically resisting, even if your rights are being violated, can result in additional criminal charges. Challenge unlawful stops through the courts afterward.',
        'Try to remember details: badge numbers, car numbers, witnesses'
      ],
      es: [
        'Mantenga la calma y mantenga sus manos visibles',
        'Si no está detenido, es libre de irse',
        'Los oficiales necesitan "sospecha razonable" para detenerlo',
        'Tiene derecho a preguntar por qué lo están deteniendo',
        'Durante una detención legal, la ley estatal puede exigir su nombre u otros datos limitados. Los no ciudadanos también tienen obligaciones de documentación migratoria.',
        'No se resista físicamente aunque crea que están violando sus derechos',
        'Trate de recordar detalles: números de placa, números de carro, testigos'
      ]
    },
    legalBasis: {
      en: 'Fourth Amendment: Officers need reasonable suspicion to stop you. Fifth Amendment: You have the right to remain silent.',
      es: 'Cuarta Enmienda: Los oficiales necesitan sospecha razonable para detenerlo. Quinta Enmienda: Tiene el derecho de guardar silencio.'
    }
  },
  {
    id: 'checkpoint',
    scenario: {
      en: 'If Stopped at a Checkpoint',
      es: 'Si Lo Detienen en un Punto de Control'
    },
    whatToSay: {
      en: [
        '"Am I free to go?"',
        '"I do not consent to a search."',
        '"I am exercising my right to remain silent."'
      ],
      es: [
        '"¿Soy libre de irme?"',
        '"No doy mi consentimiento para un registro."',
        '"Estoy ejerciendo mi derecho a guardar silencio."'
      ]
    },
    whatNotToSay: {
      en: [
        'Volunteering information about citizenship or immigration status can be used against you',
        'Consenting to a vehicle search waives your Fourth Amendment protections',
        'Providing false information to federal agents is a crime'
      ],
      es: [
        'Ofrecer información sobre ciudadanía o estatus migratorio puede ser usado en su contra',
        'Consentir un registro de su vehículo renuncia a sus protecciones de la Cuarta Enmienda',
        'Proporcionar información falsa a agentes federales es un crimen'
      ]
    },
    tips: {
      en: [
        'Border Patrol checkpoints can stop all vehicles briefly',
        'You do not have to answer questions about citizenship',
        'Brief questioning is allowed; extended detention requires reasonable suspicion',
        'You can refuse a vehicle search',
        'Interior checkpoints (not at the border) have more limitations',
        'If detained longer than a few minutes, ask "Am I free to go?"'
      ],
      es: [
        'Los puntos de control de la Patrulla Fronteriza pueden detener todos los vehículos brevemente',
        'No tiene que contestar preguntas sobre ciudadanía',
        'Se permite interrogatorio breve; la detención prolongada requiere sospecha razonable',
        'Puede rechazar un registro del vehículo',
        'Los puntos de control interiores (no en la frontera) tienen más limitaciones',
        'Si lo detienen más de unos minutos, pregunte "¿Soy libre de irme?"'
      ]
    },
    legalBasis: {
      en: 'While Border Patrol can operate checkpoints, they cannot detain you for extended periods without reasonable suspicion. You still have Fourth and Fifth Amendment protections.',
      es: 'Aunque la Patrulla Fronteriza puede operar puntos de control, no pueden detenerlo por períodos prolongados sin sospecha razonable. Aún tiene protecciones de la Cuarta y Quinta Enmiendas.'
    }
  }
];

// Red Card content for printable materials
export const redCardContent: RedCardContent[] = [
  {
    id: 'wallet',
    type: 'wallet',
    title: {
      en: 'Know Your Rights Card',
      es: 'Tarjeta Conozca Sus Derechos',
      zh: '了解您的权利卡'
    },
    frontText: {
      en: [
        'I do not wish to speak with you, answer your questions, or sign or hand you any documents based on my 5th Amendment rights.',
        'I do not consent to you or any other agent entering my home based on my 4th Amendment rights.'
      ],
      es: [
        'No deseo hablar con usted, contestar sus preguntas, ni firmar o entregarle ningún documento basándome en mis derechos de la 5ta Enmienda.',
        'No doy mi consentimiento para que usted o cualquier otro agente entre a mi casa basándome en mis derechos de la 4ta Enmienda.'
      ],
      zh: [
        '根据第五修正案的权利，我不愿意与您交谈、回答您的问题、或签署或交给您任何文件。',
        '根据第四修正案的权利，我不同意您或任何其他执法人员进入我的住所。'
      ]
    },
    backText: {
      en: [
        'I am choosing to exercise my constitutional rights.',
        'If you have a warrant signed by a judge, please slide it under the door.',
        'I will not open the door unless you show me a warrant signed by a judge.'
      ],
      es: [
        'Estoy eligiendo ejercer mis derechos constitucionales.',
        'Si tiene una orden firmada por un juez, por favor deslícela por debajo de la puerta.',
        'No abriré la puerta a menos que me muestre una orden firmada por un juez.'
      ],
      zh: [
        '我选择行使我的宪法权利。',
        '如果您有法官签署的搜查令，请从门缝下方递进来。',
        '除非您出示法官签署的搜查令，否则我不会开门。'
      ]
    },
    instructions: {
      en: 'Keep this card with you at all times. Show it through a window or slide it under the door if approached by immigration agents.',
      es: 'Mantenga esta tarjeta con usted en todo momento. Muéstrela a través de una ventana o deslícela por debajo de la puerta si se le acercan agentes de inmigración.',
      zh: '请随身携带这张卡片。如果移民执法人员接近您，请通过窗户展示或从门缝下方递出。'
    }
  },
  {
    id: 'door',
    type: 'door',
    title: {
      en: 'Door Hanger - Know Your Rights',
      es: 'Colgador de Puerta - Conozca Sus Derechos',
      zh: '门挂牌 - 了解您的权利'
    },
    frontText: {
      en: [
        'The residents of this home do not consent to entry without a judicial warrant.',
        'Please slide any warrant under the door.',
        'We choose to exercise our constitutional rights.'
      ],
      es: [
        'Los residentes de este hogar no dan su consentimiento para entrar sin una orden judicial.',
        'Por favor deslice cualquier orden judicial por debajo de la puerta.',
        'Elegimos ejercer nuestros derechos constitucionales.'
      ],
      zh: [
        '本住宅居民不同意在没有司法搜查令的情况下进入。',
        '请将任何搜查令从门缝下方递入。',
        '我们选择行使我们的宪法权利。'
      ]
    },
    backText: {
      en: [
        'Fourth Amendment: "The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated."',
        'Fifth Amendment: "No person shall be compelled in any criminal case to be a witness against himself."'
      ],
      es: [
        'Cuarta Enmienda: "El derecho del pueblo a la seguridad de sus personas, domicilios, papeles y efectos, contra registros y detenciones arbitrarias, no será violado."',
        'Quinta Enmienda: "Nadie estará obligado a testificar contra sí mismo en ningún caso criminal."'
      ],
      zh: [
        '第四修正案："人民的人身、住宅、文件和财产不受不合理搜查和扣押的权利，不得侵犯。"',
        '第五修正案："任何人不得在刑事案件中被迫自证其罪。"'
      ]
    },
    instructions: {
      en: 'Hang this on your door as a reminder of your rights. It can be shown to officers through a window.',
      es: 'Cuelgue esto en su puerta como recordatorio de sus derechos. Puede mostrarse a los oficiales a través de una ventana.',
      zh: '将此挂在您的门上，作为您权利的提醒。可以通过窗户向执法人员展示。'
    }
  },
  {
    id: 'window',
    type: 'window',
    title: {
      en: 'Window Sign - Know Your Rights',
      es: 'Letrero de Ventana - Conozca Sus Derechos',
      zh: '窗户标识 - 了解您的权利'
    },
    frontText: {
      en: [
        'TO ANY GOVERNMENT AGENT:',
        'We exercise our rights under the 4th and 5th Amendments.',
        'We do NOT consent to entry without a JUDICIAL warrant signed by a judge.',
        'We do NOT consent to searches.',
        'We choose to remain silent.'
      ],
      es: [
        'A CUALQUIER AGENTE DEL GOBIERNO:',
        'Ejercemos nuestros derechos bajo las Enmiendas 4ta y 5ta.',
        'NO damos consentimiento para entrar sin una orden JUDICIAL firmada por un juez.',
        'NO damos consentimiento para registros.',
        'Elegimos guardar silencio.'
      ],
      zh: [
        '致任何政府执法人员：',
        '我们行使第四和第五修正案赋予的权利。',
        '未经法官签署的司法搜查令，我们不同意进入。',
        '我们不同意搜查。',
        '我们选择保持沉默。'
      ]
    },
    backText: {
      en: [],
      es: [],
      zh: []
    },
    instructions: {
      en: 'Post this sign in a visible window near your main entrance.',
      es: 'Coloque este letrero en una ventana visible cerca de su entrada principal.',
      zh: '将此标识张贴在您主入口附近的可见窗户上。'
    }
  }
];

// Warrant comparison information
export const warrantInfo: WarrantInfo[] = [
  {
    type: 'judicial',
    title: {
      en: 'Judicial Warrant',
      es: 'Orden Judicial'
    },
    description: {
      en: 'A judicial warrant is issued by a judge or magistrate. Entry authority depends on the type of warrant, its scope, and the circumstances; an arrest warrant and a search warrant are not interchangeable.',
      es: 'Una orden judicial es emitida por un juez o magistrado. La autoridad para entrar depende del tipo de orden, su alcance y las circunstancias; una orden de arresto no equivale a una orden de registro.'
    },
    characteristics: {
      en: [
        'Signed by a JUDGE or magistrate',
        'Identifies the issuing court; formatting varies',
        'A search warrant identifies the place or person to be searched',
        'States what officers are looking for',
        'May specify an execution deadline; date rules vary by warrant type',
        'Issued by a COURT (not by ICE or DHS)'
      ],
      es: [
        'Firmada por un JUEZ o magistrado',
        'Identifica al tribunal emisor; el formato varía',
        'Una orden de registro identifica el lugar o persona que se registrará',
        'Indica lo que los oficiales están buscando',
        'Puede indicar un plazo de ejecución; las reglas varían según el tipo de orden',
        'Emitida por un TRIBUNAL (no por ICE o DHS)'
      ]
    },
    whatToDo: {
      en: [
        'Ask to see the warrant through a window or under the door',
        'Verify it has a judge\'s signature',
        'Check that your name and address are correct on the warrant',
        'Ask a lawyer about its scope. You can state that you do not consent and remain silent; do not obstruct officers.',
        'Do NOT physically resist'
      ],
      es: [
        'Pida ver la orden a través de una ventana o por debajo de la puerta',
        'Verifique que tenga la firma de un juez',
        'Compruebe que su nombre y dirección sean correctos en la orden',
        'Consulte su alcance con un abogado. Puede expresar que no consiente y guardar silencio; no obstruya a los agentes.',
        'NO se resista físicamente'
      ]
    },
    lookFor: {
      en: [
        'Judge\'s signature (not just an ICE officer)',
        'Issuing court, letterhead, and any seal',
        'Person or place identified and any limits on the search',
        'Issue date and any execution deadline; not necessarily today’s date'
      ],
      es: [
        'Firma del juez (no solo un oficial de ICE)',
        'Tribunal emisor, membrete y cualquier sello',
        'Persona o lugar identificado y cualquier límite del registro',
        'Fecha de emisión y cualquier plazo de ejecución; no necesariamente la fecha de hoy'
      ]
    }
  },
  {
    type: 'administrative',
    title: {
      en: 'Administrative Warrant (NOT valid for entry)',
      es: 'Orden Administrativa (NO válida para entrar)'
    },
    description: {
      en: 'An administrative warrant (ICE warrant) is NOT signed by a judge and does NOT give ICE the right to enter your home without your consent.',
      es: 'Una orden administrativa (orden de ICE) NO está firmada por un juez y NO le da a ICE el derecho de entrar a su casa sin su consentimiento.'
    },
    characteristics: {
      en: [
        'Signed by an ICE or DHS official (NOT a judge)',
        'Has "Department of Homeland Security" header',
        'May say "Immigration Warrant" or Form I-200, I-205',
        'No court seal or court address',
        'Issued by ICE, not by a court',
        'Does NOT authorize entry into homes'
      ],
      es: [
        'Firmada por un oficial de ICE o DHS (NO un juez)',
        'Tiene encabezado del "Departamento de Seguridad Nacional"',
        'Puede decir "Orden de Inmigración" o Formulario I-200, I-205',
        'Sin sello del tribunal ni dirección del tribunal',
        'Emitida por ICE, no por un tribunal',
        'NO autoriza la entrada a hogares'
      ]
    },
    whatToDo: {
      en: [
        'Do NOT open the door',
        'Say: "This is not a judicial warrant. I do not consent to your entry."',
        'Do NOT let agents inside',
        'Stay silent - do not answer questions',
        'You have the RIGHT to refuse entry',
        'If the warrant names someone specific who is home, falsely stating they are not there can lead to a separate charge called "concealment" - remaining silent is not the same as actively denying their presence'
      ],
      es: [
        'NO abra la puerta',
        'Diga: "Esta no es una orden judicial. No doy mi consentimiento para su entrada."',
        'NO deje entrar a los agentes',
        'Guarde silencio - no conteste preguntas',
        'Tiene el DERECHO de rechazar la entrada',
        'Si la orden nombra a una persona específica que está en casa, decir falsamente que no está ahí puede resultar en un cargo aparte llamado "ocultamiento" - guardar silencio no es lo mismo que negar activamente su presencia'
      ]
    },
    lookFor: {
      en: [
        '"Department of Homeland Security" or "ICE" header',
        'Signature from ICE officer (not a judge)',
        'Form numbers like I-200, I-205',
        'No court seal'
      ],
      es: [
        'Encabezado del "Departamento de Seguridad Nacional" o "ICE"',
        'Firma de un oficial de ICE (no un juez)',
        'Números de formulario como I-200, I-205',
        'Sin sello del tribunal'
      ]
    }
  }
];

// Common mistakes to avoid
export const commonMistakes = {
  en: [
    {
      mistake: 'Opening the door to see who it is',
      consequence: 'Once you open the door, agents may try to enter or see inside',
      instead: 'Speak through the closed door or through a window'
    },
    {
      mistake: 'Saying "I don\'t have papers"',
      consequence: 'This is an admission that can be used against you',
      instead: 'Say "I choose to remain silent" or "I want to speak to a lawyer"'
    },
    {
      mistake: 'Showing a foreign passport or ID',
      consequence: 'This reveals information about your nationality',
      instead: 'You can decline voluntary document requests, but identification and immigration-document duties may apply. Noncitizens must show immigration papers they have when an immigration agent requests them.'
    },
    {
      mistake: 'Running away or hiding',
      consequence: 'This can be used against you and may result in additional charges',
      instead: 'Stay calm, exercise your right to remain silent'
    },
    {
      mistake: 'Signing voluntary departure or other documents',
      consequence: 'You may be giving up important legal rights',
      instead: 'Never sign anything without speaking to a lawyer first'
    },
    {
      mistake: 'Lying about your status or identity',
      consequence: 'Lying can result in criminal charges and bars to future immigration relief',
      instead: 'Stay silent - you have the right not to answer'
    }
  ],
  es: [
    {
      mistake: 'Abrir la puerta para ver quién es',
      consequence: 'Una vez que abre la puerta, los agentes pueden intentar entrar o ver adentro',
      instead: 'Hable a través de la puerta cerrada o por una ventana'
    },
    {
      mistake: 'Decir "No tengo papeles"',
      consequence: 'Esta es una admisión que puede ser usada en su contra',
      instead: 'Diga "Elijo guardar silencio" o "Quiero hablar con un abogado"'
    },
    {
      mistake: 'Mostrar un pasaporte o identificación extranjera',
      consequence: 'Esto revela información sobre su nacionalidad',
      instead: 'Puede rechazar solicitudes voluntarias de documentos, pero pueden existir obligaciones de identificación y documentación migratoria. Los no ciudadanos deben mostrar los documentos migratorios que lleven cuando un agente de inmigración los solicite.'
    },
    {
      mistake: 'Correr o esconderse',
      consequence: 'Esto puede ser usado en su contra y puede resultar en cargos adicionales',
      instead: 'Mantenga la calma, ejerza su derecho a guardar silencio'
    },
    {
      mistake: 'Firmar salida voluntaria u otros documentos',
      consequence: 'Puede estar renunciando a derechos legales importantes',
      instead: 'Nunca firme nada sin hablar primero con un abogado'
    },
    {
      mistake: 'Mentir sobre su estatus o identidad',
      consequence: 'Mentir puede resultar en cargos criminales y barreras a futuros beneficios migratorios',
      instead: 'Guarde silencio - tiene el derecho de no contestar'
    }
  ]
};

// Emergency contacts
export const emergencyContacts = {
  national: [
    {
      name: {
        en: 'National Immigration Law Center (NILC)',
        es: 'Centro Nacional de Leyes de Inmigración (NILC)'
      },
      phone: '213-639-3900',
      website: 'https://www.nilc.org'
    },
    {
      name: {
        en: 'National Immigrant Justice Center (NIJC)',
        es: 'Centro Nacional de Justicia para Inmigrantes (NIJC)'
      },
      phone: '312-660-1370',
      website: 'https://www.immigrantjustice.org'
    },
    {
      name: {
        en: 'ACLU Immigrants\' Rights Project',
        es: 'Proyecto de Derechos de Inmigrantes de ACLU'
      },
      phone: '212-549-2660',
      website: 'https://www.aclu.org/issues/immigrants-rights'
    },
    {
      name: {
        en: 'United We Dream Hotline',
        es: 'Línea de United We Dream'
      },
      phone: '1-844-363-1423',
      website: 'https://unitedwedream.org'
    }
  ]
};
