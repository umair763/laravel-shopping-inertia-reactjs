import React from "react";
import UsersTable from "./users.table.jsx";
import DashboardLayout from "../../../layouts/dashboard.layout.jsx";

export default function UsersPage({ users }) {
    return <UsersTable users={users} />;
}

UsersPage.layout = (page) => <DashboardLayout>{page}</DashboardLayout>;
