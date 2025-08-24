// src/pages/CostCalculation.js
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Typography, Row, Col } from "antd";
import categoriesData from "../data/categories.json";
import "../assets/scss/costCalculation.scss";

const { Title } = Typography;
const { Option } = Select;

const CostCalculation = () => {
  const [form] = Form.useForm();
  const [kategoriList, setKategoriList] = useState([]);
  const [commissionRate, setCommissionRate] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [withholding, setWithholding] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(0);

  const flattenCategories = (categories, parentPath = "") => {
    let result = [];
    categories.forEach((cat) => {
      const fullPath = parentPath ? `${parentPath} ➝ ${cat.Name}` : cat.Name;

      if (cat.Commission !== undefined && cat.Id) {
        result.push({
          id: cat.Id,
          name: cat.Name,
          path: fullPath,
          commission: cat.Commission,
        });
      }

      if (cat.subCategories && cat.subCategories.length > 0) {
        result = result.concat(flattenCategories(cat.subCategories, fullPath));
      }
    });
    return result;
  };

  useEffect(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      const flat = flattenCategories(categoriesData);
      setKategoriList(flat);
    }
  }, []);

  const handleMarketplaceChange = (value) => {
    setServiceFee(value === "Trendyol" ? 10.19 : 0);
    calculateTotalCost(form.getFieldValue("salePrice") || 0, form.getFieldValue("shippingFee") || 0, value === "Trendyol" ? 10.19 : 0, commissionRate);
  };

  const handleSalePriceChange = (e) => {
    const salePrice = parseFloat(e.target.value) || 0;
    setWithholding(salePrice * 0.01);
    calculateTotalCost(salePrice, form.getFieldValue("shippingFee") || 0, serviceFee, commissionRate);
  };

  const handlePurchasePriceChange = () => {
    calculateProfitOrLoss();
  };

  const handleShippingFeeChange = (e) => {
    const shippingFee = parseFloat(e.target.value) || 0;
    calculateTotalCost(form.getFieldValue("salePrice") || 0, shippingFee, serviceFee, commissionRate);
  };

  const handleCategoryChange = (value) => {
    const selected = kategoriList.find((k) => k.id === value);
    if (selected) {
      setCommissionRate(selected.commission ?? 0);
      form.setFieldsValue({ commission: selected.commission ?? 0 });
      calculateTotalCost(form.getFieldValue("salePrice") || 0, form.getFieldValue("shippingFee") || 0, serviceFee, selected.commission ?? 0);
    }
  };

  const calculateTotalCost = (salePrice, shippingFee, serviceFee, commissionRate) => {
    const komisyon = salePrice * (commissionRate / 100);
    const stopaj = salePrice * 0.01;
    const total = komisyon + stopaj + serviceFee + shippingFee;
    setTotalCost(total);
    calculateProfitOrLoss(total);
  };

  const calculateProfitOrLoss = (total = totalCost) => {
    const purchasePrice = parseFloat(form.getFieldValue("purchasePrice")) || 0;
    const salePrice = parseFloat(form.getFieldValue("salePrice")) || 0;
    const profit = salePrice - purchasePrice - total;
    setProfitOrLoss(profit);
  };

  const handleFinish = (values) => {
    console.log("Form Değerleri:", values);
    console.log("Toplam Maliyet:", totalCost.toFixed(2));
    console.log("Kar/Zarar:", profitOrLoss.toFixed(2));
    alert("Hesaplama tamamlandı. Konsolu kontrol edin.");
  };

  // Kar/zarar kutusu rengi
  const profitColor =
    profitOrLoss > 0 ? "#198754" : profitOrLoss < 0 ? "#dc3545" : "#0d6efd";

  return (
    <div className="cost-calculation-page">
      <Title level={2}>Maliyet Hesabı</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        style={{ maxWidth: 800 }}
      >
        {/* 1. satır */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Pazaryeri"
              name="marketplace"
              rules={[{ required: true, message: "Lütfen pazaryeri seçin!" }]}
            >
              <Select onChange={handleMarketplaceChange}>
                <Option value="Trendyol">Trendyol</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Kategori"
              name="category"
              rules={[{ required: true, message: "Lütfen kategori seçin!" }]}
            >
              <Select
                showSearch
                placeholder="Kategori ara..."
                optionFilterProp="children"
                onChange={handleCategoryChange}
                filterOption={(input, option) =>
                  String(option?.children ?? option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {kategoriList.map((kat) => (
                  <Option key={kat.id} value={kat.id}>
                    {kat.path}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 2. satır */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ürün Satış Fiyatı"
              name="salePrice"
              rules={[
                { required: true, message: "Lütfen satış fiyatını girin!" },
              ]}
            >
              <Input
                type="text"
                onChange={handleSalePriceChange}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="Sadece rakam girin"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ürün Alış Fiyatı"
              name="purchasePrice"
              rules={[
                { required: true, message: "Lütfen alış fiyatını girin!" },
              ]}
            >
              <Input
                type="text"
                onChange={handlePurchasePriceChange}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="Sadece rakam girin"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 3. satır */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Komisyon" name="commission">
              <Input type="number" value={commissionRate} readOnly />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="KDV"
              name="vat"
              rules={[{ required: true, message: "Lütfen KDV seçin!" }]}
            >
              <Select>
                <Option value={0}>%0</Option>
                <Option value={1}>%1</Option>
                <Option value={10}>%10</Option>
                <Option value={20}>%20</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 4. satır */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Kargo Ücreti"
              name="shippingFee"
              rules={[
                { required: true, message: "Lütfen kargo ücretini girin!" },
              ]}
            >
              <Input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={handleShippingFeeChange}
                placeholder="Sadece rakam girin"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Kargo Tipi"
              name="shippingType"
              rules={[{ required: true, message: "Lütfen kargo tipi seçin!" }]}
            >
              <Select>
                <Option value="SaticiyaAit">Satıcıya Ait</Option>
                <Option value="Ihracat">İhracat</Option>
                <Option value="AyniGun">Aynı Gün</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 5. satır */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Hizmet Bedeli">
              <Input type="number" value={serviceFee} readOnly />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Stopaj Bedeli">
              <Input type="number" value={withholding.toFixed(2)} readOnly />
            </Form.Item>
          </Col>
        </Row>

        {/* Son satır */}
{/*         <Form.Item>
          <Button type="primary" htmlType="submit">
            Hesapla
          </Button>
        </Form.Item> */}

        {/* Uyarı mesajı */}
        <div
          style={{
            backgroundColor: "#FFF3CD",
            color: "#856404",
            padding: "12px",
            borderRadius: "4px",
            marginTop: "16px",
            fontWeight: "500",
          }}
        >
          *Alış, Satış ve Kargo Fiyatlarını KDV dahil girmeniz gerekmektedir.
        </div>

        {/* Maliyet ve Kar/Zarar Kutucuğu (Animasyonlu) */}
        <div
          style={{
            backgroundColor: profitColor,
            color: "#fff",
            padding: "12px",
            borderRadius: "4px",
            marginTop: "16px",
            fontWeight: "600",
            transition: "background-color 0.5s ease", // animasyon eklendi
          }}
        >
          Toplam Maliyet: {totalCost.toFixed(2)}₺
          <br />
          {profitOrLoss > 0
            ? `Kar: ${profitOrLoss.toFixed(2)}₺`
            : profitOrLoss < 0
            ? `Zarar: ${profitOrLoss.toFixed(2)}₺`
            : `Kar/Zarar: 0₺`}
        </div>
      </Form>
    </div>
  );
};

export default CostCalculation;
