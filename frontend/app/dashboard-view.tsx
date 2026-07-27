import {
  BarChart3,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  PackagePlus,
  ShoppingCart,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { getEntityId } from "./api";
import type {
  Article,
  CashRegister,
  FrequentClient,
  Sale,
  ViewName,
} from "./types";
import {
  currency,
  EmptyState,
  number,
  PageHeader,
  sectionName,
  StatusBadge,
} from "./ui";

export function DashboardView({
  articles,
  sales,
  clients,
  registers,
  onNavigate,
}: {
  articles: Article[];
  sales: Sale[];
  clients: FrequentClient[];
  registers: CashRegister[];
  onNavigate: (view: ViewName) => void;
}) {
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
  const stockUnits = articles.reduce(
    (sum, article) => sum + Number(article.stockLevel),
    0,
  );
  const lowStock = [...articles]
    .filter((article) => Number(article.stockLevel) <= 8)
    .sort((a, b) => Number(a.stockLevel) - Number(b.stockLevel));
  const openRegister = registers.find((register) => register.status === "open");

  const chart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return {
        key: date.toISOString().slice(0, 10),
        label: new Intl.DateTimeFormat("es-EC", { weekday: "short" }).format(date),
        value: 0,
      };
    });
    sales.forEach((sale) => {
      if (!sale.createdAt) return;
      const day = days.find(
        (candidate) =>
          candidate.key === new Date(sale.createdAt!).toISOString().slice(0, 10),
      );
      if (day) day.value += Number(sale.totalAmount);
    });
    const max = Math.max(...days.map((day) => day.value), 1);
    return days.map((day) => ({
      ...day,
      height: Math.max((day.value / max) * 100, day.value > 0 ? 12 : 4),
    }));
  }, [sales]);

  return (
    <>
      <PageHeader
        eyebrow="Centro de operaciones"
        title="Todo bajo control."
        description="Ventas, inventario y caja reunidos en un solo lugar para tomar decisiones rápidas."
        action={
          <button
            className="primary-button"
            onClick={() => onNavigate("checkout")}
            type="button"
          >
            <ShoppingCart size={18} />
            Nueva venta
          </button>
        }
      />

      <section className="kpi-grid" aria-label="Indicadores principales">
        <article className="kpi-card primary-kpi">
          <span className="kpi-icon">
            <CircleDollarSign size={21} />
          </span>
          <div>
            <span>Ventas registradas</span>
            <strong>{currency.format(totalSales)}</strong>
            <small>{number.format(sales.length)} transacciones</small>
          </div>
        </article>
        <article className="kpi-card">
          <span className="kpi-icon mint">
            <Boxes size={21} />
          </span>
          <div>
            <span>Unidades en stock</span>
            <strong>{number.format(stockUnits)}</strong>
            <small>{number.format(articles.length)} productos activos</small>
          </div>
        </article>
        <article className="kpi-card">
          <span className="kpi-icon amber">
            <UserRound size={21} />
          </span>
          <div>
            <span>Clientes frecuentes</span>
            <strong>{number.format(clients.length)}</strong>
            <small>Ordenados por consumo</small>
          </div>
        </article>
        <article className="kpi-card">
          <span className="kpi-icon violet">
            <Store size={21} />
          </span>
          <div>
            <span>Estado de caja</span>
            <strong>{openRegister ? `Caja ${openRegister.registerNumber}` : "Cerrada"}</strong>
            <small>
              {openRegister
                ? `${currency.format(openRegister.currentBalance)} en saldo`
                : "No hay cajas abiertas"}
            </small>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Últimos 7 días</span>
              <h2>Ritmo de ventas</h2>
            </div>
            <StatusBadge status="success">Actividad registrada</StatusBadge>
          </div>
          <div className="bar-chart" aria-label="Ventas de los últimos siete días">
            {chart.map((day) => (
              <div className="bar-column" key={day.key}>
                <span className="bar-value">
                  {day.value ? currency.format(day.value) : "—"}
                </span>
                <div className="bar-track">
                  <span style={{ height: `${day.height}%` }} />
                </div>
                <small>{day.label}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel stock-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Atención requerida</span>
              <h2>Stock por reponer</h2>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate("inventory")}
              type="button"
            >
              Ver inventario <ChevronRight size={16} />
            </button>
          </div>
          {lowStock.length ? (
            <div className="stock-list">
              {lowStock.slice(0, 5).map((article) => (
                <div className="stock-item" key={getEntityId(article) || article.barcode}>
                  <span className="product-initial">{article.name.charAt(0)}</span>
                  <div>
                    <strong>{article.name}</strong>
                    <small>{sectionName(article)}</small>
                  </div>
                  <StatusBadge
                    status={Number(article.stockLevel) <= 4 ? "warning" : "neutral"}
                  >
                    {article.stockLevel} uds.
                  </StatusBadge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Boxes}
              title="Inventario saludable"
              description="No hay productos por debajo del nivel de alerta."
            />
          )}
        </article>
      </section>

      <section className="quick-actions">
        <button onClick={() => onNavigate("inventory")} type="button">
          <span className="quick-icon">
            <PackagePlus size={20} />
          </span>
          <span>
            <strong>Registrar ingreso</strong>
            <small>Actualizar existencias</small>
          </span>
          <ChevronRight size={18} />
        </button>
        <button onClick={() => onNavigate("clients")} type="button">
          <span className="quick-icon">
            <Users size={20} />
          </span>
          <span>
            <strong>Nuevo cliente</strong>
            <small>Completar el directorio</small>
          </span>
          <ChevronRight size={18} />
        </button>
        <button onClick={() => onNavigate("reports")} type="button">
          <span className="quick-icon">
            <BarChart3 size={20} />
          </span>
          <span>
            <strong>Revisar reportes</strong>
            <small>Ventas y rendimiento</small>
          </span>
          <ChevronRight size={18} />
        </button>
      </section>
    </>
  );
}
