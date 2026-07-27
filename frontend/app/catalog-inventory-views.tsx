"use client";

import {
  ArrowLeftRight,
  Boxes,
  Minus,
  Package,
  PackagePlus,
  Plus,
  Save,
  Search,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { getEntityId, postJson } from "./api";
import type { Article, Section } from "./types";
import {
  type ActionRunner,
  currency,
  EmptyState,
  Field,
  number,
  PageHeader,
  sectionName,
  StatusBadge,
} from "./ui";

export function CatalogView({
  articles,
  sections,
  runAction,
  reload,
}: {
  articles: Article[];
  sections: Section[];
  runAction: ActionRunner;
  reload: () => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [articleForm, setArticleForm] = useState({
    barcode: "",
    name: "",
    retailPrice: "",
    stockLevel: "0",
    sectionId: "",
  });
  const [sectionForm, setSectionForm] = useState({ name: "", description: "" });

  const filtered = articles.filter((article) => {
    const term = query.toLowerCase();
    return (
      article.name.toLowerCase().includes(term) ||
      article.barcode.includes(term) ||
      sectionName(article).toLowerCase().includes(term)
    );
  });

  const submitArticle = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await runAction(
      () =>
        postJson("/catalog/articles", {
          ...articleForm,
          retailPrice: Number(articleForm.retailPrice),
          stockLevel: Number(articleForm.stockLevel),
        }),
      "Producto agregado al catálogo",
    );
    if (ok) {
      setArticleForm({
        barcode: "",
        name: "",
        retailPrice: "",
        stockLevel: "0",
        sectionId: "",
      });
      await reload();
    }
  };

  const submitSection = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await runAction(
      () => postJson("/catalog/sections", sectionForm),
      "Sección creada correctamente",
    );
    if (ok) {
      setSectionForm({ name: "", description: "" });
      await reload();
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Maestro de productos"
        title="Catálogo"
        description="Organiza productos, precios, códigos de barras y secciones."
      />
      <section className="content-split">
        <article className="panel table-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Productos</span>
              <h2>{articles.length} artículos registrados</h2>
            </div>
            <label className="search-box compact-search">
              <Search size={17} />
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar producto"
                value={query}
              />
            </label>
          </div>
          {filtered.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Sección</th>
                    <th>Código</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((article) => (
                    <tr key={getEntityId(article) || article.barcode}>
                      <td>
                        <div className="table-product">
                          <span className="product-initial">
                            {article.name.charAt(0)}
                          </span>
                          <strong>{article.name}</strong>
                        </div>
                      </td>
                      <td>{sectionName(article)}</td>
                      <td className="mono-cell">{article.barcode}</td>
                      <td>{currency.format(Number(article.retailPrice))}</td>
                      <td>
                        <StatusBadge
                          status={
                            Number(article.stockLevel) <= 5 ? "warning" : "success"
                          }
                        >
                          {article.stockLevel} uds.
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No hay productos"
              description="Crea el primer producto o cambia la búsqueda."
            />
          )}
        </article>

        <aside className="side-stack">
          <form className="panel form-panel" onSubmit={submitArticle}>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Nuevo registro</span>
                <h2>Agregar producto</h2>
              </div>
              <PackagePlus size={21} />
            </div>
            <Field label="Nombre">
              <input
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Ej. Leche entera 1 L"
                required
                value={articleForm.name}
              />
            </Field>
            <Field label="Código de barras">
              <input
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    barcode: event.target.value,
                  }))
                }
                required
                value={articleForm.barcode}
              />
            </Field>
            <div className="form-row">
              <Field label="Precio">
                <input
                  min="0.01"
                  onChange={(event) =>
                    setArticleForm((current) => ({
                      ...current,
                      retailPrice: event.target.value,
                    }))
                  }
                  required
                  step="0.01"
                  type="number"
                  value={articleForm.retailPrice}
                />
              </Field>
              <Field label="Stock inicial">
                <input
                  min="0"
                  onChange={(event) =>
                    setArticleForm((current) => ({
                      ...current,
                      stockLevel: event.target.value,
                    }))
                  }
                  type="number"
                  value={articleForm.stockLevel}
                />
              </Field>
            </div>
            <Field label="Sección">
              <select
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    sectionId: event.target.value,
                  }))
                }
                required
                value={articleForm.sectionId}
              >
                <option value="">Selecciona una sección</option>
                {sections.map((section) => (
                  <option key={getEntityId(section)} value={getEntityId(section)}>
                    {section.name}
                  </option>
                ))}
              </select>
            </Field>
            <button className="primary-button full-button" type="submit">
              <Plus size={18} /> Guardar producto
            </button>
          </form>

          <form className="panel form-panel" onSubmit={submitSection}>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Organización</span>
                <h2>Nueva sección</h2>
              </div>
              <Boxes size={20} />
            </div>
            <Field label="Nombre">
              <input
                onChange={(event) =>
                  setSectionForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
                value={sectionForm.name}
              />
            </Field>
            <Field label="Descripción">
              <input
                onChange={(event) =>
                  setSectionForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                required
                value={sectionForm.description}
              />
            </Field>
            <button className="secondary-button full-button" type="submit">
              Crear sección
            </button>
          </form>
        </aside>
      </section>
    </>
  );
}

export function InventoryView({
  articles,
  runAction,
  reload,
}: {
  articles: Article[];
  runAction: ActionRunner;
  reload: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    productId: "",
    type: "entry",
    quantity: "",
    reference: "",
    notes: "",
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await runAction(
      () =>
        postJson("/inventory/movements", {
          ...form,
          quantity: Number(form.quantity),
        }),
      form.type === "entry"
        ? "Ingreso de inventario registrado"
        : "Salida de inventario registrada",
    );
    if (ok) {
      setForm({
        productId: "",
        type: "entry",
        quantity: "",
        reference: "",
        notes: "",
      });
      await reload();
    }
  };

  const totalUnits = articles.reduce(
    (sum, article) => sum + Number(article.stockLevel),
    0,
  );
  const lowStock = articles.filter((article) => Number(article.stockLevel) <= 8);

  return (
    <>
      <PageHeader
        eyebrow="Control de existencias"
        title="Inventario"
        description="Registra entradas y salidas utilizando el código de barras."
      />
      <section className="inventory-summary">
        <div>
          <span>Total de unidades</span>
          <strong>{number.format(totalUnits)}</strong>
        </div>
        <div>
          <span>Productos activos</span>
          <strong>{number.format(articles.length)}</strong>
        </div>
        <div>
          <span>Stock bajo</span>
          <strong>{number.format(lowStock.length)}</strong>
        </div>
      </section>

      <section className="content-split inventory-layout">
        <article className="panel stock-grid-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Disponibilidad</span>
              <h2>Stock actual</h2>
            </div>
            <Boxes size={20} />
          </div>
          {articles.length ? (
            <div className="inventory-cards">
              {[...articles]
                .sort((a, b) => Number(a.stockLevel) - Number(b.stockLevel))
                .map((article) => {
                  const stock = Number(article.stockLevel);
                  const level = stock <= 5 ? "critical" : stock <= 12 ? "medium" : "good";
                  return (
                    <article
                      className={`inventory-card ${level}`}
                      key={getEntityId(article) || article.barcode}
                    >
                      <div>
                        <span className="product-initial">
                          {article.name.charAt(0)}
                        </span>
                        <small>{sectionName(article)}</small>
                      </div>
                      <strong>{article.name}</strong>
                      <span className="stock-number">{stock}</span>
                      <small>unidades disponibles</small>
                      <div className="stock-meter">
                        <span style={{ width: `${Math.min(stock * 3, 100)}%` }} />
                      </div>
                    </article>
                  );
                })}
            </div>
          ) : (
            <EmptyState
              icon={Boxes}
              title="Inventario vacío"
              description="Los productos aparecerán cuando estén registrados."
            />
          )}
        </article>

        <form className="panel form-panel sticky-panel" onSubmit={submit}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Nuevo movimiento</span>
              <h2>Actualizar stock</h2>
            </div>
            <ArrowLeftRight size={21} />
          </div>
          <div className="segmented-control">
            <button
              className={form.type === "entry" ? "active" : ""}
              onClick={() => setForm((current) => ({ ...current, type: "entry" }))}
              type="button"
            >
              <Plus size={16} /> Entrada
            </button>
            <button
              className={form.type === "exit" ? "active" : ""}
              onClick={() => setForm((current) => ({ ...current, type: "exit" }))}
              type="button"
            >
              <Minus size={16} /> Salida
            </button>
          </div>
          <Field label="Producto" hint="Se enviará su código de barras.">
            <select
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  productId: event.target.value,
                }))
              }
              required
              value={form.productId}
            >
              <option value="">Selecciona un producto</option>
              {articles.map((article) => (
                <option key={article.barcode} value={article.barcode}>
                  {article.name} · {article.barcode}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cantidad">
            <input
              min="1"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  quantity: event.target.value,
                }))
              }
              required
              type="number"
              value={form.quantity}
            />
          </Field>
          <Field label="Referencia">
            <input
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  reference: event.target.value,
                }))
              }
              placeholder="Factura, venta o ajuste"
              required
              value={form.reference}
            />
          </Field>
          <Field label="Notas">
            <textarea
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
              rows={3}
              value={form.notes}
            />
          </Field>
          <button className="primary-button full-button" type="submit">
            <Save size={18} /> Registrar movimiento
          </button>
        </form>
      </section>
    </>
  );
}
