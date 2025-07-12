import { productCatalog, db } from './firebase-config.js';
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Add logout button to UI
const logoutBtn = document.createElement("button");
logoutBtn.textContent = "Logout";
logoutBtn.style.position = "fixed";
logoutBtn.style.top = "1rem";
logoutBtn.style.right = "1rem";
logoutBtn.style.padding = "0.5rem 1rem";
logoutBtn.style.background = "#7ed957";
logoutBtn.style.color = "black";
logoutBtn.style.border = "none";
logoutBtn.style.borderRadius = "5px";
logoutBtn.style.cursor = "pointer";
document.body.appendChild(logoutBtn);

// Logout function
const auth = getAuth();
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully.");
    window.location.href = "login.html"; // redirect to login
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed. Try again.");
  }
});

let lastScanned = null;
let lastScannedAt = 0;
const scannedItems = {};

Quagga.init({
  inputStream: {
    name: "Live",
    type: "LiveStream",
    target: document.querySelector('#scanner'),
    constraints: {
      facingMode: "environment"
    }
  },
  decoder: {
    readers: ["ean_reader", "upc_reader", "code_128_reader"]
  }
}, function(err) {
  if (err) {
    console.error("❌ Quagga init error:", err);
    return;
  }
  console.log("✅ Quagga initialized");
  Quagga.start();
});

Quagga.onDetected(function(result) {
  const code = result.codeResult.code;
  const now = Date.now();

  if (code === lastScanned && (now - lastScannedAt < 5000)) return;

  lastScanned = code;
  lastScannedAt = now;

  console.log("✅ Barcode detected:", code);
  window.saveToFirestore(code);
});

const listContainer = document.getElementById("scanned-items");

window.addToUI = function(code, name, category) {
  if (!scannedItems[code]) {
    scannedItems[code] = { quantity: 1, name, category };

    let categorySection = document.getElementById(`category-${category}`);
    if (!categorySection) {
      categorySection = document.createElement("div");
      categorySection.id = `category-${category}`;
      categorySection.innerHTML = `<h3 class="text-lg font-bold mt-4">${category}</h3>`;
      listContainer.appendChild(categorySection);
    }

    const itemDiv = document.createElement("div");
    itemDiv.id = `item-${code}`;
    itemDiv.className = "flex items-center justify-between bg-white p-4 border rounded shadow mt-1";

    itemDiv.innerHTML = `
      <div><strong style="color:black">${name}</strong> <span class="text-sm text-gray-500">(x<span id="qty-${code}">1</span>)</span></div>
      <div class="flex gap-2">
        <button onclick="changeQty('${code}', 1)" class="bg-green-500 px-2 rounded text-white">+</button>
        <button onclick="changeQty('${code}', -1)" class="bg-red-500 px-2 rounded text-white">−</button>
        <button onclick="removeItem('${code}')" class="bg-black-400 px-2 rounded text-white">🗑️</button>
      </div>
    `;
    categorySection.appendChild(itemDiv);
  } else {
    scannedItems[code].quantity += 1;
    document.getElementById(`qty-${code}`).textContent = scannedItems[code].quantity;
  }
};

window.changeQty = function(code, delta) {
  scannedItems[code].quantity += delta;
  if (scannedItems[code].quantity < 1) {
    removeItem(code);
  } else {
    document.getElementById(`qty-${code}`).textContent = scannedItems[code].quantity;
  }
};

window.removeItem = function(code) {
  delete scannedItems[code];
  const el = document.getElementById(`item-${code}`);
  if (el) el.remove();
};

window.saveToFirestore = async function(code) {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save items.");
    return;
  }

  const product = productCatalog[code] || { name: "Unknown", category: "Uncategorized" };

  try {
    await addDoc(collection(db, "grocery-items"), {
      uid: user.uid,
      barcode: code,
      name: product.name,
      category: product.category,
      quantity: 1,
      addedAt: Timestamp.now()
    });

    window.addToUI(code, product.name, product.category);
    console.log("Item saved to Firestore");
  } catch (error) {
    console.error(" Error saving to Firestore:", error);
  }
};
