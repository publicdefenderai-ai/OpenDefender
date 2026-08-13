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
    chargePattern: /dui|dwi|owi|oui|ovi|ovuii|drunk.*driv|driving.*under|driving.while.intoxicated|operating.while.intox|operating.under.(?:the.)?influence|operating.under.influence/i,
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
  },
  // ── Driving on Suspended / Revoked License ────────────────────────────────
  {
    chargePattern: /(?:driving|operating).{0,30}(?:suspen[ds]|revo[ck]|barred|invalid)|operating.unregistered|operating.uninsured|dwls|dwlr|dwli/i,
    plainSummary: "This charge means you were driving on a public road while your license was suspended, revoked, or otherwise not legally valid. To convict you, the prosecutor must prove you were operating the vehicle and that your driving privileges had been legally taken away at the time. This is most often a misdemeanor, but can become a felony for repeat offenses.",
    keyTerms: [
      {
        term: "Suspension vs. Revocation",
        plainMeaning: "A suspension is a temporary removal of your license, usually for a set period. A revocation is a full cancellation. You would need to reapply entirely to get your license back.",
        example: "Missing a court date may trigger a 30-day suspension; a DUI conviction may result in full revocation"
      },
      {
        term: "Operating a Vehicle",
        plainMeaning: "Being in physical control of a car while it's in motion or with the engine running",
        example: "Sitting in the driver's seat with the car running in a parking lot can count as 'operating'"
      },
      {
        term: "DWLS / DWLI",
        plainMeaning: "Abbreviations for Driving While License Suspended or Invalid: the same legal allegation as driving on a suspended license",
        example: "Being pulled over for a taillight and the officer discovering your license is currently suspended"
      }
    ],
    degreeContext: "Typically a Class B or C misdemeanor carrying fines and potentially a short jail term. A second or third offense, or a suspension tied to a DUI or serious crime, can elevate the charge to a felony with mandatory jail time and extended license loss."
  },
  // ── Driving Without License / Minor Traffic Offenses ──────────────────────
  {
    chargePattern: /driving.{0,25}without.{0,15}(?:license|insurance|privileges)|aggravated.unlicensed.operation|driving.with.expired|driving.without.valid|defective.vehicle|aggravated.speeding/i,
    plainSummary: "These charges involve operating a vehicle while missing a required legal credential, such as a valid license, current insurance, valid registration, or a passing inspection, or driving significantly over the speed limit. The prosecutor must prove you were driving and that the specific requirement was not met at that time. Most of these are traffic-level misdemeanors or civil infractions, though some can become more serious with prior convictions.",
    keyTerms: [
      {
        term: "Unlicensed Operation",
        plainMeaning: "Driving without ever having obtained a valid license, or driving while your license has been taken away",
        example: "Being pulled over and not being able to produce any valid license because you never applied for one"
      },
      {
        term: "Proof of Compliance",
        plainMeaning: "Documentation showing you actually had the required credential on the date of the offense, which can sometimes dismiss the charge",
        example: "Showing the court a valid insurance card or registration that was active on the date you were cited"
      },
      {
        term: "Aggravated",
        plainMeaning: "A version of the offense made more serious by additional factors like prior convictions or driving significantly over the limit",
        example: "A third offense for driving without a license, or driving 30 mph over the posted speed limit"
      }
    ],
    degreeContext: "Most of these are civil infractions or Class C misdemeanors resulting in fines, but no jail time for a first offense. Driving without insurance or an expired registration is often handled with proof of compliance. Aggravated unlicensed operation with multiple prior offenses can become a misdemeanor or low-level felony."
  },
  // ── Criminal Mischief / Vandalism / Property Damage ───────────────────────
  {
    chargePattern: /criminal.mischief|criminal.damage|criminal.damaging|criminal.property.damage|malicious.mischief|malicious.destruction|malicious.injury|malicious.damage|mdop|vandalism|destruction.of.property|damage.to.property|property.damage.\d|injury.to.personal.property|unlawful.mischief/i,
    plainSummary: "This charge means the prosecutor believes you intentionally or recklessly damaged, defaced, or destroyed property belonging to someone else. They must prove the damage was deliberate or at minimum reckless. Accidentally breaking something is not a crime. The severity of the charge almost always depends on the dollar value of the damage caused.",
    keyTerms: [
      {
        term: "Intent or Recklessness",
        plainMeaning: "You either meant to cause the damage, or you ignored an obvious risk that your actions would damage something",
        example: "Deliberately keying a car is intentional; throwing a bottle in anger without looking where it lands may be reckless"
      },
      {
        term: "Dollar Threshold",
        plainMeaning: "The amount of damage caused determines whether the charge is a minor or serious offense: most states have cutoffs at $500, $1,000, or $2,500",
        example: "Spray-painting a wall that costs $300 to repaint may be a misdemeanor; breaking a $10,000 storefront window could be a felony"
      },
      {
        term: "Restitution",
        plainMeaning: "A court order requiring you to pay the victim back for the cost of repair or replacement",
        example: "Paying a homeowner the actual cost to repaint or fix what was damaged"
      }
    ],
    degreeContext: "Low-dollar damage (usually under $500–$1,000) is typically a misdemeanor carrying fines and possible short jail time. Damage above the felony threshold ($1,000–$2,500 depending on the state) can mean a felony conviction with 1–5 years in prison. Prior convictions or damage to certain protected property (schools, places of worship) can elevate the charge."
  },
  // ── Trespass / Unlawful Entry ─────────────────────────────────────────────
  {
    chargePattern: /trespass|unlawful.entry/i,
    plainSummary: "A trespass charge means you entered or stayed on someone else's property without permission. The prosecutor must prove you knew you were not allowed to be there, either because you were told to leave, there were posted signs, or the property was clearly private. Entering a home is treated far more seriously than entering land or a commercial property.",
    keyTerms: [
      {
        term: "Notice",
        plainMeaning: "Being informed, verbally, by a sign, or by a prior ban, that you are not permitted on the property",
        example: "A 'No Trespassing' sign at the fence line, or a store manager who previously told you not to return"
      },
      {
        term: "Dwelling",
        plainMeaning: "A building used as a home, such as a house or apartment, which carries elevated penalties compared to trespassing on open land",
        example: "Entering an apartment building you don't live in without authorization is trespass to a dwelling"
      },
      {
        term: "Remaining After Warning",
        plainMeaning: "Trespass is committed not just by entering, but by staying after being told to leave",
        example: "Being asked to leave a bar and refusing to go for 20 minutes"
      }
    ],
    degreeContext: "Trespassing on open land or a business is usually a misdemeanor or infraction with a fine. Entering a home or occupied dwelling bumps it to a more serious misdemeanor or low-level felony. Being armed during a trespass, or having prior trespass convictions, significantly increases the grade. Criminal trespass is distinct from burglary: trespass does not require intent to commit another crime inside."
  },
  // ── Shoplifting / Retail Theft / Transit Fraud ────────────────────────────
  {
    chargePattern: /shoplifting|retail.fraud|turnstile.jumping|willful.concealment|fare.evasion/i,
    plainSummary: "Shoplifting means taking merchandise from a store without paying, or concealing it with the intent to leave without paying. Retail fraud and willful concealment are different names for the same basic act. Turnstile jumping (transit fraud) means using public transit without paying the fare. The prosecutor must prove you intended to take the item. Accidentally leaving with something in your cart is a defense.",
    keyTerms: [
      {
        term: "Intent to Steal",
        plainMeaning: "You specifically meant to take the item without paying, which is the element the prosecutor must prove",
        example: "Hiding an item in your bag or under your clothing while still in the store shows intent"
      },
      {
        term: "Concealment",
        plainMeaning: "Hiding merchandise to avoid detection by store staff or security",
        example: "Placing a smaller item inside a larger item's packaging, or tucking something under your coat"
      },
      {
        term: "Value Threshold",
        plainMeaning: "The retail price of what was taken determines whether it's a misdemeanor or felony",
        example: "A $30 item is typically a misdemeanor; items valued over $500–$1,000 (depending on the state) can be charged as a felony"
      }
    ],
    degreeContext: "Shoplifting under the state's threshold (usually $500–$1,000) is a misdemeanor with fines and possible jail time up to one year. Above that threshold, or with prior shoplifting convictions, it becomes a felony. Many first-time offenders are eligible for diversion programs or civil settlement with the retailer that keeps the offense off their record."
  },
  // ── Disorderly Conduct / Disturbing the Peace / Public Order ──────────────
  {
    chargePattern: /disorderly.conduct|disorderly.person|disorderly.intoxication|disturbing.the.peace|breach.of.peace|appearing.in.public.under.the.influence|curfew.violation|truancy|chronic.absenteeism|simple.aggression/i,
    plainSummary: "These charges cover behavior that disrupts public order: acting aggressively in public, being visibly intoxicated in a public place, making excessive noise, or violating time-based rules like curfew. The prosecutor must show your conduct was disruptive enough to alarm or annoy a reasonable person, or that you violated a specific rule (like curfew). These are almost always misdemeanors or minor infractions.",
    keyTerms: [
      {
        term: "Public Place",
        plainMeaning: "Any space open to the general public: streets, parks, stores, parking lots",
        example: "Yelling aggressively outside a convenience store counts as a public-place offense"
      },
      {
        term: "Unreasonable Noise or Conduct",
        plainMeaning: "Behavior that goes beyond what a normal person would tolerate in that setting",
        example: "Playing loud music at 3 a.m. in a residential area, or blocking a sidewalk while yelling at passersby"
      },
      {
        term: "Public Intoxication",
        plainMeaning: "Being visibly drunk or impaired in a public place to the degree that you are a danger to yourself or others",
        example: "Stumbling in the street, unable to care for yourself, causing traffic to stop"
      }
    ],
    degreeContext: "Almost all of these are misdemeanors or non-criminal infractions. Fines and community service are the most common outcomes, with jail time (up to 90 days or one year) possible for repeat offenses or conduct that caused a serious disturbance. Curfew violations for juveniles are typically handled in juvenile court with no adult criminal record."
  },
  // ── Drug Distribution / Trafficking / School Zone ─────────────────────────
  {
    chargePattern: /drug.traffick|distribution.of.controlled.substance|drug.distribution|drug.offense.*school|school.zone|possession.with.intent.to.distribute|manufacturing.controlled|maintaining.drug.house|promoting.a.detrimental.drug|drug.paraphernalia|simple.possession(?!.{0,5}controlled)|unlawful.possession.of.(?:cannabis|scheduled)/i,
    plainSummary: "Drug distribution and trafficking charges mean the prosecutor believes you were selling, delivering, or moving controlled substances, not just using them. Simple possession of marijuana or cannabis without a prescription in states that still criminalize it is a lesser but related charge. A school zone enhancement adds extra penalties if the drug activity occurred within a set distance of a school. Prosecution must prove you intended to distribute, not just that you personally used the substance.",
    keyTerms: [
      {
        term: "Distribution vs. Possession",
        plainMeaning: "Distribution means you were selling or handing drugs to others; possession means you had them for your own use. Prosecutors use quantity, packaging, scales, and cash to argue distribution.",
        example: "Having 20 individual baggies of cocaine suggests distribution; having one baggie suggests personal use"
      },
      {
        term: "Drug Trafficking",
        plainMeaning: "A more serious charge than distribution; it's typically tied to larger quantities or crossing state or international lines",
        example: "Being caught moving a large quantity of drugs across state lines triggers federal trafficking charges"
      },
      {
        term: "School Zone Enhancement",
        plainMeaning: "Many states automatically increase the penalty if the drug offense happened within 1,000 feet of a school, park, or playground",
        example: "Selling drugs in a car parked on a street near an elementary school, even on a weekend when school is not in session"
      }
    ],
    degreeContext: "Simple cannabis possession in a state that still criminalizes it is often a misdemeanor. Distribution of any controlled substance is typically a felony, with sentences ranging from 2–5 years for small amounts up to mandatory minimums of 10–20 years for large-scale trafficking. School zone enhancements often double the potential sentence."
  },
  // ── Weapons Charges ───────────────────────────────────────────────────────
  {
    chargePattern: /unlawful.carrying.of.weapon|discharge.of.firearm|use.of.(?:a.)?firearm|felon.in.possession|felon.*possess.*(?:firearm|weapon)|possession.of.(?:stolen.)?firearm|prohibited.person.*(?:firearm|weapon)|possession.of.prohibited.weapon|juvenile.firearm/i,
    plainSummary: "Weapons charges mean you are accused of illegally possessing, carrying, using, or firing a firearm or other weapon. These charges arise from having a weapon when you are legally barred from doing so (such as a prior felony conviction), carrying one without the required permit, firing one in a prohibited area, or using one during another crime. Most weapons charges are felonies and carry serious mandatory sentences.",
    keyTerms: [
      {
        term: "Prohibited Person",
        plainMeaning: "Someone legally barred from owning or possessing firearms, most commonly because of a prior felony conviction or certain domestic violence convictions",
        example: "If you have any prior felony conviction, federal law makes it a crime for you to touch a firearm, even briefly"
      },
      {
        term: "Constructive Possession",
        plainMeaning: "You don't have to be physically holding a weapon to 'possess' it. Having access and control is enough",
        example: "A gun found in a car you were driving or in a home you share with others can still lead to a possession charge"
      },
      {
        term: "Enhancement",
        plainMeaning: "Using or carrying a firearm during another crime automatically increases the sentence for that underlying crime",
        example: "Committing a robbery while armed adds mandatory years to the robbery sentence on top of any weapons charge"
      }
    ],
    degreeContext: "Unlawful carrying or discharge in a city is typically a felony carrying 1–5 years. A felon in possession of a firearm is a federal felony with a mandatory minimum of up to 15 years for repeat offenders (Armed Career Criminal Act). Using a firearm during a crime of violence triggers federal mandatory minimums of 5-10 years consecutive, meaning served after, not instead of, the underlying sentence."
  },
  // ── Sexual Assault (generic / criminal sexual assault) ────────────────────
  {
    chargePattern: /^sexual.assault$|criminal.sexual.(?:assault|abuse)|attempted.sexual.(?:assault|abuse)/i,
    plainSummary: "Sexual assault means you are accused of non-consensual sexual contact or penetration with another person. The prosecutor must prove the act occurred and that the victim did not or could not legally consent. 'Criminal sexual assault' and 'criminal sexual abuse' are formal names used in some states for the same category of offense. These charges are prosecuted as serious felonies.",
    keyTerms: [
      {
        term: "Consent",
        plainMeaning: "A clear, voluntary, ongoing agreement to engage in sexual activity. Someone who is unconscious, severely intoxicated, or under a certain age cannot legally consent",
        example: "A person who said 'yes' earlier in the evening cannot be assumed to have consented to all subsequent activity"
      },
      {
        term: "Criminal Sexual Abuse",
        plainMeaning: "In states that use this term, it typically covers unwanted sexual contact that falls short of penetration, such as touching, groping, or fondling",
        example: "Grabbing someone in a sexual way without their consent when no penetration occurred"
      },
      {
        term: "Attempted",
        plainMeaning: "Taking a substantial step toward committing sexual assault even if the act was interrupted or not completed",
        example: "Physically restraining someone and attempting to remove their clothing before being stopped"
      }
    ],
    degreeContext: "Sexual assault is universally a felony. Depending on the state and degree, sentences range from 3–5 years for lower-level offenses to 20+ years or life for aggravated forms. Many convictions also require lifetime sex offender registration, which carries significant restrictions on where you can live and work."
  },
  // ── Sex Offenses Against Minors ───────────────────────────────────────────
  {
    chargePattern: /child.sexual.abuse|sexual.exploitation.of.minor|statutory.rape|unlawful.sexual.activity.*minor|sexual.penetration.*foreign.object/i,
    plainSummary: "These charges involve alleged sexual conduct with a person under the legal age of consent, or using a minor in sexual material. The defining feature of statutory rape and similar charges is that the victim's age itself makes the act illegal. Even if the minor appeared to agree, the law says a minor cannot legally consent. Sexual exploitation of a minor includes producing, distributing, or possessing images of minors in sexual situations.",
    keyTerms: [
      {
        term: "Age of Consent",
        plainMeaning: "The minimum legal age at which a person can agree to sexual activity. It varies by state, typically between 16 and 18",
        example: "In a state where the age of consent is 17, sexual activity with a 16-year-old is illegal regardless of what the minor said"
      },
      {
        term: "Strict Liability",
        plainMeaning: "In many states, genuinely believing the person was of legal age is not a defense. The act is illegal regardless of your belief",
        example: "Being told by the minor that they were 18 may not protect you from prosecution if they were actually 15"
      },
      {
        term: "Sexual Exploitation",
        plainMeaning: "Any use of a minor in sexually explicit material, including taking photos or video, sharing it, or possessing it, which is a separate federal crime even without physical contact",
        example: "Having explicit images of minors on a device, even if received rather than taken, is a federal felony"
      }
    ],
    degreeContext: "These are among the most serious charges in the criminal system. Sentences typically range from 5–25 years, with life imprisonment possible for the most serious offenses. Federal charges for child exploitation carry mandatory minimums. Nearly all convictions require lifetime sex offender registration. Judges have very limited ability to reduce these sentences."
  },
  // ── Financial Fraud (wire, tax, credit card, computer, RICO, embezzlement) ─
  {
    chargePattern: /credit.card.fraud|wire.fraud|mail.fraud|tax.fraud|insurance.fraud|computer.fraud|money.laundering|rico|racketeering|embezzlement|extortion|misappropriation/i,
    plainSummary: "These charges accuse you of obtaining money or property through deception, concealment, or threats, or of participating in a broader criminal enterprise. The prosecutor must prove you acted deliberately: that you knew what you were doing was illegal. These offenses are almost always felonies, frequently prosecuted federally, and can carry decades in prison plus financial penalties.",
    keyTerms: [
      {
        term: "Intent to Defraud",
        plainMeaning: "You deliberately deceived someone to cause them financial loss or to gain something you weren't entitled to",
        example: "Filing false tax returns claiming refunds you knew you weren't owed"
      },
      {
        term: "Money Laundering",
        plainMeaning: "Moving illegally obtained money through legitimate-looking transactions to hide where it came from",
        example: "Depositing drug money into a business account in small amounts to make it appear to be normal revenue"
      },
      {
        term: "RICO / Racketeering",
        plainMeaning: "A federal law that allows prosecution of an entire criminal organization and all its members when there is a pattern of criminal activity over time",
        example: "Being part of a group that ran multiple fraud schemes over several years can trigger RICO charges against everyone involved, even if you only participated in one scheme"
      },
      {
        term: "Embezzlement",
        plainMeaning: "Stealing money that was legally entrusted to you in your role as an employee or fiduciary",
        example: "A bookkeeper who transfers company funds to their personal account over several years"
      }
    ],
    degreeContext: "Wire fraud and tax fraud carry federal sentences of up to 20 years per count, and prosecutors often stack multiple counts. RICO convictions can result in 20 years per predicate act plus forfeiture of all proceeds. Embezzlement sentencing tracks the amount stolen: under $10,000 is often a misdemeanor; above $100,000 almost certainly means prison. Financial penalties, restitution, and asset forfeiture accompany almost all convictions in this category."
  },
  // ── Attempted Murder / Kidnapping / Arson / Carjacking / Vehicular Homicide
  {
    chargePattern: /attempted.murder|carjacking|kidnapping|arson|vehicular.homicide|criminally.negligent.homicide|reckless.homicide/i,
    plainSummary: "These are serious felony charges involving severe harm or the threat of death to another person, or the deliberate destruction of property by fire. Attempted murder requires proof you took a concrete step toward killing someone with the intent to do so. Carjacking is robbery of a vehicle directly from a person using force or fear. Kidnapping involves taking or confining someone against their will. Arson is the intentional setting of fire to a structure or property. Vehicular and criminally negligent homicide involve causing a death through reckless or negligent driving or conduct.",
    keyTerms: [
      {
        term: "Substantial Step (Attempted Murder)",
        plainMeaning: "More than just thinking about or planning the act. You must have taken a real action toward carrying it out",
        example: "Obtaining a weapon and driving to the victim's location is a substantial step, even if you were stopped before the act"
      },
      {
        term: "Asportation (Kidnapping)",
        plainMeaning: "Moving the victim from one place to another against their will. Even a short distance can satisfy this element",
        example: "Forcing someone into a car and driving them two blocks is legally sufficient movement for kidnapping"
      },
      {
        term: "Criminal Negligence",
        plainMeaning: "Acting with such extreme carelessness about human life that it goes beyond a simple mistake and becomes criminal",
        example: "Racing through a school zone at 90 mph and striking a pedestrian: the recklessness is so extreme it's treated as criminal"
      }
    ],
    degreeContext: "All of these are serious felonies. Attempted murder carries 5–life depending on the state and weapon used. Kidnapping ranges from 5–life, with life mandatory if the victim is a child or is harmed. Arson of an occupied building can carry 10–20 years. Carjacking is a federal crime carrying up to 25 years, and life or death if someone is killed. Vehicular homicide typically carries 3–15 years, increasing if DUI was involved."
  },
  // ── Assault (generic / lower degree / on officer) ─────────────────────────
  {
    chargePattern: /^assault\b(?!.*(?:deadly|first|second|third|aggravated|domestic|family|sexual))/i,
    plainSummary: "An assault charge means you are accused of intentionally causing bodily injury to another person, or placing them in reasonable fear of imminent harm. Lower-degree assault charges typically involve minor physical contact or threats without a weapon. Assault on a peace officer is a more serious variant that applies when the victim is a police officer, sheriff, or other law enforcement official acting in their official capacity.",
    keyTerms: [
      {
        term: "Bodily Injury",
        plainMeaning: "Any physical pain or harm to the body, even minor: a bruise, scratch, or nosebleed qualifies",
        example: "Punching someone and leaving a bruise satisfies the bodily injury element even without a hospital visit"
      },
      {
        term: "Reasonable Apprehension",
        plainMeaning: "Making someone genuinely believe they were about to be hurt, even without touching them",
        example: "Raising your fist and stepping toward someone who then steps back in fear"
      },
      {
        term: "Peace Officer",
        plainMeaning: "A law enforcement official performing their duties: police officers, sheriffs, corrections officers, and sometimes probation officers",
        example: "Pushing a police officer who is arresting you elevates the assault to 'assault on a peace officer,' a more serious felony"
      }
    ],
    degreeContext: "Generic or misdemeanor-level assault (4th/5th degree or Class B/D) typically carries fines and up to 90 days to one year in jail. Assault on a peace officer is usually a felony regardless of injury level, carrying 1–5 years. The presence of any weapon or serious injury shifts the charge to aggravated assault, which carries much higher sentences."
  },
  // ── Conspiracy / Accessory / Aiding & Abetting / Criminal Attempt ─────────
  {
    chargePattern: /conspiracy(?!.*commit\s+a\s+federal\s+offense.*already)|accessory.after.the.fact|aiding.and.abetting|accomplice.liability|criminal.solicitation|criminal.street.gang|armed.career.criminal|^criminal.attempt/i,
    plainSummary: "These charges hold you legally responsible for a crime even if you were not the one who carried out the final act. Conspiracy means you agreed with at least one other person to commit a crime and at least one of you took a step toward doing it. Aiding and abetting means you helped someone commit a crime. Being an accessory after the fact means you helped a criminal escape or avoid arrest after the crime was committed. Criminal attempt means you took a substantial step toward committing a crime, even if it was never completed.",
    keyTerms: [
      {
        term: "Agreement (Conspiracy)",
        plainMeaning: "Two or more people reaching an understanding to commit a crime together. It doesn't have to be in writing or even explicit",
        example: "Verbally agreeing with a friend to rob a store is a conspiracy, even if you never go through with it"
      },
      {
        term: "Overt Act",
        plainMeaning: "A concrete action taken in furtherance of the conspiracy, required to prove the agreement was real",
        example: "Buying zip ties and rope in preparation for the planned crime counts as an overt act"
      },
      {
        term: "Accomplice Liability",
        plainMeaning: "When you help someone commit a crime, you can be charged with the same crime as if you did it yourself",
        example: "Driving the getaway car makes you liable for the robbery even if you never entered the store"
      }
    ],
    degreeContext: "Conspiracy and aiding-and-abetting charges typically carry the same sentence as the underlying crime. Being an accessory after the fact carries a lesser sentence, usually half the maximum of the crime helped. Criminal attempt is also typically punished at half the full sentence. The Armed Career Criminal Act (federal) mandates a 15-year minimum for defendants with three prior violent felony or drug trafficking convictions."
  },
  // ── Contempt / Violation of Probation or Protective Order ─────────────────
  {
    chargePattern: /contempt.of.court|criminal.contempt|violation.of.(?:probation|order.of.protection|protective.order)|dvpo.violation|probation.violation/i,
    plainSummary: "These charges mean you are accused of disobeying a direct order from a court. Contempt of court covers refusing to follow a judge's ruling or disrupting court proceedings. A probation violation means you broke one or more conditions set when you were placed on probation instead of prison. A violation of a protective or restraining order means you contacted, approached, or otherwise violated the specific restrictions the order imposed.",
    keyTerms: [
      {
        term: "Probation Conditions",
        plainMeaning: "The specific rules you agreed to follow in exchange for probation instead of jail. These may include regular check-ins, drug testing, curfews, and no new arrests",
        example: "Testing positive for drugs when your probation conditions require you to stay clean"
      },
      {
        term: "Protective Order",
        plainMeaning: "A court order forbidding you from contacting or coming near a specific person, often issued in domestic violence cases",
        example: "Sending a text message to someone protected by a no-contact order violates the order even if the message seems harmless"
      },
      {
        term: "Willful Violation",
        plainMeaning: "You knew about the order and consciously chose to break it. Accidental or inadvertent contact may be a defense",
        example: "Running into the protected person at a grocery store by accident is different from going to their home"
      }
    ],
    degreeContext: "Contempt of court can result in fines or short jail stays (civil contempt) or criminal charges with up to one year in jail. Probation violations can result in your probation being revoked and your original suspended sentence being imposed, meaning you go to jail or prison for the original crime. Protective order violations are typically misdemeanors for first offenses but escalate to felonies with repeat violations or when accompanied by violence."
  },
  // ── Stalking / Harassment / Terroristic Threats ───────────────────────────
  {
    chargePattern: /stalking|harassment|terroristic.threat|threatening.and.intimidating|menacing/i,
    plainSummary: "These charges involve conduct that caused another person to reasonably fear for their safety. Stalking typically requires a pattern of repeated unwanted contact or surveillance. Harassment covers persistent unwanted communication or conduct intended to alarm or distress. Terroristic threats involve communicating an intent to commit violence to terrorize a person or group. The threat does not have to be carried out. The prosecutor must show the victim's fear was reasonable and that you caused it intentionally.",
    keyTerms: [
      {
        term: "Pattern of Conduct",
        plainMeaning: "A series of acts, not just one incident, that together establish a course of behavior",
        example: "Showing up at someone's home, then their workplace, then their gym over the course of two weeks"
      },
      {
        term: "Reasonable Fear",
        plainMeaning: "Fear that a normal person in the same situation would also feel, not just the specific victim's personal reaction",
        example: "Sending messages saying 'I know where you sleep' would cause most people to fear for their safety"
      },
      {
        term: "Terroristic Threat",
        plainMeaning: "A communication, spoken, written, or electronic, that threatens violence against a person or group to cause terror or coerce action",
        example: "Calling someone and saying you will harm them if they testify in court, even if you have no intention of following through"
      }
    ],
    degreeContext: "First-offense harassment or stalking is typically a misdemeanor with fines and up to one year in jail. A prior stalking conviction, use of a weapon, violation of a protective order while stalking, or targeting a minor or public official elevates it to a felony with 2–5 years or more. Terroristic threats are usually felonies from the first offense."
  },
  // ── DV Abbreviation Variants ──────────────────────────────────────────────
  {
    chargePattern: /^dv[\s\-]|domestic.battering|partner.or.family.member.assault/i,
    plainSummary: "DV (domestic violence) charges filed under abbreviated names like 'DV Assault' or 'DV 3rd Degree' are the same as domestic violence assault or battery charges. They involve physical harm or threats against a family member, household member, or intimate partner. The DV designation triggers a separate set of consequences beyond the underlying assault charge, including mandatory no-contact orders and loss of firearm rights.",
    keyTerms: [
      {
        term: "Domestic Relationship",
        plainMeaning: "The relationship between you and the alleged victim: must be a current or former spouse, romantic partner, cohabitant, or family member",
        example: "Current girlfriend, ex-husband, roommate, parent, or child"
      },
      {
        term: "Mandatory Arrest",
        plainMeaning: "In many states, police must make an arrest when responding to a domestic violence call if there is visible evidence of injury, even if the victim does not want charges filed",
        example: "Officers arriving and seeing a bruise may arrest even over the victim's objection"
      },
      {
        term: "No-Contact Order",
        plainMeaning: "A court order issued automatically in most DV cases requiring you to have zero contact with the alleged victim. Violating it is a separate crime",
        example: "Texting the victim to apologize while a no-contact order is in place is itself a criminal violation"
      }
    ],
    degreeContext: "DV assault at the lower degrees is typically a misdemeanor (fines, up to one year in jail, mandatory counseling). Any DV conviction permanently strips federal gun rights. A second DV conviction, use of a weapon, or visible serious injury usually elevates to a felony. Immigration consequences for non-citizens can be severe: DV convictions are deportable offenses."
  },
  // ── Animal Cruelty ────────────────────────────────────────────────────────
  {
    chargePattern: /animal.cruelty|animal.at.large|leash.law/i,
    plainSummary: "Animal cruelty charges mean you are accused of intentionally harming, neglecting, or torturing an animal. Animal at large or leash law violations are far less serious and mean your animal was off-leash or loose in an area where that's prohibited. For cruelty charges, the prosecutor must prove you intentionally or recklessly caused pain, suffering, or death to an animal.",
    keyTerms: [
      {
        term: "Intentional Cruelty",
        plainMeaning: "Deliberately harming an animal: beating, burning, or torturing it",
        example: "Hitting a dog repeatedly as punishment in a way that causes injury"
      },
      {
        term: "Neglect",
        plainMeaning: "Failing to provide an animal in your care with adequate food, water, shelter, or veterinary care",
        example: "Leaving a dog in a hot car for hours without water"
      },
      {
        term: "Animal at Large",
        plainMeaning: "Your animal being loose in a public area without a leash or proper containment where local ordinances require it",
        example: "Your dog running loose in a neighborhood where a leash is legally required"
      }
    ],
    degreeContext: "Animal at large is typically a civil infraction with a small fine. Animal cruelty is a misdemeanor for first offenses in most states but can be a felony for deliberate torture, killing, or cases involving multiple animals. Aggravated animal cruelty, meaning deliberate, prolonged suffering, is a felony in all 50 states, with sentences of 1-5 years."
  },
  // ── Solicitation / Prostitution ───────────────────────────────────────────
  {
    chargePattern: /prostitut|solicitation.*sex|sex.*solicitation/i,
    plainSummary: "Prostitution charges mean you are accused of exchanging sexual acts for money or anything of value. Solicitation (or 'patronizing') charges mean you offered money or value to someone else for a sexual act. The prosecutor must prove an agreement or offer was made. The act itself does not have to be completed. These are typically misdemeanors on a first offense but carry significant collateral consequences.",
    keyTerms: [
      {
        term: "Offer or Agreement",
        plainMeaning: "The crime is completed when an offer is made and understood. You don't have to follow through with the act",
        example: "Agreeing to pay a price and specifying the act in an undercover officer's presence is legally sufficient"
      },
      {
        term: "Undercover Operations",
        plainMeaning: "Police commonly use undercover officers posing as buyers or sellers. Contact initiated by an undercover officer is not entrapment unless the officer induced you to do something you wouldn't otherwise have done",
        example: "Responding to an ad and agreeing to terms with an undercover officer meets the legal standard for arrest"
      },
      {
        term: "Sex Trafficking",
        plainMeaning: "A far more serious charge: compelling or coercing another person into prostitution, especially minors. Distinct from simple prostitution.",
        example: "Controlling another person's prostitution through force or threats is trafficking, not a misdemeanor"
      }
    ],
    degreeContext: "First-offense prostitution or solicitation is typically a misdemeanor with fines and possible jail time up to 6–12 months. Repeat offenses or involvement with minors becomes a felony. Even a misdemeanor conviction carries collateral consequences: it appears on background checks, can affect housing and employment, and carries immigration consequences for non-citizens."
  },
  // ── Criminal Possession of Stolen Property ────────────────────────────────
  {
    chargePattern: /possession.of.stolen.property|receiving.stolen/i,
    plainSummary: "Criminal possession of stolen property means you had property in your possession that you knew, or had reason to know, was stolen. You don't have to be the one who stole it. Receiving, buying, or even holding stolen goods can be charged. The prosecutor must prove you knew or reasonably should have known the property was stolen.",
    keyTerms: [
      {
        term: "Knowledge",
        plainMeaning: "The key element: prosecutors prove you knew the property was stolen through the circumstances (low price, no receipt, seller's behavior)",
        example: "Buying a brand-new phone for $20 from a stranger on the street: the price suggests you should have known it was stolen"
      },
      {
        term: "Constructive Possession",
        plainMeaning: "Having stolen property in a place you control counts as possession, even if it's not on your person",
        example: "Stolen goods stored in your garage or vehicle are in your constructive possession"
      },
      {
        term: "Value Determines Grade",
        plainMeaning: "Like theft, the charge level depends on the value of the stolen property: higher value means a more serious charge",
        example: "Receiving a $200 stolen bicycle may be a misdemeanor; receiving a $5,000 stolen laptop may be a felony"
      }
    ],
    degreeContext: "Receiving stolen property under the state's threshold is a misdemeanor. Above the threshold ($500–$1,000 in most states) it becomes a felony. If the stolen property is a firearm or vehicle, it's typically a felony regardless of value. Sentences mirror theft charges at the same dollar level."
  },
  // ── Criminal Non-Support / Failure to Pay Child Support ───────────────────
  {
    chargePattern: /nonsupport|failure.to.(?:pay.)?(?:child.)?support|criminal.nonsupport/i,
    plainSummary: "Criminal non-support means you have a court-ordered obligation to pay child or spousal support and you have willfully failed to make those payments. The key word is 'willfully': the prosecutor must prove you had the ability to pay and chose not to, not just that you couldn't afford it. This is a criminal charge separate from the civil family court process.",
    keyTerms: [
      {
        term: "Willful Failure",
        plainMeaning: "Deliberately not paying when you have the ability to. Job loss or genuine financial hardship may be a defense if documented",
        example: "Being employed and choosing to spend income on other things while not paying court-ordered support"
      },
      {
        term: "Ability to Pay",
        plainMeaning: "The prosecution must show you had income or assets available to make at least some payment",
        example: "Working full-time and making zero support payments is strong evidence of willful failure"
      },
      {
        term: "Purging the Contempt",
        plainMeaning: "Making a significant payment or establishing a payment plan can sometimes stop or reduce prosecution",
        example: "Paying a large portion of the arrears before trial may result in the case being reduced or dismissed"
      }
    ],
    degreeContext: "Criminal non-support starts as a misdemeanor for smaller arrears or short periods. It becomes a felony when arrears exceed a threshold (often $5,000–$10,000) or when payments have been missed for more than one year. Federal charges apply when a parent crosses state lines to avoid payment. Civil remedies (wage garnishment, license suspension, tax refund seizure) typically run alongside the criminal process."
  },
  // ── Abuse of Family / Household Member ───────────────────────────────────
  {
    chargePattern: /abuse.of.(?:family|household)/i,
    plainSummary: "Abuse of a family or household member is a domestic violence charge that covers physical harm, threatening behavior, or emotional abuse directed at someone you live with or are related to. It is similar to domestic assault but may be broader in some states, covering not just physical contact but also harassment, threats, or intimidation within the household.",
    keyTerms: [
      {
        term: "Household Member",
        plainMeaning: "Anyone who lives with you: a roommate, family member, partner, or even a former cohabitant",
        example: "A college roommate, adult child living at home, or a former partner who moved out recently"
      },
      {
        term: "Physical Abuse",
        plainMeaning: "Any unwanted physical contact causing pain or injury",
        example: "Pushing, hitting, grabbing, or restraining a household member"
      },
      {
        term: "Emotional or Psychological Abuse",
        plainMeaning: "In states that include it, a pattern of behavior designed to control, isolate, or intimidate: threats, humiliation, or controlling finances",
        example: "Repeatedly threatening to harm the victim if they leave the relationship"
      }
    ],
    degreeContext: "Typically charged as a misdemeanor for first offenses without serious injury. Escalates to a felony with prior domestic violence history, use of a weapon, or serious bodily injury. Conviction carries loss of federal gun rights, mandatory no-contact orders, and required completion of a batterer's intervention program."
  },
  // ── Hit and Run ───────────────────────────────────────────────────────────
  {
    chargePattern: /hit.and.run/i,
    plainSummary: "Hit and run means you were involved in a vehicle accident and left the scene without stopping to identify yourself, exchange information, or provide aid to anyone who was injured. The law requires all drivers in an accident to stop, even if you don't believe you caused it. Whether it is a misdemeanor or felony depends almost entirely on whether anyone was injured.",
    keyTerms: [
      {
        term: "Duty to Stop",
        plainMeaning: "Every driver involved in an accident must stop at or near the scene. This is a legal requirement in all states",
        example: "Clipping another car in a parking lot and driving away, even if the damage seems minor"
      },
      {
        term: "Duty to Render Aid",
        plainMeaning: "If someone is injured, you must provide reasonable help. Calling 911 satisfies this in most states",
        example: "Calling emergency services before leaving the scene shows an attempt to render aid"
      },
      {
        term: "Property Damage vs. Injury",
        plainMeaning: "Leaving after a property-damage-only accident is a misdemeanor in most states; leaving after an injury or death is a felony",
        example: "Hitting a parked car and driving away is very different legally from striking a pedestrian and fleeing"
      }
    ],
    degreeContext: "Hit and run involving only property damage is typically a misdemeanor with fines and possible license suspension. If a person was injured, it becomes a felony with 1–5 years in prison in most states. If the victim died, it can carry 5–15 years, comparable to vehicular manslaughter. Turning yourself in promptly is often a significant mitigating factor."
  },
  // ── Resisting Arrest / Obstruction of Justice ─────────────────────────────
  {
    chargePattern: /resisting.arrest|resisting.law.enforcement|resisting.officer|refusing.to.submit.to.arrest|evading.arrest|obstruction.of.(?:justice|officer)|resist.*delay.*obstruct|resist.*obstruct.*officer/i,
    plainSummary: "Resisting arrest means you physically struggled, fled, or otherwise actively prevented an officer from making a lawful arrest. Obstruction of justice means you interfered with a law enforcement investigation or court proceeding: giving false information, hiding evidence, or intimidating witnesses. The arrest or investigation does not have to have resulted in a conviction for these charges to stand.",
    keyTerms: [
      {
        term: "Lawful Arrest",
        plainMeaning: "The officer must have had a legal basis to make the arrest. Resisting an unlawful arrest may be a defense in some states, though it is risky to attempt",
        example: "An officer attempting to arrest you based on a valid warrant is making a lawful arrest"
      },
      {
        term: "Physical Resistance",
        plainMeaning: "Pulling away, running, pushing, or fighting the officer. Even minor physical resistance counts",
        example: "Pulling your arm away when an officer tries to handcuff you"
      },
      {
        term: "Obstruction",
        plainMeaning: "Any deliberate act that hinders a police investigation or court proceeding: false statements, destroying evidence, or threatening witnesses",
        example: "Telling police you don't know someone when you do, in order to shield them from investigation"
      }
    ],
    degreeContext: "Resisting arrest without violence is typically a misdemeanor (fines, up to one year in jail). Resisting with violence, meaning striking or injuring an officer, is a felony. Obstruction of justice is a misdemeanor for simple interference but can be a federal felony when it affects federal investigations, with sentences up to 5–20 years depending on the underlying case."
  },
  // ── Perjury ───────────────────────────────────────────────────────────────
  {
    chargePattern: /perjury|false.swearing/i,
    plainSummary: "Perjury means you made a false statement under oath, such as in court testimony, a deposition, or on a sworn document, while knowing the statement was false. The lie must be material, meaning it had the potential to affect the outcome of the case. An honest mistake or a statement you believed to be true at the time is not perjury.",
    keyTerms: [
      {
        term: "Under Oath",
        plainMeaning: "You had formally sworn or affirmed to tell the truth: in a courtroom, a deposition, a grand jury, or on a sworn affidavit",
        example: "Testimony given after being sworn in by the court clerk, or a signed and notarized affidavit"
      },
      {
        term: "Materiality",
        plainMeaning: "The false statement must have been about something important to the case, not a minor or irrelevant detail",
        example: "Lying about where you were on the night of the crime is material; lying about what you had for breakfast is not"
      },
      {
        term: "Knowing Falsity",
        plainMeaning: "You knew the statement was false when you made it. Being wrong or misremembering is not perjury",
        example: "Testifying that you've never met someone when you clearly remember meeting them multiple times"
      }
    ],
    degreeContext: "Perjury is a felony in all US jurisdictions. Federal perjury carries up to 5 years in prison per count. State perjury typically carries 2–5 years. Multiple false statements in the same proceeding can be charged as separate counts. Prosecutors treat perjury seriously because it directly undermines the justice system, and judges have little tolerance for it at sentencing."
  },
  // ── Marijuana / Cannabis Possession ───────────────────────────────────────
  {
    chargePattern: /possession.of.(?:marijuana|cannabis|thc)|marijuana.possession|cannabis.possession|possession.of.small.amount|possession.of.weed|marijuana.over.legal.limit|cannabis.over.legal/i,
    plainSummary: "Marijuana possession means you had cannabis, THC products, or related items and it was either illegal in that state, exceeded the legal personal-use limit, or you were in a prohibited location (like a school zone or a state that doesn't allow recreational use). Even in states that have legalized marijuana, possessing more than the legal personal limit or possessing it in certain places remains a crime. The prosecutor must prove you knowingly had the substance.",
    keyTerms: [
      {
        term: "Personal Use Limit",
        plainMeaning: "The maximum amount of marijuana a person may legally possess in states where it is legal: typically 1 to 2 ounces for adults",
        example: "Possessing 4 ounces in a state where the legal limit is 1 ounce is still a crime even though marijuana is legal there"
      },
      {
        term: "Over Legal Limit",
        plainMeaning: "Having marijuana in an amount that exceeds the legal personal allowance, often charged separately from full illegality",
        example: "Being caught with 3 ounces when your state's limit is 1 ounce"
      },
      {
        term: "THC",
        plainMeaning: "The active psychoactive compound in marijuana. Products containing THC, such as edibles, oils, wax, and concentrates, are subject to the same possession laws as raw cannabis",
        example: "A THC vape cartridge is treated as marijuana possession in most jurisdictions"
      }
    ],
    degreeContext: "Simple possession of a small amount (under 1 ounce in most states) is a misdemeanor or, in many legalization states, a civil infraction with a fine only. Possession of larger amounts or in a school zone is a more serious misdemeanor or felony. Amounts large enough to suggest distribution (often over 1 pound) shift the charge toward trafficking."
  },
  // ── Rape ──────────────────────────────────────────────────────────────────
  {
    chargePattern: /rape(?!.*child\s+abuse)|rape.in.the.(?:first|second|third)|rape.of.a.child/i,
    plainSummary: "Rape is the crime of non-consensual sexual penetration. It is the same conduct that many states now call 'sexual assault in the first degree,' but some states still use the term rape. The prosecution must prove penetration occurred and that the victim did not or could not consent. Rape of a child is a separate, more serious offense involving a victim under a specified age. These are serious felonies with lengthy mandatory sentences.",
    keyTerms: [
      {
        term: "Penetration",
        plainMeaning: "Any sexual penetration, however slight, of any body part or with any object. This is the act element that distinguishes rape from lesser sexual offenses",
        example: "Even minimal penetration satisfies this element. The act does not have to be completed"
      },
      {
        term: "Lack of Consent",
        plainMeaning: "The victim did not freely agree to the act, or was legally incapable of consenting due to age, intoxication, unconsciousness, or mental incapacity",
        example: "A person who is unconscious or heavily intoxicated cannot give legal consent regardless of what they may have said earlier"
      },
      {
        term: "Force or Coercion",
        plainMeaning: "In some definitions, the act must have been accomplished through physical force, threats, or taking advantage of the victim's incapacity",
        example: "Using physical restraint, threats of harm, or a position of authority to overcome the victim's resistance"
      }
    ],
    degreeContext: "Rape is universally a felony. First-degree rape (involving force, weapons, or serious injury) typically carries 10–25 years or life. Second and third degree cover statutory or non-forcible rape and carry shorter but still substantial sentences (3–15 years). Rape of a child carries mandatory sentences of 10–25 years to life, and all convictions require sex offender registration."
  },
  // ── Forgery ───────────────────────────────────────────────────────────────
  {
    chargePattern: /forgery(?!.*check)|forging|uttering.(?:forged|false)/i,
    plainSummary: "Forgery means you made, altered, or used a false written document with the intent to defraud someone. This covers a wide range of documents: signatures, checks, contracts, IDs, prescriptions, wills, and official documents. The prosecutor must prove you knowingly created or used a fake or altered document, and that you intended to deceive.",
    keyTerms: [
      {
        term: "False Writing",
        plainMeaning: "Creating a document that falsely appears to be genuine, or altering a real document to say something it doesn't say",
        example: "Signing someone else's name on a check, or changing the amount on a check you received"
      },
      {
        term: "Intent to Defraud",
        plainMeaning: "You meant to use the document to trick someone into giving you money, property, or a benefit",
        example: "Creating a fake prescription to get medication, or altering a contract to change the payment terms in your favor"
      },
      {
        term: "Uttering",
        plainMeaning: "Passing or presenting a forged document to someone, even if you didn't create it yourself",
        example: "Handing a forged check to a bank teller to cash it, even if someone else forged the signature"
      }
    ],
    degreeContext: "Forgery is typically a felony when it involves financial instruments, official documents, or significant dollar amounts. Minor forgeries (fake IDs for alcohol, small-value document alterations) may be misdemeanors. Sentences range from 1–3 years for less serious forgery to 5–10 years for large-scale fraud involving forged documents."
  },
  // ── Failure to Appear ─────────────────────────────────────────────────────
  {
    chargePattern: /failure.to.appear|failure.to.report|bench.warrant.*failure/i,
    plainSummary: "Failure to appear means you missed a required court date without a legal excuse. This is a separate criminal charge on top of your underlying case, and it results in a bench warrant being issued for your arrest. The prosecutor must prove you had notice of the court date and willfully failed to appear. A genuine emergency or lack of notice may be a defense.",
    keyTerms: [
      {
        term: "Bench Warrant",
        plainMeaning: "A warrant issued directly by the judge authorizing police to arrest you and bring you before the court",
        example: "After you miss court, the judge signs a warrant. Any routine traffic stop can result in your immediate arrest"
      },
      {
        term: "Notice of Court Date",
        plainMeaning: "Proof that you knew about the hearing: given in person at a prior hearing, by mail, or through your attorney",
        example: "Signing paperwork at your last court date confirming you know the next date. That signature is evidence of notice"
      },
      {
        term: "Willfulness",
        plainMeaning: "You intentionally chose not to appear, not that you forgot or had an emergency beyond your control",
        example: "Being in the hospital on the day of the hearing, with medical records to prove it, may negate willfulness"
      }
    ],
    degreeContext: "Failure to appear on a misdemeanor is typically a misdemeanor itself, carrying fines and up to 6–12 months in jail. Failure to appear on a felony case is usually a separate felony, with 1–3 years additional. Beyond the criminal charge, the outstanding bench warrant follows you indefinitely. It can surface during any police contact, including traffic stops, years later."
  },
  // ── Failure to Identify / Providing False Information ─────────────────────
  {
    chargePattern: /failure.to.identify|providing.false.information.to.police|false.information.to.*(?:police|officer)|fake.id|fraudulent.id|possession.of.fake|possession.of.fraudulent.id/i,
    plainSummary: "Failure to identify means you refused to give your name and basic identifying information to a police officer who lawfully stopped you and had a right to request it. Providing false information means you gave a false name, birthdate, or ID to an officer. Possession of a fake or fraudulent ID means you had a document falsely representing your identity or age. Note: the constitutional right to remain silent is different. Some states require you to state your name even if you can refuse to answer other questions.",
    keyTerms: [
      {
        term: "Lawful Stop or Detention",
        plainMeaning: "The officer must have had a legal basis to stop you, meaning reasonable suspicion of a crime, for identification to be required",
        example: "If police had no reason to stop you, your refusal to identify may be protected; if they had reasonable suspicion, you may be legally required to give your name"
      },
      {
        term: "Stop and Identify States",
        plainMeaning: "About half of US states have laws requiring you to provide your name when lawfully stopped. The other half cannot require it",
        example: "Texas, Nevada, and California require identification; New York does not have a stop-and-identify statute"
      },
      {
        term: "False Identification",
        plainMeaning: "Giving a fake name, someone else's name, or a false date of birth to an officer",
        example: "Giving a sibling's name and birthdate to an officer to hide an outstanding warrant"
      }
    ],
    degreeContext: "Failure to identify in a state that requires it is typically a misdemeanor with a small fine. Providing false information is a more serious misdemeanor or low-level felony depending on the circumstances. Possession of a fake ID is a misdemeanor in most states (often used by minors for alcohol) but rises to a felony when used for identity fraud or financial crimes."
  },
  // ── Indecent Exposure / Gross Sexual Imposition / Offensive Touching ───────
  {
    chargePattern: /indecent.exposure|public.urination|gross.sexual.imposition|indecent.assault|offensive.touching/i,
    plainSummary: "Indecent exposure means you exposed your genitals in a public place or in view of others who did not consent to seeing it. Gross sexual imposition and indecent assault cover unwanted sexual touching that falls short of penetration. Offensive touching is the lowest-level sexual contact offense: any unwanted contact of a sexual nature. These charges all require the prosecutor to prove the act was intentional and that others were present or the contact was non-consensual.",
    keyTerms: [
      {
        term: "Public Exposure",
        plainMeaning: "Exposing private body parts in a place where others can see, without a reasonable expectation of privacy",
        example: "Urinating against a building in public view, or deliberately exposing oneself to a passerby"
      },
      {
        term: "Sexual Touching",
        plainMeaning: "Contact with another person's intimate parts for sexual gratification, without their consent",
        example: "Grabbing, groping, or rubbing someone in a sexual way when they have not agreed to it"
      },
      {
        term: "Consent",
        plainMeaning: "The other person's clear, voluntary agreement to the contact. Absence of protest alone is not consent",
        example: "A person who is asleep, drugged, or frozen in fear has not consented even if they say nothing"
      }
    ],
    degreeContext: "Indecent exposure is typically a misdemeanor for a first offense, but becomes a felony for repeat offenders or if a child witnessed the act. Gross sexual imposition and indecent assault are usually felonies carrying 1–5 years. All sex-offense convictions, even misdemeanors involving exposure to a child, may require sex offender registration depending on the state."
  },
  // ── Reckless Driving / Reckless Conduct ───────────────────────────────────
  {
    chargePattern: /reckless.(?:driving|conduct|endangerment)|careless.driving.*criminal/i,
    plainSummary: "Reckless driving or reckless conduct means you operated a vehicle (or acted in some other way) with a conscious disregard for the substantial risk of harm to other people or property. It is more serious than simple negligence: the prosecutor must show you knew your behavior was dangerous and chose to do it anyway. This is distinct from DUI (which requires impairment) and from vehicular homicide (which requires a death).",
    keyTerms: [
      {
        term: "Conscious Disregard",
        plainMeaning: "You were aware of the risk your actions created and chose to ignore it, not just a mistake in judgment",
        example: "Racing another vehicle through a crowded area at twice the speed limit, knowing cars and pedestrians were present"
      },
      {
        term: "Substantial Risk",
        plainMeaning: "A risk that is significant and unjustifiable given the circumstances. Not every risk is criminal",
        example: "Weaving between lanes at high speed on a busy freeway creates a substantial risk; speeding 10 mph over on an empty road does not"
      },
      {
        term: "Reckless Endangerment",
        plainMeaning: "A related charge focusing on the risk of harm created, even without an accident. You don't have to actually hurt someone",
        example: "Firing a gun in the air in a residential neighborhood: the risk to others makes it criminal even if no one is hit"
      }
    ],
    degreeContext: "Reckless driving is usually a misdemeanor (fines, license suspension, up to 90 days or one year in jail). If the reckless conduct causes injury, it escalates to a more serious misdemeanor or low-level felony. Reckless conduct causing serious injury or death becomes a felony: reckless endangerment carries 1-5 years, reckless homicide 2-10 years depending on the state."
  },
  // ── Public Intoxication / Minor in Possession / Open Container ────────────
  {
    chargePattern: /public.intoxication|public.drunkenness|intoxication.\(public\)|minor.in.possession.of.(?:alcohol|tobacco)|open.container|possession.of.alcohol.in|possession.of.alcohol.*(?:park|prohibited)/i,
    plainSummary: "Public intoxication means you were visibly drunk or impaired in a public place to a degree that you were a danger to yourself or others, or were causing a disturbance. Minor in possession means a person under the legal drinking age (21 in all US states) had alcohol or, in some states, tobacco on their person. Open container violations involve having an open alcoholic beverage in a prohibited area, most commonly in a vehicle or public street.",
    keyTerms: [
      {
        term: "Public Place",
        plainMeaning: "Any area accessible to the general public: streets, parks, parking lots, storefronts",
        example: "Being drunk on your own private property is generally not public intoxication"
      },
      {
        term: "Danger to Self or Others",
        plainMeaning: "Most states require more than just being visibly drunk. You must be unsafe or disturbing others",
        example: "Staggering into traffic or picking fights with strangers reaches the threshold; sitting quietly on a park bench may not"
      },
      {
        term: "Minor in Possession",
        plainMeaning: "A person under 21 having alcohol. This applies even to a closed, unopened container",
        example: "A 19-year-old holding a sealed beer they didn't open can be cited for minor in possession"
      }
    ],
    degreeContext: "These are almost always misdemeanors or civil infractions. Public intoxication is often handled by a brief detainment rather than prosecution. Fines are the most common outcome; jail time is rare for first offenses. Minor in possession often carries a fine, community service, and license suspension for young drivers. Open container violations are typically traffic infractions."
  },
  // ── Loitering / Panhandling / Illegal Camping / Peace Disturbance ──────────
  {
    chargePattern: /loitering|panhandling|aggressive.solicitation|illegal.camping|sleeping.in.public|peace.disturbance|littering|illegal.dumping|illegal.discharge.of.fireworks|fishing.*without.*license|hunting.*without.*license/i,
    plainSummary: "These are low-level public order and quality-of-life offenses. Loitering means lingering in a public place without apparent purpose in a way that raises suspicion or disturbs others. Panhandling or aggressive solicitation covers begging for money, especially when done in a manner that intimidates. Illegal camping or sleeping in public covers staying overnight in prohibited public spaces. Peace disturbance is similar to disorderly conduct: acting in a way that disturbs neighborhood peace.",
    keyTerms: [
      {
        term: "Loitering",
        plainMeaning: "Remaining in a place without a clear lawful purpose, in a way that a reasonable person would find alarming or that the law specifically prohibits",
        example: "Standing outside a closed business for hours, refusing to move when asked by police"
      },
      {
        term: "Aggressive Solicitation",
        plainMeaning: "Asking for money in a way that involves following, blocking, threatening, or repeatedly approaching someone after being told no",
        example: "Following a person down the street while asking for money after they said no once"
      },
      {
        term: "Infraction vs. Misdemeanor",
        plainMeaning: "Most of these offenses are civil infractions (like a traffic ticket) rather than criminal charges. They result in fines, not jail time or a criminal record",
        example: "A littering ticket doesn't go on your criminal record the way a misdemeanor conviction would"
      }
    ],
    degreeContext: "Most of these are civil infractions or minor misdemeanors punishable by fines only. Repeat violations or conduct that escalates to harassment can become more serious charges. Illegal camping prosecutions have decreased in many cities following court rulings limiting enforcement when shelter is unavailable."
  },
  // ── Hate Crime Enhancement ────────────────────────────────────────────────
  {
    chargePattern: /hate.crime|federal.hate.crime|bias.motivated/i,
    plainSummary: "A hate crime charge or enhancement means the underlying offense (assault, vandalism, harassment, etc.) was motivated by the victim's race, religion, national origin, sexual orientation, gender identity, or disability. The underlying crime is charged separately, and the hate crime adds an additional charge or increases the sentence. The prosecutor must prove the bias motivation: that the victim was targeted because of who they are.",
    keyTerms: [
      {
        term: "Bias Motivation",
        plainMeaning: "The crime was committed because of the victim's actual or perceived membership in a protected group, not just that you had bias, but that the bias caused you to commit the crime",
        example: "Spray-painting a racial slur on someone's car is vandalism made a hate crime by the bias motivation"
      },
      {
        term: "Enhancement vs. Separate Charge",
        plainMeaning: "In most states, hate crime adds years to the underlying offense's sentence. Federally, it's also a separate crime.",
        example: "Assault carrying 2 years becomes 4–6 years with a hate crime enhancement"
      },
      {
        term: "Protected Characteristics",
        plainMeaning: "The traits that trigger hate crime laws: race, color, religion, national origin, sexual orientation, gender identity, disability, and in some states others",
        example: "Attacking someone because they are Jewish, gay, disabled, or of a particular ethnicity qualifies"
      }
    ],
    degreeContext: "Hate crime enhancements typically increase the sentence by 50–100% over the base offense. Federal hate crime convictions (Matthew Shepard Act) carry up to 10 years in addition to the underlying crime, or life if the offense involved kidnapping, sexual assault, or resulted in death."
  },
  // ── Murder in the Third Degree ────────────────────────────────────────────
  {
    chargePattern: /murder.in.the.third.degree|third.degree.murder|murder.*3rd.degree/i,
    plainSummary: "Third degree murder exists in only a handful of states (including Minnesota, Florida, and Pennsylvania) and covers intentional killings that fall between second degree murder and manslaughter. The exact definition varies by state: in Minnesota, it requires a 'depraved mind,' meaning causing death through reckless conduct with extreme indifference to human life but without targeting a specific person. In Florida, it includes deaths resulting from certain drug offenses.",
    keyTerms: [
      {
        term: "Depraved Mind",
        plainMeaning: "Acting with extreme recklessness so dangerous that it shows a complete disregard for human life, without the specific intent to kill any particular person",
        example: "Firing a gun into a crowd knowing it could kill someone, without aiming at anyone specifically"
      },
      {
        term: "Without Intent to Kill a Specific Person",
        plainMeaning: "The key distinction from second degree murder: the recklessness is so extreme it's murder, but there was no plan to kill the victim in particular",
        example: "Recklessly driving a car through a crowded space at very high speed resulting in a pedestrian's death"
      },
      {
        term: "Drug-Induced Murder (Florida)",
        plainMeaning: "In Florida, providing drugs that cause another person's death can be charged as third-degree felony murder even without intent to kill",
        example: "Selling or giving someone drugs that they die from as a direct result of ingesting"
      }
    ],
    degreeContext: "Third degree murder is a serious felony. In Minnesota, the maximum is 25 years. In Pennsylvania, it carries up to 40 years. It is generally less severe than first or second degree murder but far more serious than manslaughter, and typically results in substantial prison time."
  },
  // ── Recidivist / Sentencing Enhancement ──────────────────────────────────
  {
    chargePattern: /prior.felony.*enhancement|recidivist|habitual.offender|three.strikes|repeat.offender.*enhancement|prior.conviction.*enhancement/i,
    plainSummary: "Recidivist or sentencing enhancement charges are not standalone crimes. They are legal findings that increase your sentence because of your prior criminal history. 'Three strikes' laws impose very long mandatory sentences (sometimes life) for a third serious felony conviction. Habitual offender statutes double or triple standard sentences. The enhancement is imposed at sentencing after conviction, not as a separate crime you are found guilty of at trial.",
    keyTerms: [
      {
        term: "Prior Conviction",
        plainMeaning: "A previous guilty verdict or guilty plea in any court, used as the basis for triggering enhanced sentences",
        example: "Two prior felony convictions for robbery trigger a 'three strikes' enhancement if you are convicted of a third qualifying felony"
      },
      {
        term: "Qualifying Offense",
        plainMeaning: "Not all prior convictions trigger enhancements. Most laws specify only certain serious or violent crimes count as 'strikes'",
        example: "A prior DUI typically doesn't count as a 'strike,' but a prior robbery or assault with a weapon usually does"
      },
      {
        term: "Mandatory Minimum",
        plainMeaning: "A sentence the judge must impose at a minimum and cannot go below. Enhancements often trigger mandatory minimums that remove judicial discretion",
        example: "A third-strike conviction may require a minimum of 25 years regardless of the circumstances of the current offense"
      }
    ],
    degreeContext: "Recidivist enhancements can dramatically increase sentences, from doubling the standard term to triggering mandatory life sentences under three-strikes laws. These are imposed at sentencing by the judge. Your attorney may challenge whether prior convictions qualify, whether they were constitutionally obtained, or whether the enhancement was properly noticed before trial."
  },
  // ── Illegal Entry / Illegal Re-Entry (Federal Immigration) ────────────────
  {
    chargePattern: /illegal.(?:entry|re.?entry)|illegal.re.?entry.after.removal|federal.immigration|unlawful.entry.*federal/i,
    plainSummary: "Illegal entry (8 U.S.C. § 1325) is a federal misdemeanor for entering the United States at a place or time not authorized by a border agent, or by fraud. Illegal re-entry (8 U.S.C. § 1326) is a federal felony for returning to the US after having been previously deported or removed. These are federal charges, handled in federal court, often by fast-track processes. They are separate from civil immigration proceedings.",
    keyTerms: [
      {
        term: "Entry Without Inspection",
        plainMeaning: "Crossing the border at a location that is not an official port of entry, or without being processed by a border agent",
        example: "Crossing the border between official checkpoints, or presenting false documents at a port of entry"
      },
      {
        term: "Removal / Deportation",
        plainMeaning: "A prior formal order requiring you to leave the United States, which is what makes a subsequent entry 'illegal re-entry' rather than just illegal entry",
        example: "Being formally deported by an immigration judge and then returning without permission"
      },
      {
        term: "Aggravated Felony Enhancement",
        plainMeaning: "If you have a prior conviction for an 'aggravated felony,' illegal re-entry carries a dramatically higher sentence",
        example: "Re-entering after deportation with a prior felony conviction on record increases the maximum sentence from 2 to 20 years"
      }
    ],
    degreeContext: "Illegal entry is a misdemeanor with up to 6 months for first offense, 2 years for subsequent. Illegal re-entry without a prior felony carries up to 2 years. With a prior deportation after a felony conviction, the maximum is 10 years. With a prior deportation after an 'aggravated felony,' the maximum is 20 years. These charges have significant consequences for any future immigration applications."
  },
  // ── Juvenile Proceedings ──────────────────────────────────────────────────
  {
    chargePattern: /juvenile.delinquency|juvenile.transfer.to.adult|juvenile.firearm|transfer.*adult.court|waiver.hearing|federal.juvenile/i,
    plainSummary: "Juvenile charges are handled differently from adult criminal cases. A 'delinquency adjudication' is the juvenile equivalent of a guilty verdict: the judge finds the juvenile 'delinquent' rather than 'guilty.' Juvenile records are typically confidential and can often be sealed or expunged when the juvenile turns 18. A transfer or 'waiver' hearing determines whether a juvenile case should be moved to adult court, where sentences are much harsher.",
    keyTerms: [
      {
        term: "Delinquency Adjudication",
        plainMeaning: "The juvenile court's finding that the minor committed the act, not a criminal conviction, but can have similar consequences",
        example: "A 15-year-old found to have committed assault is 'adjudicated delinquent' rather than 'convicted'"
      },
      {
        term: "Transfer to Adult Court",
        plainMeaning: "A court proceeding where the judge decides whether the juvenile's case is serious enough or the juvenile is old enough to be tried as an adult",
        example: "A 17-year-old charged with a violent felony may be transferred if the juvenile system cannot provide adequate rehabilitation or public protection"
      },
      {
        term: "Disposition",
        plainMeaning: "The juvenile court's sentence: could include probation, counseling, community service, or placement in a juvenile facility",
        example: "A judge may order a juvenile to complete 100 hours of community service and attend counseling instead of detention"
      }
    ],
    degreeContext: "Juvenile adjudications generally cannot result in prison. The maximum is placement in a juvenile facility until age 18 or 21 depending on the state. If transferred to adult court, all adult sentencing ranges apply. Records can often be expunged at 18, but transfers to adult court and serious adjudications may not be eligible for expungement and can follow the person into adulthood."
  },
  // ── California Check Fraud ─────────────────────────────────────────────────
  // Based on CALCRIM No. 1970 (Cal. Penal Code § 476a) and Cal. Penal Code § 476.
  // § 476a: writing/passing a check knowing there are insufficient funds + intent to defraud.
  // § 476:  making/passing a check on a fictitious, closed, or forged account.
  {
    chargePattern: /check.{0,20}fraud|bad.{0,5}check|insufficient.{0,10}funds.{0,10}check|476a?(\b|$)|writing.{0,10}bad.{0,5}check|passing.{0,10}bad.{0,5}check|forged.{0,10}check/i,
    plainSummary: "Check fraud under California law covers two related offenses. The most common is Penal Code § 476a: writing, passing, or using a check when you knew your account didn't have enough money to cover it, and doing so to get money or something of value. The second is Penal Code § 476: making or passing a check on a fictitious account, a closed account, or one you had no right to use, or forging a signature on a check. The critical word in both charges is 'knowing': the prosecutor must prove you were aware the check wouldn't clear. Accidentally miscounting your balance or a bank error is not a crime under these statutes.",
    keyTerms: [
      {
        term: "Intent to Defraud",
        plainMeaning: "You were trying to obtain money, goods, or services by using a check you knew was worthless or would bounce",
        example: "Writing a check for rent knowing your account was already overdrawn, or using a check on an account you knew was closed"
      },
      {
        term: "Insufficient Funds (§ 476a)",
        plainMeaning: "Your bank account did not have enough money to cover the full amount of the check at the time you wrote or passed it",
        example: "A $600 check written when your account balance was $40"
      },
      {
        term: "Fictitious or Forged Check (§ 476)",
        plainMeaning: "Using a check on an account that doesn't exist, was closed, or belongs to someone else, or signing someone else's name without permission",
        example: "Writing a check on a bank account you closed last year, or signing your employer's name on a business check without authorization"
      },
      {
        term: "Making, Drawing, Uttering, or Delivering",
        plainMeaning: "Any step in creating or passing the check counts. You don't have to be the one who wrote it to be charged",
        example: "Handing a bad check to a cashier, depositing someone else's check knowing it's bad, or endorsing a fraudulent check for cash"
      },
      {
        term: "Wobbler",
        plainMeaning: "This offense can be filed as either a misdemeanor or a felony. The prosecutor decides based on the dollar amount, your prior record, and the circumstances",
        example: "A first offense involving a small amount is often charged as a misdemeanor; a pattern of bad checks or a large amount is more likely a felony"
      }
    ],
    degreeContext: "Check fraud under § 476a is a 'wobbler': charged as a misdemeanor it carries up to one year in county jail; as a felony, up to three years in county jail (under California's realignment). Prosecutors weigh the dollar amount of the check, whether there was a pattern of multiple bad checks, and your prior criminal record. Checks over $950 and repeat offenses are significantly more likely to be filed as felonies. Diversion programs and civil compromise (repaying what's owed) are sometimes available for first-time offenders. The forgery variant under § 476 carries the same sentencing range but is more seriously viewed because it involves deliberate falsification rather than an account with no money."
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
