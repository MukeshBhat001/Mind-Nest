/**
 * Pre-seeded demonstration data for Mind Nest
 * Includes guided audio meditations, wellness videos, psychoeducation articles,
 * mental health self-assessments, and preconfigured users.
 */
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string; // bcrypt hash
  role: 'guest' | 'member' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface IContent {
  _id: string;
  title: string;
  description: string;
  category: 'Sleep' | 'Focus' | 'Anxiety Relief' | 'Mindfulness';
  type: 'audio' | 'video' | 'article';
  mediaUrl?: string; // audio or video URL
  thumbnail: string;
  duration?: number; // duration in minutes or seconds
  readTime?: string; // for articles e.g., "4 min read"
  isPreview: boolean; // available to non-registered guests
  author: string;
  contentBody?: string; // for articles or guided meditation transcript
  createdAt: string;
}

export interface IQuizQuestion {
  id: string;
  prompt: string;
  options: {
    label: string;
    points: number; // 0 to 3 or 4
  }[];
}

export interface IQuizTemplate {
  _id: string;
  title: string;
  code: string; // e.g. "STRESS_PSS" or "ANXIETY_GAD"
  description: string;
  category: string;
  isPreview: boolean;
  questions: IQuizQuestion[];
  interpretations: {
    minScore: number;
    maxScore: number;
    level: string; // "Low Stress", "Moderate Stress", "High Stress"
    description: string;
    recommendedCategory: 'Sleep' | 'Focus' | 'Anxiety Relief' | 'Mindfulness';
  }[];
}

export interface IQuizResult {
  _id: string;
  userId: string;
  userEmail: string;
  quizId: string;
  quizTitle: string;
  totalScore: number;
  maxScore: number;
  stressLevel: string;
  recommendations: string[];
  recommendedCategory: string;
  date: string;
}

export interface ISessionLog {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: 'audio' | 'video' | 'article' | 'breathing';
  completedAt: string;
  durationMinutes: number;
}

export interface IProgress {
  _id: string;
  userId: string;
  favorites: string[]; // Content IDs
  completedLessons: string[];
  sessionLogs: ISessionLog[];
  currentStreak: number;
  lastActiveDate: string;
}

// Generate seeded password hashes
const salt = bcrypt.genSaltSync(10);
export const SEED_ADMIN_HASH = bcrypt.hashSync('admin123', salt);
export const SEED_MEMBER_HASH = bcrypt.hashSync('member123', salt);

export const initialUsers: IUser[] = [
  {
    _id: 'usr_admin_001',
    name: 'Dr. Elena Vance (Lead Clinical Admin)',
    email: 'admin@mindnest.org',
    password: SEED_ADMIN_HASH,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    bio: 'Lead mindfulness researcher and clinical administrator overseeing Mind Nest learning modules.',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    _id: 'usr_member_001',
    name: 'Maya Lin',
    email: 'member@mindnest.org',
    password: SEED_MEMBER_HASH,
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: 'University student exploring mindfulness for exam anxiety and restful sleep.',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

export const initialContents: IContent[] = [
  // --- Guided Audio Meditations ---
  {
    _id: 'cnt_audio_001',
    title: '5-Minute Ocean Breath for Acute Anxiety',
    description: 'A calming oceanic guided meditation designed to quickly downregulate your sympathetic nervous system when feeling overwhelmed.',
    category: 'Anxiety Relief',
    type: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rocks_loop.ogg',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    duration: 5,
    isPreview: true, // Free sample for guest
    author: 'Dr. Elena Vance',
    contentBody: `Welcome to this 5-minute Ocean Breath practice. Find an upright, relaxed posture. Soften your jaw, relax your shoulders away from your ears, and allow your hands to rest gently on your lap.

As you inhale through your nose, imagine a gentle wave cresting up onto warm sand. Feel your chest and belly expand with quiet ease. As you exhale through your mouth with a soft whispering sound, feel the wave recede back into the tranquil ocean depths.

Continue this rhythmic ocean breathing: 4 counts in, 4 counts out. Release any tension held in your forehead and eyebrows. You are safe in this present moment.`,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    _id: 'cnt_audio_002',
    title: 'Deep Body Scan for Restful Sleep',
    description: 'Systematic progressive relaxation guiding physical awareness from the crown of your head to the tips of your toes for deep, restorative rest.',
    category: 'Sleep',
    type: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/weather/light_rain_on_leaves.ogg',
    thumbnail: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80',
    duration: 12,
    isPreview: true, // Free sample for guest
    author: 'Marcus Reed, M.Sc.',
    contentBody: `Lie down comfortably in your bed. Close your eyes and take three long, slow, soothing breaths. With each breath out, let your body sink half an inch deeper into your mattress.

Bring your gentle spotlight of attention to your feet and toes. Notice any warmth, coolness, or tingling, and invite them to release completely. Travel up through your calves, knees, and thighs. Unclench your lower back. Let your belly soften like still water.

Whisper to yourself: 'I have done enough for today. It is safe to let go.'`,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    _id: 'cnt_audio_003',
    title: 'Laser Clarity: Single-Point Focus Meditation',
    description: 'Strengthen attentional stamina and conquer mental fatigue before academic study, coding, or writing sessions.',
    category: 'Focus',
    type: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/ambiences/humming_wind.ogg',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
    duration: 8,
    isPreview: false,
    author: 'Dr. Elena Vance',
    contentBody: `Sit straight with your spine tall yet unforced. Rest your eyes on a single focal point or keep your eyelids half-closed.

Anchor your attention at the rim of your nostrils. When thoughts of past tasks or future assignments drift by, acknowledge them without judgement, label them 'thinking', and return firmly to the physical sensation of cool air entering and warm air exiting.`,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    _id: 'cnt_audio_004',
    title: 'Loving-Kindness (Metta) for Self-Compassion',
    description: 'Cultivate warmth and unconditional self-kindness, replacing inner harshness with genuine patience and emotional resilience.',
    category: 'Mindfulness',
    type: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/weather/wind_breeze.ogg',
    thumbnail: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=600&q=80',
    duration: 10,
    isPreview: false,
    author: 'Aria Montgomery',
    contentBody: `Place one hand over your heart center. Feel the natural, comforting warmth of your palm.

Silently repeat these three traditional intentions:
1. May I be safe and protected from inner and outer harm.
2. May I be peaceful and at ease in my body and mind.
3. May I live with kindness, acceptance, and lightness of heart.`,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },

  // --- Wellness Videos ---
  {
    _id: 'cnt_video_001',
    title: 'Gentle Neck & Shoulder Release for Desk Stress',
    description: 'A 6-minute guided somatic movement sequence targeting tension headaches, trapezius stiffness, and screen fatigue.',
    category: 'Anxiety Relief',
    type: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    duration: 6,
    isPreview: true, // Free sample for guest
    author: 'Soma Movement Collective',
    contentBody: 'Follow along with mindful somatic movements to unknot the neck, cervical spine, and trapezius muscles after prolonged study or desk work.',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    _id: 'cnt_video_002',
    title: 'Forest Bathing (Shinrin-yoku) Visual Meditation',
    description: 'Immerse your senses in emerald pine canopies and gentle sunlight filtered through cedar leaves to reset dopamine and lower cortisol.',
    category: 'Mindfulness',
    type: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    duration: 8,
    isPreview: false,
    author: 'Mind Nest Nature Lab',
    contentBody: 'Synchronize your breath with slow cinematic views of alpine streams and ancient moss-covered groves.',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },

  // --- Educational Psychoeducation Articles ---
  {
    _id: 'cnt_article_001',
    title: 'The Polyvagal Theory: Why Slow Exhalations Reset Your Brain',
    description: 'Discover how the vagus nerve regulates heart rate variability (HRV) and how simple breath ratios signal safety to your amygdala.',
    category: 'Anxiety Relief',
    type: 'article',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    readTime: '4 min read',
    isPreview: true, // Free sample for guest
    author: 'Dr. Elena Vance',
    contentBody: `When human beings experience stress—whether from academic deadlines, interpersonal tension, or sensory overload—our autonomic nervous system instantly shifts into sympathetic dominance (the famous 'fight-or-flight' branch).

Under this state, your heart rate accelerates, breathing becomes shallow in the upper chest, and peripheral blood vessels constrict. While this response is evolutionarily designed to escape physical predators, modern cognitive stressors rarely require physical combat.

### The Role of the Vagus Nerve
The vagus nerve is the 10th cranial nerve and the longest nerve in the autonomic nervous system, traveling from the brainstem all the way to the heart, lungs, and gut. When you prolong your exhale (for example, in a 4-second inhale followed by a 7-second exhale), pulmonary stretch receptors stimulate the vagus nerve to release acetylcholine.

Acetylcholine acts as a physiological 'brake' on your heart's sinoatrial node, triggering an immediate drop in resting beats per minute and an increase in Heart Rate Variability (HRV). Higher HRV is clinically correlated with superior emotional regulation, cognitive flexibility, and stress resilience.

### Practical Practice:
- Practice **Box Breathing** (4 seconds in, 4 hold, 4 out, 4 hold) during acute task anxiety.
- Practice **4-7-8 Breathing** before sleep to quiet racing nocturnal thoughts.`,
    createdAt: new Date(Date.now() - 16 * 86400000).toISOString(),
  },
  {
    _id: 'cnt_article_002',
    title: 'Sleep Hygiene Protocols for University Students and Knowledge Workers',
    description: 'Evidence-based protocols to optimize circadian entrainment, adenosine accumulation, and rapid eye movement (REM) sleep architecture.',
    category: 'Sleep',
    type: 'article',
    thumbnail: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80',
    readTime: '5 min read',
    isPreview: false,
    author: 'Marcus Reed, M.Sc.',
    contentBody: `Quality sleep is not a passive state of inactivity; it is an active, biochemically intricate period where the brain consolidates short-term memory into long-term schemas, clears metabolic waste products via the glymphatic system, and rebalances neurochemical transmitters.

### The Circadian Foundation
Your master biological clock—the suprachiasmatic nucleus (SCN)—relies on environmental light cues to modulate melatonin synthesis:
1. **Morning Photons**: View natural sunlight within 30-60 minutes of waking (10-15 minutes on clear days, 20-30 on overcast days). This triggers a healthy cortisol surge and starts an internal 14-hour timer for nocturnal melatonin release.
2. **Evening Dimming**: Avoid overhead halogen and fluorescent lights 2 hours prior to bed. Blue photons suppress melatonin synthesis by over 60%.
3. **Thermal Regulation**: Core body temperature must decrease by approximately 1°C (2-3°F) to initiate restful sleep. Keep your bedroom environment cool (~18-20°C or 65-68°F).`,
    createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
  },
  {
    _id: 'cnt_article_003',
    title: 'The Pomodoro & Focus Cycle: Neurobiology of Deep Work',
    description: 'Learn how to synchronize cognitive work blocks with ultradian rhythms for peak academic performance without burnout.',
    category: 'Focus',
    type: 'article',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    readTime: '3 min read',
    isPreview: true, // Free sample for guest
    author: 'Aria Montgomery',
    contentBody: `Human concentration is not a monolithic battery that depletes evenly. Rather, human alertness follows 90-minute ultradian cycles governed by cyclic oscillations of acetylcholine and dopamine.

Attempting to force continuous 4-hour uninterrupted study marathons typically leads to the 'illusion of competence'—where you re-read material passively without synaptic retention.

### Structuring Your Mindful Study Ritual:
- **Set a Tangible Target**: Define one atomic outcome for the next 25-50 minutes.
- **Remove Friction**: Put mobile devices in another room or turn on airplane mode.
- **Take Real Micro-Breaks**: Stand up, look out the window into panoramic vision (optic flow resets mental vigilance), and hydrate. Avoid checking social feeds during breaks, which refills mental bandwidth with high-stimulation noise.`,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

export const initialQuizzes: IQuizTemplate[] = [
  {
    _id: 'quiz_pss_001',
    title: 'Perceived Stress & Mental Vitality Scale (PSS-4)',
    code: 'STRESS_PSS',
    description: 'A scientifically informed self-assessment measuring feelings of unpredictability, uncontrollability, and overload over the past month.',
    category: 'Stress & Overwhelm',
    isPreview: true, // Available to guests
    questions: [
      {
        id: 'q1',
        prompt: 'In the last month, how often have you felt that you were unable to control the important things in your life?',
        options: [
          { label: 'Never', points: 0 },
          { label: 'Almost Never', points: 1 },
          { label: 'Sometimes', points: 2 },
          { label: 'Fairly Often', points: 3 },
          { label: 'Very Often', points: 4 },
        ],
      },
      {
        id: 'q2',
        prompt: 'In the last month, how often have you felt confident about your ability to handle your personal problems?',
        options: [
          { label: 'Very Often (Positive coping)', points: 0 },
          { label: 'Fairly Often', points: 1 },
          { label: 'Sometimes', points: 2 },
          { label: 'Almost Never', points: 3 },
          { label: 'Never (High strain)', points: 4 },
        ],
      },
      {
        id: 'q3',
        prompt: 'In the last month, how often have you felt that things were going your way?',
        options: [
          { label: 'Very Often', points: 0 },
          { label: 'Fairly Often', points: 1 },
          { label: 'Sometimes', points: 2 },
          { label: 'Almost Never', points: 3 },
          { label: 'Never', points: 4 },
        ],
      },
      {
        id: 'q4',
        prompt: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
        options: [
          { label: 'Never', points: 0 },
          { label: 'Almost Never', points: 1 },
          { label: 'Sometimes', points: 2 },
          { label: 'Fairly Often', points: 3 },
          { label: 'Very Often', points: 4 },
        ],
      },
    ],
    interpretations: [
      {
        minScore: 0,
        maxScore: 5,
        level: 'Low Stress / Resilient Balance',
        description: 'You are currently experiencing healthy cognitive stability and effective coping mechanisms. Maintaining regular mindfulness and restorative sleep will help preserve your well-being.',
        recommendedCategory: 'Mindfulness',
      },
      {
        minScore: 6,
        maxScore: 10,
        level: 'Moderate Stress / Emerging Overwhelm',
        description: 'You are experiencing elevated demands on your mental reserves. Incorporating daily 5-minute ocean breathing and periodic cognitive de-cluttering will prevent escalation.',
        recommendedCategory: 'Focus',
      },
      {
        minScore: 11,
        maxScore: 16,
        level: 'High Stress / Acute Strain',
        description: 'Your nervous system is operating under sustained sympathetic activation. We strongly recommend daily parasympathetic breathing tools (such as 4-7-8 and Ocean Breath) and reducing non-essential commitments.',
        recommendedCategory: 'Anxiety Relief',
      },
    ],
  },
  {
    _id: 'quiz_gad_002',
    title: 'Emotional Regulation & Anxiety Check (GAD-Inspired)',
    code: 'ANXIETY_GAD',
    description: 'Evaluate physical restlessness, anticipatory worry, and nervousness during academic or daily challenges.',
    category: 'Anxiety & Restlessness',
    isPreview: false, // For registered members
    questions: [
      {
        id: 'a1',
        prompt: 'Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?',
        options: [
          { label: 'Not at all', points: 0 },
          { label: 'Several days', points: 1 },
          { label: 'More than half the days', points: 2 },
          { label: 'Nearly every day', points: 3 },
        ],
      },
      {
        id: 'a2',
        prompt: 'Over the last 2 weeks, how often have you not been able to stop or control worrying?',
        options: [
          { label: 'Not at all', points: 0 },
          { label: 'Several days', points: 1 },
          { label: 'More than half the days', points: 2 },
          { label: 'Nearly every day', points: 3 },
        ],
      },
      {
        id: 'a3',
        prompt: 'Over the last 2 weeks, how often have you had trouble relaxing your body or jaw?',
        options: [
          { label: 'Not at all', points: 0 },
          { label: 'Several days', points: 1 },
          { label: 'More than half the days', points: 2 },
          { label: 'Nearly every day', points: 3 },
        ],
      },
      {
        id: 'a4',
        prompt: 'Over the last 2 weeks, how often have you been so restless that it is hard to sit still?',
        options: [
          { label: 'Not at all', points: 0 },
          { label: 'Several days', points: 1 },
          { label: 'More than half the days', points: 2 },
          { label: 'Nearly every day', points: 3 },
        ],
      },
    ],
    interpretations: [
      {
        minScore: 0,
        maxScore: 3,
        level: 'Minimal Anxiety',
        description: 'You are maintaining a grounded emotional baseline. Continue nurturing your peace with guided mindfulness.',
        recommendedCategory: 'Mindfulness',
      },
      {
        minScore: 4,
        maxScore: 7,
        level: 'Mild Anxiety',
        description: 'Occasional worry is creeping into your routine. Guided physical relaxation and rhythmic breathing will help reset your body.',
        recommendedCategory: 'Anxiety Relief',
      },
      {
        minScore: 8,
        maxScore: 12,
        level: 'Moderate to High Anxiety',
        description: 'Your physical and mental tension are noticeably elevated. Prioritize somatic rest, evening sleep hygiene, and consult university health support if distress persists.',
        recommendedCategory: 'Sleep',
      },
    ],
  },
];

export const initialProgress: IProgress[] = [
  {
    _id: 'prg_member_001',
    userId: 'usr_member_001',
    favorites: ['cnt_audio_001', 'cnt_audio_002'],
    completedLessons: ['cnt_audio_001'],
    sessionLogs: [
      {
        id: 'log_01',
        contentId: 'cnt_audio_001',
        contentTitle: '5-Minute Ocean Breath for Acute Anxiety',
        contentType: 'audio',
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        durationMinutes: 5,
      },
      {
        id: 'log_02',
        contentId: 'breath_exercise',
        contentTitle: 'Box Breathing 4-4-4-4 Practice',
        contentType: 'breathing',
        completedAt: new Date().toISOString(),
        durationMinutes: 4,
      },
    ],
    currentStreak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
];

export const initialQuizResults: IQuizResult[] = [
  {
    _id: 'qres_001',
    userId: 'usr_member_001',
    userEmail: 'member@mindnest.org',
    quizId: 'quiz_pss_001',
    quizTitle: 'Perceived Stress & Mental Vitality Scale (PSS-4)',
    totalScore: 7,
    maxScore: 16,
    stressLevel: 'Moderate Stress / Emerging Overwhelm',
    recommendations: [
      'Practice 5-minute Ocean Breath once daily',
      'Schedule dedicated 25-minute single-task focus blocks',
      'Ensure 8 hours of digital-free sleep hygiene',
    ],
    recommendedCategory: 'Focus',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];
