// src/components/privateColumns.js
import React from "react";
import { Button, Space } from "antd";

const getPrivateColumns = (navigate, handleDelete) => [
  {
    title: "Barkod",
    dataIndex: "barcode",
    key: "barcode",
  },
  {
    title: "Model Kodu",
    dataIndex: "modelCode",
    key: "modelCode",
  },
  {
    title: "Marka",
    dataIndex: "brand",
    key: "brand",
  },
  {
    title: "Kategori",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Para Birimi",
    dataIndex: "currency",
    key: "currency",
    render: () => "TRY", // sabit
  },
  {
    title: "Ürün Adı",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Ürün Açıklaması",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Piyasa Satış Fiyatı (KDV Dahil)",
    dataIndex: "marketPrice",
    key: "marketPrice",
    render: (text) => `${text} ₺`,
  },
  {
    title: "Trendyol'da Satılacak Fiyat (KDV Dahil)",
    dataIndex: "trendyolPrice",
    key: "trendyolPrice",
    render: (text) => `${text} ₺`,
  },
  {
    title: "Ürün Stok Adedi",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "Stok Kodu",
    dataIndex: "stockCode",
    key: "stockCode",
  },
  {
    title: "KDV Oranı",
    dataIndex: "vatRate",
    key: "vatRate",
    render: (text) => `%${text}`,
  },
  {
    title: "Desi",
    dataIndex: "desi",
    key: "desi",
  },
  // Görsel sütunları (1–8 + paket ön/arka)
  ...Array.from({ length: 8 }, (_, i) => ({
    title: `Görsel ${i + 1}`,
    dataIndex: `image${i + 1}`,
    key: `image${i + 1}`,
    render: (url) =>
      url ? <img src={url} alt="ürün" style={{ width: 40, height: 40 }} /> : "-",
  })),
  {
    title: "Paket Görseli (ön)",
    dataIndex: "packageImageFront",
    key: "packageImageFront",
    render: (url) =>
      url ? <img src={url} alt="ön paket" style={{ width: 40, height: 40 }} /> : "-",
  },
  {
    title: "Paket Görseli (arka)",
    dataIndex: "packageImageBack",
    key: "packageImageBack",
    render: (url) =>
      url ? <img src={url} alt="arka paket" style={{ width: 40, height: 40 }} /> : "-",
  },
  {
    title: "Sevkiyat Süresi",
    dataIndex: "shippingTime",
    key: "shippingTime",
  },
  {
    title: "Sevkiyat Tipi",
    dataIndex: "shippingType",
    key: "shippingType",
  },
  {
    title: "Pil ile mi çalışır?",
    dataIndex: "batteryRequired",
    key: "batteryRequired",
  },
  {
    title: "Paket İçeriği",
    dataIndex: "packageContent",
    key: "packageContent",
  },
  {
    title: "Renk",
    dataIndex: "color",
    key: "color",
  },
  {
    title: "CE Uygunluk Sembolü",
    dataIndex: "ceCertificate",
    key: "ceCertificate",
  },
  {
    title: "Üretici Bilgisi",
    dataIndex: "manufacturer",
    key: "manufacturer",
  },
  {
    title: "Özellik",
    dataIndex: "feature",
    key: "feature",
  },
  {
    title: "Yaş",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Piller Kutuya Dahil Mi?",
    dataIndex: "batteryIncluded",
    key: "batteryIncluded",
  },
  {
    title: "İthalatçı / Yetkili Temsilci",
    dataIndex: "importer",
    key: "importer",
  },
  {
    title: "Kullanım Talimatı / Uyarıları",
    dataIndex: "instructions",
    key: "instructions",
    ellipsis: true,
  },
  {
    title: "Batarya Boyutu",
    dataIndex: "batterySize",
    key: "batterySize",
  },
  {
    title: "Diğer Özellikler",
    dataIndex: "otherFeatures",
    key: "otherFeatures",
  },
  {
    title: "Yaş Grubu",
    dataIndex: "ageGroup",
    key: "ageGroup",
  },
  {
    title: "Ürün Uyarıları (Oyuncak)",
    dataIndex: "warnings",
    key: "warnings",
    ellipsis: true,
  },
  {
    title: "Menşei",
    dataIndex: "origin",
    key: "origin",
  },
  {
    title: "Batarya Türü",
    dataIndex: "batteryType",
    key: "batteryType",
  },
  {
    title: "Aksiyon",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button onClick={() => navigate(`/editproduct/${record._id}`)}>Güncelle</Button>
        <Button danger onClick={() => handleDelete(record._id)}>Sil</Button>
      </Space>
    ),
  }  
];

export default getPrivateColumns;
