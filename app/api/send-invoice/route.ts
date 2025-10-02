import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientEmail, pdfBufferBase64, filename } = body;

    if (!clientEmail || typeof clientEmail !== 'string') {
      return NextResponse.json({ success: false, error: 'Correo no válido.' }, { status: 400 });
    }

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: clientEmail,
      subject: 'Tu factura',
      html: '<p>Gracias por tu compra. Adjuntamos tu factura en PDF.</p>',
      attachments: [
        {
          filename: filename ?? 'factura.pdf',
          content: pdfBufferBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : error });
  }
}
