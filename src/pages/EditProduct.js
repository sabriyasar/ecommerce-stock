import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, message, Upload, Row, Col, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { getProductById, updateProduct } from "../services/productService";

const { Title } = Typography;
const { Option } = Select;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Görseller ve opsiyonel alanlar için state
  const [previewImages, setPreviewImages] = useState({});
  const [marketPrice, setMarketPrice] = useState("");
  const [trendyolPrice, setTrendyolPrice] = useState("");
  const [stock, setStock] = useState("");
  const [cost, setCost] = useState("");
  const [platform, setPlatform] = useState("");
  const [vatRate, setVatRate] = useState("10");
  const [batteryRequired, setBatteryRequired] = useState("Hayır");
  const [age, setAge] = useState("1+");
  const [batteryIncluded, setBatteryIncluded] = useState("Belirtilmemiş");
  const [origin, setOrigin] = useState("TR");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id); // <-- servis fonksiyonu
        const product = res.data;

        form.setFieldsValue({
          name: product.name,
          category: product.category,
          barcode: product.barcode,
          marketPrice: product.marketPrice,
          trendyolPrice: product.trendyolPrice,
          stock: product.stock,
          cost: product.cost,
          platform: product.platform,
          vatRate: product.vatRate,
          batteryRequired: product.batteryRequired,
          age: product.age,
          batteryIncluded: product.batteryIncluded,
          origin: product.origin,
          description: product.description,
        });

        setPreviewImages(product.images || {});
        setMarketPrice(product.marketPrice || "");
        setTrendyolPrice(product.trendyolPrice || "");
        setStock(product.stock || "");
        setCost(product.cost || "");
        setPlatform(product.platform || "");
        setVatRate(product.vatRate || "10");
        setBatteryRequired(product.batteryRequired || "Hayır");
        setAge(product.age || "1+");
        setBatteryIncluded(product.batteryIncluded || "Belirtilmemiş");
        setOrigin(product.origin || "TR");
      } catch (error) {
        console.error(error);
        message.error("Ürün bulunamadı!");
        navigate("/products");
      }
    };

    fetchProduct();
  }, [id, form, navigate]);

  const handleFinish = async (values) => {
    try {
      const updatedProduct = {
        ...values,
        marketPrice,
        trendyolPrice,
        stock,
        cost,
        platform,
        vatRate,
        batteryRequired,
        age,
        batteryIncluded,
        origin,
        images: previewImages,
      };

      await updateProduct(id, updatedProduct); // <-- servis fonksiyonu
      message.success("Ürün başarıyla güncellendi!");
      navigate("/products");
    } catch (error) {
      console.error(error);
      message.error("Güncelleme sırasında hata oluştu!");
    }
  };
  const uploadProps = (index) => ({
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Sadece resim dosyası yükleyebilirsiniz!");
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages((prev) => ({ ...prev, [index]: e.target.result }));
      };
      reader.readAsDataURL(file);
      return false;
    },
  });

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Ürün Düzenle</Title>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* Görseller */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Paket Görseli (ön)">
              <Upload {...uploadProps("front")} showUploadList={false}>
                {previewImages.front ? (
                  <img
                    src={previewImages.front}
                    alt="ön paket"
                    style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
                  />
                ) : (
                  <Button icon={<UploadOutlined />}>Yükle</Button>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Paket Görseli (arka)">
              <Upload {...uploadProps("back")} showUploadList={false}>
                {previewImages.back ? (
                  <img
                    src={previewImages.back}
                    alt="arka paket"
                    style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
                  />
                ) : (
                  <Button icon={<UploadOutlined />}>Yükle</Button>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Temel ve opsiyonel alanlar */}
        <Form.Item label="Ürün Adı" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Kategori" name="category">
          <Select>
            <Option value="electronics">Elektronik</Option>
            <Option value="fashion">Moda</Option>
            <Option value="home">Ev Eşyaları</Option>
            <Option value="toys">Oyuncak</Option>
            <Option value="books">Kitap</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Barkod" name="barcode">
          <Input />
        </Form.Item>

        <Form.Item label="Piyasa Satış Fiyatı">
          <Input type="number" value={marketPrice} onChange={(e) => setMarketPrice(e.target.value)} />
        </Form.Item>

        <Form.Item label="Trendyol Fiyatı">
          <Input type="number" value={trendyolPrice} onChange={(e) => setTrendyolPrice(e.target.value)} />
        </Form.Item>

        <Form.Item label="Stok">
          <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        </Form.Item>

        <Form.Item label="Maliyet">
          <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        </Form.Item>

        <Form.Item label="KDV Oranı">
          <Select value={vatRate} onChange={setVatRate}>
            <Option value="1">%1</Option>
            <Option value="10">%10</Option>
            <Option value="20">%20</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Satılan Platform">
          <Select value={platform} onChange={setPlatform}>
            <Option value="etsy">ETSY</Option>
            <Option value="amazon">Amazon TR</Option>
            <Option value="trendyol">Trendyol</Option>
            <Option value="hepsiburada">Hepsiburada</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Pil ile mi çalışır?">
          <Select value={batteryRequired} onChange={setBatteryRequired}>
            <Option value="Evet">Evet</Option>
            <Option value="Hayır">Hayır</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Yaş">
          <Select value={age} onChange={setAge}>
            {[...Array(13)].map((_, i) => (
              <Option key={i} value={`${i + 1}+`}>{`${i + 1}+`}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Piller Kutuya Dahil Mi?">
          <Select value={batteryIncluded} onChange={setBatteryIncluded}>
            <Option value="Evet">Evet</Option>
            <Option value="Hayır">Hayır</Option>
            <Option value="Belirtilmemiş">Belirtilmemiş</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Menşei">
          <Select value={origin} onChange={setOrigin}>
            <Option value="TR">TR - Türkiye</Option>
            <Option value="KP">KP - Kuzey Kore</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Açıklama" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Güncelle
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;
