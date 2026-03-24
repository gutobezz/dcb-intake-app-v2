import { StyleSheet } from "@react-pdf/renderer";

const NAVY = "#0f1d2c";
const WHITE = "#ffffff";
const GRAY_100 = "#f3f4f6";
const GRAY_200 = "#e5e7eb";
const GRAY_400 = "#9ca3af";
const GRAY_600 = "#4b5563";
const GRAY_700 = "#374151";
const GRAY_900 = "#111827";

export const styles = StyleSheet.create({
  // ── Page ──
  page: {
    width: "8.5in",
    height: "11in",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: GRAY_900,
  },

  // ── Cover ──
  coverPage: {
    backgroundColor: NAVY,
    color: WHITE,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
  coverTop: {
    alignItems: "center",
    paddingTop: 80,
  },
  coverLogoMain: {
    fontSize: 42,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 8,
    textAlign: "center",
  },
  coverLogoSub: {
    fontSize: 14,
    letterSpacing: 6,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 4,
  },
  coverLogoTagline: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    opacity: 0.6,
    marginTop: 4,
    textAlign: "center",
  },
  coverDivider: {
    width: 60,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 20,
  },
  coverTitle: {
    fontSize: 18,
    letterSpacing: 5,
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Helvetica",
  },
  coverCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60,
  },
  coverClientName: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  coverAddress: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 30,
  },
  coverScopeTitle: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    opacity: 0.5,
    textAlign: "center",
    marginBottom: 10,
  },
  coverScopeItem: {
    fontSize: 10,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 4,
  },
  coverPrice: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 24,
  },
  coverBottom: {
    alignItems: "center",
    paddingBottom: 50,
  },
  coverDate: {
    fontSize: 10,
    opacity: 0.6,
  },
  coverLicense: {
    fontSize: 7,
    opacity: 0.4,
    marginTop: 4,
  },

  // ── TOC ──
  tocPage: {
    padding: 60,
  },
  tocTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: NAVY,
    textAlign: "center",
    marginBottom: 40,
  },
  tocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: GRAY_200,
    paddingVertical: 10,
  },
  tocLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  tocPageNum: {
    fontSize: 10,
    color: GRAY_400,
  },

  // ── Header bar (scope, payment, notes pages) ──
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: NAVY,
    paddingHorizontal: 48,
    paddingVertical: 14,
  },
  headerText: {
    fontSize: 8,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  // ── Scope ──
  scopeTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: NAVY,
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_200,
  },
  scopeBody: {
    paddingHorizontal: 48,
    paddingVertical: 24,
  },
  scopeItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  scopeCheckbox: {
    width: 14,
    height: 14,
    backgroundColor: NAVY,
    borderRadius: 2,
    marginRight: 10,
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scopeCheck: {
    color: WHITE,
    fontSize: 8,
  },
  scopeItemContent: {
    flex: 1,
  },
  scopeItemTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  scopeItemDesc: {
    fontSize: 8,
    color: GRAY_600,
    lineHeight: 1.5,
    marginTop: 3,
  },
  scopeItemNote: {
    fontSize: 8,
    color: GRAY_400,
    fontStyle: "italic",
    marginTop: 3,
  },

  // ── Payment / Allowances ──
  paymentBody: {
    paddingHorizontal: 48,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: NAVY,
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    paddingBottom: 8,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: GRAY_100,
    paddingVertical: 8,
  },
  tableFooterRow: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: NAVY,
    paddingTop: 8,
    marginTop: 4,
  },
  tableCellLeft: {
    flex: 1,
    fontSize: 9,
    color: GRAY_700,
  },
  tableCellCenter: {
    width: 80,
    textAlign: "center",
    fontSize: 9,
    color: GRAY_400,
  },
  tableCellRight: {
    width: 100,
    textAlign: "right",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: GRAY_900,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  totalLabel: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  totalAmount: {
    width: 100,
    textAlign: "right",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },

  // ── Notes ──
  notesBody: {
    paddingHorizontal: 48,
    paddingVertical: 30,
  },
  noteItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  noteNumber: {
    width: 20,
    fontSize: 7,
    color: GRAY_600,
  },
  noteText: {
    flex: 1,
    fontSize: 7,
    color: GRAY_600,
    lineHeight: 1.5,
  },

  // ── Thank You ──
  thankYouPage: {
    backgroundColor: NAVY,
    color: WHITE,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  thankYouLogo: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 8,
    textAlign: "center",
  },
  thankYouLogoSub: {
    fontSize: 12,
    letterSpacing: 6,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 4,
  },
  thankYouTitle: {
    fontSize: 24,
    letterSpacing: 5,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 8,
  },
  thankYouSubtext: {
    fontSize: 10,
    opacity: 0.6,
    textAlign: "center",
    marginTop: 12,
  },
  thankYouUrl: {
    fontSize: 10,
    opacity: 0.8,
    textAlign: "center",
  },
  thankYouLicense: {
    fontSize: 7,
    opacity: 0.4,
    marginTop: 6,
    textAlign: "center",
  },

  // ── Page number (footer) ──
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 48,
    fontSize: 8,
    color: GRAY_400,
  },
});
