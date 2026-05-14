import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const SettingsContext = createContext(null);

const initialSettings = {
  bakeryName: "Sunshine Confectionaries",
  phone: "+234 801 234 5678",
  email: "hello@sunshine.com",
  address: "Calabar, Cross River State",
  whatsapp: "+2348012345678",
  instagram: "sunshineconfectionaries",
  openingHours: "Mon - Sat, 8:00 AM - 7:00 PM",
  bankName: "Opay",
  accountName: "Sunshine Confectionaries",
  accountNumber: "1234567890",
  deliveryNote: "Delivery fees depend on your selected location.",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(initialSettings);

  const updateSettings = (updatedSettings) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...updatedSettings,
    }));

    toast.success("Settings updated");
  };

  const value = {
    settings,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}