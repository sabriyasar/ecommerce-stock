import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Checkbox, message, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { FileExcelOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import getPrivateColumns from "../components/privateColumns"; // ✅ Güncellenmiş import
import { getProducts } from "../services/productService"; // MongoDB servisimiz

const Products = () => {
  const [products, setProducts] = useState([]);
  const [customizeVisible, setCustomizeVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const navigate = useNavigate();

  // Zorunlu kolon keyleri
  const mandatoryKeys = [
    "action",
    "barcode",
    "modelCode",
    "brand",
    "category",
    "currency",
    "name",
    "description",
    "marketPrice",
    "trendyolPrice",
    "stock",
    "vatRate",
    "exportExcel", // ✅ Excel kolonunu zorunlu yaptık
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(); // MongoDB’den çekiyoruz
        setProducts(res.data);
      } catch (error) {
        console.error(error);
        message.error("Ürünler yüklenirken hata oluştu!");
      }
    };

    fetchProducts();
    setSelectedColumns([]);
  }, []);

  const handleDelete = (key) => {
    const updatedProducts = products.filter((item) => item._id !== key); // MongoDB’de _id kullanılır
    setProducts(updatedProducts);
    message.success("Ürün başarıyla silindi.");
  };

  // ✅ Tek ürün Excel'e aktarma fonksiyonu
  const handleExportExcel = (record) => {
    const worksheet = XLSX.utils.json_to_sheet([record]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ürün");
    XLSX.writeFile(workbook, `${record.name || "urun"}.xlsx`);
  };

  const allColumns = [
    ...getPrivateColumns(navigate, handleDelete),
    {
      title: "Excel",
      key: "exportExcel",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Tooltip title="Excel’e Aktar">
          <Button
            type="link"
            icon={<FileExcelOutlined style={{ color: "green", fontSize: 18 }} />}
            onClick={() => handleExportExcel(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const displayedColumns = allColumns.filter((col) => {
    if (mandatoryKeys.includes(col.key)) return true;
    return selectedColumns.includes(col.key);
  });

  const optionalColumns = allColumns.filter(
    (col) => !mandatoryKeys.includes(col.key)
  );

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => navigate("/addnewproducts")}>
          Yeni Ürün Ekle
        </Button>
        <Button onClick={() => setCustomizeVisible(true)}>
          Tabloyu Özelleştir
        </Button>
      </Space>

      <Table
        dataSource={products}
        columns={displayedColumns}
        rowKey="_id"
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Tabloyu Özelleştir"
        open={customizeVisible}
        onCancel={() => setCustomizeVisible(false)}
        onOk={() => setCustomizeVisible(false)}
      >
        <Checkbox.Group
          value={selectedColumns}
          onChange={(checked) => setSelectedColumns(checked)}
        >
          <Space direction="vertical">
            {optionalColumns.map((col) => (
              <Checkbox key={col.key} value={col.key}>
                {col.title}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Modal>
    </div>
  );
};

export default Products;
