// Directory filters: reads the server-rendered cards (data-* attributes), filters, sorts,
// keeps every filter control (bar, dropdowns, sheet) in sync, and places the lead band after the 3rd result.
type State = { search: string; served: boolean; island: Set<string>; activity: Set<string>; difficulty: string | null; more: Set<string>; sort: string };

export function initDirectoryFilters(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('[data-results]')!;
  const items = [...list.querySelectorAll<HTMLElement>('[data-site]')];
  const lead = list.querySelector<HTMLElement>('[data-lead]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const sheet = root.querySelector<HTMLDialogElement>('[data-filter-sheet]');
  const state: State = { search: '', served: false, island: new Set(), activity: new Set(), difficulty: null, more: new Set(), sort: 'pertinence' };
  const plural = (n: number) => (n === 1 ? `${n} mangrove trouvée` : `${n} mangroves trouvées`);

  const matches = (el: HTMLElement) => {
    const d = el.dataset;
    if (state.search && !(d.search || '').includes(state.search)) return false;
    if (state.served && d.served !== 'true') return false;
    if (state.island.size && !state.island.has(d.island || '')) return false;
    if (state.activity.size && ![...state.activity].some((a) => (d.activities || '').split(' ').includes(a))) return false;
    if (state.difficulty && d.difficulty !== state.difficulty) return false;
    if (state.more.has('kids') && d.kids !== 'true') return false;
    if (state.more.has('birds') && d.birds !== 'true') return false;
    if (state.more.has('photo') && d.photo !== 'true') return false;
    return true;
  };

  const apply = () => {
    const ordered = items.slice().sort((a, b) => {
      if (state.sort === 'facile') return (a.dataset.difficulty === 'Facile' ? 0 : 1) - (b.dataset.difficulty === 'Facile' ? 0 : 1) || Number(a.dataset.order) - Number(b.dataset.order);
      if (state.sort === 'familles') return (b.dataset.kids === 'true' ? 1 : 0) - (a.dataset.kids === 'true' ? 1 : 0) || Number(a.dataset.order) - Number(b.dataset.order);
      return Number(a.dataset.order) - Number(b.dataset.order);
    });
    let shown = 0;
    for (const el of ordered) {
      const ok = matches(el);
      el.hidden = !ok;
      list.appendChild(el);
      if (ok) {
        shown++;
        if (shown === 3 && lead) list.appendChild(lead);
      }
    }
    if (lead) { if (shown < 3) list.appendChild(lead); lead.hidden = shown === 0; }
    if (empty) empty.hidden = shown !== 0;

    const count = state.island.size + state.activity.size + (state.difficulty ? 1 : 0) + state.more.size + (state.served ? 1 : 0) + (state.sort !== 'pertinence' ? 1 : 0);
    const active = count > 0 || !!state.search;
    root.querySelectorAll<HTMLElement>('[data-result-count]').forEach((el) => (el.textContent = plural(shown)));
    root.querySelectorAll<HTMLElement>('[data-apply-label]').forEach((el) => (el.textContent = `Voir ${shown} mangrove${shown === 1 ? '' : 's'}`));
    root.querySelectorAll<HTMLElement>('[data-clear-filters]').forEach((el) => { if (el.closest('.result-toolbar')) el.hidden = !active; });
    root.querySelectorAll<HTMLElement>('[data-filter-count]').forEach((el) => { el.hidden = !count; el.textContent = String(count); });
    const moreCount = [...state.more].filter((m) => m !== 'kids').length + (state.sort !== 'pertinence' ? 1 : 0);
    root.querySelectorAll<HTMLElement>('[data-more-count]').forEach((el) => (el.textContent = moreCount ? ` (${moreCount})` : ''));

    // Sync every control with the state.
    root.querySelectorAll<HTMLElement>('[data-filter]').forEach((el) => {
      const { filter, value = '' } = el.dataset;
      const on = filter === 'served' ? state.served
        : filter === 'island' ? state.island.has(value)
        : filter === 'activity' ? state.activity.has(value)
        : filter === 'difficulty' ? state.difficulty === value
        : filter === 'more' ? state.more.has(value)
        : filter === 'sort' ? state.sort === value : false;
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const sizes: Record<string, number> = { island: state.island.size, activity: state.activity.size, difficulty: state.difficulty ? 1 : 0 };
    root.querySelectorAll<HTMLElement>('[data-dropdown-label]').forEach((el) => {
      const key = el.dataset.dropdownLabel!;
      const base = { island: 'Île', activity: 'Activité', difficulty: 'Difficulté' }[key] || '';
      const n = sizes[key];
      el.textContent = key === 'difficulty' && state.difficulty ? `${base} (${state.difficulty})` : n ? `${base} (${n})` : base;
      const details = el.closest<HTMLElement>('[data-dropdown]');
      if (details) { if (n) details.dataset.active = ''; else delete details.dataset.active; }
    });
  };

  const toggle = (set: Set<string>, v: string) => (set.has(v) ? set.delete(v) : set.add(v));
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const control = t.closest<HTMLElement>('[data-filter]');
    if (control) {
      const { filter, value = '' } = control.dataset;
      if (filter === 'served') state.served = !state.served;
      if (filter === 'island') toggle(state.island, value);
      if (filter === 'activity') toggle(state.activity, value);
      if (filter === 'difficulty') state.difficulty = state.difficulty === value ? null : value;
      if (filter === 'more') toggle(state.more, value);
      if (filter === 'sort') state.sort = value;
      apply();
      return;
    }
    if (t.closest('[data-clear-filters]')) {
      Object.assign(state, { search: '', served: false, island: new Set(), activity: new Set(), difficulty: null, more: new Set(), sort: 'pertinence' });
      root.querySelectorAll<HTMLInputElement>('[data-filter-search]').forEach((i) => (i.value = ''));
      apply();
      return;
    }
    if (t.closest('[data-open-filters]')) sheet?.showModal();
    if (t.closest('[data-close-filters]')) sheet?.close();
    const viewBtn = t.closest<HTMLElement>('[data-view-button]');
    if (viewBtn) {
      list.dataset.view = viewBtn.dataset.viewButton;
      root.querySelectorAll<HTMLElement>('[data-view-button]').forEach((b) => b.setAttribute('aria-pressed', String(b === viewBtn)));
    }
  });
  sheet?.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });
  root.querySelectorAll<HTMLInputElement>('[data-filter-search]').forEach((input) => {
    input.addEventListener('input', () => {
      state.search = input.value.trim().toLowerCase();
      root.querySelectorAll<HTMLInputElement>('[data-filter-search]').forEach((other) => { if (other !== input) other.value = input.value; });
      apply();
    });
  });
  // Close an open dropdown when clicking elsewhere.
  document.addEventListener('click', (e) => {
    root.querySelectorAll<HTMLDetailsElement>('[data-dropdown][open]').forEach((d) => { if (!d.contains(e.target as Node)) d.open = false; });
  });
  apply();
  root.dataset.enhanced = '';
}
