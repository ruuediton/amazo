# Task: Visual Uniformity & Performance Optimization

## 🎯 Goal
Standardize the visual language of the application to match the `Login` and `Register` pages (White background, standardized typography, and spacing). Simplify button labels to a single word and optimize front-end performance/validations.

## 🛠️ Tech Stack
- React + Tailwind CSS
- Supabase (Backend/Real-time)
- Manrope Typography (Global)

## 🏗️ Architecture & Design Changes
- **Background**: All pages will use `bg-white` as the primary background.
- **Buttons**: Every button will have a single, clear action word (e.g., "Retirar", "Comprar", "Confirmar").
- **Validations**: All forms will have pre-submission checks to avoid unnecessary network calls.
- **Consistency**: Unified card styles (`premium-card`) and spacing.

---

## 📅 Phases

### Phase 1: Global Identity (CSS)
- [ ] Update `index.css` variables to ensure `--bg-neutral` is `#FFFFFF`.
- [ ] Refine `.premium-card` and `.btn-wealth` to match the intended elegance.

### Phase 2: Core Page Refactoring
- [ ] **Home.tsx**: Change `bg-background-dark` to `bg-white`. Simplify buttons (e.g., "Recarregar" -> "Recarregar", "Retirar" -> "Retirar", "Ajuda" -> "Ajuda").
- [ ] **Profile.tsx**: Change gradient and background. Standardize service icons.
- [ ] **Wallet.tsx**: Convert from dark theme to light/white theme.
- [ ] **App.tsx**: Update navigation bar and global container backgrounds.

### Phase 3: Secondary Pages & Components
- [ ] **Withdraw.tsx**: Refine validation logic and simplify buttons ("Solicitar Saque" -> "Confirmar").
- [ ] **Recharge.tsx**: Standardize inputs and confirm button ("Confirmar").
- [ ] **Login/Register**: Ensure labels follow the "single word" rule (e.g., "faça login imediatamente" -> "Entrar").

### Phase 4: Performance & Validation
- [ ] add `disabled` states to buttons during loading.
- [ ] Implement Regex-based phone validation and balance checks locally.
- [ ] Verify that real-time subscriptions don't cause redundant re-renders.

### Phase 5: Audit & Delivery
- [ ] Run `npm run lint` and `npx tsc --noEmit`.
- [ ] Execute `python .agent/scripts/checklist.py .`.

---

## 🚦 Verification Criteria
- [ ] All pages have a white background.
- [ ] No button has more than one word.
- [ ] Typography is consistent (Manrope).
- [ ] Form inputs are validated before sending to Supabase.
- [ ] Navigation is smooth and fast.
