"use client";

import {
  ArrowLeftRight,
  Banknote,
  CircleDollarSign,
  CreditCard,
  Landmark,
  Minus,
  Plus,
  ReceiptText,
  Save,
  Search,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { getEntityId, postJson } from "./api";
import type { Article, CartItem, CashRegister, Client } from "./types";
import {
  type ActionRunner,
  currency,
  EmptyState,
  Field,
  PageHeader,
  sectionName,
} from "./ui";

export function CheckoutView({
  articles,
  clients,
  registers,
  runAction,
  reload,
}: {
  articles: Article[];
  clients: Client[];
  registers: CashRegister[];
  runAction: ActionRunner;
  reload: () => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [registerId, setRegisterId] = useState("");
  const [clientId, setClientId] = useState("");
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] =
    useState<"cash" | "card" | "transfer">("cash");
  const [registerForm, setRegisterForm] = useState({
    registerNumber: "",
    initialBalance: "0",
  });
  const [movementForm, setMovementForm] = useState({
    type: "income",
    amount: "",
    paymentMethod: "cash",
    description: "",
  });
  const [countedBalance, setCountedBalance] = useState("");

  const selectedRegisterId =
    registerId ||
    getEntityId(registers.find((register) => register.status === "open") ?? null);

  const visibleArticles = articles
    .filter((article) => {
      const term = search.toLowerCase();
      return (
        article.name.toLowerCase().includes(term) ||
        article.barcode.includes(term)
      );
    })
    .slice(0, 8);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.article.retailPrice) * item.quantity,
    0,
  );
  const discountValue = Math.max(Number(discount) || 0, 0);
  const total = Math.max(subtotal - discountValue, 0);

  const addProduct = (article: Article) => {
    setCart((current) => {
      const exists = current.find(
        (item) => item.article.barcode === article.barcode,
      );
      if (exists) {
        return current.map((item) =>
          item.article.barcode === article.barcode
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  Math.max(Number(article.stockLevel), 1),
                ),
              }
            : item,
        );
      }
      return [...current, { article, quantity: 1 }];
    });
  };

  const changeQuantity = (barcode: string, change: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.article.barcode === barcode
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  Math.min(
                    item.quantity + change,
                    Math.max(Number(item.article.stockLevel), 1),
                  ),
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const submitSale = async () => {
    if (!selectedRegisterId || !cart.length) return;
    const ok = await runAction(
      () =>
        postJson("/checkout/transactions", {
          registerId: selectedRegisterId,
          clientId: clientId || undefined,
          paymentMethod,
          discount: discountValue,
          itemsSold: cart.map((item) => ({
            articleCode: item.article.barcode,
            quantity: item.quantity,
            unitPrice: Number(item.article.retailPrice),
          })),
        }),
      "Venta procesada correctamente",
    );
    if (ok) {
      setCart([]);
      setClientId("");
      setDiscount("0");
      await reload();
    }
  };

  const submitRegister = async (event: FormEvent) => {
    event.preventDefault();
    const initialBalance = Number(registerForm.initialBalance);
    const ok = await runAction(
      () =>
        postJson("/checkout/registers", {
          registerNumber: Number(registerForm.registerNumber),
          initialBalance,
          currentBalance: initialBalance,
          status: "open",
        }),
      "Caja creada y abierta",
    );
    if (ok) {
      setRegisterForm({ registerNumber: "", initialBalance: "0" });
      await reload();
    }
  };

  const submitMovement = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedRegisterId) return;
    const ok = await runAction(
      () =>
        postJson("/checkout/movements", {
          registerId: selectedRegisterId,
          ...movementForm,
          amount: Number(movementForm.amount),
        }),
      "Movimiento de caja registrado",
    );
    if (ok) {
      setMovementForm({
        type: "income",
        amount: "",
        paymentMethod: "cash",
        description: "",
      });
      await reload();
    }
  };

  const closeRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedRegisterId) return;
    const ok = await runAction(
      () =>
        postJson("/checkout/close", {
          registerId: selectedRegisterId,
          countedBalance: Number(countedBalance),
        }),
      "Caja cerrada y arqueada",
    );
    if (ok) {
      setCountedBalance("");
      await reload();
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Venta rápida"
        title="Punto de venta"
        description="Selecciona productos, elige la forma de pago y procesa la transacción."
      />

      <section className="pos-layout">
        <article className="panel product-browser">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Catálogo disponible</span>
              <h2>Agregar productos</h2>
            </div>
            <span className="item-count">{articles.length} productos</span>
          </div>
          <label className="search-box">
            <Search size={18} />
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o código"
              value={search}
            />
          </label>
          {visibleArticles.length ? (
            <div className="product-picker">
              {visibleArticles.map((article) => (
                <button
                  className="product-card"
                  disabled={Number(article.stockLevel) <= 0}
                  key={getEntityId(article) || article.barcode}
                  onClick={() => addProduct(article)}
                  type="button"
                >
                  <span className="product-initial large">
                    {article.name.charAt(0)}
                  </span>
                  <span className="product-card-copy">
                    <strong>{article.name}</strong>
                    <small>
                      {sectionName(article)} · {article.stockLevel} uds.
                    </small>
                  </span>
                  <span className="product-price">
                    {currency.format(Number(article.retailPrice))}
                  </span>
                  <Plus size={17} />
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Sin coincidencias"
              description="Prueba con otro nombre o código."
            />
          )}
        </article>

        <aside className="panel cart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Venta actual</span>
              <h2>Resumen</h2>
            </div>
            <span className="cart-count">{cart.length}</span>
          </div>
          <div className="cart-items">
            {cart.length ? (
              cart.map((item) => (
                <div className="cart-item" key={item.article.barcode}>
                  <div>
                    <strong>{item.article.name}</strong>
                    <small>{currency.format(Number(item.article.retailPrice))}</small>
                  </div>
                  <div className="quantity-control">
                    <button
                      aria-label={`Reducir ${item.article.name}`}
                      onClick={() => changeQuantity(item.article.barcode, -1)}
                      type="button"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Aumentar ${item.article.name}`}
                      onClick={() => changeQuantity(item.article.barcode, 1)}
                      type="button"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <strong>
                    {currency.format(
                      Number(item.article.retailPrice) * item.quantity,
                    )}
                  </strong>
                  <button
                    aria-label={`Eliminar ${item.article.name}`}
                    className="icon-button danger"
                    onClick={() =>
                      setCart((current) =>
                        current.filter(
                          (cartItem) =>
                            cartItem.article.barcode !== item.article.barcode,
                        ),
                      )
                    }
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <EmptyState
                icon={ShoppingCart}
                title="La venta está vacía"
                description="Agrega un producto desde el catálogo."
              />
            )}
          </div>

          <div className="checkout-fields">
            <Field label="Caja">
              <select
                onChange={(event) => setRegisterId(event.target.value)}
                value={selectedRegisterId}
              >
                <option value="">Selecciona una caja</option>
                {registers.map((register) => (
                  <option
                    key={getEntityId(register)}
                    value={getEntityId(register)}
                  >
                    Caja {register.registerNumber} ·{" "}
                    {register.status === "open" ? "Abierta" : "Cerrada"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cliente">
              <select
                onChange={(event) => setClientId(event.target.value)}
                value={clientId}
              >
                <option value="">Consumidor final</option>
                {clients.map((client) => (
                  <option key={getEntityId(client)} value={getEntityId(client)}>
                    {client.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Descuento">
              <input
                min="0"
                onChange={(event) => setDiscount(event.target.value)}
                step="0.01"
                type="number"
                value={discount}
              />
            </Field>
          </div>

          <div className="payment-options" role="group" aria-label="Forma de pago">
            {[
              { id: "cash" as const, label: "Efectivo", icon: Banknote },
              { id: "card" as const, label: "Tarjeta", icon: CreditCard },
              { id: "transfer" as const, label: "Transfer.", icon: Landmark },
            ].map(({ id, label, icon: Icon }) => (
              <button
                className={paymentMethod === id ? "active" : ""}
                key={id}
                onClick={() => setPaymentMethod(id)}
                type="button"
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <div className="totals">
            <span>
              Subtotal <strong>{currency.format(subtotal)}</strong>
            </span>
            <span>
              Descuento <strong>-{currency.format(discountValue)}</strong>
            </span>
            <span className="grand-total">
              Total <strong>{currency.format(total)}</strong>
            </span>
          </div>
          <button
            className="primary-button full-button"
            disabled={!selectedRegisterId || !cart.length}
            onClick={submitSale}
            type="button"
          >
            <ReceiptText size={19} />
            Cobrar {currency.format(total)}
          </button>
        </aside>
      </section>

      <section className="operations-grid">
        <form className="panel compact-form" onSubmit={submitRegister}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Administración</span>
              <h2>Abrir nueva caja</h2>
            </div>
            <Store size={20} />
          </div>
          <div className="form-row">
            <Field label="Número">
              <input
                min="1"
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    registerNumber: event.target.value,
                  }))
                }
                required
                type="number"
                value={registerForm.registerNumber}
              />
            </Field>
            <Field label="Saldo inicial">
              <input
                min="0"
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    initialBalance: event.target.value,
                  }))
                }
                step="0.01"
                type="number"
                value={registerForm.initialBalance}
              />
            </Field>
          </div>
          <button className="secondary-button" type="submit">
            <Plus size={17} /> Crear y abrir
          </button>
        </form>

        <form className="panel compact-form" onSubmit={submitMovement}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Ajuste manual</span>
              <h2>Movimiento de caja</h2>
            </div>
            <ArrowLeftRight size={20} />
          </div>
          <div className="form-row">
            <Field label="Tipo">
              <select
                onChange={(event) =>
                  setMovementForm((current) => ({
                    ...current,
                    type: event.target.value,
                  }))
                }
                value={movementForm.type}
              >
                <option value="income">Ingreso</option>
                <option value="expense">Egreso</option>
              </select>
            </Field>
            <Field label="Monto">
              <input
                min="0.01"
                onChange={(event) =>
                  setMovementForm((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
                required
                step="0.01"
                type="number"
                value={movementForm.amount}
              />
            </Field>
          </div>
          <Field label="Descripción">
            <input
              onChange={(event) =>
                setMovementForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Motivo del movimiento"
              value={movementForm.description}
            />
          </Field>
          <button className="secondary-button" disabled={!selectedRegisterId} type="submit">
            <Save size={17} /> Registrar movimiento
          </button>
        </form>

        <form className="panel compact-form" onSubmit={closeRegister}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Arqueo</span>
              <h2>Cerrar caja</h2>
            </div>
            <CircleDollarSign size={20} />
          </div>
          <Field label="Saldo contado">
            <input
              min="0"
              onChange={(event) => setCountedBalance(event.target.value)}
              required
              step="0.01"
              type="number"
              value={countedBalance}
            />
          </Field>
          <p className="form-note">
            La diferencia se calculará contra el saldo actual.
          </p>
          <button
            className="secondary-button danger-button"
            disabled={!selectedRegisterId}
            type="submit"
          >
            Cerrar caja
          </button>
        </form>
      </section>
    </>
  );
}
