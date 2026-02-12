/**
 * Know Your Rights (KYR) Scripts and Materials
 * Bilingual EN/ES content for ICE encounter scenarios
 * Based on ILRC, NILC, and ACLU guidance
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
        '"Please slide any warrant under the door."',
        '"I am exercising my right to remain silent."',
        '"I want to speak to a lawyer before answering any questions."'
      ],
      es: [
        '"No doy mi consentimiento para que entren a mi casa."',
        '"Por favor, deslice cualquier orden judicial por debajo de la puerta."',
        '"Estoy ejerciendo mi derecho a guardar silencio."',
        '"Quiero hablar con un abogado antes de contestar cualquier pregunta."'
      ]
    },
    whatNotToSay: {
      en: [
        'Do NOT say where you were born',
        'Do NOT discuss your immigration status',
        'Do NOT say how long you have been in the US',
        'Do NOT provide documents (passport, ID from another country)',
        'Do NOT lie or provide false documents'
      ],
      es: [
        'NO diga dónde nació',
        'NO discuta su estatus migratorio',
        'NO diga cuánto tiempo ha estado en EE.UU.',
        'NO proporcione documentos (pasaporte, identificación de otro país)',
        'NO mienta ni proporcione documentos falsos'
      ]
    },
    tips: {
      en: [
        'Do NOT open the door - speak through it or through a window',
        'Stay calm and be polite, but firm',
        'If you have children inside, ask a neighbor or friend to be ready to care for them',
        'Record the encounter if possible (video through window)',
        'Ask for the agent\'s name and badge number',
        'Remember: ICE cannot enter without a JUDICIAL warrant signed by a judge'
      ],
      es: [
        'NO abra la puerta - hable a través de ella o por una ventana',
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
        'Do NOT volunteer information about your immigration status',
        'Do NOT answer questions about where you were born',
        'Do NOT consent to a search',
        'Do NOT argue or resist physically'
      ],
      es: [
        'NO ofrezca información sobre su estatus migratorio',
        'NO conteste preguntas sobre dónde nació',
        'NO dé consentimiento para un registro',
        'NO discuta ni se resista físicamente'
      ]
    },
    tips: {
      en: [
        'Keep your hands visible on the steering wheel',
        'You must provide: license, registration, and proof of insurance',
        'You do NOT have to answer questions about citizenship or immigration status',
        'Do not run - this can be used against you',
        'If you are a passenger, you have the same rights to remain silent',
        'In some states, you must identify yourself (give your name) - but nothing more'
      ],
      es: [
        'Mantenga sus manos visibles en el volante',
        'Debe proporcionar: licencia, registro y prueba de seguro',
        'NO tiene que contestar preguntas sobre ciudadanía o estatus migratorio',
        'No corra - esto puede ser usado en su contra',
        'Si es pasajero, tiene los mismos derechos de guardar silencio',
        'En algunos estados, debe identificarse (dar su nombre) - pero nada más'
      ]
    },
    legalBasis: {
      en: 'Fifth Amendment: Right to remain silent. You cannot be compelled to answer questions that might incriminate you, including questions about immigration status.',
      es: 'Quinta Enmienda: Derecho a guardar silencio. No pueden obligarlo a contestar preguntas que puedan incriminarlo, incluyendo preguntas sobre estatus migratorio.'
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
        'Do NOT answer questions about your immigration status',
        'Do NOT sign anything without a lawyer',
        'Do NOT provide false documents',
        'Do NOT run or hide'
      ],
      es: [
        'NO conteste preguntas sobre su estatus migratorio',
        'NO firme nada sin un abogado',
        'NO proporcione documentos falsos',
        'NO corra ni se esconda'
      ]
    },
    tips: {
      en: [
        'Stay calm - running can be used against you',
        'You have the right to remain silent',
        'If you are in a public area of the workplace, agents may be able to question you',
        'If you are in a non-public area (like a warehouse or private office), ICE needs consent or a warrant',
        'Have an emergency plan prepared with trusted contacts',
        'Know your A-Number if you have one'
      ],
      es: [
        'Mantenga la calma - correr puede ser usado en su contra',
        'Tiene el derecho de guardar silencio',
        'Si está en un área pública del trabajo, los agentes pueden interrogarlo',
        'Si está en un área no pública (como un almacén u oficina privada), ICE necesita consentimiento o una orden',
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
        'Do NOT answer questions about where you were born',
        'Do NOT discuss your immigration status',
        'Do NOT provide foreign documents or passports',
        'Do NOT lie to officers'
      ],
      es: [
        'NO conteste preguntas sobre dónde nació',
        'NO discuta su estatus migratorio',
        'NO proporcione documentos extranjeros o pasaportes',
        'NO mienta a los oficiales'
      ]
    },
    tips: {
      en: [
        'Stay calm and keep your hands visible',
        'If you are not being detained, you are free to walk away',
        'Officers need "reasonable suspicion" to detain you',
        'You have the right to ask why you are being stopped',
        'Do not physically resist even if you believe your rights are being violated',
        'Try to remember details: badge numbers, car numbers, witnesses'
      ],
      es: [
        'Mantenga la calma y mantenga sus manos visibles',
        'Si no está detenido, es libre de irse',
        'Los oficiales necesitan "sospecha razonable" para detenerlo',
        'Tiene derecho a preguntar por qué lo están deteniendo',
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
        'Do NOT volunteer information about citizenship or immigration status',
        'Do NOT consent to a vehicle search',
        'Do NOT provide false information'
      ],
      es: [
        'NO ofrezca información sobre ciudadanía o estatus migratorio',
        'NO dé consentimiento para registrar su vehículo',
        'NO proporcione información falsa'
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
      en: 'Judicial Warrant (VALID for entry)',
      es: 'Orden Judicial (VÁLIDA para entrar)'
    },
    description: {
      en: 'A judicial warrant is issued by a judge or magistrate and authorizes law enforcement to enter your home.',
      es: 'Una orden judicial es emitida por un juez o magistrado y autoriza a las fuerzas del orden a entrar a su casa.'
    },
    characteristics: {
      en: [
        'Signed by a JUDGE or magistrate',
        'Has a court address and seal',
        'Lists the specific address to be searched',
        'States what officers are looking for',
        'Has an expiration date',
        'Issued by a COURT (not by ICE or DHS)'
      ],
      es: [
        'Firmada por un JUEZ o magistrado',
        'Tiene una dirección y sello del tribunal',
        'Lista la dirección específica a ser registrada',
        'Indica lo que los oficiales están buscando',
        'Tiene fecha de vencimiento',
        'Emitida por un TRIBUNAL (no por ICE o DHS)'
      ]
    },
    whatToDo: {
      en: [
        'Ask to see the warrant through a window or under the door',
        'Verify it has a judge\'s signature',
        'Check that your address is correct on the warrant',
        'If valid, you must allow entry (but can still remain silent)',
        'Do NOT physically resist'
      ],
      es: [
        'Pida ver la orden a través de una ventana o por debajo de la puerta',
        'Verifique que tenga la firma de un juez',
        'Compruebe que su dirección sea correcta en la orden',
        'Si es válida, debe permitir la entrada (pero aún puede guardar silencio)',
        'NO se resista físicamente'
      ]
    },
    lookFor: {
      en: [
        'Judge\'s signature (not just an ICE officer)',
        'Court letterhead and seal',
        'Your correct address',
        'Date (must not be expired)'
      ],
      es: [
        'Firma del juez (no solo un oficial de ICE)',
        'Membrete y sello del tribunal',
        'Su dirección correcta',
        'Fecha (no debe estar vencida)'
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
        'You have the RIGHT to refuse entry'
      ],
      es: [
        'NO abra la puerta',
        'Diga: "Esta no es una orden judicial. No doy mi consentimiento para su entrada."',
        'NO deje entrar a los agentes',
        'Guarde silencio - no conteste preguntas',
        'Tiene el DERECHO de rechazar la entrada'
      ]
    },
    lookFor: {
      en: [
        '"Department of Homeland Security" or "ICE" header',
        'Signature from ICE officer (not a judge)',
        'Form numbers like I-200, I-205, I-247',
        'No court seal'
      ],
      es: [
        'Encabezado del "Departamento de Seguridad Nacional" o "ICE"',
        'Firma de un oficial de ICE (no un juez)',
        'Números de formulario como I-200, I-205, I-247',
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
      instead: 'You do not have to show documents. Stay silent.'
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
      instead: 'No tiene que mostrar documentos. Guarde silencio.'
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
