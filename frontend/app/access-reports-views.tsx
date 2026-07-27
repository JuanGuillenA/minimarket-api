"use client";

import {
  Boxes,
  Plus,
  ReceiptText,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { getEntityId, postJson } from "./api";
import type { Article, FrequentClient, Role, Sale, User } from "./types";
import {
  type ActionRunner,
  currency,
  EmptyState,
  Field,
  formatDate,
  PageHeader,
  roleName,
  sectionName,
  StatusBadge,
} from "./ui";

export function AccessView({
  roles,
  users,
  runAction,
  reload,
}: {
  roles: Role[];
  users: User[];
  runAction: ActionRunner;
  reload: () => Promise<void>;
}) {
  const [roleForm, setRoleForm] = useState({ roleName: "", description: "" });
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    fullName: "",
    roleId: "",
  });

  const submitRole = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await runAction(
      () => postJson("/access/roles", roleForm),
      "Rol creado correctamente",
    );
    if (ok) {
      setRoleForm({ roleName: "", description: "" });
      await reload();
    }
  };

  const submitUser = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await runAction(
      () => postJson("/access/users", userForm),
      "Usuario creado correctamente",
    );
    if (ok) {
      setUserForm({ username: "", password: "", fullName: "", roleId: "" });
      await reload();
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Organización del equipo"
        title="Usuarios y roles"
        description="Crea perfiles de trabajo para distribuir responsabilidades."
      />
      <section className="team-layout">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Equipo activo</span>
              <h2>{users.length} usuarios</h2>
            </div>
            <Users size={21} />
          </div>
          <div className="team-grid">
            {users.map((user) => (
              <article className="team-card" key={getEntityId(user) || user.username}>
                <span className="client-avatar large-avatar">
                  {user.fullName
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join("")}
                </span>
                <strong>{user.fullName}</strong>
                <small>@{user.username}</small>
                <StatusBadge status="neutral">{roleName(user)}</StatusBadge>
              </article>
            ))}
            {!users.length && (
              <EmptyState
                icon={Users}
                title="Sin usuarios"
                description="Crea el primer integrante del equipo."
              />
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Perfiles</span>
              <h2>Roles disponibles</h2>
            </div>
            <ShieldCheck size={21} />
          </div>
          <div className="role-list">
            {roles.map((role) => (
              <div className="role-row" key={getEntityId(role)}>
                <span className="role-icon">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <strong>{role.roleName}</strong>
                  <small>{role.description}</small>
                </div>
                <StatusBadge status="success">Activo</StatusBadge>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="operations-grid access-forms">
        <form className="panel form-panel" onSubmit={submitUser}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Nuevo integrante</span>
              <h2>Crear usuario</h2>
            </div>
            <UserRound size={20} />
          </div>
          <Field label="Nombre completo">
            <input
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  fullName: event.target.value,
                }))
              }
              required
              value={userForm.fullName}
            />
          </Field>
          <div className="form-row">
            <Field label="Usuario">
              <input
                autoComplete="off"
                onChange={(event) =>
                  setUserForm((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                required
                value={userForm.username}
              />
            </Field>
            <Field label="Contraseña">
              <input
                autoComplete="new-password"
                onChange={(event) =>
                  setUserForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                required
                type="password"
                value={userForm.password}
              />
            </Field>
          </div>
          <Field label="Rol">
            <select
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  roleId: event.target.value,
                }))
              }
              required
              value={userForm.roleId}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={getEntityId(role)} value={getEntityId(role)}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </Field>
          <button className="primary-button full-button" type="submit">
            <Plus size={18} /> Crear usuario
          </button>
        </form>

        <form className="panel form-panel" onSubmit={submitRole}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Nuevo perfil</span>
              <h2>Crear rol</h2>
            </div>
            <ShieldCheck size={20} />
          </div>
          <Field label="Nombre del rol">
            <input
              onChange={(event) =>
                setRoleForm((current) => ({
                  ...current,
                  roleName: event.target.value,
                }))
              }
              required
              value={roleForm.roleName}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              onChange={(event) =>
                setRoleForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              required
              rows={4}
              value={roleForm.description}
            />
          </Field>
          <button className="secondary-button full-button" type="submit">
            Crear rol
          </button>
        </form>
      </section>
    </>
  );
}

export function ReportsView({
  articles,
  sales,
  clients,
}: {
  articles: Article[];
  sales: Sale[];
  clients: FrequentClient[];
}) {
  const [tab, setTab] = useState<"inventory" | "sales" | "clients">("sales");
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
  const average = sales.length ? totalSales / sales.length : 0;

  return (
    <>
      <PageHeader
        eyebrow="Análisis del negocio"
        title="Reportes"
        description="Consulta la información consolidada que entrega el backend."
      />
      <section className="report-highlights">
        <article>
          <span>Venta acumulada</span>
          <strong>{currency.format(totalSales)}</strong>
        </article>
        <article>
          <span>Ticket promedio</span>
          <strong>{currency.format(average)}</strong>
        </article>
        <article>
          <span>Valor del inventario</span>
          <strong>
            {currency.format(
              articles.reduce(
                (sum, item) =>
                  sum + Number(item.stockLevel) * Number(item.retailPrice),
                0,
              ),
            )}
          </strong>
        </article>
      </section>

      <article className="panel report-panel">
        <div className="report-tabs" role="tablist" aria-label="Tipo de reporte">
          <button
            className={tab === "sales" ? "active" : ""}
            onClick={() => setTab("sales")}
            type="button"
          >
            <ReceiptText size={17} /> Ventas
          </button>
          <button
            className={tab === "inventory" ? "active" : ""}
            onClick={() => setTab("inventory")}
            type="button"
          >
            <Boxes size={17} /> Inventario
          </button>
          <button
            className={tab === "clients" ? "active" : ""}
            onClick={() => setTab("clients")}
            type="button"
          >
            <Users size={17} /> Clientes
          </button>
        </div>
        <div className="table-wrap">
          {tab === "sales" && (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Caja</th>
                  <th>Método</th>
                  <th>Productos</th>
                  <th>Subtotal</th>
                  <th>Descuento</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={getEntityId(sale) || `${sale.registerId}-${sale.createdAt}`}>
                    <td>{formatDate(sale.createdAt)}</td>
                    <td className="mono-cell">{sale.registerId}</td>
                    <td>
                      <StatusBadge status="neutral">
                        {sale.paymentMethod === "cash"
                          ? "Efectivo"
                          : sale.paymentMethod === "card"
                            ? "Tarjeta"
                            : "Transferencia"}
                      </StatusBadge>
                    </td>
                    <td>
                      {sale.itemsSold.reduce(
                        (sum, item) => sum + Number(item.quantity),
                        0,
                      )}{" "}
                      uds.
                    </td>
                    <td>{currency.format(Number(sale.subtotal))}</td>
                    <td>{currency.format(Number(sale.discount))}</td>
                    <td>
                      <strong>{currency.format(Number(sale.totalAmount))}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "inventory" && (
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Sección</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Valor estimado</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={getEntityId(article) || article.barcode}>
                    <td>
                      <strong>{article.name}</strong>
                    </td>
                    <td className="mono-cell">{article.barcode}</td>
                    <td>{sectionName(article)}</td>
                    <td>{article.stockLevel}</td>
                    <td>{currency.format(Number(article.retailPrice))}</td>
                    <td>
                      <strong>
                        {currency.format(
                          Number(article.stockLevel) *
                            Number(article.retailPrice),
                        )}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "clients" && (
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Identificación</th>
                  <th>Compras</th>
                  <th>Consumo acumulado</th>
                  <th>Ticket promedio</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.clientId || getEntityId(client)}>
                    <td>
                      <strong>{client.name}</strong>
                    </td>
                    <td>{client.identification}</td>
                    <td>{client.totalPurchases}</td>
                    <td>{currency.format(Number(client.totalAmount))}</td>
                    <td>
                      {currency.format(
                        Number(client.totalAmount) /
                          Math.max(Number(client.totalPurchases), 1),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>
    </>
  );
}
