import type { ChargeTranslationEntry } from "./charge-explanations-translations";
import { OHIO_HAZING_AND_PROTECTION_CHARGES } from "./ohio-hazing-and-protection";

const spanishSummary = (section: string) => {
  const text = OHIO_HAZING_AND_PROTECTION_CHARGES.find(row => row.code === section)?.descriptionEs;
  if (!text) throw new Error(`Missing Ohio Spanish summary: ${section}`);
  return text;
};

// Draft translations, not fluent-speaker or attorney sign-off.
export const OHIO_HAZING_AND_PROTECTION_TRANSLATIONS: Record<string, ChargeTranslationEntry> = {
  "ohio-hazing": {
    es: {
      draft: true, keyTerms: [], plainSummary: spanishSummary("2903.31"),
      degreeContext: "El apartado (B)(1) o (2) es una infracción menor de segundo grado: hasta 90 días de cárcel y multa de hasta $750. El apartado (C)(1) o (2), con consumo coaccionado de alcohol o drogas que resulte en daño físico grave, es un delito grave de tercer grado. Si se impone prisión, las penas ordinarias de F3 son de 9, 12, 18, 24, 30 o 36 meses, con multa de hasta $10,000. Son límites básicos condicionales, no multas fijas, penas garantizadas ni máximos totales universales; otras alegaciones y sanciones requieren revisión separada.",
    },
    zh: {
      draft: true, keyTerms: [],
      plainSummary: "俄亥俄州第2903.31条将入会欺凌定义为加入组织、继续或恢复成员资格或关联关系的行为，或胁迫他人实施此类行为，且该行为造成精神或身体伤害，或造成此类伤害的重大风险。该定义不限于学生或最初入会。组织包括兄弟会或姐妹会所属的全国性或国际性组织。(B)款禁止轻率参与，并另行禁止管理员、雇员、教职人员、教师、顾问、校友和志愿者轻率地允许对与其组织有关联的人实施入会欺凌，组织包括公立或私立教育机构。(C)款要求入会欺凌包含强迫饮酒或摄入法定滥用药物，并由该强迫摄入导致严重身体伤害。仅有严重伤害并不足以确立该强迫摄入分支。法定滥用药物包括依所引用定义认定的受控物质、有害致醉物及危险药物；特定物质的分类须另行审查。",
      degreeContext: "(B)(1)或(2)为二级轻罪：监禁最高90天，罚金最高750美元。(C)(1)或(2)涉及强迫饮酒或摄入药物并导致严重身体伤害，为三级重罪。如判处监禁，三级重罪普通刑期为9、12、18、24、30或36个月，罚金最高10,000美元。这些是有条件的基本限度，不是固定罚款、保证判处的刑罚或普遍适用的总刑罚上限；其他指控和处罚须另行审查。",
    },
  },
  "ohio-reckless-failure-to-immediately-report-knowledge-of-hazing": {
    es: {
      draft: true, keyTerms: [], plainSummary: spanishSummary("2903.311"),
      degreeContext: "Normalmente es una infracción menor de cuarto grado: hasta 30 días de cárcel y multa de hasta $250. Si las novatadas causan daño físico grave, es una infracción menor de primer grado: hasta 180 días de cárcel y multa de hasta $1,000. El aumento sigue siendo una infracción menor, no un delito grave. Son máximos básicos condicionales, no multas fijas ni penas garantizadas; otras alegaciones y sanciones requieren revisión separada.",
    },
    zh: {
      draft: true, keyTerms: [],
      plainSummary: "俄亥俄州第2903.311条适用于以官方及专业身份行事的组织管理员、雇员、教职人员、教师、顾问、校友或志愿者。本条禁止轻率地不立即将已知的入会欺凌向执法机关报告；该机关须位于受害人居住的县，或欺凌正在发生或曾发生的县。仅向学校或组织负责人报告，不满足条文规定的向执法机关报告的要求。这不是对所有旁观者施加的一般义务。入会欺凌和组织采用第2903.31条的定义，包括继续或恢复成员资格或关联关系以及所属的全国性或国际性组织。与第2903.31条的重罪分支不同，本条因严重身体伤害而提高等级的规定不要求强迫饮酒或摄入药物。",
      degreeContext: "通常为四级轻罪：监禁最高30天，罚金最高250美元。若入会欺凌造成严重身体伤害，则为一级轻罪：监禁最高180天，罚金最高1,000美元。提高等级后仍是轻罪，而非重罪。这些是有条件的基本上限，不是固定罚款或保证判处的刑罚；其他指控和处罚须另行审查。",
    },
  },
  "ohio-female-genital-mutilation": {
    es: {
      draft: true, keyTerms: [], plainSummary: spanishSummary("2903.32"),
      degreeContext: "Es un delito grave de segundo grado. Para hechos ocurridos a partir del 22 de marzo de 2019, si se impone prisión, los mínimos ordinarios son de 2 a 8 años, con máximo de pena indeterminada según la sección 2929.144; para un solo delito grave que cumpla los requisitos, el máximo es el mínimo más el 50%. La multa ordinaria máxima de F2 es de $15,000. Además, la sección 2903.32(B) exige que el tribunal imponga una multa adicional de hasta $25,000: imponer una multa adicional es obligatorio, pero $25,000 es un máximo, no un importe fijo. Los dos máximos de multa descritos pueden sumar $40,000; no es un límite universal para todas las sanciones o costas. La sección entró en vigor el 5 de abril de 2019; la fecha general de las reglas de condena no certifica que este delito existiera antes. Otras alegaciones y penas acumuladas requieren revisión separada.",
    },
    zh: {
      draft: true, keyTerms: [],
      plainSummary: "俄亥俄州第2903.32条禁止明知地对未满十八岁的他人的大阴唇、小阴唇或阴蒂的任何部分实施割除、切除或锁阴术。本条还另行禁止明知地将未成年人运送到某设施或地点，以促成上述禁止行为。对于由医生或持照医疗专业人员出于医疗目的实施、且属于其执照许可范围的程序，本条不适用；仅持有执照并不足以确立该例外。医生和持照医疗专业人员须符合本条特定的执业授权定义。文化或仪式上的必要性、未成年人的同意以及父母或监护人的同意，均不是本条规定的抗辩理由。这不是对某位专业人员的执照或执业范围作出的认定。",
      degreeContext: "属于二级重罪。对于2019年3月22日当日或之后的行为，如判处监禁，普通最低刑期为2至8年，不定期刑的最高期限依第2929.144条确定；对于单一符合条件的重罪，最高期限为最低刑期加50%。二级重罪普通罚金上限为15,000美元。此外，第2903.32(B)款要求法院判处最高25,000美元的附加罚金：判处附加罚金是强制性的，但25,000美元是上限，不是固定金额。上述两项罚金上限合计可为40,000美元，但这不是所有处罚或费用的普遍上限。本条于2019年4月5日生效；通用量刑规则的日期不证明此前已存在此罪。其他指控及总刑期须另行审查。",
    },
  },
};