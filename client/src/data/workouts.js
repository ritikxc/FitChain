// ============================================================
// workouts.js — Structured 7-Day Workout Plans
// Contains Hypertrophy, Strength, and Endurance goals with multiple split options
// ============================================================

export const GOAL_SPLIT_OPTIONS = {
  hypertrophy: [
    { id: 'ppl', label: 'Push / Pull / Legs (PPL)', desc: 'Classic 6-day muscle building split with 1 rest day' },
    { id: 'upper_lower', label: 'Upper / Lower Split', desc: 'Balanced 4-day frequency split with dedicated arm & core volume' },
    { id: 'single_muscle', label: 'Single-Muscle Split', desc: 'Target one primary muscle group per day for maximum local fatigue' },
  ],
  strength: [
    { id: 'ppl', label: 'Heavy Push / Pull / Legs', desc: 'Compound-focused strength split with dedicated power days' },
    { id: 'upper_lower', label: 'Upper / Lower Strength', desc: 'Heavy 5x5 compound progression split with strength accessories' },
    { id: 'strength_split', label: 'Powerlifting / 5x5 Split', desc: 'Maximal strength progression focused on Squat, Bench, and Deadlift' },
  ],
  endurance: [
    { id: 'cardio_circuit', label: 'Cardio & Circuit Split', desc: 'High-density circuits and steady-state cardiovascular conditioning' },
    { id: 'functional_endurance', label: 'Functional / Hyrox Endurance', desc: 'Hybrid endurance conditioning with carries, sleds, and tempo intervals' },
  ],
}

const workoutData = {
  gym: {
    hypertrophy: {
      ppl: {
        label: 'Gym Hypertrophy — Push / Pull / Legs',
        description: 'High-volume hypertrophy program designed to maximize muscle cross-sectional area through compound and isolation movements.',
        days: [
          {
            day: 'Day 1 — Push (Chest, Delts, Triceps)',
            exercises: [
              { name: 'Barbell Bench Press', sets: 4, reps: '8-10', weight: 70, rest: '90s', tip: 'Retract scapula, control descent' },
              { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: 24, rest: '90s', tip: 'Set bench to 30 degrees for clavicular head' },
              { name: 'Standing Overhead Dumbbell Press', sets: 3, reps: '10-12', weight: 18, rest: '75s', tip: 'Keep ribcage down, full overhead lockout' },
              { name: 'Cable Lateral Raises', sets: 4, reps: '12-15', weight: 8, rest: '60s', tip: 'Lead with elbow, pause at peak contraction' },
              { name: 'Tricep Rope Pushdowns', sets: 3, reps: '12-15', weight: 20, rest: '60s', tip: 'Flare rope out at bottom, lock out elbows' },
            ],
          },
          {
            day: 'Day 2 — Pull (Back, Rear Delts, Biceps)',
            exercises: [
              { name: 'Conventional Deadlift', sets: 4, reps: '6-8', weight: 100, rest: '120s', tip: 'Brace core, push the floor away' },
              { name: 'Chest-Supported Row', sets: 4, reps: '8-10', weight: 30, rest: '90s', tip: 'Drive elbows back, squeeze lats' },
              { name: 'Wide-Grip Lat Pulldown', sets: 3, reps: '10-12', weight: 55, rest: '75s', tip: 'Pull to upper collarbone with slight lean' },
              { name: 'Reverse Pec Deck Flyes', sets: 3, reps: '15', weight: 35, rest: '60s', tip: 'Target rear deltoids with slight elbow bend' },
              { name: 'Incline Dumbbell Curls', sets: 3, reps: '10-12', weight: 12, rest: '60s', tip: 'Full biceps stretch at bottom position' },
            ],
          },
          {
            day: 'Day 3 — Legs (Quads, Hamstrings, Calves)',
            exercises: [
              { name: 'Barbell Back Squat', sets: 4, reps: '8-10', weight: 85, rest: '120s', tip: 'Hit parallel depth with knees tracking toes' },
              { name: 'Romanian Deadlift', sets: 3, reps: '10-12', weight: 75, rest: '90s', tip: 'Hinge at hips until deep hamstring stretch' },
              { name: 'Leg Press', sets: 3, reps: '12-15', weight: 140, rest: '90s', tip: 'Full range of motion without lower back rounding' },
              { name: 'Lying Leg Curls', sets: 3, reps: '12-15', weight: 40, rest: '60s', tip: 'Slow 3-second eccentric on every repetition' },
              { name: 'Standing Calf Raise', sets: 4, reps: '15-20', weight: 50, rest: '45s', tip: 'Hold peak contraction for 1 second' },
            ],
          },
          {
            day: 'Day 4 — Push (Chest Emphasis & Arms)',
            exercises: [
              { name: 'Incline Barbell Bench Press', sets: 4, reps: '8-10', weight: 60, rest: '90s', tip: 'Focus on upper chest fiber recruitment' },
              { name: 'Flat Dumbbell Press', sets: 3, reps: '10-12', weight: 26, rest: '90s', tip: 'Dumbbells touch lightly at apex of movement' },
              { name: 'Dumbbell Lateral Raises', sets: 4, reps: '15', weight: 10, rest: '60s', tip: 'Strict form, no torso momentum' },
              { name: 'Overhead Cable Tricep Extension', sets: 3, reps: '12-15', weight: 22, rest: '60s', tip: 'Maximizes long-head triceps stretch' },
              { name: 'Dips (Weighted/Bodyweight)', sets: 3, reps: '10-12', weight: 0, rest: '75s', tip: 'Forward lean to emphasize lower chest' },
            ],
          },
          {
            day: 'Day 5 — Pull (Lat Width & Mid-Back)',
            exercises: [
              { name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', weight: 65, rest: '90s', tip: '45-degree torso angle, pull to navel' },
              { name: 'Neutral-Grip Lat Pulldown', sets: 3, reps: '10-12', weight: 50, rest: '75s', tip: 'Great lat engagement with minimal shoulder strain' },
              { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10 each', weight: 28, rest: '60s', tip: 'Full stretch at bottom, elbow tucked' },
              { name: 'Face Pulls', sets: 3, reps: '15', weight: 25, rest: '60s', tip: 'External rotation at end range for rotator cuff health' },
              { name: 'EZ-Bar Preacher Curls', sets: 3, reps: '10-12', weight: 25, rest: '60s', tip: 'Strict arm isolation, no shoulder cheat' },
            ],
          },
          {
            day: 'Day 6 — Legs & Core (Posterior Chain & Abs)',
            exercises: [
              { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', weight: 16, rest: '90s', tip: 'Elevate rear foot, stay upright' },
              { name: 'Seated Leg Extension', sets: 3, reps: '15', weight: 45, rest: '60s', tip: 'Hold contraction for 1 count at the top' },
              { name: 'Seated Hamstring Curl', sets: 3, reps: '12-15', weight: 40, rest: '60s', tip: 'Dorsiflex toes for greater hamstring tension' },
              { name: 'Seated Calf Raise', sets: 4, reps: '15-20', weight: 35, rest: '45s', tip: 'Targets the soleus muscle' },
              { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', weight: 0, rest: '60s', tip: 'Posterior pelvic tilt, avoid swinging' },
            ],
          },
          {
            day: 'Day 7 — Active Recovery & Rest',
            exercises: [
              { name: 'Light Incline Walk', sets: 1, reps: '25 min', weight: 0, rest: '0s', tip: 'Keep heart rate in Zone 1-2 for recovery' },
              { name: 'Full-Body Dynamic Mobility', sets: 1, reps: '15 min', weight: 0, rest: '0s', tip: 'Focus on hips, ankles, and thoracic spine' },
              { name: 'Foam Rolling', sets: 1, reps: '10 min', weight: 0, rest: '0s', tip: 'Roll quads, IT band, lats, and glutes' },
            ],
          },
        ],
      },
      upper_lower: {
        label: 'Gym Hypertrophy — Upper / Lower Split',
        description: 'Upper and Lower alternating split with dedicated focus on compound movements and accessory volume.',
        days: [
          {
            day: 'Day 1 — Upper Body A (Chest & Back Heavy)',
            exercises: [
              { name: 'Barbell Bench Press', sets: 4, reps: '6-8', weight: 75, rest: '90s', tip: 'Stable foot drive and solid grip' },
              { name: 'Barbell Rows', sets: 4, reps: '8-10', weight: 65, rest: '90s', tip: 'Pull bar towards lower abdomen' },
              { name: 'Overhead Dumbbell Press', sets: 3, reps: '10-12', weight: 20, rest: '75s', tip: 'Controlled eccentric phase' },
              { name: 'Cable Lateral Raise', sets: 3, reps: '15', weight: 8, rest: '60s', tip: 'Lead slightly with elbows' },
              { name: 'Skull Crushers', sets: 3, reps: '10-12', weight: 25, rest: '60s', tip: 'Lower EZ bar to forehead/crown' },
            ],
          },
          {
            day: 'Day 2 — Lower Body A (Quad Emphasis)',
            exercises: [
              { name: 'Barbell Back Squat', sets: 4, reps: '6-8', weight: 90, rest: '120s', tip: 'Brace core with diaphragmatic breathing' },
              { name: 'Leg Press', sets: 3, reps: '10-12', weight: 150, rest: '90s', tip: 'Knees tracking 30 degrees outward' },
              { name: 'Dumbbell Romanian Deadlift', sets: 3, reps: '10-12', weight: 28, rest: '75s', tip: 'Flat spine, feel stretch in hamstrings' },
              { name: 'Leg Extension', sets: 3, reps: '15', weight: 45, rest: '60s', tip: 'Full quad contraction' },
              { name: 'Standing Calf Raise', sets: 4, reps: '15-20', weight: 50, rest: '45s', tip: 'Full range ankle flexion' },
            ],
          },
          {
            day: 'Day 3 — Rest & Active Recovery',
            exercises: [
              { name: 'Zone 2 Cardio / Walk', sets: 1, reps: '30 min', weight: 0, rest: '0s', tip: 'Low intensity recovery walk' },
              { name: 'Hip & Shoulder Mobility', sets: 1, reps: '15 min', weight: 0, rest: '0s', tip: 'Cat-cow, world greatest stretch' },
            ],
          },
          {
            day: 'Day 4 — Upper Body B (Shoulders & Arms Heavy)',
            exercises: [
              { name: 'Incline Dumbbell Bench Press', sets: 4, reps: '8-10', weight: 26, rest: '90s', tip: 'Upper chest hypertrophy' },
              { name: 'Neutral-Grip Lat Pulldown', sets: 4, reps: '8-10', weight: 55, rest: '75s', tip: 'Pull smoothly to upper chest' },
              { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '10-12', weight: 20, rest: '75s', tip: 'Full vertical drive' },
              { name: 'Dumbbell Hammer Curls', sets: 3, reps: '10-12', weight: 14, rest: '60s', tip: 'Builds forearm and brachialis thickness' },
              { name: 'Cable Tricep Pushdown', sets: 3, reps: '12-15', weight: 25, rest: '60s', tip: 'Strict elbow alignment' },
            ],
          },
          {
            day: 'Day 5 — Lower Body B (Hamstrings & Posterior Chain)',
            exercises: [
              { name: 'Conventional Deadlift', sets: 4, reps: '6-8', weight: 105, rest: '120s', tip: 'Tight lats, lock out hips' },
              { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', weight: 18, rest: '90s', tip: 'Deep single-leg range of motion' },
              { name: 'Lying Hamstring Curl', sets: 3, reps: '12-15', weight: 40, rest: '60s', tip: 'Control the downward movement' },
              { name: 'Glute Bridge / Hip Thrust', sets: 3, reps: '12', weight: 70, rest: '75s', tip: 'Hard glute squeeze at lock' },
              { name: 'Seated Calf Raise', sets: 4, reps: '15', weight: 35, rest: '45s', tip: 'Full bottom stretch' },
            ],
          },
          {
            day: 'Day 6 — Arms & Core Hypertrophy',
            exercises: [
              { name: 'Barbell Biceps Curl', sets: 3, reps: '10-12', weight: 30, rest: '60s', tip: 'No swinging, strict tension' },
              { name: 'Overhead Dumbbell Tricep Extension', sets: 3, reps: '12', weight: 22, rest: '60s', tip: 'Full elbow extension' },
              { name: 'Cable Rope Hammer Curls', sets: 3, reps: '12-15', weight: 20, rest: '60s', tip: 'Peak pump at completion' },
              { name: 'Cable Woodchoppers', sets: 3, reps: '15 each', weight: 15, rest: '45s', tip: 'Rotational core power' },
              { name: 'Plank Hold', sets: 3, reps: '60s', weight: 0, rest: '45s', tip: 'Engage glutes and core' },
            ],
          },
          {
            day: 'Day 7 — Rest & Mobility',
            exercises: [
              { name: 'Complete Rest Day', sets: 1, reps: 'Full Day', weight: 0, rest: '0s', tip: 'Focus on hydration and protein intake' },
            ],
          },
        ],
      },
      single_muscle: {
        label: 'Gym Hypertrophy — Single-Muscle Split',
        description: 'Dedicated bodypart split targeting one primary muscle group per training day.',
        days: [
          {
            day: 'Day 1 — Chest Focus',
            exercises: [
              { name: 'Flat Barbell Bench Press', sets: 4, reps: '8-10', weight: 70, rest: '90s', tip: 'Solid setup with leg drive' },
              { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', weight: 24, rest: '90s', tip: 'Upper pectoral development' },
              { name: 'Cable Chest Flyes', sets: 3, reps: '12-15', weight: 12, rest: '60s', tip: 'Squeeze hands together at apex' },
              { name: 'Chest Dips', sets: 3, reps: '12', weight: 0, rest: '60s', tip: 'Lean 30 degrees forward' },
              { name: 'Push-Ups to Failure', sets: 2, reps: 'Max', weight: 0, rest: '60s', tip: 'Burnout set' },
            ],
          },
          {
            day: 'Day 2 — Back Focus',
            exercises: [
              { name: 'Deadlift', sets: 4, reps: '6-8', weight: 100, rest: '120s', tip: 'Full body pull' },
              { name: 'Lat Pulldowns', sets: 4, reps: '10-12', weight: 55, rest: '75s', tip: 'Pull elbows to hips' },
              { name: 'Barbell T-Bar Row', sets: 3, reps: '8-10', weight: 45, rest: '75s', tip: 'Mid-back thickness' },
              { name: 'Seated Cable Rows', sets: 3, reps: '12', weight: 45, rest: '60s', tip: 'Full retraction' },
              { name: 'Straight-Arm Cable Pulldown', sets: 3, reps: '15', weight: 20, rest: '60s', tip: 'Lat isolation' },
            ],
          },
          {
            day: 'Day 3 — Shoulders & Traps Focus',
            exercises: [
              { name: 'Seated Dumbbell Shoulder Press', sets: 4, reps: '8-10', weight: 22, rest: '90s', tip: 'Full vertical extension' },
              { name: 'Standing Dumbbell Lateral Raises', sets: 4, reps: '12-15', weight: 10, rest: '60s', tip: 'Side delt roundness' },
              { name: 'Face Pulls', sets: 4, reps: '15', weight: 25, rest: '60s', tip: 'Rear delts and traps' },
              { name: 'Front Plate Raises', sets: 3, reps: '12', weight: 15, rest: '60s', tip: 'Anterior delt control' },
              { name: 'Dumbbell Shrugs', sets: 4, reps: '15', weight: 30, rest: '45s', tip: 'Elevate scapulae without rolling' },
            ],
          },
          {
            day: 'Day 4 — Arms (Biceps & Triceps)',
            exercises: [
              { name: 'EZ-Bar Bicep Curls', sets: 4, reps: '10-12', weight: 25, rest: '60s', tip: 'Strict form' },
              { name: 'Close-Grip Bench Press', sets: 4, reps: '8-10', weight: 55, rest: '75s', tip: 'Triceps power builder' },
              { name: 'Incline Dumbbell Curls', sets: 3, reps: '12', weight: 12, rest: '60s', tip: 'Long head stretch' },
              { name: 'Overhead Rope Tricep Extension', sets: 3, reps: '12-15', weight: 22, rest: '60s', tip: 'Full extension' },
              { name: 'Hammer Curls', sets: 3, reps: '12', weight: 14, rest: '60s', tip: 'Forearm & brachialis' },
            ],
          },
          {
            day: 'Day 5 — Quads & Calves Focus',
            exercises: [
              { name: 'Barbell Back Squat', sets: 4, reps: '8-10', weight: 85, rest: '120s', tip: 'Deep quad engagement' },
              { name: 'Leg Press', sets: 4, reps: '12-15', weight: 160, rest: '90s', tip: 'High volume quad load' },
              { name: 'Walking Lunges', sets: 3, reps: '12 each', weight: 16, rest: '75s', tip: 'Continuous stride' },
              { name: 'Leg Extension', sets: 3, reps: '15-20', weight: 45, rest: '60s', tip: 'Quad burn' },
              { name: 'Standing Calf Raise', sets: 4, reps: '20', weight: 55, rest: '45s', tip: 'Full ankle range' },
            ],
          },
          {
            day: 'Day 6 — Hamstrings, Glutes & Abs',
            exercises: [
              { name: 'Romanian Deadlift', sets: 4, reps: '8-10', weight: 80, rest: '90s', tip: 'Hamstring stretch' },
              { name: 'Lying Hamstring Curls', sets: 4, reps: '12', weight: 40, rest: '60s', tip: 'Control descent' },
              { name: 'Barbell Hip Thrust', sets: 3, reps: '10-12', weight: 80, rest: '90s', tip: 'Glute apex drive' },
              { name: 'Hanging Knee Raises', sets: 3, reps: '15', weight: 0, rest: '45s', tip: 'Lower ab flexion' },
              { name: 'Ab Wheel Rollouts', sets: 3, reps: '10', weight: 0, rest: '60s', tip: 'Core stabilization' },
            ],
          },
          {
            day: 'Day 7 — Rest & Recovery',
            exercises: [
              { name: 'Rest and Nutrition Reset', sets: 1, reps: 'Full Day', weight: 0, rest: '0s', tip: 'Replenish glycogen and rest' },
            ],
          },
        ],
      },
    },
    strength: {
      ppl: {
        label: 'Gym Strength — Heavy Push / Pull / Legs',
        description: 'Strength-oriented PPL split focusing on low rep ranges, high neural drive, and progressive overload.',
        days: [
          {
            day: 'Day 1 — Heavy Push (Bench & OHP Focus)',
            exercises: [
              { name: 'Barbell Bench Press', sets: 5, reps: '3-5', weight: 85, rest: '3-4 min', tip: 'Maximal power output with tight leg drive' },
              { name: 'Standing Overhead Barbell Press', sets: 4, reps: '5', weight: 50, rest: '3 min', tip: 'Squeeze glutes, push head through at top' },
              { name: 'Weighted Dips', sets: 3, reps: '6', weight: 15, rest: '2.5 min', tip: 'Controlled descent, explosive ascent' },
              { name: 'Close-Grip Bench Press', sets: 3, reps: '6', weight: 65, rest: '2 min', tip: 'Lockout strength for bench press' },
            ],
          },
          {
            day: 'Day 2 — Heavy Pull (Deadlift & Row Focus)',
            exercises: [
              { name: 'Conventional Deadlift', sets: 5, reps: '3-5', weight: 120, rest: '4-5 min', tip: 'Build high intra-abdominal pressure' },
              { name: 'Pendlay Barbell Rows', sets: 4, reps: '5', weight: 75, rest: '3 min', tip: 'Reset on floor every repetition' },
              { name: 'Weighted Pull-Ups', sets: 4, reps: '5', weight: 10, rest: '3 min', tip: 'Chest to bar with full dead hang' },
              { name: 'Heavy Dumbbell Rows', sets: 3, reps: '6 each', weight: 34, rest: '2 min', tip: 'Unilateral back power' },
            ],
          },
          {
            day: 'Day 3 — Heavy Legs (Squat Focus)',
            exercises: [
              { name: 'Barbell Back Squat', sets: 5, reps: '3-5', weight: 105, rest: '3-5 min', tip: 'Drive out of the hole aggressively' },
              { name: 'Front Squat', sets: 3, reps: '5', weight: 70, rest: '3 min', tip: 'Thoracic extension, high elbows' },
              { name: 'Romanian Deadlift', sets: 3, reps: '6', weight: 90, rest: '2.5 min', tip: 'Posterior chain reinforcement' },
              { name: 'Heavy Standing Calf Raise', sets: 4, reps: '8-10', weight: 75, rest: '90s', tip: 'Strict bottom pause' },
            ],
          },
          {
            day: 'Day 4 — Rest & CNS Recovery',
            exercises: [
              { name: 'Active Recovery Walk', sets: 1, reps: '30 min', weight: 0, rest: '0s', tip: 'Low intensity recovery' },
              { name: 'Spine Decompression', sets: 1, reps: '10 min', weight: 0, rest: '0s', tip: 'Dead hangs and gentle stretching' },
            ],
          },
          {
            day: 'Day 5 — Power Upper (Incline & Accessory)',
            exercises: [
              { name: 'Incline Barbell Bench Press', sets: 4, reps: '5', weight: 70, rest: '3 min', tip: 'Upper pectoral strength' },
              { name: 'Weighted Chin-Ups', sets: 4, reps: '5', weight: 10, rest: '3 min', tip: 'Supinated grip for lat and arm power' },
              { name: 'Seated Overhead Dumbbell Press', sets: 3, reps: '6', weight: 26, rest: '2 min', tip: 'Shoulder stability' },
              { name: 'Heavy Barbell Shrugs', sets: 4, reps: '8', weight: 90, rest: '2 min', tip: 'Upper trap strength for deadlifts' },
            ],
          },
          {
            day: 'Day 6 — Power Lower & Core (Deadlift & Squat Variations)',
            exercises: [
              { name: 'Pause Squats (2s hold)', sets: 4, reps: '3', weight: 90, rest: '3 min', tip: 'Eliminates stretch reflex' },
              { name: 'Deficit Deadlift', sets: 3, reps: '4', weight: 105, rest: '3 min', tip: 'Builds explosive floor speed' },
              { name: 'Heavy Farmer Carries', sets: 4, reps: '40m', weight: 32, rest: '2 min', tip: 'Total body grip and core endurance' },
              { name: 'Hanging Leg Raises', sets: 3, reps: '10', weight: 0, rest: '60s', tip: 'Strict abdominal tension' },
            ],
          },
          {
            day: 'Day 7 — Full Rest & Recovery',
            exercises: [
              { name: 'Complete Rest Day', sets: 1, reps: 'Full Day', weight: 0, rest: '0s', tip: 'Prepare central nervous system for next cycle' },
            ],
          },
        ],
      },
      upper_lower: {
        label: 'Gym Strength — Upper / Lower Split',
        description: 'Upper / Lower strength protocol utilizing 5x5 compound principles and primary lift specialization.',
        days: [
          {
            day: 'Day 1 — Heavy Upper Strength (Bench 5x5)',
            exercises: [
              { name: 'Barbell Bench Press', sets: 5, reps: '5', weight: 80, rest: '3-4 min', tip: 'Retract blades, press in a slight arc' },
              { name: 'Barbell Bent-Over Row', sets: 5, reps: '5', weight: 70, rest: '3 min', tip: 'Strict 45-degree angle' },
              { name: 'Overhead Barbell Press', sets: 3, reps: '5', weight: 48, rest: '2.5 min', tip: 'Lockout overhead' },
              { name: 'Weighted Dips', sets: 3, reps: '6', weight: 12, rest: '2 min', tip: 'Chest and tricep power' },
            ],
          },
          {
            day: 'Day 2 — Heavy Lower Strength (Squat 5x5)',
            exercises: [
              { name: 'Barbell Back Squat', sets: 5, reps: '5', weight: 100, rest: '3-5 min', tip: 'Full depth and strong ascent' },
              { name: 'Romanian Deadlift', sets: 4, reps: '6', weight: 85, rest: '2.5 min', tip: 'Hamstring and glute reinforcement' },
              { name: 'Leg Press', sets: 3, reps: '8', weight: 160, rest: '2 min', tip: 'Supplemental leg volume' },
              { name: 'Standing Calf Raise', sets: 4, reps: '10', weight: 65, rest: '60s', tip: 'Peak contraction pause' },
            ],
          },
          {
            day: 'Day 3 — Rest & Active Recovery',
            exercises: [
              { name: 'Cardio & Foam Rolling', sets: 1, reps: '25 min', weight: 0, rest: '0s', tip: 'Light walking and soft tissue work' },
            ],
          },
          {
            day: 'Day 4 — Power Upper (Press & Pull Variations)',
            exercises: [
              { name: 'Incline Barbell Bench Press', sets: 4, reps: '5', weight: 68, rest: '3 min', tip: 'Upper chest pressing power' },
              { name: 'Weighted Chin-Ups', sets: 4, reps: '5', weight: 10, rest: '2.5 min', tip: 'Full range of motion' },
              { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '6', weight: 24, rest: '2 min', tip: 'Controlled pressing' },
              { name: 'Barbell Biceps Curl', sets: 3, reps: '8', weight: 32, rest: '90s', tip: 'Strict arm strength' },
            ],
          },
          {
            day: 'Day 5 — Power Lower (Deadlift 5x3)',
            exercises: [
              { name: 'Conventional Deadlift', sets: 5, reps: '3', weight: 125, rest: '4-5 min', tip: 'Maximum force off the floor' },
              { name: 'Front Squat', sets: 3, reps: '5', weight: 70, rest: '3 min', tip: 'Quad and core synergy' },
              { name: 'Heavy Farmer Carries', sets: 4, reps: '40m', weight: 32, rest: '2 min', tip: 'Grip and core stability' },
              { name: 'Hanging Leg Raises', sets: 3, reps: '10', weight: 0, rest: '60s', tip: 'Posterior pelvic tilt' },
            ],
          },
          {
            day: 'Day 6 — Conditioning & Functional Strength',
            exercises: [
              { name: 'Kettlebell Swings', sets: 5, reps: '15', weight: 24, rest: '60s', tip: 'Explosive hip drive' },
              { name: 'Sled Push / Prowler', sets: 4, reps: '30m', weight: 80, rest: '90s', tip: 'Powerful leg extension' },
              { name: 'Plank Hold', sets: 3, reps: '60s', weight: 0, rest: '45s', tip: 'Solid core brace' },
            ],
          },
          {
            day: 'Day 7 — Full Rest Day',
            exercises: [
              { name: 'Rest and Recovery', sets: 1, reps: 'Full Day', weight: 0, rest: '0s', tip: 'Rest, hydrate, and prepare for cycle' },
            ],
          },
        ],
      },
      strength_split: {
        label: 'Gym Strength — Powerlifting 5x5 Split',
        description: 'Specialized 5x5 Powerlifting program revolving around the big 3 competition lifts.',
        days: [
          {
            day: 'Day 1 — Squat & Bench Primary (5x5)',
            exercises: [
              { name: 'Competition Barbell Squat', sets: 5, reps: '5', weight: 100, rest: '4 min', tip: 'Hit consistent below-parallel depth' },
              { name: 'Competition Bench Press', sets: 5, reps: '5', weight: 80, rest: '3.5 min', tip: '1-second pause on chest before pressing' },
              { name: 'Barbell Bent-Over Row', sets: 4, reps: '6', weight: 70, rest: '2.5 min', tip: 'Builds upper back support for bench' },
            ],
          },
          {
            day: 'Day 2 — Active Recovery & Mobility',
            exercises: [
              { name: 'Hip & Ankle Mobility Drills', sets: 1, reps: '20 min', weight: 0, rest: '0s', tip: 'Squat depth prep' },
              { name: 'Band Pull-Aparts', sets: 3, reps: '25', weight: 0, rest: '45s', tip: 'Scapular health' },
            ],
          },
          {
            day: 'Day 3 — Deadlift & Overhead Press Heavy',
            exercises: [
              { name: 'Competition Deadlift', sets: 5, reps: '3', weight: 130, rest: '4-5 min', tip: 'Lock out hips and knees together' },
              { name: 'Standing Military Press', sets: 5, reps: '5', weight: 52, rest: '3 min', tip: 'Strict overhead power' },
              { name: 'Weighted Pull-Ups', sets: 4, reps: '5', weight: 12, rest: '2.5 min', tip: 'Lat recruitment' },
            ],
          },
          {
            day: 'Day 4 — Rest & Recovery',
            exercises: [
              { name: 'Light Recovery Walk', sets: 1, reps: '30 min', weight: 0, rest: '0s', tip: 'General blood flow' },
            ],
          },
          {
            day: 'Day 5 — Squat & Bench Secondary (Volume)',
            exercises: [
              { name: 'Pause Squats (3s pause)', sets: 4, reps: '4', weight: 85, rest: '3 min', tip: 'Build power out of the bottom position' },
              { name: 'Close-Grip Bench Press', sets: 4, reps: '6', weight: 70, rest: '2.5 min', tip: 'Tricep lockout strength' },
              { name: 'Weighted Dips', sets: 3, reps: '8', weight: 10, rest: '2 min', tip: 'Chest and tricep power' },
            ],
          },
          {
            day: 'Day 6 — Posterior Chain & Core Access',
            exercises: [
              { name: 'Romanian Deadlift', sets: 4, reps: '6', weight: 90, rest: '2.5 min', tip: 'Hamstrings and erectors' },
              { name: 'Pendlay Row', sets: 4, reps: '6', weight: 70, rest: '2 min', tip: 'Explosive back pull' },
              { name: 'Ab Wheel Rollouts', sets: 3, reps: '12', weight: 0, rest: '60s', tip: 'Resisting extension' },
            ],
          },
          {
            day: 'Day 7 — Rest & Muscle Prep',
            exercises: [
              { name: 'Rest and Nutrition Reset', sets: 1, reps: 'Full Day', weight: 0, rest: '0s', tip: 'CNS restoration' },
            ],
          },
        ],
      },
    },
    endurance: {
      cardio_circuit: {
        label: 'Gym Endurance — Cardio & Circuit Split',
        description: 'High-density conditioning, cardiovascular work capacity, and lactate threshold training.',
        days: [
          {
            day: 'Day 1 — Full Body Metabolic Circuit',
            exercises: [
              { name: 'Kettlebell Swings', sets: 4, reps: '25', weight: 20, rest: '45s', tip: 'Explosive hip hinge' },
              { name: 'Dumbbell Thrusters', sets: 4, reps: '15', weight: 12, rest: '45s', tip: 'Continuous squat into press motion' },
              { name: 'Rowing Machine Sprint', sets: 4, reps: '300m', weight: 0, rest: '60s', tip: 'Pace below 1:45/500m' },
              { name: 'Push-Ups', sets: 4, reps: '20', weight: 0, rest: '45s', tip: 'Full range of motion' },
              { name: 'Plank to Push-Up', sets: 3, reps: '15', weight: 0, rest: '30s', tip: 'Core stability under fatigue' },
            ],
          },
          {
            day: 'Day 2 — Aerobic Base (Zone 2 Conditioning)',
            exercises: [
              { name: 'Treadmill Incline Ruck/Walk', sets: 1, reps: '30 min', weight: 10, rest: '0s', tip: 'Keep heart rate in 125-145 BPM range' },
              { name: 'Stationary Bike Steady State', sets: 1, reps: '20 min', weight: 0, rest: '0s', tip: 'Smooth 85-90 RPM cadence' },
              { name: 'Hanging Knee Tucks', sets: 3, reps: '15', weight: 0, rest: '45s', tip: 'Core conditioning' },
            ],
          },
          {
            day: 'Day 3 — Upper Body Muscular Endurance',
            exercises: [
              { name: 'Dumbbell Push-Press', sets: 4, reps: '15', weight: 14, rest: '45s', tip: 'Use leg dip to drive weights up' },
              { name: 'Cable Seated Rows (High Rep)', sets: 4, reps: '20', weight: 35, rest: '45s', tip: 'Maintain rhythmic pace' },
              { name: 'Dumbbell Renegade Rows', sets: 3, reps: '12 each', weight: 10, rest: '45s', tip: 'Anti-rotation core stability' },
              { name: 'Battle Ropes', sets: 4, reps: '30s on / 30s off', weight: 0, rest: '30s', tip: 'Max wave intensity' },
              { name: 'Dips', sets: 3, reps: '15', weight: 0, rest: '45s', tip: 'Bodyweight endurance' },
            ],
          },
          {
            day: 'Day 4 — Active Recovery & Flexibility',
            exercises: [
              { name: 'Light Swimming / Water Jogging', sets: 1, reps: '25 min', weight: 0, rest: '0s', tip: 'Low impact recovery' },
              { name: 'Full Body Foam Roll & Stretch', sets: 1, reps: '20 min', weight: 0, rest: '0s', tip: 'Focus on thoracic and hip flexibility' },
            ],
          },
          {
            day: 'Day 5 — Lower Body Stamina & Plyometrics',
            exercises: [
              { name: 'Goblet Squats', sets: 4, reps: '20', weight: 20, rest: '45s', tip: 'Deep upright squat' },
              { name: 'Walking Lunges', sets: 4, reps: '20 total', weight: 12, rest: '45s', tip: 'Constant forward momentum' },
              { name: 'Box Jumps', sets: 4, reps: '12', weight: 0, rest: '45s', tip: 'Soft landing on top of box' },
              { name: 'Kettlebell Romanian Deadlift', sets: 3, reps: '20', weight: 24, rest: '45s', tip: 'Hamstring endurance' },
              { name: 'Wall Sit', sets: 3, reps: '60s hold', weight: 0, rest: '45s', tip: 'Thighs parallel to floor' },
            ],
          },
          {
            day: 'Day 6 — High-Intensity Interval Circuit (HIIT)',
            exercises: [
              { name: 'Assault Bike Sprints', sets: 6, reps: '20s sprint / 40s rest', weight: 0, rest: '40s', tip: 'All-out anaerobic effort' },
              { name: 'Burpee Broad Jumps', sets: 4, reps: '10', weight: 0, rest: '45s', tip: 'Explosive jump forward out of burpee' },
              { name: 'Kettlebell Snatch', sets: 3, reps: '12 each', weight: 16, rest: '45s', tip: 'Smooth lockout overhead' },
              { name: 'Mountain Climbers', sets: 4, reps: '45s', weight: 0, rest: '30s', tip: 'Fast cadence' },
            ],
          },
          {
            day: 'Day 7 — Rest & Restorative Stretching',
            exercises: [
              { name: 'Rest and Hydration Reset', sets: 1, reps: 'Full Day', weight: 0, rest: '0s', tip: 'Focus on hydration and tissue restoration' },
            ],
          },
        ],
      },
      functional_endurance: {
        label: 'Gym Endurance — Functional / Hyrox Split',
        description: 'Functional hybrid training split combining ergs, carries, sleds, and high-volume bodyweight work.',
        days: [
          {
            day: 'Day 1 — Functional Strength Endurance (Carries & Sleds)',
            exercises: [
              { name: 'Sled Push (Heavy)', sets: 5, reps: '25m', weight: 90, rest: '60s', tip: 'Low body angle, drive with balls of feet' },
              { name: 'Dual Kettlebell Farmer Carry', sets: 4, reps: '50m', weight: 24, rest: '60s', tip: 'Shoulders back, steady breathing' },
              { name: 'Wall Balls', sets: 4, reps: '20', weight: 9, rest: '45s', tip: 'Full depth squat into 10ft target throw' },
              { name: 'Sandbag Lunges', sets: 3, reps: '20m', weight: 20, rest: '60s', tip: 'Hug sandbag tightly to chest' },
            ],
          },
          {
            day: 'Day 2 — Tempo Run & Ergometer Base',
            exercises: [
              { name: '5km Aerobic Pace Run', sets: 1, reps: '5km', weight: 0, rest: '0s', tip: 'Consistent sub-maximal pace' },
              { name: 'Rowing Machine 2000m', sets: 1, reps: '2000m', weight: 0, rest: '0s', tip: 'Steady 2:00-2:05/500m split' },
              { name: 'Hollow Body Holds', sets: 4, reps: '45s', weight: 0, rest: '30s', tip: 'Lower back glued to floor' },
            ],
          },
          {
            day: 'Day 3 — Upper Body Stamina & Complex',
            exercises: [
              { name: 'Dumbbell Clean & Press', sets: 4, reps: '12', weight: 16, rest: '60s', tip: 'Fluid transition from hips to shoulders to overhead' },
              { name: 'Pull-Up Ladders (1 to 5 to 1)', sets: 3, reps: '15 total', weight: 0, rest: '45s', tip: 'Strict form, no kipping' },
              { name: 'Push-Ups on Dumbbells', sets: 4, reps: '20', weight: 0, rest: '45s', tip: 'Deeper chest stretch' },
              { name: 'SkiErg Intervals', sets: 4, reps: '250m', weight: 0, rest: '60s', tip: 'Engage lats and core on pull' },
            ],
          },
          {
            day: 'Day 4 — Active Recovery & Joint Flossing',
            exercises: [
              { name: 'Easy Stationary Spin', sets: 1, reps: '25 min', weight: 0, rest: '0s', tip: 'Light spin at 90 RPM' },
              { name: 'Thoracic & Hip Mobility', sets: 1, reps: '15 min', weight: 0, rest: '0s', tip: 'Restore range of motion' },
            ],
          },
          {
            day: 'Day 5 — Lower Body Power Endurance',
            exercises: [
              { name: 'Goblet Squats', sets: 4, reps: '20', weight: 24, rest: '45s', tip: 'Keep chest upright' },
              { name: 'Box Step-Overs (with Dumbbells)', sets: 4, reps: '16 total', weight: 14, rest: '45s', tip: 'Drive through lead leg' },
              { name: 'Kettlebell Deadlifts (High Rep)', sets: 4, reps: '20', weight: 32, rest: '45s', tip: 'Sharp hip hinge' },
              { name: 'Broad Jumps', sets: 4, reps: '8', weight: 0, rest: '60s', tip: 'Stick the landing' },
            ],
          },
          {
            day: 'Day 6 — Hyrox / Engine Simulation',
            exercises: [
              { name: '1000m SkiErg', sets: 1, reps: '1000m', weight: 0, rest: '60s', tip: 'Pace management' },
              { name: 'Sled Pull (Rope)', sets: 4, reps: '20m', weight: 70, rest: '60s', tip: 'Hand-over-hand pull' },
              { name: 'Burpee Broad Jumps', sets: 3, reps: '20m', weight: 0, rest: '60s', tip: 'Controlled jump distance' },
              { name: '1000m Row + 100 Wall Balls', sets: 1, reps: 'Finish', weight: 9, rest: '0s', tip: 'Final engine test' },
            ],
          },
          {
            day: 'Day 7 — Rest & Muscle Reset',
            exercises: [
              { name: 'Full Rest Day', sets: 1, reps: 'Full Day', weight: 0, rest: '0s', tip: 'Fuel with complex carbs and adequate water' },
            ],
          },
        ],
      },
    },
  },
}

export default workoutData

export function getWorkoutPlan(location = 'gym', goal = 'hypertrophy', split = 'ppl') {
  const locData = workoutData[location] || workoutData.gym
  const goalData = locData[goal] || locData.hypertrophy
  return goalData[split] || Object.values(goalData)[0] || null
}
