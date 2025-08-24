import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getCostById, updateCost } from "../services/costServices";
import "../assets/scss/addNewCost.scss";

const { Title } = Typography;
const { Option } = Select;

const EditCost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCost = async () => {
      try {
        const res = await getCostById(id);
        form.setFieldsValue(res.data); // verileri forma yükle
      } catch (error) {
        console.error(error);
        message.error("Maliyet bilgisi alınamadı!");
      }
    };
    fetchCost();
  }, [id, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await updateCost(id, values);
      message.success("Maliyet başarıyla güncellendi!");
      navigate("/costs");
    } catch (error) {
      console.error(error);
      message.error("Maliyet güncelleme sırasında hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-new-cost-page">
      <Title level={2}>Maliyeti Düzenle</Title>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Ürünün Adı"
          name="productName"
          rules={[{ required: true, message: "Lütfen ürün adını girin!" }]}
        >
          <Input />
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Filament Markası"
          name="filamentBrand"
          rules={[{ required: true }]}
        >
          <Select>
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
          <Input />
        </Form.Item>

        <Form.Item label="Filament Ücreti" name="filamentCost">
          <Input />
        </Form.Item>

        <Form.Item label="Ürünün Birim Fiyatı" name="unitPrice">
          <Input />
        </Form.Item>

        <Form.Item label="Çoklu Baskı Adedi" name="multiplePrintQty">
          <Input />
        </Form.Item>

        <Form.Item
          label="Çoklu Baskı Birim Fiyatı"
          name="multiplePrintUnitPrice"
        >
          <Input />
        </Form.Item>

        <Form.Item>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
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

export default EditCost;
