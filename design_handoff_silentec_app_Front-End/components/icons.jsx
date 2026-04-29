// Minimal stroke icons — 24px, 1.75 stroke
const Icon = ({ path, size = 22, color = 'currentColor', sw = 1.75, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const IconSearch   = (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>}/>;
const IconCar      = (p) => <Icon {...p} path={<><path d="M3 13l2-5a3 3 0 0 1 3-2h8a3 3 0 0 1 3 2l2 5"/><path d="M3 13v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2h10v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-5"/><circle cx="7" cy="15" r="1.2" fill="currentColor"/><circle cx="17" cy="15" r="1.2" fill="currentColor"/></>}/>;
const IconBox      = (p) => <Icon {...p} path={<><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/></>}/>;
const IconChat     = (p) => <Icon {...p} path={<><path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2.4"/></>}/>;
const IconChart    = (p) => <Icon {...p} path={<><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></>}/>;
const IconCart     = (p) => <Icon {...p} path={<><path d="M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>}/>;
const IconUser     = (p) => <Icon {...p} path={<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>}/>;
const IconHome     = (p) => <Icon {...p} path={<><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z"/></>}/>;
const IconPlus     = (p) => <Icon {...p} path={<><path d="M12 5v14M5 12h14"/></>}/>;
const IconMinus    = (p) => <Icon {...p} path={<><path d="M5 12h14"/></>}/>;
const IconCheck    = (p) => <Icon {...p} path={<><path d="M4 12l5 5 11-11"/></>}/>;
const IconChevR    = (p) => <Icon {...p} path={<><path d="M9 6l6 6-6 6"/></>}/>;
const IconChevL    = (p) => <Icon {...p} path={<><path d="M15 6l-6 6 6 6"/></>}/>;
const IconChevD    = (p) => <Icon {...p} path={<><path d="M6 9l6 6 6-6"/></>}/>;
const IconFilter   = (p) => <Icon {...p} path={<><path d="M3 5h18M6 12h12M10 19h4"/></>}/>;
const IconBell     = (p) => <Icon {...p} path={<><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3V9z"/><path d="M10 19a2 2 0 0 0 4 0"/></>}/>;
const IconSend     = (p) => <Icon {...p} path={<><path d="M22 3L11 14M22 3l-7 19-4-8-8-4 19-7z"/></>}/>;
const IconClock    = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>}/>;
const IconDoc      = (p) => <Icon {...p} path={<><path d="M6 3h9l5 5v13H6V3z"/><path d="M14 3v6h6"/></>}/>;
const IconScan     = (p) => <Icon {...p} path={<><path d="M4 8V5a1 1 0 0 1 1-1h3M4 16v3a1 1 0 0 0 1 1h3M20 8V5a1 1 0 0 0-1-1h-3M20 16v3a1 1 0 0 1-1 1h-3M4 12h16" strokeWidth="2"/></>}/>;
const IconSpark    = (p) => <Icon {...p} path={<><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></>} fill="currentColor"/>;
const IconWrench   = (p) => <Icon {...p} path={<><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-6-6 8-8 1.7-1.7z"/></>}/>;
const IconTruck    = (p) => <Icon {...p} path={<><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></>}/>;
const IconTag      = (p) => <Icon {...p} path={<><path d="M3 12l9-9h8v8l-9 9-8-8z"/><circle cx="15" cy="9" r="1.5"/></>}/>;
const IconBookmark = (p) => <Icon {...p} path={<><path d="M6 3h12v18l-6-4-6 4V3z"/></>}/>;
const IconX        = (p) => <Icon {...p} path={<><path d="M6 6l12 12M18 6L6 18"/></>}/>;
const IconSliders  = (p) => <Icon {...p} path={<><path d="M4 6h10M4 12h4M4 18h14"/><circle cx="17" cy="6" r="2"/><circle cx="11" cy="12" r="2"/><circle cx="19" cy="18" r="2"/></>}/>;

Object.assign(window, {
  IconSearch, IconCar, IconBox, IconChat, IconChart, IconCart, IconUser, IconHome,
  IconPlus, IconMinus, IconCheck, IconChevR, IconChevL, IconChevD, IconFilter,
  IconBell, IconSend, IconClock, IconDoc, IconScan, IconSpark, IconWrench,
  IconTruck, IconTag, IconBookmark, IconX, IconSliders,
});
