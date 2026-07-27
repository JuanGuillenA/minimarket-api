"use client";

import {
  Edit3,
  PackagePlus,
  Plus,
  Save,
  Search,
  Truck,
  Users,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { getEntityId, postJson, putJson } from "./api";
import type { Article, Client, Supplier } from "./types";
import {
  type ActionRunner,
  currency,
  EmptyState,
  Field,
  PageHeader,
  StatusBadge,
} from "./ui";

export function SupplyView({
  suppliers,
  articles,
  runAction,
  reload,
}: {
  suppliers: Supplier[];
  articles: Article[];
  runAction: ActionRunner;
  reload: () => Promise<void>;
}) {
  const [supplierForm, setSupplierForm] = useState({
    companyName: "",
    contactEmail: "",
    phoneNumber: "",
  });
  const [orderForm, setOrderForm] = useState({
    supplierId: "",
    articleCode: "",
    quantity: "",
    unitCost: "",
  });

  const submitSupplier = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await runAction(
      () => postJson("/supply/suppliers", supplierForm),
      "Proveedor registrado",
    );
    if (ok) {
      setSupplierForm({ companyName: "", contactEmail: "", phoneNumber: "" });
      await reload();
    }
  };

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await runAction(
      () =>
        postJson("/supply/restock", {
          supplierId: orderForm.supplierId,
          itemsReceived: [
            {
              articleCode: orderForm.articleCode,
              quantity: Number(orderForm.quantity),
              unitCost: Number(orderForm.unitCost),
            },
          ],
        }),
      "Orden de reposición registrada",
    );
    if (ok) {
      setOrderForm({
        supplierId: "",
        articleCode: "",
        quantity: "",
        unitCost: "",
      });
      await reload();
    }
  };

  const estimatedCost =
    (Number(orderForm.quantity) || 0) * (Number(orderForm.unitCost) || 0);

  return (
    <>
      <PageHeader
        eyebrow="Cadena de suministro"
        title="Abastecimiento"
        description="Gestiona proveedores y documenta las órdenes de reposición."
      />
      <section className="supplier-grid">
        {suppliers.map((supplier) => (
          <article className="supplier-card" key={getEntityId(supplier)}>
            <span className="supplier-logo">
              {supplier.companyName
                .split(" ")
                .slice(0, 2)
                .map((word) => word.charAt(0))
                .join("")}
            </span>
            <div>
              <strong>{supplier.companyName}</strong>
              <a href={`mailto:${supplier.contactEmail}`}>
                {supplier.contactEmail}
              </a>
              <small>{supplier.phoneNumber}</small>
            </div>
            <StatusBadge status="success">Activo</StatusBadge>
          </article>
        ))}
        {!suppliers.length && (
          <EmptyState
            icon={Truck}
            title="Sin proveedores"
            description="Registra el primer contacto comercial."
          />
        )}
      </section>

      <section className="operations-grid supply-forms">
        <form className="panel form-panel" onSubmit={submitSupplier}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Directorio</span>
              <h2>Nuevo proveedor</h2>
            </div>
            <Truck size={21} />
          </div>
          <Field label="Empresa">
            <input
              onChange={(event) =>
                setSupplierForm((current) => ({
                  ...current,
                  companyName: event.target.value,
                }))
              }
              required
              value={supplierForm.companyName}
            />
          </Field>
          <Field label="Correo de contacto">
            <input
              onChange={(event) =>
                setSupplierForm((current) => ({
                  ...current,
                  contactEmail: event.target.value,
                }))
              }
              required
              type="email"
              value={supplierForm.contactEmail}
            />
          </Field>
          <Field label="Teléfono">
            <input
              onChange={(event) =>
                setSupplierForm((current) => ({
                  ...current,
                  phoneNumber: event.target.value,
                }))
              }
              required
              value={supplierForm.phoneNumber}
            />
          </Field>
          <button className="primary-button full-button" type="submit">
            <Plus size={18} /> Guardar proveedor
          </button>
        </form>

        <form className="panel form-panel order-form" onSubmit={submitOrder}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Recepción</span>
              <h2>Nueva reposición</h2>
            </div>
            <PackagePlus size={21} />
          </div>
          <Field label="Proveedor">
            <select
              onChange={(event) =>
                setOrderForm((current) => ({
                  ...current,
                  supplierId: event.target.value,
                }))
              }
              required
              value={orderForm.supplierId}
            >
              <option value="">Selecciona un proveedor</option>
              {suppliers.map((supplier) => (
                <option key={getEntityId(supplier)} value={getEntityId(supplier)}>
                  {supplier.companyName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Producto">
            <select
              onChange={(event) =>
                setOrderForm((current) => ({
                  ...current,
                  articleCode: event.target.value,
                }))
              }
              required
              value={orderForm.articleCode}
            >
              <option value="">Selecciona un producto</option>
              {articles.map((article) => (
                <option key={article.barcode} value={article.barcode}>
                  {article.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="form-row">
            <Field label="Cantidad">
              <input
                min="1"
                onChange={(event) =>
                  setOrderForm((current) => ({
                    ...current,
                    quantity: event.target.value,
                  }))
                }
                required
                type="number"
                value={orderForm.quantity}
              />
            </Field>
            <Field label="Costo unitario">
              <input
                min="0.01"
                onChange={(event) =>
                  setOrderForm((current) => ({
                    ...current,
                    unitCost: event.target.value,
                  }))
                }
                required
                step="0.01"
                type="number"
                value={orderForm.unitCost}
              />
            </Field>
          </div>
          <div className="order-total">
            <span>Costo estimado</span>
            <strong>{currency.format(estimatedCost)}</strong>
          </div>
          <p className="form-note">
            La orden queda registrada. El ingreso de stock se realiza desde
            Inventario.
          </p>
          <button className="primary-button full-button" type="submit">
            <Save size={18} /> Registrar orden
          </button>
        </form>
      </section>
    </>
  );
}

export function ClientsView({
  clients,
  runAction,
  reload,
}: {
  clients: Client[];
  runAction: ActionRunner;
  reload: () => Promise<void>;
}) {
  const emptyForm = {
    name: "",
    identification: "",
    phone: "",
    email: "",
    preferences: "",
  };
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const filtered = clients.filter((client) => {
    const term = query.toLowerCase();
    return (
      client.name.toLowerCase().includes(term) ||
      client.identification.includes(term) ||
      client.email.toLowerCase().includes(term)
    );
  });

  const edit = (client: Client) => {
    setEditingId(getEntityId(client));
    setForm({
      name: client.name,
      identification: client.identification,
      phone: client.phone,
      email: client.email,
      preferences: client.preferences ?? "",
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await runAction(
      () =>
        editingId
          ? putJson(`/clients/${editingId}`, form)
          : postJson("/clients", form),
      editingId ? "Cliente actualizado" : "Cliente registrado",
    );
    if (ok) {
      setEditingId("");
      setForm(emptyForm);
      await reload();
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Relación con clientes"
        title="Clientes"
        description="Mantén los datos listos para asociarlos a futuras compras."
      />
      <section className="content-split">
        <article className="panel table-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Directorio activo</span>
              <h2>{clients.length} clientes</h2>
            </div>
            <label className="search-box compact-search">
              <Search size={17} />
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cliente"
                value={query}
              />
            </label>
          </div>
          {filtered.length ? (
            <div className="client-list">
              {filtered.map((client) => (
                <article className="client-row" key={getEntityId(client)}>
                  <span className="client-avatar">
                    {client.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word.charAt(0))
                      .join("")}
                  </span>
                  <div>
                    <strong>{client.name}</strong>
                    <small>{client.identification}</small>
                  </div>
                  <div>
                    <span>{client.email}</span>
                    <small>{client.phone}</small>
                  </div>
                  <span className="client-preference">
                    {client.preferences || "Sin preferencias"}
                  </span>
                  <button
                    aria-label={`Editar ${client.name}`}
                    className="icon-button"
                    onClick={() => edit(client)}
                    type="button"
                  >
                    <Edit3 size={17} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Sin clientes"
              description="Agrega un cliente o cambia la búsqueda."
            />
          )}
        </article>

        <form className="panel form-panel sticky-panel" onSubmit={submit}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                {editingId ? "Edición" : "Nuevo registro"}
              </span>
              <h2>{editingId ? "Actualizar cliente" : "Agregar cliente"}</h2>
            </div>
            <Users size={21} />
          </div>
          <Field label="Nombre completo">
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
              value={form.name}
            />
          </Field>
          <Field label="Identificación">
            <input
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  identification: event.target.value,
                }))
              }
              required
              value={form.identification}
            />
          </Field>
          <div className="form-row">
            <Field label="Teléfono">
              <input
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                required
                value={form.phone}
              />
            </Field>
            <Field label="Correo">
              <input
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
                type="email"
                value={form.email}
              />
            </Field>
          </div>
          <Field label="Preferencias">
            <textarea
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  preferences: event.target.value,
                }))
              }
              rows={3}
              value={form.preferences}
            />
          </Field>
          <div className="button-row">
            {editingId && (
              <button
                className="ghost-button"
                onClick={() => {
                  setEditingId("");
                  setForm(emptyForm);
                }}
                type="button"
              >
                Cancelar
              </button>
            )}
            <button className="primary-button" type="submit">
              <Save size={18} />
              {editingId ? "Guardar cambios" : "Crear cliente"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
