import { NextRequest, NextResponse } from 'next/server';

type PracticeSession = {
  day: number;
  date: string;
  focus: string;
  duration: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pieceName, complexity, duration, learningTime, performanceDate } = body;
    
    // Validate inputs
    if (!pieceName || !complexity || !duration || !performanceDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate days until performance
    const today = new Date();
    const performanceDay = new Date(performanceDate);
    const daysUntilPerformance = Math.ceil(
      (performanceDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilPerformance <= 0) {
      return NextResponse.json(
        { error: 'Performance date must be in the future' },
        { status: 400 }
      );
    }

    // Generate practice schedule
    const practiceSchedule = generatePracticeSchedule(
      pieceName,
      parseInt(complexity),
      parseInt(duration),
      parseInt(learningTime) || 0,
      daysUntilPerformance
    );

    return NextResponse.json({ schedule: practiceSchedule });
  } catch (error) {
    console.error('Error generating practice schedule:', error);
    return NextResponse.json(
      { error: 'Failed to generate practice schedule' },
      { status: 500 }
    );
  }
}

function generatePracticeSchedule(
  pieceName: string,
  complexity: number,
  duration: number,
  learningTime: number,
  daysUntilPerformance: number
): PracticeSession[] {
  const schedule: PracticeSession[] = [];
  const today = new Date();
  
  // Determine practice frequency based on complexity and time until performance
  let practiceFrequency = 1; // Default: practice every day
  
  if (complexity <= 2 && daysUntilPerformance > 14) {
    practiceFrequency = 2; // Every other day for easier pieces with plenty of time
  } else if (complexity >= 4 && daysUntilPerformance < 7) {
    practiceFrequency = 1; // Every day for difficult pieces with little time
  } else if (daysUntilPerformance > 30) {
    practiceFrequency = 3; // Every third day for very long-term preparation
  }
  
  // Adjust practice duration based on piece complexity
  const basePracticeDuration = Math.max(30, duration * 2); // Minimum 30 minutes
  const maxPracticeDuration = Math.min(120, basePracticeDuration * (complexity / 3)); // Cap at 2 hours
  
  // Generate practice sessions
  for (let day = 0; day < daysUntilPerformance; day++) {
    if (day % practiceFrequency !== 0) continue;
    
    const practiceDate = new Date(today);
    practiceDate.setDate(today.getDate() + day);
    
    // Determine focus areas based on progress through schedule
    let focus = '';
    let practiceDuration = maxPracticeDuration;
    
    const progressPercentage = day / daysUntilPerformance;
    
    if (progressPercentage < 0.3) {
      // Early stage: focus on technical aspects and learning
      focus = learningTime > 0 ? 'Review and technical work' : 'Learning and technical foundation';
      practiceDuration = maxPracticeDuration * 0.8; // Slightly shorter in early stages
    } else if (progressPercentage < 0.7) {
      // Middle stage: focus on interpretation and difficult passages
      focus = 'Interpretation and challenging sections';
      practiceDuration = maxPracticeDuration; // Full duration in middle stages
    } else {
      // Late stage: focus on performance preparation
      focus = 'Performance preparation and run-throughs';
      practiceDuration = maxPracticeDuration * 0.9; // Slightly shorter in final stages
    }
    
    // Add special focus for days close to performance
    if (daysUntilPerformance - day <= 3) {
      focus = 'Final performance preparation';
      practiceDuration = maxPracticeDuration * 0.7; // Shorter sessions close to performance
    }
    
    schedule.push({
      day: day + 1,
      date: practiceDate.toISOString().split('T')[0],
      focus,
      duration: Math.round(practiceDuration)
    });
  }
  
  return schedule;
}