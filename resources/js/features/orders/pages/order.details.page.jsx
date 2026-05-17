import React from "react";
import OrderDetails from "../components/order.details.jsx";
import StoreLayout from "../../../layouts/store.layout.jsx";
import Container from "../../../shared/ui/layout/container.jsx";

export default function OrderDetailsPage({ order }) {
    return (
        <Container>
            <OrderDetails order={order} />
        </Container>
    );
}

OrderDetailsPage.layout = (page) => <StoreLayout>{page}</StoreLayout>;
