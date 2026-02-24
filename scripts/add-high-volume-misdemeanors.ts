import * as fs from 'fs';

const jurisdictions = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
  'DC','PR','VI','GU','AS','MP'
];

interface ChargeTemplate {
  name: string;
  idSuffix: string;
  category: 'misdemeanor';
  description: (jur: string) => string;
  maxPenalty: string;
  commonDefenses: string[];
  evidenceToGather: string[];
  specificRights: string[];
  urgentActions: string[];
  getCode: (jur: string) => string;
}

const stateStatutes: Record<string, Record<string, string>> = {
  'failure-to-appear': {
    AL: '15-13-3', AK: '12.30.060', AZ: '13-2507', AR: '5-54-120', CA: '1320',
    CO: '16-2-110', CT: '53a-172', DE: '11-2113', FL: '843.15', GA: '17-6-12',
    HI: '710-1077', ID: '18-7011', IL: '720-5/32-10', IN: '35-44.1-2-9', IA: '811.2',
    KS: '21-5914', KY: '520.070', LA: '14:228', ME: '15-1091', MD: '7-301',
    MA: '276-82A', MI: '764.26', MN: '609.49', MS: '99-5-9', MO: '544.665',
    MT: '46-9-502', NE: '29-901', NV: '199.335', NH: '597-7-a', NJ: '2C:29-7',
    NM: '31-3-9', NY: '215.58', NC: '15A-543', ND: '29-03-30', OH: '2937.29',
    OK: '22-1115', OR: '162.195', PA: '18-5124', RI: '12-6-1', SC: '38-53-70',
    SD: '23A-43-32', TN: '39-16-609', TX: '38.10', UT: '77-7-22', VT: '7553a',
    VA: '19.2-128', WA: '9A.76.170', WV: '62-1C-17', WI: '946.49', WY: '7-11-509',
    DC: '23-1327', PR: '34-4501', VI: '5-3531', GU: '8-85.30', AS: '46.0830', MP: '6-3301'
  },
  'probation-violation': {
    AL: '15-22-31', AK: '12.55.110', AZ: '13-901', AR: '5-4-309', CA: '1203.2',
    CO: '16-11-206', CT: '53a-32', DE: '11-4334', FL: '948.06', GA: '42-8-38',
    HI: '706-625', ID: '20-222', IL: '730-5/5-6-4', IN: '35-38-2-3', IA: '908.11',
    KS: '22-3716', KY: '533.050', LA: '14:900.1', ME: '17A-1205', MD: '6-234',
    MA: '279-3', MI: '771.4', MN: '609.14', MS: '47-7-37', MO: '559.036',
    MT: '46-18-203', NE: '29-2267', NV: '176A.630', NH: '504-A:4', NJ: '2C:45-3',
    NM: '31-21-15', NY: '410.70', NC: '15A-1344', ND: '12.1-32-07', OH: '2951.08',
    OK: '22-991a', OR: '137.545', PA: '42-9771', RI: '12-19-20', SC: '24-21-640',
    SD: '23A-31-4', TN: '40-35-311', TX: '42A.751', UT: '77-18-1', VT: '28-252',
    VA: '19.2-306', WA: '9.94A.631', WV: '62-12-10', WI: '973.10', WY: '7-13-408',
    DC: '24-304', PR: '34-4601', VI: '5-3601', GU: '8-90.10', AS: '46.0901', MP: '6-3401'
  },
  'resisting-arrest': {
    AL: '13A-10-41', AK: '11.56.700', AZ: '13-2508', AR: '5-54-103', CA: '148',
    CO: '18-8-103', CT: '53a-167a', DE: '11-1257', FL: '843.01', GA: '16-10-24',
    HI: '710-1026', ID: '18-705', IL: '720-5/31-1', IN: '35-44.1-3-1', IA: '719.1',
    KS: '21-5904', KY: '520.090', LA: '14:108', ME: '17A-751', MD: '9-408',
    MA: '268-32B', MI: '750.81d', MN: '609.50', MS: '97-9-73', MO: '575.150',
    MT: '45-7-301', NE: '28-904', NV: '199.280', NH: '642:2', NJ: '2C:29-2',
    NM: '30-22-1', NY: '205.30', NC: '14-223', ND: '12.1-08-02', OH: '2921.33',
    OK: '21-268', OR: '162.315', PA: '18-5104', RI: '12-7-10', SC: '16-9-320',
    SD: '22-11-4', TN: '39-16-602', TX: '38.03', UT: '76-8-305', VT: '13-3017',
    VA: '18.2-460', WA: '9A.76.040', WV: '61-5-17', WI: '946.41', WY: '6-5-204',
    DC: '22-405', PR: '34-4101', VI: '5-3101', GU: '8-80.10', AS: '46.0701', MP: '6-3101'
  },
  'protective-order-violation': {
    AL: '13A-6-142', AK: '11.56.740', AZ: '13-2810', AR: '5-53-134', CA: '273.6',
    CO: '18-6-803.5', CT: '53a-223', DE: '11-1112A', FL: '741.31', GA: '16-5-95',
    HI: '586-11', ID: '18-920', IL: '720-5/12-3.4', IN: '35-46-1-15.1', IA: '664A.7',
    KS: '21-5924', KY: '403.763', LA: '14:79', ME: '19-4011', MD: '4-508',
    MA: '209A-7', MI: '750.81e', MN: '518B.01', MS: '93-21-21', MO: '455.085',
    MT: '45-5-626', NE: '42-924', NV: '33.100', NH: '173-B:9', NJ: '2C:29-9',
    NM: '40-13-6', NY: '215.51', NC: '50B-4.1', ND: '14-07.1-06', OH: '2919.27',
    OK: '22-60.6', OR: '107.720', PA: '23-6114', RI: '15-15-3', SC: '16-25-20',
    SD: '25-10-13', TN: '39-13-113', TX: '25.07', UT: '77-36-2.4', VT: '13-1030',
    VA: '16.1-253.2', WA: '26.50.110', WV: '48-27-903', WI: '813.12', WY: '6-4-404',
    DC: '16-1005', PR: '34-4201', VI: '5-3201', GU: '8-82.10', AS: '46.0501', MP: '6-3201'
  },
  'open-container': {
    AL: '32-5A-190', AK: '04.16.050', AZ: '4-244', AR: '5-71-218', CA: '23222',
    CO: '42-4-1305', CT: '30-89a', DE: '4-713', FL: '316.1936', GA: '40-6-253',
    HI: '291-3.1', ID: '23-505', IL: '625-5/11-502', IN: '7.1-5-7-7', IA: '321.284',
    KS: '8-1599', KY: '189.530', LA: '32:300', ME: '29-2112-A', MD: '21-903',
    MA: '90-24I', MI: '257.624a', MN: '169A.35', MS: '63-11-30', MO: '577.017',
    MT: '61-8-460', NE: '60-6.211.08', NV: '484B.150', NH: '265-A:44', NJ: '39:4-51a',
    NM: '66-8-138', NY: '1227-a', NC: '20-138.7', ND: '39-08-18', OH: '4301.62',
    OK: '37-537', OR: '811.170', PA: '75-3809', RI: '31-22-21', SC: '61-4-110',
    SD: '35-1-8.2', TN: '55-10-416', TX: '49.031', UT: '41-6a-526', VT: '23-1134',
    VA: '18.2-323.1', WA: '46.61.519', WV: '60-6-9', WI: '346.935', WY: '31-5-235',
    DC: '25-1001', PR: '34-4301', VI: '5-3301', GU: '8-83.10', AS: '46.0601', MP: '6-3501'
  },
  'minor-in-possession': {
    AL: '28-1-5', AK: '04.16.050', AZ: '4-244.41', AR: '3-3-203', CA: '25662',
    CO: '18-13-122', CT: '30-89', DE: '4-904', FL: '562.111', GA: '3-3-23',
    HI: '281-101.5', ID: '23-949', IL: '235-5/6-20', IN: '7.1-5-7-7', IA: '123.47',
    KS: '21-5607', KY: '244.085', LA: '14:93.10', ME: '28-2051', MD: '10-114',
    MA: '138-34C', MI: '436.1703', MN: '340A.503', MS: '67-1-81', MO: '311.325',
    MT: '45-5-624', NE: '53-180.02', NV: '202.020', NH: '179-10', NJ: '2C:33-15',
    NM: '60-7B-1', NY: '65-c', NC: '18B-302', ND: '05-01-08', OH: '4301.69',
    OK: '37-246', OR: '471.430', PA: '18-6308', RI: '3-8-11.1', SC: '63-19-2440',
    SD: '35-9-2', TN: '1-3-113', TX: '106.04', UT: '32B-4-409', VT: '7-657',
    VA: '4.1-305', WA: '66.44.270', WV: '11-16-19', WI: '125.07', WY: '12-6-101',
    DC: '25-1002', PR: '34-4302', VI: '5-3302', GU: '8-83.20', AS: '46.0602', MP: '6-3502'
  },
  'false-info-to-police': {
    AL: '13A-10-9', AK: '11.56.800', AZ: '13-2907.01', AR: '5-54-122', CA: '148.9',
    CO: '18-8-111', CT: '53a-157', DE: '11-1245', FL: '837.05', GA: '16-10-26',
    HI: '710-1063', ID: '18-5413', IL: '720-5/31-4.5', IN: '35-44.1-2-3', IA: '719.3',
    KS: '21-5917', KY: '523.100', LA: '14:126.1', ME: '17A-456', MD: '9-501',
    MA: '269-13A', MI: '750.411a', MN: '609.506', MS: '97-9-125', MO: '575.080',
    MT: '45-7-205', NE: '28-907', NV: '207.280', NH: '641:3', NJ: '2C:28-3',
    NM: '30-22-5', NY: '240.50', NC: '14-225', ND: '12.1-11-03', OH: '2921.13',
    OK: '21-543', OR: '162.375', PA: '18-4906', RI: '11-32-3', SC: '16-17-725',
    SD: '22-11-13', TN: '39-16-502', TX: '37.08', UT: '76-8-506', VT: '13-1754',
    VA: '18.2-461', WA: '9A.76.175', WV: '61-5-17a', WI: '946.41', WY: '6-5-303',
    DC: '22-721', PR: '34-4102', VI: '5-3102', GU: '8-80.20', AS: '46.0702', MP: '6-3102'
  },
  'harassment': {
    AL: '13A-11-8', AK: '11.61.120', AZ: '13-2921', AR: '5-71-208', CA: '646.9',
    CO: '18-9-111', CT: '53a-183', DE: '11-1311A', FL: '784.048', GA: '16-5-90',
    HI: '711-1106', ID: '18-7905', IL: '720-5/26.5-2', IN: '35-45-2-2', IA: '708.7',
    KS: '21-5427', KY: '525.070', LA: '14:40.2', ME: '17A-506A', MD: '3-803',
    MA: '265-43A', MI: '750.411h', MN: '609.749', MS: '97-3-107', MO: '565.090',
    MT: '45-5-220', NE: '28-311.02', NV: '200.571', NH: '644:4', NJ: '2C:33-4',
    NM: '30-3A-2', NY: '240.26', NC: '14-277.3A', ND: '12.1-17-07.1', OH: '2903.211',
    OK: '21-1173', OR: '166.065', PA: '18-2709', RI: '11-59-2', SC: '16-3-1700',
    SD: '22-19A-1', TN: '39-17-308', TX: '42.07', UT: '76-5-106', VT: '13-1061',
    VA: '18.2-152.7:1', WA: '9A.46.020', WV: '61-2-9a', WI: '947.013', WY: '6-2-506',
    DC: '22-3133', PR: '34-4103', VI: '5-3103', GU: '8-80.30', AS: '46.0703', MP: '6-3103'
  },
  'contempt-of-court': {
    AL: '12-1-8', AK: '09.50.010', AZ: '12-861', AR: '16-10-108', CA: '166',
    CO: '18-8-707', CT: '51-33a', DE: '11-1271', FL: '38.22', GA: '15-1-4',
    HI: '710-1077', ID: '7-601', IL: '720-5/32-1', IN: '34-47-3-6', IA: '665.2',
    KS: '20-1204a', KY: '432.264', LA: '14:130', ME: '14-254', MD: '1-202',
    MA: '268-1', MI: '600.1715', MN: '588.20', MS: '9-1-17', MO: '476.110',
    MT: '3-1-501', NE: '25-2122', NV: '22.010', NH: '514:8', NJ: '2C:29-9',
    NM: '34-1-2', NY: '215.50', NC: '5A-11', ND: '27-10-01.1', OH: '2705.02',
    OK: '21-565', OR: '33.015', PA: '42-4132', RI: '12-1-9', SC: '14-5-320',
    SD: '15-25-1', TN: '29-9-102', TX: '21.002', UT: '78B-6-301', VT: '12-122',
    VA: '18.2-456', WA: '7.21.010', WV: '61-5-26', WI: '785.01', WY: '1-21-101',
    DC: '11-944', PR: '34-4202', VI: '5-3202', GU: '8-82.20', AS: '46.0502', MP: '6-3202'
  },
  'bad-checks': {
    AL: '13A-9-13.1', AK: '11.46.280', AZ: '13-1807', AR: '5-37-302', CA: '476a',
    CO: '18-5-205', CT: '53a-128', DE: '11-900', FL: '832.05', GA: '16-9-20',
    HI: '708-858', ID: '18-3106', IL: '720-5/17-1', IN: '35-43-5-5', IA: '714.1',
    KS: '21-5821', KY: '514.040', LA: '14:71', ME: '17A-708', MD: '8-103',
    MA: '266-37', MI: '750.131', MN: '609.535', MS: '97-19-55', MO: '570.120',
    MT: '45-6-316', NE: '28-611', NV: '205.130', NH: '638:4', NJ: '2C:21-5',
    NM: '30-36-4', NY: '190.05', NC: '14-107', ND: '06-09-10', OH: '2913.11',
    OK: '21-1541', OR: '165.065', PA: '18-4105', RI: '6-13.1-1', SC: '34-11-60',
    SD: '22-41-1', TN: '39-14-121', TX: '32.41', UT: '76-6-505', VT: '13-2022',
    VA: '18.2-181', WA: '9A.56.060', WV: '61-3-39', WI: '943.24', WY: '6-3-702',
    DC: '22-1510', PR: '34-4303', VI: '5-3303', GU: '8-83.30', AS: '46.0603', MP: '6-3503'
  },
  'solicitation': {
    AL: '13A-12-121', AK: '11.66.100', AZ: '13-3214', AR: '5-70-102', CA: '647b',
    CO: '18-7-201', CT: '53a-82', DE: '11-1342', FL: '796.07', GA: '16-6-9',
    HI: '712-1200', ID: '18-5613', IL: '720-5/11-14.1', IN: '35-45-4-2', IA: '725.1',
    KS: '21-6419', KY: '529.020', LA: '14:82', ME: '17A-853', MD: '11-306',
    MA: '272-53A', MI: '750.448', MN: '609.324', MS: '97-29-49', MO: '567.020',
    MT: '45-5-601', NE: '28-801', NV: '201.354', NH: '645:2', NJ: '2C:34-1',
    NM: '30-9-2', NY: '230.00', NC: '14-204', ND: '12.1-29-06', OH: '2907.25',
    OK: '21-1029', OR: '167.007', PA: '18-5902', RI: '11-34-8', SC: '16-15-90',
    SD: '22-23-1', TN: '39-13-513', TX: '43.02', UT: '76-10-1302', VT: '13-2632',
    VA: '18.2-346', WA: '9A.88.030', WV: '61-8-5', WI: '944.30', WY: '6-4-101',
    DC: '22-2701', PR: '34-4304', VI: '5-3304', GU: '8-83.40', AS: '46.0604', MP: '6-3504'
  },
  'driving-without-insurance': {
    AL: '32-7A-16', AK: '28.22.011', AZ: '28-4135', AR: '27-22-104', CA: '16029',
    CO: '42-4-1409', CT: '14-213b', DE: '21-2118', FL: '316.646', GA: '40-6-10',
    HI: '431:10C-117', ID: '49-1229', IL: '625-5/3-707', IN: '9-25-8-2', IA: '321A.32A',
    KS: '40-3104', KY: '304.99-060', LA: '32:863', ME: '29A-1601', MD: '17-107',
    MA: '90-34J', MI: '500.3102', MN: '169.791', MS: '63-15-4', MO: '303.025',
    MT: '61-6-301', NE: '60-3.304', NV: '485.187', NH: '264:15', NJ: '39:6B-2',
    NM: '66-5-205', NY: '319', NC: '20-313', ND: '39-16.1-09', OH: '4509.101',
    OK: '47-7-606', OR: '806.010', PA: '75-1786', RI: '31-47-9', SC: '56-10-520',
    SD: '32-35-113', TN: '55-12-139', TX: '601.191', UT: '41-12a-302', VT: '23-800',
    VA: '46.2-707', WA: '46.30.020', WV: '17D-2A-3', WI: '344.62', WY: '31-4-103',
    DC: '31-2413', PR: '34-4305', VI: '5-3305', GU: '8-83.50', AS: '46.0605', MP: '6-3505'
  }
};

const chargeTemplates: ChargeTemplate[] = [
  {
    name: 'Failure to Appear',
    idSuffix: 'failure-to-appear',
    category: 'misdemeanor',
    description: (jur) => `Willful failure to appear in court as required after being released on bail or personal recognizance under ${jur} law`,
    maxPenalty: 'Up to 1 year jail, bail revocation, additional fines, and bench warrant',
    commonDefenses: ['Lack of proper notice of court date', 'Medical emergency or hospitalization', 'Transportation failure beyond control', 'Incorrect court date information', 'Natural disaster or unavoidable circumstances'],
    evidenceToGather: ['Proof of notification or lack thereof', 'Medical records showing emergency', 'Transportation records', 'Communication with attorney about court dates', 'Calendar or scheduling evidence'],
    specificRights: ['Right to explain reason for absence', 'Right to attorney at hearing', 'Right to present mitigating circumstances', 'Right to bail reconsideration'],
    urgentActions: ['Turn yourself in to the court clerk immediately', 'Contact your attorney about the missed date', 'Bring documentation explaining the absence', 'Do not wait - a bench warrant may be issued'],
    getCode: (jur) => stateStatutes['failure-to-appear'][jur] || 'FTA-001'
  },
  {
    name: 'Probation Violation',
    idSuffix: 'probation-violation',
    category: 'misdemeanor',
    description: (jur) => `Violation of conditions of probation including missed check-ins, failed drug tests, new arrests, or other non-compliance under ${jur} law`,
    maxPenalty: 'Revocation of probation, imposition of original suspended sentence, up to 1 year jail',
    commonDefenses: ['Substantial compliance with probation terms', 'Technical violation vs. willful violation', 'Inability to comply due to circumstances beyond control', 'Incorrect reporting by probation officer', 'Changed circumstances making compliance impossible'],
    evidenceToGather: ['Probation records and terms', 'Check-in records', 'Employment verification', 'Drug test results', 'Communication with probation officer'],
    specificRights: ['Right to a revocation hearing', 'Right to attorney at hearing', 'Right to present witnesses', 'Right to challenge evidence', 'Right to written findings'],
    urgentActions: ['Contact your probation officer immediately', 'Contact your attorney before the hearing', 'Gather evidence of compliance efforts', 'Do not miss the revocation hearing'],
    getCode: (jur) => stateStatutes['probation-violation'][jur] || 'PROB-001'
  },
  {
    name: 'Resisting Arrest / Obstruction',
    idSuffix: 'resisting-arrest',
    category: 'misdemeanor',
    description: (jur) => `Physically resisting, obstructing, or interfering with a law enforcement officer performing official duties under ${jur} law`,
    maxPenalty: 'Up to 1 year jail and/or $1,000-$5,000 fine',
    commonDefenses: ['Unlawful arrest by officer', 'Excessive force by officer', 'Lack of knowledge person was an officer', 'Passive non-compliance vs. active resistance', 'Self-defense against excessive force', 'First Amendment protected activity'],
    evidenceToGather: ['Body camera footage', 'Witness statements', 'Medical records of injuries', 'Officer disciplinary records', 'Cell phone video recordings', 'Dispatch records'],
    specificRights: ['Right to remain silent during arrest', 'Right to know the charge', 'Right to not be subjected to excessive force', 'Right to attorney', 'Right to file complaint against officer'],
    urgentActions: ['Do not physically resist further', 'State clearly you are not resisting', 'Ask for badge number and officer name', 'Contact attorney immediately after arrest', 'Document any injuries with photos'],
    getCode: (jur) => stateStatutes['resisting-arrest'][jur] || 'RESIST-001'
  },
  {
    name: 'Violation of Protective Order',
    idSuffix: 'protective-order-violation',
    category: 'misdemeanor',
    description: (jur) => `Knowingly violating a domestic violence protective order, restraining order, or no-contact order issued by a court under ${jur} law`,
    maxPenalty: 'Up to 1 year jail, additional protective orders, mandatory counseling, and fines',
    commonDefenses: ['Lack of knowledge of the order', 'Order was not properly served', 'Contact was initiated by the protected party', 'Accidental or unintentional contact', 'Order had expired or been modified'],
    evidenceToGather: ['Copy of the protective order', 'Proof of service or lack thereof', 'Communication records (texts, calls, emails)', 'GPS or location data', 'Witness statements about contact circumstances'],
    specificRights: ['Right to challenge validity of underlying order', 'Right to attorney', 'Right to hearing before sanctions', 'Right to present evidence of compliance'],
    urgentActions: ['Cease all contact with protected party immediately', 'Contact attorney immediately', 'Review exact terms of the order', 'Document any contact initiated by the other party', 'Stay away from prohibited locations'],
    getCode: (jur) => stateStatutes['protective-order-violation'][jur] || 'PO-001'
  },
  {
    name: 'Open Container Violation',
    idSuffix: 'open-container',
    category: 'misdemeanor',
    description: (jur) => `Possessing an open container of alcohol in a motor vehicle or in a public area where prohibited under ${jur} law`,
    maxPenalty: 'Up to $500 fine, possible 30 days jail in some jurisdictions',
    commonDefenses: ['Container was sealed or unopened', 'Container was in trunk or inaccessible area', 'Vehicle was parked and not in operation', 'Designated open container zone', 'Container belonged to a passenger'],
    evidenceToGather: ['Photos of container and location', 'Vehicle layout showing where container was found', 'Receipts showing purchase time', 'Witness statements', 'Local ordinance details'],
    specificRights: ['Right to challenge the stop', 'Right to refuse vehicle search without warrant', 'Right to attorney', 'Right to trial'],
    urgentActions: ['Do not pour out or destroy the container during a stop', 'Cooperate with officer but exercise your rights', 'Note the exact location of the container', 'Contact attorney if cited'],
    getCode: (jur) => stateStatutes['open-container'][jur] || 'OC-001'
  },
  {
    name: 'Minor in Possession of Alcohol',
    idSuffix: 'minor-in-possession',
    category: 'misdemeanor',
    description: (jur) => `A person under 21 years of age possessing, consuming, or purchasing alcoholic beverages under ${jur} law`,
    maxPenalty: 'Up to $500 fine, community service, alcohol education program, license suspension',
    commonDefenses: ['Lack of knowledge alcohol was present', 'Religious ceremony exception', 'Parental consent in private residence', 'Medical emergency / Good Samaritan exception', 'Constructive possession challenge'],
    evidenceToGather: ['Age verification documents', 'Photos of the location and circumstances', 'Witness statements', 'Proof of parental presence or consent if applicable', 'Records of alcohol education completion'],
    specificRights: ['Right to attorney', 'Right to have parent or guardian present', 'Right to diversion program in many jurisdictions', 'Right to record expungement after completion'],
    urgentActions: ['Contact parent or guardian immediately', 'Do not make statements to police without attorney', 'Ask about diversion or first-offender programs', 'Inquire about record sealing upon completion'],
    getCode: (jur) => stateStatutes['minor-in-possession'][jur] || 'MIP-001'
  },
  {
    name: 'Providing False Information to Police',
    idSuffix: 'false-info-to-police',
    category: 'misdemeanor',
    description: (jur) => `Knowingly providing false identifying information, a false name, or false statements to a law enforcement officer during an investigation under ${jur} law`,
    maxPenalty: 'Up to 1 year jail and/or $1,000-$5,000 fine',
    commonDefenses: ['Information provided was accurate', 'Confusion or honest mistake about details', 'Coercion or duress', 'No intent to deceive', 'Exercise of right to remain silent vs. false statement'],
    evidenceToGather: ['Police report and officer statements', 'Recording of the interaction', 'Identification documents', 'Witness statements', 'Evidence of correct information'],
    specificRights: ['Right to remain silent (you may refuse to answer but cannot give false answers)', 'Right to attorney', 'Right to trial', 'Right to challenge officer testimony'],
    urgentActions: ['Stop providing any further information', 'Invoke your right to remain silent', 'Request an attorney', 'Do not attempt to correct the false information without attorney present'],
    getCode: (jur) => stateStatutes['false-info-to-police'][jur] || 'FALSE-001'
  },
  {
    name: 'Harassment / Stalking',
    idSuffix: 'harassment',
    category: 'misdemeanor',
    description: (jur) => `A pattern of conduct directed at a specific person that would cause a reasonable person to feel fear, intimidation, or substantial emotional distress under ${jur} law`,
    maxPenalty: 'Up to 1 year jail, restraining order, mandatory counseling, and fines up to $5,000',
    commonDefenses: ['Constitutionally protected speech or activity', 'Lack of intent to harass or threaten', 'Isolated incident rather than pattern', 'Legitimate purpose for contact', 'False allegations'],
    evidenceToGather: ['Communication records (texts, emails, social media)', 'Witness statements', 'Surveillance footage', 'GPS or location data', 'Prior relationship documentation', 'Records of reported incidents'],
    specificRights: ['Right to attorney', 'Right to challenge protective orders', 'Right to present evidence', 'First Amendment protections for lawful speech', 'Right to trial by jury'],
    urgentActions: ['Cease all contact with the alleged victim immediately', 'Contact an attorney', 'Preserve all communications that show context', 'Do not delete any messages or social media posts', 'Comply with any temporary orders'],
    getCode: (jur) => stateStatutes['harassment'][jur] || 'HARASS-001'
  },
  {
    name: 'Contempt of Court',
    idSuffix: 'contempt-of-court',
    category: 'misdemeanor',
    description: (jur) => `Willful disobedience of a court order, disrespectful behavior in court, or failure to comply with court directives under ${jur} law`,
    maxPenalty: 'Up to 6 months jail and/or $500-$1,000 fine per violation',
    commonDefenses: ['Inability to comply with court order', 'Ambiguity in the court order', 'Lack of knowledge of the order', 'Good faith effort to comply', 'Order was unconstitutional or invalid'],
    evidenceToGather: ['Copy of the court order', 'Evidence of compliance efforts', 'Financial records showing inability to pay', 'Communication with court or opposing counsel', 'Documentation of circumstances preventing compliance'],
    specificRights: ['Right to a hearing before being held in contempt', 'Right to attorney', 'Right to purge the contempt', 'Right to appeal', 'Right to present evidence of compliance'],
    urgentActions: ['Comply with the court order immediately if possible', 'Contact your attorney about the contempt finding', 'Gather evidence of any compliance efforts', 'Appear at all scheduled hearings', 'File a motion to modify if compliance is impossible'],
    getCode: (jur) => stateStatutes['contempt-of-court'][jur] || 'CONTEMPT-001'
  },
  {
    name: 'Writing Bad Checks / Worthless Checks',
    idSuffix: 'bad-checks',
    category: 'misdemeanor',
    description: (jur) => `Knowingly writing or passing a check with insufficient funds or on a closed account under ${jur} law`,
    maxPenalty: 'Up to 1 year jail, restitution, triple damages in civil action, and fines',
    commonDefenses: ['Honest belief funds were available', 'Bank error caused insufficient funds', 'Post-dated check with agreement', 'Check was stolen or forged', 'Restitution already made'],
    evidenceToGather: ['Bank statements showing account balance', 'Copies of the check(s)', 'Communication with the payee', 'Evidence of deposit timing', 'Records of any restitution payments'],
    specificRights: ['Right to attorney', 'Right to present evidence of intent to pay', 'Right to make restitution before prosecution in many states', 'Right to trial'],
    urgentActions: ['Make restitution immediately if possible - many states drop charges if paid', 'Contact the bank about the account status', 'Contact an attorney', 'Respond to any demand letters within the required timeframe'],
    getCode: (jur) => stateStatutes['bad-checks'][jur] || 'CHECK-001'
  },
  {
    name: 'Solicitation / Prostitution',
    idSuffix: 'solicitation',
    category: 'misdemeanor',
    description: (jur) => `Offering, agreeing to, or engaging in sexual conduct for compensation under ${jur} law`,
    maxPenalty: 'Up to 1 year jail and/or $1,000-$5,000 fine, mandatory STD testing, community service',
    commonDefenses: ['Entrapment by law enforcement', 'No agreement or offer was made', 'Misunderstanding of conversation', 'Lack of intent', 'Violation of constitutional rights during sting operation'],
    evidenceToGather: ['Communication records', 'Surveillance footage', 'Officer body camera footage', 'Witness statements', 'Financial transaction records', 'Sting operation procedures'],
    specificRights: ['Right to attorney', 'Right to review sting operation evidence', 'Right to challenge entrapment', 'Right to diversion programs in many jurisdictions', 'Right to confidentiality of records'],
    urgentActions: ['Do not make any statements to police', 'Contact an attorney immediately', 'Ask about diversion or intervention programs', 'Do not contact co-defendants or witnesses'],
    getCode: (jur) => stateStatutes['solicitation'][jur] || 'SOLIC-001'
  },
  {
    name: 'Driving Without Insurance',
    idSuffix: 'driving-without-insurance',
    category: 'misdemeanor',
    description: (jur) => `Operating a motor vehicle on public roads without the required minimum liability insurance coverage under ${jur} law`,
    maxPenalty: 'Up to $1,000 fine, license suspension, vehicle impoundment, SR-22 requirement',
    commonDefenses: ['Insurance was active but card not available', 'Recently purchased insurance (grace period)', 'Vehicle was not being operated on public roads', 'Employer was responsible for vehicle insurance', 'Lapse was due to administrative error by insurer'],
    evidenceToGather: ['Insurance policy documents', 'Payment records showing insurance premiums', 'Communication with insurance company', 'Vehicle registration', 'Proof of subsequent insurance purchase'],
    specificRights: ['Right to present proof of insurance at court', 'Right to dismissal if insurance was valid at time of stop', 'Right to attorney', 'Right to contest vehicle impoundment'],
    urgentActions: ['Obtain insurance immediately', 'Bring proof of insurance to court', 'Contact DMV about license status', 'Check if your state allows dismissal with proof of current insurance'],
    getCode: (jur) => stateStatutes['driving-without-insurance'][jur] || 'NOINS-001'
  }
];

function generateCharges(): string {
  const charges: string[] = [];

  for (const jur of jurisdictions) {
    for (const template of chargeTemplates) {
      const id = `${jur.toLowerCase()}-${template.idSuffix}`;
      const code = template.getCode(jur);
      const charge = `  {
    id: '${id}',
    name: '${template.name}',
    code: '${code}',
    jurisdiction: '${jur}',
    category: '${template.category}',
    description: '${template.description(jur).replace(/'/g, "\\'")}',
    maxPenalty: '${template.maxPenalty.replace(/'/g, "\\'")}',
    commonDefenses: [${template.commonDefenses.map(d => `'${d.replace(/'/g, "\\'")}'`).join(', ')}],
    evidenceToGather: [${template.evidenceToGather.map(e => `'${e.replace(/'/g, "\\'")}'`).join(', ')}],
    specificRights: [${template.specificRights.map(r => `'${r.replace(/'/g, "\\'")}'`).join(', ')}],
    urgentActions: [${template.urgentActions.map(a => `'${a.replace(/'/g, "\\'")}'`).join(', ')}]
  }`;
      charges.push(charge);
    }
  }

  return charges.join(',\n');
}

const filePath = 'shared/criminal-charges.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const closingBracket = content.lastIndexOf('];');
if (closingBracket === -1) {
  console.error('Could not find closing bracket of criminalCharges array');
  process.exit(1);
}

const before = content.substring(0, closingBracket);
const after = content.substring(closingBracket);

const newContent = before + ',\n' + generateCharges() + '\n' + after;

fs.writeFileSync(filePath, newContent, 'utf-8');

console.log(`Added ${jurisdictions.length * chargeTemplates.length} new charges (${chargeTemplates.length} types × ${jurisdictions.length} jurisdictions)`);
console.log('Charge types added:');
chargeTemplates.forEach(t => console.log(`  - ${t.name}`));
