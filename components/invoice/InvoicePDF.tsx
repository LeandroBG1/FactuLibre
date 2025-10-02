// components/invoice/InvoicePDF.tsx

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from "@react-pdf/renderer";

type Item = {
  description: string;
  quantity: number;
  price: number;
};

type InvoicePDFProps = {
  clientName: string;
  date: string;
  items: Item[];
  total: number;
};

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  table: { flexDirection: "column", width: "auto", marginVertical: 10 },
  row: { flexDirection: "row", borderBottom: "1 solid #ccc", padding: 5 },
  cellHeader: { flex: 1, fontWeight: "bold" },
  cell: { flex: 1 },
});

const InvoicePDF: React.FC<InvoicePDFProps> = ({ clientName, date, items }) => {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Factura - FactuLibre</Text>
        </View>
        <View style={styles.section}>
          <Text>Cliente: {clientName}</Text>
          <Text>Fecha: {date}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Descripción</Text>
            <Text style={styles.cellHeader}>Cantidad</Text>
            <Text style={styles.cellHeader}>Precio</Text>
            <Text style={styles.cellHeader}>Subtotal</Text>
          </View>
          {items.map((item, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={styles.cell}>{item.description}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>${item.price.toFixed(2)}</Text>
              <Text style={styles.cell}>${(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text>IVA (16%): ${tax.toFixed(2)}</Text>
          <Text>Total: ${total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
