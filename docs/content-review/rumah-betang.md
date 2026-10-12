# Content review: Rumah Betang (Dayak Ngaju)

Status of every name and claim in `src/houses/rumah-betang/`, checked against sources on 12 October 2026, when the house was first modelled.
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

Source keys (B1, B2…) refer to the list at the bottom.

---

## 1. Fixes needed

None found so far. The two things most likely to be wrong are the roof pitch and the arrangement of the rooms: see section 2.

Registry change made with this house: the local name was "Lamin" (the East Kalimantan word) and the people "Dayak"; now "Huma Betang" and "Dayak Ngaju" (B1, B2).

## 2. Model basis

The house follows B1's measurements of **Betang Toyoi** at Tumbang Malahoi (Gunung Mas), built in 1869:

| Measured in B1 | Value | In the model |
|---|---|---|
| Overall | 36 × 9.75 m | 36 × 9.75 m |
| Ground to floor | 2.30 m | 2.3 m |
| Floor to roof frame | 3.30 m | 3.3 m (post tops +5.6 m; B2 gives 5.58 m) |
| Roof zone | 1.90 m | Ridge +7.7 m |
| Main posts (jihi) | Ø 45–47 cm; largest 57 cm, centre front right | Four great posts Ø 46 cm, one Ø 57 cm; the others Ø 40 cm 📐 |
| Props (tungket) | Ø 15–25 cm | Ø 22 cm |
| Posts in all | 86 | 76 under the house + 10 under kitchen and deck (see below) |
| Hall | 20 × 10 m | 20 × 9.75 m |
| Rooms | 10: eight for families, one for guests, one for heirlooms | 10 |
| Room sizes | A 4.85 × 3.20, B 4.85 × 3.05, C 2.35 × 3.20, D 2.35 × 3.05, E and F 2.64 × 1.80 m | Close to these; see below |
| Floor boards | ≈ 28 cm wide, 3.5 cm thick, laid front to back | Same |
| Joists | ≈ 50 cm apart | Same |
| Window sill | 112 cm | Same |
| Main stair | 1 m wide, ≈ 45°, landing, 5 + 6 steps | Same |
| Tiger figures | ≈ 3.25 m above ground | ≈ 3.25 m |
| Peep-holes | 2, Ø 15 cm, in the gable | Same |

Things we had to decide ourselves:

- **Roof pitch.** 📐 B1's table gives the roof zone as 1.90 m, which over a 9.75 m house is a pitch of about 19°. That is low for shingles, and B1 also gives a truss span of 4.4 m, which would make a much steeper roof if the 1.90 m is the rise of that truss alone. We took the table at face value because B1's shingle count (5,392 pieces of about 1 × 0.2 m) fits the area of a low roof and not a steep one. Check against a photograph or B1's figure 9.
- **Room arrangement.** 💭 B1 says there are four rooms to the left and four to the right of the entrance and lists the room sizes, but its plan (figure 13) is an image we could not read. We arranged each wing as a passage 3.5 m wide between two rows of two rooms, which is the only layout we found that fits both the sizes and the 9.75 m depth, and put the two small rooms at the back of the hall.
- **Post layout.** 💭 B1 gives the total and says four posts stand in the middle of the hall; B2's figure 7 shows "four main pillars". Rows, spacing and which posts are jihi or tungket are ours, and the kitchen's ten posts were chosen so the total comes to B1's 86. The 86 is a real figure; our distribution is not.
- **Kitchen and deck.** 💭 B1 says only that the kitchen roof is a gable turned against the main roof and that there is a kitchen stair. Its size (6 × 8 m), position and the 3 m deck are ours. B4 says the kitchen of such houses stood 5–6 m away.
- **The yard.** 💭 B1 says sandung, sapundu and pantar stand in front of the house. Their number, form and position are ours.
- **The river.** B4 and B2 say betang are built on river banks and face the river (B2 also says houses should face east). The distance and the log landing are ours 💭.

## 3. Claims by place

### Names

| Name | Used for | Status | Source / note |
|---|---|---|---|
| Betang, huma betang | The house | ✅ | B1–B4 |
| Jihi | Main post, ground to roof | ✅ | B1, B2, B3 |
| Jihi bakas / tiang bakas | The eldest (first) post | ✅ | B2. We use it as the name of all four great posts, which stretches it ⚠️ |
| Tiang agung | The largest post | ✅ | B1 |
| Tungket | Prop to floor height | ✅ | B1, B2, B3 |
| Bahat, gahagan | Floor beam, joist | ✅ | B1 (spelt "gahangan" once), B3 |
| Laseh | Floor | ✅ | B1, B3 |
| Guntung | Wall post | ✅ | B1, B3 |
| Bapahan | Tie beam | ✅ | B1, B3 |
| Handaran | Purlin (B1 section heading), also "balok tekan" in B1's list and "floor balk" in B2 | ⚠️ | Sources disagree on what handaran is. We follow B1's heading "Gording (handaran)" and B3 (carries the rafter ends) |
| Tulang bubungan | Ridge beam | ✅ | B1 |
| Sapau | Roof covering | ✅ | B1 ("Atap / Sirap (sapau)") |
| Tawing | Gable end | ✅ | B1 |
| Hejan | Stair | ✅ | B1 |
| Haramaung | Tiger figures | ✅ | B1 |
| Karung | Bedroom | ✅ | B2 |
| Los | Hall | ✅ | B4 |
| Karayan | Deck between house and kitchen | ✅ | B2, B4 |
| Sandung, sapundu, pantar | Monuments | ✅ | B1 names all three |

### Site (`index.js`) and About

| Claim | Status | Source / note |
|---|---|---|
| Longhouse of the Dayak Ngaju, many related families | ✅ | B1, B2 |
| 30–150 m long, posts 3–5 m | ✅ | B4 (30–150 m, 3–4 m); B2 (3–5 m at Malahoi in the 1840s) |
| Hall shared by all, guests sleep there; rooms for families | ✅ | B4 |
| Kitchen separate, joined by the karayan | ✅ | B2, B4 |
| Karayan for resting, drying rice and fish, keeping forest produce | ✅ | B2, B4 |
| Kitchen kept apart against disturbance and fire | ✅ | B4 |
| As many hearths as families | ✅ | B4 |
| All ironwood; originally no nails: mortise, peg, rattan | ✅ | B1, B2 |
| Built on a river bank, facing the river | ✅ | B4 |
| Three worlds: posts / walls / roof | ✅ | B1 table 3 |
| Sandung holds the bones after the tiwah | ✅ | B2 |
| Sandung "like a betang in miniature" | ✅ | B2 |
| Tiwah as the second funeral that sends the soul on | ⚠️ | B2 in outline; Iban & Elfrida (2017) via a search summary |
| Sapundu: sacrificial animals tied to it; carved as figures | ⚠️ | Iban & Elfrida (2017), search summary only |
| Sapundu stays as a marker of a tiwah | 💭 | Marked `interp` |
| Pantar: raised to honour the dead | ⚠️ | B1 for all three together. Its form (tall pole) is general knowledge; the "points upwards" meaning is ours, marked `interp` |
| Surviving betang at Tumbang Gagu, Malahoi, Korik, Anoi | ✅ | B2 |
| Betang Toyoi is about half its original length | ✅ | B1 |
| "Budaya betang" as an ideal | ✅ | B3 |
| Walk: you arrive by river | ⚠️ | B1: the river was once the only way to Malahoi |

### Betang (`betang.js`, `betang-parts.js`)

| Part | Claim | Status | Source / note |
|---|---|---|---|
| Jihi | Many-sided, one piece from ground to truss | ✅ | B1 |
| Jihi | Floor beams pass through them | ✅ | B1 |
| Jihi | Raised in order eldest to youngest | ✅ | B2 |
| Jihi | First post set with a ceremony before dawn | ⚠️ | B3, for the Huma Hai at Buntoi (a balian ceremony at first cock-crow) |
| Jihi bakas | Largest post 57 cm, front right of centre | ✅ | B1 |
| Jihi bakas | The point from which directions are taken | ✅ | B2 |
| Jihi bakas | "Hold up the middle of the roof" | 💭 | Structural reading |
| Tungket | Midway between jihi, carry the floor beams | ✅ | B1 |
| Tungket | Clear of floods, animals and raiders | 💭 | Marked `interp` |
| Hejan | Solid ironwood, 1 m wide, ≈ 45°, landing, on a cross beam on two posts | ✅ | B1 |
| Hejan | 5 + 6 = 11 steps; odd = not yet finished | ✅ | B1 (B1 adds: also to confuse enemies) |
| Haramaung | Two tigers flanking the stair | ✅ | B1 |
| Haramaung | "Guardians" | 💭 | Marked `interp` |
| Tangga belakang | Three stairs: main, kitchen, back; side stair a notched round log | ✅ | B1 |
| Tangga belakang | Could be pulled up | 💭 | Marked `interp`. B3 says this of forest huts (pasah bakota), not of betang |
| Laseh | Boards 28 × 3.5 cm front to back | ✅ | B1 |
| Laseh | Older floors of small logs or bamboo tied with rattan | ✅ | B2 |
| Dinding | Bark 1–1.5 cm, clamped with split rattan, pegged to a frame | ✅ | B1 |
| Dinding | Walls 2.5–2.75 m, with a gap for the breeze | ✅ | B2 |
| Dinding | Betang Toyoi the last with bark walls | ✅ | B2 |
| Dinding | Bark replaced by cutting the rattan | ✅ | B2 |
| Dinding | Number and position of windows | 📐 | B2 says betang at first had no windows at all |
| Pintu | 5 cm leaf, wooden pivots, barred, opens only from inside | ✅ | B1 |
| Pintu | "Built to be shut against attack" | 💭 | Marked `interp` |
| Karung & Los | 8 family rooms, guest room, heirloom and instrument store | ✅ | B1 |
| Kuda-kuda | Tie beam 23 × 40 cm, three uprights, eight-sided purlins ×4 | ✅ | B1 |
| Kuda-kuda | Tenon into the post head | ✅ | B3 |
| Kuda-kuda | Ten trusses | 📐 | |
| Kasau & reng | Battens 40 cm apart, rafters laid flat, ends tenoned through the eaves board | ✅ | B1 |
| Sapau | Gable roof with a lean-to at each end | ✅ | B1 |
| Sapau | 5,392 shingles | ✅ | B1 |
| Sapau | Older roofs of bark or leaves | ⚠️ | B3 lists leaf and bark roofs for older house types; B2 says all betang roofs are now ironwood |
| Tawing | Two round peep-holes | ✅ | B1 |

### Kitchen (`dapur.js`)

| Claim | Status | Source / note |
|---|---|---|
| Separate building, roof ridge across the main ridge | ✅ | B1 |
| Kitchen stair | ✅ | B1 |
| Open deck with a rail | 💭 | "Open" from B2 ("elevated field … for drying"); the rail is ours |
| Hearth boxes of earth, drying rack | 💭 | Generic; B4 only says "tungku" |
| Everything marked `interp` in the file | 💭 | |

## 4. Open questions

1. Roof pitch: 19° (B1's table) or steeper (B1's 4.4 m truss)? A dated photograph of Betang Toyoi would settle it.
2. B1's figure 13 (plan) and figure 20 (room organisation): the real arrangement of the ten rooms.
3. Where the 86 posts actually stand.
4. What "handaran" is: purlin, compression member or floor beam.
5. Kampffmeyer (1991) has measured plans and sections of several Central Kalimantan longhouses, including Tumbang Gagu and Malahoi; B2 reproduces two of them as figures.
6. Sandung, sapundu and pantar: read Iban & Elfrida (2017) and Schiller (1997) and correct the yard.
7. Which way the kitchen lies relative to upstream and downstream. B4 says the kitchen must be on the downstream side; ours is behind the house.

## 5. Sources

### A. Checked for this review

- **B1.** Restyanto, Y. (2012). Ukuran elemen arsitektur Betang Toyoi. *Jurnal Perspektif Arsitektur* 7(2), 9–23. <https://e-journal.upr.ac.id/index.php/JTA/article/view/837>. Full text read (figures not). Main source.
- **B2.** Guntur, M., Kurniawan, K. R., & Yunitha (2020). Betang, a traditional house of the Dayak Ngaju in Borneo: its space related to structure. *12th International Conference on Structural Analysis of Historical Constructions (SAHC 2020)*. <https://www.scipedia.com/public/Guntur_Kurniawan_2021a>. Full text read (figures not).
- **B3.** Usop, T. B. (2014). Pelestarian arsitektur tradisional Dayak pada pengenalan ragam bentuk konstruksi dan teknologi tradisional Dayak di Kalimantan Tengah. *Jurnal Perspektif Arsitektur* 9(2). <https://e-journal.upr.ac.id/index.php/JTA/article/view/8956>. Construction sections read. Mostly about the Huma Hai at Buntoi.
- **B4.** Perkasa, P. (2010). Konservasi bangunan bersejarah di Desa Bahu Palawa. *Jurnal Perspektif Arsitektur* 5(1). <https://e-journal.upr.ac.id/index.php/JTA/article/view/803>. Introductory sections on betang in general read.

### B. To check (not online, or not reachable)

- Kampffmeyer, H. (1991). *Die Langhäuser von Zentral-Kalimantan*. München: Anacon.
- Schärer, H. (1963). *Ngaju Religion: The Conception of God among a South Borneo People*. The Hague: Martinus Nijhoff.
- Schiller, A. (1997). *Small Sacrifices: Religious Change and Cultural Identity among the Ngaju of Indonesia*. New York: Oxford University Press.
- Iban, C., & Elfrida, T. (2017). Arsitektur religi pesta tiwah Dayak Ngaju sebagai daya tarik wisata budaya di Kalimantan Tengah. *Atrium: Jurnal Arsitektur* 3(2), 101–112. (Known only from a search summary.)
- Hamidah, N., & Garib, T. W. (2014). Studi arsitektur rumah betang Kalimantan Tengah. *Jurnal Arsitektur Melayu dan Lingkungan* 1(2). (Blocked.)
- Stevany et al. (2025), on the proportions of Betang Tumbang Gagu. *International Journal of Application on Social Science and Humanities*.
- Syahrozi (2004). *Huma Hai Buntoi*. Thesis, Universitas Diponegoro.
