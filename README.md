# 📦 Smart Grocery Scanner Web App

A smart and simple web application that helps users manage their grocery list using **barcode scanning**. Built using **HTML, CSS (Tailwind), JavaScript (QuaggaJS)** and **Firebase Firestore** for real-time data management.

## 🔍 Features

- 📷 Barcode scanning using camera (laptop or phone)
- ✅ Real-time list creation and item tracking
- 🔄 Quantity updates (+ / -) and “Mark as Bought” checkbox
- 🔥 Firebase Firestore integration
- 📁 LocalStorage fallback for offline use
- 🗃️ Category-based display of items
- ✏️ Edit or delete scanned items
- 🖨️ Download shopping list as PDF

## 🚀 Tech Stack

| Frontend       | Backend / DB     | Libraries          |
|----------------|------------------|--------------------|
| HTML, CSS      | Firebase Firestore | QuaggaJS (barcode) |
| Tailwind CSS   | Firebase Auth    | jsPDF (PDF export) |
| JavaScript     |                  |                    |

## 📷 How It Works

1. Use your phone/laptop camera to scan barcodes.
2. The app adds the item to your grocery list.
3. You can edit, categorize, update quantity or mark as bought.
4. Data is synced with Firebase (or stored locally).
5. Export the final list as a downloadable PDF.

## 🛠 Setup Instructions

1. Clone the repo  
   `git clone https://github.com/your-username/smart-grocery-scanner.git`

2. Open with Live Server or host locally  
   Recommended: VS Code Live Server Extension

3. Connect Firebase:
   - Create a Firebase project
   - Enable Firestore and Authentication
   - Replace config in `firebase.js`

4. Done! Use your camera to start scanning.

## 🧠 Future Enhancements

- ✅ API integration to fetch item names from barcode
- 🛒 Checkout/cart system for in-store self-checkout
- 📊 Analytics dashboard for admin
- 🔐 Role-based access (Admin/User)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

> 👨‍💻 Built by a passionate student to streamline grocery shopping with the power of barcode scanning and Firebase!
