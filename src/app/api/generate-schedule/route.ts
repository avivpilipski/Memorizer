import { NextResponse } from 'next/server';
import { PracticeSession } from '../../../types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pieceName, complexity, duration, learningTime, performanceDate } = body;
    
    // Validate inputs
    if (!pieceName || !complexity || !duration || !performanceDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Calculate days until performance
    const today = new Date();
    const performanceDay = new Date(performanceDate);
    const daysUntilPerformance = Math.ceil((performanceDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilPerformance <= 0) {
      return NextResponse.json({ error: 'Performance date must be in the future' }, { status: 400 });
    }
    
    // Generate practice schedule
    const schedule = generatePracticeSchedule(
      parseInt(complexity),
      parseInt(duration),
      parseInt(learningTime) || 0,
      daysUntilPerformance
    );
    
    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('Error generating schedule:', error);
    return NextResponse.json({ error: 'Failed to generate schedule' }, { status: 500 });
  }
}

function generatePracticeSchedule(
  complexity: number,
  duration: number,
  learningTime: number,
  daysUntilPerformance: number
): PracticeSession[] {
  const schedule: PracticeSession[] = [];
  
  // Calculate total practice days
  const totalPracticeDays = Math.min(daysUntilPerformance, 30); // Cap at 30 days
  
  // Calculate practice phases based on complexity and time
  const learningPhase = Math.floor(totalPracticeDays * 0.4);
  const interpretationPhase = Math.floor(totalPracticeDays * 0.3);
  const performancePhase = Math.floor(totalPracticeDays * 0.2);
  const finalPhase = totalPracticeDays - learningPhase - interpretationPhase - performancePhase;
  
  // Calculate practice duration per day based on piece complexity and duration
  const baseDuration = Math.max(20, Math.min(60, duration * (complexity / 3) * 10));
  
  // Generate dates and sessions
  const today = new Date();
  
  // Learning phase
  for (let i = 0; i < learningPhase; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const focusOptions = [
      "Learning - Note accuracy",
      "Learning - Technical passages",
      "Learning - Structure analysis",
      "Learning - Fingering and technique"
    ];
    
    const focus = focusOptions[Math.floor(Math.random() * focusOptions.length)];
    const practiceDuration = Math.round(baseDuration * (1 + (Math.random() * 0.2 - 0.1)));
    
    schedule.push({
      day: i + 1,
      date: date.toISOString().split('T')[0],
      focus,
      duration: practiceDuration
    });
  }
  
  // Interpretation phase
  for (let i = 0; i < interpretationPhase; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + learningPhase + i);
    
    const focusOptions = [
      "Interpretation - Dynamics and phrasing",
      "Interpretation - Musical expression",
      "Interpretation - Tempo variations",
      "Interpretation - Stylistic elements"
    ];
    
    const focus = focusOptions[Math.floor(Math.random() * focusOptions.length)];
    const practiceDuration = Math.round(baseDuration * (1 + (Math.random() * 0.2 - 0.1)));
    
    schedule.push({
      day: learningPhase + i + 1,
      date: date.toISOString().split('T')[0],
      focus,
      duration: practiceDuration
    });
  }
  
  // Performance preparation phase
  for (let i = 0; i < performancePhase; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + learningPhase + interpretationPhase + i);
    
    const focusOptions = [
      "Performance - Run-throughs",
      "Performance - Memory reinforcement",
      "Performance - Difficult sections",
      "Performance - Endurance practice"
    ];
    
    const focus = focusOptions[Math.floor(Math.random() * focusOptions.length)];
    const practiceDuration = Math.round(baseDuration * (1 + (Math.random() * 0.2 - 0.1)));
    
    schedule.push({
      day: learningPhase + interpretationPhase + i + 1,
      date: date.toISOString().split('T')[0],
      focus,
      duration: practiceDuration
    });
  }
  
  // Final preparation phase
  for (let i = 0; i < finalPhase; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + learningPhase + interpretationPhase + performancePhase + i);
    
    const focusOptions = [
      "Final - Performance simulation",
      "Final - Mental preparation",
      "Final - Polishing details",
      "Final - Stage presence"
    ];
    
    const focus = focusOptions[Math.floor(Math.random() * focusOptions.length)];
    const practiceDuration = Math.round(baseDuration * (1 + (Math.random() * 0.2 - 0.1)));
    
    schedule.push({
      day: learningPhase + interpretationPhase + performancePhase + i + 1,
      date: date.toISOString().split('T')[0],
      focus,
      duration: practiceDuration
    });
  }
  
  return schedule;
}