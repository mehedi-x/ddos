// এই স্ক্রিপ্ট products/ ফোল্ডার স্ক্যান করে HTML লোড করে
const productList = [
  {
    file: "gulder.html",
    name: "Gulder Beer",
    price: "৳250",
    image: "products/gulder.jpg"
  },
  // এখানে আপনি যত খুশি প্রোডাক্ট অ্যাড করতে পারবেন
];

const grid = document.getElementById("product-grid");

productList.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>Price: ${product.price}</p>
    <a href="products/${product.file}">View</a>
  `;

  grid.appendChild(card);
});
