"use client";

import type { Proposal } from "@/lib/types";
import { formatPrice } from "@/lib/proposal-helpers";

interface ProposalPaymentProps {
  proposal: Proposal;
  pageNumber: number;
}

export function ProposalPayment({ proposal, pageNumber }: ProposalPaymentProps) {
  const hasAllowances = proposal.allowances.length > 0;
  const hasPayments = proposal.paymentSchedule.length > 0;

  return (
    <section className="proposal-page flex flex-col bg-white">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-12 py-4"
        style={{ backgroundColor: "#0f1d2c" }}
      >
        <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/60">
          D&amp;C Builders
        </span>
        <span className="text-xs text-white/60">
          Page {String(pageNumber).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1 px-12 py-8">
        {/* Allowances */}
        {hasAllowances && (
          <div className="mb-10">
            <h2
              className="mb-6 text-xl font-bold tracking-wide uppercase"
              style={{ color: "#0f1d2c" }}
            >
              Allowances
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b-2"
                  style={{ borderColor: "#0f1d2c" }}
                >
                  <th
                    className="pb-3 text-left font-semibold"
                    style={{ color: "#0f1d2c" }}
                  >
                    Description
                  </th>
                  <th
                    className="pb-3 text-right font-semibold"
                    style={{ color: "#0f1d2c" }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposal.allowances.map((a, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 text-gray-700">
                      {a.description || "Allowance"}
                    </td>
                    <td className="py-3 text-right font-medium text-gray-900">
                      {formatPrice(a.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Schedule */}
        {hasPayments && (
          <div>
            <h2
              className="mb-6 text-xl font-bold tracking-wide uppercase"
              style={{ color: "#0f1d2c" }}
            >
              Payment Schedule
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b-2"
                  style={{ borderColor: "#0f1d2c" }}
                >
                  <th
                    className="pb-3 text-left font-semibold"
                    style={{ color: "#0f1d2c" }}
                  >
                    Milestone
                  </th>
                  <th
                    className="pb-3 text-center font-semibold"
                    style={{ color: "#0f1d2c" }}
                  >
                    Percentage
                  </th>
                  <th
                    className="pb-3 text-right font-semibold"
                    style={{ color: "#0f1d2c" }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposal.paymentSchedule.map((p, i) => {
                  // Auto-calculate amount from percentage if not provided
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
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 text-gray-700">
                        {p.milestone || "Payment"}
                      </td>
                      <td className="py-3 text-center text-gray-500">
                        {p.percentage ? `${p.percentage}%` : "--"}
                      </td>
                      <td className="py-3 text-right font-medium text-gray-900">
                        {formatPrice(displayAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr
                  className="border-t-2"
                  style={{ borderColor: "#0f1d2c" }}
                >
                  <td
                    className="pt-3 text-left font-bold"
                    style={{ color: "#0f1d2c" }}
                  >
                    Total
                  </td>
                  <td />
                  <td
                    className="pt-3 text-right text-lg font-bold"
                    style={{ color: "#0f1d2c" }}
                  >
                    {formatPrice(proposal.projectPrice)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {!hasAllowances && !hasPayments && (
          <p className="text-center text-sm text-gray-400">
            No allowances or payment milestones have been added.
          </p>
        )}
      </div>
    </section>
  );
}
