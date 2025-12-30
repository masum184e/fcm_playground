import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { FirebaseError } from "firebase/app";

export async function POST(req: NextRequest) {
    try {
        const { serviceAccount, payload, target, targetType } = await req.json();

        if (!serviceAccount || !target || !payload || !targetType) {
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
        const targetConfig =
            targetType === "token" ? { token: target } :
                targetType === "topic" ? { topic: target } :
                    { topic: "all_users" };

                    const message: admin.messaging.Message = {
            ...targetConfig,
            notification: {
                title: payload.notification?.title || "Default Title",
                body: payload.notification?.body || "Default Body",
            },
            data: payload.data || {},
            // webpush: {
            //     notification: {
            //         title: payload.notification?.title || "Default Title",
            //         body: payload.notification?.body || "Default Body",
            //         requireInteraction: true,
            //         click_action: process.env.ENV ? "http://localhost:3000" : "https://fcm-playground.vercel.app",
            //         icon: "/icon.png"
            //     },
            //     fcmOptions: {
            //         link: process.env.ENV ? "http://localhost:3000" : "https://fcm-playground.vercel.app"
            //     },
            // },
        };

        //         const message: admin.messaging.Message = {
        //   ...targetConfig,
        //   data: {
        //     title: payload.notification?.title ?? "Default Title",
        //     body: payload.notification?.body ?? "Default Body",
        //   },
        // };

        const response = await messaging.send(message);

        return NextResponse.json({
            success: true,
            messageId: response,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("FCM Send Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
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