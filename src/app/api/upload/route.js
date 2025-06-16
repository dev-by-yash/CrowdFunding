import { NextResponse } from 'next/server';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

const client = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await client.add(buffer);

        return NextResponse.json({ hash: result.path });
    } catch (error) {
        console.error('IPFS upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}