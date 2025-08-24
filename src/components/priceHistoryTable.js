// src/components/PriceHistoryTable.js
import React from "react";
import { Table, Typography, Tooltip } from "antd";

const { Title } = Typography;

const PriceHistoryTable = ({ data }) => {
  const columns = [
    {
      title: "İşlem Tarihi",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? new Date(date).toLocaleString("tr-TR") : "-"),
    },
    {
      title: "Filament Ücreti",
      dataIndex: "filamentCost",
      key: "filamentCost",
      render: (price) =>
        price !== undefined
          ? `${price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`
          : "-",
    },
    {
      title: "Ürünün Birim Fiyatı",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) =>
        price !== undefined
          ? `${price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`
          : "-",
    },
    {
      title: "Çoklu Baskı Adedi",
      dataIndex: "multiplePrintQty",
      key: "multiplePrintQty",
      render: (qty) => (qty !== undefined && qty !== null ? qty : "-"),
    },
    {
      title: "Çoklu Baskı Birim Fiyatı",
      dataIndex: "multiplePrintUnitPrice",
      key: "multiplePrintUnitPrice",
      render: (price) =>
        price !== undefined
          ? `${price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`
          : "-",
    },
    {
      title: "İşlem Detayı",
      dataIndex: "actionDetail",
      key: "actionDetail",
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              display: "inline-block",
              maxWidth: 150,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Değişiklik Yapan Kullanıcı",
      dataIndex: "user",
      key: "user",
    },
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <Title level={4}>Ürün Fiyat Geçmişi</Title>
      <Table
        dataSource={data}
        columns={columns}
        rowKey={(record, index) => index}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default PriceHistoryTable;
