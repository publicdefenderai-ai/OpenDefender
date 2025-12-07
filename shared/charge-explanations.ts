export interface LegalTermExplanation {
  term: string;
  plainMeaning: string;
  example?: string;
}

export interface ChargeExplanation {
  chargePattern: RegExp;
  plainSummary: string;
  keyTerms: LegalTermExplanation[];
  degreeContext?: string;
}

export const chargeExplanations: ChargeExplanation[] = [
  {
    chargePattern: /murder.*first.*degree|first.*degree.*murder/i,
    plainSummary: "First degree murder is the most serious homicide charge. It means the prosecutor believes you planned to kill someone ahead of time, rather than acting in the heat of the moment. This is called 'premeditation.'",
    keyTerms: [
      {
        term: "Premeditation",
        plainMeaning: "Thinking about and planning the killing beforehand, even if just for a few moments",
        example: "Deciding to harm someone and then going to get a weapon"
      },
      {
        term: "Malice Aforethought",
        plainMeaning: "Intending to kill or cause serious harm, or acting with extreme recklessness about human life",
        example: "Acting with a 'depraved heart' - knowing your actions could kill someone"
      }
    ],
    degreeContext: "First degree murder requires planning. Second degree murder happens 'in the moment' without a plan. The difference often means decades more in prison for first degree."
  },
  {
    chargePattern: /murder.*second.*degree|second.*degree.*murder/i,
    plainSummary: "Second degree murder means the prosecutor believes you killed someone intentionally but without planning it beforehand. It typically happens in the heat of the moment during a sudden argument or fight.",
    keyTerms: [
      {
        term: "Intent to Kill",
        plainMeaning: "Meaning to cause someone's death at the time you acted",
        example: "Grabbing a weapon during a heated argument"
      },
      {
        term: "Depraved Indifference",
        plainMeaning: "Acting so recklessly that you showed you didn't care if someone died",
        example: "Firing a gun into a crowd without aiming at anyone specific"
      }
    ],
    degreeContext: "Unlike first degree murder, second degree doesn't require planning. Unlike manslaughter, it requires intent to kill or extreme recklessness."
  },
  {
    chargePattern: /felony.*murder/i,
    plainSummary: "Felony murder means someone died while you were committing another serious crime, even if you didn't intend for anyone to die. The law treats this as murder because the death happened during your crime.",
    keyTerms: [
      {
        term: "Underlying Felony",
        plainMeaning: "The other serious crime you were committing when the death occurred",
        example: "Robbery, burglary, arson, kidnapping, or sexual assault"
      },
      {
        term: "Proximate Cause",
        plainMeaning: "The death was a foreseeable result of the crime, even if you didn't directly cause it",
        example: "A store clerk has a heart attack during a robbery"
      }
    ],
    degreeContext: "Felony murder is unique because it doesn't require intent to kill. The intent to commit the underlying felony is enough for a murder charge."
  },
  {
    chargePattern: /assault.*first.*degree|first.*degree.*assault/i,
    plainSummary: "First degree assault is the most serious assault charge. It typically means the prosecutor believes you caused or tried to cause serious physical injury to someone, often using a weapon or extreme force.",
    keyTerms: [
      {
        term: "Serious Bodily Injury",
        plainMeaning: "Injuries that create a substantial risk of death, cause permanent disfigurement, or result in long-term loss of function of a body part",
        example: "Broken bones, deep cuts requiring stitches, injuries causing lasting damage"
      },
      {
        term: "Deadly Weapon",
        plainMeaning: "Any object that can cause death or serious injury when used to attack someone",
        example: "Guns, knives, bats, or even everyday objects used as weapons"
      },
      {
        term: "Intent",
        plainMeaning: "You meant to do what you did - not that you necessarily meant to cause the specific injury",
        example: "Throwing a punch is intentional even if you didn't plan to break someone's jaw"
      }
    ],
    degreeContext: "First degree assault involves serious injuries or deadly weapons. Second degree assault involves less severe injuries or circumstances. Third degree is often simple assault without weapons or serious injury."
  },
  {
    chargePattern: /assault.*second.*degree|second.*degree.*assault/i,
    plainSummary: "Second degree assault is a serious charge that typically involves causing physical injury to someone, but without the extreme circumstances of first degree assault. This could include using a weapon or attacking certain protected people.",
    keyTerms: [
      {
        term: "Physical Injury",
        plainMeaning: "Any physical pain or impairment of physical condition, even if temporary",
        example: "Bruises, minor cuts, swelling, or temporary pain"
      },
      {
        term: "Recklessly",
        plainMeaning: "Consciously disregarding a substantial risk that your actions could hurt someone",
        example: "Throwing objects in anger without looking where they land"
      }
    ],
    degreeContext: "Second degree assault is less serious than first degree (which requires serious injury) but more serious than third degree (simple assault). The line often depends on the severity of injury or use of weapons."
  },
  {
    chargePattern: /assault.*third.*degree|third.*degree.*assault|simple.*assault/i,
    plainSummary: "Third degree or simple assault is the least serious assault charge. It typically means you caused minor injury or made someone fear you were about to hurt them. This is often a misdemeanor.",
    keyTerms: [
      {
        term: "Offensive Physical Contact",
        plainMeaning: "Touching someone in a way they didn't want, even without causing injury",
        example: "Pushing, grabbing, or spitting on someone"
      },
      {
        term: "Causing Fear",
        plainMeaning: "Making someone reasonably believe they were about to be hurt",
        example: "Raising your fist as if to punch, even if you don't follow through"
      }
    ],
    degreeContext: "Simple assault doesn't require serious injury - just unwanted contact or making someone fear injury. It's less serious than aggravated assault, which involves weapons or serious harm."
  },
  {
    chargePattern: /aggravated.*assault/i,
    plainSummary: "Aggravated assault means a basic assault charge made more serious by certain factors. This usually involves using a weapon, causing serious injury, or attacking someone in a protected category like a police officer or child.",
    keyTerms: [
      {
        term: "Serious Bodily Injury",
        plainMeaning: "Injuries beyond minor bruises or cuts - those that risk death, require surgery, or cause permanent damage",
        example: "Deep wounds, broken bones, head trauma, or injuries requiring hospitalization"
      },
      {
        term: "Deadly Weapon",
        plainMeaning: "Any object capable of causing death or serious harm when used to attack someone",
        example: "Guns, knives, bottles, cars, or even hands if you're trained in fighting"
      },
      {
        term: "Intent to Cause Serious Harm",
        plainMeaning: "Acting with the purpose of causing severe injury, not just minor harm",
        example: "Repeatedly hitting someone after they're down, or aiming at vital areas"
      }
    ],
    degreeContext: "Aggravated assault is more serious than simple assault because of the weapon involved, the severity of injuries, or who the victim was. It's often charged as a felony instead of a misdemeanor."
  },
  {
    chargePattern: /assault.*deadly.*weapon|adw/i,
    plainSummary: "Assault with a deadly weapon means you attacked or threatened someone while using an object that could kill or seriously injure them. The weapon doesn't have to be a gun or knife - any dangerous object counts.",
    keyTerms: [
      {
        term: "Deadly Weapon",
        plainMeaning: "Any object that could cause death or serious injury when used to attack",
        example: "Guns, knives, bats, bottles, cars, or heavy objects"
      },
      {
        term: "Assault",
        plainMeaning: "Either hitting someone or making them fear you're about to hit them",
        example: "Swinging at someone or pointing a weapon at them"
      }
    ],
    degreeContext: "Using a weapon elevates a simple assault to a much more serious charge. Even threatening someone with a weapon can be charged as assault with a deadly weapon."
  },
  {
    chargePattern: /domestic.*violence|domestic.*assault|family.*violence/i,
    plainSummary: "Domestic violence assault is an assault charge involving someone in your household or a romantic relationship. The assault itself may be the same as other assaults, but the relationship makes it a special category with different consequences.",
    keyTerms: [
      {
        term: "Domestic Relationship",
        plainMeaning: "Current or former spouses, romantic partners, people you live with, or family members",
        example: "Ex-girlfriend, roommate, parent, child, or spouse"
      },
      {
        term: "Protective Order",
        plainMeaning: "A court order requiring you to stay away from the victim, often issued immediately after arrest",
        example: "Can't go home, can't contact the person, can't go to their workplace"
      }
    ],
    degreeContext: "Domestic violence charges often carry additional consequences beyond regular assault: loss of gun rights, mandatory counseling, immigration problems, and difficulty in custody cases."
  },
  {
    chargePattern: /battery/i,
    plainSummary: "Battery means you actually touched or injured someone without their consent. In some states, assault means threatening while battery means the actual contact. In others, they're combined.",
    keyTerms: [
      {
        term: "Unlawful Touching",
        plainMeaning: "Any physical contact that's unwanted, harmful, or offensive",
        example: "Hitting, pushing, grabbing, or even spitting on someone"
      },
      {
        term: "Without Consent",
        plainMeaning: "The other person didn't agree to be touched in that way",
        example: "Even if you meant it as a joke, if they didn't want it, it can be battery"
      }
    ],
    degreeContext: "Battery vs. assault: Battery is the actual contact; assault is the threat or attempt. Some states combine them, others keep them separate. Aggravated battery involves weapons or serious injury."
  },
  {
    chargePattern: /manslaughter/i,
    plainSummary: "Manslaughter means causing someone's death without the intent to kill. It's less serious than murder because you didn't plan or intend to kill, but you did something that led to someone dying.",
    keyTerms: [
      {
        term: "Voluntary Manslaughter",
        plainMeaning: "Killing in the 'heat of passion' after being provoked - you snapped in the moment",
        example: "Finding your spouse with someone else and reacting violently immediately"
      },
      {
        term: "Involuntary Manslaughter",
        plainMeaning: "Accidentally killing someone through recklessness or during a minor crime",
        example: "A death caused by extremely dangerous driving or a fight gone wrong"
      },
      {
        term: "Heat of Passion",
        plainMeaning: "Acting immediately after something that would make a reasonable person lose self-control",
        example: "No 'cooling off' time between the provocation and your actions"
      }
    ],
    degreeContext: "Manslaughter is less serious than murder because there's no premeditation or intent to kill. Voluntary means you meant to harm; involuntary means you were reckless or negligent."
  },
  {
    chargePattern: /robbery/i,
    plainSummary: "Robbery is taking something from a person using force or fear. It's more serious than theft because it involves confronting the victim. You must have taken property directly from someone or their immediate presence.",
    keyTerms: [
      {
        term: "Force or Fear",
        plainMeaning: "Using physical force or threatening to harm someone to take their property",
        example: "Pushing someone down to grab their bag, or saying 'give me your wallet or I'll hurt you'"
      },
      {
        term: "From Their Person",
        plainMeaning: "Taking something the victim was carrying, wearing, or had immediate control over",
        example: "Snatching a phone from their hand, not stealing from their car"
      }
    ],
    degreeContext: "Armed robbery (with a weapon) is more serious than simple robbery. The degree often depends on whether a weapon was used, if anyone was hurt, and the value of what was taken."
  },
  {
    chargePattern: /burglary/i,
    plainSummary: "Burglary means entering a building or structure without permission with the intent to commit a crime inside. You don't have to actually steal anything - just entering with criminal intent is enough.",
    keyTerms: [
      {
        term: "Unlawful Entry",
        plainMeaning: "Going into a building without permission, even if the door was open",
        example: "Walking into a home through an unlocked door, or staying after being told to leave"
      },
      {
        term: "Intent to Commit a Crime",
        plainMeaning: "You planned to do something illegal once inside - theft, assault, vandalism, etc.",
        example: "Entering a store after hours intending to steal, even before taking anything"
      }
    ],
    degreeContext: "First degree burglary usually involves occupied homes (especially at night). Second degree typically involves businesses or unoccupied buildings. Home invasion is the most serious form."
  },
  {
    chargePattern: /theft|larceny|stealing/i,
    plainSummary: "Theft or larceny means taking someone else's property without permission and without intending to return it. The seriousness depends on what was taken and how much it was worth.",
    keyTerms: [
      {
        term: "Intent to Permanently Deprive",
        plainMeaning: "Planning to keep the property, not just borrow it",
        example: "Taking a bike to sell is theft; taking it for a quick ride might not be"
      },
      {
        term: "Petty vs. Grand Theft",
        plainMeaning: "The dollar amount determines the charge level - petty is under a certain value, grand is above",
        example: "Stealing a $50 item might be misdemeanor petty theft; $1,000 could be felony grand theft"
      }
    ],
    degreeContext: "Theft becomes more serious based on: value of items (petty vs. grand), how it was done (shoplifting vs. from a person), and what was taken (cars, guns, and firearms are often automatic felonies)."
  },
  {
    chargePattern: /dui|dwi|drunk.*driv|driving.*under/i,
    plainSummary: "DUI (Driving Under the Influence) or DWI (Driving While Intoxicated) means operating a vehicle while impaired by alcohol or drugs. You can be charged even if you don't feel drunk or if your driving seemed fine.",
    keyTerms: [
      {
        term: "Blood Alcohol Content (BAC)",
        plainMeaning: "The percentage of alcohol in your blood - 0.08% is the legal limit in all states",
        example: "0.08% is roughly 2-3 drinks in an hour for most people, but varies by weight"
      },
      {
        term: "Under the Influence",
        plainMeaning: "Your ability to drive safely is affected by alcohol or drugs - any amount",
        example: "You can be arrested below 0.08% if you show signs of impairment"
      },
      {
        term: "Implied Consent",
        plainMeaning: "By driving, you automatically agreed to take a breath or blood test if asked",
        example: "Refusing the test often means automatic license suspension"
      }
    ],
    degreeContext: "First offense DUI is usually a misdemeanor. Repeated DUIs, high BAC, accidents with injuries, or having children in the car can elevate it to a felony with prison time."
  },
  {
    chargePattern: /drug.*possession|possession.*controlled/i,
    plainSummary: "Drug possession means having illegal drugs or controlled substances without a valid prescription. The charge severity depends on the type of drug, amount, and whether police believe you intended to sell.",
    keyTerms: [
      {
        term: "Actual vs. Constructive Possession",
        plainMeaning: "Actual means on your person; constructive means in your control (like your car or home)",
        example: "Drugs in your pocket vs. drugs in a car you were driving"
      },
      {
        term: "Possession with Intent to Distribute",
        plainMeaning: "Having enough drugs or packaging that suggests you planned to sell, not just use",
        example: "Large quantities, scales, baggies, or large amounts of cash"
      },
      {
        term: "Schedule",
        plainMeaning: "The drug classification system - Schedule I is most serious (heroin, LSD), Schedule V is least",
        example: "Heroin and cocaine are Schedule I/II; some prescription drugs are Schedule III-V"
      }
    ],
    degreeContext: "Simple possession for personal use is less serious than possession with intent to sell. The type and amount of drug matters: marijuana is treated differently than heroin in many states."
  }
];

export function getChargeExplanation(chargeName: string): ChargeExplanation | null {
  const normalizedName = chargeName.toLowerCase().trim();
  
  for (const explanation of chargeExplanations) {
    if (explanation.chargePattern.test(normalizedName)) {
      return explanation;
    }
  }
  
  return null;
}

export function getMultipleChargeExplanations(chargeNames: string[]): Array<{
  chargeName: string;
  explanation: ChargeExplanation | null;
}> {
  return chargeNames.map(name => ({
    chargeName: name,
    explanation: getChargeExplanation(name)
  }));
}
