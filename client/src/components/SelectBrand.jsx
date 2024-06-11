import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

function SelectBrand({ onBrandSelect }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/brands')
      .then(response => response.json())
      .then(data => setBrands(data))
      .catch(error => console.error('Ошибка:', error));
  }, []);

  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Выберите марку"
      optionFilterProp="children"
      onChange={onBrandSelect}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {brands.map(brand => (
        <Option key={brand.mark} value={brand.mark}>{brand.mark} {brand.count}</Option>
      ))}
    </Select>
  );
}

export default SelectBrand;