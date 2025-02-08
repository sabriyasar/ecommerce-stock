import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Button, Form, Input, Select, Row, Col, Typography, message } from 'antd';
import { UploadOutlined, BarcodeOutlined, CameraOutlined } from '@ant-design/icons';
import Quagga from 'quagga';
import '../assets/scss/addNewProduct.scss';  // SCSS dosyasını import ettik

const { Title } = Typography;
const { Option } = Select;

const AddNewProduct = () => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [barcode, setBarcode] = useState(""); 
  const [cost, setCost] = useState(""); // Maliyet
  const [vatRate, setVatRate] = useState("10"); // KDV Oranı (default %10)
  const [platform, setPlatform] = useState(""); // Satılan Platform
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // 📡 Barkod Tarama Başlatma
  const startBarcodeScanner = () => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            facingMode: "environment", // Arka kamera
          },
        },
        decoder: {
          readers: ["ean_reader"], // EAN-13 formatı
        },
      },
      (err) => {
        if (err) {
          console.error("Quagga başlatılamadı:", err);
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

  // 📡 Barkod Elle Giriş
  const handleBarcodeInput = (event) => {
    const value = event.target.value;
    if (/^\d{0,13}$/.test(value)) {
      setBarcode(value);
    }
  };

  // 📷 Fotoğraf Yükleme
  const uploadProps = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setFileList([file]); 
      return false;
    },
    fileList,
  };

  // 💾 Form Kaydetme ve LocalStorage’a Yazma
  const handleFinish = (values) => {
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];

    const newProduct = {
      key: Date.now(),
      image: previewImage || 'https://via.placeholder.com/50',
      name: values.name,
      category: values.category,
      price: values.price,
      barcode: barcode,
      description: values.description,
      cost: cost, // Maliyet
      vatRate: vatRate, // KDV Oranı
      platform: platform, // Satılan Platform
    };

    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    message.success('Ürün başarıyla eklendi!');
    navigate('/products'); 
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Yeni Ürün Ekle</Title>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* 📷 Fotoğraf Yükleme */}
        <Form.Item label="Ürün Fotoğrafı">
          <Upload.Dragger {...uploadProps} multiple={false} showUploadList={false}>
            {previewImage ? (
              <img
                src={previewImage} 
                alt="Ürün Önizleme" 
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  maxWidth: "500px",  // Maksimum genişlik
                  maxHeight: "300px", // Maksimum yükseklik
                  objectFit: "contain", // Görselin tam olarak sığmasını sağlar
                }} 
              />
            ) : (
              <>
                <UploadOutlined style={{ fontSize: 24 }} />
                <p>Dosyanızı buraya sürükleyip bırakın veya tıklayın</p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>

        {/* Ürün Bilgileri */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Ürün Adı" name="name" rules={[{ required: true, message: 'Ürün adı giriniz' }]}>
              <Input placeholder="Ürün adını girin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kategori" name="category" rules={[{ required: true, message: 'Kategori seçiniz' }]}>
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

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Fiyat" name="price" rules={[{ required: true, message: 'Fiyat giriniz' }]}>
              <Input type="number" placeholder="Fiyat girin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Barkod">
              <Input
                placeholder="12 veya 13 haneli barkod girin veya okutun"
                maxLength={13}
                value={barcode}
                onChange={handleBarcodeInput}
                prefix={<BarcodeOutlined />}
                addonAfter={<Button icon={<CameraOutlined />} onClick={startBarcodeScanner} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Maliyet" name="cost" rules={[{ required: true, message: 'Maliyet giriniz' }]}>
              <Input
                type="number"
                placeholder="Maliyet girin"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="KDV Oranı" name="vatRate" rules={[{ required: true, message: 'KDV oranı seçiniz' }]}>
              <Select value={vatRate} onChange={(value) => setVatRate(value)}>
                <Option value="1">%1</Option>
                <Option value="10">%10</Option>
                <Option value="20">%20</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Satılan Platform" name="platform" rules={[{ required: true, message: 'Satılan platformu seçiniz' }]}>
              <Select value={platform} onChange={(value) => setPlatform(value)}>
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

        <Form.Item label="Açıklama" name="description">
          <Input.TextArea rows={4} placeholder="Ürün açıklaması girin" />
        </Form.Item>

        {/* Kaydet Butonu */}
        <Form.Item>
          <Button type="primary" htmlType="submit">Kaydet</Button>
        </Form.Item>
      </Form>

      {/* Barkod Tarama İçin Video */}
      <div ref={videoRef} style={{ width: "100%", height: "200px", display: barcode ? "none" : "block" }}></div>
    </div>
  );
};

export default AddNewProduct;
