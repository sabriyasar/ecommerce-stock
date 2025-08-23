import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Checkbox, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import getPrivateColumns from "../components/privateColumns";

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
  ];

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);

    // Başlangıçta hiç optional kolon seçili değil
    setSelectedColumns([]);
  }, []);

  const handleDelete = (key) => {
    const updatedProducts = products.filter((item) => item.key !== key);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    message.success("Ürün başarıyla silindi.");
  };

  const allColumns = getPrivateColumns(navigate, handleDelete);

  // Sadece zorunlu kolonları ilk mountta göster
  const displayedColumns = allColumns.filter((col) => {
    if (mandatoryKeys.includes(col.key)) return true;
    return selectedColumns.includes(col.key);
  });

  // Zorunlu olmayan kolonlar modal için
  const optionalColumns = allColumns.filter(
    (col) => !mandatoryKeys.includes(col.key)
  );

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => navigate("/addnewproducts")}>
          Yeni Ürün Ekle
        </Button>
        <Button onClick={() => setCustomizeVisible(true)}>Tabloyu Özelleştir</Button>
      </Space>

      <Table
        dataSource={products}
        columns={displayedColumns}
        rowKey="key"
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Tabloyu Özelleştir"
        visible={customizeVisible}
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
