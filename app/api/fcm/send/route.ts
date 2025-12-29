import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { FirebaseError } from "firebase/app";

export async function POST(req: NextRequest) {
    try {
        const { serviceAccount, payload, target } = await req.json();

        if (!serviceAccount || !target || !payload) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

        const message = {
            token: target,
            notification: {
                title: payload.notification?.title || "Default Title",
                body: payload.notification?.body || "Default Body",
            },
            data: payload.data || {},
            webpush: {
                notification: {
                    title: payload.notification?.title || "Default Title",
                    body: payload.notification?.body || "Default Body",
                    requireInteraction: true,
                },
                fcmOptions: {
                    link: payload.data?.click_action || "/",
                },
            },
        };

        const response = await messaging.send(message);

        return NextResponse.json({
            success: true,
            messageId: response,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error("FCM Send Error:", error);

        const isError = error instanceof Error;
        const errorMessage = isError ? error.message : "Internal Server Error";
        const isFirebaseError = error instanceof FirebaseError
        const errorCode = isFirebaseError ? error.code : "unknown";

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                code: errorCode
            },
            { status: 500 }
        );
    }
}