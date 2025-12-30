import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { FirebaseError } from "firebase/app";

export async function POST(req: NextRequest) {
    try {
        const { serviceAccount, token, topic } = await req.json();

        if (!serviceAccount || !token || !topic) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (topic === "all_users") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Protected Group: You cannot unsubscribe from the default 'all_users' group."
                },
                { status: 403 }
            );
        }

        const appName = `app-${serviceAccount.project_id}`;
        let app = admin.apps.find((a) => a?.name === appName);

        if (!app) {
            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            }, appName);
        }

        const messaging = admin.messaging(app);

        const response = await messaging.unsubscribeFromTopic([token], topic);

        return NextResponse.json({
            success: true,
            results: response,
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
