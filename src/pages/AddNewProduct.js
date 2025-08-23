import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Row,
  Col,
  Typography,
  message,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  BarcodeOutlined,
  CameraOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Quagga from "quagga";
import "../assets/scss/addNewProduct.scss"; // <-- SCSS importu

const { Title } = Typography;
const { Option } = Select;

const AddNewProduct = () => {
  const [fileList, setFileList] = useState([]);
  const [previewImages, setPreviewImages] = useState({});
  const [barcode, setBarcode] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Opsiyonel alanlar için state
  const [platform, setPlatform] = useState("");
  const [cost, setCost] = useState("");
  const [vatRate, setVatRate] = useState("10");
  const [trendyolPrice, setTrendyolPrice] = useState("");
  const [marketPrice, setMarketPrice] = useState(""); // Piyasa Satış Fiyatı
  const [priceTooHigh, setPriceTooHigh] = useState(false);
  const [trendyolPriceTooHigh, setTrendyolPriceTooHigh] = useState(false);
  const [stock, setStock] = useState("");
  const [batteryRequired, setBatteryRequired] = useState("Hayır");
  const [age, setAge] = useState("1+");
  const [batteryIncluded, setBatteryIncluded] = useState("Belirtilmemiş");
  const [origin, setOrigin] = useState("TR");

  // 📡 Barkod Tarama
  const startBarcodeScanner = () => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: videoRef.current,
          constraints: { facingMode: "environment" },
        },
        decoder: { readers: ["ean_reader"] },
      },
      (err) => {
        if (err) {
          console.error(err);
          message.error("Barkod tarayıcı başlatılamadı!");
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data) => {
      setBarcode(data.codeResult.code);
      message.success(`Barkod okundu: ${data.codeResult.code}`);
      Quagga.stop();
    });
  };

  // 📷 Görsel Yükleme
  const uploadProps = (index) => ({
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages((prev) => ({ ...prev, [index]: e.target.result }));
      };
      reader.readAsDataURL(file);
      setFileList([file]);
      return false;
    },
    fileList,
  });

  // Fiyat alanı için handler
  const handlePriceChange = (setter) => (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");

    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts.slice(0, -1).join("") + "," + parts.slice(-1);
    }

    let [integer, decimal] = value.split(",");

    // Virgülden önce en fazla 6 hane
    let tooHigh = false;
    if (integer.length > 6) {
      integer = integer.slice(0, 6);
      tooHigh = true;
    }

    // Binlik ayracı ekle
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Virgülden sonra en fazla 2 hane
    if (decimal !== undefined) {
      decimal = decimal.slice(0, 2);
      value = `${integer},${decimal}`;
    } else {
      value = integer;
    }

    setter(value);
    return tooHigh;
  };

  /* const handleBarcodeInput = (e) => {
    const value = e.target.value;
    if (/^\d{0,13}$/.test(value)) setBarcode(value);
  }; */

  const handleBarcodeInput = (e) => {
    const value = e.target.value.toUpperCase(); // Büyük harfe çevir
    // Sadece İngilizce harf ve rakam izin ver, Türkçe karakter engelle
    if (/^[A-Z0-9]*$/.test(value)) setBarcode(value);
  };

  // 💾 Form Kaydetme
  const handleFinish = (values) => {
    const existingProducts = JSON.parse(localStorage.getItem("products")) || [];

    const newProduct = {
      key: Date.now(),
      barcode: barcode,
      modelCode: values.modelCode,
      brand: values.brand,
      category: values.category,
      currency: "TRY",
      name: values.name,
      description: values.description,
      marketPrice: values.marketPrice,
      trendyolPrice: trendyolPrice,
      stock: stock,
      stockCode: values.stockCode,
      vatRate: vatRate,
      desi: values.desi,
      shippingTime: values.shippingTime,
      shippingType: values.shippingType,
      batteryRequired: batteryRequired,
      packageContent: values.packageContent,
      color: values.color,
      ceCertificate: values.ceCertificate,
      manufacturer: values.manufacturer,
      feature: values.feature,
      age: age,
      packageImageFront: previewImages.front,
      batteryIncluded: batteryIncluded,
      importer: values.importer,
      instructions: values.instructions,
      batterySize: values.batterySize,
      otherFeatures: values.otherFeatures,
      ageGroup: values.ageGroup,
      warnings: values.warnings,
      origin: origin,
      packageImageBack: previewImages.back,
      batteryType: values.batteryType,
      images: Object.values(previewImages),
      platform: platform,
      cost: cost,
    };

    localStorage.setItem(
      "products",
      JSON.stringify([...existingProducts, newProduct])
    );
    message.success("Ürün başarıyla eklendi!");
    navigate("/products");
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Yeni Ürün Ekle</Title>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* Barkod ve Model Kodu */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Barkod" required>
              <Input
                placeholder="12 veya 13 haneli barkod girin veya okutun"
                maxLength={13}
                value={barcode}
                onChange={handleBarcodeInput}
                prefix={<BarcodeOutlined />}
                addonAfter={
                  <Button
                    icon={<CameraOutlined />}
                    onClick={startBarcodeScanner}
                  />
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Model Kodu"
              name="modelCode"
              rules={[{ required: true }]}
            >
              <Input placeholder="Model kodu girin" />
            </Form.Item>
          </Col>
        </Row>

        {/* Marka ve Kategori */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Marka" name="brand" rules={[{ required: true }]}>
              <Input placeholder="Marka girin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Kategori"
              name="category"
              rules={[{ required: true }]}
            >
              <Select placeholder="Kategori seçin">
                <Option value="electronics">Elektronik</Option>
                <Option value="fashion">Moda</Option>
                <Option value="home">Ev Eşyaları</Option>
                <Option value="toys">Oyuncak</Option>
                <Option value="books">Kitap</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Ürün Adı ve Para Birimi */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Ürün Adı"
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Ürün adı girin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Para Birimi">
              <Input value="TRY" disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* Ürün Açıklaması ve Piyasa Satış Fiyatı */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Ürün Açıklaması"
              name="description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder="Ürün açıklaması girin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Piyasa Satış Fiyatı (KDV Dahil)"
              required
              validateStatus={priceTooHigh ? "error" : ""}
              help={
                priceTooHigh
                  ? "Platform kuralları gereği 1.000.000 TL ve üzerindeki fiyatlarla ürün girişi yapılamamaktadır."
                  : null
              }
            >
              <Input
                value={marketPrice}
                onChange={(e) => {
                  const tooHigh = handlePriceChange(setMarketPrice)(e);
                  setPriceTooHigh(tooHigh);
                }}
                placeholder="Örn: 1.444,90"
                addonAfter="₺"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Trendyol Fiyatı ve Ürün Stok Adedi */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Trendyol'da Satılacak Fiyat (KDV Dahil)"
              required
              validateStatus={trendyolPriceTooHigh ? "error" : ""}
              help={
                trendyolPriceTooHigh
                  ? "Platform kuralları gereği 1.000.000 TL ve üzerindeki fiyatlarla ürün girişi yapılamamaktadır."
                  : null
              }
            >
              <Input
                value={trendyolPrice}
                onChange={(e) => {
                  const tooHigh = handlePriceChange(setTrendyolPrice)(e);
                  setTrendyolPriceTooHigh(tooHigh);
                }}
                placeholder="Örn: 1.444,90"
                addonAfter="₺"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ürün Stok Adedi" required>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Stok Kodu ve KDV Oranı */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Stok Kodu" name="stockCode">
              <Input placeholder="Stok kodunu girin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="KDV Oranı" required>
              <Select value={vatRate} onChange={setVatRate}>
                <Option value="1">%1</Option>
                <Option value="10">%10</Option>
                <Option value="20">%20</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Desi ve Pil ile mi çalışır? */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Desi" name="desi">
              <Input placeholder="Desi girin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Pil ile mi çalışır?" required>
              <Select value={batteryRequired} onChange={setBatteryRequired}>
                <Option value="Evet">Evet</Option>
                <Option value="Hayır">Hayır</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Görseller */}
        <Row gutter={16}>
          {[...Array(8)].map((_, i) => (
            <Col span={6} key={i}>
              <Form.Item label={`Görsel ${i + 1}`}>
                <Upload {...uploadProps(i)} showUploadList={false}>
                  {previewImages[i] ? (
                    <img
                      src={previewImages[i]}
                      alt={`Görsel ${i + 1}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  ) : (
                    <Button icon={<UploadOutlined />}>Yükle</Button>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          ))}
        </Row>

        {/* Uzun alanlar tek satır */}
        <Form.Item label="Paket İçeriği" name="packageContent">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Renk" name="color">
          <Input />
        </Form.Item>
        <Form.Item label="CE Uygunluk Sembolü" name="ceCertificate">
          <Input />
        </Form.Item>
        <Form.Item label="Üretici Bilgisi" name="manufacturer">
          <Input />
        </Form.Item>
        <Form.Item label="Özellik" name="feature">
          <Input />
        </Form.Item>

        {/* Yaş ve Paket Görseli Ön */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Yaş" required>
              <Select value={age} onChange={setAge}>
                {[...Array(13)].map((_, i) => (
                  <Option key={i} value={`${i + 1}+`}>{`${i + 1}+`}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Paket Görseli (ön)">
              <Upload {...uploadProps("front")} showUploadList={false}>
                {previewImages.front ? (
                  <img
                    src={previewImages.front}
                    alt="ön paket"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Button icon={<UploadOutlined />}>Yükle</Button>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Piller Kutuya Dahil Mi? ve İthalatçı */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Piller Kutuya Dahil Mi?" required>
              <Select value={batteryIncluded} onChange={setBatteryIncluded}>
                <Option value="Evet">Evet</Option>
                <Option value="Hayır">Hayır</Option>
                <Option value="Belirtilmemiş">Belirtilmemiş</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="İthalatçı / Yetkili Temsilci / İfa Hizmet Sağlayıcı"
              name="importer"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Kalan alanlar tek satır */}
        <Form.Item label="Kullanım Talimatı / Uyarıları" name="instructions">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Batarya Boyutu" name="batterySize">
          <Input />
        </Form.Item>
        <Form.Item label="Diğer Özellikler" name="otherFeatures">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Yaş Grubu" name="ageGroup">
          <Input />
        </Form.Item>
        <Form.Item label="Ürün Uyarıları (Oyuncak)" name="warnings">
          <Input.TextArea rows={2} />
        </Form.Item>

        {/* Menşei ve Paket Görseli Arka */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Menşei" required>
              <Select value={origin} onChange={setOrigin}>
                <Option value="TR">TR - Türkiye</Option>
                <Option value="KP">KP - Kuzey Kore</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Paket Görseli (arka)">
              <Upload {...uploadProps("back")} showUploadList={false}>
                {previewImages.back ? (
                  <img
                    src={previewImages.back}
                    alt="arka paket"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Button icon={<UploadOutlined />}>Yükle</Button>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Batarya Türü ve Satılan Platform */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Batarya Türü" name="batteryType">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Satılan Platform" name="platform">
              <Select value={platform} onChange={setPlatform}>
                <Option value="etsy">ETSY</Option>
                <Option value="amazon">Amazon TR</Option>
                <Option value="trendyol">Trendyol</Option>
                <Option value="hepsiburada">Hepsiburada</Option>
                <Option value="pazarama">Pazarama</Option>
                <Option value="ptt_avm">PTT Avm</Option>
                <Option value="idefix">İdefix</Option>
                <Option value="dolap">Dolap</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Kaydet */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Kaydet
          </Button>
        </Form.Item>
      </Form>

      {/* Barkod tarama video */}
      <div
        ref={videoRef}
        style={{
          width: "100%",
          height: "200px",
          display: barcode ? "none" : "block",
        }}
      ></div>
    </div>
  );
};

export default AddNewProduct;
