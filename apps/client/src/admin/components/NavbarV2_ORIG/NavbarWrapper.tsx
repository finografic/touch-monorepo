import Navbar from 'admin/components/NavbarV2/Navbar';
import { styles } from 'admin/components/NavbarV2/NavbarWrapper.styles';

export default function NavbarWrapper() {
  const NAV_ITEMS = [
    'Dashboard',
    'Projects',
    'Teams',
    'Calendar',
    'Messages',
    'Analytics',
    'Reports',
    'Settings',
    'Billing',
    'Support',
    'Profile',
  ];

  return (
    <div css={styles}>
      <Navbar items={NAV_ITEMS} />
    </div>
  );
}
