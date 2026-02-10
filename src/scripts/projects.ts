type ViewMode = 'grid' | 'list';

type Filter =
  | 'All'
  | 'Behavioral Science'
  | 'Data Analysis'
  | 'Research'
  | 'Web Dev';

function qs<T extends Element>(root: ParentNode, sel: string): T | null {
  return root.querySelector(sel) as T | null;
}

function qsa<T extends Element>(root: ParentNode, sel: string): T[] {
  return Array.from(root.querySelectorAll(sel)) as T[];
}

function setPressed(btn: HTMLButtonElement, pressed: boolean) {
  btn.classList.toggle('is-active', pressed);
  btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
}

function applyFilter(grid: HTMLElement, wraps: HTMLElement[], filter: Filter) {
  grid.classList.add('is-filtering');

  // Small delay to let the class apply before DOM changes (perceived smoothness)
  window.setTimeout(() => {
    wraps.forEach((wrap) => {
      const cat = wrap.getAttribute('data-category') || '';
      const match = filter === 'All' ? true : cat === filter;
      wrap.classList.toggle('is-hidden', !match);
      wrap.setAttribute('aria-hidden', match ? 'false' : 'true');
    });

    window.setTimeout(() => grid.classList.remove('is-filtering'), 180);
  }, 60);
}

function applyView(grid: HTMLElement, view: ViewMode) {
  grid.classList.toggle('view-list', view === 'list');
}

function initProjects() {
  const grid = document.getElementById('projects-grid') as HTMLElement | null;
  if (!grid) return;

  const wraps = qsa<HTMLElement>(grid, '.project-wrap');
  const filterButtons = qsa<HTMLButtonElement>(document, '.filter-btn');
  const viewButtons = qsa<HTMLButtonElement>(document, '.view-btn');

  let activeFilter: Filter = 'All';
  let activeView: ViewMode = 'grid';

  // Filters
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = (btn.getAttribute('data-filter') || 'All') as Filter;
      if (f === activeFilter) return;
      activeFilter = f;

      filterButtons.forEach((b) => setPressed(b, b === btn));
      applyFilter(grid, wraps, activeFilter);
    });
  });

  // View toggle
  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = (btn.getAttribute('data-view') || 'grid') as ViewMode;
      if (v === activeView) return;
      activeView = v;

      viewButtons.forEach((b) => setPressed(b, b === btn));
      applyView(grid, activeView);
    });
  });

  // Initial state
  applyView(grid, activeView);
  applyFilter(grid, wraps, activeFilter);

  // Optional: close mobile nav after selecting a control on small screens
  // (no-op if not present)
  const mobileNav = document.getElementById('mobile-nav');
  const mobileToggle = qs<HTMLButtonElement>(document, '.mobile-toggle');
  if (mobileNav && mobileToggle) {
    const maybeCloseMobileNav = () => {
      if (mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    };
    filterButtons.forEach((b) => b.addEventListener('click', maybeCloseMobileNav));
    viewButtons.forEach((b) => b.addEventListener('click', maybeCloseMobileNav));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjects);
} else {
  initProjects();
}

