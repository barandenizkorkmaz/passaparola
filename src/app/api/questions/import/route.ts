import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { readFile } from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('passaparola');
    const collection = db.collection('questions');

    // Clear existing questions
    const deleteResult = await collection.deleteMany({});

    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'passaparola_questions.json');
    const fileContent = await readFile(jsonPath, 'utf-8');
    const questions = JSON.parse(fileContent);

    // Prepare questions for insertion
    // The letter is determined by the first letter of the answer (Turkish uppercase)
    const questionsToInsert = questions.map((q: any) => {
      const answer = q.answer.toLowerCase().trim();
      const firstLetter = answer.charAt(0).toLocaleUpperCase('tr-TR');

      return {
        letter: firstLetter,
        question: q.question,
        answer: answer,
        createdAt: new Date(),
        usageCount: 0,
      };
    });

    // Insert all questions
    const result = await collection.insertMany(questionsToInsert);

    // Count questions per letter
    const letterCounts = await collection.aggregate([
      { $group: { _id: '$letter', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.insertedCount} questions`,
      deleted: deleteResult.deletedCount,
      insertedCount: result.insertedCount,
      letterCounts: letterCounts.map(lc => ({ letter: lc._id, count: lc.count }))
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import questions', details: String(error) },
      { status: 500 }
    );
  }
}
