# UI Registry — Tok Wan Hasnul 64th Birthday P. Ramlee Web App

Established: 2026-07-24

## Design System Tokens & Classes

### TvDisplayMode
File: `src/components/TvDisplayMode.jsx`
Last updated: 2026-07-24

| Property         | Class / Token |
| ---------------- | ------------- |
| Container Background | `bg-[#0D0907]` |
| Card Background | `bg-gradient-to-b from-[#211913] to-[#140E0A]` |
| Card Border | `border-4 border-[#D4AF37]` |
| Border Radius | `rounded-3xl` |
| Text Primary | `text-gold-gradient`, `text-[#F5E6CA]` |
| Text Muted | `text-[#A39274]` |
| Spacing (Card Padding) | `p-6 md:p-10` |
| Hover State | `hover:scale-[1.01] transition-all duration-700` |
| Shadow | `shadow-[0_25px_60px_rgba(0,0,0,0.95)]` |
| Accent Usage | Crimson Badge (`bg-[#8C1C1C]`), Gold Metallic (`--gold-metallic`) |

**Pattern notes:**
- P. Ramlee cinema theme relies on high-contrast gold borders (`#D4AF37`), dark sepia backgrounds (`#0D0907`), and vintage typography (`font-cinema`, `font-heading`, `font-typewriter`).

### GuestWishForm
File: `src/components/GuestWishForm.jsx`
Last updated: 2026-07-24

| Property         | Class / Token |
| ---------------- | ------------- |
| Container Background | `bg-[#18120D]` |
| Border | `border-2 border-[#D4AF37]/50` |
| Border Radius | `rounded-3xl` |
| Text Primary | `text-[#F5E6CA]` |
| Text Secondary / Labels | `text-[#D4AF37] font-typewriter` |
| Input Fields | `bg-[#110C08] border border-[#D4AF37]/30 rounded-xl` |
| Primary Button | `bg-gradient-to-r from-[#BF953F] via-[#FBF5B7] to-[#AA771C] text-[#1A130E]` |
| Shadow | `shadow-[0_20px_50px_rgba(0,0,0,0.9)]` |

**Pattern notes:**
- Inputs should always use `bg-[#110C08]` with gold focus borders (`focus:border-[#D4AF37]`).

### GramophonePlayer
File: `src/components/GramophonePlayer.jsx`
Last updated: 2026-07-24

| Property         | Class / Token |
| ---------------- | ------------- |
| Container Background | `bg-[#1A130E]/90 backdrop-blur-md` |
| Border | `border-2 border-[#D4AF37]/60` |
| Border Radius | `rounded-2xl` |
| Vinyl Animation | `spinning-vinyl` |

### VintageCurtain
File: `src/components/VintageCurtain.jsx`
Last updated: 2026-07-24

| Property         | Class / Token |
| ---------------- | ------------- |
| Curtain Background | `bg-gradient-to-r from-[#5C1010] via-[#8C1C1C] to-[#3B0A0A]` |
| Curtain Border | `border-r-4 border-[#D4AF37]` |
| Transition | `transition-transform duration-1000 ease-in-out` |
