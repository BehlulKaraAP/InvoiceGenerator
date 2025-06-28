import "./style.css";
import html2pdf from "html2pdf.js";

document.addEventListener("DOMContentLoaded", () => {
  const addItemBtn = document.getElementById("addItemBtn");
  addItemBtn.addEventListener("click", addItem);

  const tbody = document.querySelector("#itemsTable tbody");

  function addItem() {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" placeholder="Service..." /></td>
        <td><input type="number" class="qty" value="1" min="1" /></td>
        <td><input type="number" class="rate" value="0" min="0" step="0.01" /></td>
        <td class="lineTotal">0.00</td>
        <td><button class="deleteBtn">🗑️</button></td>
      `;
    tbody.appendChild(row);

    row.querySelector(".qty").addEventListener("input", updateTotals);
    row.querySelector(".rate").addEventListener("input", updateTotals);
    row.querySelector(".deleteBtn").addEventListener("click", () => {
      row.remove();
      updateTotals();
    });

    updateTotals();
  }

  function updateTotals() {
    let subtotal = 0;
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row) => {
      const qty = parseFloat(row.children[1].querySelector("input").value) || 0;
      const rate =
        parseFloat(row.children[2].querySelector("input").value) || 0;
      const total = qty * rate;
      row.children[3].textContent = total.toFixed(2);
      subtotal += total;
    });

    const taxRate = parseFloat(document.getElementById("taxRate").value) || 0;
    const taxAmount = (taxRate / 100) * subtotal;
    const grandTotal = subtotal + taxAmount;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("taxAmount").textContent = taxAmount.toFixed(2);
    document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
  }

  // Set default dates
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("invoiceDate").value = today;
  const due = new Date();
  due.setDate(due.getDate() + 7);
  document.getElementById("dueDate").value = due.toISOString().split("T")[0];

  addItem();
});
// Init with one row

document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  const element = document.getElementById("invoice"); // or a specific section like document.getElementById("invoice")

  const opt = {
    margin: 0.5,
    filename: "invoice.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
});
