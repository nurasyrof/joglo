# Content review: Rumah Bolon (Batak Toba)

Status of every name and claim in `src/houses/rumah-bolon/`, checked against sources on 14 October 2026, when the house was first modelled.
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

Source keys (T1, T2…) refer to the list at the bottom.

---

## 1. Fixes needed

None found so far. This house has **the least measured data of any so far**: the only dimension in the sources read is the posts (1.75 m high, more than 40 cm thick, T3). The sopo and the inside of the house are the weakest parts.

## 2. Model basis

There is no single house or village behind the model. T2 gives the general pattern of a huta and the two kinds of house; T1 and T3 give the parts and their meanings; all three are about the villages on Samosir (Tomok, Huta Siallagan, Huta Bolon at Simanindo).

T1 explains why sizes are missing: houses were set out in *dopa*, *jongkal*, *asta* and *langka* (fathom, span, cubit, pace), so every house differs. The About text says this.

Our own estimates 📐:

- **Great house** 6.6 × 12.4 m, the two others 5.8 × 10.4 m. Floor +1.75 m (= the post height in T3), walls 1.5 m leaning out 0.35 m.
- **Roof.** Ridge about 3–3.4 m above the wall at its lowest, peaks rising a further 2.5–3 m; the back peak 0.8 m higher than the front; the roof set 0.4 m forward so the front reaches further (both from T3, the amounts ours).
- **Posts.** 20 per house, in six rows, with three tiers of rails.
- **Sopo** 4.8 × 7.2 m on six posts.
- **Huta** 42 × 38 m: three houses, three barns, rampart 1.5 m high. T1 gives Huta Siallagan as about 2,400 m² with eight houses and a stone wall 1.5–2 m high.

Choices to know about:

- We model the **ruma sitolumbea** (stair inside, door in the floor) because T2 calls it the most complete kind and T1 says the *rumah bolon* of a village is usually the one entered from below. Most houses standing today are the other kind, with an outside stair and a front door.
- The smaller houses are given the same hatch entrance for simplicity. In a real village they would more likely be *sisampuran*. 💭
- T2 puts the houses in the north row and the barns in the south. We follow that (houses at −z, facing south).
- T2 describes an earth rampart planted with bamboo; T1 a stone wall at Siallagan. We model earth with a stone footing and stone gate piers. 💭

## 3. Claims by place

### Names

| Name | Used for | Status | Source / note |
|---|---|---|---|
| Rumah bolon / jabu bolon | The great house | ✅ | T1 |
| Ruma, jabu | House | ✅ | T2 |
| Ruma sitolumbea / sisampuran (sibaba ni amporik) | The two kinds of house | ✅ | T2 |
| Huta | Village | ✅ | T1, T2 |
| Sopo | Rice barn | ✅ | T2 |
| Alaman | Yard | ⚠️ | T2 calls it "halaman"; "alaman" from T4 and search summaries |
| Parik | Rampart | ✅ | T2 |
| Bahal | Gate | ✅ | T2 |
| Hariara | Tree before the gate | ✅ | T2 (with bintatar and beringin) |
| Banua toru / tonga / ginjang | Three worlds | ✅ | T3 |
| Papan | Floor | ✅ | T1 |
| Gulang-gulang | Floor beams | ✅ | T1 |
| Dorpi, dorpi jolo | Wall, front wall | ✅ | T2 ("dorpi jolo (dinding depan)") |
| Gorga | Carving | ✅ | T1–T3 |
| Ulu paung, singa-singa, adop-adop, boraspati | Ornaments | ✅ | T2, T3 |
| Songkor, pangabang | Front and back galleries | ✅ | T1 |
| Para-para, parlabian, talaga | Rack, space under it, floor hole | ✅ | T1 |
| Tataring, ransang | Hearth, rails through the posts | Not used | The usual Toba words, but not in T1–T3 (T1 says only "tungku"). The site uses "Tungku" and "Palang"; the part ids in the code are still `tataring` and `tiang` |
| Marsiadapari | Working together | ✅ | T3 |
| Tondi | Soul of the house | ✅ | T2 |
| Jabu gorga / jabu batara siang | Carved / plain house | ✅ | T2 |
| Gorga sipalang / silinggom | Mostly red / mostly black | ✅ | T2 (silinggom only for the house of a raja adat). Used as preset names |

### Site (`index.js`) and About

| Claim | Status | Source / note |
|---|---|---|
| "Great house", house of the extended family | ✅ | T1 |
| One room, no partitions; families live and sleep together | ✅ | T1 |
| Four to six families | ✅ | T3 |
| Three worlds and what each holds | ✅ | T1, T3 |
| Ruma sitolumbea: stair between front posts and inner posts, door in the floor | ✅ | T2 |
| Sitolumbea is the "female" house and the most complete | ✅ | T2 |
| The rumah bolon of a village usually has the stair from below and no front window | ✅ | T1 |
| Gorga in red, white, black | ✅ | T1, T2 |
| A house has a soul; gorga keeps it alive ("so that it looks alive") | ✅ | T2 |
| Two rows: houses north, barns south, yard between | ✅ | T2 |
| Yard: children's play, drying, feasts and funerals | ✅ | T2 |
| Gardens behind the rows | ✅ | T2 |
| Rampart of earth planted with bamboo, rectangular | ✅ | T2 |
| One gate, sacred trees before it | ✅ | T2 ("gate", singular; "one gate" is ours) |
| A huta as its own small state | ⚠️ | A sociological paper via a search summary |
| Most surviving houses now have zinc roofs | ✅ | T1 |
| Each barn belongs to the house opposite | 💭 | T2 says only that the two rows face each other |
| "Around Lake Toba" | ✅ | T1 |

### House (`ruma.js`, `ruma-parts.js`)

| Part | Claim | Status | Source / note |
|---|---|---|---|
| Tiang | 1.75 m high, more than 40 cm thick | ✅ | T3 |
| Tiang | Timbers lock together; rattan and ijuk ties | ✅ | T3 |
| Tiang | Stone footings | ✅ | T1 ("batu pondasi") |
| Tiang | Linked legs = marsiadapari | ✅ | T3 |
| Tiang | Rails through the posts in three tiers | 💭 | Form from photographs in general |
| Kolong | Stall for buffalo and pigs | ⚠️ | A study via a search summary; T3 for "place of animals" |
| Kolong | Lower world = traits a person should not have | ✅ | T3 |
| Tangga | Hatch "lowered at night" (code comment only) | 💭 | |
| Papan | Floor boards on gulang-gulang | ✅ | T1 |
| Papan | "Each family in its own part of the floor" | ⚠️ | T2 says each space had a name after its occupants; the names (jabu bona, jabu soding…) were not in the sources read and are not used |
| Dorpi | Walls lean outwards | 💭 | Photographs in general |
| Dorpi jolo | Tiers of carved boards stepping forward | 💭 | T1 lists the ornaments of the front (ture-ture, songsong boltok, halang gordang…) without drawings we could read |
| Dorpi jolo | Adop-adop and boraspati, four each side | ✅ | T2 |
| Singa-singa | A kneeling human figure with staring eyes; on the front posts left and right | ✅ | T2, T3 |
| Singa-singa | Justice and truth | ✅ | T2, T3 |
| Singa-singa | Guards against evil spirits | ⚠️ | A study of Siallagan via a search summary |
| Tataring | Hearth towards the back, talaga beside it, sweepings go down it | ✅ | T1 |
| Tataring | The saying about the talaga | ✅ | T1 |
| Para-para | Across the middle; spare ijuk on it, rattan and tools below | ✅ | T1 |
| Songkor | Front gallery for the gondang players, or farm tools | ✅ | T1 |
| Pangabang | Back gallery for rice in baskets (bahul-bahul) | ✅ | T1 |
| Rangka atap | Bamboo and timber | ✅ | T1 |
| Rangka atap | Site agreed in council and marked (with mare-mare) | ✅ | T1 |
| Atap | Ijuk in three layers | ✅ | T1 |
| Atap | Front peak reaches further, back peak higher; hope that the children rise above the parents | ✅ | T3 |
| Ulu paung | Horned head at the front peak; protects the house; strength and many descendants | ✅ | T2 |

### Sopo (`ruma.js`, `ruma-parts.js`)

| Claim | Status | Source / note |
|---|---|---|
| Rice barn; may be carved like a house | ✅ | T2 |
| Open floor below, store above | 💭 | General knowledge of the Toba sopo; not described in T1–T3 |
| Discs on the posts against rats | 💭 | As above. Marked `interp` |
| Open floor as a place to sit and work; "public side" | 💭 | Marked `interp` |

### Huta (`huta.js`)

| Claim | Status | Source / note |
|---|---|---|
| Stone wall 1.5–2 m at Huta Siallagan | ✅ | T1 |
| Bamboo as a living fence that hides the village | 💭 | Marked `interp` |
| Gate form: stone piers, narrow passage | 💭 | |
| Hariara brings good fortune | ✅ | T2 ("bertuah") |

## 4. Open questions

1. Measured drawings of a ruma and a sopo. Sitanggang (1998) and Domenig (2003) are the places to look.
2. The names of the parts of the floor (jabu bona, jabu soding, jabu suhat, jabu tampar piring) and who sits where: not found in the sources read, so left out.
3. Confirm the Toba words for hearth and for the rails (tataring, ransang) so they can be used.
4. The form of the sopo: Domenig (2003) is specifically about it.
5. T1 names nine ornaments of the roof zone and five of the body; only five are modelled.
6. Whether to give the two smaller houses outside stairs and front doors.

## 5. Sources

### A. Checked for this review

- **T1.** Sihotang, K. M., Naibaho, P. D. R., & Aritonang, E. R. (2019). Tipologi fasad rumah adat Batak Toba. *Jurnal Arsitektur ALUR* 2(2), 13–21. <https://ejournal.ust.ac.id/index.php/ALUR/article/view/529>. Full text read (figures not).
- **T2.** Saragih, D. A., & Yulianto (2019). Kajian ornamen gorga di rumah adat Batak Toba (studi kasus: Tomok, Huta Siallagan dan Huta Bolon). *Jurnal Arsitektur ALUR* 2(1). <https://ejournal.ust.ac.id/index.php/ALUR/article/view/368>. Theory and ornament sections read.
- **T3.** Naibaho, M. (2019). Makna simbol pada rumah adat etnik Batak Toba (ruma bolon) di Kabupaten Samosir. *JOM FISIP* 6(2). <https://jom.unri.ac.id/index.php/JOMFSIP/article/view/25546>. Relevant sections read. A communication-studies paper, not an architectural one.
- **T4.** Conclusions chapter of an undergraduate thesis at Universitas Katolik Parahyangan comparing Lumban Pea, Banjar Ganjang and Gala-Gala. <https://repository.unpar.ac.id/>. Supports the general pattern only (houses, sopo and a central yard).

### B. To check (not online, or not reachable)

- Sitanggang, H. (1998). *Arsitektur Tradisional Daerah Sumatera Utara*. Jakarta: Departemen Pendidikan dan Kebudayaan.
- Napitupulu, S. P., et al. (1997). *Arsitektur Tradisional Daerah Sumatera Utara*. Jakarta: Departemen Pendidikan dan Kebudayaan.
- Domenig, G. (2003). Consequences of functional change: granaries, granary-dwellings, and houses of the Toba Batak. In R. Schefold, P. Nas & G. Domenig (eds.), *Indonesian Houses*, vol. 1. Leiden: KITLV Press.
- Sibeth, A. (1991). *The Batak: Peoples of the Island of Sumatra*. London: Thames and Hudson.
- Simamora, T. (1997). *Rumah Batak Toba: Usaha Inkulturatif*. Pematangsiantar. (Cited by T3.)
- The Universitas Muhammadiyah Surakarta thesis chapter on ruma bolon structure (blocked).
