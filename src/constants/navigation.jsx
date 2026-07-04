/* ─── Minimal fallback icon ──────────────────────────────── */
const RawSvgIcon = ({ markup }) => (
  <span
    className="block h-full w-full [&>svg]:h-full [&>svg]:w-full"
    dangerouslySetInnerHTML={{ __html: markup }}
  />
);

export const DefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
);

export const FEATURE_NAV_DATA = [];

const slugify = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-');

const sanitizeRoute = (route, feature) => {
  const cleaned = String(route || '').trim();

  if (cleaned) {
    return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  }

  return `/feature/${slugify(feature?.module_name || feature?.feature_name)}`;
};

const createRawSvgIcon = (iconMarkup) => {
  const markup = String(iconMarkup || '').trim();

  if (!markup.startsWith('<svg')) {
    return null;
  }

  const normalizedMarkup = markup.replace(
    /<svg\b([^>]*)>/i,
    '<svg$1 width="100%" height="100%" aria-hidden="true" focusable="false">'
  );

  return function ApiSvgIcon() {
    return <RawSvgIcon markup={normalizedMarkup} />;
  };
};

const getIcon = (feature) => createRawSvgIcon(feature?.feature_icon) || DefaultIcon;

const toNavItem = (feature) => ({
  id: String(feature?.id ?? slugify(feature?.module_name || feature?.feature_name)),
  label: feature?.feature_name || '',
  href: sanitizeRoute(feature?.route_url, feature),
  routeUrl: feature?.route_url || null,
  featureIcon: feature?.feature_icon || null,
  Icon: getIcon(feature)
});

export const buildNavItems = (featureData = []) =>
  featureData.flatMap((feature) => {
    const parentItem = toNavItem(feature);

    if (feature.children?.length) {
      return [parentItem, ...feature.children.map((child) => toNavItem(child))];
    }

    return [parentItem];
  });

export const buildNavSections = (featureData = []) => [
  {
    label: 'Navigation',
    items: featureData?.map((feature) => {
      const item = toNavItem(feature);

      if (feature.children?.length) {
        return {
          ...item,
          children: feature.children.map((child) => toNavItem(child))
        };
      }

      return item;
    })
  }
];

