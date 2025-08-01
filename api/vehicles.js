const vehicles = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: 24999,
    mileage: 35000,
    imageUrl: "/api/placeholder/600/400",
    status: "for-sale"
  },
  {
    id: "2", 
    make: "Honda",
    model: "Civic",
    year: 2019,
    price: 19999,
    mileage: 42000,
    imageUrl: "/api/placeholder/600/400",
    status: "for-sale"
  }
];

module.exports = (req, res) => {
  res.json(vehicles);
};