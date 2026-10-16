# Content review: Rumah Krong Bade (Rumoh Aceh)

Status of every name and claim in `src/houses/krong-bade/`, checked against sources on 16 October 2026, when the house was first modelled.
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

Source keys (A1, A2…) refer to the list at the bottom.

---

## 1. Fixes needed

None found so far. Two things to settle:

- **The name.** "Krong Bade" is how the house is known nationally (and the registry name), but *krong padé* is the rice granary (A3). The site says the popular name "seems to come from" the granary and calls the house rumoh Aceh throughout. That link is our inference, marked `interp`.
- **Where the king and queen posts stand.** See section 2.

## 2. Model basis

From A1: posts in **four rows** (front, middle front, middle back, back), **2.5 m apart**; 16, 18, 22 or 24 posts, at most 40; door 1.8 × 0.8 m in the front gallery with the stair; windows 1 × 0.6 m in the front gallery, back gallery and *juree*; floor four to nine *hasta* above the ground; three, five, seven or ten *ruang*. From A3: the middle part is half a metre higher than the galleries.

We model **five ruang × three bays = 24 posts** (6 per row), 12.5 × 7.5 m on the post lines, 12.9 × 7.9 m overall. The three parts run front to back across the depth (front gallery / raised middle / back gallery), one bay each. 📐

Our own estimates 📐: floor +2.5 m (A2 search summary gives 2.5–3 m; A1's four to nine hasta is about 1.8–4 m); walls 2 m; ridge +8.7 m; roof pitch about 41°; the middle two rows of posts rise 1 m above the wall plate; the bedrooms 5 m long each with a 2.5 m passage between.

**King and queen posts.** A1 puts the tameh raja on the north side and the tameh putroe on the south, the two together marking the boundary between bedroom and galleries; A3 (Wikipedia, after Waterson) puts both "between the middle and front sections". We read A1 as: one on the line between the front gallery and the middle (north), one on the line between the middle and the back gallery (south), both at the west edge of the passage beside the jurei. 💭 The red cloth bands on them are illustrative 💭.

**Bedrooms.** A3 says the east bedroom is the *anjong* (daughter) and the west the *jurei* (main bedroom); A1 and A2 call the parents' room *rumoh inong* and the daughter's *anjong*. We follow A3 for the positions.

**The yard** — fence, gateway, trees, granary — is put together from A3's short description; its layout and sizes are ours 💭.

## 3. Claims by place

### Names

| Name | Used for | Status | Source / note |
|---|---|---|---|
| Rumoh Aceh | The house | ✅ | A1–A3 |
| Krong padé | Rice granary | ✅ | A3 (Snouck Hurgronje; Rizky & Wibisono) |
| Seuramoe keue / reunyeun | Front gallery | ✅ | A1, A2 ("seuramoe rinyeuen", "reunyeun") |
| Seuramoe teungoh, rumoh inong, tungai | Middle part | ✅ | A1, A2 |
| Rambat | Passage | ✅ | A2, A3 |
| Jurei / juree, anjong | Bedrooms | ✅ | A1, A3 |
| Seuramoe likot | Back gallery | ✅ | A1–A3 |
| Yup moh | Under the house | ✅ | A2 ("yup moh / miyup moh") |
| Rumoh dapu | Kitchen house | ✅ | A3, A2 |
| Tameh, tameh raja, tameh putroe | Posts | ✅ | A1, A3 (A3 spells *putrou*) |
| Lhue | Floor beams | ⚠️ | A glossary page via a search summary only |
| Tulak angen | Gable screens | ⚠️ | Search summaries (a carving study and a glossary) |
| Reunyeun | Stair | ✅ | A2 |
| Keupaleh | Gateway | ✅ | A3 |
| Gampong | Village | ✅ | A3 |
| Ruang (ruweueng) | Bay between posts | ✅ | A1 |

### Site (`index.js`) and About

| Claim | Status | Source / note |
|---|---|---|
| Lies east–west, gables towards the qibla, west = Mecca | ✅ | A1, A2, A3 |
| Entered on the long side | ✅ | A3 |
| Three parts and their uses (men and guests / bedrooms / women and kitchen) | ✅ | A1, A2, A3 |
| Front gallery: guests, boys sleep, children learn to recite, feasts | ✅ | A2 |
| Back gallery: cooking, family meals, weaving and embroidery, women guests; most private | ✅ | A2, A3 |
| Under the house: play, weaving songket, socialising, storage | ✅ | A2, A3 |
| Raised on posts in keeping with the idea of purity | ✅ | A2 (citing Arifin 2016) |
| Pegged joints, no nails | ✅ | A3; A2 |
| Earthquake resistance | ⚠️ | A literature review via a search summary |
| Posts always even in number | ✅ | Search summary of a case study; A1's counts are all even |
| Posts set root end down | ✅ | A3 |
| Middle posts tallest, put up first | ✅ | A3 |
| Gold in the queen post | ✅ | A3 |
| Inheritance by daughters; couple lives with her parents until the first child; father gathers timber when the daughter is about seven | ✅ | A3 |
| Few survive: timber scarce, costly, seen as old-fashioned; zinc roofs, rooms added, kitchens built on | ✅ | A3, A2 |
| Krong padé holds unhusked rice, unlike Javanese granaries; under or beside the house | ✅ | A3 |
| Keupaleh only for well-off families | ✅ | A3 |
| Hedges or fences round the yard; shade trees | ✅ | A3 |
| Houses scattered without a plan in the gampong | ✅ | A3 |
| Carving: religious, plant, animal, nature motifs; on gables, windows, boards; added after building | ✅ | A1, A3 |

### House (`rumoh.js`, `rumoh-parts.js`)

| Part | Claim | Status | Source / note |
|---|---|---|---|
| Tameh | On flat stones | ✅ | A3 |
| Tameh | 24 posts, 4 rows, 2.5 m | 📐 / ✅ | Spacing and row count from A1 |
| Tameh raja & putroe | Most honoured posts | ⚠️ | A3 says they are named and the queen post receives gold; "most honoured" is our summary |
| Reunyeun | Steep stair to the door; the door on the long side | ✅ | A1, A3 |
| Yup moh | Bench and loom | 💭 | Illustrate A2's uses |
| Seuramoe keue | Carved front wall | 💭 | A3 says boards are carved; which boards is ours |
| Rumoh inong | Bed platform in the jurei | 💭 | |
| Seuramoe likot | Hearth and water jars | 💭 | Cooking is sourced (A2); the objects are ours |
| Rangka atap | Roof tied on so it can be cut loose in a fire | ✅ | A3 |
| Rangka atap | "Losing the roof could save the house" | 💭 | Marked `interp` |
| Atap | Thatch of sago palm leaves; zinc today | ✅ | A3, A2 |
| Tulak angen | Gable screens perforated for ventilation | ✅ | A3 |
| Walls | Planks (some walls) | ⚠️ | A3 (Yusriadi) says walls were of woven bamboo. We use boards, as in most surviving houses; the "board walls" are a modelling choice |

### Yard (`pekarangan.js`)

| Claim | Status | Source / note |
|---|---|---|
| Krong padé form: bamboo drum on a platform under its own roof | 💭 | Not described in what we read |
| Fence of woven bamboo between posts | 💭 | A3 says hedges or fences |
| Keupaleh form: roofed gateway with a carved board | 💭 | |

## 4. Open questions

1. The plan in A1's figure 3 (after Kamal 2015) would settle where the bedrooms, the passage and the king and queen posts really are.
2. Real heights of floor, walls and ridge.
3. The form of the krong padé and the keupaleh.
4. Board or woven-bamboo walls for the ideal type.
5. Whether "Krong Bade" really derives from *krong padé*.

## 5. Sources

### A. Checked for this review

- **A1.** Andriani, D., Muliana, E., & Olivia, S. (2025). Pudarnya jati diri arsitektur khas Indonesia (studi kasus bangunan-bangunan dengan penerapan arsitektur rumoh Aceh di Kota Lhokseumawe). *Jurnal Vastutara* 1(1), 28–39. <https://ejournal.uinsaizu.ac.id/index.php/vastutara>. Full text read (figures not). Main source for the grid and openings.
- **A2.** Hendra A. (2021). Transformasi ruang pada rumoh Aceh. *Arsir* 5(2), 164–176. <https://jurnal.um-palembang.ac.id/arsir/article/view/3812>. Full text read. Ten houses in Pidie; typical 16 posts.
- **A3.** Rumoh Aceh. *Wikipedia* (English). <https://en.wikipedia.org/wiki/Rumoh_Aceh>. Read via a page summary. Used for what it cites: Schefold, Nas & Domenig (2003); Snouck Hurgronje (1893, 1984); Waterson (2006); Yusriadi (2013); Rizky & Wibisono (2012).

### B. To check (not online, or not reachable)

- Snouck Hurgronje, C. (1893). *De Atjèhers*, deel I. Leiden: Brill.
- Schefold, R., Nas, P. J. M., & Domenig, G. (eds.) (2003). *Indonesian Houses*, vol. 1. Leiden: KITLV Press.
- Yusriadi (2013). *Arsitektur Rumah Aceh*. Banda Aceh: Majelis Adat Aceh.
- Kamal (2015), cited by A1 for the plan.
- Husin (2003), cited by A2 for the yup moh.
- The *Nalars* (UMJ) article on the spatial structure of the rumoh Aceh (blocked).
