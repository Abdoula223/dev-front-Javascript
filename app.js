const phonesTbody = document.getElementById("phones-tbody");
let smartphones = [];
const API_BASE = "http://localhost:3000/smartphones";

function showSection(id) {
  ["list", "detail", "add"].forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) section.style.display = sectionId === id ? "block" : "none";
  });
}

function creerSmartphone(id, nom, prix) {
  const tr = document.createElement("tr");
  tr.dataset.id = id;
  tr.innerHTML = `
    <td class="px-4 py-2">${id}</td>
    <td class="px-4 py-2">${nom}</td>
    <td class="px-4 py-2">${Number(prix).toLocaleString("fr-FR")} FCFA</td>
    <td class="px-4 py-2">
      <button type="button" onclick="detaillerSmartphone('${id}')" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2">Voir</button>
      <button type="button" onclick="supprimerSmartphone('${id}')" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Supprimer</button>
    </td>
  `;
  phonesTbody.appendChild(tr);
}

async function loadSmartphones() {
  try {
    const res = await fetch(API_BASE);
    smartphones = await res.json();
    phonesTbody.innerHTML = "";
    smartphones.forEach(p => creerSmartphone(p.id, p.nom, p.prix));
  } catch (err) {
    console.error("Erreur lors du chargement :", err);
  }
}

function detaillerSmartphone(id) {
  const phone = smartphones.find(p => String(p.id) === String(id));
  if (!phone) return alert("Smartphone introuvable !");
  
  const imgContainer = document.getElementById('detail-img-container');
  imgContainer.innerHTML = "";
  const img = document.createElement('img');
  img.src = phone.photo || 'images/default.jpg';
  img.alt = phone.nom;
  img.className = "w-full h-48 object-cover";
  imgContainer.appendChild(img);

  document.getElementById('detail-nom').textContent = phone.nom;
  document.getElementById('detail-marque').textContent = phone.marque;
  document.getElementById('detail-prix').textContent = Number(phone.prix).toLocaleString("fr-FR") + " FCFA";
  document.getElementById('detail-ram').textContent = phone.ram + " RAM";
  document.getElementById('detail-rom').textContent = phone.rom + " ROM";
  document.getElementById('detail-description').textContent = phone.description;
  document.getElementById('detail-ecran').textContent = phone.ecran;

  const couleursContainer = document.getElementById('detail-couleurs');
  couleursContainer.innerHTML = "";
  if (phone.couleurs && phone.couleurs.length > 0) {
    phone.couleurs.forEach(c => {
      const span = document.createElement('span');
      span.style.backgroundColor = c;
      span.className = "px-2 py-1 text-xs rounded-full border border-gray-300";
      couleursContainer.appendChild(span);
    });
  }

  showSection("detail");
}

async function supprimerSmartphone(id) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce smartphone ?")) return;
  smartphones = smartphones.filter(p => String(p.id) !== String(id));
  document.querySelector(`tr[data-id="${id}"]`)?.remove();

  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur serveur");
  } catch (err) {
    console.error("Erreur lors de la suppression à distance :", err);
    localStorage.setItem("smartphones", JSON.stringify(smartphones));
  }

  showSection("list");
}

async function ajouterSmartphone(e) {
  e.preventDefault();
  const form = e.target;
  const file = form.photo.files[0];
  if (!file) return alert("Veuillez sélectionner une image.");

  const reader = new FileReader();
  reader.onload = async function () {
    const nouveauPhone = {
      nom: form.nom.value,
      marque: form.marque.value,
      description: form.description.value,
      prix: Number(form.prix.value),
      photo: reader.result,
      ram: form.ram.value,
      rom: form.rom.value,
      ecran: form.ecran.value,
      couleurs: [form.couleurs.value]
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouveauPhone)
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");

      const phoneAjoute = await res.json();
      creerSmartphone(phoneAjoute.id, phoneAjoute.nom, phoneAjoute.prix);
      smartphones.push(phoneAjoute);
      form.reset();
      showSection("list");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout.");
    }
  };
  reader.readAsDataURL(file);
}

window.addEventListener("DOMContentLoaded", () => {
  loadSmartphones();
  showSection("list");
  const formAjout = document.getElementById("form-ajout");
  if (formAjout) formAjout.addEventListener("submit", ajouterSmartphone);
});
