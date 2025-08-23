// src/pages/Costs.js
import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getCosts } from "../services/costServices";
import "../assets/scss/costs.scss";

const { Title } = Typography;

const Costs = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Backend’den maliyetleri çek
  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const res = await getCosts();
        // MongoDB’den gelen veriye key ekleyelim
        const costsWithKey = res.data.map((item) => ({
          ...item,
          key: item._id,
        }));
        setData(costsWithKey);
      } catch (error) {
        console.error(error);
        message.error("Maliyetler yüklenirken hata oluştu!");
      }
    };

    fetchCosts();
  }, []);

  const columns = [
    { title: "Ürünün Adı", dataIndex: "productName", key: "productName" },
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
  ];

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
      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default Costs;
