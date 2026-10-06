import { create } from "zustand";

/**
 * Payment plans shared by every studio.
 * The Figma design is always part of the project — it is never priced on its own.
 * - start: pay a deposit and the project begins (Figma first, then the build)
 * - consult: pay a small, deductible fee; an expert calls and we plan together
 *
 * Amounts are placeholders — set your real numbers here.
 */
export type Plan = "start" | "consult";

/** Thousand tomans; deducted from the contract if the customer goes ahead. */
export const CONSULT_FEE = 490;
/** Share of the lower estimate paid up front to start. */
export const DEPOSIT_RATE = 0.3;

/** Amount to pay now, in thousand tomans. `estimateMin` is in million tomans. */
export const amountDue = (plan: Plan, estimateMin: number) => (plan === "consult" ? CONSULT_FEE : Math.round(estimateMin * DEPOSIT_RATE * 1000));

export const formatToman = (thousands: number) =>
  thousands >= 1000 ? `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(thousands / 1000)} میلیون تومان` : `${new Intl.NumberFormat("fa-IR").format(thousands)} هزار تومان`;

type PaymentState = {
  status: "idle" | "redirecting" | "paid";
  amount: number;
  setStatus: (status: PaymentState["status"], amount?: number) => void;
};

export const usePayment = create<PaymentState>((set) => ({
  status: "idle",
  amount: 0,
  setStatus: (status, amount) => set((state) => ({ status, amount: amount ?? state.amount })),
}));

/**
 * Hand-off to the payment gateway.
 * TODO(payment): call your backend to create a gateway transaction (e.g. Zarinpal/IDPay)
 * and redirect to it. Until then this simulates the round trip so the flow can be tested.
 */
export const startPayment = async (amount: number): Promise<boolean> => {
  usePayment.getState().setStatus("redirecting", amount);
  await new Promise((resolve) => setTimeout(resolve, 1600));
  usePayment.getState().setStatus("paid");
  await new Promise((resolve) => setTimeout(resolve, 900));
  usePayment.getState().setStatus("idle");
  return true;
};
