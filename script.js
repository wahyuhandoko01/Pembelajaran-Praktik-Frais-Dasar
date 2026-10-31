/* ============================================================
   MILLING INTRODUCTION — script.js
   Media Pembelajaran Interaktif Praktik Frais Dasar
   Politeknik ATMI Surakarta
   ============================================================ */
'use strict';

/* ---------- 0. UTIL ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const LS = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* mode privat */ } }
};
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

/* ---------- 1. DATA KARTU (sumber: diktat Milling + PPT Milling Introduction) ---------- */
const TOOLS = [
  { id: 'end-mill', img: 'assets/images/tools/end-mill.svg', cat: 'face', catLabel: 'Face Cutting',
    name: 'End Mill Cutter',
    fungsi: 'Cutter dengan sisi potong pada ujung muka dan pada sisi spiralnya.',
    spek: ['Ø 0.5 – 50 mm', 'Tangkai lurus / konus'],
    gunakan: 'Pengerjaan face cutting umum, alur, dan bertingkat pada mesin milling vertikal — cutter paling sering dipakai praktik.' },
  { id: 'shell-end-mill', img: 'assets/images/tools/shell-end-mill.svg', cat: 'face', catLabel: 'Face Cutting',
    name: 'Shell End Mill Cutter',
    fungsi: 'Memiliki lubang berpasak pada bagian tengah cutter yang berfungsi untuk pemasangan pada arbor. Terdapat sisi potong pada ujung muka dan pada sisi spiralnya.',
    spek: ['Ø 30 – 200 mm', 'Lubang berpasak'],
    gunakan: 'Perataan permukaan (face cutting) luas dengan dipasang pada stub/short/long arbor.' },
  { id: 'plain-mill', img: 'assets/images/tools/plain-mill.svg', cat: 'side', catLabel: 'Side Cutting',
    name: 'Plain Mill Cutter',
    fungsi: 'Digunakan untuk pengefraisan horisontal dari permukaan yang datar. Bentuk hampir sama dengan SEMC, tetapi hanya memiliki sisi potong spiral pada bagian pinggirannya, dan memiliki lubang berpasak untuk pemasangan pada arbor.',
    spek: ['Sisi potong pinggiran', 'Lubang berpasak'],
    gunakan: 'Pengefraisan horisontal permukaan datar pada mesin milling horisontal.' },
  { id: 'disk-cutter', img: 'assets/images/tools/disk-cutter.svg', cat: 'side', catLabel: 'Side Cutting',
    name: 'Disk Cutter',
    fungsi: 'Memiliki bentuk pipih dan dapat digunakan pada pembuatan slot maupun slitting. Sisi potongnya ada yang rata, dan ada juga yang zig-zag.',
    spek: ['Bentuk pipih', 'Sisi rata / zig-zag'],
    gunakan: 'Pembuatan slot dan slitting (memotong / menyayat celah tipis).' },
  { id: 'dove-tail', img: 'assets/images/tools/dove-tail.svg', cat: 'profil', catLabel: 'Cutter Profil',
    name: 'Dove Tail Cutter',
    fungsi: 'Digunakan untuk menghasilkan profil dove tail (ekor burung) pada benda kerja.',
    spek: ['Sudut potong 45° / 60° / 90°'],
    gunakan: 'Membuat profil ekor burung (dove tail) pada slide meja dan komponen yang saling mengunci.' },
  { id: 't-slot', img: 'assets/images/tools/t-slot.svg', cat: 'profil', catLabel: 'Cutter Profil',
    name: 'T-Slot Cutter',
    fungsi: 'Digunakan untuk membuat alur berbentuk T. Memiliki sisi potong di bagian yang melingkar, dengan sudut helix yang saling berlawanan.',
    spek: ['2 jenis: shank rata', 'Shank berulir'],
    gunakan: 'Membuat alur T pada meja mesin dan pelat pengecam.' },
  { id: 'prisma', img: 'assets/images/tools/prisma.svg', cat: 'profil', catLabel: 'Cutter Profil',
    name: 'Prisma Cutter',
    fungsi: 'Cutter yang digunakan untuk menghasilkan profil V pada benda kerja.',
    spek: ['Sudut potong 45° / 60° / 90°'],
    gunakan: 'Membuat alur V / prisma pada benda kerja, misalnya bubungan ragum.' },
  { id: 'hobbing-cutter', img: 'assets/images/tools/hobbing-cutter.svg', cat: 'profil', catLabel: 'Cutter Profil',
    name: 'Hobbing Cutter',
    fungsi: 'Cutter yang digunakan pada mesin milling hobbing untuk menghasilkan profil berbentuk roda gigi (gear).',
    spek: ['Profil evolvente', 'Presisi'],
    gunakan: 'Pembuatan roda gigi / gear dan sejenisnya (sprocket dll) pada mesin hobbing.' },
  { id: 'modul-cutter', img: 'assets/images/tools/modul-cutter.svg', cat: 'profil', catLabel: 'Cutter Profil',
    name: 'Modul Cutter',
    fungsi: 'Digunakan untuk membuat roda gigi dengan modul tertentu, dan menggunakan mesin milling konvensional dalam pengerjaannya. Bentuknya hampir sama dengan cutter hobbing tetapi pipih.',
    spek: ['Per modul', 'Bentuk pipih'],
    gunakan: 'Pembuatan roda gigi pada mesin milling konvensional dengan modul tertentu.' },
  { id: 'roughing-cutter', img: 'assets/images/tools/roughing-cutter.svg', cat: 'proses', catLabel: 'Fungsi Pengerjaan',
    name: 'Cutter Roughing',
    fungsi: 'Cutter yang digunakan untuk proses roughing pada benda kerja, dimana proses pengerjaan dilakukan dengan depth of cut yang besar.',
    spek: ['Depth of cut besar'],
    gunakan: 'Membuang material banyak dengan cepat pada tahap awal pengerjaan.' },
  { id: 'finishing-cutter', img: 'assets/images/tools/finishing-cutter.svg', cat: 'proses', catLabel: 'Fungsi Pengerjaan',
    name: 'Cutter Finishing',
    fungsi: 'Cutter yang digunakan untuk proses finishing, dengan depth of cut yang lebih sedikit dibandingkan proses roughing, dan biasanya menghasilkan permukaan yang lebih halus.',
    spek: ['Depth of cut kecil', 'Permukaan halus'],
    gunakan: 'Tahap akhir pengerjaan untuk mencapai ukuran presisi dan permukaan halus.' },
  { id: 'type-n', img: 'assets/images/tools/type-n.svg', cat: 'type', catLabel: 'Berdasarkan Material BK',
    name: 'Cutter Type N (Normal)',
    fungsi: 'Digunakan untuk material yang normal sampai 70 (kg/mm²).',
    spek: ['β ± 73°', 'γ ± 30°', 'Gigi tidak banyak', 'Pemakanan per gigi tidak besar'],
    gunakan: 'Pemotongan material baja normal untuk kebanyakan pekerjaan praktik.' },
  { id: 'type-h', img: 'assets/images/tools/type-h.svg', cat: 'type', catLabel: 'Berdasarkan Material BK',
    name: 'Cutter Type H (Keras)',
    fungsi: 'Digunakan untuk material yang ulet dan keras (baja panduan, baja tuang, Spk) sampai 100 (kg/mm²).',
    spek: ['β ± 81°', 'γ ± 25°', 'Kisar kecil → gigi banyak', 'Pemakanan per gigi kecil'],
    gunakan: 'Pemotongan material keras / ulet seperti baja alat dan baja tuang.' },
  { id: 'type-w', img: 'assets/images/tools/type-w.svg', cat: 'type', catLabel: 'Berdasarkan Material BK',
    name: 'Cutter Type W (Lunak)',
    fungsi: 'Digunakan untuk material lunak.',
    spek: ['β ± 57°', 'γ ± 35°', 'Kisar besar → gigi sedikit', 'Pemakanan per gigi besar'],
    gunakan: 'Pemotongan material lunak seperti aluminium dan kuningan.' },
  { id: 'twist-drill', img: 'assets/images/tools/twist-drill.svg', cat: 'selain', catLabel: 'Alat Potong Selain Cutter',
    name: 'Twist Drill',
    fungsi: 'Alat potong yang digunakan untuk membuat lubang pada benda kerja.',
    spek: ['Tangkai silindris / konus', 'Sudut mata 118°'],
    gunakan: 'Pengeboran lubang pada praktik 2 dan 3 (drilling).' },
  { id: 'reamer', img: 'assets/images/tools/reamer.svg', cat: 'selain', catLabel: 'Alat Potong Selain Cutter',
    name: 'Reamer',
    fungsi: 'Alat potong yang digunakan untuk memperbesar sebuah lubang, dan biasanya lubang yang dihasilkan berukuran presisi (ISO).',
    spek: ['Hasil lubang presisi ISO'],
    gunakan: 'Menyelesaikan lubang agar berukuran presisi ISO setelah dibor.' },
  { id: 'tap-sney', img: 'assets/images/tools/tap-sney.svg', cat: 'selain', catLabel: 'Alat Potong Selain Cutter',
    name: 'Thread (Tap / Sney)',
    fungsi: 'Alat potong yang digunakan untuk membuat ulir dalam / luar pada benda kerja.',
    spek: ['Metric (mm)', 'Whitworth (inchi)'],
    gunakan: 'Pembuatan ulir dalam lubang (tapping) pada praktik 2.' },
  { id: 'boring-tool', img: 'assets/images/tools/boring-tool.svg', cat: 'selain', catLabel: 'Alat Potong Selain Cutter',
    name: 'Boring Tool',
    fungsi: 'Alat potong yang digunakan untuk memperbesar lubang, atau membuat lubang khusus yang tidak bisa dikerjakan dengan Twist Drill ataupun Reamer.',
    spek: ['Dipasang pada boring head', 'Skala teliti'],
    gunakan: 'Drilling with boring head pada praktik 3 untuk lubang presisi.' }
];

const ACCESSORIES = [
  { id: 'arbor', img: 'assets/images/accessories/arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Arbor (ISO 30 – 60)',
    fungsi: 'Clamping tool untuk mencekam cutter yang berlubang pada spindle mesin. Berdasarkan tangkainya tersedia: Arbor ISO 30, 40, 45, 50, 55, dan 60 (tabel dimensi tersedia di atas).',
    gunakan: 'Pemasangan Shell End Mill, Plain Mill, Disk Cutter, dan cutter berlubang lainnya.' },
  { id: 'drill-chuck-arbor', img: 'assets/images/accessories/drill-chuck-arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Drill Chuck Arbor',
    fungsi: 'Dipakai untuk mencekam mata bor, tool lain yang berdiameter kecil dan memiliki bentuk tangkai silindris.',
    gunakan: 'Pengecaman twist drill dan alat kecil bertangkai silindris.' },
  { id: 'sleeve-arbor', img: 'assets/images/accessories/sleeve-arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Sleeve Arbor',
    fungsi: 'Sleeve Arbor for Cutter: untuk mencekam End Mill Cutter bertangkai taper/konus. Sleeve Arbor for Twist Drill: untuk mencekam Twist Drill bertangkai taper/konus.',
    gunakan: 'Adapter tangkai taper/konus ke spindle mesin.' },
  { id: 'collet-arbor', img: 'assets/images/accessories/collet-arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Collet Arbor',
    fungsi: 'Digunakan untuk mencekam alat dengan tangkai silindris, dan didesain untuk mengambil sebuah diameter yang spesifik. Standard collet (1 set) dilangkahkan dengan penambahan 0,5 mm.',
    gunakan: 'Pengecaman cutter atau alat lain bertangkai silindris dengan diameter spesifik.' },
  { id: 'stub-arbor', img: 'assets/images/accessories/stub-arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Stub Arbor',
    fungsi: 'Biasanya digunakan untuk mencekam Shell End Mill Cutter, dan beberapa tools lain yang memiliki lubang silindris di tengah, tanpa perlu menambahkan ring untuk membantu pencekaman.',
    gunakan: 'Pemasangan Shell End Mill pada mesin vertikal tanpa ring.' },
  { id: 'short-arbor', img: 'assets/images/accessories/short-arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Short Arbor',
    fungsi: 'Digunakan untuk mencekam Shell End Mill Cutter dan beberapa tools lain yang memiliki lubang silindris di tengah, biasanya perlu ditambahkan ring untuk membantu proses pencekaman.',
    gunakan: 'Pemasangan Shell End Mill dengan ring bantu pencekaman.' },
  { id: 'long-arbor', img: 'assets/images/accessories/long-arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Long Arbor',
    fungsi: 'Digunakan untuk mencekam Shell End Mill Cutter dan alat potong lain yang memiliki lubang silindris di tengah. Biasanya digunakan untuk Mesin Horisontal, dan juga ditambahkan ring untuk membantu pencekaman.',
    gunakan: 'Pemasangan cutter berlubang pada mesin milling horisontal.' },
  { id: 'side-lock-arbor', img: 'assets/images/accessories/side-lock-arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Side Lock Arbor',
    fungsi: 'Digunakan untuk mencekam cutter dengan tangkai silindris. Pencekamannya dengan mengencangkan screw pada arbor sehingga screw menekan cutter dan mengikatnya — perlu bidang rata pada sisi tangkai cutter agar tercekam baik.',
    gunakan: 'Pengecaman end mill bertangkai silindris bervalok (side lock).' },
  { id: 'boring-head-arbor', img: 'assets/images/accessories/boring-head-arbor.svg', cat: 'arbor', catLabel: 'Clamping Tools',
    name: 'Boring Head Arbor',
    fungsi: 'Digunakan untuk mencekam boring tools; boring head biasanya disertai skala yang cukup teliti untuk pembuatan lubang yang memiliki ukuran presisi.',
    gunakan: 'Drilling with boring head pada praktik 3.' },
  { id: 'clamp', img: 'assets/images/accessories/clamp.svg', cat: 'device', catLabel: 'Clamping Benda Kerja',
    name: 'Clamp',
    fungsi: 'Alat pencekam sederhana yang digunakan untuk mencekam material di meja milling; clamp sebagai pencekam dan T-slot Bolt sebagai pengencangnya.',
    gunakan: 'Mencekam benda kerja langsung di meja mesin bersama angle plate / V-block.' },
  { id: 'angle-plate', img: 'assets/images/accessories/angle-plate.svg', cat: 'device', catLabel: 'Clamping Benda Kerja',
    name: 'Angle Plate',
    fungsi: 'Ketika permukaan benda kerja yang akan di milling memiliki atau ingin dibuat sudut tertentu, dapat dibuat dengan menggunakan angle plate. Benda kerja yang dipasang biasanya dicekam dengan clamp.',
    gunakan: 'Pencekaman / pembentukan sudut (umumnya 90°) pada benda kerja.' },
  { id: 'v-block', img: 'assets/images/accessories/v-block.svg', cat: 'device', catLabel: 'Clamping Benda Kerja',
    name: 'V-Blocks',
    fungsi: 'Sangat baik digunakan untuk pencekaman batang poros yang akan diproses milling. Batang poros pendek cukup satu V-block; batang panjang menggunakan dua V-blocks atau lebih dengan jarak sesuai panjang poros. Dicekam ke meja dengan clamp.',
    gunakan: 'Mencekam batang poros bulat untuk pemotongan / pembuatan keyway.' },
  { id: 'fixed-vice', img: 'assets/images/accessories/fixed-vice.svg', cat: 'device', catLabel: 'Vice Machine',
    name: 'Fixed Vice',
    fungsi: 'Alat ini paling sering digunakan dalam pengerjaan di Milling. Fixed vice tidak dapat diubah sudutnya, sehingga posisinya selalu tetap.',
    gunakan: 'Pengecaman benda kerja standar (FJ = Fixed Jaw) untuk blocking dan profil dasar.' },
  { id: 'swivel-vice', img: 'assets/images/accessories/swivel-vice.svg', cat: 'device', catLabel: 'Vice Machine',
    name: 'Swivel Vice',
    fungsi: 'Clamping device ini memiliki kemampuan untuk diubah sudutnya pada satu sudut putar, sehingga mampu digunakan untuk pembuatan sudut pada proses pengerjaan di Milling.',
    gunakan: 'Pengecaman dengan sudut tunggal (pemiringan benda kerja).' },
  { id: 'compound-vice', img: 'assets/images/accessories/compound-vice.svg', cat: 'device', catLabel: 'Vice Machine',
    name: 'Compound Vice',
    fungsi: 'Sama dengan Swivel Vice, tetapi memiliki lebih dari satu sudut putar, sehingga bisa digunakan untuk pembuatan sudut / profil yang lebih rumit.',
    gunakan: 'Pengecaman dengan sudut ganda untuk profil rumit.' },
  { id: 'rotary-table', img: 'assets/images/accessories/rotary-table.svg', cat: 'device', catLabel: 'Rotary Table',
    name: 'Rotary Table',
    fungsi: 'Asesoris mesin milling yang biasa digunakan untuk membuat radius luar; pada saat pengerjaan biasanya ditambahkan clamp + center pin untuk mencekam benda kerja.',
    gunakan: 'Pembuatan radius luar dan pembagian melingkar pada benda kerja.' },
  { id: 'dividing-head', img: 'assets/images/accessories/dividing-head.svg', cat: 'device', catLabel: 'Deviding Heads',
    name: 'Deviding Head',
    fungsi: 'Asesoris mesin milling yang biasa digunakan untuk membuat segi tertentu (misal segi 3, 4, 5 dst). Bisa juga digunakan untuk membuat roda gigi, ataupun spiral pada mesin milling.',
    gunakan: 'Pembuatan hexagon profile pada praktik 4.' }
];

const MEASURE = [
  { id: 'square-line', img: 'assets/images/alat-ukur/square-line.svg', name: 'Square Line', gunakan: 'Mengecek kesiuan (perpendicular) bidang benda kerja dan siku ragum saat work preparation & blocking.' },
  { id: 'dial-caliper', img: 'assets/images/alat-ukur/dial-caliper.svg', name: 'Dial Caliper', gunakan: 'Mengukur panjang, lebar, tebal, dan diameter dengan pembacaan dial — cepat dan praktis di bengkel.' },
  { id: 'vernier-caliper', img: 'assets/images/alat-ukur/vernier-caliper.svg', name: 'Vernier Caliper', gunakan: 'Mengukur luar/dalam/kedalaman dengan skala nonius ketelitian 0,02 mm — alat ukur wajib dibawa saat praktik.' },
  { id: 'bevel-protractor', img: 'assets/images/alat-ukur/bevel-protractor.svg', name: 'Bevel Protractor', gunakan: 'Mengukur/memeriksa sudut benda kerja hasil frais sudut (misal profil V atau dove tail).' },
  { id: 'bevel-transfer', img: 'assets/images/alat-ukur/bevel-transfer.svg', name: 'Bevel Transfer', gunakan: 'Menyalin (transfer) sudut dari benda kerja / gambar ke benda kerja lain.' },
  { id: 'outside-micrometer', img: 'assets/images/alat-ukur/outside-micrometer.svg', name: 'Outside Micrometer', gunakan: 'Mengukur dimensi luar dengan ketelitian 0,01 mm untuk ukuran presisi (misal masukkan ukuran tebal).' },
  { id: 'rugo-test', img: 'assets/images/alat-ukur/rugo-test.svg', name: 'Rugo Test', gunakan: 'Memeriksa tingkat kekasaran permukaan hasil frais (performance 2 · 4 · 6 · 8 · 10).' },
  { id: 'plug-thread-gauge', img: 'assets/images/alat-ukur/plug-thread-gauge.svg', name: 'Plug Thread Gauge', gunakan: 'Memeriksa ulir lubang hasil tapping (GO / NOGO).' },
  { id: 'block-gauge', img: 'assets/images/alat-ukur/block-gauge.svg', name: 'Block Gauge', gunakan: 'Standar ukuran presisi; dikombinasikan untuk setting dan kalibrasi pengukuran.' },
  { id: 'angle-gauge', img: 'assets/images/alat-ukur/angle-gauge.svg', name: 'Angle Gauge', gunakan: 'Gabungan blok sudut untuk memeriksa sudut dengan presisi tinggi.' }
];

const PRACTICES = [
  { id: 'p1', img: 'assets/images/practice/practice-1-blocking.svg', badge: 'PRACTICE 1', name: 'Blocking',
    desc: 'Proses pembuatan blocking dengan target kesikuan (Perpendicular) dan Kesejajaran (Paralelism).',
    list: ['Cekam benda kerja di ragum (FJ & MJ) dengan paralel', 'Sayat bidang referensi just clean: rata, siku, sejajar', 'Target: kesikuan (perpendicular) antar bidang', 'Target: kesejajaran (parallelism) bidang berhadapan', 'Ukur dengan square line & vernier caliper'],
    tools: ['Fixed Vice', 'End Mill / Face Mill', 'Square Line', 'Vernier Caliper'] },
  { id: 'p2', img: 'assets/images/practice/practice-2-stepping.svg', badge: 'PRACTICE 2', name: 'Stepping · Chamfering · Drilling · Tapping',
    desc: 'Proses pembuatan Stepping, Chamfering, Drilling, & Tapping.',
    list: ['Stepping: penyayatan bertingkat sesuai ukuran gambar', 'Chamfering: pelisteikan tepi benda kerja', 'Drilling: pengeboran lubang dengan twist drill', 'Tapping: pembuatan ulir dalam dengan Tap/Sney'],
    tools: ['End Mill Cutter', 'Twist Drill', 'Tap / Sney', 'Dial Caliper'] },
  { id: 'p3', img: 'assets/images/practice/practice-3-slot-iso.svg', badge: 'PRACTICE 3', name: 'Stepping with ISO · Slotting · Drilling with Boring Head',
    desc: 'Proses pembuatan Stepping with ISO, Slotting, Drilling with Boring Head.',
    list: ['Stepping with ISO: bertingkat dengan lubang presisi ISO', 'Slotting: pembuatan alur dengan disk/end mill cutter', 'Drilling with Boring Head: lubang presisi dengan boring head arbor'],
    tools: ['End Mill Cutter', 'Disk Cutter', 'Boring Head Arbor', 'Boring Tool', 'Reamer'] },
  { id: 'p4', img: 'assets/images/practice/practice-4-hexagon.svg', badge: 'PRACTICE 4', name: 'Hexagon Profile · Deviding Head',
    desc: 'Proses pembuatan Hexagon Profile dengan Deviding Head.',
    list: ['Pasang deviding head & tailstock di meja mesin', 'Cekam benda kerja pada chuck deviding head', 'Bagi sudut 60° per sisi (segi 6)', 'Sayat tiap bidang hingga ukuran sejajar'],
    tools: ['Deviding Head', 'Plain / Side Cutter', 'Outside Micrometer'] },
  { id: 'p5', img: 'assets/images/practice/practice-1-blocking.svg', badge: 'PRACTICE TMK · TPM · PM · TRMK · TRII', name: 'Blocking + Profil Dasar',
    desc: 'Proses pembuatan blocking dengan target kesikuan (Perpendicular) dan Kesejajaran (Paralelism) serta profil dasar (Chamfering, Stepping, Slotting, Drilling).',
    list: ['Blocking: referensi rata, siku, sejajar', 'Profil dasar: chamfering, stepping, slotting, drilling', 'Satu rangkaian praktik untuk prodi TMK / TPM / PM / TRMK / TRII'],
    tools: ['Fixed Vice', 'End Mill Cutter', 'Twist Drill', 'Vernier Caliper'] }
];

/* Kuis 20 soal — seluruh isi bersumber dari diktat & PPT */
const QUIZ = [
  { q: 'Apa definisi proses milling (frais)?',
    o: ['Proses cutting conventional dengan mesin milling yang menghasilkan permukaan rata / bentuk spesifik dan menyisakan chip',
        'Proses pembentukan logam dengan menekan benda kerja hingga berbentuk tertentu',
        'Proses pengelasan dua logam menjadi satu kesatuan',
        'Proses pengecoran logam cair ke dalam cetakan'],
    a: 0, e: 'Sesuai diktat BAB 1: proses cutting conventional dengan mesin milling, menghasilkan permukaan rata atau bentuk spesifik dengan ukuran & kualitas tertentu dan menyisakan chip.' },
  { q: 'Apa prinsip dasar kerja milling?',
    o: ['Alat potong diam, benda kerja berputar pada spindle',
        'Benda kerja yang diam (dicekam) dipotong oleh meja yang bergerak menuju alat potong yang berputar',
        'Benda kerja bergerak menuju alat potong yang diam',
        'Alat potong dan benda kerja sama-sama berputar'],
    a: 1, e: 'Prinsip dasar: pemotongan benda kerja yang diam dengan meja yang bergerak menuju alat potong yang berputar.' },
  { q: 'Gerakan utama pada mesin milling adalah…',
    o: ['Gerakan meja ke arah cutter', 'Gerakan mendekatkan benda kerja ke alat potong', 'Gerakan berputarnya alat potong pada spindle utama (n, rpm)', 'Gerakan penggantian cutter'],
    a: 2, e: 'Ada 3 gerakan: gerakan utama (putaran alat potong, n dalam rpm), feeding (s), dan setting/depth of cut (a/t).' },
  { q: 'Satuan dan simbol feeding pada milling adalah…',
    o: ['rpm, n', 'mm, a/t', 'mm/menit, s', 'm/menit, Cs'],
    a: 2, e: 'Feeding = gerakan benda kerja saat pemotongan, satuannya mm/menit dengan simbol s.' },
  { q: 'Depth of cut (gerakan setting) menggunakan satuan dan simbol…',
    o: ['mm, a/t', 'mm/menit, s', 'rpm, n', 'mm/rev, fo'],
    a: 0, e: 'Depth of cut = gerakan mendekatkan benda kerja pada alat potong, satuannya mm dengan simbol a/t.' },
  { q: 'Pemotongan dengan menggunakan sisi potong bagian depan (Face) dari cutter disebut…',
    o: ['Side cutting', 'Face cutting', 'Climbing milling', 'Slitting'],
    a: 1, e: 'Face cutting = pemotongan menggunakan sisi potong bagian depan (Face) dari alat potong (Cutter).' },
  { q: 'Pada climbing milling, arah putaran cutter terhadap arah feeding benda kerja adalah…',
    o: ['Berlawanan arah', 'Searah', 'Tegak lurus', 'Tidak ada hubungan'],
    a: 1, e: 'Climbing: arah putaran cutter SEARAH dengan arah gerakan pemakanan (feeding) benda kerja.' },
  { q: 'Pemotongan conventional umumnya digunakan pada mesin…',
    o: ['CNC', 'Konvensional', 'Hobbing', 'Copy milling'],
    a: 1, e: 'Climbing digunakan pada mesin CNC; conventional digunakan pada mesin konvensional (tabel perbandingan diktat).' },
  { q: 'Bagian yang terpenting dari mesin milling adalah…',
    o: ['Meja (table)', 'Knee', 'Spindle utama', 'Base'],
    a: 2, e: 'Spindle utama adalah bagian terpenting mesin milling — tempat untuk mencekam alat potong.' },
  { q: 'Minimal jumlah motor yang terdapat pada mesin milling adalah…',
    o: ['1 buah', '2 buah', '3 buah', '4 buah'],
    a: 2, e: 'Minimal 3 motor: motor spindle utama, motor feeding, dan motor pendingin (cooling).' },
  { q: 'Bagian mesin yang berfungsi menopang / menahan meja mesin adalah…',
    o: ['Column', 'Knee', 'Base', 'Overarm'],
    a: 1, e: 'Knee = bagian mesin untuk menopang/menahan meja mesin; pada bagian ini terdapat transmisi feeding.' },
  { q: 'Mesin milling yang digunakan untuk membuat roda gigi / gear adalah…',
    o: ['Mesin milling gravier', 'Mesin milling planer', 'Mesin milling hobbing', 'Mesin milling copy'],
    a: 2, e: 'Mesin milling hobbing digunakan untuk membuat roda gigi/gear (sprocket dll) dengan alat potong profil evolvente.' },
  { q: 'Rumus mencari putaran spindle utama (n) adalah…',
    o: ['n = 1000 × Cs / (π × d)', 'n = π × d × Cs / 1000', 'n = Cs × d', 'n = 1000 × d / Cs'],
    a: 0, e: 'n = (1000 × Cs) / (π × d) rpm, dengan Cs dalam m/menit dan d = diameter alat potong dalam mm.' },
  { q: 'Diketahui Cs = 32 m/menit, alat potong HSS End Mill Cutter Roughing, d = ∅20 mm. Berdasarkan tabel diktat, besarnya n dan s adalah…',
    o: ['n = 400 rpm, s = 40 mm/menit', 'n = 500 rpm, s = 56 mm/menit', 'n = 600 rpm, s = 60 mm/menit', 'n = 750 rpm, s = 75 mm/menit'],
    a: 1, e: 'Contoh diktat BAB 3: dengan tabel standar Jerman material HSS, EMCR ∅20 pada Cs 32 → n = 500 rpm dan s = 56 mm/menit.' },
  { q: 'Rumus feed per minute (s) adalah…',
    o: ['s = z × sz', 's = z × n × sz', 's = sz / (z × n)', 's = L × i'],
    a: 1, e: 'Feed per minute: s = z × n × sz (mm/menit); so = z × sz (mm/rev); sz = s/(z × n) (mm/tooth).' },
  { q: 'Pada side cutting, panjang langkah akhir (lu) yang diambil adalah…',
    o: ['3 mm', '5 mm', 'Setengah diameter cutter', '10 mm'],
    a: 1, e: 'Side cutting: la = √(ap × (d − ap)) dan lu diambil 5 mm.' },
  { q: 'Cutter type H digunakan untuk material…',
    o: ['Lunak', 'Normal sampai 70 kg/mm²', 'Ulet dan keras (baja panduan, baja tuang, Spk) sampai 100 kg/mm²', 'Kayu dan plastik'],
    a: 2, e: 'Type H (keras): β ±81°, γ ±25°, kisar kecil → jumlah gigi banyak, pemakanan per gigi kecil.' },
  { q: 'Shell End Mill Cutter dibuat dengan diameter antara…',
    o: ['0.5 – 50 mm', '10 – 100 mm', '30 – 200 mm', '100 – 500 mm'],
    a: 2, e: 'Shell End Mill memiliki lubang berpasak untuk arbor dan dibuat dengan diameter 30 – 200 mm.' },
  { q: 'Kunci spindle tertinggal di spindle dan terputar akan dikenai kompensasi…',
    o: ['5 jam', '10 jam', '25 jam', '50 jam'],
    a: 2, e: 'Kompensasi: tertinggal 10 jam; tertinggal & terputar 25 jam; tertinggal, terputar dan terlempar (P2) 50 jam.' },
  { q: 'Peralatan yang WAJIB dibawa mahasiswa saat praktik milling adalah…',
    o: ['Kacamata, caliper, alat tulis', 'Kalkulator, tumbler, HP', 'Kunci spindle, majun, logbook', 'Tabel elemen mesin, kunci L, block gauge'],
    a: 0, e: 'Peralatan: kacamata*, caliper*, alat tulis*, kalkulator, tabel elemen mesin. Tanda * = wajib dibawa.' }
];

/* ---------- 2. ROUTING SECTION ---------- */
const SECTION_IDS = ['home', 'materi', 'mesin', 'cutting-condition', 'cutting-tools', 'aksesori', 'praktik', 'work-preparation', 'alat-ukur', 'penilaian', 'k3', 'aturan', 'target', 'evaluasi'];
const LEARNABLE = SECTION_IDS.filter(id => id !== 'home');

function goSection(id, scrollSel) {
  if (!SECTION_IDS.includes(id)) id = 'home';
  $$('.section').forEach(s => s.classList.toggle('active', s.id === id));
  $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.goto === id));
  closeMobileMenu();
  closeOverlays();
  if (location.hash !== '#' + id) {
    try { history.pushState(null, '', '#' + id); } catch (e) { location.hash = id; }
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (scrollSel) {
    const el = $(scrollSel);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }
  // Update judul dokumen
  const sec = $('#' + id);
  if (sec && sec.dataset.title) document.title = sec.dataset.title + ' · MILLING INTRODUCTION';
}

document.addEventListener('click', (ev) => {
  const goto = ev.target.closest('[data-goto]');
  if (goto) {
    ev.preventDefault();
    goSection(goto.dataset.goto, goto.dataset.scrollto || null);
  }
  const closeBtn = ev.target.closest('[data-close]');
  if (closeBtn) closeOverlays();
});

window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#', '');
  if (SECTION_IDS.includes(id)) goSection(id);
});

/* ---------- 3. THEME ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  LS.set('mi_theme', theme);
}
applyTheme(LS.get('mi_theme', 'light'));
$('#btnTheme').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  toast(next === 'dark' ? '🌙 Mode gelap aktif' : '☀️ Mode terang aktif');
});

/* ---------- 4. MOBILE MENU ---------- */
function closeMobileMenu() {
  $('#mobileMenu').hidden = true;
  $('#btnMenu').setAttribute('aria-expanded', 'false');
}
$('#btnMenu').addEventListener('click', () => {
  const m = $('#mobileMenu');
  m.hidden = !m.hidden;
  $('#btnMenu').setAttribute('aria-expanded', String(!m.hidden));
});
$$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMobileMenu));

/* ---------- 5. RENDER KARTU ---------- */
function bmBtnHTML(type, id) {
  return `<button class="bm-btn" data-bm="${type}:${id}" title="Simpan ke bookmark" aria-label="Simpan ke bookmark">🔖</button>`;
}
function toolCard(t) {
  return `<article class="card tool-card searchable" id="card-tool-${t.id}" data-cat="${t.cat}">
    <img src="${t.img}" alt="Ilustrasi ${t.name}" loading="lazy">
    <div class="tool-body">
      <span class="tool-cat">${t.catLabel}</span>
      <h4>${t.name}</h4>
      <p><b>Fungsi:</b> ${t.fungsi}</p>
      ${t.spek ? `<div class="tool-specs">${t.spek.map(s => `<span class="chip">${s}</span>`).join('')}</div>` : ''}
      <p class="mt-8"><b>Penggunaan:</b> ${t.gunakan}</p>
      <div class="card-actions"><span class="chip" style="font-size:0.62rem">CUTTING TOOLS</span>${bmBtnHTML('tool', t.id)}</div>
    </div>
  </article>`;
}
function accCard(t) {
  return `<article class="card tool-card searchable" id="card-acc-${t.id}" data-cat="${t.cat}">
    <img src="${t.img}" alt="Ilustrasi ${t.name}" loading="lazy">
    <div class="tool-body">
      <span class="tool-cat">${t.catLabel}</span>
      <h4>${t.name}</h4>
      <p><b>Fungsi:</b> ${t.fungsi}</p>
      <p class="mt-8"><b>Penggunaan:</b> ${t.gunakan}</p>
      <div class="card-actions"><span class="chip" style="font-size:0.62rem">AKSESORIS</span>${bmBtnHTML('acc', t.id)}</div>
    </div>
  </article>`;
}
function measureCard(t) {
  return `<article class="card tool-card searchable" id="card-mea-${t.id}">
    <img src="${t.img}" alt="Ilustrasi ${t.name}" loading="lazy">
    <div class="tool-body">
      <span class="tool-cat">Alat Ukur</span>
      <h4>${t.name}</h4>
      <p class="mt-8"><b>Penggunaan:</b> ${t.gunakan}</p>
      <div class="card-actions"><span class="chip" style="font-size:0.62rem">ALAT UKUR</span>${bmBtnHTML('mea', t.id)}</div>
    </div>
  </article>`;
}
function practiceCard(p) {
  return `<article class="card practice-card searchable" id="card-practice-${p.id}">
    <div class="practice-banner">
      <span class="practice-badge">${p.badge}</span>
      <img src="${p.img}" alt="Ilustrasi ${p.name}" loading="lazy">
    </div>
    <div class="tool-body">
      <h4>${p.name}</h4>
      <p>${p.desc}</p>
      <div class="card-actions">
        <button class="btn btn-outline" data-practice="${p.id}">Lihat Detail →</button>
        ${bmBtnHTML('practice', p.id)}
      </div>
    </div>
  </article>`;
}

$('#gridTools').innerHTML = TOOLS.map(toolCard).join('');
$('#gridAcc').innerHTML = ACCESSORIES.map(accCard).join('');
$('#gridMeasure').innerHTML = MEASURE.map(measureCard).join('');
$('#gridPractice').innerHTML = PRACTICES.map(practiceCard).join('');

/* Praktik: gaya khusus banner */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .practice-banner { position: relative; background: var(--surface2); border-bottom: 1px solid var(--border); }
    .practice-banner img { height: 170px; width: 100%; object-fit: contain; padding: 12px; }
    .practice-badge {
      position: absolute; top: 10px; left: 10px; z-index: 2;
      font-family: var(--font-head); font-weight: 700; font-size: 0.72rem; letter-spacing: 1px;
      background: linear-gradient(135deg, var(--primary), var(--sky)); color: #fff;
      padding: 5px 12px; border-radius: 8px; box-shadow: var(--shadow-sm);
    }`;
  document.head.appendChild(style);
})();

/* ---------- 6. FILTER ---------- */
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const gridKey = btn.dataset.grid;
    $$('.filter-btn').filter(b => b.dataset.grid === gridKey).forEach(b => b.classList.toggle('active', b === btn));
    const map = { tools: '#gridTools', acc: '#gridAcc' };
    const grid = $(map[gridKey]);
    const f = btn.dataset.filter;
    $$('.card', grid).forEach(c => {
      c.style.display = (f === 'all' || (c.dataset.cat || '').split(' ').includes(f)) ? '' : 'none';
    });
  });
});

/* ---------- 7. BOOKMARK ---------- */
let bookmarks = LS.get('mi_bookmarks', []);
function findBmData(key) {
  const [type, id] = key.split(':');
  const pools = { tool: TOOLS, acc: ACCESSORIES, mea: MEASURE };
  if (type === 'practice') {
    const p = PRACTICES.find(x => x.id === id);
    return p && { title: p.name, sub: p.desc, section: 'praktik', cardId: 'card-practice-' + p.id, icon: '⚙️' };
  }
  const item = (pools[type] || []).find(x => x.id === id);
  if (!item) return null;
  const section = type === 'mea' ? 'alat-ukur' : (type === 'tool' ? 'cutting-tools' : 'aksesori');
  const icon = type === 'mea' ? '📏' : (type === 'tool' ? '🔩' : '🧰');
  return { title: item.name, sub: item.fungsi || item.gunakan || '', section, cardId: `card-${type}-${item.id}`, icon };
}
function updateBmUI() {
  $$('.bm-btn').forEach(b => b.classList.toggle('active', bookmarks.includes(b.dataset.bm)));
  const badge = $('#bmCount');
  badge.hidden = bookmarks.length === 0;
  badge.textContent = String(bookmarks.length);
  renderBmList();
}
function toggleBookmark(key) {
  const i = bookmarks.indexOf(key);
  if (i >= 0) { bookmarks.splice(i, 1); toast('Bookmark dihapus'); }
  else { bookmarks.push(key); toast('🔖 Disimpan ke bookmark'); }
  LS.set('mi_bookmarks', bookmarks);
  updateBmUI();
}
document.addEventListener('click', (ev) => {
  const bm = ev.target.closest('.bm-btn');
  if (bm) { ev.preventDefault(); toggleBookmark(bm.dataset.bm); }
});
function renderBmList() {
  const list = $('#bmList');
  list.innerHTML = bookmarks.map(key => {
    const d = findBmData(key);
    if (!d) return '';
    return `<div class="bm-item"><span>${d.icon}</span>
      <span style="flex:1"><b>${d.title}</b><small>${d.sub.slice(0, 80)}…</small></span>
      <button class="bm-go" data-bmgo="${key}">Buka →</button>
      <button class="bm-del" data-bmdel="${key}" title="Hapus bookmark">✕</button></div>`;
  }).join('');
}
$('#bmList').addEventListener('click', (ev) => {
  const go = ev.target.closest('[data-bmgo]');
  const del = ev.target.closest('[data-bmdel]');
  if (go) {
    const d = findBmData(go.dataset.bmgo);
    if (d) { goSection(d.section); setTimeout(() => flashCard(d.cardId), 80); }
  }
  if (del) toggleBookmark(del.dataset.bmdel);
});
$('#btnBookmark').addEventListener('click', () => { renderBmList(); openOverlay('bookmarkOverlay'); });

/* ---------- 8. OVERLAY ---------- */
function openOverlay(id) { $('#' + id).hidden = false; document.body.style.overflow = 'hidden'; }
function closeOverlays() {
  ['searchOverlay', 'bookmarkOverlay', 'practiceOverlay'].forEach(id => { $('#' + id).hidden = true; });
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') closeOverlays();
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') { ev.preventDefault(); openOverlay('searchOverlay'); $('#searchInput').focus(); }
});

/* ---------- 9. SEARCH ---------- */
function buildIndex() {
  const idx = [];
  // Kartu dari data
  TOOLS.forEach(t => idx.push({ icon: '🔩', title: t.name, text: t.fungsi + ' ' + t.gunakan, section: 'cutting-tools', cardId: 'card-tool-' + t.id }));
  ACCESSORIES.forEach(t => idx.push({ icon: '🧰', title: t.name, text: t.fungsi + ' ' + t.gunakan, section: 'aksesori', cardId: 'card-acc-' + t.id }));
  MEASURE.forEach(t => idx.push({ icon: '📏', title: t.name, text: t.gunakan, section: 'alat-ukur', cardId: 'card-mea-' + t.id }));
  PRACTICES.forEach(p => idx.push({ icon: '⚙️', title: p.badge + ' — ' + p.name, text: p.desc, section: 'praktik', practice: p.id }));
  // Konten statik per section
  $$('.section').forEach(sec => {
    const title = (sec.querySelector('.section-head h2') || {}).textContent || sec.dataset.title;
    const texts = $$('h3, h4, p, li', sec).map(el => el.textContent.replace(/\s+/g, ' ').trim());
    idx.push({ icon: '📘', title, text: texts.slice(0, 40).join(' · ').slice(0, 400), section: sec.id });
  });
  // Topik khusus
  idx.push({ icon: '🧮', title: 'Kalkulator Cutting Condition', text: 'kalkulator rpm feeding waktu potong rumus n = 1000 Cs / pi d', section: 'cutting-condition', scrollSel: '#kalkulator' });
  idx.push({ icon: '🖥️', title: 'Simulasi 3D Proses Frais', text: 'simulasi 3d face milling slot step pocket drilling animasi', section: 'materi', scrollSel: '#simulasi3d' });
  idx.push({ icon: '⚖️', title: 'Kompensasi K3 & 5R', text: 'kompensasi pelanggaran kunci spindle kacamata hp botol pet jam', section: 'k3', scrollSel: '#kompensasi' });
  idx.push({ icon: '👨‍🏫', title: 'Instruktur Praktik Frais Dasar', text: 'dedi kristanto aditya wahyu handoko instruktur', section: 'home', scrollSel: '#instruktur' });
  return idx;
}
const SEARCH_INDEX = buildIndex();
function doSearch(q) {
  const box = $('#searchResults');
  const term = q.trim().toLowerCase();
  if (term.length < 2) { box.innerHTML = ''; return; }
  const results = SEARCH_INDEX
    .map(item => {
      const hay = (item.title + ' ' + item.text).toLowerCase();
      const t = item.title.toLowerCase();
      let score = 0;
      if (t.includes(term)) score += 10;
      if (hay.includes(term)) score += 4;
      const words = term.split(/\s+/);
      if (words.length > 1 && words.every(w => hay.includes(w))) score += 6;
      return { item, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
  box.innerHTML = results.map(r => {
    const it = r.item;
    const snippet = it.text.replace(/\s+/g, ' ').slice(0, 110);
    return `<button class="sr-item" data-srsection="${it.section}" ${it.cardId ? `data-srcard="${it.cardId}"` : ''} ${it.practice ? `data-srpractice="${it.practice}"` : ''} ${it.scrollSel ? `data-srscroll="${it.scrollSel}"` : ''}>
      <span class="sr-icon">${it.icon}</span>
      <span style="min-width:0"><b>${it.title}</b><small>${snippet}…</small></span>
      <span class="sr-sec">${it.section}</span></button>`;
  }).join('');
}
$('#searchInput').addEventListener('input', (ev) => doSearch(ev.target.value));
$('#searchResults').addEventListener('click', (ev) => {
  const item = ev.target.closest('.sr-item');
  if (!item) return;
  closeOverlays();
  const card = item.dataset.srcard, practice = item.dataset.srpractice, scroll = item.dataset.srscroll;
  goSection(item.dataset.srsection, null);
  if (card) setTimeout(() => flashCard(card), 90);
  if (practice) setTimeout(() => openPractice(practice), 120);
  if (scroll) setTimeout(() => { const el = $(scroll); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 90);
});
$$('.tag').forEach(t => t.addEventListener('click', () => { $('#searchInput').value = t.dataset.q; doSearch(t.dataset.q); $('#searchInput').focus(); }));
$('#btnSearch').addEventListener('click', () => { openOverlay('searchOverlay'); setTimeout(() => $('#searchInput').focus(), 50); $('#searchResults').innerHTML = ''; });

function flashCard(cardId) {
  const el = $('#' + cardId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

/* ---------- 10. MODAL PRAKTIK ---------- */
function openPractice(id) {
  const p = PRACTICES.find(x => x.id === id);
  if (!p) return;
  const mpImg = $('#mpImg');
  mpImg.src = p.img;
  mpImg.alt = 'Ilustrasi ' + p.name;
  mpImg.hidden = false;
  $('#mpTitle').textContent = p.badge + ' — ' + p.name;
  $('#mpDesc').textContent = p.desc;
  $('#mpList').innerHTML = p.list.map(x => `<li>${x}</li>`).join('');
  $('#mpTools').innerHTML = p.tools.map(t => `<span class="chip">${t}</span>`).join('');
  $('#mpLink').href = 'https://drive.google.com/drive/folders/1pTV0YoAJTLylPHysYvsMADGvgcy0vACz?usp=sharing';
  openOverlay('practiceOverlay');
}
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-practice]');
  if (btn) openPractice(btn.dataset.practice);
});

/* ---------- 11. KALKULATOR CUTTING CONDITION ---------- */
function fmt(x, dec = 0) {
  if (!isFinite(x)) return '—';
  return x.toLocaleString('id-ID', { maximumFractionDigits: dec, minimumFractionDigits: dec });
}
function calcRpm() {
  const d = parseFloat($('#inRpmD').value.replace(',', '.'));
  const cs = parseFloat($('#inRpmCs').value.replace(',', '.'));
  const out = $('#outRpm');
  if (!(d > 0) || !(cs > 0)) { toast('Isi diameter (d) dan cutting speed (Cs) dengan angka yang benar'); out.textContent = '— rpm'; return; }
  const n = (1000 * cs) / (Math.PI * d);
  out.textContent = fmt(n) + ' rpm';
  out.classList.remove('pulse'); void out.offsetWidth; out.classList.add('pulse');
  $('#rpmNote').textContent = 'n = 1000 × ' + fmt(cs, 1) + ' / (π × ' + fmt(d, 1) + ') ≈ ' + fmt(n) + ' rpm. Nilai dibulatkan ke putaran mesin yang tersedia — pada contoh diktat (Cs 32, ∅20, HSS EMCR) tabel menghasilkan n = 500 rpm.';
}
function calcFeed() {
  const n = parseFloat($('#inFeedN').value.replace(',', '.'));
  const z = parseFloat($('#inFeedZ').value.replace(',', '.'));
  const sz = parseFloat($('#inFeedSz').value.replace(',', '.'));
  const oS = $('#outFeedS'), oSo = $('#outFeedSo');
  if (!(n > 0) || !(z > 0) || !(sz >= 0)) { toast('Lengkapi n, z, dan sz dengan angka yang benar'); return; }
  const s = z * n * sz, so = z * sz;
  oS.textContent = fmt(s, 1) + ' mm/menit';
  oSo.textContent = fmt(so, 3) + ' mm/rev';
  [oS, oSo].forEach(o => { o.classList.remove('pulse'); void o.offsetWidth; o.classList.add('pulse'); });
}
function calcTime() {
  const L = parseFloat($('#inTimeL').value.replace(',', '.'));
  const i = parseFloat($('#inTimeI').value.replace(',', '.'));
  const s = parseFloat($('#inTimeS').value.replace(',', '.'));
  const out = $('#outTh');
  if (!(L > 0) || !(i > 0) || !(s > 0)) { toast('Isi L, i, dan s dengan angka yang benar'); return; }
  const th = (L * i) / s;
  out.textContent = fmt(th, 2) + ' menit';
  out.classList.remove('pulse'); void out.offsetWidth; out.classList.add('pulse');
}
$('#btnRpm').addEventListener('click', calcRpm);
$('#btnRpmEx').addEventListener('click', () => {
  $('#inRpmD').value = '20'; $('#inRpmCs').value = '32';
  calcRpm(); toast('Contoh diktat: Cs 32 m/menit, ∅20 mm → tabel: n = 500 rpm, s = 56 mm/menit');
});
$('#btnFeed').addEventListener('click', calcFeed);
$('#btnTime').addEventListener('click', calcTime);
$$('.calc-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.calc-tab').forEach(t => t.classList.toggle('active', t === tab));
  $$('.calc-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab.dataset.calctab));
}));
['inRpmD', 'inRpmCs'].forEach(id => $('#' + id).addEventListener('keydown', e => { if (e.key === 'Enter') calcRpm(); }));
['inFeedN', 'inFeedZ', 'inFeedSz'].forEach(id => $('#' + id).addEventListener('keydown', e => { if (e.key === 'Enter') calcFeed(); }));
['inTimeL', 'inTimeI', 'inTimeS'].forEach(id => $('#' + id).addEventListener('keydown', e => { if (e.key === 'Enter') calcTime(); }));
calcRpm(); calcFeed(); calcTime();

/* ---------- 12. TIMELINE WORK PREPARATION ---------- */
let wpStep = 1;
function setWpStep(n) {
  wpStep = Math.max(1, Math.min(7, n));
  $$('.wp-node').forEach(node => {
    const s = parseInt(node.dataset.step, 10);
    node.classList.toggle('active', s === wpStep);
    node.classList.toggle('past', s < wpStep);
  });
}
$$('.wp-node').forEach(node => node.addEventListener('click', () => setWpStep(parseInt(node.dataset.step, 10))));
$('#wpPrev').addEventListener('click', () => setWpStep(wpStep - 1));
$('#wpNext').addEventListener('click', () => setWpStep(wpStep + 1));
setWpStep(1);

/* ---------- 13. PROGRESS BELAJAR ---------- */
let learned = LS.get('mi_learned', []);
function updateProgress() {
  const total = LEARNABLE.length;
  const done = LEARNABLE.filter(id => learned.includes(id)).length;
  const pct = Math.round((done / total) * 100);
  $('#progressPct').textContent = pct + '%';
  $('#progressCount').textContent = done + '/' + total;
  const ring = $('#progressRing');
  ring.style.strokeDashoffset = String(94.2 * (1 - done / total));
  $$('.btn-learned').forEach(b => {
    const isDone = learned.includes(b.dataset.learned);
    b.classList.toggle('done', isDone);
    b.textContent = isDone ? '✓ Sudah Dipelajari' : '✓ Sudah Dipelajari';
  });
}
$$('.btn-learned').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.learned;
    const i = learned.indexOf(id);
    if (i >= 0) { learned.splice(i, 1); toast('Materi ditandai belum selesai'); }
    else { learned.push(id); toast('📈 Mantap! Materi ditandai sudah dipelajari'); }
    LS.set('mi_learned', learned);
    updateProgress();
  });
});
updateProgress();

/* ---------- 14. CHECKLIST K3 ---------- */
const k3 = LS.get('mi_k3', false);
$('#k3Check').checked = k3;
function renderK3() {
  const c = $('#k3Check').checked;
  $('#k3CheckCard').classList.toggle('done', c);
  $('#k3Status').textContent = c
    ? '✅ Terima kasih! Status kamu tersimpan — tetap patuhi seluruh aturan K3 saat praktik.'
    : 'Centang untuk menyatakan kamu sudah memahami seluruh aturan K3 di atas.';
}
$('#k3Check').addEventListener('change', () => {
  LS.set('mi_k3', $('#k3Check').checked);
  renderK3();
  if ($('#k3Check').checked) toast('✅ Pemahaman K3 tersimpan');
});
renderK3();

/* ---------- 15. KUIS ---------- */
let qIdx = 0, qScore = 0, qAnswers = [];
const best = LS.get('mi_quizBest', null);
if (best !== null) $('#quizBest').textContent = best + '/20';

function quizStart() {
  qIdx = 0; qScore = 0; qAnswers = new Array(QUIZ.length).fill(null);
  $('#quizStart').hidden = true;
  $('#quizResult').hidden = true;
  $('#quizReview').hidden = true;
  $('#quizBox').hidden = false;
  $('#quizDots').innerHTML = QUIZ.map(() => '<i></i>').join('');
  quizRender();
}
function quizRender() {
  const q = QUIZ[qIdx];
  $('#quizCount').textContent = `Soal ${qIdx + 1}/${QUIZ.length}`;
  $('#quizProgressFill').style.width = ((qIdx) / QUIZ.length * 100) + '%';
  $('#quizQuestion').textContent = q.q;
  $('#quizOptions').innerHTML = q.o.map((opt, i) =>
    `<button class="quiz-opt" data-opt="${i}"><b>${String.fromCharCode(65 + i)}.</b><span>${opt}</span></button>`).join('');
  $('#quizFeedback').hidden = true;
  $('#btnQuizNext').hidden = true;
  $$('#quizDots i').forEach((d, i) => {
    d.className = qAnswers[i] === true ? 'ok' : (qAnswers[i] === false ? 'bad' : (i === qIdx ? 'cur' : ''));
  });
}
$('#quizOptions').addEventListener('click', (ev) => {
  const btn = ev.target.closest('.quiz-opt');
  if (!btn || btn.disabled) return;
  const pick = parseInt(btn.dataset.opt, 10);
  const q = QUIZ[qIdx];
  const correct = pick === q.a;
  qAnswers[qIdx] = correct;
  if (correct) qScore++;
  $$('.quiz-opt').forEach((o, i) => {
    o.disabled = true;
    if (i === q.a) o.classList.add('correct');
    else if (i === pick) o.classList.add('wrong');
  });
  const fb = $('#quizFeedback');
  fb.className = 'quiz-feedback ' + (correct ? 'ok' : 'bad');
  fb.innerHTML = (correct ? '✅ <b>Benar!</b> ' : '❌ <b>Belum tepat.</b> ') + q.e;
  fb.hidden = false;
  $('#btnQuizNext').hidden = false;
  $('#btnQuizNext').textContent = qIdx === QUIZ.length - 1 ? 'Lihat Hasil 🏁' : 'Lanjut →';
  $$('#quizDots i')[qIdx].className = correct ? 'ok' : 'bad';
  $('#quizProgressFill').style.width = ((qIdx + 1) / QUIZ.length * 100) + '%';
});
$('#btnQuizNext').addEventListener('click', () => {
  if (qIdx < QUIZ.length - 1) { qIdx++; quizRender(); window.scrollTo({ top: $('#evaluasi').offsetTop - 40, behavior: 'smooth' }); }
  else quizFinish();
});
function quizFinish() {
  $('#quizBox').hidden = true;
  $('#quizResult').hidden = false;
  const nilai = qScore * 5;
  $('#quizScore').textContent = `${qScore} / ${QUIZ.length} — Nilai ${nilai}`;
  let msg, emoji;
  if (nilai >= 90) { msg = 'Luar biasa! Kamu siap mengikuti praktik frais dasar. 🎉'; emoji = '🏆'; }
  else if (nilai >= 70) { msg = 'Bagus! Nilai di atas ambang 70. Pelajari lagi bagian yang salah ya.'; emoji = '🎉'; }
  else if (nilai >= 50) { msg = 'Lumayan — ulangi materi yang belum dikuasai, lalu coba lagi.'; emoji = '💪'; }
  else { msg = 'Jangan menyerah! Baca ulang materi di halaman MATERI dan ATURAN SECTION, lalu ulangi kuisnya.'; emoji = '📚'; }
  $('#quizMsg').textContent = msg;
  $('#quizResultEmoji').textContent = emoji;
  const prevBest = LS.get('mi_quizBest', 0);
  if (qScore > prevBest) { LS.set('mi_quizBest', qScore); $('#quizBest').textContent = qScore + '/20'; }
}
$('#btnQuizStart').addEventListener('click', quizStart);
$('#btnQuizRestart').addEventListener('click', quizStart);
$('#btnQuizReview').addEventListener('click', () => {
  const rv = $('#quizReview');
  rv.innerHTML = QUIZ.map((q, i) => `<div class="qr-item"><b>${i + 1}. ${q.q}</b><br>Jawaban: <b>${String.fromCharCode(65 + q.a)}. ${q.o[q.a]}</b><br><small>${q.e}</small></div>`).join('');
  rv.hidden = !rv.hidden;
});

/* ---------- 16. FOTO INSTRUKTUR: placeholder SVG + auto-upgrade ke foto asli ----------
   Default memakai placeholder SVG (src). Bila foto asli (.jpg, lihat data-probe)
   tersedia di folder yang sama, foto itu otomatis dipakai menggantikan placeholder. */
$$('img[data-probe]').forEach(img => {
  const probe = new Image();
  probe.onload = () => { img.src = probe.src; };
  probe.src = img.dataset.probe;
});
/* Kompatibilitas: img dengan data-fallback tetap ditukar ke fallback saat src gagal */
$$('img[data-fallback]').forEach(img => {
  const swap = () => { if (img.dataset.swapped) return; img.dataset.swapped = '1'; img.src = img.dataset.fallback; };
  if (img.complete && img.naturalWidth === 0) swap();
  else {
    img.addEventListener('error', swap);
    setTimeout(() => { if (img.naturalWidth === 0) swap(); }, 1200);
  }
});

/* ---------- 17. INIT ---------- */
(function init() {
  const hash = location.hash.replace('#', '');
  goSection(SECTION_IDS.includes(hash) ? hash : 'home');
  updateBmUI();
})();
