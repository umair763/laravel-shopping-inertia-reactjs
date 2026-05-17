import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../css/app.css";
import ThemeProvider from "./app/providers/theme.provider.jsx";
import DashboardLayout from "./layouts/dashboard.layout.jsx";
import StoreLayout from "./layouts/store.layout.jsx";
import CustomerPortalLayout from "./layouts/customer.portal.layout.jsx";

const queryClient = new QueryClient();

const pages = import.meta.glob([
    "./pages/**/*.jsx",
    "./features/**/*.jsx",
]);

const routeMap = {
    // Store / public
    "Welcome":           "./pages/store/home.page.jsx",
    "User/Products":     "./pages/store/home.page.jsx",
    "User/ViewProduct":  "./pages/store/product.page.jsx",

    // Customer Portal
    "Customer/Cart":     "./features/cart/pages/cart.page.jsx",
    "Customer/Orders":   "./features/orders/pages/my.orders.page.jsx",
    "Customer/OrderDetail":  "./features/orders/pages/order.details.page.jsx",
    "Customer/Dashboard": "./features/account/pages/dashboard.page.jsx",
    "Customer/Profile":   "./features/account/pages/profile.page.jsx",
    "Customer/Reviews":   "./features/account/pages/reviews.page.jsx",
    "Customer/History":   "./features/account/pages/purchase.history.page.jsx",
    "Customer/Settings":  "./features/account/pages/account.settings.page.jsx",
    "Customer/Addresses": "./pages/Customer/Addresses.jsx",

    // Auth
    "Auth/User/Login":    "./features/account/pages/login.page.jsx",
    "Auth/User/Register": "./features/account/pages/register.page.jsx",
    "Auth/Admin/Login":   "./pages/admin/admin.login.page.jsx",
    "Auth/Admin/Register":"./pages/admin/admin.register.page.jsx",

    // Admin
    "Admin/Dashboard":    "./features/admin/dashboard/dashboard.page.jsx",
    "Admin/Orders":       "./features/admin/orders/orders.table.jsx",
    "Admin/OrderDetail":  "./features/admin/orders/order.admin.detail.jsx",
    "Admin/Users":        "./features/admin/users/users.page.jsx",
    "Admin/Settings":     "./features/admin/settings/admin.settings.jsx",
    "Admin/Profile":      "./features/admin/profile/admin.profile.page.jsx",
    "Admin/Products":     "./features/admin/products/product.table.jsx",
    "Admin/ProductForm":  "./features/admin/products/product.form.jsx",
    "Admin/AddProduct":   "./features/admin/products/product.form.jsx",
    "Admin/UpdateProduct":"./features/admin/products/product.form.jsx",
    "Admin/Catalogues":   "./features/admin/catalogues/catalogues.table.jsx",
    "Admin/CatalogueForm":"./features/admin/catalogues/catalogue.form.jsx",
    "Admin/Categories":   "./features/admin/categories/categories.table.jsx",
    "Admin/CategoryForm": "./features/admin/categories/category.form.jsx",
};

createInertiaApp({
    title: (title) => (title ? `${title} - AmazStore` : "AmazStore"),
    resolve: (name) => {
        const path = routeMap[name];
        if (!path || !pages[path]) {
            console.error(`Component not found for Inertia route: ${name}`);
            throw new Error(`Component not found for Inertia route: ${name}`);
        }
        return pages[path]().then((module) => {
            let page = module.default;
            if (!page.layout) {
                if (name.startsWith("Admin/") && !name.startsWith("Auth/Admin/")) {
                    page.layout = (p) => <DashboardLayout>{p}</DashboardLayout>;
                } else if (name.startsWith("Customer/")) {
                    page.layout = (p) => <CustomerPortalLayout>{p}</CustomerPortalLayout>;
                } else if (name.startsWith("User/")) {
                    page.layout = (p) => <StoreLayout>{p}</StoreLayout>;
                }
            }
            return module;
        });
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <React.StrictMode>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <App {...props} />
                    </ThemeProvider>
                </QueryClientProvider>
            </React.StrictMode>,
        );
    },
    progress: {
        color: "#0ea5e9",
    },
});
