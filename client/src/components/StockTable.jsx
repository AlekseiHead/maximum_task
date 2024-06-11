import React from 'react';
import { Table } from 'antd';

function StockTable({ stockData }) {
  const columns = [
    {
      title: 'Марка/Модель',
      dataIndex: 'mark',
      key: 'mark',
      render: (text, record) => `${record.mark} / ${record.model}`,
		},
		{
			title: 'Модификация',
			dataIndex: 'engine',
			key: 'engine',
			render: (engine, record) => `${engine.volume} ${engine.transmission} (${engine.power} л.с.) ${record.drive}`,
		},
    {
      title: 'Комплектация',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    },
    {
      title: 'Стоимость',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `${text.toLocaleString()} ₽`,
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
  ];

  return <Table columns={columns} dataSource={stockData} rowKey={record => record._id} />;
}

export default StockTable;