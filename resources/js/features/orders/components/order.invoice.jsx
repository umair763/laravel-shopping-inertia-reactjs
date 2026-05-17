import React, { useRef } from "react";

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(Number(value || 0));
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
}

const STATUS_STYLES = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-sky-50 text-sky-700 border-sky-200",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function OrderInvoice({ order, onClose }) {
    const printRef = useRef(null);

    function handlePrint() {
        const content = printRef.current?.innerHTML;
        if (!content) return;
        const win = window.open("", "_blank", "width=900,height=700");
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Invoice ${order?.order_number || order?.id || ""}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1e293b; background: #fff; padding: 40px; }
                    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
                    .brand { font-size: 24px; font-weight: 900; color: #0ea5e9; }
                    .badge { display: inline-flex; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #e0f2fe; background: #f0f9ff; color: #0369a1; }
                    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
                    .meta-block p:first-child { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; margin-bottom: 6px; }
                    .meta-block p { font-size: 13px; color: #334155; line-height: 1.6; }
                    .meta-block p.strong { font-weight: 700; color: #0f172a; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                    th { background: #f8fafc; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; padding: 10px 12px; text-align: left; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
                    td { padding: 10px 12px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9; }
                    td.right, th.right { text-align: right; }
                    .totals { margin-left: auto; width: 280px; }
                    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #475569; }
                    .totals-row.total { border-top: 2px solid #e2e8f0; padding-top: 10px; margin-top: 4px; font-size: 16px; font-weight: 900; color: #0f172a; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
                </style>
            </head>
            <body>${content}</body>
            </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => {
            win.print();
            win.close();
        }, 300);
    }

    if (!order) return null;

    const items = order.items ?? [];
    const subtotal = Number(order.subtotal_amount ?? order.total_amount ?? 0);
    const tax = Number(order.tax_amount ?? 0);
    const shipping = Number(order.shipping_amount ?? 0);
    const discount = Number(order.discount_amount ?? 0);
    const total = Number(order.total_amount ?? 0);
    const orderNumber = order.order_number || `INV-${order.id?.slice(0, 8)?.toUpperCase() ?? "—"}`;
    const statusStyle = STATUS_STYLES[order.order_status] || "bg-slate-50 text-slate-600 border-slate-200";

    const customerName = [order.user?.first_name, order.user?.last_name]
        .filter(Boolean)
        .join(" ") || order.user?.email || "Customer";
    const addr = order.shipping_address;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-8" onClick={onClose}>
            <div
                className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Invoice
                        </p>
                        <h2 className="text-lg font-black text-slate-900">{orderNumber}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
                        >
                            🖨 Print / Save PDF
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50"
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>

                <div ref={printRef} className="p-6 space-y-6">
                    <div className="invoice-header flex items-start justify-between">
                        <div>
                            <p className="text-2xl font-black text-sky-500">AmazStore</p>
                            <p className="text-xs text-slate-400 mt-1">AmazStore.com</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-xl font-black text-slate-900">INVOICE</p>
                            <p className="text-sm font-semibold text-slate-700">{orderNumber}</p>
                            <span className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${statusStyle}`}>
                                {order.order_status}
                            </span>
                        </div>
                    </div>

                    <div className="meta-grid grid grid-cols-2 gap-6">
                        <div className="meta-block space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Bill to
                            </p>
                            <p className="text-sm font-semibold text-slate-900">{customerName}</p>
                            <p className="text-xs text-slate-500">{order.user?.email}</p>
                            {addr && (
                                <div className="text-xs text-slate-500 leading-5">
                                    {addr.address_line_1 && <p>{addr.address_line_1}</p>}
                                    {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                                    {[addr.city, addr.state, addr.postal_code]
                                        .filter(Boolean)
                                        .join(", ") && (
                                        <p>
                                            {[addr.city, addr.state, addr.postal_code]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    )}
                                    {addr.country && <p>{addr.country}</p>}
                                </div>
                            )}
                        </div>
                        <div className="meta-block space-y-1 text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Details
                            </p>
                            <div className="text-xs text-slate-600 space-y-1">
                                <div className="flex justify-end gap-4">
                                    <span className="text-slate-400">Invoice date</span>
                                    <span className="font-medium text-slate-900">
                                        {formatDate(order.placed_at || order.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <span className="text-slate-400">Payment</span>
                                    <span className={`font-semibold capitalize ${
                                        order.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"
                                    }`}>
                                        {order.payment_status || "pending"}
                                    </span>
                                </div>
                                {order.payment?.transaction_id && (
                                    <div className="flex justify-end gap-4">
                                        <span className="text-slate-400">Txn ID</span>
                                        <span className="font-mono text-xs text-slate-700">
                                            {order.payment.transaction_id}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left">
                                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Item
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Qty
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Unit price
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {items.length > 0 ? (
                                    items.map((item, i) => (
                                        <tr key={item.id || i}>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-slate-900">
                                                    {item.product?.name || `Product #${item.product_id?.slice(0, 8) ?? i}`}
                                                </p>
                                                {item.variant?.sku && (
                                                    <p className="text-xs text-slate-400">
                                                        SKU: {item.variant.sku}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700">
                                                {formatCurrency(item.unit_price ?? item.price)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                                {formatCurrency(item.total_price ?? item.price)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400">
                                            No items
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            {shipping > 0 && (
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Shipping</span>
                                    <span>{formatCurrency(shipping)}</span>
                                </div>
                            )}
                            {tax > 0 && (
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tax</span>
                                    <span>{formatCurrency(tax)}</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-emerald-600">
                                    <span>Discount</span>
                                    <span>−{formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-slate-200 pt-3">
                                <span className="text-base font-black text-slate-900">Total</span>
                                <span className="text-base font-black text-sky-700">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="footer border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
                        <p>AmazStore — Thank you for your order!</p>
                        <p className="mt-1">
                            Questions? Contact us at support@AmazStore.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
