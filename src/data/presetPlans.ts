import { WorkoutPlan } from '../types/workout';

export const STARTER_PLANS: WorkoutPlan[] = [
  {
    id: 'plan_hypertrophy_ppl',
    createdAt: new Date().toISOString(),
    title: 'Kinetic Push / Pull / Legs Hypertrophy',
    tagline: 'High-frequency hypertrophic protocol prioritizing mechanical tension & compound overload',
    goal: 'Hypertrophy & Muscle Building',
    fitnessLevel: 'Intermediate',
    weeklyFrequency: 4,
    sessionDuration: 60,
    equipment: 'Full Commercial Gym (Barbells, Cables, Machines)',
    scienceOverview:
      'Engineered around mechanical tension as the primary driver of myofibrillar hypertrophy. Uses a double-progression model (hit top of rep range before increasing load) across optimal length-tension curves with stable machine movements following heavy barbell anchors.',
    periodization: {
      progressionModel: 'Double progression: increase load by 2.5-5% once target reps are hit across all working sets with clean RPE 8.',
      rpeGuideline: 'Maintain RPE 7-8 on compound lifts; push isolation movements to RPE 9 (1 rep in reserve).',
      recoveryRecommendation: '48-72 hours between training the same muscle group. 7.5-8.5 hours quality sleep nightly.'
    },
    nutritionGuidance: {
      calorieStrategy: 'Slight caloric surplus of +250 to +350 kcal/day above maintenance for lean accrual.',
      proteinTargetGramsPerKg: 2.0,
      keyHabits: [
        'Distribute protein into 4-5 feedings with at least 3g leucine per bolus.',
        'Hydrate with 500ml water and electrolytes 45 minutes prior to workout session.',
        'Consume 30-50g fast-digesting carbohydrates within 60 minutes post-session.'
      ]
    },
    days: [
      {
        dayNumber: 1,
        dayName: 'Day 1: Upper Push (Chest, Front/Side Delts, Triceps)',
        targetMuscles: ['Chest', 'Anterior Deltoids', 'Lateral Deltoids', 'Triceps'],
        estimatedTimeMinutes: 55,
        warmup: [
          { name: 'Band Over-and-Backs', durationOrReps: '2 sets × 15 reps', cue: 'Keep ribs pinned down, open thoracic spine without hyperextending lower back.' },
          { name: 'Scapular Push-ups', durationOrReps: '2 sets × 12 reps', cue: 'Protract and retract shoulder blades with straight locked arms.' },
          { name: 'Light Dumbbell Y-T-W Raises', durationOrReps: '1 set × 10 reps each', cue: 'Activate lower trapezius and rotator cuff muscles.' }
        ],
        exercises: [
          {
            id: 'ex_barbell_bench',
            name: 'Barbell Incline Bench Press (30°)',
            targetMuscle: 'Upper Pectoralis Major',
            secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
            sets: 4,
            reps: '6-8',
            rpe: 'RPE 8',
            restSeconds: 150,
            tempo: '3-1-1-0',
            coachingCues: [
              'Retract and depress scapulae firmly into the bench pad.',
              'Lower bar in controlled 3-second descent touching upper sternum.',
              'Drive heels hard into the floor creating leg drive without lifting hips.'
            ],
            commonMistakes: [
              'Bouncing the bar off ribs.',
              'Flaring elbows out at 90 degrees which impinges the subacromial space.'
            ],
            substitutions: ['Heavy Dumbbell Incline Press', 'Incline Smith Machine Press']
          },
          {
            id: 'ex_weighted_dips',
            name: 'Chest Dips (Bodyweight or Weighted)',
            targetMuscle: 'Lower Pectoralis & Sternal Head',
            secondaryMuscles: ['Triceps', 'Anterior Deltoid'],
            sets: 3,
            reps: '8-10',
            rpe: 'RPE 8',
            restSeconds: 120,
            tempo: '2-0-1-0',
            coachingCues: [
              'Lean torso forward 30 degrees to bias sternal chest over triceps.',
              'Descend until shoulders are slightly below elbow plane if joint permits.'
            ],
            commonMistakes: ['Shrugging shoulders upward during the drive phase.'],
            substitutions: ['Converging Chest Press Machine', 'Decline Dumbbell Press']
          },
          {
            id: 'ex_cable_lateral_raise',
            name: 'Cable Lateral Raise (Behind the Back)',
            targetMuscle: 'Lateral Deltoids',
            secondaryMuscles: ['Upper Traps'],
            sets: 4,
            reps: '12-15',
            rpe: 'RPE 8.5',
            restSeconds: 75,
            tempo: '2-0-1-1',
            coachingCues: [
              'Set pulley at wrist height. Pull across body in the scapular plane.',
              'Pause for 1 second at the top contraction; control the eccentric stretch.'
            ],
            commonMistakes: ['Using momentum and torso swing instead of pure delt abduction.'],
            substitutions: ['Dumbbell Leaning Lateral Raise', 'Machine Lateral Raise']
          },
          {
            id: 'ex_overhead_cable_tricep',
            name: 'Cross-Body Cable Triceps Extension',
            targetMuscle: 'Triceps Long & Lateral Heads',
            secondaryMuscles: ['Triceps Medial Head'],
            sets: 3,
            reps: '10-12',
            rpe: 'RPE 9',
            restSeconds: 75,
            tempo: '3-0-1-1',
            coachingCues: [
              'Lock upper arm at 45 degrees relative to torso.',
              'Extend elbows fully and squeeze triceps at lockout.'
            ],
            commonMistakes: ['Letting elbows drift forward and back.'],
            substitutions: ['Overhead Rope Extension', 'Skull Crushers on Flat Bench']
          }
        ],
        cooldown: [
          { name: 'Doorway Pectoral Stretch', durationOrReps: '2 sets × 30s each', cue: 'Gentle passive stretch on pec minor without sharp shoulder sensation.' },
          { name: 'Overhead Triceps & Lat Stretch', durationOrReps: '2 sets × 30s', cue: 'Breathe deeply, expanding ribs.' }
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Day 2: Upper Pull (Lats, Upper Back, Rear Delts, Biceps)',
        targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Mid Traps', 'Biceps Brachii'],
        estimatedTimeMinutes: 55,
        warmup: [
          { name: 'Dead Hangs from Bar', durationOrReps: '2 sets × 25s', cue: 'Decompress spine, activate grip and shoulder stabilizers.' },
          { name: 'Cat-Cow Spinal Flexion', durationOrReps: '2 sets × 10 reps', cue: 'Articulate each spinal segment with synchronised diaphragmatic breathing.' },
          { name: 'Band Face Pulls', durationOrReps: '2 sets × 15 reps', cue: 'Retract scapula and externally rotate humerus.' }
        ],
        exercises: [
          {
            id: 'ex_chest_supported_row',
            name: 'Chest-Supported T-Bar / Neutral Dumbbell Row',
            targetMuscle: 'Mid-Back (Rhomboids & Mid Traps)',
            secondaryMuscles: ['Latissimus Dorsi', 'Brachialis'],
            sets: 4,
            reps: '8-10',
            rpe: 'RPE 8',
            restSeconds: 120,
            tempo: '2-1-1-0',
            coachingCues: [
              'Keep chest glued to support pad to eliminate lower back cheating.',
              'Initiate with scapular retraction before bending elbows.',
              'Squeeze shoulder blades together hard for 1 full second.'
            ],
            commonMistakes: ['Jerking head back and lifting chest off pad.'],
            substitutions: ['Chest-Supported Machine Row', 'Seated Cable Row with Wide Grip']
          },
          {
            id: 'ex_lat_pulldown_neutral',
            name: 'Neutral-Grip Lat Pulldown',
            targetMuscle: 'Latissimus Dorsi (Iliac / Lower fibers)',
            secondaryMuscles: ['Biceps Brachii', 'Teres Major'],
            sets: 4,
            reps: '10-12',
            rpe: 'RPE 8',
            restSeconds: 90,
            tempo: '3-0-1-0',
            coachingCues: [
              'Pull elbows down toward hip pockets rather than pulling bar to chest.',
              'Maintain slight 10-degree lean with neutral cervical spine.'
            ],
            commonMistakes: ['Leaning back 45 degrees turning the vertical pull into a sloppy row.'],
            substitutions: ['Weighted Neutral Pull-ups', 'Single-Arm Half-Kneeling Lat Pulldown']
          },
          {
            id: 'ex_incline_bicep_curl',
            name: 'Incline Dumbbell Curl (45° bench)',
            targetMuscle: 'Biceps Long Head (Peak & Stretch)',
            secondaryMuscles: ['Brachialis', 'Brachioradialis'],
            sets: 3,
            reps: '10-12',
            rpe: 'RPE 8.5',
            restSeconds: 75,
            tempo: '3-0-1-1',
            coachingCues: [
              'Allow elbows to hang naturally behind torso to maximize passive stretch on long head.',
              'Supinate wrists as you curl up, keeping elbows fixed in space.'
            ],
            commonMistakes: ['Swinging dumbbells forward and bringing elbows in front of torso.'],
            substitutions: ['Bayesian Cable Curl', 'Standing EZ-Bar Curl']
          }
        ],
        cooldown: [
          { name: 'Kneeling Lat Stretch on Bench', durationOrReps: '2 sets × 40s', cue: 'Drop chest between arms to stretch entire thoracolumbar fascia.' },
          { name: 'Thread-the-Needle Thoracic Rotation', durationOrReps: '1 set × 8 reps each', cue: 'Release tension through rhomboids and cervical spine.' }
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Day 3: Lower Body (Quads, Hamstrings, Glutes, Calves)',
        targetMuscles: ['Quadriceps', 'Hamstrings', 'Gluteus Maximus', 'Gastrocnemius'],
        estimatedTimeMinutes: 60,
        warmup: [
          { name: '90/90 Hip Mobility Flow', durationOrReps: '2 sets × 8 transitions', cue: 'Internal and external rotation of femoral head in acetabulum.' },
          { name: 'Bodyweight Cossack Squats', durationOrReps: '2 sets × 8 reps each side', cue: 'Open adductors and improve ankle dorsiflexion.' },
          { name: 'Glute Bridges with Mini-band', durationOrReps: '2 sets × 12 reps', cue: 'Fire glute medius and establish pelvic stability.' }
        ],
        exercises: [
          {
            id: 'ex_hack_squat',
            name: 'Machine Hack Squat / Pendulum Squat',
            targetMuscle: 'Quadriceps (Vastus Medialis & Lateralis)',
            secondaryMuscles: ['Gluteus Maximus', 'Adductors'],
            sets: 4,
            reps: '8-10',
            rpe: 'RPE 8.5',
            restSeconds: 150,
            tempo: '3-1-1-0',
            coachingCues: [
              'Place feet low on platform to achieve maximum knee flexion over toes.',
              'Sink into deep bottom position pausing 1 full second without bouncing.',
              'Drive through mid-foot keeping lower back pressed into back pad.'
            ],
            commonMistakes: ['Cutting depth short or allowing knees to cave inward (valgus collapse).'],
            substitutions: ['Barbell Front Squat', 'Smith Machine Squat', 'Goblet Squat']
          },
          {
            id: 'ex_romanian_deadlift',
            name: 'Dumbbell or Barbell Romanian Deadlift (RDL)',
            targetMuscle: 'Hamstrings & Gluteus Maximus',
            secondaryMuscles: ['Erector Spinae', 'Latissimus Dorsi'],
            sets: 4,
            reps: '8-10',
            rpe: 'RPE 8',
            restSeconds: 120,
            tempo: '3-1-1-0',
            coachingCues: [
              'Soften knees slightly, then push pelvis as far backward toward the wall as possible.',
              'Keep barbell/dumbbells skimming tight against shins.',
              'Stop descending when hips stop traveling backward (usually just below knees).'
            ],
            commonMistakes: ['Rounding lumbar spine or squatting down with excess knee bend.'],
            substitutions: ['Seated Leg Curl + 45° Back Extension', 'Trap Bar RDL']
          },
          {
            id: 'ex_walking_lunges',
            name: 'Deficit Reverse Lunges or Bulgarian Split Squats',
            targetMuscle: 'Glutes & Quads',
            secondaryMuscles: ['Adductors', 'Calves'],
            sets: 3,
            reps: '10-12 per leg',
            rpe: 'RPE 8.5',
            restSeconds: 90,
            tempo: '2-0-1-0',
            coachingCues: [
              'Front shin nearly vertical, lean torso slightly forward to recruit glute max.',
              'Drive through front heel and big toe joint.'
            ],
            commonMistakes: ['Pushing off back foot instead of working the front lead leg.'],
            substitutions: ['Single-Leg Press', 'Walking Dumbbell Lunges']
          },
          {
            id: 'ex_standing_calf_raise',
            name: 'Standing Machine Calf Raise',
            targetMuscle: 'Gastrocnemius & Soleus',
            secondaryMuscles: ['Tibialis Posterior'],
            sets: 4,
            reps: '12-15',
            rpe: 'RPE 9',
            restSeconds: 60,
            tempo: '3-1-1-1',
            coachingCues: [
              'Achieve complete deep stretch at the bottom holding for 1 full second.',
              'Explode up onto the balls of big toes and squeeze hard at peak plantarflexion.'
            ],
            commonMistakes: ['Bouncing fast using Achilles tendon spring elasticity.'],
            substitutions: ['Single-Leg Dumbbell Calf Raise on Step', 'Leg Press Calf Extension']
          }
        ],
        cooldown: [
          { name: 'Half-Kneeling Hip Flexor Stretch', durationOrReps: '2 sets × 45s each', cue: 'Tuck pelvis under (posterior tilt) and squeeze trailing glute.' },
          { name: 'Seated Single-Leg Hamstring Stretch', durationOrReps: '2 sets × 40s each', cue: 'Reach chest forward without rounding thoracic spine.' }
        ]
      },
      {
        dayNumber: 4,
        dayName: 'Day 4: Full Body Power & Hypertrophy Finisher',
        targetMuscles: ['Total Body Compound', 'Core', 'Metabolic Engine'],
        estimatedTimeMinutes: 50,
        warmup: [
          { name: 'World’s Greatest Stretch Flow', durationOrReps: '2 sets × 6 reps each side', cue: 'Integrate thoracic extension, hip flexor stretch, and hamstring floss.' },
          { name: 'Plank Shoulder Taps', durationOrReps: '2 sets × 16 taps', cue: 'Anti-rotational core brace without swaying hips.' }
        ],
        exercises: [
          {
            id: 'ex_trap_bar_deadlift',
            name: 'Trap Bar Deadlift (High Handles)',
            targetMuscle: 'Posterior & Anterior Hybrid (Glutes, Quads, Traps)',
            secondaryMuscles: ['Forearms', 'Core', 'Lats'],
            sets: 4,
            reps: '6-8',
            rpe: 'RPE 8',
            restSeconds: 150,
            tempo: '2-1-1-0',
            coachingCues: [
              'Pull slack out of the bar, pack lats like squeezing oranges in armpits.',
              'Push the floor away through mid-foot simultaneously extending hips and knees.'
            ],
            commonMistakes: ['Hips shooting up first before bar leaves floor.'],
            substitutions: ['Kettlebell Deadlift', 'Barbell Conventional Deadlift']
          },
          {
            id: 'ex_standing_overhead_press',
            name: 'Standing Dumbbell Overhead Press',
            targetMuscle: 'Deltoids & Clavicular Head',
            secondaryMuscles: ['Triceps', 'Core Stabilizers'],
            sets: 3,
            reps: '8-10',
            rpe: 'RPE 8',
            restSeconds: 90,
            tempo: '2-0-1-0',
            coachingCues: [
              'Brace glutes and abs tight; do not lean backward at the waist.',
              'Press dumbbells up in a slight arc finishing over crowns of ears.'
            ],
            commonMistakes: ['Arching lower back into excessive lumbar lordosis.'],
            substitutions: ['Seated Dumbbell Shoulder Press', 'Landmine Press']
          },
          {
            id: 'ex_hanging_leg_raise',
            name: 'Hanging Knee/Toes-to-Bar Raise',
            targetMuscle: 'Rectus Abdominis & Deep Hip Flexors',
            secondaryMuscles: ['Obliques', 'Grip'],
            sets: 3,
            reps: '12-15',
            rpe: 'RPE 8.5',
            restSeconds: 60,
            tempo: '2-0-1-1',
            coachingCues: [
              'Curl pelvis upward toward ribcage rather than simply lifting legs.',
              'Do not swing or use pendulum momentum.'
            ],
            commonMistakes: ['Swinging body back and forth.'],
            substitutions: ['Decline Bench Reverse Crunch', 'Ab Wheel Rollout']
          }
        ],
        cooldown: [
          { name: 'Cobra to Child’s Pose Flow', durationOrReps: '2 sets × 60s', cue: 'Alternate gentle abdominal decompression with deep lumbar relief.' }
        ]
      }
    ]
  },
  {
    id: 'plan_home_dumbbells_recomp',
    createdAt: new Date().toISOString(),
    title: 'Precision Home Recomposition (Dumbbells & Bench)',
    tagline: 'High metabolic efficiency with progressive overload using minimal footprint equipment',
    goal: 'Fat Loss & Lean Definition',
    fitnessLevel: 'Beginner',
    weeklyFrequency: 3,
    sessionDuration: 45,
    equipment: 'Dumbbells & Adjustable Bench',
    scienceOverview:
      'Optimizes non-glycogen depleting energy expenditure through compound dumbbell multi-joint movements paired with short antagonist rest intervals. Elevates EPOC (excess post-exercise oxygen consumption) while safeguarding skeletal muscle during a caloric deficit.',
    periodization: {
      progressionModel: 'Rep volume progression: 3 sets of 10 -> 3 sets of 12 -> increase dumbbell weight and reset to 10 reps.',
      rpeGuideline: 'Maintain RPE 7-8 throughout to preserve neurological recovery in a caloric deficit.',
      recoveryRecommendation: 'Daily 8,000 to 10,000 steps baseline NEAT (non-exercise activity thermogenesis).'
    },
    nutritionGuidance: {
      calorieStrategy: 'Moderate 350-450 kcal deficit with high protein retention focus.',
      proteinTargetGramsPerKg: 2.2,
      keyHabits: [
        'Prioritize lean protein with high satiety (chicken, egg whites, Greek yogurt, whey isolate).',
        'Consume minimum 25-35g fiber daily from green vegetables and berries.',
        'Drink 3+ liters of water daily to support metabolic lipolysis and satiety.'
      ]
    },
    days: [
      {
        dayNumber: 1,
        dayName: 'Day 1: Full Body Strength & Density A',
        targetMuscles: ['Quads', 'Chest', 'Upper Back', 'Core'],
        estimatedTimeMinutes: 45,
        warmup: [
          { name: 'Arm Circles & Hugs', durationOrReps: '2 sets × 15 reps', cue: 'Warm shoulder capsule dynamically.' },
          { name: 'Bodyweight Air Squats with 3s Pause', durationOrReps: '2 sets × 10 reps', cue: 'Activate knee and ankle joints in full range.' },
          { name: 'Bird-Dog Core Stability', durationOrReps: '2 sets × 8 each side', cue: 'Engage transverse abdominis without shifting pelvis.' }
        ],
        exercises: [
          {
            id: 'ex_db_goblet_squat',
            name: 'Dumbbell Goblet Squat with Bottom Pause',
            targetMuscle: 'Quadriceps & Gluteus Maximus',
            secondaryMuscles: ['Anterior Core', 'Upper Back'],
            sets: 3,
            reps: '10-12',
            rpe: 'RPE 8',
            restSeconds: 90,
            tempo: '3-1-1-0',
            coachingCues: [
              'Hold dumbbell vertically against upper sternum with palms cupping upper weight head.',
              'Sit down between heels, keeping elbows inside knees at bottom.'
            ],
            commonMistakes: ['Letting weight pull upper back into hunched posture.'],
            substitutions: ['Bodyweight Tempo Squat', 'Suitcase Dumbbell Squat']
          },
          {
            id: 'ex_flat_db_bench',
            name: 'Flat Dumbbell Chest Press',
            targetMuscle: 'Pectoralis Major',
            secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
            sets: 3,
            reps: '10-12',
            rpe: 'RPE 8',
            restSeconds: 90,
            tempo: '2-0-1-0',
            coachingCues: [
              'Set dumbbells at 45-degree arrow angle (not 90-degree T-shape).',
              'Feel mild stretch across chest before driving together.'
            ],
            commonMistakes: ['Clanking dumbbells together violently at the top.'],
            substitutions: ['Floor Dumbbell Press', 'Push-ups with Hands Elevated on Bench']
          },
          {
            id: 'ex_db_single_arm_row',
            name: 'Single-Arm Dumbbell Row on Bench',
            targetMuscle: 'Lats & Rhomboids',
            secondaryMuscles: ['Biceps', 'Posterior Deltoid'],
            sets: 3,
            reps: '10-12 each',
            rpe: 'RPE 8',
            restSeconds: 75,
            tempo: '2-1-1-0',
            coachingCues: [
              'Support one knee and hand on flat bench; keep spine flat as a table.',
              'Pull dumbbell toward hip crease, feeling lat contraction.'
            ],
            commonMistakes: ['Twisting torso aggressively on the pull.'],
            substitutions: ['Two-Arm Bent-Over Dumbbell Row', 'Incline Prone Row']
          },
          {
            id: 'ex_bench_plank',
            name: 'Forearm Plank with Glute Squeeze',
            targetMuscle: 'Transverse Abdominis & Anterior Core',
            secondaryMuscles: ['Glutes', 'Serratus Anterior'],
            sets: 3,
            reps: '45 seconds',
            rpe: 'RPE 8',
            restSeconds: 60,
            tempo: 'Isometric',
            coachingCues: [
              'Pull elbows toward toes isometrically to amplify core tension.',
              'Keep hips in direct alignment with shoulders and heels.'
            ],
            commonMistakes: ['Sagging hips downward straining lower back.'],
            substitutions: ['Deadbug on Floor', 'Pallof Press with Band']
          }
        ],
        cooldown: [
          { name: 'Kneeling Quad & Hip Flexor Stretch', durationOrReps: '2 sets × 30s each', cue: 'Breathe smoothly, allowing hip flexors to lengthen.' },
          { name: 'Child’s Pose with Lat Reach', durationOrReps: '1 set × 45s', cue: 'Deep diaphragmatic breathing.' }
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Day 2: Full Body Posterior Chain & Conditioning B',
        targetMuscles: ['Hamstrings', 'Glutes', 'Shoulders', 'Arms'],
        estimatedTimeMinutes: 45,
        warmup: [
          { name: 'Glute Bridges', durationOrReps: '2 sets × 12 reps', cue: 'Squeeze glutes at top for 2 seconds.' },
          { name: 'Inchworms with Push-up', durationOrReps: '2 sets × 6 reps', cue: 'Dynamic hamstring stretch and shoulder activation.' }
        ],
        exercises: [
          {
            id: 'ex_db_rdl_home',
            name: 'Dumbbell Romanian Deadlift',
            targetMuscle: 'Hamstrings & Glutes',
            secondaryMuscles: ['Forearms', 'Spinal Erectors'],
            sets: 3,
            reps: '10-12',
            rpe: 'RPE 8',
            restSeconds: 90,
            tempo: '3-1-1-0',
            coachingCues: ['Push hips back like closing a car door with hips.', 'Keep dumbbells glued close to legs.'],
            commonMistakes: ['Rounding lower back.'],
            substitutions: ['Single-Leg Dumbbell RDL', 'Glute Bridge with Dumbbell']
          },
          {
            id: 'ex_db_seated_shoulder_press',
            name: 'Seated Dumbbell Shoulder Press (75°)',
            targetMuscle: 'Anterior & Lateral Deltoids',
            secondaryMuscles: ['Triceps'],
            sets: 3,
            reps: '10-12',
            rpe: 'RPE 8',
            restSeconds: 75,
            tempo: '2-0-1-0',
            coachingCues: ['Press up in smooth arc without locking elbows aggressively.'],
            commonMistakes: ['Hyperextending spine.'],
            substitutions: ['Standing Dumbbell Push Press', 'Pike Push-ups']
          },
          {
            id: 'ex_db_hammer_curl_superset',
            name: 'Dumbbell Hammer Curls',
            targetMuscle: 'Brachialis & Forearms',
            secondaryMuscles: ['Biceps Brachii'],
            sets: 3,
            reps: '12 reps',
            rpe: 'RPE 8.5',
            restSeconds: 60,
            tempo: '2-0-1-0',
            coachingCues: ['Keep neutral grip (thumbs up). Zero body swinging.'],
            commonMistakes: ['Using hips for momentum.'],
            substitutions: ['Zottman Curl', 'Standard Dumbbell Curl']
          }
        ],
        cooldown: [
          { name: 'Figure-4 Glute Stretch', durationOrReps: '2 sets × 30s each', cue: 'Release deep piriformis tension.' }
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Day 3: Athletic Endurance & Metabolic Unison C',
        targetMuscles: ['Full Body Athletic Stability', 'Heart & Lungs'],
        estimatedTimeMinutes: 45,
        warmup: [
          { name: 'Jumping Jacks & High Knees', durationOrReps: '2 sets × 30s', cue: 'Elevate core body temperature and heart rate.' }
        ],
        exercises: [
          {
            id: 'ex_db_reverse_lunge',
            name: 'Alternating Dumbbell Reverse Lunges',
            targetMuscle: 'Quadriceps & Gluteal Complex',
            secondaryMuscles: ['Hamstrings', 'Calves'],
            sets: 3,
            reps: '10 each side',
            rpe: 'RPE 8',
            restSeconds: 75,
            tempo: '2-0-1-0',
            coachingCues: ['Step back softly, gently kiss back knee to mat.', 'Drive up through front heel.'],
            commonMistakes: ['Banging back knee hard into ground.'],
            substitutions: ['Bodyweight Step-ups onto Bench', 'Split Squat in place']
          },
          {
            id: 'ex_db_renegade_row',
            name: 'Dumbbell Renegade Rows in Push-up Plank',
            targetMuscle: 'Anti-Rotational Core & Lats',
            secondaryMuscles: ['Chest', 'Shoulders'],
            sets: 3,
            reps: '8 each side',
            rpe: 'RPE 8.5',
            restSeconds: 75,
            tempo: '2-1-1-0',
            coachingCues: ['Wide foot stance for stable tripod base.', 'Row dumbbell to ribs without shifting hips.'],
            commonMistakes: ['Twisting hips 45 degrees.'],
            substitutions: ['Plank Shoulder Taps', 'Standard Single-Arm Dumbbell Row']
          },
          {
            id: 'ex_db_tricep_kickback',
            name: 'Overhead Dumbbell Triceps Extension',
            targetMuscle: 'Triceps Long Head',
            secondaryMuscles: ['Shoulders'],
            sets: 3,
            reps: '12-15 reps',
            rpe: 'RPE 8',
            restSeconds: 60,
            tempo: '2-0-1-0',
            coachingCues: ['Hold dumbbell with both hands overhead, keeping elbows pointing forward.'],
            commonMistakes: ['Flaring elbows wide.'],
            substitutions: ['Bench Dips', 'Diamond Push-ups']
          }
        ],
        cooldown: [
          { name: 'Full Body Supine Twist', durationOrReps: '2 sets × 40s each', cue: 'Relax parasympathetic nervous system.' }
        ]
      }
    ]
  }
];
