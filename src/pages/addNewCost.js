// src/pages/AddNewCost.js
import React, { useState } from "react";
import { Form, Input, Button, Select, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { addCost } from "../services/costServices";
import "../assets/scss/addNewCost.scss";

const { Title } = Typography;
const { Option } = Select;

const AddNewCost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form değerlerini izleme
  const formValues = Form.useWatch([], form);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await addCost(values);
      message.success("Yeni maliyet başarıyla eklendi!");
      navigate("/costs");
    } catch (error) {
      console.error(error);
      message.error("Maliyet ekleme sırasında hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Sayı validasyon kuralları
  const getNumberRules = (maxDigits) => [
    { required: true, message: "Lütfen sayı girin!" },
    {
      pattern: new RegExp(`^[1-9]\\d{0,${maxDigits - 1}}$`),
      message: `Pozitif tam sayı girin (maks ${maxDigits} hane)`,
    },
  ];

  // Ondalıklı sayı kuralları
  const getDecimalNumberRules = (intDigits, decimalDigits) => [
    { required: true, message: "Lütfen sayı girin!" },
    {
      pattern: new RegExp(
        `^([1-9]\\d{0,${intDigits - 1}}|0)(\\.\\d{1,${decimalDigits}})?$`
      ),
      message: `Pozitif sayı girin (maks ${intDigits} hane tam, ${decimalDigits} hane ondalık)`,
    },
  ];

  // Button disable kontrolü: tüm alanlar dolu ve valid olmalı
  const isButtonDisabled = () => {
    const values = form.getFieldsValue();
    const errors = form.getFieldsError();

    const allFilled = Object.values(values).every(
      (val) => val !== undefined && val !== ""
    );

    const noErrors = errors.every((field) => field.errors.length === 0);

    return !(allFilled && noErrors);
  };

  return (
    <div className="add-new-cost-page">
      <Title level={2}>Yeni Maliyet Ekle</Title>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Ürünün Adı"
          name="productName"
          rules={[{ required: true, message: "Lütfen ürün adını girin!" }]}
        >
          <Input
            placeholder="Örn: Model 3"
            onKeyPress={(e) => {
              const char = String.fromCharCode(e.which);
              if (!/[a-zA-Z0-9çÇğĞıİöÖşŞüÜ :/-]/.test(char)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="Ürün Barkodu"
          name="productBarcode"
          rules={[
            { required: true, message: "Lütfen ürün barkodunu girin!" },
            {
              pattern: /^[A-Za-zÇĞİÖŞÜçğıöşü0-9]+$/,
              message: "Sadece harf ve pozitif sayılardan oluşabilir",
            },
          ]}
        >
          <Input
            placeholder="Örn: ABC12345"
            onKeyPress={(e) => {
              const char = e.key;
              // Harf veya rakam dışında bir şey girilmesin
              if (!/[a-zA-Z0-9çÇğĞıİöÖşŞüÜ]/.test(char)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="Filament Markası"
          name="filamentBrand"
          rules={[{ required: true }]}
        >
          <Select placeholder="Marka seçin">
            <Option value="Porima">Porima</Option>
            <Option value="Microzey">Microzey</Option>
            <Option value="Valment">Valment</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Filament Rengi"
          name="filamentColor"
          rules={[{ required: true, message: "Filament rengini girin!" }]}
        >
          <Input
            placeholder="Örn: Mavi"
            onKeyPress={(e) => {
              const char = String.fromCharCode(e.which);
              if (/[0-9]/.test(char)) {
                e.preventDefault(); // rakam girilmesini engelle
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="Filament Ücreti"
          name="filamentCost"
          rules={getNumberRules(4)}
        >
          <Input placeholder="Örn: 50" maxLength={4} />
        </Form.Item>
        <Form.Item
          label="Ürünün Birim Fiyatı"
          name="unitPrice"
          rules={[
            { required: true, message: "Lütfen fiyat girin!" },
            {
              pattern: /^\d{1,3}(,\d{0,2})?$/,
              message:
                "Geçersiz format! Maks 3 basamak tam sayı ve 2 basamak ondalık, virgül kullanabilirsiniz.",
            },
          ]}
        >
          <Input
            placeholder="Örn: 144,25"
            onKeyPress={(e) => {
              const char = e.key;
              const currentValue = e.currentTarget.value;

              // sadece rakam ve virgül
              if (!/[0-9,]/.test(char)) {
                e.preventDefault();
              }

              // sadece bir virgül olabilir
              if (char === "," && currentValue.includes(",")) {
                e.preventDefault();
              }

              const parts = currentValue.split(",");
              // tam sayı kısmı 3 basamak sınırı
              if (
                parts[0].length >= 3 &&
                char !== "," &&
                !currentValue.includes(",")
              ) {
                e.preventDefault();
              }
              // virgülden sonra maksimum 2 basamak
              if (parts[1] && parts[1].length >= 2 && char !== ",") {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="Çoklu Baskı Adedi"
          name="multiplePrintQty"
          rules={getNumberRules(3)}
        >
          <Input placeholder="Örn: 5" maxLength={3} />
        </Form.Item>
        <Form.Item
          label="Çoklu Baskı Birim Fiyatı"
          name="multiplePrintUnitPrice"
          rules={[
            { required: true, message: "Lütfen fiyat girin!" },
            {
              pattern: /^\d{1,3}(,\d{0,2})?$/,
              message:
                "Geçersiz format! Maks 3 basamak tam sayı ve 2 basamak ondalık, virgül kullanabilirsiniz.",
            },
          ]}
        >
          <Input
            placeholder="Örn: 110,25"
            onKeyPress={(e) => {
              const char = e.key;
              const currentValue = e.currentTarget.value;

              if (!/[0-9,]/.test(char)) e.preventDefault();
              if (char === "," && currentValue.includes(","))
                e.preventDefault();

              const parts = currentValue.split(",");
              if (
                parts[0].length >= 3 &&
                char !== "," &&
                !currentValue.includes(",")
              ) {
                e.preventDefault();
              }
              if (parts[1] && parts[1].length >= 2 && char !== ",") {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
        <Form.Item>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={isButtonDisabled()}
            >
              Kaydet
            </Button>
            <Button danger type="primary" onClick={() => navigate("/costs")}>
              Geri
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddNewCost;
