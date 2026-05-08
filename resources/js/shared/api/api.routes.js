const apiRoutes = {
  account: {
    register: "/account/register",
    login: "/account/login",
    adminLogin: "/account/admin/login",
    logout: "/account/logout",
    me: "/account/user",
    profile: "/account/profile",
    adminRegister: "/account/admin/register",
  },
  catalog: {
    products: "/catalog/products",
    productBySlug: (slug) => `/catalog/products/${slug}`,
    categories: "/catalog/categories",
    catalogues: "/catalog/catalogues",
  },
  cart: {
    root: "/cart",
    items: "/cart/items",
    itemById: (id) => `/cart/items/${id}`,
    checkout: "/cart/checkout",
  },
  orders: {
    root: "/orders",
    byId: (id) => `/orders/${id}`,
  },
  payments: {
    root: "/payments",
    process: "/payments/process",
  },
  reviews: {
    root: "/reviews",
    product: (productId) => `/reviews/products/${productId}`,
  },
  audit: {
    root: "/audit-logs",
  },
  admin: {
    products: "/admin/products",
    orders: "/admin/orders",
    orderById: (id) => `/admin/orders/${id}`,
    orderStatus: (id) => `/admin/orders/${id}/status`,
    users: "/admin/users",
  },
};

export default apiRoutes;
