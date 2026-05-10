import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import "../css/app.css";
import ThemeProvider from "./app/providers/theme.provider.jsx";
import DashboardLayout from "./layouts/dashboard.layout.jsx";
import StoreLayout from "./layouts/store.layout.jsx";

const pages = import.meta.glob(["./pages/**/*.jsx", "./features/**/*.jsx"]);

const routeMap = {
    "User/Orders": "./features/orders/pages/my.orders.page.jsx",
    "User/OrderDetail": "./features/orders/pages/order.details.page.jsx",
    "Admin/Dashboard": "./features/admin/dashboard/dashboard.page.jsx",
    "Admin/Orders": "./features/admin/orders/orders.table.jsx",
    "Admin/OrderDetail": "./features/admin/orders/order.admin.detail.jsx",
    "User/Products": "./pages/store/home.page.jsx",
    "User/ViewProduct": "./pages/store/product.page.jsx",
    "Admin/Products": "./features/admin/products/product.table.jsx",
    "Admin/AddProduct": "./features/admin/products/product.create.jsx",
    "Admin/UpdateProduct": "./features/admin/products/product.edit.jsx",
    "Auth/User/Login": "./features/account/pages/login.page.jsx",
    "Auth/User/Register": "./features/account/pages/register.page.jsx",
    "Auth/Admin/Login": "./pages/admin/admin.login.page.jsx",
    "Auth/Admin/Register": "./pages/admin/admin.register.page.jsx",
    Welcome: "./pages/store/home.page.jsx",
};

createInertiaApp({
    title: (title) => (title ? `${title} - Laravel` : "Laravel"),
    resolve: (name) => {
        const path = routeMap[name];
        if (!path || !pages[path]) {
            console.error(`Component not found for Inertia route: ${name}`);
            throw new Error(`Component not found for Inertia route: ${name}`);
        }
        return pages[path]().then((module) => {
            let page = module.default;
            if (!page.layout) {
                if (name.startsWith("Admin/") && !name.includes("Auth")) {
                    page.layout = (p) => <DashboardLayout>{p}</DashboardLayout>;
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
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </React.StrictMode>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
