import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usa la key privada en server-side
);

export const uploadPdfToSupabase = async (
  pdfBuffer: Buffer,
  fileName: string
): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('invoices')
    .upload(`pdfs/${fileName}.pdf`, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading PDF:', error.message);
    return null;
  }

  const url = supabase.storage
    .from('invoices')
    .getPublicUrl(`pdfs/${fileName}.pdf`).data.publicUrl;

  return url;
};