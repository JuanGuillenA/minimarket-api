"use client";

import {
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Wifi,
  WifiOff,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AccessView, ReportsView } from "./access-reports-views";
import { API_URL, apiRequest } from "./api";
import { CatalogView, InventoryView } from "./catalog-inventory-views";
import { CheckoutView } from "./checkout-view";
import { DashboardView } from "./dashboard-view";
import {
  demoArticles,
  demoClients,
  demoFrequentClients,
  demoRegisters,
  demoRoles,
  demoSales,
  demoSections,
  demoSuppliers,
  demoUsers,
} from "./demo-data";
import { ClientsView, SupplyView } from "./supply-clients-views";
import type {
  Article,
  CashRegister,
  Client,
  FrequentClient,
  Role,
  Sale,
  Section,
  Supplier,
  Toast,
  User,
  ViewName,
} from "./types";
import { type ActionRunner, dateFormatter } from "./ui";

const navigation: {
  id: ViewName;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "dashboard",
    label: "Resumen",
    description: "Operación del día",
    icon: LayoutDashboard,
  },
  {
    id: "checkout",
    label: "Punto de venta",
    description: "Caja y transacciones",
    icon: ShoppingCart,
  },
  {
    id: "catalog",
    label: "Catálogo",
    description: "Productos y secciones",
    icon: Package,
  },
  {
    id: "inventory",
    label: "Inventario",
    description: "Entradas y salidas",
    icon: ArrowLeftRight,
  },
  {
    id: "supply",
    label: "Abastecimiento",
    description: "Proveedores y compras",
    icon: Truck,
  },
  {
    id: "clients",
    label: "Clientes",
    description: "Directorio de clientes",
    icon: Users,
  },
  {
    id: "access",
    label: "Equipo",
    description: "Usuarios y roles",
    icon: ShieldCheck,
  },
  {
    id: "reports",
    label: "Reportes",
    description: "Indicadores y detalle",
    icon: BarChart3,
  },
];

export function MinimarketApp() {
  const [view, setView] = useState<ViewName>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [frequentClients, setFrequentClients] = useState<FrequentClient[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = Date.now();
      setToasts((current) => [...current, { id, type, message }]);
      window.setTimeout(
        () => setToasts((current) => current.filter((toast) => toast.id !== id)),
        4200,
      );
    },
    [],
  );

  const loadData = useCallback(async () => {
    setRefreshing(true);
    const results = await Promise.allSettled([
      apiRequest<Article[]>("/catalog/articles"),
      apiRequest<Section[]>("/catalog/sections"),
      apiRequest<Supplier[]>("/supply/suppliers"),
      apiRequest<Client[]>("/clients"),
      apiRequest<Role[]>("/access/roles"),
      apiRequest<User[]>("/access/users"),
      apiRequest<CashRegister[]>("/checkout/registers"),
      apiRequest<Sale[]>("/reports/sales"),
      apiRequest<FrequentClient[]>("/reports/clients"),
    ]);
    const successful = results.filter((result) => result.status === "fulfilled");

    if (!successful.length) {
      setDemoMode(true);
      setConnectionMessage(
        "La API no está disponible. Se muestran datos de demostración para recorrer la interfaz.",
      );
      setArticles(demoArticles);
      setSections(demoSections);
      setSuppliers(demoSuppliers);
      setClients(demoClients);
      setRoles(demoRoles);
      setUsers(demoUsers);
      setRegisters(demoRegisters);
      setSales(demoSales);
      setFrequentClients(demoFrequentClients);
    } else {
      setDemoMode(false);
      setConnectionMessage(
        successful.length < results.length
          ? "Algunos módulos no respondieron. La información disponible se cargó correctamente."
          : "",
      );
      if (results[0].status === "fulfilled") setArticles(results[0].value);
      if (results[1].status === "fulfilled") setSections(results[1].value);
      if (results[2].status === "fulfilled") setSuppliers(results[2].value);
      if (results[3].status === "fulfilled") setClients(results[3].value);
      if (results[4].status === "fulfilled") setRoles(results[4].value);
      if (results[5].status === "fulfilled") setUsers(results[5].value);
      if (results[6].status === "fulfilled") setRegisters(results[6].value);
      if (results[7].status === "fulfilled") setSales(results[7].value);
      if (results[8].status === "fulfilled") setFrequentClients(results[8].value);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const runAction: ActionRunner = async (action, successMessage) => {
    if (demoMode) {
      showToast(`${successMessage} · demostración`);
      return true;
    }
    try {
      await action();
      showToast(successMessage);
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "No se pudo completar la acción",
        "error",
      );
      return false;
    }
  };

  const navigate = (nextView: ViewName) => {
    setView(nextView);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeNavigation = navigation.find((item) => item.id === view);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Store size={22} />
          </span>
          <div>
            <strong>Mercado Uno</strong>
            <small>Gestión inteligente</small>
          </div>
          <button
            aria-label="Cerrar menú"
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Navegación principal">
          <span className="nav-label">Operación</span>
          {navigation.map(({ id, label, description, icon: Icon }) => (
            <button
              className={view === id ? "active" : ""}
              data-testid={`nav-${id}`}
              key={id}
              onClick={() => navigate(id)}
              type="button"
            >
              <Icon size={19} />
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
              {view === id && <ChevronRight className="nav-chevron" size={16} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="team-profile">
            <span>AM</span>
            <div>
              <strong>Equipo Minimarket</strong>
              <small>Sesión de trabajo</small>
            </div>
          </div>
          <div className={`api-pill ${demoMode ? "offline" : ""}`}>
            {demoMode ? <WifiOff size={14} /> : <Wifi size={14} />}
            {demoMode ? "Modo demostración" : "API conectada"}
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label="Cerrar navegación"
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      )}

      <div className="main-shell">
        <header className="topbar">
          <div>
            <button
              aria-label="Abrir menú"
              className="menu-button"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <Menu size={21} />
            </button>
            <div>
              <span>{activeNavigation?.label}</span>
              <small>{dateFormatter.format(new Date())}</small>
            </div>
          </div>
          <div className="topbar-actions">
            <span className="api-url" title={API_URL}>
              {demoMode ? <WifiOff size={15} /> : <Wifi size={15} />}
              {demoMode ? "Datos demo" : "En línea"}
            </span>
            <button
              aria-label="Actualizar información"
              className="icon-button"
              disabled={refreshing}
              onClick={() => void loadData()}
              type="button"
            >
              <RefreshCw className={refreshing ? "spin" : ""} size={18} />
            </button>
            <span className="top-avatar">AM</span>
          </div>
        </header>

        <main>
          {connectionMessage && (
            <div className={`connection-banner ${demoMode ? "warning" : ""}`}>
              <AlertTriangle size={18} />
              <span>{connectionMessage}</span>
              <button onClick={() => void loadData()} type="button">
                Reintentar
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-screen">
              <span className="loading-mark">
                <Store size={24} />
              </span>
              <strong>Preparando el minimarket</strong>
              <small>Consultando productos, caja y reportes…</small>
            </div>
          ) : (
            <>
              {view === "dashboard" && (
                <DashboardView
                  articles={articles}
                  clients={frequentClients}
                  onNavigate={navigate}
                  registers={registers}
                  sales={sales}
                />
              )}
              {view === "checkout" && (
                <CheckoutView
                  articles={articles}
                  clients={clients}
                  registers={registers}
                  reload={loadData}
                  runAction={runAction}
                />
              )}
              {view === "catalog" && (
                <CatalogView
                  articles={articles}
                  reload={loadData}
                  runAction={runAction}
                  sections={sections}
                />
              )}
              {view === "inventory" && (
                <InventoryView
                  articles={articles}
                  reload={loadData}
                  runAction={runAction}
                />
              )}
              {view === "supply" && (
                <SupplyView
                  articles={articles}
                  reload={loadData}
                  runAction={runAction}
                  suppliers={suppliers}
                />
              )}
              {view === "clients" && (
                <ClientsView
                  clients={clients}
                  reload={loadData}
                  runAction={runAction}
                />
              )}
              {view === "access" && (
                <AccessView
                  reload={loadData}
                  roles={roles}
                  runAction={runAction}
                  users={users}
                />
              )}
              {view === "reports" && (
                <ReportsView
                  articles={articles}
                  clients={frequentClients}
                  sales={sales}
                />
              )}
            </>
          )}
        </main>
      </div>

      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div className={`toast ${toast.type}`} key={toast.id}>
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
