import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Building2,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  Phone,
  ChevronRight
} from 'lucide-react';

interface ScenarioStep {
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  doItems: {
    en: string[];
    es: string[];
  };
  dontItems: {
    en: string[];
    es: string[];
  };
}

interface Scenario {
  id: string;
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  icon: React.ReactNode;
  criticalAlert: {
    en: string;
    es: string;
  };
  steps: ScenarioStep[];
  afterEncounter: {
    en: string[];
    es: string[];
  };
}

const scenarios: Scenario[] = [
  {
    id: 'home',
    title: {
      en: 'If ICE Comes to Your HOME',
      es: 'Si ICE Viene a Su CASA'
    },
    description: {
      en: 'What to do if immigration agents come to your residence',
      es: 'Qué hacer si agentes de inmigración vienen a su residencia'
    },
    icon: <Home className="h-6 w-6" />,
    criticalAlert: {
      en: 'Do NOT open the door! ICE cannot enter without a judicial warrant signed by a judge.',
      es: '¡NO abra la puerta! ICE no puede entrar sin una orden judicial firmada por un juez.'
    },
    steps: [
      {
        title: {
          en: 'Step 1: Do NOT Open the Door',
          es: 'Paso 1: NO Abra la Puerta'
        },
        description: {
          en: 'Speak through the closed door or through a window.',
          es: 'Hable a través de la puerta cerrada o por una ventana.'
        },
        doItems: {
          en: [
            'Ask: "Who is it?" and "Why are you here?"',
            'Ask to see identification through the window',
            'Stay calm and speak clearly'
          ],
          es: [
            'Pregunte: "¿Quién es?" y "¿Por qué están aquí?"',
            'Pida ver identificación a través de la ventana',
            'Mantenga la calma y hable claramente'
          ]
        },
        dontItems: {
          en: [
            'Don\'t open the door to "see who it is"',
            'Don\'t let anyone inside',
            'Don\'t reach outside or step outside'
          ],
          es: [
            'No abra la puerta para "ver quién es"',
            'No deje entrar a nadie',
            'No saque la mano ni salga afuera'
          ]
        }
      },
      {
        title: {
          en: 'Step 2: Ask for the Warrant',
          es: 'Paso 2: Pida la Orden'
        },
        description: {
          en: 'Ask them to slide any warrant under the door so you can inspect it.',
          es: 'Pídales que deslicen cualquier orden por debajo de la puerta para inspeccionarla.'
        },
        doItems: {
          en: [
            'Say: "Please slide the warrant under the door"',
            'Check if it\'s signed by a JUDGE (not ICE)',
            'Verify your correct address is on it'
          ],
          es: [
            'Diga: "Por favor deslice la orden por debajo de la puerta"',
            'Verifique si está firmada por un JUEZ (no ICE)',
            'Confirme que su dirección correcta esté en ella'
          ]
        },
        dontItems: {
          en: [
            'Don\'t assume any paper is a valid warrant',
            'Don\'t open the door to receive documents'
          ],
          es: [
            'No asuma que cualquier papel es una orden válida',
            'No abra la puerta para recibir documentos'
          ]
        }
      },
      {
        title: {
          en: 'Step 3: Exercise Your Rights',
          es: 'Paso 3: Ejerza Sus Derechos'
        },
        description: {
          en: 'Clearly state that you are exercising your constitutional rights.',
          es: 'Declare claramente que está ejerciendo sus derechos constitucionales.'
        },
        doItems: {
          en: [
            'Say: "I do not consent to your entry"',
            'Say: "I am exercising my right to remain silent"',
            'Say: "I want to speak to a lawyer"'
          ],
          es: [
            'Diga: "No doy mi consentimiento para su entrada"',
            'Diga: "Estoy ejerciendo mi derecho a guardar silencio"',
            'Diga: "Quiero hablar con un abogado"'
          ]
        },
        dontItems: {
          en: [
            'Don\'t answer questions about immigration status',
            'Don\'t provide documents showing nationality',
            'Don\'t lie or give false information'
          ],
          es: [
            'No conteste preguntas sobre estatus migratorio',
            'No proporcione documentos que muestren nacionalidad',
            'No mienta ni dé información falsa'
          ]
        }
      }
    ],
    afterEncounter: {
      en: [
        'Write down everything that happened (time, agents\' names, what was said)',
        'Contact an immigration lawyer immediately',
        'Report the incident to a local immigrant rights organization',
        'Do not sign any documents without legal advice'
      ],
      es: [
        'Escriba todo lo que pasó (hora, nombres de agentes, lo que se dijo)',
        'Contacte a un abogado de inmigración inmediatamente',
        'Reporte el incidente a una organización local de derechos de inmigrantes',
        'No firme ningún documento sin consejo legal'
      ]
    }
  },
  {
    id: 'workplace',
    title: {
      en: 'If ICE Comes to Your WORKPLACE',
      es: 'Si ICE Viene a Su TRABAJO'
    },
    description: {
      en: 'What to do if immigration agents come to your place of work',
      es: 'Qué hacer si agentes de inmigración vienen a su lugar de trabajo'
    },
    icon: <Building2 className="h-6 w-6" />,
    criticalAlert: {
      en: 'Stay calm. Do NOT run. You have the right to remain silent.',
      es: 'Mantenga la calma. NO corra. Tiene derecho a guardar silencio.'
    },
    steps: [
      {
        title: {
          en: 'Step 1: Stay Calm, Don\'t Run',
          es: 'Paso 1: Mantenga la Calma, No Corra'
        },
        description: {
          en: 'Running can be used against you and may result in injury.',
          es: 'Correr puede ser usado en su contra y puede resultar en lesiones.'
        },
        doItems: {
          en: [
            'Stay where you are if safe to do so',
            'Keep your hands visible',
            'Remain calm and quiet'
          ],
          es: [
            'Quédese donde está si es seguro hacerlo',
            'Mantenga sus manos visibles',
            'Permanezca calmado y callado'
          ]
        },
        dontItems: {
          en: [
            'Don\'t run or hide',
            'Don\'t make sudden movements',
            'Don\'t resist physically'
          ],
          es: [
            'No corra ni se esconda',
            'No haga movimientos bruscos',
            'No se resista físicamente'
          ]
        }
      },
      {
        title: {
          en: 'Step 2: Exercise Your Rights',
          es: 'Paso 2: Ejerza Sus Derechos'
        },
        description: {
          en: 'You have the right to remain silent and to an attorney.',
          es: 'Tiene derecho a guardar silencio y a un abogado.'
        },
        doItems: {
          en: [
            'Say: "I am exercising my right to remain silent"',
            'Say: "I want to speak to a lawyer"',
            'You can ask: "Am I free to leave?"'
          ],
          es: [
            'Diga: "Estoy ejerciendo mi derecho a guardar silencio"',
            'Diga: "Quiero hablar con un abogado"',
            'Puede preguntar: "¿Soy libre de irme?"'
          ]
        },
        dontItems: {
          en: [
            'Don\'t answer questions about status, birthplace, or nationality',
            'Don\'t sign any documents',
            'Don\'t show foreign IDs or passports'
          ],
          es: [
            'No conteste preguntas sobre estatus, lugar de nacimiento o nacionalidad',
            'No firme ningún documento',
            'No muestre identificaciones o pasaportes extranjeros'
          ]
        }
      },
      {
        title: {
          en: 'Step 3: Know Your Employer\'s Rights',
          es: 'Paso 3: Conozca los Derechos de Su Empleador'
        },
        description: {
          en: 'Your employer has rights during a workplace raid as well.',
          es: 'Su empleador también tiene derechos durante una redada laboral.'
        },
        doItems: {
          en: [
            'Employers can ask to see a warrant',
            'Employers can limit agents to public areas without a warrant',
            'Employers should contact their attorney'
          ],
          es: [
            'Los empleadores pueden pedir ver una orden',
            'Los empleadores pueden limitar a los agentes a áreas públicas sin orden',
            'Los empleadores deben contactar a su abogado'
          ]
        },
        dontItems: {
          en: [
            'Employers cannot be forced to provide employee records without a warrant',
            'Employers should not consent to searches of non-public areas'
          ],
          es: [
            'Los empleadores no pueden ser forzados a dar registros de empleados sin orden',
            'Los empleadores no deben consentir registros de áreas no públicas'
          ]
        }
      }
    ],
    afterEncounter: {
      en: [
        'Write down names and badge numbers of agents',
        'Note the time and what happened',
        'Contact your emergency contact person',
        'Seek legal help immediately'
      ],
      es: [
        'Escriba los nombres y números de placa de los agentes',
        'Anote la hora y lo que sucedió',
        'Contacte a su persona de contacto de emergencia',
        'Busque ayuda legal inmediatamente'
      ]
    }
  },
  {
    id: 'public',
    title: {
      en: 'If Stopped in PUBLIC',
      es: 'Si Lo Detienen en PÚBLICO'
    },
    description: {
      en: 'What to do if approached by immigration agents in a public place',
      es: 'Qué hacer si se le acercan agentes de inmigración en un lugar público'
    },
    icon: <Users className="h-6 w-6" />,
    criticalAlert: {
      en: 'Ask: "Am I being detained or am I free to go?" If free to go, calmly walk away.',
      es: 'Pregunte: "¿Estoy detenido o soy libre de irme?" Si es libre de irse, váyase calmadamente.'
    },
    steps: [
      {
        title: {
          en: 'Step 1: Determine If You\'re Detained',
          es: 'Paso 1: Determine Si Está Detenido'
        },
        description: {
          en: 'Officers need reasonable suspicion to detain you.',
          es: 'Los oficiales necesitan sospecha razonable para detenerlo.'
        },
        doItems: {
          en: [
            'Ask: "Am I being detained?"',
            'Ask: "Am I free to go?"',
            'If free to go, calmly walk away'
          ],
          es: [
            'Pregunte: "¿Estoy detenido?"',
            'Pregunte: "¿Soy libre de irme?"',
            'Si es libre de irse, váyase calmadamente'
          ]
        },
        dontItems: {
          en: [
            'Don\'t run',
            'Don\'t assume you must stay',
            'Don\'t argue or get confrontational'
          ],
          es: [
            'No corra',
            'No asuma que debe quedarse',
            'No discuta ni se ponga confrontacional'
          ]
        }
      },
      {
        title: {
          en: 'Step 2: Exercise Your Rights',
          es: 'Paso 2: Ejerza Sus Derechos'
        },
        description: {
          en: 'Even if detained, you have rights.',
          es: 'Incluso si está detenido, tiene derechos.'
        },
        doItems: {
          en: [
            'Say: "I am exercising my right to remain silent"',
            'Say: "I do not consent to a search"',
            'Ask for an attorney'
          ],
          es: [
            'Diga: "Estoy ejerciendo mi derecho a guardar silencio"',
            'Diga: "No doy mi consentimiento para un registro"',
            'Pida un abogado'
          ]
        },
        dontItems: {
          en: [
            'Don\'t answer questions about immigration status',
            'Don\'t provide documents showing nationality',
            'Don\'t physically resist'
          ],
          es: [
            'No conteste preguntas sobre estatus migratorio',
            'No proporcione documentos que muestren nacionalidad',
            'No se resista físicamente'
          ]
        }
      }
    ],
    afterEncounter: {
      en: [
        'Note the location, time, and what happened',
        'Get contact information from witnesses if possible',
        'Contact an attorney',
        'Report to immigrant rights organizations'
      ],
      es: [
        'Anote la ubicación, hora y lo que sucedió',
        'Obtenga información de contacto de testigos si es posible',
        'Contacte a un abogado',
        'Reporte a organizaciones de derechos de inmigrantes'
      ]
    }
  },
  {
    id: 'checkpoint',
    title: {
      en: 'If Stopped at a CHECKPOINT',
      es: 'Si Lo Detienen en un PUNTO DE CONTROL'
    },
    description: {
      en: 'What to do at Border Patrol checkpoints',
      es: 'Qué hacer en puntos de control de la Patrulla Fronteriza'
    },
    icon: <MapPin className="h-6 w-6" />,
    criticalAlert: {
      en: 'Border Patrol can briefly stop all vehicles but cannot detain you without reasonable suspicion.',
      es: 'La Patrulla Fronteriza puede detener brevemente todos los vehículos pero no puede detenerlo sin sospecha razonable.'
    },
    steps: [
      {
        title: {
          en: 'Step 1: Understand Checkpoint Rules',
          es: 'Paso 1: Entienda las Reglas de Puntos de Control'
        },
        description: {
          en: 'Checkpoints have specific legal limitations.',
          es: 'Los puntos de control tienen limitaciones legales específicas.'
        },
        doItems: {
          en: [
            'Brief stops are legal at checkpoints',
            'You can decline to answer questions',
            'Ask: "Am I free to go?" if stopped longer than briefly'
          ],
          es: [
            'Las paradas breves son legales en puntos de control',
            'Puede negarse a contestar preguntas',
            'Pregunte: "¿Soy libre de irme?" si lo detienen más que brevemente'
          ]
        },
        dontItems: {
          en: [
            'Don\'t volunteer information about citizenship',
            'Don\'t consent to vehicle searches',
            'Don\'t panic or act suspiciously'
          ],
          es: [
            'No ofrezca información sobre ciudadanía',
            'No consienta registros del vehículo',
            'No entre en pánico ni actúe sospechosamente'
          ]
        }
      },
      {
        title: {
          en: 'Step 2: Know Your Rights at Checkpoints',
          es: 'Paso 2: Conozca Sus Derechos en Puntos de Control'
        },
        description: {
          en: 'You still have constitutional protections.',
          es: 'Aún tiene protecciones constitucionales.'
        },
        doItems: {
          en: [
            'You can remain silent',
            'You can refuse vehicle searches',
            'Record the encounter if safe'
          ],
          es: [
            'Puede guardar silencio',
            'Puede rechazar registros del vehículo',
            'Grabe el encuentro si es seguro'
          ]
        },
        dontItems: {
          en: [
            'Don\'t lie about citizenship',
            'Don\'t consent to extended detention',
            'Don\'t physically interfere with agents'
          ],
          es: [
            'No mienta sobre ciudadanía',
            'No consienta detención prolongada',
            'No interfiera físicamente con los agentes'
          ]
        }
      }
    ],
    afterEncounter: {
      en: [
        'Note the checkpoint location',
        'Write down what questions were asked',
        'Record how long you were stopped',
        'Contact ACLU if you believe your rights were violated'
      ],
      es: [
        'Anote la ubicación del punto de control',
        'Escriba qué preguntas le hicieron',
        'Registre cuánto tiempo lo detuvieron',
        'Contacte a ACLU si cree que violaron sus derechos'
      ]
    }
  }
];

interface ScenarioGuideProps {
  scenarioId?: string;
}

export function ScenarioGuide({ scenarioId }: ScenarioGuideProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [activeScenario, setActiveScenario] = useState<string>(scenarioId || 'home');
  const [activeStep, setActiveStep] = useState<number>(0);

  const currentScenario = scenarios.find(s => s.id === activeScenario) || scenarios[0];

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => {
              setActiveScenario(scenario.id);
              setActiveStep(0);
            }}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              activeScenario === scenario.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              activeScenario === scenario.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {scenario.icon}
            </div>
            <span className="text-sm font-medium text-center">{scenario.title[lang]}</span>
          </button>
        ))}
      </div>

      {/* Critical Alert */}
      <Alert className="bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200 font-semibold">
          {currentScenario.criticalAlert[lang]}
        </AlertDescription>
      </Alert>

      {/* Step navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {currentScenario.steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeStep === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
              {index + 1}
            </span>
            {step.title[lang].replace(/^Paso \d+: |^Step \d+: /, '')}
          </button>
        ))}
        <button
          onClick={() => setActiveStep(currentScenario.steps.length)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeStep === currentScenario.steps.length
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {lang === 'es' ? 'Después' : 'After'}
        </button>
      </div>

      {/* Step content */}
      {activeStep < currentScenario.steps.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {activeStep + 1}
              </div>
              {currentScenario.steps[activeStep].title[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              {currentScenario.steps[activeStep].description[lang]}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Do */}
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  {lang === 'es' ? 'HAGA ESTO' : 'DO THIS'}
                </h4>
                <ul className="space-y-2">
                  {currentScenario.steps[activeStep].doItems[lang].map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don't */}
              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  {lang === 'es' ? 'NO HAGA ESTO' : 'DON\'T DO THIS'}
                </h4>
                <ul className="space-y-2">
                  {currentScenario.steps[activeStep].dontItems[lang].map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {lang === 'es' ? '← Anterior' : '← Previous'}
              </button>
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                {activeStep === currentScenario.steps.length - 1
                  ? (lang === 'es' ? 'Qué hacer después' : 'What to do after')
                  : (lang === 'es' ? 'Siguiente paso' : 'Next step')}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* After Encounter */
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              {lang === 'es' ? 'Después del Encuentro' : 'After the Encounter'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {currentScenario.afterEncounter[lang].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-background rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {lang === 'es' ? 'Líneas de emergencia:' : 'Emergency hotlines:'}
              </h4>
              <div className="space-y-1 text-sm">
                <p>NILC: <strong>213-639-3900</strong></p>
                <p>ACLU: <strong>212-549-2660</strong></p>
                <p>United We Dream: <strong>1-844-363-1423</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
