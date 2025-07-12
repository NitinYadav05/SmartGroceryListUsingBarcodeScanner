import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

//  Firebase Configuration


//  Initialize Firebase App
const app = initializeApp(firebaseConfig);

//  Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);


export const productCatalog = {
  "0123456789128": { name: "Milk", category: "Dairy" },
  "1234567891231": { name: "Paneer", category: "Dairy" },
  "1234567891255": { name: "Lay's Potato Chips", category: "Snacks" },
  "1234567891262": { name: "Oreo Cookies", category: "Snacks" },
  "1234567891279": { name: "Coca-Cola", category: "Drinks" },
  "1234567891286": { name: "Red Bull", category: "Drinks" },
  "1234567891293": { name: "Gulab Jamun", category: "Sweets" },
  "1234567891317": { name: "Rasgulla", category: "Sweets" },
  "1234567891324": { name: "Kit-Kat", category: "Chocolates" },
  "1234567891331": { name: "Snickers Bar", category: "Chocolates" },
  "1234567891348": { name: "Mr . clean magic Eraser", category: "Household Essentials" },
  "1234567891354": { name: "Windex Glass Cleaner", category: "Household Essentials" },
  "1234567891361": { name: "Baby Carrots", category: "Packed Veggies" },
  "1234567891378": { name: "Green Beans", category: "Packed Veggies" },
};

//  Firestore Save Function (includes UID!)
window.saveToFirestore = async function (code) {
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to save items.");
    return;
  }

  try {
    const product = productCatalog[code] || {
      name: "Unknown",
      category: "Uncategorized"
    };

    await addDoc(collection(db, "grocery-items"), {
      uid: user.uid,
      barcode: code,
      name: product.name,
      category: product.category,
      quantity: 1,
      addedAt: Timestamp.now()
    });

    console.log("✅ Saved to Firestore:", product.name);

    if (typeof window.addToUI === "function") {
      window.addToUI(code, product.name, product.category);
    }
  } catch (e) {
    console.error("❌ Firestore error:", e);
  }
};
