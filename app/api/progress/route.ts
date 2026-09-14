import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { writeClient } from "@/sanity/lib/writeClient";
import { LEARNER_PROGRESS_QUERY } from "@/sanity/lib/queries";

const progressPayloadSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean().optional(),
  resumePosition: z.number().min(0).optional(),
});

/**
 * GET /api/progress
 * Retrieves the authenticated learner's progress across all lessons.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ progress: {} });
    }

    const records = await writeClient.fetch<{
      _id: string;
      lessonId: string | null;
      completed: boolean | null;
      resumePosition: number | null;
      updatedAt: string | null;
    }[]>(LEARNER_PROGRESS_QUERY, { userId });

    const progressMap: Record<
      string,
      { completed: boolean; resumePosition: number; updatedAt?: string }
    > = {};

    for (const record of records) {
      if (record.lessonId) {
        progressMap[record.lessonId] = {
          completed: Boolean(record.completed),
          resumePosition: record.resumePosition ?? 0,
          updatedAt: record.updatedAt ?? undefined,
        };
      }
    }

    return NextResponse.json({ progress: progressMap });
  } catch (error) {
    console.error("[api/progress GET] Failed to fetch progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch learner progress", progress: {} },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress
 * Persists learner progress for a lesson.
 * Keyed by Clerk userId.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = progressPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid progress payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { lessonId, completed, resumePosition } = parsed.data;
    const { userId } = await auth();

    // If anonymous, return success with anonymous flag (client uses localStorage)
    if (!userId) {
      return NextResponse.json({ ok: true, anonymous: true });
    }

    // Deterministic document ID per user and lesson
    const cleanUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const cleanLessonId = lessonId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const docId = `progress.${cleanUserId}.${cleanLessonId}`;

    const existing = await writeClient.getDocument<{
      _id: string;
      completed?: boolean;
      resumePosition?: number;
    }>(docId);

    const updatedDoc = {
      _id: docId,
      _type: "learnerProgress",
      userId,
      lesson: {
        _type: "reference",
        _ref: lessonId,
      },
      completed:
        completed !== undefined ? completed : (existing?.completed ?? false),
      resumePosition:
        resumePosition !== undefined
          ? resumePosition
          : (existing?.resumePosition ?? 0),
      updatedAt: new Date().toISOString(),
    };

    await writeClient.createOrReplace(updatedDoc);

    return NextResponse.json({
      ok: true,
      progress: {
        lessonId,
        completed: updatedDoc.completed,
        resumePosition: updatedDoc.resumePosition,
      },
    });
  } catch (error) {
    console.error("[api/progress POST] Failed to save progress:", error);
    return NextResponse.json(
      { error: "Failed to save learner progress" },
      { status: 500 }
    );
  }
}
