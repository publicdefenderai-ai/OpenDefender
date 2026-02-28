import type { Playbook } from "../schema";

export const sentencingMitigationPlaybook: Playbook = {
  id: "sentencing-mitigation",
  category: "criminal",
  name: "Sentencing Advocacy & Mitigation",
  tagline: "Every case ends here — fight for every day",
  overview: "Sentencing is often where the most consequential advocacy happens and where the least preparation occurs. Whether after a plea or a trial verdict, the sentencing hearing is the attorney's opportunity to humanize the client, contextualize the offense, and argue for the minimum sentence that serves the interests of justice. A well-prepared sentencing memorandum, supported by a thorough mitigation investigation, can mean the difference between years in prison and a community-based sentence. Federal sentencing has its own specialized framework; this playbook covers both federal and state sentencing advocacy.",
  typicalTimeline: "2–8 weeks of preparation per sentencing",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "The sentencing memorandum is the most powerful document you will file in the case after the plea. It must tell the client's full human story — not just advocate for a lower number.",
    "Federal sentencing: the Guidelines are advisory after United States v. Booker (2005) but remain the starting point. Identify all applicable departures and variances — these are arguments for a below-Guidelines sentence.",
    "Mitigating factors: trauma history, mental illness, substance use disorder, extraordinary rehabilitation, youthful offense, limited criminal history, and family circumstances all support below-Guidelines or below-statutory-minimum sentences.",
    "Victim impact: if there is a victim, prepare your client for victim impact statements. The sentencing judge will be moved by the victim — be prepared to acknowledge the harm and respond.",
    "State sentencing varies enormously — some states have guideline systems, others give judges wide discretion. Know your state's sentencing structure before arguing.",
    "Presentence Investigation Report (PSR): in federal court, the PSR is prepared by the probation officer and controls the Guidelines calculation. Review it meticulously and object to every factual inaccuracy — PSR errors follow clients for decades."
  ],
  stages: [
    {
      id: "psr-review",
      name: "Presentence Report Review (Federal)",
      timeline: "Upon receipt of draft PSR",
      description: "Review the PSR meticulously and file timely objections to correct the record before sentencing.",
      keyActions: [
        {
          text: "Review every factual paragraph in the PSR — confirm accuracy of criminal history, offense description, and personal background",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Calculate the Guidelines range independently and verify the probation officer's calculation",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File written objections to all factual inaccuracies and all Guidelines calculation errors by the deadline",
          priority: "critical",
          deadline: "Typically 14 days after receiving draft PSR",
          type: "attorney"
        },
        {
          text: "Object to any relevant conduct enhancements that inflate the offense level",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review criminal history calculation — verify that old convictions score correctly and that inactive sentences are not over-counted",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Meet with probation officer to resolve non-contested inaccuracies before the final PSR is filed",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Review the PSR with your client before filing objections. They will catch factual errors in their personal history that you would not catch — wrong birth dates of children, incorrect employment history, mischaracterized offense conduct. Their input is essential for accuracy.",
      pitfalls: [
        "Not objecting to PSR errors — unobjected-to findings in the PSR become part of the official record and can be used in future proceedings",
        "Missing the PSR objection deadline — late objections may be waived",
        "Accepting the probation officer's Guidelines calculation without independent verification"
      ]
    },
    {
      id: "mitigation-investigation",
      name: "Mitigation Investigation",
      timeline: "Weeks 2–6",
      description: "Conduct a thorough social history investigation to surface all mitigating factors.",
      keyActions: [
        {
          text: "Conduct full life history interview with the client — childhood, trauma, abuse, neglect, substance use, mental health",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Interview family members, teachers, employers, coaches, and community members who know the client",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Obtain medical, mental health, and substance use treatment records",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research childhood trauma documentation: DCF/CPS records, school records, prior mental health diagnoses",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Consider retaining a mitigation specialist or social worker for complex cases — they are trained to surface childhood trauma",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Document rehabilitation: educational programs, vocational training, sobriety, community service, letters of support",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Prepare your client for the mitigation interview by explaining: 'I need to understand your whole life, not just this case. I will ask about painful things — your childhood, your family, your struggles. The more I understand about what shaped you, the better I can present your full story to the judge.'",
      pitfalls: [
        "Conducting a cursory mitigation investigation — the most impactful sentencing arguments come from deep social history, not surface-level facts",
        "Not interviewing family members — they often reveal trauma history and context that the client minimizes or omits",
        "Failing to obtain childhood records (CPS, school, mental health) — documented childhood trauma is one of the most powerful mitigation factors"
      ]
    },
    {
      id: "sentencing-memorandum",
      name: "Sentencing Memorandum",
      timeline: "Weeks 4–8",
      description: "Draft a comprehensive sentencing memorandum that tells the client's human story and argues for the least restrictive sentence.",
      keyActions: [
        {
          text: "Open with the human narrative — who is this person beyond the offense? Make the judge see a full human being",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Address the § 3553(a) factors (federal) or state sentencing factors systematically",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Address the nature and circumstances of the offense — contextualize without minimizing",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Argue for applicable departures and variances: aberrant behavior, diminished capacity, family circumstances, extraordinary rehabilitation",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Attach supporting exhibits: letters of support, medical records, treatment certificates, employment records",
          priority: "high",
          type: "attorney"
        },
        {
          text: "End with a specific sentencing recommendation — do not leave the judge without a clear ask",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Ask your client to write a personal statement to the judge. It does not need to be long — one page is sufficient. It should express what they have learned, what they understand about the harm they caused, and what they plan to do going forward. A genuine, personal statement moves judges.",
      pitfalls: [
        "Not filing a sentencing memorandum — in federal court especially, a brief attorney argument at sentencing is no substitute for a written memorandum the judge can read in chambers",
        "Writing a memorandum that focuses on the law rather than the person — judges are moved by people, not legal arguments alone",
        "Not making a specific sentencing recommendation — 'we leave it to the court's discretion' is not advocacy"
      ]
    },
    {
      id: "sentencing-hearing",
      name: "Sentencing Hearing",
      timeline: "Day of hearing",
      description: "Present the mitigation case at the sentencing hearing and advocate for the recommended sentence.",
      keyActions: [
        {
          text: "Present supporting witnesses — family members, employers, teachers, and treatment providers who can speak to the client's character",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Address victim impact statements with acknowledgment of harm and the client's remorse",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Make a focused oral argument — judges have read the memo; argument should add, not repeat",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Allow client to make a statement — prepare them for it and coach them to speak to the victim's harm, not their own hardship",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Object to any Guidelines enhancements or sentencing conditions the judge imposes without proper legal basis",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-sentence-modification",
          name: "Motion for Sentence Modification",
          relevance: "Used post-sentence if circumstances change and modification is warranted"
        }
      ],
      clientGuidance: "Coach your client on their allocution: address the judge directly, use 'Your Honor,' acknowledge the harm caused, express genuine remorse, and share what they have done and plan to do to make it right. Instruct them not to argue their innocence (if they pleaded guilty) or disparage the victim.",
      pitfalls: [
        "Not preparing the client's allocution — unprepared statements often hurt more than help",
        "Not objecting on the record to sentencing decisions you intend to appeal — failure to object waives the issue on appeal",
        "Allowing the client to argue their innocence at sentencing after entering a guilty plea — this alienates the judge and destroys credibility"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Federal Guidelines Framework",
      variations: [
        {
          states: ["ALL"],
          note: "Federal: Guidelines are advisory after Booker (2005). Courts must calculate the Guidelines range, consider the § 3553(a) factors, and explain any deviation. Gall v. United States (2007): courts may vary from Guidelines based on policy disagreement or individual circumstances. Always argue both Guidelines compliance AND a below-Guidelines variance."
        }
      ]
    },
    {
      topic: "Mandatory Minimums & Safety Valve",
      variations: [
        {
          states: ["ALL"],
          note: "Federal drug mandatory minimums: safety valve (18 U.S.C. § 3553(f)) allows courts to sentence below the mandatory minimum for qualifying defendants. Post-First Step Act (2018): safety valve criteria expanded. Clients with no more than 4 criminal history points, no violence, no leadership role, and full cooperation may qualify."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-for-sentence-modification"],
  tags: ["sentencing", "mitigation", "presentence report", "PSR", "Guidelines", "variance", "departure", "compassionate release", "allocution"]
};
