import { seedRoadmapToFirestore } from '@/lib/seedRoadmap';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await seedRoadmapToFirestore();
    return NextResponse.json({ success: true, message: "Roadmaps seeded to Firestore" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
