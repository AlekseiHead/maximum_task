import React, { useState, useEffect } from "react";
import SelectBrand from "./components/SelectBrand";
import SelectModel from "./components/SelectModel";
import StockTable from "./components/StockTable";
import { Pagination } from "antd";

//Получение списка марок авто
function fetchBrands() {
  return fetch("http://localhost:4000/brands")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((brandsData) => {
      return brandsData.map(
        (brandItem) => `${brandItem.brandName} (${brandItem.count})`
      );
    })
    .catch((error) => {
      console.error("Ошибка при получении марок:", error);
    });
}

//Получение списка моделей по выбранной марке
function fetchModels(brand) {
  return fetch(`http://localhost:4000/models/${brand}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Ошибка при получении моделей:", error);
    });
}

//Получение данных стоков
function fetchStock({ brand, model, page }) {
  const queryParams = new URLSearchParams({ brand, model, page }).toString();
  return fetch(`http://localhost:4000/stock?${queryParams}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Ошибка при получении стоков:', error);
    });
}
function App() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBrands().then(setBrands);
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand).then(setModels);
    }
  }, [selectedBrand]);

  useEffect(() => {
    const params = {
      brand: selectedBrand,
      model: selectedModel,
      page: currentPage,
    };
    fetchStock(params).then((data) => setStockData(data));
  }, [selectedBrand, selectedModel, currentPage]);

  return (
    <div>
      <SelectBrand
        onBrandSelect={(value) => {
          setSelectedBrand(value);
          setSelectedModel("");
        }}
      />
      <SelectModel
        selectedBrand={selectedBrand}
        onModelSelect={setSelectedModel}
      />
      <StockTable stockData={stockData} />
      <Pagination defaultCurrent={1} total={500} />
    </div>
  );
}

export default App;
