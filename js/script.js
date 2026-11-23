const $ = (s, c = document) => [...c.querySelectorAll(s)];
const kurang = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.getElementById("tahun").textContent = new Date().getFullYear();

/* muncul saat scroll */
$("[data-stag]").forEach((w) =>
  [...w.children].forEach((c, i) => {
    c.classList.add("rv");
    c.style.setProperty("--d", i * 0.07 + "s");
  }),
);
$(".item .teks .rv").forEach((e, i) =>
  e.style.setProperty("--d", (i % 5) * 0.09 + "s"),
);
$(".dua > div:last-child .rv").forEach((e, i) =>
  e.style.setProperty("--d", i * 0.1 + "s"),
);
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
);
$(".rv").forEach((e) => io.observe(e));

/* hitung angka */
const ioN = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      ioN.unobserve(e.target);
      const el = e.target,
        n = +el.dataset.n,
        d = +(el.dataset.d || 0),
        t = performance.now();
      if (kurang) {
        return;
      }
      (function f(now) {
        const p = Math.min((now - t) / 1400, 1),
          v = n * (1 - Math.pow(1 - p, 3));
        el.textContent = v.toLocaleString("id-ID", {
          minimumFractionDigits: d,
          maximumFractionDigits: d,
        });
        if (p < 1) requestAnimationFrame(f);
      })(t);
    }),
  { threshold: 0.6 },
);
$("[data-n]").forEach((e) => {
  if (!kurang) e.textContent = "0";
  ioN.observe(e);
});

/* parallax + progress */
const par = $("[data-par]"),
  prog = document.getElementById("prog");
let tick = false;
function upd() {
  const h = document.documentElement,
    max = h.scrollHeight - innerHeight;
  prog.style.setProperty("--sp", max > 0 ? scrollY / max : 0);
  if (!kurang)
    par.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const y =
        (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.par);
      el.style.setProperty("--py", (-y).toFixed(1) + "px");
      if (!el.classList.contains("f"))
        el.style.transform = "translateY(" + (-y).toFixed(1) + "px)";
    });
  tick = false;
}
addEventListener(
  "scroll",
  () => {
    if (!tick) {
      tick = true;
      requestAnimationFrame(upd);
    }
  },
  { passive: true },
);
addEventListener("resize", upd);
upd();

/* menu aktif */
const links = $(".menu a");
const spy = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting)
        links.forEach((l) =>
          l.classList.toggle(
            "aktif",
            l.getAttribute("href") === "#" + e.target.id,
          ),
        );
    }),
  { rootMargin: "-45% 0px -50% 0px" },
);
["home", "about", "portofolio", "contact"].forEach((id) =>
  spy.observe(document.getElementById(id)),
);

/* perbesar gambar */
const lb = document.getElementById("lb"),
  lbi = lb.querySelector("img");
$(".f img,.rel img").forEach((i) =>
  i.addEventListener("click", () => {
    lbi.src = i.src;
    lbi.alt = i.alt;
    lb.showModal();
  }),
);
lb.addEventListener("click", () => lb.close());
