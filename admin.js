
function checkPassword() {
  const pass = document.getElementById("admin-pass").value;
  const adminArea = document.getElementById("admin-area");
  const wrongPass = document.getElementById("wrong-pass");
  if (pass === "admin0213") {
    document.getElementById("password-check").style.display = "none";
    adminArea.style.display = "block";
  } else {
    wrongPass.innerText = "❌ Wrong password!";
  }
}

function generateHTML() {
  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const category = document.getElementById("pcategory").value;
  const status = document.getElementById("pstatus").value;
  const desc = document.getElementById("pdesc").value;
  const images = document.getElementById("pimages").value.split(",").map(img => img.trim());

  let imgTags = images.map(src => `<img src="${src}" alt="${name}" style="width:100%; border-radius:8px;">`).join("<br/>");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${name}</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <header>
    <div class="navbar">
      <h1>${name}</h1>
      <a href="../index.html">← Back</a>
    </div>
  </header>
  <main style="max-width:600px; margin:auto; padding:20px;">
    ${imgTags}
    <h2>${name}</h2>
    <p><strong>Price:</strong> ৳${price}</p>
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Description:</strong><br/>${desc}</p>
    <a class="whatsapp-btn" href="https://wa.me/8801627647776?text=I want to order ${name} (৳${price})" target="_blank">📲 Order on WhatsApp</a>
  </main>
  <footer><p>&copy; 2025 SmartCart</p></footer>
</body>
</html>`;

  document.getElementById("output").value = html;
}

function downloadHTML() {
  const name = document.getElementById("pname").value.toLowerCase().replace(/\s+/g, "-");
  const blob = new Blob([document.getElementById("output").value], {type: "text/html"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name + ".html";
  link.click();
}
