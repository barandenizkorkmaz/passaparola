import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { TURKISH_ALPHABET } from '@/data/questions';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('passaparola');
    const collection = db.collection('questions');

    // Fetch one random question for each letter
    const questions = await Promise.all(
      TURKISH_ALPHABET.map(async (letter) => {
        const results = await collection
          .aggregate([
            { $match: { letter } },
            { $sample: { size: 1 } }
          ])
          .toArray();

        return results[0] || null;
      })
    );

    // Filter out any null results (letters without questions)
    const validQuestions = questions.filter(q => q !== null);

    return NextResponse.json({
      success: true,
      questions: validQuestions,
      count: validQuestions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST endpoint to add a new question
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('passaparola');
    const collection = db.collection('questions');

    const body = await request.json();
    const { letter, question, answer } = body;

    if (!letter || !question || !answer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await collection.insertOne({
      letter: letter.toUpperCase(),
      question,
      answer: answer.toLowerCase(),
      createdAt: new Date(),
      usageCount: 0
    });

    return NextResponse.json({
      success: true,
      questionId: result.insertedId
    });
  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add question' },
      { status: 500 }
    );
  }
}
