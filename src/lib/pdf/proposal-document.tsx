import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Proposal } from "@/lib/types";
import { PROJECT_TYPES } from "@/lib/types";
import { DEFAULT_GENERAL_NOTES } from "@/lib/constants/general-notes";
import { styles } from "./pdf-styles";

// ── Helpers ──

function formatPrice(raw: string): string {
  if (!raw) return "--";
  const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return raw;
  return `$${num.toLocaleString("en-US")}`;
}

function getSelectedSections(proposal: Proposal) {
  return PROJECT_TYPES.filter((pt) =>
    proposal.projectTypes.includes(pt.id)
  ).map((pt) => ({
    ...pt,
    checkedItems: pt.items.filter(
      (item) => proposal.scopeItems[`${pt.id}::${item.id}`]
    ),
  }));
}

function proposalDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ── Cover Page ──

function CoverPage({ proposal }: { proposal: Proposal }) {
  const name = [proposal.firstName, proposal.lastName]
    .filter(Boolean)
    .join(" ");
  const sections = getSelectedSections(proposal);
  const price = formatPrice(proposal.projectPrice);
  const date = proposal.desiredStartDate || proposalDate();

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.coverPage}>
        {/* Top */}
        <View style={styles.coverTop}>
          <Text style={styles.coverLogoMain}>D&amp;C</Text>
          <Text style={styles.coverLogoSub}>Builders</Text>
          <Text style={styles.coverLogoTagline}>Design &amp; Create</Text>
          <View style={styles.coverDivider} />
          <Text style={styles.coverTitle}>Project Proposal</Text>
        </View>

        {/* Center */}
        <View style={styles.coverCenter}>
          <Text style={styles.coverClientName}>{name || "Client Name"}</Text>
          {proposal.address ? (
            <Text style={styles.coverAddress}>{proposal.address}</Text>
          ) : null}

          {sections.length > 0 && (
            <View>
              <Text style={styles.coverScopeTitle}>Scope of Work</Text>
              {sections.map((s) => (
                <Text key={s.id} style={styles.coverScopeItem}>
                  {s.label}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.coverPrice}>{price}</Text>
        </View>

        {/* Bottom */}
        <View style={styles.coverBottom}>
          <Text style={styles.coverDate}>{date}</Text>
          <Text style={styles.coverLicense}>CSLB License #1116111</Text>
        </View>
      </View>
    </Page>
  );
}

// ── TOC Page ──

function TocPage({ proposal }: { proposal: Proposal }) {
  const sections = getSelectedSections(proposal);
  const entries: { label: string; page: number }[] = [];
  let page = 3;

  for (const section of sections) {
    entries.push({ label: section.label, page });
    page++;
  }
  entries.push({ label: "Allowances & Payment Schedule", page });
  page++;
  entries.push({ label: "General Notes & Conditions", page });
  page++;
  entries.push({ label: "Thank You", page });

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.tocPage}>
        <Text style={styles.tocTitle}>Table of Contents</Text>
        {entries.map((entry, i) => (
          <View key={i} style={styles.tocRow}>
            <Text style={styles.tocLabel}>{entry.label}</Text>
            <Text style={styles.tocPageNum}>
              {String(entry.page).padStart(2, "0")}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber }) => String(pageNumber).padStart(2, "0")}
        fixed
      />
    </Page>
  );
}

// ── Scope Page ──

function ScopePage({
  proposal,
  sectionId,
  sectionLabel,
  items,
}: {
  proposal: Proposal;
  sectionId: string;
  sectionLabel: string;
  items: { id: string; title: string; description: string }[];
}) {
  const checkedItems = items.filter(
    (item) => proposal.scopeItems[`${sectionId}::${item.id}`]
  );

  if (checkedItems.length === 0) return null;

  return (
    <Page size="LETTER" style={styles.page} wrap>
      {/* Header bar */}
      <View style={styles.headerBar} fixed>
        <Text style={styles.headerText}>D&amp;C Builders</Text>
        <Text
          style={styles.headerText}
          render={({ pageNumber }) =>
            `Page ${String(pageNumber).padStart(2, "0")}`
          }
        />
      </View>

      {/* Section title */}
      <Text style={styles.scopeTitle}>{sectionLabel}</Text>

      {/* Items */}
      <View style={styles.scopeBody}>
        {checkedItems.map((item) => {
          const key = `${sectionId}::${item.id}`;
          const description =
            proposal.descOverrides[key] || item.description;
          const note = proposal.scopeNotes[key];

          return (
            <View
              key={item.id}
              style={styles.scopeItem}
              wrap={false}
            >
              <View style={styles.scopeCheckbox}>
                <Text style={styles.scopeCheck}>&#10003;</Text>
              </View>
              <View style={styles.scopeItemContent}>
                <Text style={styles.scopeItemTitle}>{item.title}</Text>
                <Text style={styles.scopeItemDesc}>{description}</Text>
                {note ? (
                  <Text style={styles.scopeItemNote}>Note: {note}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer page number */}
      <Text
        style={styles.pageNumber}
        render={({ pageNumber }) => String(pageNumber).padStart(2, "0")}
        fixed
      />
    </Page>
  );
}

// ── Payment Page ──

function PaymentPage({ proposal }: { proposal: Proposal }) {
  const hasAllowances = proposal.allowances.length > 0;
  const hasPayments = proposal.paymentSchedule.length > 0;

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.headerBar} fixed>
        <Text style={styles.headerText}>D&amp;C Builders</Text>
        <Text
          style={styles.headerText}
          render={({ pageNumber }) =>
            `Page ${String(pageNumber).padStart(2, "0")}`
          }
        />
      </View>

      <View style={styles.paymentBody}>
        {/* Allowances */}
        {hasAllowances && (
          <View style={{ marginBottom: 30 }}>
            <Text style={styles.sectionTitle}>Allowances</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableCellLeft, styles.tableHeaderText]}>
                Description
              </Text>
              <Text style={[styles.tableCellRight, styles.tableHeaderText]}>
                Amount
              </Text>
            </View>
            {proposal.allowances.map((a, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCellLeft}>
                  {a.description || "Allowance"}
                </Text>
                <Text style={styles.tableCellRight}>
                  {formatPrice(a.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Payment schedule */}
        {hasPayments && (
          <View>
            <Text style={styles.sectionTitle}>Payment Schedule</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableCellLeft, styles.tableHeaderText]}>
                Milestone
              </Text>
              <Text style={[styles.tableCellCenter, styles.tableHeaderText]}>
                Percentage
              </Text>
              <Text style={[styles.tableCellRight, styles.tableHeaderText]}>
                Amount
              </Text>
            </View>
            {proposal.paymentSchedule.map((p, i) => {
              let displayAmount = p.amount;
              if (!displayAmount && p.percentage && proposal.projectPrice) {
                const total = parseFloat(
                  proposal.projectPrice.replace(/[^0-9.]/g, "")
                );
                const pct = parseFloat(p.percentage);
                if (!isNaN(total) && !isNaN(pct)) {
                  displayAmount = String(Math.round(total * (pct / 100)));
                }
              }
              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={styles.tableCellLeft}>
                    {p.milestone || "Payment"}
                  </Text>
                  <Text style={styles.tableCellCenter}>
                    {p.percentage ? `${p.percentage}%` : "--"}
                  </Text>
                  <Text style={styles.tableCellRight}>
                    {formatPrice(displayAmount)}
                  </Text>
                </View>
              );
            })}
            <View style={styles.tableFooterRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <View style={{ width: 80 }} />
              <Text style={styles.totalAmount}>
                {formatPrice(proposal.projectPrice)}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber }) => String(pageNumber).padStart(2, "0")}
        fixed
      />
    </Page>
  );
}

// ── Notes Page ──

function NotesPage({ proposal }: { proposal: Proposal }) {
  const notes =
    proposal.generalNotes.length > 0
      ? proposal.generalNotes
      : DEFAULT_GENERAL_NOTES;

  return (
    <Page size="LETTER" style={styles.page} wrap>
      <View style={styles.headerBar} fixed>
        <Text style={styles.headerText}>D&amp;C Builders</Text>
        <Text
          style={styles.headerText}
          render={({ pageNumber }) =>
            `Page ${String(pageNumber).padStart(2, "0")}`
          }
        />
      </View>

      <View style={styles.notesBody}>
        <Text style={styles.sectionTitle}>General Notes &amp; Conditions</Text>
        {notes.map((note, i) => (
          <View key={i} style={styles.noteItem} wrap={false}>
            <Text style={styles.noteNumber}>{i + 1}.</Text>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        ))}
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber }) => String(pageNumber).padStart(2, "0")}
        fixed
      />
    </Page>
  );
}

// ── Thank You Page ──

function ThankYouPage() {
  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.thankYouPage}>
        <Text style={styles.thankYouLogo}>D&amp;C</Text>
        <Text style={styles.thankYouLogoSub}>Builders</Text>

        <View
          style={[styles.coverDivider, { marginVertical: 30 }]}
        />

        <Text style={styles.thankYouTitle}>Thank You</Text>
        <Text style={styles.thankYouSubtext}>
          We look forward to working with you.
        </Text>

        <View
          style={[styles.coverDivider, { marginVertical: 30 }]}
        />

        <Text style={styles.thankYouUrl}>www.dcbuilders.com</Text>
        <Text style={styles.thankYouLicense}>CSLB License #1116111</Text>
      </View>
    </Page>
  );
}

// ── Main Document ──

interface ProposalDocumentProps {
  proposal: Proposal;
}

export function ProposalDocument({ proposal }: ProposalDocumentProps) {
  const sections = getSelectedSections(proposal);

  return (
    <Document
      title={`DCB Proposal - ${[proposal.firstName, proposal.lastName].filter(Boolean).join(" ") || "Draft"}`}
      author="D&C Builders"
      subject="Project Proposal"
    >
      <CoverPage proposal={proposal} />

      {proposal.showToc && <TocPage proposal={proposal} />}

      {sections.map((section) => (
        <ScopePage
          key={section.id}
          proposal={proposal}
          sectionId={section.id}
          sectionLabel={section.label}
          items={section.items}
        />
      ))}

      <PaymentPage proposal={proposal} />
      <NotesPage proposal={proposal} />
      <ThankYouPage />
    </Document>
  );
}
