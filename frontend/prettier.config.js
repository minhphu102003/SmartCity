module.exports = {
    plugins: ['prettier-plugin-tailwindcss'],
    zIndex: {
        '50': '50',
        '40': '40',
        '30': '30',
      },
    tailwindConfig: 'tailwind.config.js',
    semi: true,               // Thêm dấu chấm phẩy ở cuối mỗi câu lệnh
    singleQuote: true,        // Sử dụng dấu nháy đơn thay vì dấu nháy kép
    printWidth: 80,           // Giới hạn độ dài dòng là 80 ký tự
    tabWidth: 2,              // Sử dụng 2 dấu cách cho mỗi mức thụt đầu dòng
    useTabs: false,           // Sử dụng dấu cách thay vì tab
    trailingComma: 'es5',     // Thêm dấu phẩy ở cuối danh sách (trong object, array, v.v.)
    bracketSpacing: true,     // Thêm dấu cách bên trong dấu ngoặc nhọn
    jsxBracketSameLine: false,// Đưa dấu ngoặc nhọn cuối cùng của JSX lên dòng mới
    arrowParens: 'always',    // Luôn thêm dấu ngoặc đơn quanh đối số của hàm mũi tên
}