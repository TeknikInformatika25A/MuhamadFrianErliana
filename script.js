// ============================================================
// ISI DATA PRIBADIMU DI SINI. Bagian yang dikosongkan tidak akan tampil.
// ============================================================
const PROFIL = {
  email: "muhamadfrian1@gmail.com", // email yang ditampilkan di bagian Kontak
  linkedin: "",  // contoh: "https://www.linkedin.com/in/namakamu"
  foto: "foto.jpg", // nama file foto (taruh file fotonya di folder yang sama)
  cv: "cv-frian.pdf" // nama file CV berformat PDF (taruh file PDF-nya di folder yang sama)
};

// 1. Tombol ganti tema (terang / gelap), pilihan disimpan di browser
const root = document.documentElement;
const themeBtn = document.getElementById("theme-btn");

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function currentTheme() {
  return root.getAttribute("data-theme") || systemTheme();
}

try {
  const saved = localStorage.getItem("tema");
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
} catch (e) { /* penyimpanan tidak tersedia, abaikan */ }

themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("tema", next); } catch (e) { /* abaikan */ }
});

// 2. Menandai menu navigasi sesuai bagian yang sedang dilihat
const links = document.querySelectorAll("nav ul a[href^='#']");
const sections = [...links]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function setActive(id) {
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

// 3. Tanggal "Diperbarui" otomatis mengikuti waktu halaman dibuka
const updated = document.getElementById("updated");
if (updated) {
  const bulan = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  updated.textContent = "Diperbarui " + bulan;
}

// 4. Foto profil: kalau PROFIL.foto diisi, ganti inisial dengan foto
const avatar = document.getElementById("avatar");
if (avatar && PROFIL.foto) {
  const img = document.createElement("img");
  img.src = PROFIL.foto;
  img.alt = "Foto Muhamad Frian Erliana";
  img.addEventListener("load", () => {
    avatar.textContent = "";
    avatar.appendChild(img);
  });
}

// 5. Tombol unduh CV: tampil hanya kalau PROFIL.cv diisi
const cvBtn = document.getElementById("cv-btn");
if (cvBtn && PROFIL.cv) {
  cvBtn.href = PROFIL.cv;
  cvBtn.hidden = false;
}

// 6. Daftar kontak: email dan LinkedIn tampil hanya kalau diisi
const contactList = document.getElementById("contact-list");

function addContact(label, build) {
  const li = document.createElement("li");
  const lbl = document.createElement("span");
  lbl.className = "lbl";
  lbl.textContent = label;
  li.appendChild(lbl);
  li.appendChild(build());
  contactList.appendChild(li);
}

if (contactList && PROFIL.linkedin) {
  addContact("LinkedIn", () => {
    const a = document.createElement("a");
    a.href = PROFIL.linkedin;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = PROFIL.linkedin.replace(/^https?:\/\/(www\.)?/, "");
    return a;
  });
}

if (contactList && PROFIL.email) {
  addContact("Email", () => {
    const wrap = document.createElement("span");
    wrap.className = "val";
    const a = document.createElement("a");
    a.href = "mailto:" + PROFIL.email;
    a.textContent = PROFIL.email;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Salin";
    btn.addEventListener("click", () => {
      const done = () => {
        btn.textContent = "Tersalin";
        setTimeout(() => { btn.textContent = "Salin"; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PROFIL.email).then(done, () => {});
      }
    });
    wrap.appendChild(a);
    wrap.appendChild(btn);
    return wrap;
  });
}
