import { useMutation } from "@tanstack/react-query";
import { processPaymentApi } from "../api/payments.api.js";

export default function usePayment() { return useMutation({ mutationFn: processPaymentApi }); }
