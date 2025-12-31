import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SAMPLE_QUESTIONS } from '@/data/questions';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('passaparola');
    const collection = db.collection('questions');

    // Check if questions already exist
    const count = await collection.countDocuments();

    if (count > 0) {
      return NextResponse.json({
        success: false,
        message: `Database already has ${count} questions. Clear the collection first if you want to re-seed.`
      });
    }

    // Convert sample questions to MongoDB format
    const questionsToInsert = SAMPLE_QUESTIONS.map(q => ({
      letter: q.letter,
      question: q.question,
      answer: q.answer.toLowerCase(),
      createdAt: new Date(),
      usageCount: 0
    }));

    // Insert all questions
    const result = await collection.insertMany(questionsToInsert);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} questions`,
      insertedCount: result.insertedCount
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clear all questions (use with caution!)
export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db('passaparola');
    const collection = db.collection('questions');

    const result = await collection.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} questions`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear database' },
      { status: 500 }
    );
  }
}
