function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    // Show success modal using SweetAlert
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Text copied successfully!",
      timer: 1500,
      showConfirmButton: false,
    });
  }

  function closeWindow() {
    window.close();
  }

  // Falling money animation
  function createFallingMoney() {
    const container = document.getElementById("falling-money-container");
    for (let i = 0; i < 30; i++) {
      // Generate 30 money symbols
      const money = document.createElement("div");
      money.classList.add("money");
      money.innerHTML = "&#128176;"; // Money bag emoji
      money.style.left = Math.random() * 100 + "vw"; // Random horizontal position
      money.style.animationDuration = Math.random() * 2 + 3 + "s"; // Random speed
      container.appendChild(money);
    }
  }

  createFallingMoney();