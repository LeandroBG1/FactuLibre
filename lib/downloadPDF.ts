"use client";

import { ReactElement } from "react";
import { pdf, DocumentProps } from "@react-pdf/renderer";

/**
 * Genera y descarga un PDF a partir de un componente React PDF.
 * @param document - Componente React basado en Document de @react-pdf/renderer
 * @param fileName - Nombre del archivo a descargar
 */
export const downloadPDF = async (
  document: ReactElement<DocumentProps>,
  fileName: string
) => {
  const blob = await pdf(document).toBlob();

  const url = URL.createObjectURL(blob);
  const a = window.document.createElement("a"); // ✅ corregido
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
