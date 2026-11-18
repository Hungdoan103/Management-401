export interface SlideMeta {
  /** section label shown in the top-left corner */
  section: string
  /** "1 OF 3" style position inside the section, if any */
  part?: string
  title: string
  /** ids that the up / down keys cycle through, in reading order */
  spot: string[]
}

export const SLIDES: SlideMeta[] = [
  {
    section: 'MGMT401',
    part: 'CONTEMPORARY MANAGEMENT AND LEADERSHIP',
    title: 'Strategy, Ethical Governance and Organisational Culture',
    spot: [],
  },
  {
    section: 'CASE OVERVIEW',
    part: '1 OF 1',
    title: 'Bunnings Group: Overview and Management Challenges',
    spot: ['s2-stores', 's2-employees', 's2-revenue', 's2-price', 's2-digital', 's2-supply', 's2-esg', 's2-culture'],
  },
  {
    section: 'STRATEGIC ANALYSIS',
    part: '1 OF 3',
    title: 'Competitive Strategy: Cost Leadership',
    spot: ['s3-p1', 's3-p2', 's3-p3', 's3-cost', 's3-corp', 's3-diff'],
  },
  {
    section: 'STRATEGIC ANALYSIS',
    part: '2 OF 3',
    title: 'Adapting to External Pressures and Omnichannel Retail',
    spot: ['s4-economic', 's4-digital', 's4-customer', 's4-sustain', 's4-omni'],
  },
  {
    section: 'STRATEGIC ANALYSIS',
    part: '3 OF 3',
    title: 'VRIO Advantage and Financial Performance',
    spot: ['s5-v', 's5-r', 's5-i', 's5-o', 's5-rev', 's5-earn', 's5-judge'],
  },
  {
    section: 'ETHICAL & SUSTAINABLE MANAGEMENT',
    part: '1 OF 3',
    title: 'Ethical Governance and Responsible Sourcing',
    spot: ['s6-ethics', 's6-fy25', 's6-sourcing', 's6-stake', 's6-fy24'],
  },
  {
    section: 'ETHICAL & SUSTAINABLE MANAGEMENT',
    part: '2 OF 3',
    title: 'Workplace Safety and Inclusive Culture',
    spot: ['s7-injury', 's7-indigenous', 's7-inclusive', 's7-wellbeing', 's7-capability'],
  },
  {
    section: 'ETHICAL & SUSTAINABLE MANAGEMENT',
    part: '3 OF 3',
    title: 'Environmental Sustainability and Community Contribution',
    spot: ['s8-emissions', 's8-waste', 's8-community', 's8-initiatives', 's8-frameworks', 's8-judge'],
  },
  {
    section: 'ORGANISATIONAL CULTURE',
    part: '1 OF 1',
    title: 'Organisational Culture Analysis (Schein Model)',
    spot: ['s9-artefacts', 's9-espoused', 's9-assumptions', 's9-values', 's9-challenges', 's9-judge', 's9-strengths'],
  },
  {
    section: 'STRATEGIC RECOMMENDATIONS',
    part: '1 OF 1',
    title: 'Long-Term Strategic Management Proposals',
    spot: ['s10-r1', 's10-r2', 's10-r3', 's10-r4', 's10-insight', 's10-kpi'],
  },
  {
    section: 'CONCLUSION',
    part: '1 OF 1',
    title: 'Strategic Conclusion and Management Lessons',
    spot: ['s11-key', 's11-c1', 's11-c2', 's11-c3', 's11-assess'],
  },
  {
    section: 'REFERENCES',
    part: '1 OF 1',
    title: 'References',
    spot: Array.from({ length: 11 }, (_, i) => `s12-r${i}`),
  },
  {
    section: 'Q & A',
    part: '1 OF 1',
    title: 'Thank You — Questions and Discussion',
    spot: ['s13-team'],
  },
]

export const pad2 = (n: number) => String(n).padStart(2, '0')
