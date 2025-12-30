import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { FirebaseError } from "firebase/app";

export async function POST(req: NextRequest) {
  try {
    const { serviceAccount, token, topic } = await req.json();

    if (!serviceAccount || !token || !topic) {
      return NextResponse.json(
        { error: "Service account, token, and topic are required" },
        { status: 400 }
      );
    }

    const appName = `app-${serviceAccount.project_id}`;
    let app = admin.apps.find((a) => a?.name === appName);

    if (!app) {
      app = admin.initializeApp(
        {
          credential: admin.credential.cert(serviceAccount),
        },
        appName
      );
    }

    const messaging = admin.messaging(app);

    const response = await messaging.subscribeToTopic([token], topic);

    if (response.failureCount > 0) {
      const fcmError = response.errors[0].error;
      return NextResponse.json(
        {
          success: false,
          error: fcmError.message,
          code: fcmError.code,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully subscribed to ${topic}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("FCM Subscription Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    const errorCode = error instanceof FirebaseError ? error.code : "unknown";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: errorCode,
      },
      { status: 500 }
    );
  }
}
