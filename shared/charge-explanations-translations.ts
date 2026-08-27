/**
 * Spanish and Chinese translations for charge plain-language explanations.
 *
 * ⚠  DRAFT: These translations were machine-assisted and have NOT yet been
 * reviewed by a fluent-speaker legal professional. Treat them as illustrative
 * only until a qualified reviewer signs off. Set `draft: false` (or remove the
 * field) once each language/entry combination has been reviewed.
 *
 * Structure: keyed by slug (matches ChargeExplanation.slug).
 * keyTerms arrays MUST align positionally with the English keyTerms array in
 * shared/charge-explanations.ts: the i-th element here corresponds to the
 * i-th English term. Only plainMeaning and example are translated; the legal
 * term name (term.term) stays in English so it matches court documents.
 */

export interface ChargeExplanationLocale {
  plainSummary: string;
  /** Positionally aligned with the English keyTerms array. */
  keyTerms: Array<{ plainMeaning: string; example?: string }>;
  degreeContext?: string;
  /** true = not yet reviewed by a fluent-speaker legal professional */
  draft: boolean;
}

export interface ChargeTranslationEntry {
  es?: ChargeExplanationLocale;
  zh?: ChargeExplanationLocale;
}

export const CHARGE_EXPLANATION_TRANSLATIONS: Record<string, ChargeTranslationEntry> = {

  "murder-in-the-first-degree": {
    es: {
      draft: true,
      plainSummary: `El asesinato en primer grado es el cargo homicida más grave. En muchos estados, significa que el crimen fue planeado con anticipación (premeditado) o ocurrió durante otro delito grave. En Nueva York, no se basa en la planificación sino en factores agravantes específicos. Algunos estados, como Ohio, no usan el término primer grado y llaman al cargo más grave asesinato agravado.`,
      keyTerms: [
        { plainMeaning: `Pensar y planear el crimen con anticipación, aunque sea por unos momentos. Es el elemento central en estados como California, Florida y Virginia.`, example: `Decidir hacerle daño a alguien y luego ir a buscar un arma` },
        { plainMeaning: `En la mayoría de los estados, una muerte que ocurre durante ciertos delitos graves puede cargarse como asesinato en primer grado aunque no había intención de matar.`, example: `Alguien muere durante un robo, aunque el ladrón no tenía intención de matarlo` },
        { plainMeaning: `En Nueva York, los fiscales no tienen que probar planificación. Deben probar un asesinato intencional más uno de 13 factores específicos listados en la ley.`, example: `Matar a un oficial de policía en servicio, o matar a más de una persona en el mismo incidente` },
      ],
      degreeContext: `Si la definición varía tanto por estado, si un homicidio cuenta como primer grado depende completamente del estado. En California, Florida y Virginia se requiere premeditación o que la muerte ocurrió durante un delito listado. Nueva York requiere un factor agravante específico. Ohio usa el término asesinato agravado en lugar de primer grado. Confirme el estándar exacto de su estado con su abogado.`,
    },
    zh: {
      draft: true,
      plainSummary: `一级谋杀是最严重的杀人罪指控，但「一级」的定义因州而异。在加利福尼亚、佛罗里达和弗吉尼亚等许多州，这意味着杀人行为是预谋的，或发生在抢劫、强奸等重大犯罪过程中。在纽约州，一级谋杀不取决于预谋，而是需要故意杀人加上特定的加重因素，例如杀害警察或雇凶杀人。俄亥俄州等一些州不使用「一级谋杀」这一术语，将最严重的谋杀罪称为「加重谋杀」。`,
      keyTerms: [
        { plainMeaning: `事先考虑并计划杀人，即使只是片刻。这是加利福尼亚、佛罗里达和弗吉尼亚等州一级谋杀的核心标准。`, example: `决定伤害某人，然后去取武器` },
        { plainMeaning: `在大多数州，在某些严重罪行（如抢劫、入室盗窃或强奸）过程中发生的死亡，即使没有杀人意图，也可被指控为一级谋杀。`, example: `抢劫过程中有人死亡，即使抢劫者并不打算杀人` },
        { plainMeaning: `在纽约州，检察官不必证明有预谋。他们必须证明故意杀人加上法规中列出的13个具体因素之一。`, example: `杀害正在执行公务的警察，或在同一事件中杀害多人` },
      ],
      degreeContext: `由于各州定义差异很大，一起杀人案是否构成「一级」谋杀完全取决于适用哪个州的法律。在加利福尼亚、佛罗里达和弗吉尼亚，一级谋杀通常需要预谋或在列举的罪行过程中发生。纽约州则要求故意杀人加上特定加重因素。俄亥俄州不使用「一级」这一术语，而是将相应罪名称为「加重谋杀」。请向您的律师确认您所在州的具体标准。`,
    },
  },

  "murder-in-the-second-degree": {
    es: {
      draft: true,
      plainSummary: `El asesinato en segundo grado significa que el fiscal cree que usted mató a alguien intencionalmente pero sin planificación previa, o que actuó con una imprudencia tan extrema hacia la vida humana que la ley lo trata igual que a un asesinato intencional. En la mayoría de los estados, este es el cargo de asesinato predeterminado. Algunos estados, como Ohio, no usan grados y llaman al cargo equivalente simplemente asesinato.`,
      keyTerms: [
        { plainMeaning: `La intención de causar la muerte de alguien en el momento en que actuó.`, example: `Tomar un arma durante una acalorada discusión` },
        { plainMeaning: `Actuar de manera tan imprudente que demuestra que no le importaba si alguien moría. Algunos estados lo describen como un estándar de mente depravada o corazón depravado.`, example: `Disparar un arma hacia una multitud sin apuntar a nadie en específico` },
        { plainMeaning: `En varios estados, una muerte que ocurre durante ciertos delitos puede cargarse como asesinato en segundo grado, dependiendo del delito involucrado.`, example: `Una muerte durante un robo, cargada en segundo grado porque el delito subyacente no está en la lista de primer grado` },
      ],
      degreeContext: `A diferencia del asesinato en primer grado, el segundo grado generalmente no requiere planificación. Requiere intención de matar en el momento, o una imprudencia tan extrema que la ley la trata como equivalente a la intención. Ohio no usa segundo grado: su versión se llama asesinato, separada del más grave asesinato agravado.`,
    },
    zh: {
      draft: true,
      plainSummary: `二级谋杀是指检察官认为您故意杀人但没有预谋，或者您的行为对人类生命表现出极端鲁莽，法律将其视同故意杀人。在大多数州，这是「默认」的谋杀指控。俄亥俄州等一些州不使用「等级」划分，将相应罪名简单称为「谋杀」，区别于更严重的「加重谋杀」。`,
      keyTerms: [
        { plainMeaning: `行动时意图造成某人死亡。`, example: `在激烈争吵中抓起武器` },
        { plainMeaning: `行为极度鲁莽，表明根本不在乎是否会有人死亡。有些州将此描述为「堕落心理」或「堕落内心」标准。`, example: `向人群开枪而不针对任何具体目标` },
        { plainMeaning: `在几个州，某些重罪过程中发生的死亡可被指控为二级谋杀，具体取决于涉及的罪行。`, example: `抢劫过程中发生死亡，因为基础罪行不在该州一级谋杀名单上，被指控为二级谋杀` },
      ],
      degreeContext: `与一级谋杀不同，二级谋杀通常不需要预谋。它要求当时有杀人意图，或鲁莽程度极端到法律将其视为等同于故意杀人。俄亥俄州不使用「二级」这一术语：其相应罪名称为「谋杀」，独立于更严重的「加重谋杀」。`,
    },
  },

  "felony-murder": {
    es: {
      draft: true,
      plainSummary: `El asesinato en el curso de un delito (felony murder) significa que alguien murió mientras usted cometía otro crimen grave, aunque no tuviera la intención de que nadie muriera. La ley trata esto como asesinato porque la muerte ocurrió durante su crimen. Qué delitos aplican, cómo se clasifica el cargo, y quién puede ser considerado responsable varía significativamente por estado.`,
      keyTerms: [
        { plainMeaning: `El otro crimen grave que usted estaba cometiendo cuando ocurrió la muerte. Los estados difieren en cuáles califican.`, example: `Robo, allanamiento de morada, incendio provocado, secuestro o agresión sexual` },
        { plainMeaning: `Algunos estados, incluida California desde una reforma de 2018, solo permiten este cargo contra el asesino real, alguien que ayudó con intención de matar, o un participante importante que actuó con indiferencia imprudente a la vida humana.`, example: `Un conductor de escape que no sabía que un codefendant usaría fuerza letal puede no calificar para este cargo en un estado con reforma` },
      ],
      degreeContext: `Este cargo no requiere intención de matar. En la mayoría de los estados, la intención de cometer el delito subyacente es suficiente para un cargo de asesinato, pero el grado varía. Algunos estados han limitado quién puede ser acusado, restringiendo la responsabilidad al asesino real o a un participante importante.`,
    },
    zh: {
      draft: true,
      plainSummary: `重罪谋杀是指在您实施另一项严重罪行的过程中有人死亡，即使您没有杀人意图。法律将此视为谋杀，因为死亡发生在您的犯罪过程中。哪些重罪适用、罪名如何定级，以及谁可能被追究责任，各州差异显著。`,
      keyTerms: [
        { plainMeaning: `死亡发生时您正在实施的其他严重罪行。各州对哪些罪行符合条件有不同规定。`, example: `抢劫、入室盗窃、纵火、绑架或性侵犯` },
        { plainMeaning: `部分州（包括加利福尼亚州自2018年改革后）只允许对实际凶手、有杀人意图的帮凶，或以极度漠视人命方式行事的主要参与者提出此项指控。`, example: `不知道同案被告会使用致命武力的逃跑车辆司机，在改革后的州可能不符合重罪谋杀责任条件` },
      ],
      degreeContext: `重罪谋杀不需要杀人意图。在大多数州，实施基础重罪的意图就足以构成谋杀指控，但所定等级各不相同。部分州已缩小了可被指控的范围，仅限于实际凶手或主要的鲁莽参与者。`,
    },
  },

  "assault-in-the-first-degree": {
    es: {
      draft: true,
      plainSummary: `El asalto en primer grado es el cargo de asalto no letal más grave. En estados como Nueva York y Virginia, significa causar lesiones físicas graves, a menudo con un arma o con intención de lesionar permanentemente a alguien. California, Florida y Ohio no usan grados para el asalto. Sus cargos equivalentes más graves se llaman asalto agravado o asalto con arma mortal.`,
      keyTerms: [
        { plainMeaning: `Lesiones que crean un riesgo sustancial de muerte, causan desfiguración permanente o resultan en pérdida prolongada de función de una parte del cuerpo.`, example: `Huesos rotos, cortes profundos, lesiones que causan daño duradero` },
        { plainMeaning: `Cualquier objeto que puede causar muerte o lesiones graves cuando se usa para atacar a alguien.`, example: `Armas de fuego, cuchillos, bates, o incluso objetos cotidianos usados como armas` },
        { plainMeaning: `En algunos estados, este cargo requiere intención específica de lesionar, desfigurar o incapacitar gravemente a alguien.`, example: `La ley de Virginia requiere intención de mutilar, desfigurar, incapacitar o matar` },
      ],
      degreeContext: `En Nueva York, el asalto en primer grado requiere intención de causar lesiones físicas graves con un arma, o intención de desfigurar permanentemente, entre otros. California, Florida y Ohio no usan esta categoría. Sus cargos más graves de asalto no letal están cubiertos bajo asalto agravado y asalto con arma mortal.`,
    },
    zh: {
      draft: true,
      plainSummary: `一级攻击是最严重的非致命性攻击罪指控。在纽约州和弗吉尼亚州等地，这意味着造成严重人身伤害，通常使用武器或意图使人永久残伤。加利福尼亚州、佛罗里达州和俄亥俄州不使用攻击「等级」划分，其最严重的同等罪名称为「加重攻击」或「持致命武器攻击」。`,
      keyTerms: [
        { plainMeaning: `造成实质性死亡风险、永久毁容，或导致身体某部位长期丧失功能的伤害。`, example: `骨折、需要缝合的深伤口、造成持久损害的伤势` },
        { plainMeaning: `用于攻击他人时可能造成死亡或严重伤害的任何物品。`, example: `枪支、刀具、球棒，甚至用作武器的日常物品` },
        { plainMeaning: `在某些州，此罪名要求有特定意图严重且永久地伤害、毁容或致残某人。`, example: `弗吉尼亚州的恶意伤害法规要求有致残、毁容、使人丧失行为能力或杀死的意图` },
      ],
      degreeContext: `在纽约州，一级攻击需要持武器的严重人身伤害意图、造成永久毁容的意图等。加利福尼亚州、佛罗里达州和俄亥俄州没有对应的「一级」分类，其最严重的非致命攻击罪涵盖在「加重攻击」和「持致命武器攻击」下。`,
    },
  },

  "assault-in-the-second-degree": {
    es: {
      draft: true,
      plainSummary: `El asalto en segundo grado es un cargo grave que normalmente implica causar lesiones físicas a alguien, pero sin las circunstancias extremas del primer grado. Puede incluir usar un arma, atacar a ciertas personas protegidas como agentes de la ley, o lesiones intencionales sin arma. California y Virginia no usan el término asalto en segundo grado.`,
      keyTerms: [
        { plainMeaning: `Cualquier dolor físico o deterioro de la condición física, aunque sea temporal.`, example: `Moretones, cortes menores, hinchazón o dolor temporal` },
        { plainMeaning: `Ignorar conscientemente un riesgo sustancial de que sus acciones pudieran lastimar a alguien.`, example: `Lanzar objetos enojado sin mirar adónde caen` },
      ],
      degreeContext: `En Nueva York, el asalto en segundo grado cubre intención de causar lesiones físicas graves con un arma, causar lesiones físicas a trabajadores protegidos como agentes de la ley, entre otros. California y Virginia no tienen una categoría equivalente de segundo grado.`,
    },
    zh: {
      draft: true,
      plainSummary: `二级攻击是一项严重的罪名，通常涉及对他人造成人身伤害，但不具备一级攻击那样的极端情节。可能包括使用武器、攻击执法人员等受保护人员，或无武器的故意伤害。加利福尼亚州和弗吉尼亚州不使用「二级攻击」这一术语。`,
      keyTerms: [
        { plainMeaning: `任何身体疼痛或身体状况受损，即使是暂时性的。`, example: `瘀伤、轻微割伤、肿胀或暂时性疼痛` },
        { plainMeaning: `有意识地无视您的行为可能伤害他人的重大风险。`, example: `愤怒地乱扔物品而不看物品落在何处` },
      ],
      degreeContext: `在纽约州，二级攻击涵盖持武器故意造成严重人身伤害、伤害执法人员等受保护工作者等情形。加利福尼亚州和弗吉尼亚州没有对应的「二级」分类。`,
    },
  },

  "assault-in-the-third-degree": {
    es: {
      draft: true,
      plainSummary: `El asalto en tercer grado o asalto simple es generalmente el cargo de asalto menos grave. Normalmente significa que causó una lesión menor, o actuó de manera imprudente causando una lesión. Por lo general, es un delito menor. No todos los estados usan tercer grado: Ohio simplemente llama a este cargo asalto, y puede convertirse en delito grave si la víctima es un agente de la ley.`,
      keyTerms: [
        { plainMeaning: `Tocar a alguien de una manera no deseada, incluso sin causar lesiones.`, example: `Empujar, agarrar o escupir a alguien` },
        { plainMeaning: `Hacer que alguien crea razonablemente que está a punto de ser lastimado, incluso sin contacto.`, example: `Levantar el puño como si fuera a golpear, aunque no lo haga` },
        { plainMeaning: `En algunos estados, este cargo puede aplicar incluso sin intención o imprudencia, si causó una lesión con un arma por un nivel de descuido que la ley trata como criminal.`, example: `Manejar un arma tan descuidadamente que alguien resulta herido, sin intención de lastimarlo` },
      ],
      degreeContext: `En Nueva York, el asalto en tercer grado cubre lesiones intencionales, lesiones imprudentes, o lesiones causadas por negligencia criminal con un arma. Ohio no usa números de grado: su cargo de asalto es un delito menor de primer grado por defecto, pero puede convertirse en delito grave cuando se comete contra ciertos trabajadores protegidos.`,
    },
    zh: {
      draft: true,
      plainSummary: `三级攻击或简单攻击通常是最轻的攻击罪指控。它通常意味着您造成了轻微伤害，或以鲁莽方式行事导致伤害。这通常是轻罪。并非每个州都使用「三级」这一标签：俄亥俄州简单地将此罪名称为「攻击」，如果受害者是执法人员，则可能升为重罪。`,
      keyTerms: [
        { plainMeaning: `以不受欢迎的方式触碰某人，即使没有造成伤害。`, example: `推人、抓人或向人吐口水` },
        { plainMeaning: `让他人合理地相信自己即将受到伤害，即使没有肢体接触。`, example: `摆出要打人的姿势，即使没有真的动手` },
        { plainMeaning: `在某些州，即使没有故意或鲁莽，如果您使用武器造成伤害时的疏忽达到法律认定的刑事程度，也可能适用此罪名。`, example: `如此疏忽地持有武器以至于有人受伤，但并非有意为之` },
      ],
      degreeContext: `在纽约州，三级攻击涵盖故意伤害、鲁莽伤害，或以持武器的刑事过失造成伤害。俄亥俄州不使用等级编号：其普通「攻击」罪默认为一级轻罪，但当针对某些受保护类别的工作人员实施时可升为重罪。`,
    },
  },

  "aggravated-assault": {
    es: {
      draft: true,
      plainSummary: `El asalto agravado es una forma más grave de asalto. Generalmente significa que usó un arma mortal, causó lesiones físicas graves, o atacó a alguien de una manera que crea un peligro grave. Es el término que muchos estados usan en lugar de asalto en primer grado.`,
      keyTerms: [
        { plainMeaning: `Cualquier objeto que puede causar muerte o lesiones graves, incluyendo armas de fuego, cuchillos, u objetos cotidianos usados para atacar.`, example: `Un bate de béisbol, una botella rota, o un automóvil usado para atropellar a alguien` },
        { plainMeaning: `Lesiones que van más allá de la lesión física ordinaria: riesgo de muerte, desfiguración permanente, o pérdida de función de una parte del cuerpo.`, example: `Una fractura de hueso, pérdida de visión, o lesiones que requieren hospitalización` },
        { plainMeaning: `La acusación de asalto se agrava cuando la víctima es un agente de la ley, paramédico, maestro u otro empleado protegido en funciones.`, example: `Golpear a un policía que responde a una llamada` },
      ],
      degreeContext: `El asalto agravado es generalmente un delito grave que conlleva de 1 a 10 o más años de prisión, dependiendo del estado y las circunstancias. El uso de un arma de fuego aumenta las penas de manera significativa. Una condena previa por asalto agravado puede resultar en sentencias mínimas obligatorias.`,
    },
    zh: {
      draft: true,
      plainSummary: `加重攻击是更严重形式的攻击罪。通常意味着您使用了致命武器、造成了严重人身伤害，或以造成严重危险的方式攻击他人。这是许多州用来代替「一级攻击」的术语。`,
      keyTerms: [
        { plainMeaning: `任何可能造成死亡或严重伤害的物品，包括枪支、刀具或用于攻击的日常物品。`, example: `棒球棒、碎瓶子，或用来碾压他人的汽车` },
        { plainMeaning: `超出普通人身伤害的伤势：死亡风险、永久毁容，或身体某部位丧失功能。`, example: `骨折、失明，或需要住院的伤势` },
        { plainMeaning: `当受害者是执法人员、护理人员、教师或其他在职受保护雇员时，攻击罪会被加重。`, example: `殴打正在处警的警察` },
      ],
      degreeContext: `加重攻击通常是重罪，根据州法律和具体情况，可判处1至10年或以上监禁。使用枪支会显著增加刑罚。有加重攻击前科可能导致强制最低刑期。`,
    },
  },

  "assault-with-a-deadly-weapon": {
    es: {
      draft: true,
      plainSummary: `El asalto con arma mortal (ADW) significa que usted atacó o amenazó a alguien con un arma capaz de causar muerte o lesiones corporales graves, o con fuerza capaz de producir dichas lesiones. No tiene que haber contacto físico; la amenaza o el intento con el arma es suficiente. Este es un delito grave en prácticamente todos los estados.`,
      keyTerms: [
        { plainMeaning: `Cualquier arma capaz de producir muerte o lesiones graves. Esto incluye armas de fuego, cuchillos, y objetos que normalmente no son armas pero se usan de forma peligrosa.`, example: `Un automóvil, un martillo, o un bate de béisbol usado para atacar a alguien` },
        { plainMeaning: `En muchos estados, basta con apuntar un arma hacia alguien o intentar golpearlo aunque se falle.`, example: `Apuntar con una pistola cargada aunque no dispare` },
        { plainMeaning: `Lesiones que representan un riesgo sustancial de muerte, desfiguración permanente o pérdida prolongada de función.`, example: `Heridas de bala, heridas de arma blanca, o fracturas graves` },
      ],
      degreeContext: `Este es un delito grave que conlleva penas de prisión de 2 a 12 años en la mayoría de los estados. El uso de un arma de fuego generalmente resulta en penas más altas. Las condenas previas o la violencia dirigida a personas protegidas pueden aumentar la pena significativamente.`,
    },
    zh: {
      draft: true,
      plainSummary: `持致命武器攻击（ADW）意味着您使用能够造成死亡或严重人身伤害的武器攻击或威胁他人，或使用足以产生此类伤害的力量。不需要有肢体接触；持武器的威胁或尝试就足够了。这在几乎所有州都是重罪。`,
      keyTerms: [
        { plainMeaning: `任何能够造成死亡或严重伤害的武器，包括枪支、刀具，以及通常不是武器但被危险使用的物品。`, example: `汽车、锤子，或用来攻击他人的棒球棒` },
        { plainMeaning: `在许多州，将武器瞄准某人或试图击打某人（即使没有打中）就已足够。`, example: `将上膛的手枪对准某人，即使没有开枪` },
        { plainMeaning: `代表实质性死亡风险、永久毁容或长期功能丧失的伤势。`, example: `枪伤、刺伤或严重骨折` },
      ],
      degreeContext: `这是一项重罪，在大多数州可判处2至12年监禁。使用枪支通常会导致更重的刑罚。有前科或针对受保护人员的暴力行为可能显著增加刑罚。`,
    },
  },

  "domestic-violence": {
    es: {
      draft: true,
      plainSummary: `Los cargos de violencia doméstica involucran daño físico, amenazas o intimidación contra un miembro de la familia, conviviente o pareja íntima. A diferencia de otros cargos de asalto, la violencia doméstica activa consecuencias adicionales: órdenes de no contacto obligatorias, pérdida de derechos a poseer armas de fuego, y posibles consecuencias de inmigración para no ciudadanos.`,
      keyTerms: [
        // [0] → EN "Domestic Relationship / Family or Household Member"
        { plainMeaning: `La relación entre usted y la supuesta víctima: debe ser un cónyuge actual o anterior, pareja romántica, conviviente o familiar. La definición legal exacta varía según el estado.`, example: `Novia actual, ex esposo, compañero de cuarto, padre, hijo o hija` },
        // [1] → EN "Protective Order"
        { plainMeaning: `Una orden judicial que le exige mantenerse alejado de la víctima, generalmente emitida automáticamente una vez que se presentan los cargos. Violarla es un delito separado.`, example: `No puede ir a casa, no puede contactar a la persona, no puede ir a su lugar de trabajo` },
      ],
      degreeContext: `El asalto doméstico en los grados inferiores es típicamente un delito menor con multas, hasta un año en la cárcel y consejería obligatoria. Cualquier condena por violencia doméstica elimina permanentemente los derechos federales a poseer armas de fuego. Una segunda condena, uso de arma o lesiones graves visibles generalmente eleva el cargo a delito grave. Las consecuencias de inmigración para no ciudadanos pueden ser severas.`,
    },
    zh: {
      draft: true,
      plainSummary: `家庭暴力罪名涉及对家庭成员、同住者或亲密伴侣的身体伤害、威胁或恐吓。与其他攻击罪不同，家庭暴力会触发额外后果：强制禁止联系令、丧失持有枪支权利，以及非公民可能面临的移民后果。`,
      keyTerms: [
        // [0] → EN "Domestic Relationship / Family or Household Member"
        { plainMeaning: `您与涉嫌受害者之间的关系：必须是现任或前任配偶、浪漫伴侣、同住者或家庭成员。确切的法律定义因州而异。`, example: `现任女友、前任丈夫、室友、父母或子女` },
        // [1] → EN "Protective Order"
        { plainMeaning: `法院要求您远离受害者的命令，通常在提出指控后自动发出。违反该命令是独立的刑事犯罪。`, example: `不得回家，不得联系当事人，不得前往其工作场所` },
      ],
      degreeContext: `较轻等级的家庭暴力攻击通常是轻罪，可判罚款、最长一年监禁和强制咨询。任何家庭暴力定罪都将永久剥夺联邦枪支权利。再次定罪、使用武器或明显的严重伤害通常会将罪名升级为重罪。非公民可能面临严重的移民后果。`,
    },
  },

  "battery": {
    es: {
      draft: true,
      plainSummary: `La agresión (battery) significa el uso ilegal de fuerza o violencia contra otra persona. A diferencia del asalto (que puede ser solo una amenaza), la agresión requiere contacto físico real. Los estados difieren en si tienen leyes separadas de asalto y agresión o si las combinan en un solo cargo.`,
      keyTerms: [
        // [0] → EN "Unlawful Touching / Use of Force"
        { plainMeaning: `Cualquier contacto físico ilegal y deliberado, o uso de fuerza o violencia contra otra persona.`, example: `Golpear, empujar, agarrar o incluso escupir a alguien` },
        // [1] → EN "Without Consent"
        { plainMeaning: `La otra persona no acordó ser tocada de esa manera. Aunque lo haya hecho en broma, si la otra persona no lo quería, puede ser agresión.`, example: `Aunque lo hayas hecho en broma, si la otra persona no lo quiso, puede ser agresión` },
      ],
      degreeContext: `California define la agresión como cualquier uso ilegal de fuerza o violencia contra otra persona, punible como delito menor básico con hasta 6 meses en la cárcel y una multa de $2,000, con penas mejoradas para víctimas protegidas o contextos de violencia doméstica. Florida requiere tocar o golpear a alguien intencionalmente contra su voluntad, o causarle daño corporal intencionalmente.`,
    },
    zh: {
      draft: true,
      plainSummary: `殴打（battery）是指对他人非法使用武力或暴力。与攻击（assault，可能只是威胁）不同，殴打需要实际的身体接触。各州在是否有独立的攻击和殴打法律，还是将两者合并为一项罪名方面有所不同。`,
      keyTerms: [
        // [0] → EN "Unlawful Touching / Use of Force"
        { plainMeaning: `对他人故意且非法的身体接触，或对他人使用武力或暴力。`, example: `击打、推搡、抓住甚至向某人吐口水` },
        // [1] → EN "Without Consent"
        { plainMeaning: `对方没有同意以那种方式被触碰。即使您认为是在开玩笑，如果对方不想被那样接触，也可能构成殴打。`, example: `即使您认为是在开玩笑，如果对方不想被那样接触，也可能构成殴打` },
      ],
      degreeContext: `加利福尼亚州将殴打定义为对他人任何非法使用武力或暴力，基本轻罪可判最长6个月监禁和2000美元罚款，针对受保护受害者或家庭暴力情形有加重处罚。佛罗里达州要求故意违背受害者意愿触碰或击打对方，或故意造成人身伤害。`,
    },
  },

  "manslaughter": {
    es: {
      draft: true,
      plainSummary: `El homicidio involuntario (manslaughter) generalmente significa causar la muerte de alguien sin intención de matar, o después de ser provocado hasta perder el control repentinamente. La mayoría de los estados lo divide en homicidio involuntario voluntario (una muerte intencional cometida en el calor del momento) e involuntario (una muerte no intencional causada por imprudencia). No todos los estados usan la misma estructura.`,
      keyTerms: [
        { plainMeaning: `Una muerte intencional cometida en el calor del momento después de una provocación grave, sin tiempo para calmarse.`, example: `Encontrar a su cónyuge con otra persona y reaccionar violentamente inmediatamente` },
        { plainMeaning: `Matar accidentalmente a alguien por imprudencia, o durante un crimen menor realizado de manera descuidada o peligrosa.`, example: `Una muerte causada por conducción extremadamente peligrosa o una pelea que salió mal` },
        { plainMeaning: `Actuar inmediatamente después de algo que haría que una persona razonable perdiera el autocontrol, sin tiempo significativo para calmarse.`, example: `Sin tiempo de enfriarse entre la provocación y sus acciones` },
      ],
      degreeContext: `El homicidio involuntario es menos grave que el asesinato porque carece de premeditación y, en la forma involuntaria, carece de intención de matar por completo. La mayoría de los estados lo dividen en voluntario e involuntario. Nueva York invierte la convención de nombres: lo que la mayoría llama voluntario es en Nueva York homicidio en primer grado, y lo involuntario es homicidio en segundo grado. Illinois no tiene estatuto separado de homicidio involuntario voluntario; ese concepto está incluido en su cargo de asesinato en segundo grado.`,
    },
    zh: {
      draft: true,
      plainSummary: `过失杀人通常意味着在没有杀人意图的情况下导致他人死亡，或在受到激怒后突然失去控制而杀人。大多数州将其分为自愿过失杀人（在激情之下实施的故意杀人）和非自愿过失杀人（因鲁莽或在轻罪过程中造成的意外死亡）。并非所有州都使用相同的结构。`,
      keyTerms: [
        { plainMeaning: `在受到严重挑衅后激情之下实施的故意杀人，没有时间「冷静下来」。`, example: `发现配偶与他人在一起后立即激烈反应` },
        { plainMeaning: `因鲁莽，或在轻罪或本来合法但以非法或粗心方式实施的行为过程中意外杀死某人。`, example: `因极度危险驾驶或打架失控导致死亡` },
        { plainMeaning: `在挑衅与行动之间没有足够冷静时间的情况下立即采取行动，且该挑衅会让理性人失去自制力。`, example: `挑衅和行动之间没有冷静期` },
      ],
      degreeContext: `过失杀人比谋杀轻，因为它缺乏预谋，非自愿形式甚至完全没有杀人意图。大多数州（包括加利福尼亚州、纽约州和俄亥俄州）将过失杀人分为自愿和非自愿两类。纽约州使用相反的命名惯例：大多数州称之为「自愿过失杀人」的，在纽约是「一级杀人」；「非自愿过失杀人」则是「二级杀人」。`,
    },
  },

  "robbery": {
    es: {
      draft: true,
      plainSummary: `El robo significa tomar la propiedad de otra persona mediante fuerza o amenaza de fuerza. La diferencia clave entre el robo y el hurto es el uso de fuerza o intimidación: el robo ocurre en presencia de la víctima. El robo agravado implica el uso de un arma. La pena es mucho más grave que el hurto.`,
      keyTerms: [
        // [0] → EN "Force or Fear"
        { plainMeaning: `Usar fuerza física, o amenazar con fuerza inmediata, para tomar la propiedad o vencer la resistencia de la víctima.`, example: `Empujar a alguien para robarle la bolsa, o decirle dame tu billetera o te lastimaré` },
        // [1] → EN "From Their Person or Presence"
        { plainMeaning: `Tomar algo que la víctima llevaba, tenía puesto, o sobre lo que tenía control inmediato. Lo que la distingue del robo a propiedad alejada de la víctima.`, example: `Arrebatar el teléfono de la mano de alguien, no robar de su automóvil` },
      ],
      degreeContext: `El robo simple es un delito grave que conlleva de 2 a 5 años de prisión en la mayoría de los estados. El robo agravado con arma puede llevar de 5 a 20 años o más. El robo a mano armada tiene mandatos mínimos en muchos estados. Las condenas previas aumentan dramáticamente las penas.`,
    },
    zh: {
      draft: true,
      plainSummary: `抢劫是指通过武力或以武力相威胁夺取他人财物。抢劫与盗窃的关键区别在于使用武力或恐吓：抢劫发生在受害者在场的情况下。加重抢劫涉及使用武器。刑罚比盗窃严重得多。`,
      keyTerms: [
        // [0] → EN "Force or Fear"
        { plainMeaning: `使用身体武力，或以立即动用武力相威胁，以夺取财物或克服受害者的抵抗。`, example: `推倒某人夺取其包，或对其说「把钱包给我否则我伤害你」` },
        // [1] → EN "From Their Person or Presence"
        { plainMeaning: `夺取受害者随身携带、穿戴或直接控制的物品。这是抢劫区别于普通盗窃的关键：必须是从受害者人身或其直接控制范围内夺取。`, example: `从某人手中抢走手机，而非从其停着的汽车中偷窃` },
      ],
      degreeContext: `普通抢劫是重罪，在大多数州可判2至5年监禁。持武器加重抢劫可判5至20年或以上。许多州对持枪抢劫有强制最低刑期。有前科会大幅增加刑罚。`,
    },
  },

  "burglary": {
    es: {
      draft: true,
      plainSummary: `El allanamiento de morada (burglary) significa entrar a un edificio o estructura sin autorización con la intención de cometer un crimen dentro. No tiene que haber robo o que el crimen se complete: la entrada no autorizada con la intención criminal es suficiente. Entrar a una casa es mucho más grave que entrar a un negocio.`,
      keyTerms: [
        { plainMeaning: `Entrar a un lugar donde no tiene derecho a estar, generalmente sin permiso del propietario o sin una llave legítima.`, example: `Entrar por una ventana trasera o romper una cerradura` },
        { plainMeaning: `El plan de cometer un delito que existía antes o al momento de entrar, no después.`, example: `Planear robar al entrar a un edificio, incluso si no completa el robo` },
        { plainMeaning: `El allanamiento que involucra una residencia es generalmente del primer grado y más grave; entrar a una empresa comercial puede ser segundo grado.`, example: `Entrar a la casa de alguien mientras duerme es primer grado; entrar a una ferretería cerrada puede ser segundo grado` },
      ],
      degreeContext: `El allanamiento de morada residencial (primer grado) es un delito grave que conlleva de 5 a 15 años. El allanamiento de morada comercial (segundo grado) puede ser de 2 a 7 años. Ser armado durante el allanamiento o que alguien resulte herido aumenta dramáticamente la pena.`,
    },
    zh: {
      draft: true,
      plainSummary: `入室盗窃（burglary）是指未经授权进入建筑物或构筑物，意图在其中实施犯罪。不需要真正发生盗窃或完成犯罪：携带犯罪意图的未经授权进入就已足够。非法进入住宅比进入商业场所严重得多。`,
      keyTerms: [
        { plainMeaning: `进入您无权进入的地方，通常未经业主许可或没有合法钥匙。`, example: `从后窗进入或撬锁` },
        { plainMeaning: `在进入之前或进入时就存在的实施犯罪的计划，而非进入后才产生。`, example: `计划进入建筑物后实施盗窃，即使盗窃未完成` },
        { plainMeaning: `涉及住宅（房屋或公寓）的入室盗窃通常为一级，更为严重；进入商业场所可能为二级。`, example: `在某人睡觉时进入其住宅为一级；进入已关门的五金店可能为二级` },
      ],
      degreeContext: `住宅入室盗窃（一级）是重罪，可判5至15年监禁。商业入室盗窃（二级）可判2至7年。入室时携带武器或有人受伤会大幅增加刑罚。`,
    },
  },

  "theft": {
    es: {
      draft: true,
      plainSummary: `El hurto (theft) significa tomar la propiedad de otra persona sin permiso con la intención de privársela permanentemente. La gravedad del cargo depende casi siempre del valor de lo robado. El hurto mayor (grand theft) es un delito grave; el hurto menor (petty theft) es un delito menor.`,
      keyTerms: [
        // [0] → EN "Intent to Permanently Deprive"
        { plainMeaning: `La intención de quedarse con la propiedad permanentemente, no solo tomarla prestada.`, example: `Tomar una bicicleta para venderla es hurto; tomarla para un paseo rápido puede no serlo` },
        // [1] → EN "Petty/Petit vs. Grand Theft"
        { plainMeaning: `El monto en dólares determina el nivel del cargo. Por debajo del límite estatal es un delito menor (llamado hurto menor o petty theft); en o por encima es un delito grave (grand theft).`, example: `El límite para delito grave en Florida es $750; en Nueva York y Virginia es $1,000` },
      ],
      degreeContext: `El hurto menor (misdemeanor theft) generalmente conlleva hasta un año en la cárcel y una multa. El hurto mayor (felony theft) puede llevar de 1 a 5 años o más, dependiendo del valor y del historial del acusado. La restitución a la víctima es casi siempre ordenada en las condenas por hurto.`,
    },
    zh: {
      draft: true,
      plainSummary: `盗窃是指未经许可取走他人财物，意图永久剥夺其所有权。罪名的严重程度几乎完全取决于所盗财物的价值。重大盗窃（grand theft）是重罪；轻微盗窃（petty theft）是轻罪。`,
      keyTerms: [
        // [0] → EN "Intent to Permanently Deprive"
        { plainMeaning: `计划永久占有财物，而非只是借用。`, example: `拿走一辆自行车去卖掉是盗窃；只是骑一圈可能不构成` },
        // [1] → EN "Petty/Petit vs. Grand Theft"
        { plainMeaning: `金额决定罪名级别。低于该州门槛为轻罪（轻微盗窃）；达到或超过门槛为重罪（重大盗窃）。`, example: `佛罗里达州重罪门槛为750美元；纽约州和弗吉尼亚州为1000美元` },
      ],
      degreeContext: `轻微盗窃（轻罪）通常可判最长一年监禁和罚款。重大盗窃（重罪）可判1至5年或以上，具体取决于价值和被告的犯罪记录。几乎所有盗窃定罪都会命令向受害者赔偿。`,
    },
  },

  "dui": {
    es: {
      draft: true,
      plainSummary: `DUI (conducir bajo la influencia) o DWI (conducir mientras está intoxicado) significa que usted operó un vehículo mientras estaba deteriorado por el alcohol, drogas, o una combinación de ambos. El fiscal debe probar que su capacidad para conducir fue deteriorada, o que su nivel de alcohol en sangre (BAC) fue de 0.08% o más.`,
      keyTerms: [
        { plainMeaning: `El nivel de alcohol en la sangre, medido como porcentaje. En todos los estados de EE.UU., un BAC de 0.08% o superior hace ilegal conducir para adultos.`, example: `Un BAC de 0.10% está por encima del límite legal en todos los estados` },
        { plainMeaning: `Una prueba de aliento administrada en el lugar para estimar el BAC. Negarse puede resultar en la suspensión automática de la licencia.`, example: `Soplar en un dispositivo de Breathalyzer en una parada de tráfico` },
        { plainMeaning: `Un conductor con un BAC de 0.16% o más, o que conduce con un menor en el vehículo, puede enfrentar cargos mejorados con penas más severas.`, example: `Un BAC de 0.18% puede resultar en un cargo de DUI agravado con mayor tiempo de cárcel` },
      ],
      degreeContext: `Un primer DUI es típicamente un delito menor con multas de $500-$2,000, posible cárcel de hasta 6 meses, suspensión de licencia de 6 meses a 1 año, y un dispositivo de interlocking de ignición. Las reincidencias escalan a delitos graves con posibles años de prisión. Un DUI que resulta en lesiones o muerte puede ser un delito grave de vehicular homicidio.`,
    },
    zh: {
      draft: true,
      plainSummary: `DUI（驾驶时受酒精影响）或DWI（驾驶时处于醉酒状态）意味着您在受到酒精、毒品或两者共同影响下驾驶车辆。检察官必须证明您的驾驶能力受损，或血液酒精浓度（BAC）达到0.08%或以上。各州法律有所不同，初次违法与累犯的处理方式不同。`,
      keyTerms: [
        { plainMeaning: `血液中的酒精含量，以百分比表示。在美国所有州，成年人BAC达到0.08%或以上即构成违法驾驶。`, example: `BAC为0.10%超过所有州的法定限制` },
        { plainMeaning: `在现场进行的呼气测试，用于估算BAC。拒绝配合可能导致自动吊销驾照。`, example: `在交通检查站向酒精测试仪吹气` },
        { plainMeaning: `BAC达到0.16%或以上，或车内有未成年人的驾驶员，可能面临加重指控和更严厉的处罚。`, example: `BAC为0.18%可能导致被指控「加重DUI」，须承受更长时间的监禁` },
      ],
      degreeContext: `初次DUI通常是轻罪，罚款500至2000美元，可能最长6个月监禁，吊销驾照6个月至1年，并安装点火联锁装置。再犯升级为重罪，可能面临数年监禁。导致人身伤害或死亡的DUI可能构成车辆杀人重罪。`,
    },
  },

  "drug-possession": {
    es: {
      draft: true,
      plainSummary: `La posesión de drogas significa que usted tenía una sustancia controlada ilegalmente. El fiscal debe probar que usted sabía que tenía la droga, que sabía que era una sustancia controlada, y que tenía control sobre ella. La gravedad del cargo depende del tipo de droga y la cantidad.`,
      keyTerms: [
        { plainMeaning: `Tener una sustancia controlada bajo su control y conocimiento, ya sea en su persona, su auto o su hogar.`, example: `Tener una bolsa de cocaína en su bolsillo o pastillas sin receta en su guantera` },
        { plainMeaning: `Las drogas están clasificadas por su potencial de abuso y uso médico. El horario determina la gravedad del cargo.`, example: `La heroína es Horario I (sin uso médico, alto potencial de abuso); la cocaína es Horario II` },
        { plainMeaning: `La cantidad puede elevar el cargo de simple posesión a posesión con intención de distribuir, lo que conlleva penas mucho más severas.`, example: `Tener 5 gramos de metanfetamina puede implicar intención de distribución en lugar de simple uso personal` },
      ],
      degreeContext: `La posesión simple de pequeñas cantidades para uso personal generalmente es un delito menor o una infracción civil en muchos estados. La posesión de grandes cantidades, drogas de Horario I, o posesión cerca de una escuela eleva el cargo. Las penas mínimas federales para drogas se basan en el tipo y la cantidad.`,
    },
    zh: {
      draft: true,
      plainSummary: `持有毒品意味着您非法持有受管制物质。检察官必须证明您知道自己持有该毒品，知道它是受管制物质，并且能够控制它。罪名的严重程度取决于毒品的类型和数量。`,
      keyTerms: [
        { plainMeaning: `在您知情的情况下，将受管制物质置于您的控制之下，无论是在您身上、您的车里还是您家中。`, example: `口袋里有一袋可卡因，或手套箱里有无处方药片` },
        { plainMeaning: `毒品按其滥用可能性和医疗用途分级，级别决定了罪名的严重程度。`, example: `海洛因为附表一（无医疗用途，高度滥用可能）；可卡因为附表二` },
        { plainMeaning: `数量可能将罪名从单纯持有升级为持有意图分发，后者刑罚严重得多。`, example: `持有5克冰毒可能被认定为意图分发而非个人使用` },
      ],
      degreeContext: `个人使用的少量毒品持有在许多州通常是轻罪或民事违法行为。大量持有、附表一毒品，或在学校附近持有会加重罪名。联邦毒品最低刑期基于毒品类型和数量。`,
    },
  },

  "driving-while-suspended": {
    es: {
      draft: true,
      plainSummary: `Este cargo significa que estaba conduciendo en una vía pública mientras su licencia estaba suspendida, revocada o no era legalmente válida. Por lo general es un delito menor, pero puede convertirse en un delito grave por reincidencias.`,
      keyTerms: [
        { plainMeaning: `Una suspensión es una eliminación temporal de su licencia. Una revocación es una cancelación completa que requiere solicitar nuevamente.`, example: `Faltar a una cita en el tribunal puede provocar una suspensión de 30 días; una condena por DUI puede resultar en revocación total` },
        { plainMeaning: `Estar en control físico de un automóvil mientras está en movimiento o con el motor encendido.`, example: `Sentarse en el asiento del conductor con el auto encendido en un estacionamiento puede contar como operar` },
        { plainMeaning: `Abreviaturas para Conducir con Licencia Suspendida o Inválida: la misma acusación legal que conducir con licencia suspendida.`, example: `Ser detenido por una luz trasera y que el oficial descubra que su licencia está actualmente suspendida` },
      ],
      degreeContext: `Típicamente un delito menor de Clase B o C con multas y posiblemente un corto período de cárcel. Un segundo o tercer delito, o una suspensión relacionada con un DUI o delito grave, puede elevar el cargo a un delito grave con tiempo de cárcel obligatorio y pérdida extendida de licencia.`,
    },
    zh: {
      draft: true,
      plainSummary: `此项指控意味着您在驾照被吊销、撤销或在法律上无效时在公共道路上驾驶。这通常是轻罪，但多次违反可升级为重罪。`,
      keyTerms: [
        { plainMeaning: `吊销是暂时取消您的驾照，通常有固定期限。撤销是完全取消，您需要重新申请才能拿回驾照。`, example: `错过法庭听证可能触发30天吊销；DUI定罪可能导致完全撤销` },
        { plainMeaning: `在车辆行驶时或发动机运转时对其进行物理控制。`, example: `坐在停车场中发动机运转的汽车驾驶座上可能算作「驾驶」` },
        { plainMeaning: `驾照吊销期间驾驶（DWLS）或无效驾照驾驶（DWLI）的缩写：与持吊销驾照驾驶是同一法律指控。`, example: `因尾灯被拦截，警察发现您的驾照目前处于吊销状态` },
      ],
      degreeContext: `通常是B或C级轻罪，可处罚款和可能的短期监禁。第二次或第三次违规，或与DUI或严重犯罪相关的吊销，可能将罪名升级为重罪，须承受强制监禁和延长驾照吊销。`,
    },
  },

  "driving-without-license": {
    es: {
      draft: true,
      plainSummary: `Estos cargos involucran operar un vehículo sin tener una credencial legal requerida. La mayoría son delitos menores de nivel de tráfico o infracciones civiles, aunque algunos pueden volverse más graves con condenas previas.`,
      keyTerms: [
        { plainMeaning: `Conducir sin haber obtenido nunca una licencia válida, o conducir mientras su licencia ha sido retirada.`, example: `Ser detenido y no poder presentar ninguna licencia válida porque nunca solicitó una` },
        { plainMeaning: `Documentación que muestra que tenía la credencial requerida en la fecha del delito, lo que a veces puede desestimar el cargo.`, example: `Mostrar al tribunal una tarjeta de seguro válida o registro que estaba activo en la fecha de la cita` },
        { plainMeaning: `Una versión del delito más grave por factores adicionales como condenas previas.`, example: `Un tercer delito por conducir sin licencia, o conducir significativamente por encima del límite de velocidad publicado` },
      ],
      degreeContext: `La mayoría son infracciones civiles o delitos menores de Clase C con multas, pero sin tiempo de cárcel por un primer delito. Conducir sin seguro o registro vencido a menudo se resuelve con prueba de cumplimiento. La operación sin licencia agravada con múltiples condenas previas puede convertirse en un delito menor o un delito grave de bajo nivel.`,
    },
    zh: {
      draft: true,
      plainSummary: `这些指控涉及在缺少所需法定资质（如有效驾照、当前保险、有效注册或通过检验）的情况下驾驶车辆，或严重超速。大多数是交通级轻罪或民事违法行为。`,
      keyTerms: [
        { plainMeaning: `从未取得有效驾照即驾驶，或在驾照被取消后继续驾驶。`, example: `被拦截时无法出示任何有效驾照，因为从未申请过` },
        { plainMeaning: `证明您在违规日期确实持有所需资质的文件，有时可以撤销指控。`, example: `向法庭出示违规日期有效的保险卡或车辆注册证` },
        { plainMeaning: `因有前科或严重超速等额外因素而使罪行加重的版本。`, example: `第三次无证驾驶违规，或超速时速超过30英里` },
      ],
      degreeContext: `大多数是民事违法行为或C级轻罪，初次违规只处罚款，无监禁。无保险或注册过期通常可通过提供合规证明解决。多次有前科的无牌驾驶可升为轻罪或低级重罪。`,
    },
  },

  "criminal-mischief": {
    es: {
      draft: true,
      plainSummary: `Este cargo significa que el fiscal cree que usted intencionalmente o imprudentemente dañó, desfiguró o destruyó propiedad ajena. La gravedad del cargo casi siempre depende del valor en dólares del daño causado.`,
      keyTerms: [
        { plainMeaning: `Usted tenía la intención de causar el daño, o ignoró un riesgo obvio de que sus acciones dañarían algo.`, example: `Rayar deliberadamente un automóvil es intencional; lanzar una botella en un arrebato de ira sin mirar dónde cae puede ser imprudente` },
        { plainMeaning: `La cantidad del daño causado determina si el cargo es un delito menor o grave: la mayoría de los estados tienen umbrales en $500, $1,000 o $2,500.`, example: `Graffitear una pared que cuesta $300 pintar puede ser un delito menor; romper una vitrina de $10,000 podría ser un delito grave` },
        { plainMeaning: `Una orden judicial que le exige pagar a la víctima el costo de reparación o reemplazo.`, example: `Pagar al propietario de una vivienda el costo real de pintar o reparar lo dañado` },
      ],
      degreeContext: `Los daños de bajo valor (generalmente menos de $500-$1,000) son típicamente un delito menor con multas y posible tiempo corto en la cárcel. Los daños por encima del umbral de delito grave ($1,000-$2,500 según el estado) pueden resultar en prisión de 1 a 5 años. Condenas previas o daños a cierta propiedad protegida pueden elevar el cargo.`,
    },
    zh: {
      draft: true,
      plainSummary: `此项指控意味着检察官认为您故意或鲁莽地损坏、毁损或破坏了他人财物。罪名的严重程度几乎完全取决于造成损失的金额。`,
      keyTerms: [
        { plainMeaning: `您有意造成损坏，或忽视了您的行为会损坏某物的明显风险。`, example: `故意划伤汽车是故意行为；愤怒地扔瓶子但不看落点可能是鲁莽行为` },
        { plainMeaning: `造成的损失金额决定罪名是轻微还是严重违法：大多数州的门槛为500美元、1000美元或2500美元。`, example: `涂鸦一面需花300美元重新粉刷的墙可能是轻罪；打破一扇价值10000美元的橱窗可能是重罪` },
        { plainMeaning: `要求您向受害者支付修缮或更换费用的法庭命令。`, example: `向房主支付修缮损坏物的实际费用` },
      ],
      degreeContext: `低额损害（通常低于500至1000美元）通常是轻罪，可处罚款和可能的短期监禁。超过重罪门槛的损害（各州为1000至2500美元）可能导致1至5年监禁。有前科或损坏某些受保护财物可能升级罪名。`,
    },
  },

  "trespass": {
    es: {
      draft: true,
      plainSummary: `Un cargo de entrada ilegal significa que entró o permaneció en la propiedad de otra persona sin permiso. El fiscal debe probar que sabía que no se le permitía estar allí. Entrar a un hogar se trata mucho más seriamente que entrar a tierras o una propiedad comercial.`,
      keyTerms: [
        { plainMeaning: `Ser informado, verbalmente, mediante un cartel, o por una prohibición previa, de que no tiene permitido estar en la propiedad.`, example: `Un cartel de No pasar en la línea de la cerca, o un gerente de tienda que previamente le dijo que no volviera` },
        { plainMeaning: `Un edificio usado como hogar, como una casa o apartamento, que tiene penas elevadas en comparación con entrar en tierra abierta.`, example: `Entrar a un edificio de apartamentos donde no vive sin autorización es entrada ilegal a una morada` },
        { plainMeaning: `La entrada ilegal se comete no solo al entrar, sino también al quedarse después de que le pidan que se vaya.`, example: `Que le pidan que se vaya de un bar y negarse a salir durante 20 minutos` },
      ],
      degreeContext: `Entrar en tierra abierta o un negocio suele ser un delito menor o una infracción con multa. Entrar en un hogar u ocupación eleva a un delito menor más grave o un delito grave de bajo nivel. La entrada ilegal criminal es distinta del allanamiento: la entrada ilegal no requiere intención de cometer otro crimen adentro.`,
    },
    zh: {
      draft: true,
      plainSummary: `非法侵入指控意味着您未经许可进入或停留在他人财产上。检察官必须证明您知道自己不被允许在那里。进入住宅比进入土地或商业地产严重得多。`,
      keyTerms: [
        { plainMeaning: `被口头告知、通过标志或通过先前的禁止令通知您不得进入该财产。`, example: `围栏线上的「禁止入内」标志，或曾告诉您不要再来的店经理` },
        { plainMeaning: `用作住所的建筑物（如房屋或公寓），与进入空旷土地相比处罚更重。`, example: `未经授权进入您不居住的公寓楼构成对住宅的非法侵入` },
        { plainMeaning: `非法侵入不仅在进入时构成，被要求离开后继续留在原处也构成非法侵入。`, example: `被要求离开酒吧后拒绝离开长达20分钟` },
      ],
      degreeContext: `非法进入空旷土地或商业场所通常是轻罪或可处罚款的违规行为。进入住宅或有人居住的建筑升级为更严重的轻罪或低级重罪。刑事非法侵入不同于入室盗窃：非法侵入不需要在其中实施其他犯罪的意图。`,
    },
  },

  "shoplifting": {
    es: {
      draft: true,
      plainSummary: `El hurto en tienda significa tomar mercancía de un negocio minorista sin pagar por ella, o cambiar las etiquetas de precio para pagar menos. La gravedad depende del valor del artículo.`,
      keyTerms: [
        { plainMeaning: `Tomar mercancía de la tienda con la intención de no pagar por ella, como esconderla en una bolsa o en su ropa.`, example: `Esconder un artículo debajo de la ropa antes de salir de la tienda` },
        { plainMeaning: `Cambiar la etiqueta de precio de un artículo caro por la de uno más barato para pagar menos.`, example: `Pegar la etiqueta de $5 sobre la etiqueta de $50 para pagar el precio menor` },
        { plainMeaning: `Las tiendas tienen derecho a detener brevemente a los sospechosos para investigar, pero deben tener una causa razonable y no pueden usar fuerza excesiva.`, example: `Un guardia de seguridad que le pide que espere en la oficina para que el gerente revise una alarma` },
      ],
      degreeContext: `El hurto en tienda de artículos de bajo valor (generalmente bajo $500-$1,000) es un delito menor con multas y posible cárcel corta. Por encima del umbral del estado, se convierte en un delito grave. Las reincidencias, incluso para cantidades bajas, a menudo resultan en cargos más serios. Muchas tiendas también emiten cartas de demanda civil de daños.`,
    },
    zh: {
      draft: true,
      plainSummary: `商店盗窃是指从零售商店取走商品而不付款，或更换价格标签少付款。严重程度取决于商品的价值。`,
      keyTerms: [
        { plainMeaning: `取走商店商品而不付款，例如将其藏在袋子里或衣物中。`, example: `在离开商店前将物品藏在衣服下` },
        { plainMeaning: `将贵重商品的价格标签换成便宜商品的，以支付更低价格。`, example: `将5美元的标签贴在50美元的标签上，以支付较低价格` },
        { plainMeaning: `商店有权短暂拘留嫌疑人进行调查，但必须有合理理由，且不得使用过度武力。`, example: `保安要求您在办公室等候，由经理查看报警情况` },
      ],
      degreeContext: `低价值商品的商店盗窃（通常低于500至1000美元）是轻罪，可处罚款和可能的短期监禁。超过该州门槛则升为重罪。即使金额较小，多次违规也往往导致更严重的指控。许多商店还会发出民事损害赔偿要求函。`,
    },
  },

  "disorderly-conduct": {
    es: {
      draft: true,
      plainSummary: `La conducta desordenada cubre una amplia gama de comportamientos disruptivos en público: pelear, hacer ruido excesivo, usar lenguaje vulgar u obsceno en público, bloquear el tráfico peatonal, o actuar de manera que perturbe la paz. Es generalmente un delito menor de bajo nivel o una infracción civil.`,
      keyTerms: [
        { plainMeaning: `Un área accesible al público en general, incluyendo calles, parques, bares y eventos públicos.`, example: `Una pelea en un bar o el uso de lenguaje abusivo en la calle` },
        { plainMeaning: `Acciones que causan una perturbación injustificada y que una persona razonable encontraría ofensivas o alarmantes.`, example: `Crear ruido fuerte durante la noche o bloquear la entrada de un edificio` },
        { plainMeaning: `Comportamiento que tiene o podría tener la intención de provocar una pelea o disturbio entre otras personas.`, example: `Insultar agresivamente a un extraño de manera calculada para provocar una respuesta violenta` },
      ],
      degreeContext: `La conducta desordenada es generalmente un delito menor de bajo nivel con una multa de $50-$500 o servicio comunitario. El tiempo de cárcel es inusual para las primeras ofensas. Las reincidencias o la conducta que involucra violencia real pueden escalar a cargos más serios.`,
    },
    zh: {
      draft: true,
      plainSummary: `扰乱公共秩序涵盖广泛的公共破坏性行为：打架、制造过度噪音、公开使用粗俗或淫秽语言、阻塞行人交通，或以扰乱和平的方式行事。通常是低级轻罪或民事违法行为。`,
      keyTerms: [
        { plainMeaning: `任何公众可进入的区域，包括街道、公园、酒吧和公共活动场所。`, example: `酒吧里的打架，或在街上使用辱骂性语言` },
        { plainMeaning: `造成无正当理由的骚扰，且理性人认为具有冒犯性或令人担忧的行为。`, example: `深夜制造巨大噪音，或封堵建筑入口` },
        { plainMeaning: `意图或可能意图激起他人打架或骚乱的行为。`, example: `以激发暴力回应为目的侵略性地辱骂陌生人` },
      ],
      degreeContext: `扰乱公共秩序通常是低级轻罪，处50至500美元罚款或社区服务。初次违法很少判监禁。多次违法或涉及实际暴力的行为可能升级为更严重的指控。`,
    },
  },

  "drug-distribution": {
    es: {
      draft: true,
      plainSummary: `La distribución o tráfico de drogas significa que usted vendió, entregó o pretendía distribuir una sustancia controlada. No tiene que haber completado una venta: la posesión de una cantidad grande con la intención de distribuir es suficiente. Estos son cargos graves con mínimos obligatorios federales y estatales.`,
      keyTerms: [
        { plainMeaning: `Pruebas indirectas de que las drogas eran para vender en lugar de para uso personal: grandes cantidades, múltiples bolsas, una báscula, grandes cantidades de efectivo, o un teléfono con mensajes relacionados con la venta.`, example: `Tener 50 bolsas individuales de heroína con una báscula es evidencia de distribución` },
        { plainMeaning: `Los mínimos obligatorios son las sentencias mínimas de prisión que los jueces deben imponer, sin importar las circunstancias. Las leyes federales establecen mínimos basados en el tipo y cantidad de droga.`, example: `5 gramos de metanfetamina pura desencadenan un mínimo obligatorio federal de 5 años` },
        { plainMeaning: `Vender o poseer con intención de vender drogas cerca de una escuela, parque u otro lugar protegido aumenta las penas.`, example: `Ser atrapado distribuyendo drogas en un radio de 1,000 pies de una escuela primaria` },
      ],
      degreeContext: `La distribución es mucho más grave que la simple posesión. Las penas federales van de 5 a 40 años de prisión para el primer delito, dependiendo del tipo y cantidad. Los cargos estatales varían pero generalmente van de 3 a 25 años. La distribución a un menor o cerca de una escuela agrega años adicionales.`,
    },
    zh: {
      draft: true,
      plainSummary: `毒品分发或贩运意味着您出售、交付或意图分发受管制物质。不必真正完成销售：大量持有加分发意图就已足够。这些是严重罪名，联邦和州层面都有强制最低刑期。`,
      keyTerms: [
        { plainMeaning: `证明毒品是用于出售而非个人使用的间接证据：大量持有、多个袋装、秤、大量现金，或含有销售相关信息的手机。`, example: `持有50个单独包装的海洛因袋加一把秤是分发证据` },
        { plainMeaning: `法官必须强制执行的最低监禁刑期，不论具体情况。联邦法律根据毒品类型和数量规定最低刑期。`, example: `5克纯冰毒触发联邦强制5年最低刑期` },
        { plainMeaning: `在学校、公园或其他受保护场所附近出售或持有意图出售的毒品会加重处罚。`, example: `在小学1000英尺范围内被抓到分发毒品` },
      ],
      degreeContext: `分发比单纯持有严重得多。对于初次违法，联邦刑罚因毒品类型和数量而异，从5年到40年监禁不等。州级指控各异，但通常为3至25年。向未成年人分发或在学校附近分发会增加额外刑期。`,
    },
  },

  "weapons-charges": {
    es: {
      draft: true,
      plainSummary: `Los cargos de armas cubren llevar, poseer o usar armas de fuego u otras armas ilegalmente. Las leyes de armas varían significativamente entre estados.`,
      keyTerms: [
        { plainMeaning: `Tener un arma de fuego cargada y accesible en un vehículo o en su persona en un lugar público sin un permiso válido.`, example: `Llevar una pistola cargada en su bolso sin un permiso de arma oculta` },
        { plainMeaning: `A los delincuentes condenados federalmente les está prohibido poseer o recibir armas de fuego o municiones en cualquier estado.`, example: `Ser encontrado con una pistola después de haber sido condenado por un delito grave` },
        { plainMeaning: `Una pistola con el número de serie removido o alterado está prohibida federalmente porque dificulta el rastreo.`, example: `Poseer un arma de fuego con el número de serie borrado` },
      ],
      degreeContext: `Los cargos de armas varían desde delitos menores (portar sin permiso) hasta delitos graves federales graves (delincuente condenado con arma). El uso de un arma durante otro crimen generalmente agrega 5 años adicionales de condena. La Ley de Carrera Criminal Armada federal (ACCA) puede resultar en un mínimo de 15 años para ciertos delincuentes con antecedentes.`,
    },
    zh: {
      draft: true,
      plainSummary: `武器指控涵盖非法携带、持有或使用枪支或其他武器。枪支法律因州而异，差异显著。`,
      keyTerms: [
        { plainMeaning: `在公共场所在车辆内或随身携带上膛且可及的枪支，没有有效许可证。`, example: `在没有隐蔽携带许可证的情况下，包里携带上膛的手枪` },
        { plainMeaning: `联邦法律禁止被定罪的重刑犯在任何州持有或接受枪支或弹药。`, example: `在有重罪定罪记录的情况下被发现持有手枪` },
        { plainMeaning: `序列号被移除或改变的枪支在联邦层面被禁止，因为这会阻碍追踪。`, example: `持有序列号已被磨除的枪支` },
      ],
      degreeContext: `武器指控从轻罪（无证携带）到严重联邦重罪（持武器的被定罪罪犯）不等。在其他犯罪过程中使用武器通常额外增加5年刑期。联邦武装职业罪犯法（ACCA）可能导致某些有前科的人被判最低15年监禁。`,
    },
  },

  "sexual-assault": {
    es: {
      draft: true,
      plainSummary: `La agresión sexual cubre el contacto sexual no deseado, desde el toque inapropiado hasta la penetración. Muchos estados han reemplazado el término violación por agresión sexual en primer grado. El fiscal debe probar que ocurrió contacto sexual y que la víctima no consintió o era incapaz de consentir.`,
      keyTerms: [
        { plainMeaning: `El acuerdo libre y claro para el contacto sexual. La ausencia de protesta no es consentimiento. Una persona inconsciente, drogada o que tiene miedo no puede consentir.`, example: `Una persona que está dormida, drogada o congelada de miedo no ha consentido aunque no diga nada` },
        { plainMeaning: `Usar fuerza física, amenazas de daño, o una posición de autoridad para superar la resistencia de la víctima.`, example: `Usar restricción física, amenazas o una relación de poder para obligar al acto` },
        { plainMeaning: `En muchos estados, el cargo depende del tipo de acto: si hubo penetración sexual vs. solo contacto.`, example: `La penetración sexual típicamente da lugar a cargos de grado superior que el simple contacto` },
      ],
      degreeContext: `La agresión sexual es un delito grave en todos los estados. La agresión sexual en primer grado (que involucra penetración, fuerza o una víctima joven) típicamente conlleva de 5 a 25 años o cadena perpetua. Casi todas las condenas requieren registro como delincuente sexual.`,
    },
    zh: {
      draft: true,
      plainSummary: `性侵犯涵盖不受欢迎的性接触，从不当触摸到插入行为。许多州已将「强奸」一词替换为「一级性侵犯」。检察官必须证明发生了性接触，且受害者未同意或无能力同意。`,
      keyTerms: [
        { plainMeaning: `对性接触的自由、明确同意。没有反对不等于同意。无意识、被麻醉或因恐惧而无法行动的人无法表示同意。`, example: `熟睡、被麻醉或因恐惧而僵住的人，即使没说话也未曾同意` },
        { plainMeaning: `使用身体力量、伤害威胁或权威地位克服受害者的抵抗。`, example: `使用身体束缚、威胁或权力关系强迫实施行为` },
        { plainMeaning: `在许多州，罪名取决于行为类型：是否有性插入vs.仅有接触。`, example: `性插入通常导致比单纯接触更高等级的指控` },
      ],
      degreeContext: `性侵犯在所有州都是重罪。一级性侵犯（涉及插入、使用武力或年轻受害者）通常可判5至25年或终身监禁。几乎所有定罪都需要登记为性犯罪者。`,
    },
  },

  "sex-offenses-against-minors": {
    es: {
      draft: true,
      plainSummary: `Estos cargos involucran conducta sexual presunta con una persona menor de la edad legal de consentimiento, o el uso de un menor en material sexual. La característica definitoria es que la edad de la víctima por sí misma hace ilegal el acto. Incluso si el menor aparentó estar de acuerdo, la ley dice que no puede dar consentimiento legal.`,
      keyTerms: [
        { plainMeaning: `La edad mínima legal a la que una persona puede acordar la actividad sexual. Varía por estado, típicamente entre 16 y 18 años.`, example: `En un estado donde la edad de consentimiento es 17, la actividad sexual con un menor de 16 es ilegal independientemente de lo que dijo el menor` },
        { plainMeaning: `En muchos estados, creer genuinamente que la persona era mayor de edad no es una defensa. El acto es ilegal independientemente de su creencia.`, example: `Que el menor le dijera que tenía 18 años puede no protegerlo de un proceso penal si en realidad tenía 15` },
        { plainMeaning: `Cualquier uso de un menor en material sexualmente explícito, incluyendo tomar fotos o videos, compartirlos, o poseerlos, lo que es un crimen federal separado incluso sin contacto físico.`, example: `Tener imágenes explícitas de menores en un dispositivo, incluso si fueron recibidas en lugar de tomadas, es un delito grave federal` },
      ],
      degreeContext: `Estos son algunos de los cargos más graves del sistema penal. Las condenas típicamente van de 5 a 25 años, con cadena perpetua posible para los delitos más graves. Los cargos federales de explotación infantil conllevan mínimos obligatorios. Casi todas las condenas requieren registro de delincuente sexual de por vida.`,
    },
    zh: {
      draft: true,
      plainSummary: `这些指控涉及对未达到法定同意年龄的人实施涉嫌性行为，或将未成年人用于性材料。其决定性特征是受害者的年龄本身使该行为违法。即使未成年人表现出同意，法律规定未成年人无法给出合法同意。`,
      keyTerms: [
        { plainMeaning: `一个人可以同意性行为的最低法定年龄，各州不同，通常在16至18岁之间。`, example: `在同意年龄为17岁的州，与16岁的人发生性行为是违法的，不论未成年人说了什么` },
        { plainMeaning: `在许多州，真诚地相信对方已达法定年龄不构成抗辩理由。无论您的信念如何，该行为都是违法的。`, example: `未成年人告诉您他们18岁，如果他们实际上只有15岁，这可能无法保护您免于起诉` },
        { plainMeaning: `以任何方式将未成年人用于色情材料，包括拍照或录像、传播或持有，即使没有身体接触，这也是单独的联邦犯罪。`, example: `设备上持有未成年人的色情图像，即使是收到而非自己拍摄的，也是联邦重罪` },
      ],
      degreeContext: `这些是刑事系统中最严重的指控之一。判决通常为5至25年，最严重的罪行可判终身监禁。联邦儿童剥削指控有强制最低刑期。几乎所有定罪都需要终身登记为性犯罪者。`,
    },
  },

  "financial-fraud": {
    es: {
      draft: true,
      plainSummary: `Estos cargos le acusan de obtener dinero o propiedad mediante engaño, ocultamiento o amenazas, o de participar en una empresa criminal más amplia. El fiscal debe probar que actuó deliberadamente. Estos delitos son casi siempre graves, frecuentemente procesados federalmente, y pueden conllevar décadas de prisión.`,
      keyTerms: [
        { plainMeaning: `Deliberadamente engañó a alguien para causarle pérdida financiera o para obtener algo a lo que no tenía derecho.`, example: `Presentar declaraciones de impuestos falsas reclamando reembolsos que sabía que no le correspondían` },
        { plainMeaning: `Mover dinero obtenido ilegalmente a través de transacciones de apariencia legítima para ocultar su origen.`, example: `Depositar dinero de drogas en una cuenta comercial en pequeñas cantidades para que parezca ingreso normal` },
        { plainMeaning: `Una ley federal que permite enjuiciar a toda una organización criminal y a todos sus miembros cuando hay un patrón de actividad criminal.`, example: `Ser parte de un grupo que realizó múltiples esquemas de fraude puede desencadenar cargos RICO contra todos los involucrados` },
        { plainMeaning: `Robar dinero que legalmente le fue confiado en su papel como empleado o fiduciario.`, example: `Un contador que transfiere fondos de la empresa a su cuenta personal durante varios años` },
      ],
      degreeContext: `El fraude bancario y el fraude fiscal conllevan sentencias federales de hasta 20 años por cargo, y los fiscales a menudo acumulan múltiples cargos. Las condenas RICO pueden resultar en 20 años por acto predicado más decomiso de todos los ingresos. El fraude financiero casi siempre lleva multas, restitución y decomiso de bienes.`,
    },
    zh: {
      draft: true,
      plainSummary: `这些指控控告您通过欺骗、隐瞒或威胁手段获取金钱或财产，或参与更大范围的犯罪企业。检察官必须证明您是故意行事的。这些罪行几乎都是重罪，通常在联邦层面起诉，可能面临数十年监禁加财务处罚。`,
      keyTerms: [
        { plainMeaning: `故意欺骗他人造成其财务损失，或获取您本无权获得的利益。`, example: `提交虚假纳税申报单，索取您知道自己不应得的退税` },
        { plainMeaning: `通过看似合法的交易转移非法所得，以掩盖其来源。`, example: `将毒品收益少量多次存入商业账户，使其看起来像正常收入` },
        { plainMeaning: `联邦法律，允许在一段时间内存在犯罪活动模式时起诉整个犯罪组织及其所有成员。`, example: `成为多年来运营多个欺诈计划的团伙成员，可能对所有涉案人员触发RICO指控` },
        { plainMeaning: `盗取在您担任员工或受托人职位时合法托付给您的资金。`, example: `在数年间将公司资金转入个人账户的记账员` },
      ],
      degreeContext: `电信欺诈和税务欺诈每项联邦指控可判最长20年监禁，检察官通常会叠加多项指控。RICO定罪每个前提行为可判20年，另加没收全部所得。金融欺诈定罪几乎总是伴随罚款、赔偿和资产没收。`,
    },
  },

  "attempted-murder": {
    es: {
      draft: true,
      plainSummary: `El intento de asesinato significa que usted tomó acciones sustanciales hacia matar a otra persona pero no tuvo éxito. El fiscal debe probar que tenía la intención específica de matar y que dio un paso sustancial más allá de solo pensar en ello.`,
      keyTerms: [
        { plainMeaning: `Una determinación firme de causar la muerte de alguien. No basta con la intención de herir gravemente.`, example: `Disparar a alguien con la intención de matarlo, pero fallar o que la víctima sobreviva` },
        { plainMeaning: `Una acción que va más allá de la preparación y se acerca a completar el crimen.`, example: `Comprar un arma y viajar al lugar de la víctima, o apuntar y disparar con la intención de matar` },
        { plainMeaning: `El hecho de que alguien intervino, la víctima recibió tratamiento médico, o usted falló no cambia la intención criminal.`, example: `Que el vecino llame a la policía antes de que pueda completar el ataque no elimina el cargo` },
      ],
      degreeContext: `El intento de asesinato es un delito grave que generalmente conlleva la mitad a dos tercios de la sentencia por el asesinato completado. En muchos estados, el intento de asesinato en primer grado conlleva de 15 años a cadena perpetua. El cargo requiere prueba de intención específica de matar, lo que lo distingue del asalto agravado.`,
    },
    zh: {
      draft: true,
      plainSummary: `谋杀未遂意味着您采取了实质性行动试图杀人但未成功。检察官必须证明您有杀人的具体意图，并且采取了超越单纯思考的实质性步骤。`,
      keyTerms: [
        { plainMeaning: `造成某人死亡的坚定决心。仅有造成严重伤害的意图是不够的。`, example: `向某人开枪意图杀死，但未中或受害者幸存` },
        { plainMeaning: `超越准备阶段、接近完成犯罪的行动。`, example: `购买武器并前往受害者所在地点，或瞄准并开枪意图杀人` },
        { plainMeaning: `有人干预、受害者接受了医疗救治，或您失手，这些都不改变犯罪意图。`, example: `邻居在您完成攻击前报警并不消除此项指控` },
      ],
      degreeContext: `谋杀未遂是重罪，通常可判谋杀既遂刑期的一半至三分之二。在许多州，一级谋杀未遂可判15年至终身监禁。该罪名需要证明有具体的杀人意图，这使其区别于加重攻击。`,
    },
  },

  "kidnapping": {
    es: {
      draft: true,
      plainSummary: `El secuestro significa mover o confinar a alguien contra su voluntad. No tiene que haberlo llevado lejos; en muchos estados, incluso confinarlo brevemente en un cuarto puede ser suficiente. El secuestro puede ser agravado si involucra pedir rescate, causar daño, o si la víctima es un menor.`,
      keyTerms: [
        { plainMeaning: `Llevar a una persona de un lugar a otro o confinarla en un lugar donde no quiere estar.`, example: `Forzar a alguien a entrar a un vehículo, o encerrar a alguien en una habitación` },
        { plainMeaning: `Exigir dinero, una acción, o la liberación de alguien a cambio de liberar a la víctima.`, example: `Llamar a la familia de la víctima y exigir $50,000 para su liberación segura` },
        { plainMeaning: `El secuestro que involucra un menor generalmente lleva las penas más graves, incluyendo cadena perpetua.`, example: `Tomar a un niño de un parque o escuela sin autorización parental` },
      ],
      degreeContext: `El secuestro simple es un delito grave que conlleva de 3 a 10 años. El secuestro agravado (con rescate, daño, o víctima menor) puede llevar de 20 años a cadena perpetua. Es un crimen federal cuando cruza fronteras estatales (Ley Lindbergh). Los cargos de secuestro a menudo se acumulan con otros cargos graves.`,
    },
    zh: {
      draft: true,
      plainSummary: `绑架是指违背他人意愿移动或限制其人身自由。不必将人带到很远的地方；在许多州，即使短暂地将某人限制在一个房间里，如果是违背其意愿的，也可能足够构成此罪。`,
      keyTerms: [
        { plainMeaning: `将某人从一处带到另一处，或将其限制在一个他们不想待的地方。`, example: `强迫某人进入车辆，或将某人锁在房间里` },
        { plainMeaning: `要求金钱、某种行动或释放某人，以换取释放受害者。`, example: `致电受害者家属并要求5万美元换取安全释放` },
        { plainMeaning: `涉及未成年人的绑架通常面临最严重的处罚，包括终身监禁。`, example: `在没有父母授权的情况下从公园或学校带走儿童` },
      ],
      degreeContext: `简单绑架是重罪，可判3至10年。加重绑架（涉及勒索、伤害或未成年受害者）可判20年至终身监禁。跨越州界发生时构成联邦犯罪（林德伯格法）。绑架指控通常与其他严重指控叠加。`,
    },
  },

  "arson": {
    es: {
      draft: true,
      plainSummary: `El incendio provocado significa que usted intencionalmente prendió fuego a una estructura, vehículo u otra propiedad. El fiscal debe probar que el fuego fue intencional, no accidental. El fraude de seguros a través del incendio provocado añade cargos adicionales.`,
      keyTerms: [
        { plainMeaning: `Encender intencionalmente un fuego o causar una explosión con el propósito de destruir o dañar propiedad.`, example: `Usar un acelerador como gasolina para encender una estructura` },
        { plainMeaning: `Una sustancia usada para propagar o intensificar el fuego, lo que indica incendio intencional.`, example: `Los investigadores encontraron rastros de gasolina o queroseno que indicaban la causa del incendio` },
        { plainMeaning: `Incendiar una propiedad mientras hay personas dentro o que razonablemente podrían estar dentro, lo que resulta en un cargo de primer grado.`, example: `Incendiar el apartamento de alguien mientras duermen dentro` },
      ],
      degreeContext: `El incendio provocado de una estructura desocupada es un delito grave de 2 a 7 años. El incendio agravado de una estructura habitada conlleva de 5 a 20 años. Si alguien muere, puede resultar en un cargo de asesinato. El incendio provocado con fines de fraude de seguros agrega cargos de fraude separados.`,
    },
    zh: {
      draft: true,
      plainSummary: `纵火是指故意点燃建筑物、车辆或其他财产起火。检察官必须证明火灾是故意的，而非意外。通过纵火实施保险欺诈会增加额外指控。`,
      keyTerms: [
        { plainMeaning: `故意引发火灾或爆炸，目的是摧毁或损坏财产。`, example: `使用汽油等助燃剂点燃建筑物` },
        { plainMeaning: `用于传播或增强火势的物质，表明火灾是故意引发的。`, example: `调查人员发现汽油或煤油痕迹，显示火灾起因` },
        { plainMeaning: `在有人在内或合理预计有人在内的情况下焚烧财产，导致一级指控。`, example: `在有人熟睡时焚烧其公寓` },
      ],
      degreeContext: `焚烧无人居住的建筑物是重罪，可判2至7年。焚烧有人居住的建筑物可判5至20年。如有人死亡，可能导致谋杀指控。以保险欺诈为目的的纵火会增加单独的欺诈指控。`,
    },
  },

  "carjacking": {
    es: {
      draft: true,
      plainSummary: `El robo de automóvil (carjacking) significa tomar el vehículo de alguien directamente de ellos mediante fuerza, violencia o intimidación mientras están en el vehículo o justo cuando lo dejaron. Es una combinación de robo y robo de auto y se trata como uno de los crímenes más graves.`,
      keyTerms: [
        { plainMeaning: `Tomar el vehículo en presencia de la víctima, usualmente mediante fuerza física o amenazas inmediatas.`, example: `Apuntar con un arma al conductor en un semáforo rojo y ordenarle que salga del automóvil` },
        { plainMeaning: `Amenazar a la víctima con daño inmediato para que entregue las llaves o salga del vehículo.`, example: `Dame las llaves o te disparo mientras apunta con un arma` },
        { plainMeaning: `El uso de un arma de fuego durante el carjacking generalmente resulta en un cargo federal separado y penas significativamente más altas.`, example: `Usar una pistola para obligar al conductor a salir del vehículo` },
      ],
      degreeContext: `El carjacking es un delito grave que conlleva de 3 a 15 años en la mayoría de los estados. Con el uso de un arma de fuego, las penas comienzan en 7 a 25 años. El carjacking federal conlleva de 15 años a cadena perpetua. Si la víctima resulta herida, la sentencia aumenta drásticamente.`,
    },
    zh: {
      draft: true,
      plainSummary: `劫持汽车（carjacking）是指在受害者在场时，通过武力、暴力或恐吓手段直接夺取其车辆。这是抢劫和汽车盗窃的结合，被视为最严重的犯罪之一。`,
      keyTerms: [
        { plainMeaning: `在受害者在场的情况下夺取车辆，通常通过身体武力或立即威胁。`, example: `在红灯处用武器指向司机，命令其下车` },
        { plainMeaning: `以立即伤害相威胁受害者，迫使其交出钥匙或离开车辆。`, example: `用武器指向对方同时说把钥匙给我否则开枪` },
        { plainMeaning: `在劫持过程中使用枪支通常会导致单独的联邦指控和显著更高的刑罚。`, example: `使用手枪迫使司机离开车辆` },
      ],
      degreeContext: `劫持汽车是重罪，在大多数州可判3至15年。使用枪支，刑罚起点为7至25年。联邦劫持汽车罪可判15年至终身监禁。如受害者受伤，刑期会大幅增加。`,
    },
  },

  "vehicular-homicide": {
    es: {
      draft: true,
      plainSummary: `El homicidio vehicular significa que su operación de un vehículo causó la muerte de otra persona. La mayoría de los cargos requieren más que simple negligencia: el fiscal debe probar conducción imprudente, bajo la influencia, o extremamente negligente.`,
      keyTerms: [
        { plainMeaning: `Conducir con una disregard consciente del riesgo substancial de daño a otros, más allá de la negligencia ordinaria.`, example: `Correr una luz roja a alta velocidad en una intersección concurrida y matar a un peatón` },
        { plainMeaning: `Causar una muerte mientras conduce bajo la influencia del alcohol o drogas; la mayoría de los estados tienen estatutos específicos con mínimos obligatorios.`, example: `Un conductor intoxicado que atropella y mata a un peatón` },
        { plainMeaning: `En algunos estados, causar una muerte con un vehículo mediante negligencia criminal puede constituir homicidio vehicular.`, example: `Enviar mensajes de texto mientras conduce y matar a un ciclista` },
      ],
      degreeContext: `El homicidio vehicular imprudente es generalmente un delito grave de 1 a 10 años. El homicidio vehicular por DUI conlleva de 3 a 15 años en la mayoría de los estados, con mínimos obligatorios en muchos. Múltiples víctimas o una víctima que era un niño puede resultar en penas en el extremo superior. También se revocará la licencia de conducir.`,
    },
    zh: {
      draft: true,
      plainSummary: `车辆致人死命是指您驾驶车辆导致他人死亡。大多数指控需要超过简单过失：检察官必须证明鲁莽驾驶、酒后驾驶或极度过失。这与没有刑事行为的交通事故不同。`,
      keyTerms: [
        { plainMeaning: `有意识地无视对他人造成重大伤害风险的驾驶行为，超出普通过失范畴。`, example: `在繁忙路口高速闯红灯，撞死行人` },
        { plainMeaning: `在酒精或毒品影响下驾驶导致死亡；大多数州有专门的DUI车辆杀人法规，规定强制最低刑期。`, example: `醉酒司机碾压并杀死行人` },
        { plainMeaning: `在某些州，通过刑事过失驾驶车辆导致死亡，也可能构成车辆杀人。`, example: `驾驶时发短信，撞死骑自行车的人` },
      ],
      degreeContext: `鲁莽车辆杀人通常是重罪，可判1至10年。DUI车辆杀人在大多数州可判3至15年，许多州有强制最低刑期。多名受害者或受害者是儿童可能导致更高刑期。驾驶执照也将被吊销。`,
    },
  },

  "assault-generic": {
    es: {
      draft: true,
      plainSummary: `Los cargos genéricos de asalto sin un grado específico suelen ser la forma menos grave. Generalmente cubren causar miedo a daño inminente sin contacto, o un contacto físico menor.`,
      keyTerms: [
        { plainMeaning: `Hacer que alguien crea razonablemente que está a punto de ser tocado de forma no deseada o herido.`, example: `Levantar el puño hacia alguien de manera amenazante, aunque no lo golpee` },
        { plainMeaning: `Daño físico menor: moretones, cortes superficiales, o dolor temporal.`, example: `Un empujón que causa que alguien se caiga y se lastime levemente` },
        { plainMeaning: `Un oficial de policía, bombero, paramédico u otro trabajador protegido en funciones. Un asalto a estas personas generalmente eleva automáticamente el cargo a un delito grave.`, example: `Empujar a un oficial de policía que responde a una llamada de servicio` },
      ],
      degreeContext: `El asalto genérico o de bajo nivel es típicamente un delito menor con multas y hasta 90 días a un año en la cárcel. El asalto a un agente de la paz es generalmente un delito grave independientemente del nivel de lesión. La presencia de cualquier arma o lesión grave desplaza el cargo a asalto agravado.`,
    },
    zh: {
      draft: true,
      plainSummary: `没有具体等级的通用或轻微攻击指控通常是最轻的形式。通常涵盖在没有肢体接触的情况下让人恐惧即将遭受伤害，或轻微的身体接触。`,
      keyTerms: [
        { plainMeaning: `让某人合理地相信自己即将被以不受欢迎的方式触碰或受到伤害。`, example: `以威胁方式向某人举起拳头，即使没有击中` },
        { plainMeaning: `轻微身体伤害：瘀伤、浅伤口或暂时性疼痛。`, example: `推人导致对方摔倒并轻微受伤` },
        { plainMeaning: `在执行职务的警察、消防员、急救人员或其他受保护工作人员。攻击这些人通常会自动将罪名升级为重罪。`, example: `推搡正在处警的警察` },
      ],
      degreeContext: `通用或低级攻击通常是轻罪，可处罚款和最长90天至一年监禁。攻击执法人员无论伤情如何通常是重罪，可判1至5年。任何武器的出现或严重伤害会将罪名转为加重攻击，刑期大幅增加。`,
    },
  },

  "conspiracy-accessory-attempt": {
    es: {
      draft: true,
      plainSummary: `Estos cargos le hacen legalmente responsable de un crimen aunque usted no fuera quien lo realizó. La conspiración significa que acordó con al menos otra persona cometer un crimen y al menos uno de ustedes tomó un paso hacia hacerlo. Ser cómplice significa que ayudó a alguien a cometer un crimen. El intento criminal significa que tomó un paso sustancial hacia cometer un crimen aunque nunca se completó.`,
      keyTerms: [
        { plainMeaning: `Dos o más personas llegando a un acuerdo para cometer un crimen juntos. No tiene que estar por escrito o ser explícito.`, example: `Acordar verbalmente con un amigo robar una tienda es una conspiración, incluso si nunca lo hacen` },
        { plainMeaning: `Una acción concreta tomada en fomento de la conspiración, requerida para probar que el acuerdo era real.`, example: `Comprar bridas y cuerda en preparación para el crimen planificado cuenta como acto manifiesto` },
        { plainMeaning: `Cuando ayuda a alguien a cometer un crimen, puede ser acusado del mismo crimen como si lo hubiera hecho usted mismo.`, example: `Conducir el carro de escape le hace responsable del robo aunque nunca entrara a la tienda` },
      ],
      degreeContext: `Los cargos de conspiración y complicidad generalmente conllevan la misma sentencia que el crimen subyacente. Ser encubridor conlleva una sentencia menor, generalmente la mitad del máximo del crimen ayudado. El intento criminal también se castiga típicamente con la mitad de la sentencia completa.`,
    },
    zh: {
      draft: true,
      plainSummary: `这些指控使您对犯罪负有法律责任，即使您不是实施最终行为的人。共谋是指您与至少一人达成协议实施犯罪，且其中至少一人采取了行动。帮助和教唆是指您协助某人实施犯罪。刑事未遂是指您采取了实质性步骤试图实施犯罪，即使犯罪从未完成。`,
      keyTerms: [
        { plainMeaning: `两人或以上就共同实施犯罪达成的理解。不必以书面形式或明确表达。`, example: `口头与朋友约定去抢劫商店构成共谋，即使从未付诸实施` },
        { plainMeaning: `为推进共谋而采取的具体行动，用于证明协议是真实的。`, example: `为计划中的犯罪购买扎带和绳子算作明显行为` },
        { plainMeaning: `当您帮助某人实施犯罪时，您可能被以与自己实施该罪行相同的罪名起诉。`, example: `驾驶逃跑车辆使您对抢劫负责，即使您从未进入商店` },
      ],
      degreeContext: `共谋和帮助教唆指控通常与基础罪行承受相同刑罚。事后从犯刑期较轻，通常为所帮助罪行最高刑期的一半。刑事未遂通常也以完整刑期的一半处罚。`,
    },
  },

  "contempt-probation-violation": {
    es: {
      draft: true,
      plainSummary: `Estos cargos significan que se le acusa de desobedecer una orden directa de un tribunal. El desacato al tribunal cubre negarse a seguir la decisión de un juez. Una violación de libertad condicional significa que rompió una o más condiciones establecidas cuando se le colocó en libertad condicional.`,
      keyTerms: [
        { plainMeaning: `Las reglas específicas que acordó seguir a cambio de la libertad condicional en lugar de la cárcel. Pueden incluir visitas regulares, pruebas de drogas, toques de queda y no nuevos arrestos.`, example: `Dar positivo en drogas cuando sus condiciones de libertad condicional requieren que permanezca limpio` },
        { plainMeaning: `Una orden judicial que le prohíbe contactar o acercarse a una persona específica, generalmente emitida en casos de violencia doméstica.`, example: `Enviar un mensaje de texto a alguien protegido por una orden de no contacto viola la orden incluso si el mensaje parece inocuo` },
        { plainMeaning: `Usted sabía sobre la orden y eligió conscientemente violarla. El contacto accidental o inadvertido puede ser una defensa.`, example: `Encontrarse accidentalmente con la persona protegida en un supermercado es diferente a ir a su casa` },
      ],
      degreeContext: `El desacato al tribunal puede resultar en multas o cortas estancias en la cárcel (desacato civil) o cargos penales con hasta un año en la cárcel. Las violaciones de libertad condicional pueden resultar en que su libertad condicional sea revocada y su sentencia suspendida original sea impuesta. Las violaciones de órdenes de protección son típicamente delitos menores por primeras ofensas pero escalan a delitos graves con violaciones repetidas.`,
    },
    zh: {
      draft: true,
      plainSummary: `这些指控意味着您被控违抗法院的直接命令。藐视法庭涵盖拒绝遵守法官裁定或扰乱法庭程序。违反缓刑条件是指您违反了在获得缓刑而非监禁时所约定的一项或多项条件。`,
      keyTerms: [
        { plainMeaning: `您同意遵守以换取缓刑而非监禁的具体规则，可能包括定期报到、毒品检测、宵禁和不得再次被捕。`, example: `当缓刑条件要求保持清洁时，毒品检测呈阳性` },
        { plainMeaning: `禁止您联系或接近特定人员的法院命令，通常在家庭暴力案件中发出。`, example: `在禁止接触令生效期间发短信给受保护者，即使信息看似无害也违反了该命令` },
        { plainMeaning: `您知道该命令的存在并有意识地选择违反它。意外或无意的接触可能构成辩护理由。`, example: `在超市偶然遇到受保护者与专程前往其住所是不同的` },
      ],
      degreeContext: `藐视法庭可能导致罚款或短期监禁（民事藐视）或可判最长一年监禁的刑事指控。违反缓刑条件可能导致缓刑被撤销，原来暂缓执行的刑期被执行。违反保护令首次通常是轻罪，但多次违反或伴随暴力行为会升级为重罪。`,
    },
  },

  "stalking-harassment": {
    es: {
      draft: true,
      plainSummary: `Estos cargos involucran conducta que causó que otra persona temiera razonablemente por su seguridad. El acoso (stalking) típicamente requiere un patrón de contacto no deseado repetido o vigilancia. Las amenazas terroristas involucran comunicar una intención de cometer violencia para aterrorizar a una persona o grupo.`,
      keyTerms: [
        { plainMeaning: `Una serie de actos, no solo un incidente, que juntos establecen un curso de conducta.`, example: `Aparecer en la casa de alguien, luego en su trabajo, luego en su gimnasio durante dos semanas` },
        { plainMeaning: `Miedo que una persona normal en la misma situación también sentiría, no solo la reacción personal específica de la víctima.`, example: `Enviar mensajes que dicen se donde duermes haría que la mayoría de las personas temieran por su seguridad` },
        { plainMeaning: `Una comunicación, hablada, escrita o electrónica, que amenaza violencia contra una persona o grupo para causar terror o coaccionar una acción.`, example: `Llamar a alguien y decir que lo lastimarás si testifica en el tribunal, aunque no tengas intención de seguir adelante` },
      ],
      degreeContext: `El hostigamiento o acoso de primera infracción es típicamente un delito menor con multas y hasta un año en la cárcel. Una condena previa por acoso, uso de un arma, o dirigirse a un menor o funcionario público lo eleva a un delito grave. Las amenazas terroristas son generalmente delitos graves desde la primera ofensa.`,
    },
    zh: {
      draft: true,
      plainSummary: `这些指控涉及导致他人合理地为自身安全担忧的行为。跟踪骚扰（stalking）通常需要反复不受欢迎的接触或监视的模式。恐怖威胁涉及传达实施暴力的意图以恐吓个人或群体。`,
      keyTerms: [
        { plainMeaning: `一系列行为，而非单一事件，共同构成行为模式。`, example: `在两周内先后出现在某人的家、工作地点和健身房` },
        { plainMeaning: `处于相同情况下的普通人也会感到的恐惧，而非仅仅是特定受害者的个人反应。`, example: `发送「我知道你在哪里睡觉」这样的信息会让大多数人为自身安全感到恐惧` },
        { plainMeaning: `口头、书面或电子的通讯，威胁对个人或群体实施暴力以引起恐惧或强迫采取行动。`, example: `打电话告诉某人如果他们出庭作证就会伤害他们，即使没有真正打算这样做` },
      ],
      degreeContext: `初次跟踪骚扰或骚扰通常是轻罪，可处罚款和最长一年监禁。有跟踪骚扰前科、使用武器、在跟踪骚扰时违反保护令，或针对未成年人或公职人员，会将其升级为重罪。恐怖威胁通常从首次违法起即为重罪。`,
    },
  },

  "dv-abbreviation-variants": {
    es: {
      draft: true,
      plainSummary: `Los cargos de DV (violencia doméstica) presentados bajo nombres abreviados como DV Asalto o DV 3er Grado son los mismos que los cargos de asalto o agresión por violencia doméstica. Involucran daño físico o amenazas contra un familiar, conviviente o pareja íntima. La designación de DV desencadena consecuencias separadas más allá del cargo de asalto subyacente.`,
      keyTerms: [
        { plainMeaning: `La relación entre usted y la supuesta víctima: debe ser cónyuge actual o anterior, pareja romántica, conviviente o familiar.`, example: `Novia actual, ex esposo, compañero de cuarto, padre, hijo o hija` },
        { plainMeaning: `En muchos estados, la policía debe realizar un arresto al responder a una llamada de DV si hay evidencia visible de lesiones, incluso si la víctima no quiere presentar cargos.`, example: `Agentes que llegan y ven una contusión pueden arrestar incluso contra la objeción de la víctima` },
        { plainMeaning: `Una orden emitida automáticamente en la mayoría de los casos de DV que le requiere tener cero contacto con la supuesta víctima. Violarla es un crimen separado.`, example: `Enviar un mensaje de texto a la víctima para disculparse mientras hay una orden de no contacto vigente es en sí una violación criminal` },
      ],
      degreeContext: `El asalto de DV en los grados inferiores es típicamente un delito menor con multas, hasta un año en la cárcel y consejería obligatoria. Cualquier condena por DV elimina permanentemente los derechos federales a poseer armas de fuego. Una segunda condena de DV, uso de un arma, o lesiones graves visibles generalmente eleva a un delito grave. Las consecuencias de inmigración para no ciudadanos pueden ser severas.`,
    },
    zh: {
      draft: true,
      plainSummary: `以「DV攻击」或「DV三级」等缩写名称提出的家庭暴力（DV）指控与家庭暴力攻击或殴打指控相同。涉及对家庭成员、同住者或亲密伴侣的身体伤害或威胁。DV标识在基础攻击指控之外触发额外的后果。`,
      keyTerms: [
        { plainMeaning: `您与涉嫌受害者之间的关系：必须是现任或前任配偶、浪漫伴侣、同住者或家庭成员。`, example: `现任女友、前任丈夫、室友、父母或子女` },
        { plainMeaning: `在许多州，警察在响应家庭暴力报警时，如有可见伤势，必须实施逮捕，即使受害者不希望提出指控。`, example: `到达现场的警察看到瘀伤，即使受害者反对，仍可能逮捕` },
        { plainMeaning: `在大多数家庭暴力案件中自动发出的法庭命令，要求您与涉嫌受害者零接触。违反此令本身即构成犯罪。`, example: `在禁止接触令生效期间发短信给受害者道歉，本身就构成刑事违法` },
      ],
      degreeContext: `较轻等级的家庭暴力攻击通常是轻罪，可处罚款、最长一年监禁和强制咨询。任何家庭暴力定罪都将永久剥夺联邦枪支权利。再次家庭暴力定罪、使用武器或明显严重伤害通常升级为重罪。非公民可能面临严重移民后果。`,
    },
  },

  "animal-cruelty": {
    es: {
      draft: true,
      plainSummary: `Los cargos de crueldad animal significan que se le acusa de haber lastimado, descuidado o torturado intencional o imprudentemente a un animal. Para los cargos de crueldad, el fiscal debe probar que intencionalmente o imprudentemente causó dolor, sufrimiento o muerte a un animal.`,
      keyTerms: [
        { plainMeaning: `Lastimar deliberadamente a un animal: golpearlo, quemarlo o torturarlo.`, example: `Golpear a un perro repetidamente como castigo de una manera que cause lesiones` },
        { plainMeaning: `No proporcionar a un animal bajo su cuidado la comida, agua, refugio o atención veterinaria adecuados.`, example: `Dejar a un perro en un automóvil caliente por horas sin agua` },
        { plainMeaning: `Su animal suelto en un área pública sin correa o contención adecuada donde las ordenanzas locales lo requieren.`, example: `Su perro corriendo suelto en un vecindario donde la correa es legalmente obligatoria` },
      ],
      degreeContext: `Animal en libertad es generalmente una infracción civil con una pequeña multa. La crueldad animal es un delito menor para las primeras ofensas en la mayoría de los estados, pero puede ser un delito grave para tortura deliberada, asesinato, o casos que involucren múltiples animales. La crueldad animal agravada es un delito grave en los 50 estados, con penas de 1 a 5 años.`,
    },
    zh: {
      draft: true,
      plainSummary: `虐待动物指控意味着您被控故意或鲁莽地伤害、疏忽或折磨动物。对于虐待罪，检察官必须证明您故意或鲁莽地造成动物痛苦、受难或死亡。`,
      keyTerms: [
        { plainMeaning: `故意伤害动物：殴打、烧烫或折磨。`, example: `以造成伤害的方式反复殴打狗作为惩罚` },
        { plainMeaning: `未能为您照料的动物提供足够的食物、水、庇护所或兽医护理。`, example: `将狗留在炎热的车内数小时且不提供水` },
        { plainMeaning: `您的动物在当地法规要求的公共区域内没有牵引绳或适当约束而自由活动。`, example: `您的狗在法律要求拴绳的社区自由奔跑` },
      ],
      degreeContext: `动物无牵引绳通常是处以小额罚款的民事违法行为。在大多数州，虐待动物初次违法是轻罪，但故意折磨、杀害或涉及多只动物的案件可能是重罪。加重虐待动物在美国所有50个州都是重罪，可判1至5年监禁。`,
    },
  },

  "prostitution-solicitation": {
    es: {
      draft: true,
      plainSummary: `La prostitución significa intercambiar actos sexuales por dinero u objetos de valor. La solicitación significa pedir o acordar participar en prostitución. La mayoría de los estados penalizan a ambas partes aunque diferentes cargos se aplican a quien ofrece versus quien paga.`,
      keyTerms: [
        { plainMeaning: `Ofrecer o acordar intercambiar sexo por dinero u otros objetos de valor.`, example: `Acordar un precio con un cliente antes de cualquier acto sexual` },
        { plainMeaning: `La persona que paga por los servicios sexuales.`, example: `Un hombre que para a alguien en la calle y ofrece dinero por sexo` },
        { plainMeaning: `Coordinar o administrar la prostitución de otros, lo que es un crimen mucho más grave que la prostitución o solicitación básica.`, example: `Controlar o gestionar a múltiples trabajadores sexuales y tomar parte de sus ganancias` },
      ],
      degreeContext: `La prostitución y la solicitación son generalmente delitos menores para las primeras ofensas con multas y posible cárcel de 30 días a un año. El proxenetismo y la trata con fines de explotación sexual son delitos graves federales y estatales graves con décadas de prisión. Ciertas jurisdicciones han cambiado para criminalizar solo a los compradores, no a quienes venden.`,
    },
    zh: {
      draft: true,
      plainSummary: `卖淫是指以金钱或有价物品换取性行为。拉客是指要求或同意参与卖淫活动，无论是作为买方还是卖方。大多数州对双方均处以刑事制裁。`,
      keyTerms: [
        { plainMeaning: `提供或同意以金钱或其他有价物品换取性行为。`, example: `在任何性行为发生前与客户商定价格` },
        { plainMeaning: `为性服务付款的人，也称为嫖客或客户。`, example: `一名男子在街上拦下某人并提供金钱换取性行为` },
        { plainMeaning: `组织或管理他人的卖淫活动，这比基本卖淫或拉客严重得多。`, example: `控制或管理多名性工作者并从其收入中抽取佣金` },
      ],
      degreeContext: `卖淫和拉客通常对初次违法者是轻罪，可处罚款和可能30天至一年监禁。皮条客和以性剥削为目的的人口贩卖是严重的联邦和州级重罪，可判数十年监禁。某些司法管辖区已转向只对买方而非卖方定罪。`,
    },
  },

  "receiving-stolen-property": {
    es: {
      draft: true,
      plainSummary: `Recibir propiedad robada significa que usted aceptó, compró, tuvo o ayudó a ocultar propiedad que sabía o debería haber sabido que fue robada. El fiscal debe probar que tenía conocimiento de que los artículos eran robados.`,
      keyTerms: [
        { plainMeaning: `Usted sabía o debería haber sabido razonablemente que la propiedad era robada cuando la aceptó.`, example: `Comprar un iPhone nuevo por $50 a un extraño podría demostrar que sabía que era robado` },
        { plainMeaning: `Tener la propiedad robada bajo su control, ya sea que la compró, la recibió como regalo, o la encontró.`, example: `Tener artículos de una tienda robada en su casa, incluso si otra persona la robó` },
        { plainMeaning: `Ayudar a alguien a esconder o deshacerse de propiedad robada para evitar que se la descubran.`, example: `Almacenar mercancía robada en su garaje sabiendo que fue tomada de una tienda` },
      ],
      degreeContext: `Recibir propiedad robada de bajo valor (generalmente bajo $500-$1,000) es un delito menor. Artículos de alto valor elevan el cargo a un delito grave. Los revendedores que repetidamente compran artículos robados pueden enfrentar cargos adicionales de conspiración.`,
    },
    zh: {
      draft: true,
      plainSummary: `收受赃物是指您接受、购买、持有或帮助隐匿您知道或应该知道是被盗的财物。检察官必须证明您知道这些物品是被盗的。`,
      keyTerms: [
        { plainMeaning: `您知道或应该合理地知道您接受财物时它是被盗的。`, example: `以50美元从陌生人那里购买新iPhone可能证明您知道它是赃物` },
        { plainMeaning: `对被盗财物的控制，无论您是购买、收到作为礼物，还是发现了它。`, example: `家里有来自被盗商店的物品，即使是别人偷的` },
        { plainMeaning: `帮助某人隐藏或处置被盗财物以避免被发现。`, example: `明知商品是从商店拿来的，仍将其储存在您的车库中` },
      ],
      degreeContext: `收受低价值赃物（通常低于500至1000美元）是轻罪。高价值物品将罪名升级为重罪。反复购买赃物的二手商贩可能面临额外的共谋或刑事企业指控。`,
    },
  },

  "criminal-nonsupport": {
    es: {
      draft: true,
      plainSummary: `El no pago criminal de manutención significa que usted deliberadamente dejó de pagar la manutención de hijos u otro apoyo económico ordenado por un tribunal. El fiscal debe probar que tenía la capacidad de pagar pero se negó a hacerlo.`,
      keyTerms: [
        { plainMeaning: `Dinero ordenado por un tribunal para pagar los gastos de subsistencia de su hijo o ex cónyuge.`, example: `Pagos mensuales de manutención infantil ordenados como parte de un divorcio o sentencia de paternidad` },
        { plainMeaning: `Tenía recursos financieros suficientes para realizar los pagos pero eligió no hacerlo.`, example: `Tener un trabajo estable pero no pagar la manutención de hijos durante varios meses` },
        { plainMeaning: `La cantidad total que debe en pagos de manutención atrasados.`, example: `$5,000 en pagos de manutención de hijos no realizados que se han acumulado` },
      ],
      degreeContext: `El no pago criminal de manutención es generalmente un delito menor para primeras ofensas con multa y posible cárcel. Las cantidades grandes en atraso o la negativa prolongada puede convertirlo en un delito grave. Los delitos federales se aplican cuando el padre se mudó fuera del estado para evitar pagos.`,
    },
    zh: {
      draft: true,
      plainSummary: `刑事拒绝抚养意味着您故意停止支付法院命令的子女抚养费或其他经济支持。检察官必须证明您有能力支付但拒绝这样做。`,
      keyTerms: [
        { plainMeaning: `法院命令支付的用于子女或前配偶生活费用的金钱。`, example: `作为离婚或亲子关系判决的一部分而命令的每月子女抚养费` },
        { plainMeaning: `您有足够的财务资源支付，但选择不支付。`, example: `有稳定工作但连续数月不支付子女抚养费` },
        { plainMeaning: `您拖欠的抚养费总额。`, example: `已累积的5000美元未付子女抚养费` },
      ],
      degreeContext: `刑事拒绝抚养通常对初次违法者是轻罪，可处罚款和可能的监禁。大额欠款或长期拒绝支付可能升级为重罪。当父母跨州逃避支付时，适用联邦罪行。`,
    },
  },

  "abuse-of-family-member": {
    es: {
      draft: true,
      plainSummary: `Los cargos de abuso de familiar o pareja íntima cubren daño físico, emocional o económico dirigido a alguien en una relación doméstica. Las leyes de violencia doméstica a menudo se superponen con estos cargos.`,
      keyTerms: [
        { plainMeaning: `Un patrón de comportamiento utilizado para ganar o mantener poder y control sobre un familiar o pareja.`, example: `Controlar el acceso al dinero, aislando a la víctima de amigos y familia, y tomando decisiones en nombre de la víctima` },
        { plainMeaning: `Impedir que la víctima acceda a o use recursos económicos, empleo, o educación.`, example: `Controlar todas las cuentas bancarias y no dejar a la víctima tener dinero propio` },
        { plainMeaning: `Amenazas repetidas, intimidación o comportamiento que causa miedo a la violencia.`, example: `Amenazar repetidamente con hacerle daño a la víctima si abandona la relación` },
      ],
      degreeContext: `Típicamente cargado como delito menor por primeras ofensas sin lesiones graves. Escala a un delito grave con historial previo de violencia doméstica, uso de arma, o lesiones corporales graves. La condena conlleva pérdida de derechos federales de armas de fuego, órdenes obligatorias de no contacto, y finalización requerida de un programa de intervención.`,
    },
    zh: {
      draft: true,
      plainSummary: `家庭成员或亲密伴侣虐待指控涵盖针对家庭关系中某人的身体、情感或经济伤害。家庭暴力法律通常与这些指控重叠。`,
      keyTerms: [
        { plainMeaning: `用于获取或维持对家庭成员或伴侣权力和控制的行为模式。`, example: `控制金钱获取渠道、将受害者与朋友家人隔离、代替受害者做决定` },
        { plainMeaning: `阻止受害者获取或使用经济资源、就业或教育。`, example: `控制所有银行账户，不让受害者拥有自己的钱` },
        { plainMeaning: `导致对暴力产生恐惧的反复威胁、恐吓或行为。`, example: `反复威胁如果受害者离开关系就伤害对方` },
      ],
      degreeContext: `无严重伤害的初次违法通常以轻罪起诉。有家庭暴力前史、使用武器或造成严重人身伤害则升级为重罪。定罪将导致丧失联邦枪支权利、强制禁止联系令，以及须完成施暴者干预计划。`,
    },
  },

  "hit-and-run": {
    es: {
      draft: true,
      plainSummary: `Darse a la fuga significa que estuvo involucrado en un accidente de vehículo y se fue de la escena sin detenerse para identificarse, intercambiar información, o proporcionar ayuda a cualquier persona lesionada. Si se trata de un delito menor o grave depende casi en su totalidad de si alguien resultó lesionado.`,
      keyTerms: [
        { plainMeaning: `Todo conductor involucrado en un accidente debe detenerse en o cerca de la escena. Este es un requisito legal en todos los estados.`, example: `Golpear otro auto en un estacionamiento y conducir, aunque el daño parezca menor` },
        { plainMeaning: `Si alguien resulta lesionado, debe proporcionar ayuda razonable. Llamar al 911 satisface esto en la mayoría de los estados.`, example: `Llamar a los servicios de emergencia antes de irse de la escena muestra un intento de proporcionar ayuda` },
        { plainMeaning: `Irse después de un accidente solo con daño a la propiedad es un delito menor en la mayoría de los estados; irse después de una lesión o muerte es un delito grave.`, example: `Golpear un auto estacionado y conducir es muy diferente legalmente a atropellar a un peatón y huir` },
      ],
      degreeContext: `Darse a la fuga que involucra solo daño a la propiedad es típicamente un delito menor con multas y posible suspensión de licencia. Si una persona resultó lesionada, se convierte en un delito grave con 1 a 5 años de prisión en la mayoría de los estados. Si la víctima murió, puede llevar 5 a 15 años. Entregarse rápidamente es a menudo un factor mitigante significativo.`,
    },
    zh: {
      draft: true,
      plainSummary: `肇事逃逸意味着您卷入车辆事故后，未停车确认身份、交换信息或向受伤人员提供援助就离开了现场。这是轻罪还是重罪几乎完全取决于是否有人受伤。`,
      keyTerms: [
        { plainMeaning: `事故中的每位驾驶员必须在现场附近停车。这是所有州的法律要求。`, example: `在停车场碰到其他汽车后开走，即使损坏看起来很轻微` },
        { plainMeaning: `如有人受伤，您必须提供合理帮助。在大多数州，拨打911即可满足这一要求。`, example: `离开现场前致电紧急服务，表明曾尝试提供帮助` },
        { plainMeaning: `在只有财产损失的事故后逃离在大多数州是轻罪；在人员伤亡后逃离是重罪。`, example: `撞上停着的汽车后开走与撞倒行人后逃跑在法律上截然不同` },
      ],
      degreeContext: `仅涉及财产损失的肇事逃逸通常是轻罪，可处罚款和可能吊销驾照。如有人受伤，在大多数州升级为重罪，可判1至5年监禁。如受害者死亡，可判5至15年。尽快自首通常是重要的减轻情节。`,
    },
  },

  "resisting-arrest": {
    es: {
      draft: true,
      plainSummary: `La resistencia al arresto significa que luchó físicamente, huyó, o de otra manera impidió activamente que un oficial realizara un arresto legal. La obstrucción de la justicia significa que interfirió con una investigación policial o un procedimiento judicial.`,
      keyTerms: [
        { plainMeaning: `El oficial debe haber tenido una base legal para realizar el arresto. Resistir un arresto ilegal puede ser una defensa en algunos estados.`, example: `Un oficial que intenta arrestarle basado en una orden válida está realizando un arresto legal` },
        { plainMeaning: `Alejarse, correr, empujar, o pelear con el oficial. Incluso la resistencia física menor cuenta.`, example: `Alejar el brazo cuando un oficial intenta ponerle esposas` },
        { plainMeaning: `Cualquier acto deliberado que obstaculice una investigación policial o un procedimiento judicial: declaraciones falsas, destruir evidencia, o amenazar testigos.`, example: `Decirle a la policía que no conoce a alguien cuando sí lo conoce, para protegerlo de una investigación` },
      ],
      degreeContext: `La resistencia al arresto sin violencia es típicamente un delito menor con multas y hasta un año en la cárcel. La resistencia con violencia es un delito grave. La obstrucción de la justicia es un delito menor para la interferencia simple pero puede ser un delito grave federal para investigaciones federales, con penas de hasta 5 a 20 años.`,
    },
    zh: {
      draft: true,
      plainSummary: `拒绝逮捕是指您进行身体抵抗、逃跑或以其他方式主动阻止警察依法逮捕。妨碍司法公正是指您干扰了警察调查或法庭程序：提供虚假信息、隐匿证据或恐吓证人。`,
      keyTerms: [
        { plainMeaning: `警察必须有合法依据进行逮捕。在某些州，抵抗非法逮捕可能是辩护理由，但尝试这样做有风险。`, example: `警察依据有效逮捕令试图逮捕您，构成合法逮捕` },
        { plainMeaning: `挣脱、奔跑、推搡或与警察搏斗。即使轻微的身体抵抗也算。`, example: `警察试图给您上手铐时拉开手臂` },
        { plainMeaning: `任何故意阻碍警察调查或法庭程序的行为：虚假陈述、销毁证据或威胁证人。`, example: `向警察谎称不认识某人以保护其免受调查` },
      ],
      degreeContext: `无暴力的拒捕通常是轻罪，可处罚款和最长一年监禁。涉及暴力的抵抗，即打伤或伤害警察，是重罪。妨碍司法对于简单干扰是轻罪，但对联邦调查可能是联邦重罪，可判5至20年。`,
    },
  },

  "perjury": {
    es: {
      draft: true,
      plainSummary: `El perjurio significa que hizo una declaración falsa bajo juramento, como en un testimonio judicial, una declaración, o en un documento jurado, sabiendo que la declaración era falsa. La mentira debe ser material, lo que significa que tenía el potencial de afectar el resultado del caso.`,
      keyTerms: [
        { plainMeaning: `Había jurado o prometido formalmente decir la verdad: en un juzgado, una declaración, un gran jurado, o en una declaración jurada firmada.`, example: `Testimonio dado después de ser juramentado por el secretario del tribunal, o una declaración jurada firmada y notariada` },
        { plainMeaning: `La declaración falsa debe ser sobre algo importante para el caso, no un detalle menor o irrelevante.`, example: `Mentir sobre dónde estaba la noche del crimen es material; mentir sobre lo que desayunó no lo es` },
        { plainMeaning: `Sabía que la declaración era falsa cuando la hizo. Estar equivocado o no recordar bien no es perjurio.`, example: `Testificar que nunca ha conocido a alguien cuando claramente recuerda haberlo conocido varias veces` },
      ],
      degreeContext: `El perjurio es un delito grave en todas las jurisdicciones de EE.UU. El perjurio federal conlleva hasta 5 años de prisión por cargo. El perjurio estatal típicamente conlleva 2 a 5 años. Múltiples declaraciones falsas en el mismo procedimiento pueden cargarse como cargos separados.`,
    },
    zh: {
      draft: true,
      plainSummary: `作伪证是指您在宣誓后做出虚假陈述，例如在法庭证词、宣誓证词或经宣誓的文件中，同时知道该陈述是虚假的。谎言必须具有实质性，即有可能影响案件结果。`,
      keyTerms: [
        { plainMeaning: `您已正式宣誓或确认如实陈述：在法庭、宣誓证词、大陪审团，或签署的宣誓书上。`, example: `经法庭书记官宣誓后给出的证词，或签署并经公证的宣誓书` },
        { plainMeaning: `虚假陈述必须涉及案件的重要事项，而非次要或无关细节。`, example: `谎称案发当晚在哪里是实质性的；谎称早餐吃了什么则不是` },
        { plainMeaning: `您在做出陈述时知道该陈述是虚假的。记错或误记不构成作伪证。`, example: `明明清楚记得多次见过某人，却作证说从未见过对方` },
      ],
      degreeContext: `作伪证在美国所有司法管辖区都是重罪。联邦作伪证每项指控可判最长5年监禁。州级作伪证通常可判2至5年。同一程序中的多个虚假陈述可被分别起诉为独立指控。`,
    },
  },

  "marijuana-possession": {
    es: {
      draft: true,
      plainSummary: `La posesión de marihuana significa que tenía cannabis, productos de THC o artículos relacionados y era ilegal en ese estado, excedía el límite legal de uso personal, o estaba en un lugar prohibido. Incluso en estados que han legalizado la marihuana, poseer más del límite legal personal o poseerla en ciertos lugares sigue siendo un crimen.`,
      keyTerms: [
        { plainMeaning: `La cantidad máxima de marihuana que una persona puede poseer legalmente en estados donde es legal: típicamente 1 a 2 onzas para adultos.`, example: `Poseer 4 onzas en un estado donde el límite legal es 1 onza sigue siendo un crimen aunque la marihuana sea legal allí` },
        { plainMeaning: `Tener marihuana en una cantidad que excede la asignación personal legal.`, example: `Ser sorprendido con 3 onzas cuando el límite de su estado es 1 onza` },
        { plainMeaning: `El compuesto psicoactivo activo en la marihuana. Los productos que contienen THC están sujetos a las mismas leyes de posesión que el cannabis crudo.`, example: `Un cartucho de vaporizador de THC se trata como posesión de marihuana en la mayoría de las jurisdicciones` },
      ],
      degreeContext: `La posesión simple de una pequeña cantidad (generalmente menos de 1 onza en la mayoría de los estados) es un delito menor o, en muchos estados de legalización, una infracción civil con solo una multa. La posesión de cantidades mayores o en zona escolar es un delito menor más grave o un delito grave. Las cantidades suficientemente grandes para sugerir distribución desplazan el cargo hacia el tráfico.`,
    },
    zh: {
      draft: true,
      plainSummary: `大麻持有意味着您持有大麻、THC产品或相关物品，且在该州是非法的、超过了合法个人使用限量，或您处于禁止区域。即使在已将大麻合法化的州，持有超过法定个人限量或在某些场所持有仍构成犯罪。`,
      keyTerms: [
        { plainMeaning: `在大麻合法化的州，个人可合法持有的最大大麻量：成年人通常为1至2盎司。`, example: `在个人限量为1盎司的州持有4盎司，即使大麻在该州合法，仍构成犯罪` },
        { plainMeaning: `持有大麻超过法定个人限量，通常与完全非法分开单独起诉。`, example: `当您所在州的限量为1盎司时，被发现持有3盎司` },
        { plainMeaning: `大麻中的活性精神活性化合物。含THC的产品在大多数司法管辖区与生大麻受相同的持有法律约束。`, example: `在大多数司法管辖区，THC雾化弹被视为大麻持有` },
      ],
      degreeContext: `少量大麻的简单持有（大多数州不超过1盎司）是轻罪，或在许多合法化州仅处罚款的民事违法行为。持有较大数量或在学校区域是更严重的轻罪或重罪。足以暗示分发意图的数量（通常超过1磅）会将罪名转向贩运。`,
    },
  },

  "rape": {
    es: {
      draft: true,
      plainSummary: `La violación es el crimen de penetración sexual no consensual. Es la misma conducta que muchos estados ahora llaman agresión sexual en primer grado, pero algunos estados todavía usan el término violación. El fiscal debe probar que ocurrió penetración y que la víctima no consintió o no podía consentir.`,
      keyTerms: [
        { plainMeaning: `Cualquier penetración sexual, por leve que sea, de cualquier parte del cuerpo o con cualquier objeto. Este es el elemento del acto que distingue la violación de los delitos sexuales menores.`, example: `Incluso una penetración mínima satisface este elemento. El acto no tiene que completarse.` },
        { plainMeaning: `La víctima no acordó libremente el acto, o era legalmente incapaz de consentir debido a su edad, intoxicación, inconsciencia o incapacidad mental.`, example: `Una persona que está inconsciente o severamente intoxicada no puede dar consentimiento legal independientemente de lo que haya dicho antes` },
        { plainMeaning: `En algunas definiciones, el acto debe haberse logrado mediante fuerza física, amenazas o aprovechándose de la incapacidad de la víctima.`, example: `Usar restricción física, amenazas de daño, o una posición de autoridad para superar la resistencia de la víctima` },
      ],
      degreeContext: `La violación es universalmente un delito grave. La violación en primer grado (que involucra fuerza, armas o lesiones graves) típicamente conlleva 10 a 25 años o cadena perpetua. La violación de un menor conlleva condenas obligatorias de 10 a 25 años a cadena perpetua, y todas las condenas requieren registro de delincuente sexual.`,
    },
    zh: {
      draft: true,
      plainSummary: `强奸是非经同意的性插入犯罪。这与许多州现在称为「一级性侵犯」的行为相同，但部分州仍使用强奸一词。检察官必须证明发生了性插入且受害者未同意或无法同意。`,
      keyTerms: [
        { plainMeaning: `无论程度多轻，任何身体部位或任何物体的性插入。这是将强奸与较轻性罪行区分开来的行为要素。`, example: `即使是最轻微的插入也满足此要素。行为不必完成。` },
        { plainMeaning: `受害者未自由同意该行为，或因年龄、醉酒、失去意识或精神障碍而在法律上无法给予同意。`, example: `无意识或严重醉酒的人无法给予合法同意，无论其之前说过什么` },
        { plainMeaning: `在某些定义中，该行为必须通过身体力量、威胁或利用受害者无能为力的状态来实现。`, example: `使用身体束缚、伤害威胁或权威地位克服受害者的抵抗` },
      ],
      degreeContext: `强奸在所有司法管辖区都是重罪。一级强奸（涉及武力、武器或严重伤害）通常可判10至25年或终身监禁。强奸儿童有10至25年至终身监禁的强制刑期，所有定罪都需要登记为性犯罪者。`,
    },
  },

  "forgery": {
    es: {
      draft: true,
      plainSummary: `La falsificación significa que hizo, alteró o usó un documento escrito falso con la intención de defraudar a alguien. Esto cubre una amplia gama de documentos: firmas, cheques, contratos, identificaciones, recetas, testamentos y documentos oficiales.`,
      keyTerms: [
        { plainMeaning: `Crear un documento que falsamente parece ser genuino, o alterar un documento real para que diga algo que no dice.`, example: `Firmar el nombre de otra persona en un cheque, o cambiar la cantidad en un cheque que recibió` },
        { plainMeaning: `Tenía la intención de usar el documento para engañar a alguien para que le diera dinero, propiedad o un beneficio.`, example: `Crear una receta falsa para obtener medicación, o alterar un contrato para cambiar los términos de pago a su favor` },
        { plainMeaning: `Pasar o presentar un documento falsificado a alguien, aunque usted no lo haya creado.`, example: `Entregar un cheque falsificado a un cajero bancario para cobrarlo, aunque alguien más falsificó la firma` },
      ],
      degreeContext: `La falsificación es generalmente un delito grave con penas de 1 a 10 años dependiendo del tipo de documento y el valor del fraude intentado. La falsificación de documentos del gobierno, divisas, o certificados académicos puede resultar en condenas federales adicionales. La falsificación de recetas trae penas adicionales de drogas.`,
    },
    zh: {
      draft: true,
      plainSummary: `伪造是指您制作、改变或使用虚假书面文件，意图欺骗他人。这涵盖广泛的文件：签名、支票、合同、身份证件、处方、遗嘱和官方文件。`,
      keyTerms: [
        { plainMeaning: `创建虚假地看似真实的文件，或篡改真实文件使其陈述不实内容。`, example: `在支票上签署他人姓名，或更改您收到的支票上的金额` },
        { plainMeaning: `您打算使用该文件欺骗他人给您金钱、财产或利益。`, example: `制造假处方获取药物，或篡改合同以更改对您有利的付款条款` },
        { plainMeaning: `向他人传递或出示伪造文件，即使您并非创建者。`, example: `向银行出纳员递交伪造支票以兑现，即使别人伪造了签名` },
      ],
      degreeContext: `伪造通常是重罪，根据文件类型和意图欺诈的价值，可判1至10年监禁。伪造政府文件、货币或学历证书可能导致额外的联邦定罪。伪造处方会带来额外的毒品处罚。`,
    },
  },

  "failure-to-appear": {
    es: {
      draft: true,
      plainSummary: `No comparecer ante el tribunal significa que no se presentó a una audiencia judicial programada. Es un crimen separado del subyacente y generalmente resulta en una orden de arresto. Si estaba en libertad bajo fianza, su fianza puede ser revocada.`,
      keyTerms: [
        { plainMeaning: `Una notificación oficial de que debe estar en el tribunal en una fecha y hora específicas. Recibirla significa que tiene la obligación legal de estar allí.`, example: `Una citación del tribunal, una orden de liberación en libertad bajo fianza que enumera su próxima audiencia, o una carta de su abogado sobre las fechas del tribunal` },
        { plainMeaning: `Una orden emitida por el juez que le permite ser arrestado en cualquier momento por oficiales de la ley por su fracaso en comparecer.`, example: `La policía puede detenerle en una parada de tráfico si hay una orden de arresto activa en su contra` },
        { plainMeaning: `El dinero o la propiedad pagados para garantizar su liberación de la cárcel antes del juicio. Si no comparece, esta cantidad puede ser declarada perdida.`, example: `Si pagó $5,000 de fianza y no comparece, puede perder ese dinero` },
      ],
      degreeContext: `No comparecer por un cargo de delito menor es típicamente en sí mismo un delito menor. No comparecer por un cargo de delito grave puede ser un delito grave. Las consecuencias inmediatas incluyen una orden de arresto y la revocación de la fianza. Los futuros tribunales verán el no comparecer negativamente al considerar la fianza.`,
    },
    zh: {
      draft: true,
      plainSummary: `未出庭是指您未在预定的法庭听证会上出席。这是一项独立于基础罪行的犯罪，通常导致逮捕令被签发。如果您在保释中，您的保释可能被吊销。`,
      keyTerms: [
        { plainMeaning: `要求您在特定日期和时间出现在法庭的正式通知。收到此通知意味着您有法律义务出庭。`, example: `法庭传票、列明下次听证日期的保释释放令，或律师关于法庭日期的信函` },
        { plainMeaning: `法官签发的命令，允许执法人员随时逮捕您，因为您未能出庭。`, example: `如果有效逮捕令对您生效，警察可以在交通拦截时拘留您` },
        { plainMeaning: `为担保您在审判前获释而支付的金钱或财产。如果您未出庭，这笔金额可能被宣告没收。`, example: `如果您支付了5000美元保释金而未出庭，您可能损失这笔钱` },
      ],
      degreeContext: `轻罪指控中未出庭本身通常也是轻罪。重罪指控中未出庭可能是重罪。直接后果包括签发逮捕令和吊销保释。未来的法庭在考虑保释问题时会对未出庭记录持负面看法。`,
    },
  },

  "failure-to-identify": {
    es: {
      draft: true,
      plainSummary: `La negativa a identificarse significa que se negó a proporcionar su nombre, dirección u otra información de identificación cuando un oficial de policía lo solicitó legalmente. No todos los estados tienen este cargo; muchos estados no requieren que los ciudadanos proporcionen identificación durante una detención a menos que sean arrestados.`,
      keyTerms: [
        { plainMeaning: `En los estados con leyes detener y dar nombre, un oficial con sospecha razonable para detenerte puede requerir que proporciones tu nombre.`, example: `Un oficial que investiga un robo cercano puede pedirle que se identifique si está en el área` },
        { plainMeaning: `Un estándar legal más bajo que causa probable, lo que significa que el oficial tiene hechos específicos que sugieren que usted pudo haber cometido un crimen.`, example: `Un oficial que le ve salir corriendo de un negocio con el sonido de una alarma tiene sospecha razonable` },
        { plainMeaning: `En algunos estados, solo el nombre es requerido; en otros, el nombre y la dirección; en otros, no se requiere identificación en absoluto sin un arresto.`, example: `En California, no hay obligación de identificarse durante una detención a menos que sea arrestado` },
      ],
      degreeContext: `En estados con leyes de detención y nombre, la negativa a identificarse es típicamente un delito menor con multas. La desobediencia de una orden legal puede añadir un cargo de obstrucción. Algunos estados no tienen este cargo en absoluto. Proporcionar información falsa en respuesta a la solicitud de un oficial es generalmente un cargo separado y más grave.`,
    },
    zh: {
      draft: true,
      plainSummary: `拒绝表明身份是指当警察合法要求时，您拒绝提供您的姓名、地址或其他身份信息。并非所有州都有此项指控；许多州不要求公民在被拦截时提供身份证明，除非被逮捕。`,
      keyTerms: [
        { plainMeaning: `在有「停下并报出姓名」法律的州，有合理怀疑可拦截您的警察可以要求您提供姓名。`, example: `调查附近抢劫案的警察如果您在附近区域，可能要求您表明身份` },
        { plainMeaning: `比可能原因更低的法律标准，意味着警察有具体事实表明您可能实施了犯罪。`, example: `警察看见您在听到警报声后从商店跑出，构成合理怀疑` },
        { plainMeaning: `在一些州只需要提供姓名；在其他州需要姓名和地址；在另一些州，未被逮捕则根本不需要提供身份证明。`, example: `在加利福尼亚州，被拦截时没有提供身份证明的义务，除非被逮捕` },
      ],
      degreeContext: `在有停留并表明姓名法律的州，拒绝表明身份通常是可处罚款的轻罪。不服从合法命令可能增加妨碍司法指控。部分州根本没有此项指控。在回应警察要求时提供虚假信息通常是单独的、更严重的指控。`,
    },
  },

  "indecent-exposure": {
    es: {
      draft: true,
      plainSummary: `La exposición indecente significa que expuso sus genitales en un lugar público o a la vista de otros que no consintieron verlo. La imposición sexual grave y el asalto indecente cubren el toque sexual no deseado que no llega a la penetración.`,
      keyTerms: [
        { plainMeaning: `Exponer partes privadas del cuerpo en un lugar donde otros pueden verlas, sin una expectativa razonable de privacidad.`, example: `Orinar contra un edificio a la vista del público, o exponerse deliberadamente a un transeúnte` },
        { plainMeaning: `Contacto con las partes íntimas de otra persona para gratificación sexual, sin su consentimiento.`, example: `Agarrar, manosear, o frotar a alguien de manera sexual cuando no lo han acordado` },
        { plainMeaning: `El claro acuerdo voluntario de la otra persona para el contacto. La ausencia de protesta sola no es consentimiento.`, example: `Una persona que está dormida, drogada, o paralizada de miedo no ha consentido aunque no diga nada` },
      ],
      degreeContext: `La exposición indecente es típicamente un delito menor para una primera ofensa, pero se convierte en un delito grave para reincidentes o si un menor presenció el acto. La imposición sexual grave y el asalto indecente son generalmente delitos graves que conllevan 1 a 5 años. Todas las condenas por delito sexual, incluso los delitos menores que involucran exposición a un menor, pueden requerir el registro de delincuente sexual.`,
    },
    zh: {
      draft: true,
      plainSummary: `猥亵暴露是指您在公共场所或在未同意观看的他人面前暴露生殖器。强制性性侵犯和猥亵攻击涵盖未达到插入程度的不受欢迎的性接触。`,
      keyTerms: [
        { plainMeaning: `在他人可以看到的地方暴露私密部位，没有合理的隐私期望。`, example: `在公众视野中对着建筑物小便，或故意向路人暴露自身` },
        { plainMeaning: `未经同意以性满足为目的接触他人私密部位。`, example: `以性方式抓握、触摸或摩擦未同意的人` },
        { plainMeaning: `另一方对接触的明确、自愿同意。仅仅没有反对不构成同意。`, example: `熟睡、被麻醉或因恐惧而僵住的人，即使没说话也未曾同意` },
      ],
      degreeContext: `猥亵暴露通常对初次违法者是轻罪，但对累犯或有未成年人目睹的情况升级为重罪。强制性性侵犯和猥亵攻击通常是可判1至5年的重罪。所有性犯罪定罪，即使是涉及向未成年人暴露的轻罪，根据州法律可能都需要登记为性犯罪者。`,
    },
  },

  "reckless-driving": {
    es: {
      draft: true,
      plainSummary: `La conducción imprudente o conducta imprudente significa que operó un vehículo (o actuó de alguna otra manera) con un desprecio consciente por el riesgo sustancial de daño a otras personas o propiedad. Es más grave que la negligencia simple.`,
      keyTerms: [
        { plainMeaning: `Usted era consciente del riesgo que creaban sus acciones y eligió ignorarlo, no solo un error de juicio.`, example: `Correr con otro vehículo a través de un área concurrida al doble del límite de velocidad, sabiendo que había autos y peatones presentes` },
        { plainMeaning: `Un riesgo que es significativo e injustificable dadas las circunstancias. No todo riesgo es criminal.`, example: `Zigzaguear entre carriles a alta velocidad en una autopista ocupada crea un riesgo sustancial; exceder el límite en 10 mph en una carretera vacía no` },
        { plainMeaning: `Un cargo relacionado que se centra en el riesgo de daño creado, incluso sin un accidente. No tiene que lastimar realmente a nadie.`, example: `Disparar un arma al aire en un vecindario residencial: el riesgo para otros lo hace criminal aunque nadie resulte herido` },
      ],
      degreeContext: `La conducción imprudente es generalmente un delito menor con multas, suspensión de licencia y hasta 90 días o un año en la cárcel. Si la conducta imprudente causa lesiones, escala a un delito menor más grave o un delito grave de bajo nivel. La conducta imprudente que causa lesiones graves o muerte se convierte en un delito grave: el peligro imprudente lleva 1 a 5 años, el homicidio imprudente 2 a 10 años según el estado.`,
    },
    zh: {
      draft: true,
      plainSummary: `鲁莽驾驶或鲁莽行为是指您以有意识地无视对他人或财产造成重大伤害风险的方式驾驶车辆（或以其他方式行事）。这比简单过失更严重。`,
      keyTerms: [
        { plainMeaning: `您意识到自己的行为所造成的风险并选择忽视，而不仅仅是判断失误。`, example: `在人群密集区域以两倍限速与另一辆车竞速，明知有汽车和行人在场` },
        { plainMeaning: `在特定情况下重大且不合理的风险。并非每种风险都构成犯罪。`, example: `在繁忙高速公路上高速穿梭换道造成重大风险；在空旷道路上超速10英里则不然` },
        { plainMeaning: `相关指控，关注所创造的伤害风险，即使没有发生事故。不必真正伤害任何人。`, example: `在住宅区向空中开枪：对他人的风险使其构成犯罪，即使没有人受伤` },
      ],
      degreeContext: `鲁莽驾驶通常是轻罪，可处罚款、吊销驾照和最长90天至一年监禁。如果鲁莽行为造成伤害，升级为更严重的轻罪或低级重罪。造成严重伤害或死亡的鲁莽行为变成重罪：鲁莽危险行为可判1至5年，鲁莽杀人根据州法律可判2至10年。`,
    },
  },

  "public-intoxication": {
    es: {
      draft: true,
      plainSummary: `La intoxicación pública significa que estaba visiblemente ebrio o deteriorado en un lugar público hasta un punto en que era un peligro para usted mismo o para otros, o estaba causando perturbaciones. Menor en posesión significa que una persona menor de la edad legal para beber (21 en todos los estados de EE.UU.) tenía alcohol.`,
      keyTerms: [
        { plainMeaning: `Cualquier área accesible al público en general: calles, parques, estacionamientos, frentes de tiendas.`, example: `Estar borracho en su propiedad privada generalmente no es intoxicación pública` },
        { plainMeaning: `La mayoría de los estados requieren más que solo estar visiblemente borracho. Debe ser inseguro o molestar a otros.`, example: `Tambalearse hacia el tráfico o pelear con extraños llega al umbral; sentarse tranquilamente en un banco del parque puede no hacerlo` },
        { plainMeaning: `Una persona menor de 21 años que tiene alcohol. Esto aplica incluso a un contenedor cerrado sin abrir.`, example: `Un joven de 19 años que sostiene una cerveza sellada que no ha abierto puede ser citado por posesión de alcohol siendo menor` },
      ],
      degreeContext: `Estos son casi siempre delitos menores o infracciones civiles. La intoxicación pública a menudo se maneja con una breve detención en lugar de procesamiento. Las multas son el resultado más común; el tiempo de cárcel es raro para las primeras ofensas. Menor en posesión a menudo lleva una multa, servicio comunitario y suspensión de licencia para conductores jóvenes.`,
    },
    zh: {
      draft: true,
      plainSummary: `公共醉酒是指您在公共场所明显醉酒或受损，程度已对自己或他人构成危险，或正在造成骚乱。未成年人持有酒精是指未达到法定饮酒年龄（美国所有州为21岁）的人持有酒精。`,
      keyTerms: [
        { plainMeaning: `任何公众可进入的区域：街道、公园、停车场、商店门面。`, example: `在您自己的私人财产上醉酒通常不构成公共醉酒` },
        { plainMeaning: `大多数州需要的不仅仅是明显醉酒。您必须是不安全的或打扰他人。`, example: `踉踉跄跄地冲向车流或与陌生人打架达到门槛；安静地坐在公园长椅上可能不构成` },
        { plainMeaning: `未满21岁的人持有酒精。即使是密封未开封的容器也适用。`, example: `19岁的人持有未开封的密封啤酒可能被以未成年人持有酒精引用` },
      ],
      degreeContext: `这些几乎都是轻罪或民事违法行为。公共醉酒通常通过短暂拘留而非起诉来处理。罚款是最常见的结果；初次违法很少判监禁。未成年人持有通常处以罚款、社区服务，以及对年轻司机的驾照暂停。`,
    },
  },

  "loitering": {
    es: {
      draft: true,
      plainSummary: `Estos son delitos de orden público de bajo nivel y de calidad de vida. El vagabundeo significa permanecer en un lugar público sin un propósito aparente de una manera que levanta sospechas o molesta a otros. La mendicidad agresiva cubre pedir dinero de una manera que intimida.`,
      keyTerms: [
        { plainMeaning: `Permanecer en un lugar sin un propósito legal claro, de una manera que una persona razonable encontraría alarmante.`, example: `Estar parado fuera de un negocio cerrado durante horas, negándose a moverse cuando la policía lo pide` },
        { plainMeaning: `Pedir dinero de una manera que involucra seguir, bloquear, amenazar, o acercarse repetidamente a alguien después de que dijeron que no.`, example: `Seguir a una persona por la calle pidiendo dinero después de que dijo que no una vez` },
        { plainMeaning: `La mayoría de estas ofensas son infracciones civiles en lugar de cargos penales. Resultan en multas, no en tiempo de cárcel o antecedentes penales.`, example: `Una multa por tirar basura no va en su historial criminal de la misma manera que una condena por delito menor` },
      ],
      degreeContext: `La mayoría son infracciones civiles o delitos menores menores castigables solo con multas. Las violaciones repetidas o la conducta que escala al hostigamiento puede convertirse en cargos más serios. Los procesamientos de campamento ilegal han disminuido en muchas ciudades tras fallos judiciales que limitan la aplicación cuando no hay refugio disponible.`,
    },
    zh: {
      draft: true,
      plainSummary: `这些是低级公共秩序和生活质量违法行为。游荡是指在公共场所无明显目的地徘徊，以引起怀疑或打扰他人的方式。乞讨或侵扰性拉客涵盖以恐吓方式乞讨钱财。`,
      keyTerms: [
        { plainMeaning: `在一个没有明显合法目的的地方停留，以理性人认为令人担忧的方式。`, example: `在关门的商店外站了几个小时，被警察要求离开时拒绝` },
        { plainMeaning: `以跟随、阻挡、威胁或在对方拒绝后反复接近的方式乞讨钱财。`, example: `在对方说了一次不后仍跟随其走下街道乞讨` },
        { plainMeaning: `大多数这类违法行为是民事违规（如交通罚单）而非刑事指控，处以罚款而不是监禁或刑事记录。`, example: `乱扔垃圾的罚单不像轻罪定罪那样记入您的犯罪记录` },
      ],
      degreeContext: `大多数是民事违规或轻微轻罪，只处罚款。多次违规或升级为骚扰的行为可能演变为更严重的指控。在许多城市，在没有可用庇护所时限制执法的法院裁决出台后，非法露营起诉已减少。`,
    },
  },

  "hate-crime-enhancement": {
    es: {
      draft: true,
      plainSummary: `Un cargo de crimen de odio o mejora significa que el delito subyacente (asalto, vandalismo, hostigamiento, etc.) fue motivado por la raza, religión, origen nacional, orientación sexual, identidad de género o discapacidad de la víctima. El delito subyacente se carga por separado, y el crimen de odio agrega un cargo adicional o aumenta la condena.`,
      keyTerms: [
        { plainMeaning: `El crimen fue cometido debido a la membresía real o percibida de la víctima en un grupo protegido, no solo que usted tenía sesgo, sino que el sesgo le causó a cometer el crimen.`, example: `Pintar un insulto racial en el auto de alguien es vandalismo convertido en crimen de odio por la motivación del sesgo` },
        { plainMeaning: `En la mayoría de los estados, el crimen de odio agrega años a la condena del delito subyacente. A nivel federal, también es un crimen separado.`, example: `Un asalto que lleva 2 años se convierte en 4 a 6 años con una mejora por crimen de odio` },
        { plainMeaning: `Los rasgos que activan las leyes de crimen de odio: raza, color, religión, origen nacional, orientación sexual, identidad de género, discapacidad, y en algunos estados otros.`, example: `Atacar a alguien por ser judío, gay, discapacitado o de una etnia particular califica` },
      ],
      degreeContext: `Las mejoras de crimen de odio típicamente aumentan la condena en un 50 a 100% sobre el delito base. Las condenas federales de crimen de odio (Ley Matthew Shepard) conllevan hasta 10 años adicionales al crimen subyacente, o cadena perpetua si el delito involucró secuestro, agresión sexual, o resultó en muerte.`,
    },
    zh: {
      draft: true,
      plainSummary: `仇恨犯罪指控或加重情节意味着基础罪行（攻击、破坏、骚扰等）是出于对受害者种族、宗教、国籍、性取向、性别认同或残疾的偏见动机。基础罪行单独起诉，仇恨犯罪增加额外指控或加重刑罚。`,
      keyTerms: [
        { plainMeaning: `犯罪是因受害者实际或被认为是受保护群体的成员而实施的，不仅仅是您有偏见，而是偏见导致您实施了犯罪。`, example: `在某人车上喷涂种族性侮辱词是因偏见动机而构成仇恨犯罪的破坏行为` },
        { plainMeaning: `在大多数州，仇恨犯罪在基础罪行刑期上额外增加数年。在联邦层面，它也是单独的罪行。`, example: `原本判2年的攻击罪，加上仇恨犯罪加重情节后变为4至6年` },
        { plainMeaning: `触发仇恨犯罪法的特征：种族、肤色、宗教、国籍、性取向、性别认同、残疾，以及在某些州的其他特征。`, example: `因受害者是犹太人、同性恋者、残疾人或特定族裔而对其实施攻击符合条件` },
      ],
      degreeContext: `仇恨犯罪加重情节通常在基础罪行之上增加50%至100%的刑期。联邦仇恨犯罪定罪（马修·谢泼德法案）在基础罪行之外可额外判最长10年，如果罪行涉及绑架、性侵犯或导致死亡则可判终身监禁。`,
    },
  },

  "murder-in-the-third-degree": {
    es: {
      draft: true,
      plainSummary: `El asesinato en tercer grado existe solo en un pequeño número de estados. En Minnesota (donde se originó la categoría de cargos más conocida), el asesinato en tercer grado significa causar la muerte de otra persona mediante una conducta que demuestra una depraved indifference a la vida humana, sin intención específica de matar a esa persona en particular.`,
      keyTerms: [
        // [0] → EN "Depraved Mind"
        { plainMeaning: `Actuar de manera tan peligrosa y sin consideración por el valor de la vida humana que la ley trata la muerte resultante como equivalente a un asesinato intencional.`, example: `Lanzar una roca desde un puente sobre un área concurrida sin apuntar a nadie en específico, pero matando a alguien` },
        // [1] → EN "Without Intent to Kill a Specific Person"
        { plainMeaning: `No tenía la intención de matar a la víctima específica, pero su conducta creó un riesgo de muerte tan alto que la ley lo trata como asesinato.`, example: `La muerte no fue buscada, pero el comportamiento extremadamente peligroso la hace asesinato bajo esta disposición` },
        // [2] → EN "Drug-Induced Murder (Florida)"
        { plainMeaning: `En Florida, proporcionar drogas que causen la muerte de otra persona puede ser cargado como asesinato en tercer grado incluso sin intención de matar.`, example: `Vender o dar a alguien drogas de las que muere como resultado directo de consumirlas` },
      ],
      degreeContext: `El asesinato en tercer grado es un cargo de grado medio entre el segundo grado y el manslaughter en los estados que lo tienen. En Minnesota lleva típicamente de 10 a 15 años. Si su estado no tiene este cargo, la conducta equivalente puede ser cargada como asesinato en segundo grado o manslaughter involuntario.`,
    },
    zh: {
      draft: true,
      plainSummary: `三级谋杀只存在于少数几个州。在明尼苏达州（该指控类别最为人知的起源地），三级谋杀是指通过表现出对人类生命极度漠视的行为导致他人死亡，而没有特定杀死该特定人的意图。`,
      keyTerms: [
        // [0] → EN "Depraved Mind"
        { plainMeaning: `以极度危险且不顾人类生命价值的方式行事，使得由此产生的死亡在法律上等同于故意杀人。`, example: `从桥上向人群聚集区扔石头，没有针对任何特定人，但导致有人死亡` },
        // [1] → EN "Without Intent to Kill a Specific Person"
        { plainMeaning: `您没有意图杀死特定受害者，但您的行为造成了如此高的死亡风险，以至于法律将其视为谋杀。`, example: `死亡并非本意，但极端危险行为使其在此条款下构成谋杀` },
        // [2] → EN "Drug-Induced Murder (Florida)"
        { plainMeaning: `在佛罗里达州，提供导致他人死亡的毒品可被指控为三级重罪谋杀，即使没有杀人意图。`, example: `向某人出售或提供毒品，该人因直接摄入而死亡` },
      ],
      degreeContext: `在有此罪名的州，三级谋杀是介于二级谋杀和过失杀人之间的中间级别指控。在明尼苏达州通常可判10至15年。如果您所在的州没有此指控，相应行为可能被指控为二级谋杀或非自愿过失杀人。`,
    },
  },

  "recidivist-enhancement": {
    es: {
      draft: true,
      plainSummary: `Las mejoras por reincidencia son aumentos de condena impuestos cuando un acusado tiene condenas previas. La más conocida son las leyes de tres strikes, que en California y otros estados pueden resultar en cadena perpetua obligatoria después de tres condenas por delito grave.`,
      keyTerms: [
        { plainMeaning: `Condenas previas que el fiscal usa para aumentar la condena actual, a menudo requiriendo sentencias mínimas más altas.`, example: `Dos condenas previas por robo pueden hacer que su tercera condena por robo requiera una condena mínima mayor` },
        { plainMeaning: `Leyes en muchos estados que requieren condenas mucho más largas o cadena perpetua después de cierto número de condenas por delito grave.`, example: `En California, una tercera condena por delito grave strike puede resultar en cadena perpetua` },
        { plainMeaning: `Leyes federales que requieren un mínimo de 15 años para personas con tres o más condenas previas por delito grave violento.`, example: `Alguien con tres condenas por robo previas condenado por posesión de armas de fuego puede enfrentar 15 años obligatorios` },
      ],
      degreeContext: `Las mejoras por reincidencia pueden aumentar dramáticamente las condenas, desde duplicar el término estándar hasta desencadenar sentencias mínimas de cadena perpetua bajo leyes de tres strikes. Estas son impuestas en la sentencia por el juez. Su abogado puede impugnar si las condenas previas califican, si fueron obtenidas constitucionalmente, o si la mejora fue correctamente notificada antes del juicio.`,
    },
    zh: {
      draft: true,
      plainSummary: `累犯加重情节是在被告有前科定罪时施加的刑期增加。最著名的是「三振出局」法律，在加利福尼亚州和其他州，三次重罪定罪后可能导致强制终身监禁。`,
      keyTerms: [
        { plainMeaning: `检察官用来增加当前刑罚的先前定罪，通常要求更高的最低刑期。`, example: `两次之前的盗窃定罪可能使您的第三次盗窃定罪要求更高的最低刑期` },
        { plainMeaning: `许多州的法律，在一定数量的重罪定罪后要求更长的刑期或终身监禁。`, example: `在加利福尼亚州，第三次「三振出局」重罪定罪可能导致终身监禁` },
        { plainMeaning: `联邦法律，要求对有三次或以上先前暴力重罪定罪的人判处最少15年监禁。`, example: `有三次先前抢劫定罪，因非法持有枪支而被定罪的人，可能面临15年强制监禁` },
      ],
      degreeContext: `累犯加重情节可以大幅增加刑期，从将标准刑期翻倍到根据三振出局法律触发强制终身最低刑期。这些由法官在量刑时施加。您的律师可以质疑先前定罪是否符合条件、是否依据宪法取得，或加重情节是否在审判前得到适当通知。`,
    },
  },

  "illegal-entry-reentry": {
    es: {
      draft: true,
      plainSummary: `La entrada ilegal (8 U.S.C. § 1325) es un delito menor federal por entrar a los Estados Unidos en un lugar o momento no autorizado. La reentrada ilegal (8 U.S.C. § 1326) es un delito grave federal por regresar a los EE.UU. después de haber sido previamente deportado o removido.`,
      keyTerms: [
        { plainMeaning: `Cruzar la frontera entre puertos de entrada oficiales, o mediante engaño en un puerto de entrada.`, example: `Cruzar el río o el desierto en lugar de un puerto de entrada oficial` },
        { plainMeaning: `Una orden oficial de que debe dejar los EE.UU. Una deportación previa significa que cualquier regreso no autorizado puede ser procesado como un delito grave federal.`, example: `Haber sido deportado el año pasado y regresar sin autorización` },
        { plainMeaning: `Una instrucción de un tribunal de inmigración que dice que debe presentarse para ser removido a su país de origen.`, example: `Recibir una orden de remoción en un tribunal de inmigración pero no salir del país` },
      ],
      degreeContext: `La entrada ilegal es un delito menor con hasta 6 meses por primera ofensa, 2 años por posteriores. La reentrada ilegal sin una condena previa por delito grave lleva hasta 2 años. Con una deportación previa después de una condena por delito grave, el máximo es de 10 años. Con una deportación previa después de un delito grave agravado, el máximo es de 20 años. Estos cargos tienen consecuencias significativas para cualquier solicitud de inmigración futura.`,
    },
    zh: {
      draft: true,
      plainSummary: `非法入境（美国法典第8编第1325条）是在未经边境官员授权的地点或时间进入美国的联邦轻罪。非法再入境（美国法典第8编第1326条）是在被驱逐出境或遣返后重返美国的联邦重罪。`,
      keyTerms: [
        { plainMeaning: `在官方入境口岸之间穿越边界，或在入境口岸通过欺骗手段入境。`, example: `穿越河流或沙漠而非通过官方入境口岸` },
        { plainMeaning: `要求您离开美国的官方命令。此前的驱逐出境意味着任何未经授权的返回都可能被作为联邦重罪起诉。`, example: `去年被驱逐出境并在未经授权的情况下返回` },
        { plainMeaning: `移民法庭发出的要求您出庭被遣返回原籍国的命令。`, example: `在移民法庭收到遣返令但未离开该国` },
      ],
      degreeContext: `非法入境初次违法最长6个月轻罪，之后最长2年。没有先前重罪定罪的非法再入境最长2年。有重罪定罪后被驱逐出境的，最高10年。有「加重重罪」定罪后被驱逐出境的，最高20年。这些指控对未来的移民申请有重大后果。`,
    },
  },

  "juvenile-proceedings": {
    es: {
      draft: true,
      plainSummary: `Los cargos juveniles se manejan de manera diferente a los casos penales de adultos. Una adjudicación de delincuencia es el equivalente juvenil de un veredicto de culpabilidad. Los registros juveniles son típicamente confidenciales y a menudo pueden sellarse o eliminarse cuando el juvenil cumple 18 años.`,
      keyTerms: [
        { plainMeaning: `El equivalente juvenil de un juicio. El juez o un árbitro determina si el menor cometió el acto delictivo alegado, sin un jurado.`, example: `Una audiencia de adjudicación es como un juicio pero solo ante un juez, sin jurado` },
        { plainMeaning: `Una audiencia para determinar si el caso juvenil debe ser trasladado al tribunal de adultos, generalmente requerida para adolescentes mayores acusados de delitos graves graves.`, example: `Un tribunal de menores que considera si un adolescente de 16 años acusado de robo armado debe ser juzgado como adulto` },
        { plainMeaning: `El equivalente juvenil de la libertad condicional: un período de supervisión durante el cual el juvenil debe cumplir condiciones establecidas por el tribunal.`, example: `Clases escolares regulares, toques de queda y reuniones regulares con un oficial de libertad condicional juvenil` },
      ],
      degreeContext: `Las adjudicaciones juveniles generalmente no pueden resultar en prisión. El máximo es la colocación en un establecimiento juvenil hasta los 18 o 21 años dependiendo del estado. Si se transfiere a un tribunal de adultos, se aplican todos los rangos de condena para adultos. Los registros a menudo pueden eliminarse a los 18 años.`,
    },
    zh: {
      draft: true,
      plainSummary: `青少年案件的处理方式与成人刑事案件不同。「违法裁定」是有罪裁决的青少年等同物。青少年记录通常是保密的，在青少年年满18岁时往往可以封存或清除。`,
      keyTerms: [
        { plainMeaning: `审判的青少年等同物。法官或裁判员确定未成年人是否实施了被指控的违法行为，没有陪审团。`, example: `裁定听证会类似审判，但只在法官面前进行，没有陪审团` },
        { plainMeaning: `确定青少年案件是否应移送成人法院的听证会，通常适用于被指控严重重罪的年龄较大的青少年。`, example: `青少年法院考虑是否将被指控持枪抢劫的16岁青少年作为成人审判` },
        { plainMeaning: `缓刑的青少年等同物：一段监督期，青少年在此期间必须遵守法院规定的条件。`, example: `定期上学、宵禁和定期与少年缓刑官会面` },
      ],
      degreeContext: `青少年裁定通常不会导致监禁。最长可被安置在青少年设施，直到18或21岁，具体取决于州法律。如果移送成人法院，则适用所有成人量刑范围。记录通常可在18岁时清除，但移送成人法院和严重裁定可能没有资格清除。`,
    },
  },

  "check-fraud": {
    es: {
      draft: true,
      plainSummary: `El fraude con cheques bajo la ley de California cubre dos delitos relacionados. El más común es el Código Penal 476a: escribir, pasar o usar un cheque cuando sabía que su cuenta no tenía suficiente dinero para cubrirlo, y hacerlo para obtener dinero u objetos de valor. El segundo es el Código Penal 476: hacer o pasar un cheque en una cuenta ficticia, una cuenta cerrada, o una que no tenía derecho a usar, o falsificar una firma en un cheque.`,
      keyTerms: [
        { plainMeaning: `Estaba tratando de obtener dinero, bienes o servicios usando un cheque que sabía que era sin valor o que rebotaría.`, example: `Escribir un cheque de alquiler sabiendo que su cuenta ya estaba sobregirada, o usar un cheque en una cuenta que sabía que estaba cerrada` },
        { plainMeaning: `Su cuenta bancaria no tenía suficiente dinero para cubrir el monto total del cheque en el momento en que lo escribió o pasó.`, example: `Un cheque de $600 escrito cuando su saldo de cuenta era de $40` },
        { plainMeaning: `Usar un cheque en una cuenta que no existe, estaba cerrada, o pertenece a otra persona, o firmar el nombre de otra persona sin permiso.`, example: `Escribir un cheque en una cuenta bancaria que cerró el año pasado, o firmar el nombre de su empleador en un cheque de negocios sin autorización` },
        { plainMeaning: `Cualquier paso en la creación o paso del cheque cuenta. No tiene que ser quien lo escribió para ser acusado.`, example: `Entregar un cheque malo a un cajero, depositar el cheque de otra persona sabiendo que es malo, o endosar un cheque fraudulento para efectivo` },
        { plainMeaning: `Este delito puede ser presentado como un delito menor o un delito grave. El fiscal decide basado en el monto en dólares, su historial previo y las circunstancias.`, example: `Una primera ofensa que involucra una pequeña cantidad a menudo se carga como un delito menor; un patrón de cheques malos o una cantidad grande es más probable que sea un delito grave` },
      ],
      degreeContext: `El fraude con cheques bajo 476a es un wobbler: cargado como delito menor conlleva hasta un año en la cárcel del condado; como delito grave, hasta tres años en la cárcel del condado. Los fiscales consideran el monto del cheque, si hubo un patrón de múltiples cheques malos, y su historial criminal previo. Los cheques por más de $950 y las ofensas repetidas son significativamente más probables de ser presentados como delitos graves.`,
    },
    zh: {
      draft: true,
      plainSummary: `加利福尼亚州法律下的支票欺诈涵盖两项相关犯罪。最常见的是刑法典第476a条：在知道您的账户没有足够资金覆盖时，开具、传递或使用支票，并以此获取金钱或有价物品。第二项是刑法典第476条：在虚构账户、已关闭账户或您无权使用的账户上开具或传递支票，或在支票上伪造签名。`,
      keyTerms: [
        { plainMeaning: `您试图通过使用您知道是没有价值或会被退票的支票来获取金钱、商品或服务。`, example: `在知道账户已经透支的情况下开具房租支票，或在明知已关闭的账户上使用支票` },
        { plainMeaning: `您的银行账户在您开具或传递支票时没有足够资金覆盖全额。`, example: `账户余额为40美元时开具600美元的支票` },
        { plainMeaning: `在不存在的、已关闭的或属于他人的账户上使用支票，或未经许可在支票上伪造他人签名。`, example: `在去年关闭的银行账户上开支票，或未经授权在商业支票上签署雇主名字` },
        { plainMeaning: `开具或传递支票过程中的任何步骤都算。您不必是书写支票的人才会被指控。`, example: `将坏支票交给出纳员、在明知支票有问题时存入他人的支票，或为现金背书欺诈支票` },
        { plainMeaning: `此罪行可以轻罪或重罪起诉。检察官根据金额、您的先前记录和情况来决定。`, example: `涉及小额款项的初次违法通常以轻罪起诉；多次坏支票模式或大额支票更可能被起诉为重罪` },
      ],
      degreeContext: `§476a下的支票欺诈是「可变罪」：以轻罪起诉可判最长一年县监狱；以重罪起诉可判最长三年县监狱。检察官权衡支票金额、是否有多张坏支票的模式，以及您的先前犯罪记录。超过950美元的支票和多次违法被起诉为重罪的可能性显著增加。`,
    },
  },

  "fare-evasion": {
    es: {
      draft: true,
      plainSummary: `El Código Penal de California § 640(c) aborda evitar pagar la tarifa del transporte público en las circunstancias cubiertas por la ley. Importan la conducta exacta, el lugar y la subdivisión aplicable.`,
      keyTerms: [
        { plainMeaning: `El pago requerido para usar el servicio de transporte público cubierto.`, example: `Entrar o viajar en un sistema de transporte sin pagar la tarifa requerida` },
        { plainMeaning: `La conducta y el contexto de transporte específicos que deben coincidir con la subdivisión acusada.`, example: `El documento de acusación identifica el servicio y la conducta alegados bajo § 640(c)` },
      ],
      degreeContext: `La clasificación y las consecuencias dependen de la disposición legal exacta y de los hechos. Revise los documentos de acusación y la ley vigente con un abogado defensor penal de California.`,
    },
    zh: {
      draft: true,
      plainSummary: `加利福尼亚州《刑法典》第640(c)条涉及在法律规定的情况下逃避支付公共交通费用。具体行为、地点和适用的分款都很重要。`,
      keyTerms: [
        { plainMeaning: `使用相关公共交通服务所需支付的费用。`, example: `未支付所需车费就进入或乘坐交通系统` },
        { plainMeaning: `检方必须与所指控分款相对应的具体行为和交通场景。`, example: `起诉文件根据第640(c)条列明所涉交通服务和行为` },
      ],
      degreeContext: `分类和后果取决于具体法律规定和事实。请与加利福尼亚州刑事辩护律师一起核对起诉文件和现行法律。`,
    },
  },

};