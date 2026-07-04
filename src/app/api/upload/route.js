export const runtime = 'nodejs';

import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const formData = await req.formData();

        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: 'nextjs_uploads'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('UPLOAD ERROR:', error);

        return NextResponse.json(
            {
                error: error.message || 'Upload failed'
            },
            { status: 500 }
        );
    }
}
