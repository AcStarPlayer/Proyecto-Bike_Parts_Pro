import { navBar } from "../../barraNavegacion/barNav.js";
import { chatbox, whatsappButton } from "../../whatsApp/whatsappBox.js";
import { footer } from "../footer.js";

document.querySelector(".nav-content").innerHTML = navBar("BikePartsPro", "Sube de nivel", "../../../");

document.querySelectorAll(".whatsapp-components").forEach((el) => {
  el.innerHTML = chatbox() + whatsappButton();
});

document.getElementById("footer").innerHTML = footer("../../../");
