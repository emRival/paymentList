function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
  Swal.fire({
    icon: "success",
    title: "Copied!",
    text: "Text copied successfully!",
    timer: 1500,
    showConfirmButton: false,
  });
}

function createFallingMoney() {
  const container = document.getElementById("falling-money-container");
  for (let i = 0; i < 30; i++) {
    const money = document.createElement("div");
    money.classList.add("money");
    money.innerHTML = "&#128176;";
    money.style.left = Math.random() * 100 + "vw";
    money.style.animationDuration = Math.random() * 2 + 3 + "s";
    container.appendChild(money);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createFallingMoney();

  const dataDisplay = document.getElementById("dataDisplay");
  const loader = document.getElementById("loader");
  const loaderContainer = document.getElementById("loaderContainer");
  const tokenFormContainer = document.getElementById("tokenFormContainer");
  const downloadPDFButton = document.getElementById("downloadPDF");
  let pdfName = "data-hutang";

  function showLoader() {
    loader.style.display = "block";
    loaderContainer.style.display = "block";
    dataDisplay.style.display = "none";
  }

  function hideLoader() {
    loader.style.display = "none";
    loaderContainer.style.display = "none";
    dataDisplay.style.display = "block";
  }

  const urlParams = new URLSearchParams(window.location.search);
  let token = urlParams.get("token");

  if (!token) {
    tokenFormContainer.style.display = "block";
    dataDisplay.style.display = "none";
  } else {
    loadData(token);
  }

  function loadData(token) {
    showLoader();
    fetch(`http://tes.idnbogor.com/?token=${encodeURIComponent(token)}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok. Status: ${response.status}`
          );
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        hideLoader();
        if (data.status === "success" && Array.isArray(data.history)) {
          pdfName = data.history[0].name || "data-hutang";
          let html = `
          <div class="greeting">👋 Halo, ${data.history[0].name || "N/A"}</div>
          <div class="total-hutang">Total Hutang Anda: ${data.total_debt || "N/A"}</div>
          <table id="hutangTable">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal Transaksi</th>
                <th>Hutang Awal</th>
                <th>Pembayaran</th>
                <th>Hutang Tambahan</th>
                <th>Sisa Hutang</th>
              </tr>
            </thead>
            <tbody>
        `;

          data.history.forEach((item) => {
            html += `
            <tr>
              <td data-label="No">${item.index || "N/A"}</td>
              <td data-label="Tanggal Transaksi">${item.transactionDate || "N/A"}</td>
              <td data-label="Hutang Awal">${item.initialDebt || "N/A"}</td>
              <td data-label="Pembayaran">${item.payment || "N/A"}</td>
              <td data-label="Hutang Tambahan">${item.additionalDebt || "N/A"}</td>
              <td data-label="Sisa Hutang">${item.remainingDebt || "N/A"}</td>
            </tr>
          `;
          });

          html += `
            </tbody>
          </table>
        `;

          dataDisplay.innerHTML = html;
          downloadPDFButton.style.display = "block";
        } else {
          dataDisplay.innerHTML =
            "<p>Data tidak tersedia atau terjadi kesalahan dalam format data.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        hideLoader();
        dataDisplay.innerHTML =
          "<p>Gagal memuat data, silakan coba lagi.</p>";
      });
  }

  window.submitToken = function () {
    const manualToken = document.getElementById("manualToken").value;
    if (manualToken) {
      loadData(manualToken);
    }
  };

  downloadPDFButton.addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Data Hutang", 14, 16);

    const tableYPosition = 30;
    doc.autoTable({ html: "#hutangTable", startY: tableYPosition });
    doc.save(`${pdfName}-data-hutang.pdf`);
  });
});
