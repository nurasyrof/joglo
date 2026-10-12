# Content review: Honai (Baliem Valley)

Status of every name and claim in `src/houses/honai/`, checked against sources on 12 October 2026, when the house was first modelled.
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

Source keys (H1, H2…) refer to the list at the bottom.

---

## 1. Fixes needed

None found so far. The weakest parts are the construction of the round house (section 3, "Round house") and the insides of the kitchen and sty, which rest on unreferenced web text or on nothing. Heider (1970) should settle most of them: see section 4.

## 2. Model basis

The compound follows H1's description of a silimo at Kampung Kumugima: a long open yard, nearly rectangular with slightly pointed ends; the men's house at one narrow end with its door in line with the gate; women's houses, kitchen and pig sty along the two sides; two rings of fence. H2 gives the same four building types and the garden between the fences.

H1 gives two measurements: the pilamo is 3.6–4.0 m across and the ebe-ai about 3.5 m. We use 4.0 m and 3.5 m. **Every other dimension is our own estimate** 📐: wall 1.45 m, sleeping floor +1.3 m, dome top +3.0 m (pilamo) and +2.75 m (ebe-ai), door 0.6 × 0.95 m, kitchen 9 × 3 m, sty 5 × 2.4 m, yard 14 × 24 m, fences 1.25 m and 1.4 m. The About text says this. H1's own site plan and section drawing (its figures 5 and 6) are images we could not read; they would give real proportions.

Two simplifications to know about:

- H2 says the buildings are *linked together by fences*, so the house walls are part of the enclosure. In the model the buildings stand just inside a continuous inner fence. 💭
- H1 describes three silimo inside one outer fence at Kumugima, each with its own gate. We model one silimo with its own outer fence. 💭

## 3. Claims by place

### Names

| Name | Used for | Status | Source / note |
|---|---|---|---|
| Honai | The house type; title of the page | ✅ | H1 uses "honai laki-laki (Pilamo)" and "honai perempuan (ebe-ai)", so honai is the general word and pilamo / ebe-ai the specific ones |
| Silimo | The compound | ✅ | H1, H3 |
| Pilamo | Men's house | ✅ | H1, H3. Heider's Dugum term is *bilai* (H4) |
| Ebe-ai | Women's house | ✅ | H1 spelling. H3 has "ebai / ewe ai", Heider "ebeai" |
| Hunila | Kitchen | ✅ | H1, H3 (H3 also "lesema"). Heider: *hunu* (H4) |
| Wamdabu | Pig sty | ✅ | H1, H3 (H3 also "wamai", which we give as the alias) |
| Leget | Inner fence | ✅ | H1: "pagar bagian dalam disebut leget" |
| Gapura | Gate | ⚠️ | H1 uses the Indonesian "gapura / gerbang". No Hubula name found |
| Mulele | Lashings | ✅ | H1: "tali pengikat (mulele)" in large, medium and small sizes |
| Wareke | Alang-alang grass | ✅ | H1: "alang-alang atau wareke" |
| Hubula | The people | ✅ | H1 uses Hubula throughout for the people of the Baliem Valley. The registry says "Dani", the name most readers know; the About text gives both |
| Tungku, tiang tengah, lantai atas | Hearth, posts, upper floor | ⚠️ | Indonesian descriptions, used because the local names found are weak: hearth is "hipere" in H3 (but hipere is the usual word for sweet potato) and "wulikin" in a search summary; posts "heseke", floors "agarawa / henaepu" from H5 only. Not used on the site |
| Name origins (ai = house, wam = pig…) | Not used | ⚠️ | H3 cites a blog. Left out |

### Site (`index.js`) and About

| Claim | Status | Source / note |
|---|---|---|
| A honai is one building of a silimo, home of an extended family | ✅ | H1, H2 |
| Four building types: pilamo, ebe-ai, hunila, wamdabu | ✅ | H1, H2 |
| Round buildings (pilamo, ebe-ai), rectangular ones (kitchen, sty) | ✅ | H1, H2 |
| Pilamo at the narrow head of the yard, door in line with the gate, to watch it | ✅ | H1 |
| Ebe-ai, kitchen and sty to left and right | ✅ | H1. Which goes on which side is our choice 💭 |
| One ebe-ai for each wife and her children; the husband visits | ✅ | H1 |
| Three ebe-ai | 📐 | H2: one in a basic compound, up to half a dozen more in the largest |
| Men, women and children sleep in separate buildings | ✅ | H1 |
| "Men and older boys" sleep in the pilamo | ⚠️ | H1 says only that men live apart from women and children. The boys are from general ethnography (Heider), not re-read |
| Sacred objects kept in a pilamo adat; women and strangers restricted | ✅ | H1 |
| Kitchen and yard are the shared spaces where men and women meet | ✅ | H1 ("ruang publik, seperti dapur, pekarangan untuk ritual upacara") |
| Two fences as a sign of territory and a defence; one guarded gate | ✅ | H1 |
| Layout shaped by warfare between clans, no longer permitted | ✅ | H1 |
| Garden between the inner and outer fences, with bananas | ⚠️ | H2 (gardens behind the houses, inside the outer fence); bananas from H4, search summary only |
| Main sweet-potato gardens outside; gardens are women's work; silimo sited near them | ✅ | H1 |
| Valley floor about 1,600 m above the sea, cold nights | ⚠️ | General reference fact (Wamena ≈ 1,650 m); no source in our list. H1 for the cold |
| Today some honai have windows, nails or zinc roofs | ⚠️ | H3, citing Trifena (2018), a children's reader. Basis for the zinc preset |
| Pigs let out by day, shut in at night | ⚠️ | General ethnography (Heider), not re-read |
| Pigs are the family's most valuable possession; given at weddings and funerals, settle debts | ⚠️ | General ethnography (Heider), not re-read |
| Overlay: straight line of sight from gate to pilamo door | ✅ | H1 |

### Round house (`round.js`)

| Part | Claim | Status | Source / note |
|---|---|---|---|
| Lantai | Earth floor covered with fine alang-alang in place of a mat | ✅ | H1 |
| Lantai | Coarse grass on the roof, fine on the floor | ✅ | H1 |
| Dinding | Planks split with an axe; no windows; small door | ✅ | H1 |
| Dinding | Planks set upright in a circular trench and tied with rattan | ⚠️ | H3, in a section flagged "needs citation" there |
| Dinding | A single ring of planks | 💭 | Heider is remembered as describing a double wall with grass between; not checked |
| Dinding | Nobody outside can see or hear | ✅ | H1 (privacy, citing Rapoport) |
| Dinding | Sill board across the door | 💭 | |
| Mulele | Three sizes of tie, chosen by what they hold | ✅ | H1 |
| Mulele | Three bands round the wall | 📐 | |
| Mulele | "No nails" | ⚠️ | H3 (Trifena 2018): originally none, some houses now use them |
| Tungku | In the middle of the ground floor; lit in the late afternoon; warm air rises to the upper floor | ✅ | H1 |
| Tungku | Many sleepers warm the pilamo; in the ebe-ai the fire is lit at certain times | ✅ | H1 |
| Tiang | Four main posts in a square about 1 m apart | ⚠️ | H5 (search summary). H3 describes a single central post on a flat stone. We follow H5 |
| Tiang | They carry the upper floor and the top of the roof | 💭 | Our structural reading; flat stones under the posts borrowed from H3 |
| Tiang | Meaning: the fire sits inside the square | 💭 | Marked `interp` |
| Lantai atas | People sleep on the upper floor | ✅ | H1 ("lantai dua yang merupakan tempat orang tidur"). H3 (Utami 2021) says the opposite: lower floor for sleeping, upper for daily activities. We follow H1, which is field research |
| Lantai atas | Roof covers the sides of the upper floor and traps the heat | ✅ | H1 |
| Lantai atas | Cane deck (lokop / pinde) with grass on top | ⚠️ | H3, unreferenced section |
| Lantai atas | Opening just inside the door | 💭 | The upper floor has to be reached somehow; position is ours |
| Lantai atas | House sized to the people who sleep in it; pilamo wider | ✅ | H1 |
| Rangka atap | Poles tied to post and wall "like an umbrella" | ⚠️ | H3, unreferenced section |
| Rangka atap | Cane hoops | 💭 | |
| Rangka atap | Built by relatives together, ending in a shared meal | ⚠️ | H3, citing indonesia.go.id |
| Atap | Coarse alang-alang; reaches down over the wall to seal it | ✅ | H1 |
| Atap | Tied tuft at the top, shaggy fringe | 💭 | From photographs in general |
| Atap | Dome shape and heights | 📐 | H3 gives 5–7 m high (Utami 2021), which cannot be right for a house 4 m across; ignored |

### Kitchen and sty (`long.js`)

| Claim | Status | Source / note |
|---|---|---|
| Rectangular, plank walls, grass roof | ✅ | H1, H2 |
| Hipped roof, low doors on the yard side | 💭 | Shape not described in what we read |
| No upper floor | ❔ | Assumed |
| Row of cooking fires along the kitchen | ⚠️ | General ethnography (Heider), not re-read. Three fires 📐 |
| Sweet potatoes cooked for people and pigs | ⚠️ | General ethnography, not re-read |
| Ridge posts | 💭 | Marked `interp` |
| Sty divided into stalls off a passage | ⚠️ | General ethnography (Heider), not re-read. Four stalls 📐 |
| Grass bedding in the sty | 💭 | Marked `interp` |
| "Round for sleeping, rectangular for work" | 💭 | Our summary of H1; marked `interp` |

### Fences, gate, yard (`yard.js`)

| Claim | Status | Source / note |
|---|---|---|
| Rough split timber for fences | ✅ | H1 |
| Leget = sign that the ground is owned | ✅ | H1 ("tanda penguasaan suatu wilayah") |
| Fence keeps the pigs in | ⚠️ | Search summary of a secondary source; plausible |
| Single gate, watched by the men | ✅ | H1 |
| Gate form: two posts, lintel, board to step over | 💭 | H1's photograph (its figure 2) not readable |
| Yard used for ceremonies | ✅ | H1 |
| Banana plants | ⚠️ | See above |

## 4. Open questions

1. Read the settlement and house-building sections of Heider (1970). The PDF is public (H4) but too large for the tool used here. It should confirm or correct: number of centre posts, single or double wall, how the loft is reached, the kitchen's hearths, the sty's stalls, the gate, and real dimensions.
2. Which is right for the floors: H1 (sleep upstairs) or Utami 2021 (sleep downstairs)? We follow H1.
3. Hubula names for the hearth, the posts, the two floors and the gate.
4. Whether to model the buildings as part of the fence line (H2) instead of inside it.
5. Salipu's dissertation (2020) and Salipu & Zebua (2021) have the measured section of a pilamo; not reachable.
6. The registry says "Dani / Papua Pegunungan". H1's people call themselves Hubula; consider showing both.

## 5. Sources

### A. Checked for this review

- **H1.** Salipu, M. A., & Santoso, I. (2023). Penerapan konsep keamanan & kenyamanan dalam permukiman tradisional silimo di Lembah Baliem. *Border: Jurnal Arsitektur* 5(2), 27–41. <https://border.upnjatim.ac.id/index.php/border/article/view/102-117>. Full text read (figures not). Main source.
- **H2.** Heider, K. G. Dani: Settlements. In *Encyclopedia of World Cultures*, vol. II: Oceania. <https://www.everyculture.com/Oceania/Dani-Settlements.html>. Read via a page summary.
- **H3.** Rumah Honai. *Wikipedia bahasa Indonesia*. <https://id.wikipedia.org/wiki/Rumah_Honai>. Read via a page summary. Used for what it cites (Utami 2021; Trifena 2018; indonesia.go.id); its materials and construction sections are unreferenced.
- **H4.** Heider, K. G. (1970). *The Dugum Dani: A Papuan Culture in the Highlands of West New Guinea*. Chicago: Aldine. <https://papuaheritage.org/sites/default/files/collectie/files/2003-12/Heider_1970_Dugum.pdf>. **Not read**: search-engine summaries only (compound plan labels, banana yard).
- **H5.** Search-engine summaries of Kompas.com (2021), "Honai, Rumah Adat Provinsi Papua", and of indonesia.travel's honai page. Not read in full.

### B. To check (not online, or not reachable)

- Heider, K. G. (1970), in full (H4).
- Heider, K. G. (1997). *Grand Valley Dani: Peaceful Warriors* (3rd ed.). Fort Worth: Harcourt Brace.
- Salipu, M. A. (2020). *Permukiman Silimo sebagai simbol perwujudan sistem keamanan dan kenyamanan suku Hubula di Lembah Baliem*. Dissertation, Universitas Cenderawasih.
- Salipu, M. A., & Zebua, M. T. (2021). Simbol keamanan dalam permukiman suku Hubula di Lembah Baliem, Papua. *Jurnal MEDIAN Arsitektur dan Planologi* 11(2), 1–9.
- Salipu, M. A., et al. (2022). Study of theory based on security at silimo settlement in the Baliem Valley of Papua. *Local Wisdom* 14(2), 131–147.
- Utami, R. (2021). *Ensiklopedia Rumah-Rumah Adat Nusantara*. Bandung: Angkasa.
- Trifena, F. (2018). *Rumah Bundar*. Jakarta: Badan Pengembangan dan Pembinaan Bahasa.
- Tabuni, P. (2023). *Identifikasi Morfologi Rumah Tradisional Honai: studi kasus rumah honai Distrik Gome, Kabupaten Puncak*. Thesis, Universitas Atma Jaya Yogyakarta. (Lani houses, not Hubula.)
