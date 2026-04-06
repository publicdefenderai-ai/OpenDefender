import { Info } from "lucide-react";
import { Link } from "wouter";

const US_STATES: Record<string, string> = {
  alabama: "Alabama", alaska: "Alaska", arizona: "Arizona", arkansas: "Arkansas",
  california: "California", colorado: "Colorado", connecticut: "Connecticut",
  delaware: "Delaware", florida: "Florida", georgia: "Georgia", hawaii: "Hawaii",
  idaho: "Idaho", illinois: "Illinois", indiana: "Indiana", iowa: "Iowa",
  kansas: "Kansas", kentucky: "Kentucky", louisiana: "Louisiana", maine: "Maine",
  maryland: "Maryland", massachusetts: "Massachusetts", michigan: "Michigan",
  minnesota: "Minnesota", mississippi: "Mississippi", missouri: "Missouri",
  montana: "Montana", nebraska: "Nebraska", nevada: "Nevada",
  "new hampshire": "New Hampshire", "new jersey": "New Jersey",
  "new mexico": "New Mexico", "new york": "New York",
  "north carolina": "North Carolina", "north dakota": "North Dakota",
  ohio: "Ohio", oklahoma: "Oklahoma", oregon: "Oregon",
  pennsylvania: "Pennsylvania", "rhode island": "Rhode Island",
  "south carolina": "South Carolina", "south dakota": "South Dakota",
  tennessee: "Tennessee", texas: "Texas", utah: "Utah", vermont: "Vermont",
  virginia: "Virginia", washington: "Washington", "west virginia": "West Virginia",
  wisconsin: "Wisconsin", wyoming: "Wyoming",
  "district of columbia": "Washington D.C.",
};

const TOPIC_LABELS: Record<string, string> = {
  bail: "bail and pretrial release",
  arraignment: "arraignment procedures",
  phone_call: "jail phone call rules",
};

interface JurisdictionCalloutProps {
  jurisdiction: string;
  topic: string;
}

export function JurisdictionCallout({ jurisdiction, topic }: JurisdictionCalloutProps) {
  if (!jurisdiction) return null;

  const stateName = US_STATES[jurisdiction.toLowerCase()] ?? jurisdiction;
  const topicLabel = TOPIC_LABELS[topic] ?? topic.replace(/_/g, " ");

  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-800 dark:text-blue-200 mt-3">
      <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
      <p>
        Rules for <strong>{topicLabel}</strong> vary significantly in{" "}
        <strong>{stateName}</strong>. The information above reflects general
        U.S. law. For {stateName}-specific timelines and procedures,{" "}
        <Link
          href="/case-guidance"
          className="underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-100"
        >
          get personalized guidance
        </Link>
        {" "}or speak with a local public defender.
      </p>
    </div>
  );
}
