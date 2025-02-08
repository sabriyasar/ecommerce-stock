import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Row,
  Col,
  Select,
  Space,
  Typography,
  Table,
  Dropdown,
  Menu,
  message,
} from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import "../assets/scss/products.scss";

const { Title } = Typography;
const { Option } = Select;

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 💾 LocalStorage'dan Ürünleri Çek
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, []); // Eğer sayfa render edildiyse yeniden yükle

  const handleDelete = (key) => {
    const filteredProducts = products.filter((product) => product.key !== key);
    setProducts(filteredProducts);
    localStorage.setItem("products", JSON.stringify(filteredProducts));
    message.success("Ürün başarıyla silindi.");
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchText.toLowerCase();
    return (
      (selectedCategory === "all" || product.category === selectedCategory) &&
      (
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.price.toString().includes(searchLower) ||
        product.cost.toString().includes(searchLower) ||
        product.barcode.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.platform && product.platform.toLowerCase().includes(searchLower))
      )
    );
  });

  const columns = [
    {
      title: "Fotoğraf",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img src={text} alt="Ürün" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text} ₺`,
    },
    {
      title: "Maliyet",
      dataIndex: "cost",
      key: "cost",
      render: (text) => `${text} ₺`,
    },
    {
      title: "Barkod",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "KDV",
      dataIndex: "vatRate",
      key: "vatRate",
      render: (text) => {
        if (text === "1") return "%1";
        if (text === "10") return "%10";
        if (text === "20") return "%20";
        return "Bilinmiyor";
      },
    },
    {
      title: "Satılan Platform",
      dataIndex: "platform",
      key: "platform",
      render: (text) => text || "Bilinmiyor",
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Revize Bilgisi", // Yeni sütun
      dataIndex: "reviseInfo",
      key: "reviseInfo",
      render: (_, record) => (
        <span>
          {record.reviseCount ? `${record.reviseCount} kez revize edildi` : "Henüz revize edilmedi"}
          <br />
          {record.lastRevised ? `Son revize: ${record.lastRevised}` : ""}
        </span>
      ),
    },
    {
      title: "Aksiyon",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="update"
                onClick={() => navigate(`/editproduct/${record.key}`)}
              >
                Güncelle
              </Menu.Item>
              <Menu.Item
                key="delete"
                danger
                onClick={() => handleDelete(record.key)}
              >
                Sil
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Ürünler</Title>

      <Row gutter={24} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Space>
            <Input
              style={{ width: "300px" }}
              placeholder="Ürün Ara"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
            >
              <Option value="all">Tüm Kategoriler</Option>
              <Option value="electronics">Elektronik</Option>
              <Option value="fashion">Moda</Option>
              <Option value="home">Ev Eşyaları</Option>
              <Option value="toys">Oyuncak</Option>
              <Option value="books">Kitap</Option>
            </Select>
          </Space>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => navigate("/addnewproducts")}>
            Yeni Ürün Ekle
          </Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={filteredProducts} />
    </div>
  );
};

export default Products;
