import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Layout,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom"; // React Router'dan navigate hook'u ekledik

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Yönlendirme için useNavigate hook'u

  // Giriş formunu gönderme işlemi
  const onFinish = async (values) => {
    setLoading(true);
    const { username, password, remember } = values;

    // JSON dosyasını public klasöründen alalım
    try {
      const response = await fetch("/users.json");
      const usersData = await response.json();

      // Kullanıcı adı ve şifreyi JSON'dan kontrol et
      const user = usersData.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        message.success("Giriş başarılı!");

        // Eğer "Beni hatırla" seçeneği seçildiyse, kullanıcı bilgilerini localStorage'a kaydediyoruz
        if (remember) {
          localStorage.setItem("username", username);
        }

        navigate("/dashboard"); // Başarılı giriş sonrası dashboard sayfasına yönlendir
      } else {
        message.error("Geçersiz kullanıcı adı veya şifre!");
      }
    } catch (error) {
      console.error("Veri okunurken bir hata oluştu:", error);
      message.error("Bir hata oluştu, lütfen tekrar deneyin!");
    }

    setLoading(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
        }}
      >
        <div
          style={{
            width: "400px",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title
            level={3}
            style={{ textAlign: "center", marginBottom: "30px" }}
          >
            3D Atelier Stok Yönetim
          </Title>
          <Form
            name="login"
            initialValues={{ remember: false }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Kullanıcı Adı"
              name="username"
              rules={[
                { required: true, message: "Lütfen kullanıcı adınızı girin!" },
              ]}
            >
              <Input
                placeholder="Kullanıcı adınızı girin"
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  borderColor: "#d9d9d9",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Şifre"
              name="password"
              rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
            >
              <Input.Password
                placeholder="Şifrenizi girin"
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  borderColor: "#d9d9d9",
                }}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox style={{ fontSize: "14px" }}>Beni hatırla</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  borderRadius: "4px",
                  fontSize: "16px",
                  padding: "12px",
                }}
              >
                Giriş Yap
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
