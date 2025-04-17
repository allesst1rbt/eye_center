import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { LensProvider } from "./contexts/lens/LensProvider";
import { OrderProvider } from "./contexts/orders/OrderProvider";
import { AllRoutes } from "./routes";
import React from 'react';
import ReactDOM from 'react-dom/client';


ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
         <AuthProvider>
          <LensProvider>
            <OrderProvider>
              <Toaster reverseOrder={false} />
              <AllRoutes />
            </OrderProvider>
          </LensProvider>
        </AuthProvider>
    </React.StrictMode>
);

