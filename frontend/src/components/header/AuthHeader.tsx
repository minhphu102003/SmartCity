import React from "react";
import { Typography, theme } from "antd"; 
const { Title, Text } = Typography;
const { useToken } = theme; 

const AuthHeader: React.FC = () => {
  const { token } = useToken(); 

  return (
    <div className="flex flex-col items-center text-center space-y-2 py-4">
      <Title 
        level={2} 
        style={{ color: token.colorPrimary }} 
        className="font-bold"
      >
        Đăng Nhập
      </Title>
      <Text className="text-gray-500 dark:text-gray-400">
        Chào mừng bạn quay lại! Hãy nhập thông tin đăng nhập của bạn.
      </Text>
    </div>
  );
};

export default AuthHeader;
