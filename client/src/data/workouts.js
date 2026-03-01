// ============================================================
// workouts.js — Static workout plans
// ============================================================

const workoutData = {
  home: {
    hypertrophy: {
      label: 'Home Hypertrophy',
      description: 'Build muscle with bodyweight and minimal equipment. High volume, controlled tempo.',
      days: [
        {
          day: 'Day 1 — Push',
          exercises: [
            { name: 'Push-Ups', sets: 4, reps: '15-20', rest: '60s', tip: 'Keep core tight, full range of motion' },
            { name: 'Pike Push-Ups', sets: 3, reps: '12-15', rest: '60s', tip: 'Great for shoulder development' },
            { name: 'Diamond Push-Ups', sets: 3, reps: '10-12', rest: '60s', tip: 'Targets triceps heavily' },
            { name: 'Dips (chair)', sets: 3, reps: '12-15', rest: '60s', tip: 'Keep elbows close to body' },
            { name: 'Pseudo Planche Push-Ups', sets: 3, reps: '8-10', rest: '90s', tip: 'Lean forward for more chest activation' },
          ],
        },
        {
          day: 'Day 2 — Pull',
          exercises: [
            { name: 'Inverted Rows (table)', sets: 4, reps: '12-15', rest: '60s', tip: 'Pull chest to table edge' },
            { name: 'Doorframe Rows', sets: 3, reps: '12-15', rest: '60s', tip: 'Keep body straight, full pull' },
            { name: 'Superman Hold', sets: 3, reps: '30s hold', rest: '45s', tip: 'Squeeze glutes and back' },
            { name: 'Reverse Snow Angels', sets: 3, reps: '15', rest: '45s', tip: 'Slow and controlled' },
            { name: 'Towel Curls', sets: 3, reps: '12-15', rest: '60s', tip: 'Use a heavy bag as resistance' },
          ],
        },
        {
          day: 'Day 3 — Legs',
          exercises: [
            { name: 'Squats', sets: 4, reps: '20-25', rest: '60s', tip: 'Full depth, knees track toes' },
            { name: 'Bulgarian Split Squats', sets: 3, reps: '15 each', rest: '60s', tip: 'Rear foot elevated on chair' },
            { name: 'Glute Bridges', sets: 4, reps: '20', rest: '45s', tip: 'Squeeze hard at the top' },
            { name: 'Wall Sit', sets: 3, reps: '60s hold', rest: '60s', tip: 'Thighs parallel to floor' },
            { name: 'Calf Raises', sets: 4, reps: '25-30', rest: '30s', tip: 'Full range, slow descent' },
          ],
        },
      ],
    },
    strength: {
      label: 'Home Strength',
      description: 'Build raw strength using progressive bodyweight overload and isometric holds.',
      days: [
        {
          day: 'Day 1 — Upper Strength',
          exercises: [
            { name: 'Archer Push-Ups', sets: 5, reps: '5 each side', rest: '90s', tip: 'Slow eccentric for more tension' },
            { name: 'Pseudo Planche Hold', sets: 4, reps: '20s hold', rest: '90s', tip: 'Build towards planche progressively' },
            { name: 'Pike Push-Up Negatives', sets: 4, reps: '5 (5s down)', rest: '120s', tip: 'Control the descent' },
            { name: 'Explosive Push-Ups', sets: 4, reps: '5-8', rest: '120s', tip: 'Max power each rep' },
          ],
        },
        {
          day: 'Day 2 — Lower Strength',
          exercises: [
            { name: 'Pistol Squat Progressions', sets: 5, reps: '5 each', rest: '120s', tip: 'Use door for balance assist' },
            { name: 'Nordic Hamstring Curls', sets: 4, reps: '5', rest: '120s', tip: 'Anchor feet under sofa' },
            { name: 'Shrimp Squats', sets: 4, reps: '6 each', rest: '90s', tip: 'Rear foot held behind back' },
            { name: 'Jump Squats', sets: 3, reps: '8', rest: '90s', tip: 'Max height every rep' },
          ],
        },
      ],
    },
    endurance: {
      label: 'Home Endurance',
      description: 'Boost cardiovascular fitness and muscular endurance with circuit-style training.',
      days: [
        {
          day: 'Day 1 — Cardio Circuit',
          exercises: [
            { name: 'Jumping Jacks', sets: 3, reps: '60s', rest: '20s', tip: 'Keep pace consistent' },
            { name: 'High Knees', sets: 3, reps: '45s', rest: '15s', tip: 'Drive knees above hip level' },
            { name: 'Burpees', sets: 3, reps: '10', rest: '30s', tip: 'Full push-up at bottom' },
            { name: 'Mountain Climbers', sets: 3, reps: '45s', rest: '15s', tip: 'Fast and controlled' },
            { name: 'Squat Jumps', sets: 3, reps: '15', rest: '20s', tip: 'Land softly' },
          ],
        },
        {
          day: 'Day 2 — Stamina Build',
          exercises: [
            { name: 'Push-Up Ladder (1-10)', sets: 1, reps: '55 total', rest: 'Minimal', tip: '1, 2, 3...10 reps per mini set' },
            { name: 'Squat Hold Pulses', sets: 3, reps: '60s', rest: '30s', tip: 'Stay in squat position' },
            { name: 'Plank to Downward Dog', sets: 3, reps: '15', rest: '30s', tip: 'Breathe throughout' },
            { name: 'Bear Crawl', sets: 3, reps: '30s', rest: '20s', tip: 'Keep hips low' },
          ],
        },
      ],
    },
  },
  gym: {
    hypertrophy: {
      label: 'Gym Hypertrophy',
      description: 'Classic bodybuilding split. Moderate weight, high volume, maximize muscle growth.',
      days: [
        {
          day: 'Day 1 — Chest & Triceps',
          exercises: [
            { name: 'Barbell Bench Press', sets: 4, reps: '8-12', rest: '90s', tip: 'Arch your back, retract scapula' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90s', tip: '30-45° angle for upper chest' },
            { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60s', tip: 'Full stretch at bottom' },
            { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '60s', tip: 'Elbows locked to sides' },
            { name: 'Overhead Tricep Extension', sets: 3, reps: '12', rest: '60s', tip: 'Long head emphasis' },
          ],
        },
        {
          day: 'Day 2 — Back & Biceps',
          exercises: [
            { name: 'Deadlift', sets: 4, reps: '6-8', rest: '120s', tip: 'Hip hinge, flat back always' },
            { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '90s', tip: 'Pull to lower chest' },
            { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '90s', tip: 'Lean back slightly' },
            { name: 'Seated Cable Row', sets: 3, reps: '12', rest: '60s', tip: 'Full stretch and full squeeze' },
            { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '60s', tip: 'No swinging' },
            { name: 'Hammer Curls', sets: 3, reps: '12', rest: '60s', tip: 'Neutral grip for brachialis' },
          ],
        },
        {
          day: 'Day 3 — Legs',
          exercises: [
            { name: 'Barbell Squat', sets: 4, reps: '8-12', rest: '120s', tip: 'Sit into it, drive through heels' },
            { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: '90s', tip: 'Feel hamstring stretch' },
            { name: 'Leg Press', sets: 3, reps: '12-15', rest: '90s', tip: 'Full range without locking out' },
            { name: 'Leg Curl', sets: 3, reps: '12-15', rest: '60s', tip: 'Controlled negative' },
            { name: 'Standing Calf Raise', sets: 4, reps: '15-20', rest: '60s', tip: 'Pause at top and bottom' },
          ],
        },
        {
          day: 'Day 4 — Shoulders',
          exercises: [
            { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '90s', tip: 'Bar path straight up' },
            { name: 'Lateral Raises', sets: 4, reps: '15-20', rest: '45s', tip: 'Lead with elbows, slight lean' },
            { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s', tip: 'External rotation at end' },
            { name: 'Front Raises', sets: 3, reps: '12', rest: '60s', tip: 'Alternate arms for control' },
          ],
        },
      ],
    },
    strength: {
      label: 'Gym Strength (Powerbuilding)',
      description: 'Compound-focused strength training. Heavy loads, low reps, long rest. Build real power.',
      days: [
        {
          day: 'Day 1 — Squat Focus',
          exercises: [
            { name: 'Back Squat', sets: 5, reps: '3-5', rest: '3-5 min', tip: 'Work up to 85-90% 1RM' },
            { name: 'Front Squat', sets: 3, reps: '5', rest: '3 min', tip: 'Upper back rigid, elbows high' },
            { name: 'Leg Press', sets: 3, reps: '8', rest: '2 min', tip: 'Supplemental volume' },
            { name: 'Pause Squats', sets: 3, reps: '3 (3s pause)', rest: '3 min', tip: 'Build out of the hole' },
          ],
        },
        {
          day: 'Day 2 — Bench Focus',
          exercises: [
            { name: 'Bench Press', sets: 5, reps: '3-5', rest: '3-5 min', tip: 'Max tension throughout the lift' },
            { name: 'Close Grip Bench', sets: 3, reps: '5', rest: '3 min', tip: 'Builds lockout strength' },
            { name: 'Weighted Dips', sets: 3, reps: '5-8', rest: '3 min', tip: 'Add weight belt for progression' },
            { name: 'JM Press', sets: 3, reps: '6', rest: '2 min', tip: 'Hybrid tricep movement' },
          ],
        },
        {
          day: 'Day 3 — Deadlift Focus',
          exercises: [
            { name: 'Conventional Deadlift', sets: 5, reps: '3-5', rest: '4-5 min', tip: 'Bar stays over mid-foot' },
            { name: 'Deficit Deadlift', sets: 3, reps: '4', rest: '3 min', tip: 'Builds off-the-floor strength' },
            { name: 'Barbell Row', sets: 4, reps: '5', rest: '2 min', tip: 'Heavy, controlled' },
            { name: 'Farmer Carries', sets: 4, reps: '40m walk', rest: '90s', tip: 'Heavy as possible' },
          ],
        },
      ],
    },
    endurance: {
      label: 'Gym Endurance',
      description: 'Metabolic conditioning using gym equipment. High reps, short rest, push your limits.',
      days: [
        {
          day: 'Day 1 — Upper Endurance',
          exercises: [
            { name: 'Barbell Complex (RDL-Row-Clean-Press)', sets: 5, reps: '6 each', rest: '90s', tip: 'Light weight, no rest between movements' },
            { name: 'Pull-Ups', sets: 4, reps: 'Max reps', rest: '60s', tip: 'Full hang to full chin above bar' },
            { name: 'Push-Ups', sets: 4, reps: 'Max reps', rest: '60s', tip: 'Perfect form every rep' },
            { name: 'Dumbbell Circuit', sets: 3, reps: '15 each', rest: '60s', tip: 'Curl-Press-Lateral-Row circuit' },
          ],
        },
        {
          day: 'Day 2 — Lower + Cardio',
          exercises: [
            { name: 'Goblet Squat', sets: 5, reps: '20', rest: '45s', tip: 'Controlled breathing throughout' },
            { name: 'Kettlebell Swings', sets: 5, reps: '20', rest: '45s', tip: 'Hip drive, not arm lift' },
            { name: 'Rowing Machine', sets: 4, reps: '500m', rest: '90s', tip: 'Legs-back-arms pull sequence' },
            { name: 'Box Jumps', sets: 4, reps: '10', rest: '60s', tip: 'Land softly, step down' },
          ],
        },
      ],
    },
  },
}

export default workoutData

export function getWorkoutPlan(location, goal) {
  return workoutData[location]?.[goal] || null
}
