import { useState, useEffect } from "react";
import {
  getTotalRevenue,
  getBestAuthor,
  getMaxPriceDiffBook,
} from "../../api/services";
import { Loading } from "../../components/ui/States";
import { MediaBadge } from "../../components/ui/Badges";

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState(null);
  const [bestAuthor, setBestAuthor] = useState(null);
  const [maxDiff, setMaxDiff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.allSettled([
      getTotalRevenue(),
      getBestAuthor(),
      getMaxPriceDiffBook(),
    ])
      .then(([r, a, d]) => {
        if (r.status === "fulfilled") setRevenue(r.value.data.total_revenue);
        else
          setErrors((e) => ({
            ...e,
            revenue: r.reason?.response?.data?.detail,
          }));

        if (a.status === "fulfilled") setBestAuthor(a.value.data);
        else
          setErrors((e) => ({
            ...e,
            author: a.reason?.response?.data?.detail,
          }));

        if (d.status === "fulfilled") setMaxDiff(d.value.data);
        else
          setErrors((e) => ({ ...e, diff: d.reason?.response?.data?.detail }));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="page-content">
        <Loading />
      </div>
    );

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Аналитика</h1>
          <div className="page-header__subtitle">
            Статистика продаж и товаров
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {/* Revenue */}
        <div className="stat-card">
          <div className="stat-card__icon"></div>
          <div className="stat-card__label">Общая выручка</div>
          {errors.revenue ? (
            <div style={{ color: "#9A8878", fontSize: ".875rem" }}>
              {errors.revenue}
            </div>
          ) : (
            <>
              <div className="stat-card__value">
                {Number(revenue || 0).toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                })}{" "}
                ₽
              </div>
              <div className="stat-card__sub">Сумма всех продаж</div>
            </>
          )}
        </div>

        {/* Best Author */}
        <div className="stat-card">
          <div className="stat-card__icon"></div>
          <div className="stat-card__label">Лучший автор</div>
          {errors.author ? (
            <div style={{ color: "#9A8878", fontSize: ".875rem" }}>
              {errors.author || "Продаж ещё нет"}
            </div>
          ) : bestAuthor ? (
            <>
              <div className="stat-card__value" style={{ fontSize: "1.4rem" }}>
                {bestAuthor.full_name}
              </div>
              <div className="stat-card__sub">Наибольшее количество продаж</div>
            </>
          ) : (
            <div style={{ color: "#9A8878", fontSize: ".875rem" }}>
              Данных нет
            </div>
          )}
        </div>
      </div>

      {/* Max price diff book */}
      {maxDiff && (
        <div>
          <h2
            style={{
              fontFamily: "Lora, serif",
              fontSize: "1.25rem",
              marginBottom: 16,
            }}
          >
            Максимальная разница цен
          </h2>
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="card__body">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "Lora, serif",
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {maxDiff.title}
                  </div>
                  <div
                    style={{
                      color: "#9A8878",
                      fontSize: ".875rem",
                      marginBottom: 12,
                    }}
                  >
                    {maxDiff.author?.full_name} · {maxDiff.year}
                  </div>
                  <MediaBadge type={maxDiff.media_type} />
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: ".75rem",
                      color: "#9A8878",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    Разница
                  </div>
                  <div
                    style={{
                      fontFamily: "Lora, serif",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: "#4A7C59",
                    }}
                  >
                    +{Number(maxDiff.price_diff).toFixed(2)} ₽
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <PriceBox
                  label="Оптовая"
                  value={maxDiff.wholesale_price}
                  color="#3A7BD5"
                />
                <PriceBox
                  label="Розничная"
                  value={maxDiff.retail_price}
                  color="#8B6F47"
                />
                <PriceBox
                  label="Разница"
                  value={maxDiff.price_diff}
                  color="#4A7C59"
                  highlight
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {errors.diff && (
        <div className="alert alert--info" style={{ maxWidth: 400 }}>
          {errors.diff}
        </div>
      )}
    </div>
  );
}

function PriceBox({ label, value, color, highlight }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: 10,
        background: highlight ? "rgba(74,124,89,.07)" : "#FAF8F4",
        border: `1.5px solid ${highlight ? "rgba(74,124,89,.25)" : "#E8E0D3"}`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: ".72rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: ".06em",
          color: "#9A8878",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Lora, serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          color,
        }}
      >
        {Number(value).toFixed(2)} ₽
      </div>
    </div>
  );
}
