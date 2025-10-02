import { supabase } from './supabase';
import { InvoiceType } from './types';

export async function saveInvoiceToSupabase(invoiceData: InvoiceType) {
  try {

    const { data, error } = await supabase.from('invoices').insert([invoiceData]).select();

    if (error) {
      console.error('❌ Error saving invoice:', error);
      return { success: false, error };
    }

    console.log('✅ Invoice saved successfully:', data);
    return { success: true, data };
  } catch (e) {
    console.error('❌ Unexpected error saving invoice:', e);
    return { success: false, error: e };
  }
}