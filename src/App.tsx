import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import AuthProvider from "./auth/AuthProvider";
import RequireAdmin from "./auth/RequireAdmin.jsx";
import RequireRoleSession from "./auth/RequireRoleSession.jsx";

// Kiosk routes
import KioskRoute from "./routes/Kiosk/Kiosk.route";
import KioskMenuRoute from "./routes/Kiosk/Menu/Menu.route";
import KioskLoginRoute from "./routes/Kiosk/Login/Login.route";
import KioskCheckoutRoute from "./routes/Kiosk/Checkout/Checkout.route";
import KioskSelectPaymentMethodRoute from "./routes/Kiosk/Checkout/SelectPaymentMethod/SelectPaymentMethod.route.jsx";
import KioskPaymentRoute from "./routes/Kiosk/Checkout/Payment/Payment.route.jsx";
import KioskSuccessRoute from "./routes/Kiosk/Checkout/Success/Success.route";
import KioskFailureRoute from "./routes/Kiosk/Checkout/Failure/Failure.route";
import KioskLogoutRoute from "./routes/Kiosk/Logout/Logout.route.jsx";

// POS routes
import POSRoute from "./routes/POS/POS.route";
import POSProductPanel from "./routes/POS/components/POSProductPanel";
import POSLoginRoute from "./routes/POS/Login/Login.route";
import POSCheckoutRoute from "./routes/POS/Checkout/Checkout.route";
import POSCardPaymentRoute from "./routes/POS/Checkout/CardPayment/CardPayment.route";
import POSCashPaymentRoute from "./routes/POS/Checkout/CashPayment/CashPayment.route";
import POSSuccessRoute from "./routes/POS/Checkout/Success/Success.route";
import POSFailureRoute from "./routes/POS/Checkout/Failure/Failure.route";
import POSSettingsRoute from "./routes/POS/Settings/Settings.route";

// Admin routes
import AdminRoute from "./routes/Admin/Admin.route.jsx";
import AdminDashboardRoute from "./routes/Admin/Dashboard/Dashboard.route.jsx";
import AdminLoginRoute from "./routes/Admin/Login/Login.route";
import AdminTransactionsRoute from "./routes/Admin/Transactions/Transactions.route.jsx";
import AdminMenuRoute from "./routes/Admin/Menu/Menu.route.jsx";
import AdminUsersRoute from "./routes/Admin/Users/Users.route.jsx";
import AdminSettingsRoute from "./routes/Admin/Settings/Settings.route.jsx";
import AdminDevicesRoute from "./routes/Admin/Devices/Devices.route.jsx";

// Standalone routes
import TransactionsRoute from "./routes/Transactions/Transactions.route";
import ActiveOrdersRoute from "./routes/ActiveOrders/ActiveOrders.route";

import { useAppDispatch } from "@/store/hooks";
import { resetAll } from "@/store/posCartSlice";

const queryClient = new QueryClient();

const PosCartResetInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const resetFlag = localStorage.getItem("POS_CART_RESET");
    if (resetFlag) {
      dispatch(resetAll());
      localStorage.removeItem("POS_CART_RESET");
    }
  }, [dispatch]);

  return null;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />

      {/* Public auth routes */}
      <Route path="/kiosk/login" element={<KioskLoginRoute />} />
      <Route path="/pos/login" element={<POSLoginRoute />} />
      <Route path="/admin/login" element={<AdminLoginRoute />} />

      {/* Admin protected routes */}
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboardRoute />} />
          <Route path="transactions" element={<AdminTransactionsRoute />} />
          <Route path="menu" element={<AdminMenuRoute />} />
          <Route path="users" element={<AdminUsersRoute />} />
          <Route path="devices" element={<AdminDevicesRoute />} />
          <Route path="settings" element={<AdminSettingsRoute />} />
        </Route>

        <Route path="/active-orders" element={<ActiveOrdersRoute />} />
        <Route path="/transactions" element={<TransactionsRoute />} />
      </Route>

      {/* POS protected routes */}
      <Route element={<RequireRoleSession roles={["ADMIN", "EMPLOYEE"]} redirectTo="/pos/login" />}>
        <Route path="/pos" element={<POSRoute />}>
          <Route index element={<POSProductPanel />} />
          <Route path="checkout" element={<POSCheckoutRoute />} />
          <Route path="card-payment" element={<POSCardPaymentRoute />} />
          <Route path="cash-payment" element={<POSCashPaymentRoute />} />
          <Route path="checkout/success" element={<POSSuccessRoute />} />
          <Route path="checkout/failure" element={<POSFailureRoute />} />
          <Route path="settings" element={<POSSettingsRoute />} />
        </Route>
      </Route>

      {/* Kiosk protected routes */}
      <Route element={<RequireRoleSession roles={["ADMIN", "KIOSK_ROLE"]} redirectTo="/kiosk/login" />}>
        <Route path="/kiosk" element={<KioskRoute />}/>
        <Route path="/kiosk/logout" element={<KioskLogoutRoute />} />
        <Route path="/kiosk/menu" element={<KioskMenuRoute />} />
        <Route path="/kiosk/checkout" element={<KioskCheckoutRoute />} />
        <Route
          path="/kiosk/checkout/select-payment-method"
          element={<KioskSelectPaymentMethodRoute />}
        />
        <Route path="/kiosk/checkout/payment" element={<KioskPaymentRoute />} />
        <Route path="/kiosk/checkout/success" element={<KioskSuccessRoute />} />
        <Route path="/kiosk/checkout/failure" element={<KioskFailureRoute />} />
      </Route>
    </>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <PosCartResetInitializer />
        <RouterProvider router={router} />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
