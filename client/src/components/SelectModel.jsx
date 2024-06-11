import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

function SelectModel({ selectedBrand }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    if (selectedBrand) {
      fetch(`http://localhost:4000/models/${selectedBrand}`)
        .then(response => response.json())
        .then(data => setModels(data))
        .catch(error => console.error('Ошибка:', error));
    }
  }, [selectedBrand]);

  return (
		<Select
			mode="multiple"
      showSearch
      style={{ width: 200 }}
      placeholder="Выберите модель"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {models.map(model => (
        <Option key={model.model} value={model.model}>{model.model}</Option>
      ))}
    </Select>
  );
}

export default SelectModel;