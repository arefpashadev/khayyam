/**
 * What clients say. Replace the placeholders with real clients' words (with their
 * permission). Entries marked `placeholder: true` are not shown, so nothing invented
 * ever appears as a real review.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** a real, measured result, e.g. "2× online orders in 3 months" */
  result?: string;
  placeholder?: boolean;
};

export const testimonials: Testimonial[] = [
  { placeholder: true, quote: "", name: "", role: "" },
  { placeholder: true, quote: "", name: "", role: "" },
  { placeholder: true, quote: "", name: "", role: "" },
];
