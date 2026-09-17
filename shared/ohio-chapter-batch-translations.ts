import type { ChargeTranslationEntry } from "./charge-explanations-translations";
import { OHIO_CHAPTER_BATCH_CHARGES } from "./ohio-chapter-batch";

const spanishSummary = (section: string) => {
  const text = OHIO_CHAPTER_BATCH_CHARGES.find(row => row.code === section)?.descriptionEs;
  if (!text) throw new Error(`Missing Ohio Spanish summary: ${section}`);
  return text;
};

// Machine-assisted drafts; not attorney or fluent-speaker sign-off.
export const OHIO_CHAPTER_BATCH_TRANSLATIONS: Record<string, ChargeTranslationEntry> = {
  "ohio-aggravated-menacing": {
    es: {
      draft: true, keyTerms: [], plainSummary: spanishSummary("2903.21"),
      degreeContext: "Normalmente es una infracción menor de primer grado: hasta 180 días de cárcel y multa de hasta $1,000. Es delito grave de quinto grado cuando la víctima es funcionario o empleado de una agencia pública de servicios para menores o agencia privada de colocación de menores y el hecho se relaciona con el desempeño real o previsto de sus funciones oficiales. Es de cuarto grado si además existe una condena o declaración de culpabilidad previa que cumpla los requisitos por un delito de violencia, con una víctima de ese tipo de agencia y relacionado con tales funciones. Si se impone prisión, los rangos ordinarios son de 6 a 12 meses (F5) o de 6 a 18 meses (F4), con multas máximas de $2,500 o $5,000, respectivamente. Son límites básicos condicionales, no multas fijas ni una predicción del castigo total.",
    },
    zh: {
      draft: true, keyTerms: [],
      plainSummary: "俄亥俄州第2903.21条禁止明知地使他人相信行为人将对该人或其财产、其未出生胎儿或其直系家庭成员造成严重身体伤害。该信念可以基于针对或指明该人的雇主或所属组织的言语或行为，组织包括政府雇主。该罪涉及对严重伤害的信念，不要求展示武器或实际造成伤害。须考虑法定伤害定义及妊娠相关例外。",
      degreeContext: "通常为一级轻罪：监禁最高180天，罚金最高1,000美元。如果受害人为公共儿童服务机构或私人儿童安置机构的官员或雇员，且行为涉及其实际或预期履行的公务，则为五级重罪。若还有符合条件的既往暴力犯罪定罪或认罪，该前罪的受害人也是此类机构的官员或雇员且前罪与此类公务有关，则为四级重罪。如判处监禁，普通刑期为五级重罪6至12个月或四级重罪6至18个月，罚金上限分别为2,500美元或5,000美元。这些是有条件的基本限度，不是固定罚款或总刑罚预测。",
    },
  },
  "ohio-permitting-child-abuse": {
    es: {
      draft: true, keyTerms: [], plainSummary: spanishSummary("2903.15"),
      degreeContext: "El daño físico grave corresponde al tercer grado; la muerte, al primer grado. Si se impone prisión, las penas ordinarias de F3 son de 9, 12, 18, 24, 30 o 36 meses, con multa de hasta $10,000. Para hechos de F1 ocurridos a partir del 22 de marzo de 2019, los mínimos ordinarios son de 3 a 11 años, con máximo de pena indeterminada según la sección 2929.144; para un solo delito grave que cumpla los requisitos, el máximo es el mínimo más el 50%. La multa máxima de F1 es de $20,000. Los hechos anteriores, antecedentes, especificaciones y otras sanciones requieren revisión separada. No son multas fijas, penas garantizadas ni máximos totales universales.",
    },
    zh: {
      draft: true, keyTerms: [],
      plainSummary: "俄亥俄州第2903.15条涉及父母、监护人、保管人或具有监护权的人，因允许虐待、折磨、体罚或其他身体惩戒，或残酷或长时间的身体约束，而作为近因导致未满十八岁的儿童，或未满二十一岁且有精神或身体残障的人遭受严重身体伤害或死亡。还须依据第2901.21条分析罪责；不要假定自动适用严格责任。法定积极抗辩要求两项条件同时满足：没有随时可用的方法防止伤害或死亡，并且及时采取合理措施求助。这不保证该抗辩在具体案件中成立。",
      degreeContext: "造成严重身体伤害为三级重罪；造成死亡为一级重罪。如判处监禁，三级重罪普通刑期为9、12、18、24、30或36个月，罚金最高10,000美元。对于2019年3月22日当日或之后的一级重罪行为，普通最低刑期为3至11年，不定期刑的最高期限依第2929.144条确定；对于单一符合条件的重罪，最高期限为最低刑期加50%。一级重罪罚金上限为20,000美元。更早的行为、前科、附加指控及其他处罚须另行审查。这些不是固定罚款、保证判处的刑罚或普遍适用的总刑罚上限。",
    },
  },
  "ohio-strangulation": {
    es: {
      draft: true, keyTerms: [], plainSummary: spanishSummary("2903.18"),
      degreeContext: "(B)(1) es F2 y (B)(2) es F3. Dentro de (B)(3), la base es F5 y sube a F4 cuando la víctima cumple la definición de familiar, miembro del hogar o pareja actual o anterior. Dentro de esa misma variante (B)(3), corresponde F3 si existen esa relación Y una condena o declaración de culpabilidad previa por un delito grave de violencia, O si el autor sabía que la víctima estaba embarazada. La alternativa de conocimiento del embarazo no exige esa relación ni una condena previa. Si se impone prisión, las penas ordinarias son: F2, mínimo de 2 a 8 años con máximo de pena indeterminada según la sección 2929.144 (un solo delito grave que cumpla los requisitos: mínimo más 50%); F3, 9, 12, 18, 24, 30 o 36 meses; F4, de 6 a 18 meses; F5, de 6 a 12 meses. Las multas máximas son $15,000/$10,000/$5,000/$2,500, respectivamente. El rango F2 describe hechos ocurridos a partir del 22 de marzo de 2019, no una certificación de derecho histórico. Otras alegaciones y penas acumuladas requieren revisión separada; no son multas fijas ni máximos totales universales.",
    },
    zh: {
      draft: true, keyTerms: [],
      plainSummary: "俄亥俄州第2903.18条将勒颈或窒息定义为通过压迫喉部或颈部，或遮盖鼻和口，阻碍正常呼吸或血液循环。(B)(1)规定明知地造成严重身体伤害；(B)(2)规定明知地造成严重身体伤害的重大风险；(B)(3)规定明知地造成身体伤害或其重大风险。并非每个分支都要求可见伤痕。对于作为旨在帮助或使受害人受益的医疗或其他程序一部分而实施的行为，法律规定了积极抗辩。家庭或同住成员及约会关系有特定法定定义；偶然相识不属于约会关系，本条规定的既往约会关系期限为十二个月。",
      degreeContext: "(B)(1)为二级重罪，(B)(2)为三级重罪。在(B)(3)内，基本等级为五级重罪；若受害人是符合定义的家庭或同住成员、现任或前任约会对象，则升为四级重罪。在同一(B)(3)分支内，若同时存在该关系和既往暴力重罪定罪或认罪，或者行为人明知受害人怀孕，则为三级重罪。明知怀孕这一替代条件不要求该关系或既往定罪。如判处监禁，普通刑期为：二级重罪最低2至8年，最高期限依第2929.144条确定（单一符合条件的重罪：最低刑期加50%）；三级重罪9、12、18、24、30或36个月；四级重罪6至18个月；五级重罪6至12个月。罚金上限依次为15,000/10,000/5,000/2,500美元。二级重罪范围描述2019年3月22日当日或之后的行为，不是历史法律认证。其他指控及总刑期须另行审查；这些不是固定罚款或普遍适用的总刑罚上限。",
    },
  },
};