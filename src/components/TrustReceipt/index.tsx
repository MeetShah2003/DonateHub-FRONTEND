import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { SuccessTrustDonationTransaction } from "@/types/types";
import logo from "../../../public/images/donatehublogo.png";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    flexDirection: "row",
    border: 1,
  },
  tableCell: {
    width: "50%",
    padding: 5,
    borderRight: 1,
  },
});

// Receipt component
const TrustReceipt: React.FC<{
  transactionData: SuccessTrustDonationTransaction;
  firstName: string;
  lastName: string;
}> = ({ transactionData, firstName, lastName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logo */}
      <Image src={logo} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Donation Receipt</Text>

      {/* Transaction Details Table */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Transaction Details</Text>

        <View style={styles.table}>
          <View style={styles.tableCell}>
            <Text style={styles.text}>Transaction ID</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.text}>{transactionData?.paymentId}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableCell}>
            <Text style={styles.text}>Amount</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.text}>
              {"Rs" + transactionData?.manualDonatedAmount}
            </Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableCell}>
            <Text style={styles.text}>Donator Name</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.text}>
              {firstName} {lastName}
            </Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableCell}>
            <Text style={styles.text}>Transaction Date</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.text}>{transactionData?.transactionDate}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableCell}>
            <Text style={styles.text}>Status</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.text}>
              {transactionData?.paymentId ? "Success" : "Failed"}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default TrustReceipt;
