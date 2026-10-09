# Content review: Joglo Pencu (Kudus)

Status of every name and claim in `src/houses/joglo-pencu/`, checked against sources on 9 October 2026, when the house was first modelled.
This is an internal working file; the site shows none of it.

**How to read it**

| Mark | Meaning |
|---|---|
| ✅ | Supported by the source(s) given |
| ⚠️ | Partly supported, sources disagree, or only weak sources so far: keep, but reword or confirm |
| ❌ | Contradicted by a source: must be fixed |
| ❔ | Not checked yet / no source found |
| 💭 | Our own interpretation or modelling choice (not from a source) |
| 📐 | A dimension or count of this model, not a claim about real houses |

Source keys (K1, K2…) refer to the list at the bottom.

---

## 1. Fixes needed

None found so far. The open questions are in section 4.

## 2. Model basis

The plot follows the general layout in K1: the main building on the north side of the plot facing south, made up of jogosatru, dalem and a pawon beside it, with the yard to the south and, across it, a pekiwan (well and bathing rooms) and sometimes a sisir. The details mostly come from K1's three case-study houses (Museum Kretek, Pak Safi'i in Kauman, Pak Kahfi in Langgar Dalem).

No published measured drawings were found, so **all dimensions are our own estimates** 📐 (house 12.6 × 11.4 m, ridge +11.4 m, floors +0.45 / +0.70 / +1.15 / +1.35 m, plot 25 × 28 m). The About text says this.

## 3. Claims by place

### Site (`index.js`) and About

| Claim | Status | Source / note |
|---|---|---|
| Kudus house is a joglo with a taller, more pointed central roof, called omah pencu | ✅ | K1, K2 |
| Pencu = "muncak, mucuk, menjulang tinggi" | ✅ | K2 |
| Pencu is also the raised boss of a gong | ⚠️ | K4, citing KBBI. Reasonable but only one weak source |
| Most surviving houses in Kudus Kulon around the Menara mosque | ✅ | K2 (inventory: 58 of 63 in Kudus Kulon in 2007; author's 2012 survey of 55) |
| Built by Muslim merchant families (pedagang santri) | ✅ | K1 (Geertz, Castles); K2 links types A–B to merchants/nobility |
| Main building faces south, back to Mount Muria | ✅ | K1 |
| Main building on the north side of the plot; yard on the south side | ✅ | K1 |
| Jogosatru receives guests | ✅ | K1, K3 |
| Dalem for the family; gedongan for the parents' sleep and valuables | ✅ | K1 |
| Pawon beside the dalem; used for the family's "active" life | ✅ | K1 |
| Some houses have a pawon on each side | ✅ | K1 (Pak Kahfi's house) |
| Pekiwan (well + bathing rooms) across the yard in front of the pawon | ✅ | K1 (Museum Kretek and Safi'i houses) |
| Sisir across the yard, for work and storage; not every house | ✅ | K1 ("kadangkala") |
| Sisir sometimes a place of business | ⚠️ | K5 (IJBESR abstract, via search summary only) |
| Pekiwan and sisir have kampung roofs | ✅ | K1 |
| Yard set by orientation rather than by the lane | ⚠️ | K5 (search summary only) |
| Carving mostly plant and geometric; animals rare and stylised | ✅ | K1 |
| Many houses sold and dismantled for their gebyok; local gebyok industry | ✅ | K1 (Wikantari 2001: industry from 1960, boom 1986) |
| Unlike the Yogyakarta joglo, the well faces the house across the yard | ✅ | Comparison with our own Joglo model; K1 for Kudus |
| Walk: plots walled and reached from narrow lanes, side gate | ⚠️ | K1 (Pak Kahfi: low wall, two side gates to the lanes; Safi'i: row of houses on one long plot). "Narrow lanes" is our summary of K1/K2 |
| The `interp` flag on the sisir's meaning ("kept trade close to home") | 💭 | Labelled Interpretation |

### Omah (`omah.js`, `omah-parts.js`)

| Part | Claim | Status | Source / note |
|---|---|---|---|
| Bebatur | "Berbancik dhuwur": high, stepped floor | ✅ | K3 |
| Bebatur | Five floor levels from yard to gedongan | ⚠️ | K4 (five levels, linked to the five pillars of Islam). Order halaman → tritisan → jogosatru → dalem → gedongan from K5 summary. The text says "some accounts" |
| Umpak | Soko guru decorated only at the umpak and a flower-like top; tall umpak | ✅ | K1 (Museum Kretek, Safi'i) |
| Geladakan | Dalem floor of timber on a low panggung | ✅ | K1 |
| Geladakan | Often rotted and replaced by tiles at jogosatru level; gedongan often lost with it | ✅ | K1 (Pak Kahfi) |
| Soko guru | Four soko guru carry the rong-rongan / pencu | ✅ | K1, K3 |
| Saka pengapit | Each gebyok unit between two columns; heavier pair at the dalem door | ✅ | K1 |
| Saka pengapit | Carved columns as structural decoration | ✅ | K3 ("hiasan konstruktif ... tiang-tiang pengapit") |
| Tiang tunggal | Single post at the front left of the dalem door, propping the end of the konsol | ✅ | K1 |
| Tiang tunggal | "Breaks the symmetry on purpose" | 💭 | Marked `interp` |
| Blandar | Beam over the dalem door part of the display for guests | ✅ | K1 (gebyok, door, konsol, blandar tumpang and soko tunggal, citing Sardjono 1996) |
| Konsol | Carries the tritisan; plain or elephant-head (gajahan) | ✅ | K1 |
| Konsol | A mark of north-coast houses | ✅ | K3 citing Ismunandar (1987): "atap pencu, bekuk lulang dan konsolnya" |
| Rong-rongan | Name; carved almost all over except the soko guru | ✅ | K1 |
| Rong-rongan | In Kudus the luweng has more courses than the tumpang sari; the reverse in the south | ✅ | K1 |
| Rong-rongan | 3 courses out, 7 in | 📐 | Our counts. K4 has a figure titled "Pangeret Tumpang Songo" (nine), not checked |
| Gebyok jogosatru | Standard pattern: two rows of panels, three bands, upper row carved | ✅ | K1 |
| Gebyok jogosatru | Five panels per row (pawon four) | ⚠️ | K1, from one house (Safi'i). The Museum Kretek house has four per row |
| Gebyok jogosatru | Kupu tarung door with a sliding gebyok each side and a kere outside; the doubled side openings are Kudus-specific | ✅ | K1 |
| Gebyok jogosatru | Jenggeran over the main door | ✅ | K1 (Safi'i) |
| Gebyok jogosatru | Outer face carved, inner face plain | ✅ | K1 (Museum Kretek: only the inner side of the front wall is undecorated) |
| Kere | ≈150 cm, hung from the beam; bands at top, middle and bottom with vertical bars | ✅ | K1 |
| Kere | Motifs patran, lung-lungan, swastika | ✅ | K1; K3 also lists sampar banyu and naga |
| Kere | Swastika "older than Islam in Java" | ✅ | K3 calls it Hindu |
| Tembok | Most houses timber front, masonry sides and back; grandest all timber | ✅ | K2 table 2 (types A have timber all round) |
| Tembok | Side door to the pawon | 💭 | Not sourced; added so the pawon connects |
| Gebyok dalem | Four units and main door; finer than the front; bancik step | ✅ | K1 |
| Gebyok dalem | Gold paper behind openwork | ✅ | K1 ("diukir embus ... alas kertas emas") |
| Gebyok dalem | Guests face it | ⚠️ | Our reading of K1's description of the jogosatru as the display room |
| Gebyok dalem | Most often sold and reused | ✅ | K1 |
| Gedongan | Behind the rong-rongan | ⚠️ | K1. K4 says the centre of the pencu is the top of the gedongan, which would put it under the pencu. We follow K1 |
| Gedongan | Sliding kupu tarung door, one gebyok unit each side, large openwork jenggeran | ✅ | K1 (Museum Kretek) |
| Gedongan | Bridal chamber on the wedding night | ⚠️ | K1, reported as "konon" (it is said) |
| Gedongan | Most sacred and most decorated room | ✅ | K1 |
| Gedongan | The bed inside | 💭 | Illustrates the sourced function |
| Atap pencu | Taller and more pointed than most joglo; walls look short, high floor compensates | ✅ | K1 |
| Atap pencu | ≈61° pitch, ridge +11.4 m | 📐 | |
| Atap penanggap | The name "penanggap" for this tier | ❔ | Yogyakarta joglo term; Kudus names for the roof tiers not found. K1 says the pencu has "more tiers" than ordinary joglo; we model pencu + one tier + tritisan |
| Tritisan | Eaves front and back | ⚠️ | K4 ("tritisan bagian depan dan belakang"); K1 for the front konsol |
| Tritisan | Also the name of the porch | ✅ | K2 (the front wall divides "ruang tritisan" from the jogosatru) |
| Gendheng | Gunungan in the middle of the ridge between wayang or gajah tiles; kodok along the hips ending in wayang | ✅ | K1 (Museum Kretek) |
| Gendheng | Sometimes set with porcelain fragments | ✅ | K1, K3 (blue "mangkuk cina", citing Sudarwanto 2013) |
| Gendheng | Meaning: seek the protection of God | ⚠️ | K4 only; text says "one reading" |
| Usuk | Knock-down timber frame | ✅ | K2 (RP 21 moved and re-erected knock-down for a museum); K4 |

### Pawon (`pawon.js`)

| Claim | Status | Source / note |
|---|---|---|
| Kampung roof with a sosoran in front ("Kampung Gajah Ngombe") | ✅ | K1 |
| Steep pitch echoing the pencu | ✅ | K1 |
| Front in the same gebyok pattern, four panels per row | ✅ | K1 (Safi'i) |
| Single door split into upper and lower leaves | ✅ | K1 (Safi'i); Museum Kretek has a kupu tarung door instead |
| "Upper leaf open for light" (function) | 💭 | Marked `interp` |
| Plinth lower than the omah | 💭 | Marked `interp` |
| Stove and water jar | 💭 | Generic kitchen; K1 only says "dapur" |

### Pekiwan, sisir, pagar (`pekiwan.js`, `sisir.js`, `pagar.js`)

| Claim | Status | Source / note |
|---|---|---|
| Well and two roofed bathing rooms | ✅ | K1 (Museum Kretek, Safi'i) |
| Masonry walls of the bathing rooms | ❔ | Not described |
| Sisir building form (timber, double doors) and contents | 💭 | Only its use is sourced; contents labelled "Illustrative" |
| Pagar kilungan: some pencu houses have one, not all | ✅ | K2 table 2 |
| Meaning of "kilungan" | ❔ | Appears in K2 and in the title of Anisa (2003), "susunan bangunan di dalam kilungan"; probably the walled enclosure of a plot or group of houses. Check |
| Side gate | ✅ | K1 (Pak Kahfi); marked `interp` for the general claim |

### Frame members added after expert feedback (10 October 2026)

| Part | Claim | Status | Source / note |
|---|---|---|---|
| Sunduk & kili | Through-beams in the soko guru, locked with wedges | ⚠️ | General Javanese joglo joinery (see the Joglo review). Not described in K1–K4; marked `interp` |
| Santen | Posts joining the cross sunduk to the pengeret | ⚠️ | K6, for Javanese houses generally |
| Pengeret | Cross beams on the soko guru, and two short ones carrying the ander | ⚠️ | K6 for the ander on a pengeret; Kudus placement not described |
| Ander | Two posts holding up the molo of the pencu | ⚠️ | K6 (ander in every Javanese roof type); placement is our reconstruction, marked `interp` |

## 4. Open questions

1. Kudus names for the roof tiers (we use the Yogyakarta "penanggap").
2. Whether the gedongan lies under the pencu (K4) or behind the rong-rongan (K1).
3. Real dimensions: look for measured drawings in Triyanto (1992) or Sardjono (1996), or the Museum Kretek house.
4. Meaning of "kilungan".
5. Whether Kudus houses use sunduk, santen and ander as in the Yogyakarta joglo, and where the ander stands.
6. The UB student journal articles (Farid & Antariksa on the symmetry of the joglo pencu interior) and the Petra article on interior layout were blocked by Cloudflare; they may have plans and dimensions.

## 5. Sources

### A. Checked for this review

- **K1.** Iswanto, D., & Sardjono, A. B. (2013). Ornamentasi rumah tradisional Kudus: perkembangan dan penerapannya. *MODUL* 13(2), 77–88. Universitas Diponegoro. <https://ejournal.undip.ac.id/index.php/modul/article/view/5380>. Full text read. Main source for layout and details.
- **K2.** Nazaruddin, I. (2012). Rumah Pencu di Kudus: kajian berdasarkan tipologi dan pola sebaran. *Berkala Arkeologi* 32(1), 51–64. <https://ejournal.brin.go.id/berkalaarkeologi/article/view/4581>. Full text read.
- **K3.** Rofian (2015). Pemanfaatan unsur-unsur arsitektur rumah tradisional sebagai upaya menegaskan identitas pada bangunan modern di Kudus. *Catharsis* 4(1), 58–65. Universitas Negeri Semarang. <https://journal.unnes.ac.id/sju/catharsis/article/view/6829>. Full text read.
- **K4.** *Rumah Adat Kudus Joglo Pencu: sejarah makna-makna keislaman dalam arsitektur rumah adat Kudus joglo pencu*. Undergraduate thesis (skripsi), UIN Sunan Kalijaga. <https://digilib.uin-suka.ac.id/id/eprint/48095/>. Chapters I and IV–V only. Weak source: also makes historical claims (built from 1500 CE, Kiai Telingsing) that we do not repeat.
- **K5.** Search-engine summaries of: Universitas Brawijaya student journal (JMA) articles on the joglo pencu; Petra Christian University, *Tata ruang dalam rumah adat Kudus*; Kudus traditional house article in *IJBESR* (UMJ); Good News from Indonesia (2025). Not read in full.
- **K6.** Dinas Kebudayaan DIY. *Mengenal Bangunan Berarsitektur Tradisional Jawa: Ander, Geganja dan Santen*. <https://budaya.jogjaprov.go.id/artikel/detail/Mengenal-Bangunan-Berarsitektur-Tradisional-Jawa-Ander-Geganja-dan-Santen>. Read via a page summary. About Javanese (Yogyakarta) houses in general.

### B. To check (not online, or not reachable)

- Prijotomo, J. (2006). *(Re-)Konstruksi Arsitektur Jawa: Griya Jawa dalam Tradisi Tanpatulisan*. Surabaya: Wastu Lanas Grafika.
- Triyanto (1992). *Makna Ruang dan Penataannya dalam Arsitektur Rumah Kudus*. Thesis, Universitas Indonesia.
- Sardjono, A. B. (1996). *Rumah-rumah di Kota Lama Kudus*. Thesis, Universitas Gadjah Mada.
- Wikantari, R. R. (2001). *Sustainability of Historic Environment of Wooden Traditional Houses in the City of Java*. Dissertation, Kobe University.
- Anisa (2003). *Rumah di dalam lingkungan di kota lama Kudus: analisis tentang konsep dan susunan bangunan di dalam kilungan*. Thesis, Universitas Gadjah Mada.
- Ismunandar, R. (1987). *Joglo: Arsitektur Rumah Tradisional Jawa*. Semarang: Dahara Prize.
