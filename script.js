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
