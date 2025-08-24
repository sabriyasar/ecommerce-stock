// src/pages/Costs.js
import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Button,
  Space,
  message,
  Input,
  Dropdown,
  Checkbox,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getCosts } from "../services/costServices";
import "../assets/scss/costs.scss";

const { Title } = Typography;
const { Search } = Input;

const Costs = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [visibleColumns, setVisibleColumns] = useState([
    "productName",
    "productBarcode",
    "filamentBrand",
    "filamentColor",
    "filamentCost",
    "unitPrice",
    "multiplePrintQty",
    "multiplePrintUnitPrice",
    "createdAt",
    "updatedAt",
    "actions",
  ]);

  const navigate = useNavigate();

  // Backend’den maliyetleri çek
  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const res = await getCosts();
        const costsWithKey = res.data.map((item) => ({
          ...item,
          key: item._id,
        }));
        setData(costsWithKey);
        setFilteredData(costsWithKey);
      } catch (error) {
        console.error(error);
        message.error("Maliyetler yüklenirken hata oluştu!");
      }
    };

    fetchCosts();
  }, []);

  // 🔎 Sadece ürün adı ve barkod üzerinde arama
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter(
      (item) =>
        item.productName?.toLowerCase().includes(value.toLowerCase()) ||
        item.productBarcode?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    { title: "Ürünün Adı", dataIndex: "productName", key: "productName" },
    {
      title: "Ürün Barkodu",
      dataIndex: "productBarcode",
      key: "productBarcode",
    },
    {
      title: "Filament Markası",
      dataIndex: "filamentBrand",
      key: "filamentBrand",
    },
    {
      title: "Filament Rengi",
      dataIndex: "filamentColor",
      key: "filamentColor",
    },
    {
      title: "Filament Ücreti",
      dataIndex: "filamentCost",
      key: "filamentCost",
    },
    { title: "Ürünün Birim Fiyatı", dataIndex: "unitPrice", key: "unitPrice" },
    {
      title: "Çoklu Baskı Adedi",
      dataIndex: "multiplePrintQty",
      key: "multiplePrintQty",
    },
    {
      title: "Çoklu Baskı Birim Fiyatı",
      dataIndex: "multiplePrintUnitPrice",
      key: "multiplePrintUnitPrice",
    },
    {
      title: "Eklenme Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleString("tr-TR") : "-"),
    },
    {
      title: "Revize Edilme Tarihi",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => (date ? new Date(date).toLocaleString("tr-TR") : "-"),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          style={{ backgroundColor: "green", borderColor: "green" }}
          onClick={() => navigate(`/editcost/${record._id}`)}
        >
          Düzenle
        </Button>
      ),
    },
  ];

  // Sadece seçili kolonları göster
  const filteredColumns = columns.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // Kolon filtreleme içeriği
  const columnFilterContent = (
    <div
      style={{
        padding: 8,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderRadius: 4,
      }}
    >
      <Checkbox.Group
        value={visibleColumns}
        onChange={(checkedValues) => setVisibleColumns(checkedValues)}
      >
        <Space direction="vertical">
          {columns.map((col) => (
            <Checkbox key={col.key} value={col.key}>
              {col.title}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </div>
  );

  return (
    <div className="costs-page">
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Maliyetler</Title>
        <Button type="primary" onClick={() => navigate("/addnewcost")}>
          Maliyet Ekle
        </Button>
      </Space>

      {/* Arama ve Filtreleme Butonu */}
      <Space style={{ marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <Search
          placeholder="Ürün adı veya barkoda göre ara"
          allowClear
          enterButton="Ara"
          size="middle"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ minWidth: 250 }}
          value={searchText}
        />

        <Dropdown
          overlay={columnFilterContent}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <Button
            style={{
              backgroundColor: "#faad14", // Ant Design warning yellow
              borderColor: "#faad14",
              color: "#fff",
            }}
          >
            Filtre <DownOutlined />
          </Button>
        </Dropdown>
      </Space>

      <Table dataSource={filteredData} columns={filteredColumns} />
    </div>
  );
};

export default Costs;
