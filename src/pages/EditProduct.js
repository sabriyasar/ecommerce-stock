import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Upload, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const EditProduct = () => {
  const { id } = useParams(); // URL'den ürün ID'sini al
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const foundProduct = storedProducts.find((p) => p.key === parseInt(id, 10));

    if (foundProduct) {
      setProductData(foundProduct);
      setPreviewImage(foundProduct.image);
      form.setFieldsValue(foundProduct);
    } else {
      message.error('Ürün bulunamadı!');
      navigate('/products');
    }
  }, [id, form, navigate]);

  const handleFinish = (values) => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    // Revize bilgilerini güncelle
    const updatedProducts = storedProducts.map((p) =>
      p.key === parseInt(id, 10)
        ? {
            ...p,
            ...values,
            image: previewImage,
            reviseCount: (p.reviseCount || 0) + 1, // Revize sayısını artır
            lastRevised: new Date().toLocaleString(), // Son güncelleme zamanını ekle
          }
        : p
    );

    localStorage.setItem('products', JSON.stringify(updatedProducts));
    message.success('Ürün başarıyla güncellendi!');
    navigate('/products');
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Sadece resim dosyası yükleyebilirsiniz!');
        return false;
      }

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

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Ürün Düzenle</Title>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item label="Ürün Fotoğrafı">
          <Upload.Dragger {...uploadProps} multiple={false} showUploadList={false}>
            {previewImage ? (
              <img src={previewImage} alt="Ürün" style={{ width: '100%', maxWidth: '500px', maxHeight: '300px', objectFit: 'contain' }} />
            ) : (
              <>
                <UploadOutlined style={{ fontSize: 24 }} />
                <p>Dosyanızı buraya sürükleyin veya tıklayın</p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label="Ürün Adı" name="name" rules={[{ required: true, message: 'Ürün adı giriniz' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Kategori" name="category" rules={[{ required: true, message: 'Kategori seçiniz' }]}>
          <Select>
            <Option value="electronics">Elektronik</Option>
            <Option value="fashion">Moda</Option>
            <Option value="home">Ev Eşyaları</Option>
            <Option value="toys">Oyuncak</Option>
            <Option value="books">Kitap</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Fiyat" name="price" rules={[{ required: true, message: 'Fiyat giriniz' }]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Barkod" name="barcode">
          <Input />
        </Form.Item>

        <Form.Item label="Maliyet" name="cost">
          <Input type="number" />
        </Form.Item>

        <Form.Item label="KDV Oranı" name="vatRate">
          <Select>
            <Option value="1">%1</Option>
            <Option value="10">%10</Option>
            <Option value="20">%20</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Satılan Platform" name="platform">
          <Select>
            <Option value="etsy">ETSY</Option>
            <Option value="amazon">Amazon TR</Option>
            <Option value="trendyol">Trendyol</Option>
            <Option value="hepsiburada">Hepsiburada</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Açıklama" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Güncelle</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;
