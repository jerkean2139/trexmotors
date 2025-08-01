exports.handler = async (event, context) => {
  const vehicles = [
    {
      id: "1",
      make: "Toyota",
      model: "Camry",
      year: 2020,
      price: 24999,
      mileage: 35000,
      imageUrl: "https://via.placeholder.com/600x400/0066cc/ffffff?text=Toyota+Camry",
      status: "for-sale",
      exteriorColor: "Silver",
      interiorColor: "Black",
      description: "Clean carfax, one owner, excellent condition"
    },
    {
      id: "2", 
      make: "Honda",
      model: "Civic",
      year: 2019,
      price: 19999,
      mileage: 42000,
      imageUrl: "https://via.placeholder.com/600x400/cc0000/ffffff?text=Honda+Civic",
      status: "for-sale",
      exteriorColor: "Red",
      interiorColor: "Gray",
      description: "Fuel efficient, reliable transportation"
    },
    {
      id: "3",
      make: "Ford",
      model: "F-150",
      year: 2021,
      price: 34999,
      mileage: 28000,
      imageUrl: "https://via.placeholder.com/600x400/006600/ffffff?text=Ford+F-150",
      status: "for-sale",
      exteriorColor: "Blue",
      interiorColor: "Black",
      description: "Powerful truck, perfect for work and play"
    }
  ];

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    },
    body: JSON.stringify(vehicles)
  };
};